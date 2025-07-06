import { Notice } from "obsidian";
import { t } from "src/lang/helpers";
import { NocoDBTable } from "src/types";
import { NocoDBSync } from "./nocodb-sync";

export class ObSyncer {
	app: any;
	vault: any;
	nocoDBSyncer: NocoDBSync;

	constructor(app: any, nocoDBSyncer: NocoDBSync) {
		this.app = app;
		this.vault = app.vault;
		this.nocoDBSyncer = nocoDBSyncer;
	}

	async onlyFetchFromNocoDB(
		sourceTable: NocoDBTable,
		iotoUpdate: boolean = false,
		updateAPIKeyIsValid: boolean = false
	): Promise<string | undefined> {
		if (iotoUpdate) {
			if (!updateAPIKeyIsValid) {
				new Notice(
					this.buildFragment(
						t("Your API Key was expired. Please get a new one."),
						"#ff0000"
					),
					4000
				);
				return;
			}
		}
		await this.nocoDBSyncer.createOrUpdateNotesInOBFromSourceTable(
			sourceTable
		);
	}

	buildFragment(content: string, color: string): DocumentFragment {
		const fragment = document.createDocumentFragment();
		const div = document.createElement("div");
		div.textContent = content;
		div.style.color = color;
		fragment.appendChild(div);
		return fragment;
	}
}
