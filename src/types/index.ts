// 扩展 App 类型以包含 commands 属性
declare module "obsidian" {
	interface App {
		commands: {
			executeCommandById(id: string): void;
		};
		plugins: {
			plugins: {
				[key: string]: any;
			};
		};
	}
}

export interface AirtableIds {
	baseId: string;
	tableId: string;
	viewId: string;
}

export interface OBSyncWithMDBSettings {
	updateAPIKey: string;
	updateAPIKeyIsValid: boolean;
	templaterScriptsFolder: string;
	userSyncHelpDocsFolder: string;
	obSyncRunningLanguage: string;
	demoFolder: string;
	userEmail: string;
	userChecked: boolean;
	userAPIKey: string;
	userSyncSettingUrl: string;
	userSyncScriptsFolder: string;
	updateIDs: {
		obSyncCore: {
			baseID: string;
			tableID: string;
			viewID: string;
		};
		obSyncAirtable: {
			baseID: string;
			tableID: string;
			viewID: string;
		};
		obSyncVika: {
			baseID: string;
			tableID: string;
			viewID: string;
		};
		obSyncFeishu: {
			baseID: string;
			tableID: string;
			viewID: string;
		};
		obSyncLark: {
			baseID: string;
			tableID: string;
			viewID: string;
		};
		obSyncWPS: {
			baseID: string;
			tableID: string;
			viewID: string;
		};
		obSyncDing: {
			baseID: string;
			tableID: string;
			viewID: string;
		};
		obSyncHelpDocs: {
			baseID: string;
			tableID: string;
			viewID: string;
		};
	};
}

export interface NocoDBTable {
	viewID: string;
	baseID?: string;
	tableID?: string;
	targetFolderPath: string;
	intialSetup?: boolean;
}

export interface NocoDBSettings {
	apiKey: string;
	tables?: NocoDBTable[];
	iotoUpdate?: boolean;
	syncSettings?: {
		recordFieldsNames?: {
			title?: string;
			content?: string;
			subFolder?: string;
			extension?: string;
			updatedIn?: string;
		};
	};
}

export interface RecordFields {
	[key: string]: any;
	Title?: string;
	TitleEN?: string;
	TitleTW?: string;
	MD?: string;
	MDEN?: string;
	MDTW?: string;
	SubFolder?: string;
	SubFolderEN?: string;
	SubFolderTW?: string;
	Extension?: string;
	UpdatedIn?: number;
}

// 为避免与全局 Record 冲突，重命名为 MDBRecord
export interface Record {
	fields: RecordFields;
}

export interface DateFilterOption {
	id: string;
	name: string;
	value: number;
}
