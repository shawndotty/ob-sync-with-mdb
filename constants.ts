// Airtable API 配置常量
export const AIRTABLE_CONFIG = {
	GET_UPDATE_IDS: {
		BASE_ID: "appxQqkHaEkjUQnBf",
		TABLE_NAME: "EmailSync",
		TOKEN: "patCw7AoXaktNgHNM.bf8eb50a33da820fde56b1f5d4cf5899bc8c508096baf36b700e94cd13570000",
		FIELDS: {
			OB_SYNC_UPDATE_IDS: "ObSyncUpdateIDs",
		},
	},
	CHECK_API_KEY: {
		WEBHOOK_URL:
			"https://hooks.airtable.com/workflows/v1/genericWebhook/appq9k6KwHV3lEIJZ/wfl2uT25IPEljno9w/wtrFUIEC8SXlDsdIu",
		BASE_ID: "appq9k6KwHV3lEIJZ",
		TABLE_NAME: "UpdateLogs",
		VIEW_ID: "viweTQ2YarquoqZUT",
		TOKEN: "patCw7AoXaktNgHNM.bf8eb50a33da820fde56b1f5d4cf5899bc8c508096baf36b700e94cd13570000",
		FIELDS: {
			UUID: "UUID",
			MATCH: "Match",
		},
	},
};

// 默认的 updateIDs 结构
export const DEFAULT_UPDATE_IDS = {
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
};
