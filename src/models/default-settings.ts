import { OBSyncWithMDBSettings } from "src/types";

export const DEFAULT_SETTINGS: OBSyncWithMDBSettings = {
	updateAPIKey: "",
	updateAPIKeyIsValid: false,
	templaterScriptsFolder: "",
	obSyncHelpDocsFolder: "",
	obSyncRunningLanguage: "ob",
	templaterTemplatesFolder: "",
	userEmail: "",
	userChecked: false,
	userAPIKey: "",
	userSyncSettingUrl: "",
	userSyncScriptsFolder: "",
	useUserTemplate: true,
	userTemplatePrefix: "My",
	updateIDs: {
		obSyncCore: {
			baseID: "",
			tableID: "",
			viewID: "",
		},
		obSyncAirtable: {
			baseID: "",
			tableID: "",
			viewID: "",
		},
		obSyncVika: {
			baseID: "",
			tableID: "",
			viewID: "",
		},
		obSyncFeishu: {
			baseID: "",
			tableID: "",
			viewID: "",
		},
		obSyncLark: {
			baseID: "",
			tableID: "",
			viewID: "",
		},
		obSyncWPS: {
			baseID: "",
			tableID: "",
			viewID: "",
		},
		obSyncDing: {
			baseID: "",
			tableID: "",
			viewID: "",
		},
		obSyncHelpDocs: {
			baseID: "",
			tableID: "",
			viewID: "",
		},
	},
	airtableAPIKeyForSync: "",
	airtableBaseIDForSync: "",
	airtableTableIDForSync: "",

	airtableAPIKeyForFetch: "",
	airtableBaseIDForFetch: "",
	airtableTableIDForFetch: "",

	vikaAPIKeyForSync: "",
	vikaTableIDForSync: "",

	vikaAPIKeyForFetch: "",
	vikaTableIDForFetch: "",

	feishuAppIDForSync: "",
	feishuAppSecretForSync: "",
	feishuBaseIDForSync: "",
	feishuTableIDForSync: "",

	feishuAppIDForFetch: "",
	feishuAppSecretForFetch: "",
	feishuBaseIDForFetch: "",
	feishuTableIDForFetch: "",

	larkAppIDForSync: "",
	larkAppSecretForSync: "",
	larkBaseIDForSync: "",
	larkTableIDForSync: "",

	larkAppIDForFetch: "",
	larkAppSecretForFetch: "",
	larkBaseIDForFetch: "",
	larkTableIDForFetch: "",

	dingAppIDForSync: "",
	dingAppSecretForSync: "",
	dingBaseIDForSync: "",
	dingTableIDForSync: "",
	dingViewIDForSync: "",
	dingUserIDForSync: "",

	dingAppIDForFetch: "",
	dingAppSecretForFetch: "",
	dingBaseIDForFetch: "",
	dingTableIDForFetch: "",
	dingViewIDForFetch: "",
	dingUserIDForFetch: "",

	wpsAppIDForSync: "",
	wpsAppSecretForSync: "",
	wpsBaseIDForSync: "",
	wpsTableIDForSync: "",
	wpsUserTokenForSync: "",

	wpsAppIDForFetch: "",
	wpsAppSecretForFetch: "",
	wpsBaseIDForFetch: "",
	wpsTableIDForFetch: "",
	wpsViewIDForFetch: "",
	wpsUserTokenForFetch: "",
};

export const DEFAULT_UPDATE_IDS = {
	obSyncCore: {
		baseID: "",
		tableID: "",
		viewID: "",
	},
	obSyncAirtable: {
		baseID: "",
		tableID: "",
		viewID: "",
	},
	obSyncVika: {
		baseID: "",
		tableID: "",
		viewID: "",
	},
	obSyncFeishu: {
		baseID: "",
		tableID: "",
		viewID: "",
	},
	obSyncLark: {
		baseID: "",
		tableID: "",
		viewID: "",
	},
	obSyncWPS: {
		baseID: "",
		tableID: "",
		viewID: "",
	},
	obSyncDing: {
		baseID: "",
		tableID: "",
		viewID: "",
	},
};
