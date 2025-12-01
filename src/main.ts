import { Plugin } from "obsidian";
import { OBSyncWithMDBSettings } from "./types";
import { OBSyncWithMDBSettingTab } from "./ui/settings-tab";
import { DEFAULT_SETTINGS } from "./models/default-settings";
import { CommandService } from "./services/command-service";
import { TemplaterService } from "./services/templater-service";
import { ApiService } from "./services/api-service";
import { SettingsManager } from "./models/settings";
import { ServiceContainer } from "./services/service-container";

export default class OBSyncWithMDB extends Plugin {
	settings: OBSyncWithMDBSettings;
	private settingsManager: SettingsManager;
	private templaterService: TemplaterService;
	private apiService: ApiService;
	private commandService: CommandService;
	private services: ServiceContainer;
	async onload() {
		this.services = new ServiceContainer(this);
		this.settingsManager = this.services.settingsManager;

		await this.loadSettings();

		this.apiService = this.services.apiService;
		this.templaterService = this.services.templaterService;
		this.commandService = this.services.commandService;

		this.commandService.registerCommands();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new OBSyncWithMDBSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = await this.settingsManager.load();
	}

	async saveSettings() {
		this.settingsManager.update(this.settings);
		await this.settingsManager.save();
	}
}

declare function requestUrl(options: any): Promise<any>;
