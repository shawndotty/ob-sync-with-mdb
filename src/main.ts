import { Notice, Plugin } from "obsidian";
import { t } from "./src/lang/helpers";
import { AirtableIds, OBSyncWithMDBSettings } from "./src/types";
import { DEFAULT_SETTINGS, OBSyncWithMDBSettingTab } from "./src/settings";
import { MyNocoDB } from "./src/MyNocoDB";
import { MyObsidian } from "./src/MyObsidian";
import { NocoDBSync } from "./src/NocoDBSync";
import { isValidApiKey, isValidEmail, extractAirtableIds } from "./src/utils";

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
		const commands = [
			{
				id: "ob-sync-with-mdb-update-core",
				name: t("Get The Latest Version Of Sync Scripts"),
				tableConfig: {
					baseID: this.settings.updateIDs.obSyncCore.baseID,
					tableID: this.settings.updateIDs.obSyncCore.tableID,
					viewID: this.settings.updateIDs.obSyncCore.viewID,
					targetFolderPath: this.settings.templaterScriptsFolder,
				},
				iotoUpdate: true,
				reloadOB: false,
				apiKey: this.settings.updateAPIKey,
			},
			{
				id: "ob-sync-with-mdb-update-demo",
				name: t("Get The Latest Version Of Demo Sync Templates"),
				tableConfig: {
					baseID: this.settings.updateIDs.demoTemplates.baseID,
					tableID: this.settings.updateIDs.demoTemplates.tableID,
					viewID: this.settings.updateIDs.demoTemplates.viewID,
					targetFolderPath: this.settings.demoFolder,
				},
				iotoUpdate: false,
				reloadOB: false,
				apiKey: this.settings.updateAPIKey,
			},
			{
				id: "ob-sync-with-mdb-update-user-sync-scripts",
				name: t("Get Your Personal Sync Templates"),
				tableConfig: {
					baseID: this.userSyncSettingAirtableIds?.baseId || "",
					tableID: this.userSyncSettingAirtableIds?.tableId || "",
					viewID: this.userSyncSettingAirtableIds?.viewId || "",
					targetFolderPath: this.settings.userSyncScriptsFolder,
				},
				iotoUpdate: false,
				reloadOB: false,
				apiKey: this.settings.userAPIKey,
			},
		];

		commands.forEach((cmd) => {
			this.addCommand({
				id: cmd.id,
				name: cmd.name,
				callback: async () => {
					if (!cmd.apiKey) {
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
						apiKey: cmd.apiKey,
						tables: [cmd.tableConfig],
					};
					const myNocoDB = new MyNocoDB(nocoDBSettings);
					const nocoDBSync = new NocoDBSync(myNocoDB, this.app);
					const myObsidian = new MyObsidian(this.app, nocoDBSync);
					await myObsidian.onlyFetchFromNocoDB(
						nocoDBSettings.tables[0],
						cmd.iotoUpdate,
						this.settings.updateAPIKeyIsValid
					);
					if (cmd.reloadOB) {
						this.app.commands.executeCommandById("app:reload");
					}
				},
			});
		});

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
