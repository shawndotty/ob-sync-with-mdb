import { App } from "obsidian";
import { OBSyncWithMDBSettings } from "../types";
import { DEFAULT_SETTINGS } from "./default-settings";

export class SettingsManager {
	private settings: OBSyncWithMDBSettings;

	constructor(
		private loadData: () => Promise<any>,
		private saveData: (data: any) => Promise<void>,
		private app: App
	) {
		this.settings = Object.assign({}, DEFAULT_SETTINGS);
	}

	async load() {
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
		return this.settings;
	}

	async save() {
		await this.saveData(this.settings);
	}

	get() {
		return this.settings;
	}

	update(settings: Partial<OBSyncWithMDBSettings>) {
		this.settings = { ...this.settings, ...settings };
	}
}
