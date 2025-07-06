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
		demoTemplates: {
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
		};
	};
}

export interface RecordFields {
	[key: string]: any;
	Title?: string;
	MD?: string;
	SubFolder?: string;
	Extension?: string;
}

// 为避免与全局 Record 冲突，重命名为 MDBRecord
export interface MDBRecord {
	fields: RecordFields;
}

export declare function requestUrl(options: any): Promise<any>;
