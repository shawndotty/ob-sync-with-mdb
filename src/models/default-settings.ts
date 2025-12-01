import { OBSyncWithMDBSettings } from "src/types";

export const DEFAULT_SETTINGS: OBSyncWithMDBSettings = {
	updateAPIKey: "",
	updateAPIKeyIsValid: false,
	templaterScriptsFolder: "",
	userSyncHelpDocsFolder: "",
	obSyncRunningLanguage: "ob",
	demoFolder: "",
	userEmail: "",
	userChecked: false,
	userAPIKey: "",
	userSyncSettingUrl: "",
	userSyncScriptsFolder: "",
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
