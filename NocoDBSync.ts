import { Notice, normalizePath } from "obsidian";
import { t } from "./lang/helpers";
import { NocoDBTable, RecordFields, MDBRecord } from "./types";
import { MyNocoDB } from "./MyNocoDB";

export class NocoDBSync {
	nocodb: MyNocoDB;
	app: any;
	vault: any;
	notesToCreate: any[];
	notesToUpdate: any[];
	fetchTitleFrom: string;
	fetchContentFrom: string;
	subFolder: string;
	extension: string;

	constructor(nocodb: MyNocoDB, app: any) {
		this.nocodb = nocodb;
		this.app = app;
		this.vault = app.vault;
		this.notesToCreate = [];
		this.notesToUpdate = [];
		this.fetchTitleFrom = this.nocodb.recordFieldsNames.title;
		this.fetchContentFrom = this.nocodb.recordFieldsNames.content;
		this.subFolder = this.nocodb.recordFieldsNames.subFolder;
		this.extension = this.nocodb.recordFieldsNames.extension;
	}

	getFetchSourceTable(sourceViewID: string): NocoDBTable | undefined {
		// @ts-ignore
		return this.nocodb.tables
			.filter((table) => sourceViewID == table.viewID)
			.first();
	}

	async fetchRecordsFromSource(sourceTable: NocoDBTable): Promise<any[]> {
		const fields = [
			this.fetchTitleFrom,
			this.fetchContentFrom,
			this.subFolder,
			this.extension,
		];

		let url = `${this.nocodb.makeApiUrl(sourceTable)}?view=${
			sourceTable.viewID
		}&${fields
			.map((f) => `fields%5B%5D=${encodeURIComponent(f)}`)
			.join("&")}&offset=`;

		let records = await this.getAllRecordsFromTable(url);

		return records;
	}

	async getAllRecordsFromTable(url: string): Promise<any[]> {
		let records: any[] = [];
		let offset = "";

		do {
			try {
				const response = await fetch(url + offset, {
					method: "GET",
					headers: {
						Authorization: "Bearer " + this.nocodb.apiKey,
					},
				});
				const responseData = await response.json();
				const responseObj = { json: responseData };

				const data = responseObj.json;
				records = records.concat(data.records);
				new Notice(`${t("Got")} ${records.length} ${t("records")}`);

				offset = data.offset || "";
			} catch (error) {
				console.dir(error);
			}
		} while (offset !== "");

		return records;
	}

	convertToValidFileName(fileName: string): string {
		return fileName.replace(/[\/|\\:'"()（）{}<>\.\*]/g, "-").trim();
	}

	async createPathIfNeeded(folderPath: string): Promise<void> {
		const { vault } = this.app;
		const directoryExists = await vault.exists(folderPath);
		if (!directoryExists) {
			await vault.createFolder(normalizePath(folderPath));
		}
	}

	async createOrUpdateNotesInOBFromSourceTable(
		sourceTable: NocoDBTable
	): Promise<void> {
		new Notice(t("Getting Data ……"));

		const { vault } = this.app;

		const directoryRootPath = sourceTable.targetFolderPath;

		let notesToCreateOrUpdate: RecordFields[] = (
			await this.fetchRecordsFromSource(sourceTable)
		).map((note: MDBRecord) => note.fields);

		new Notice(
			`${t("There are")} ${notesToCreateOrUpdate.length} ${t(
				"files needed to be updated or created."
			)}`
		);

		let configDirModified = 0;

		while (notesToCreateOrUpdate.length > 0) {
			let toDealNotes = notesToCreateOrUpdate.slice(0, 10);
			for (let note of toDealNotes) {
				let validFileName = this.convertToValidFileName(
					note.Title || ""
				);
				let folderPath =
					directoryRootPath +
					(note.SubFolder ? `/${note.SubFolder}` : "");
				await this.createPathIfNeeded(folderPath);
				const noteExtension =
					"Extension" in note ? note.Extension : "md";
				const notePath = `${folderPath}/${validFileName}.${noteExtension}`;
				const noteExists = await vault.exists(notePath);
				if (!noteExists) {
					await vault.create(notePath, note.MD ? note.MD : "");
				} else if (noteExists && notePath.startsWith(".")) {
					await vault.adapter
						.write(notePath, note.MD)
						.catch((r: any) => {
							new Notice(t("Failed to write file: ") + r);
						});
					configDirModified++;
				} else {
					let file = this.app.vault.getFileByPath(notePath);
					await vault.modify(file, note.MD ? note.MD : "");
					await new Promise((r) => setTimeout(r, 100)); // 等待元数据更新
				}
			}

			notesToCreateOrUpdate = notesToCreateOrUpdate.slice(10);
			if (notesToCreateOrUpdate.length) {
				new Notice(
					`${t("There are")} ${notesToCreateOrUpdate.length} ${t(
						"files needed to be processed."
					)}`
				);
			} else {
				new Notice(t("All Finished."));
			}
		}
	}
}
