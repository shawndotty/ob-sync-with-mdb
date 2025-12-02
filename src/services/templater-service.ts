import { App, Notice } from "obsidian";
import { PluginService } from "./plugin-service";
import { t } from "../lang/helpers";

interface TemplaterPlugin {
	settings: {
		templates_folder?: string;
		user_scripts_folder?: string;
		enabled_templates_hotkeys?: string[];
		[key: string]: any;
	};
	save_settings: () => Promise<void>;
}

export class TemplaterService extends PluginService {
	constructor(app: App) {
		super(app, "templater-obsidian");
	}

	async setTemplaterSetting(settingName: string, value: any) {
		const templater = this.getPlugin();
		if (templater) {
			templater.settings[settingName] = value;
			await templater.save_settings();
			if ("trigger_on_file_creation" === settingName) {
				await templater.event_handler.update_trigger_file_on_creation();
			}
		}
	}

	private getTemplater(): TemplaterPlugin | null {
		// 获取Templater插件实例
		const templater = this.getPlugin() as TemplaterPlugin | undefined;

		if (!templater) {
			new Notice(t("Templater plugin not found or not enabled"));
			return null;
		}

		// 获取当前配置
		return templater;
	}

	async addTemplaterHotkeys(templatePaths: Array<string> = []) {
		// 获取当前配置
		const templater = this.getTemplater();
		if (!templater) return false;
		const currentSettings = templater.settings || {};

		// 初始化enabled_templates_hotkeys数组（如果不存在）
		if (!Array.isArray(currentSettings.enabled_templates_hotkeys)) {
			currentSettings.enabled_templates_hotkeys = [];
		}

		// 添加不存在的模板路径
		let addedCount = 0;
		for (const templatePath of templatePaths) {
			if (
				!currentSettings.enabled_templates_hotkeys.includes(
					templatePath
				)
			) {
				currentSettings.enabled_templates_hotkeys.push(templatePath);
				addedCount++;
			}
		}

		if (addedCount > 0) {
			// 保存设置
			await templater.save_settings();
			new Notice(
				`${t("Added")} ${addedCount} ${t(
					"template(s) to Templater hotkeys"
				)}`
			);
		} else {
			new Notice(t("All templates already exist in Templater hotkeys"));
		}
	}
}
