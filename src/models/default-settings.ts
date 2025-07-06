import { OBSyncWithMDBSettings } from "src/types";

export const DEFAULT_SETTINGS: OBSyncWithMDBSettings = {
	updateAPIKey: "",
	updateAPIKeyIsValid: false,
	templaterScriptsFolder: "",
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
		demoTemplates: {
			baseID: "",
			tableID: "",
			viewID: "",
		},
	},
};
