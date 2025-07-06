import {
	PluginSettingTab,
	Setting,
	App,
	normalizePath,
	Notice,
} from "obsidian";
import { t } from "./lang/helpers";
import { OBSyncWithMDBSettings } from "./types";
import { ApiService } from "./api";
import { isValidApiKey, isValidEmail } from "./utils";

// 默认设置
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

export class OBSyncWithMDBSettingTab extends PluginSettingTab {
	plugin: any;

	constructor(app: App, plugin: any) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: t("Main Setting"),
			cls: "my-plugin-title", // 添加自定义CSS类
		});

		new Setting(containerEl)
			.setName(t("Sync Scripts Update API Key"))
			.setDesc(t("Please enter a valid update API Key"))
			.addText((text) => {
				const validSpan = createEl("span", {
					text: t("Valid API Key"),
					cls: "valid-text",
				});
				const loadingSpan = createEl("span", {
					text: t("Validating..."),
					cls: "loading-text",
				});
				validSpan.style.display = "none";
				loadingSpan.style.display = "none";
				text.inputEl.parentElement?.insertBefore(
					validSpan,
					text.inputEl
				);
				text.inputEl.parentElement?.insertBefore(
					loadingSpan,
					text.inputEl
				);

				const updateValidState = (
					isValid: boolean,
					isLoading: boolean = false
				) => {
					if (isLoading) {
						text.inputEl.removeClass("valid-api-key");
						text.inputEl.removeClass("invalid-api-key");
						validSpan.style.display = "none";
						loadingSpan.style.display = "inline";
					} else {
						loadingSpan.style.display = "none";
						if (isValid) {
							text.inputEl.removeClass("invalid-api-key");
							text.inputEl.addClass("valid-api-key");
							text.inputEl.style.borderColor = "#4CAF50";
							text.inputEl.style.color = "#4CAF50";
							validSpan.style.display = "inline";
						} else {
							text.inputEl.removeClass("valid-api-key");
							text.inputEl.addClass("invalid-api-key");
							text.inputEl.style.borderColor = "#FF5252";
							text.inputEl.style.color = "#FF5252";
							validSpan.style.display = "none";
						}
					}
				};

				// 初始状态设置
				updateValidState(this.plugin.settings.updateAPIKeyIsValid);
				return text
					.setPlaceholder(t("Enter the API Key"))
					.setValue(this.plugin.settings.updateAPIKey)
					.onChange(async (value) => {
						this.plugin.settings.updateAPIKey = value;
						if (isValidApiKey(value)) {
							updateValidState(false, true); // 显示加载状态
							await new ApiService(
								this.plugin.settings
							).checkApiKey();
							updateValidState(
								this.plugin.settings.updateAPIKeyIsValid
							);
						} else {
							updateValidState(false);
						}
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(t("Your Email Address"))
			.setDesc(
				t(
					"Please enter the email you provided when you purchase this product"
				)
			)
			.addText((text) => {
				const validSpan = createEl("span", {
					text: t("Valid Email"),
					cls: "valid-text",
				});
				const loadingSpan = createEl("span", {
					text: t("Validating..."),
					cls: "loading-text",
				});
				validSpan.style.display = "none";
				loadingSpan.style.display = "none";
				text.inputEl.parentElement?.insertBefore(
					validSpan,
					text.inputEl
				);
				text.inputEl.parentElement?.insertBefore(
					loadingSpan,
					text.inputEl
				);

				const updateValidState = (
					isValid: boolean,
					isLoading: boolean = false
				) => {
					if (isLoading) {
						text.inputEl.removeClass("valid-email");
						text.inputEl.removeClass("invalid-email");
						validSpan.style.display = "none";
						loadingSpan.style.display = "inline";
					} else {
						loadingSpan.style.display = "none";
						if (isValid) {
							text.inputEl.removeClass("invalid-email");
							text.inputEl.addClass("valid-email");
							text.inputEl.style.borderColor = "#4CAF50";
							text.inputEl.style.color = "#4CAF50";
							validSpan.style.display = "inline";
						} else {
							text.inputEl.removeClass("valid-email");
							text.inputEl.addClass("invalid-email");
							text.inputEl.style.borderColor = "#FF5252";
							text.inputEl.style.color = "#FF5252";
							validSpan.style.display = "none";
						}
					}
				};

				// 初始状态设置
				updateValidState(this.plugin.settings.userChecked);
				return text
					.setPlaceholder(t("Enter your email"))
					.setValue(this.plugin.settings.userEmail)
					.onChange(async (value) => {
						this.plugin.settings.userEmail = value;
						if (isValidEmail(value)) {
							updateValidState(false, true);
							await new ApiService(
								this.plugin.settings
							).getUpdateIDs();
							updateValidState(this.plugin.settings.userChecked);
						} else {
							updateValidState(false);
						}
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(t("Sync Scripts Folder"))
			.setDesc(t("Please enter the path to the Templater Scripts Folder"))
			.addText((text) =>
				text
					.setPlaceholder(
						t("Enter the full path to the Templater Scripts folder")
					)
					.setValue(this.plugin.settings.templaterScriptsFolder)
					.onChange(async (value) => {
						this.plugin.settings.templaterScriptsFolder = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t("Demo Sync templates Folder"))
			.setDesc(
				t("Please enter the path to the demo sync templates folder")
			)
			.addText((text) =>
				text
					.setPlaceholder(
						t("Enter the path to the demo sync templates folder")
					)
					.setValue(this.plugin.settings.demoFolder)
					.onChange(async (value) => {
						this.plugin.settings.demoFolder = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h2", {
			text: t("User Setting"),
			cls: "my-plugin-title", // 添加自定义CSS类
		});

		new Setting(containerEl)
			.setName(t("Your Airtable Personal Token"))
			.setDesc(
				t(
					"Please enter your personal Aritable token for your sync setting base"
				)
			)
			.addText((text) =>
				text
					.setPlaceholder(t("Enter your personal Airtble token"))
					.setValue(this.plugin.settings.userAPIKey)
					.onChange(async (value) => {
						this.plugin.settings.userAPIKey = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t("Your Sync Setting URL"))
			.setDesc(t("Please enter the url of your sync setting table"))
			.addText((text) =>
				text
					.setPlaceholder(t("Enter the url"))
					.setValue(this.plugin.settings.userSyncSettingUrl)
					.onChange(async (value) => {
						this.plugin.settings.userSyncSettingUrl = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t("Your Sync Templates Folder"))
			.setDesc(t("Please enter the path to your sync templates folder"))
			.addText((text) =>
				text
					.setPlaceholder(
						t("Enter the path to your sync templates folder")
					)
					.setValue(this.plugin.settings.userSyncScriptsFolder)
					.onChange(async (value) => {
						this.plugin.settings.userSyncScriptsFolder = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("hr");

		const infoContainer = containerEl.createDiv();

		infoContainer.createEl("p", {
			text: t(
				"When you use the sync with online database feature of IOTO, the sync configration generater I built could help you a lot."
			),
		});

		infoContainer.createEl("p", {
			text: t(
				"You can use the following link to open the shared base and save it to your own Airtable workspace."
			),
		});

		const baseLink = infoContainer.createEl("a", {
			text: t("Sync Configration Generator"),
			href: "https://airtable.com/appekNvvdLY7J8zsq/shrpqtEGVjz8bgw9N",
		});
		baseLink.setAttr("target", "_blank");
		baseLink.setAttr("rel", "noopener noreferrer");

		infoContainer.createEl("p", {
			text: t(
				"In order to help you to learn how to use the sync with online database feature, I will keep posting instructions and videos to the following link."
			),
		});

		const deomLink = infoContainer.createEl("a", {
			text: t("OB Sync With MDB How To Guide"),
			href: "https://airtable.com/appKL3zMp0cOYFdJk/shrzUryNakRvHerqD",
		});

		deomLink.setAttr("target", "_blank");
		deomLink.setAttr("rel", "noopener noreferrer");
	}
}
