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
		dom: {
			appContainerEl: HTMLElement;
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
	obSyncHelpDocsFolder: string;
	obSyncRunningLanguage: string;
	templaterTemplatesFolder: string;
	userEmail: string;
	userChecked: boolean;
	userAPIKey: string;
	userSyncSettingUrl: string;
	userSyncScriptsFolder: string;
	useUserTemplate: boolean;
	userTemplatePrefix: string;
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
	// Sync Settings
	airtableAPIKeyForSync: string;
	airtableBaseIDForSync: string;
	airtableTableIDForSync: string;

	airtableAPIKeyForFetch: string;
	airtableBaseIDForFetch: string;
	airtableTableIDForFetch: string;

	vikaAPIKeyForSync: string;
	vikaTableIDForSync: string;

	vikaAPIKeyForFetch: string;
	vikaTableIDForFetch: string;

	feishuAppIDForSync: string;
	feishuAppSecretForSync: string;
	feishuBaseIDForSync: string;
	feishuTableIDForSync: string;

	feishuAppIDForFetch: string;
	feishuAppSecretForFetch: string;
	feishuBaseIDForFetch: string;
	feishuTableIDForFetch: string;

	larkAppIDForSync: string;
	larkAppSecretForSync: string;
	larkBaseIDForSync: string;
	larkTableIDForSync: string;

	larkAppIDForFetch: string;
	larkAppSecretForFetch: string;
	larkBaseIDForFetch: string;
	larkTableIDForFetch: string;

	dingAppIDForSync: string;
	dingAppSecretForSync: string;
	dingBaseIDForSync: string;
	dingTableIDForSync: string;
	dingViewIDForSync: string;
	dingUserIDForSync: string;

	dingAppIDForFetch: string;
	dingAppSecretForFetch: string;
	dingBaseIDForFetch: string;
	dingTableIDForFetch: string;
	dingViewIDForFetch: string;
	dingUserIDForFetch: string;

	wpsAppIDForSync: string;
	wpsAppSecretForSync: string;
	wpsBaseIDForSync: string;
	wpsTableIDForSync: string;
	wpsUserTokenForSync: string;

	wpsAppIDForFetch: string;
	wpsAppSecretForFetch: string;
	wpsBaseIDForFetch: string;
	wpsTableIDForFetch: string;
	wpsViewIDForFetch: string;
	wpsUserTokenForFetch: string;
}

export interface NocoDBTable {
	viewID: string;
	baseID?: string;
	tableID?: string;
	targetFolderPath: string;
	targetFolderPathForTemplates?: string;
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
	MDForOBSync?: string;
	MDForOBSyncEN?: string;
	MDForOBSyncTW?: string;
	SubFolderForOBSync?: string;
	SubFolderForOBSyncEN?: string;
	SubFolderForOBSyncTW?: string;
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

export interface ThirdPartyServiceConfig {
	serviceName: string;
	serviceType: string;
	apiKeySetting: string;
	apiKeyHint: string;
	baseIdSetting?: string;
	baseIdHint?: string;
	tableIdSetting: string;
	tableIdHint: string;
	appSecretSetting?: string;
	appSecretHint?: string;
	baseUrl: string;
	templateUrl: string;
	yourTableText: string;
	templateText: string;
	viewIdSetting?: string;
	viewIdHint?: string;
	userIDSetting?: string;
	userIDHint?: string;
	userTokenSetting?: string;
	userTokenHint?: string;
	apiExplorerUrl?: string;
	apiExplorerHint?: string;
}

export interface SettingConfig {
	name: string;
	desc: string;
	placeholder?: string;
	value: any;
	onChange: (value: any) => Promise<void>;
}
