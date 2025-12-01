import { NocoDBTable, NocoDBSettings } from "src/types";

export class NocoDB {
	apiKey: string;
	tables: NocoDBTable[];
	apiUrlRoot: string;
	iotoUpdate: boolean;
	recordFieldsNames: {
		title: string;
		content: string;
		subFolder: string;
		extension: string;
		[key: string]: string;
	};

	constructor(nocoDBSettings: NocoDBSettings) {
		this.apiKey = nocoDBSettings.apiKey;
		this.tables = nocoDBSettings.tables || [];
		this.apiUrlRoot = "https://api.airtable.com/v0/";
		this.iotoUpdate = nocoDBSettings.iotoUpdate || false;
		this.recordFieldsNames = {
			...{
				title: "Title",
				content: "MDForOBSync",
				subFolder: "SubFolderForOBSync",
				extension: "Extension",
			},
			...(nocoDBSettings.syncSettings?.recordFieldsNames || {}),
		};
	}

	makeApiUrl(sourceTable: NocoDBTable): string {
		return `${this.apiUrlRoot}${sourceTable.baseID}/${sourceTable.tableID}`;
	}
}
