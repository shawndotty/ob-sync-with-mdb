import { Notice, Plugin } from "obsidian";
import { t } from "./lang/helpers";
import { AirtableIds, OBSyncWithMDBSettings } from "./types";
import { DEFAULT_SETTINGS, OBSyncWithMDBSettingTab } from "./settings";
import { MyNocoDB } from "./MyNocoDB";
import { MyObsidian } from "./MyObsidian";
import { NocoDBSync } from "./NocoDBSync";
import { isValidApiKey, isValidEmail, extractAirtableIds } from "./utils";

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

export default class OBSyncWithMDB extends Plugin {
	settings: OBSyncWithMDBSettings;
	userSyncSettingAirtableIds: AirtableIds | null;

	async onload() {
		await this.loadSettings();

		this.userSyncSettingAirtableIds = extractAirtableIds(
			this.settings.userSyncSettingUrl
		);
		// 优化后的 addCommand 方法，减少重复代码，提升可维护性
		const createNocoDBCommand = (
			id: string,
			name: string,
			tableConfig: {
				viewID: string;
				targetFolderPath: string;
				baseID?: string;
				tableID?: string;
			},
			iotoUpdate: boolean = false,
			reloadOB: boolean = false,
			apiKey: string = this.settings.updateAPIKey
		) => {
			this.addCommand({
				id,
				name,
				callback: async () => {
					if (!apiKey) {
						new Notice(
							t("You must provide an API Key to run this command")
						);
						return;
					}
					if (!this.settings.userEmail) {
						new Notice(
							t(
								"You need to provide the email for your account to run this command"
							)
						);
						return;
					}
					const nocoDBSettings = {
						apiKey: apiKey,
						tables: [tableConfig],
					};
					const myNocoDB = new MyNocoDB(nocoDBSettings);
					const nocoDBSync = new NocoDBSync(myNocoDB, this.app);
					const myObsidian = new MyObsidian(this.app, nocoDBSync);
					await myObsidian.onlyFetchFromNocoDB(
						nocoDBSettings.tables[0],
						iotoUpdate,
						this.settings.updateAPIKeyIsValid
					);
					if (reloadOB) {
						this.app.commands.executeCommandById("app:reload");
					}
				},
			});
		};

		createNocoDBCommand(
			"ob-sync-with-mdb-update-core",
			t("Get The Latest Version Of Sync Scripts"),
			{
				baseID: this.settings.updateIDs.obSyncCore.baseID,
				tableID: this.settings.updateIDs.obSyncCore.tableID,
				viewID: this.settings.updateIDs.obSyncCore.viewID,
				targetFolderPath: this.settings.templaterScriptsFolder,
			},
			true
		);

		createNocoDBCommand(
			"ob-sync-with-mdb-update-demo",
			t("Get The Latest Version Of Demo Sync Templates"),
			{
				baseID: this.settings.updateIDs.demoTemplates.baseID,
				tableID: this.settings.updateIDs.demoTemplates.tableID,
				viewID: this.settings.updateIDs.demoTemplates.viewID,
				targetFolderPath: this.settings.demoFolder,
			}
		);

		createNocoDBCommand(
			"ob-sync-with-mdb-update-user-sync-scripts",
			t("Get Your Personal Sync Templates"),
			{
				baseID: this.userSyncSettingAirtableIds?.baseId || "",
				tableID: this.userSyncSettingAirtableIds?.tableId || "",
				viewID: this.userSyncSettingAirtableIds?.viewId || "",
				targetFolderPath: this.settings.userSyncScriptsFolder,
			},
			false,
			false,
			this.settings.userAPIKey
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new OBSyncWithMDBSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		const templaterSettings =
			this.app.plugins.plugins["templater-obsidian"];
		let pathSettings = {};
		if (templaterSettings) {
			pathSettings = {
				templaterScriptsFolder:
					templaterSettings.settings.user_scripts_folder,
				userSyncScriptsFolder:
					templaterSettings.settings.templates_folder,
				demoFolder: templaterSettings.settings.templates_folder,
			};
		}
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			pathSettings,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

declare function requestUrl(options: any): Promise<any>;
