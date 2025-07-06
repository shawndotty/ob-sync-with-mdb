import { Plugin } from "obsidian";
import { OBSyncWithMDBSettings } from "./types";
import { OBSyncWithMDBSettingTab } from "./ui/settings-tab";
import { DEFAULT_SETTINGS } from "./models/default-settings";
import { CommandService } from "./services/command-service";

export default class OBSyncWithMDB extends Plugin {
	settings: OBSyncWithMDBSettings;
	async onload() {
		await this.loadSettings();

		// 使用 CommandService 注册命令
		const commandService = new CommandService(this, this.settings);
		commandService.registerCommands();

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
