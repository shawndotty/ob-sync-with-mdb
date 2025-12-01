import { PluginSettingTab, Setting, App } from "obsidian";
import { t } from "../lang/helpers";
import { ApiService } from "../services/api-service";
import { Utils } from "../utils";
import { TabbedSettings } from "./tabbed-settings";

// 默认设置

export class OBSyncWithMDBSettingTab extends PluginSettingTab {
	plugin: any;
	private apiService: ApiService;

	constructor(app: App, plugin: any) {
		super(app, plugin);
		this.plugin = plugin;
		this.apiService = new ApiService(this.plugin.settings);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: t("OBSyncWithMDBSetting"),
			cls: "obsyncwithmdb-title", // 添加自定义CSS类
		});

		const tabbedSettings = new TabbedSettings(containerEl);

		const tabConfigs = [
			{
				title: "Main Setting",
				renderMethod: (content: HTMLElement) =>
					this.renderMainSettings(content),
			},
			{
				title: "User Setting",
				renderMethod: (content: HTMLElement) =>
					this.renderUserSettings(content),
			},
			{
				title: "Airtable Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderAirtableSettings(content),
			},
			{
				title: "Vika Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderVikaSettings(content),
			},
			{
				title: "Feishu Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderFeishuSettings(content),
			},
			{
				title: "Lark Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderLarkSettings(content),
			},
			{
				title: "DingTalk Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderDingSettings(content),
			},
			{
				title: "WPS Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderWPSettings(content),
			},
		];

		tabConfigs.forEach((config) => {
			tabbedSettings.addTab(t(config.title as any), config.renderMethod);
		});
	}

	private renderMainSettings(containerEl: HTMLElement): void {
		this.createValidatedInput({
			containerEl,
			name: t("Sync Scripts Update API Key"),
			description: t("Please enter a valid update API Key"),
			placeholder: t("Enter the API Key"),
			reload: false,
			getValue: () => this.plugin.settings.updateAPIKey,
			setValue: (value) => (this.plugin.settings.updateAPIKey = value),
			getIsValid: () => this.plugin.settings.updateAPIKeyIsValid,
			setIsValid: (isValid) =>
				(this.plugin.settings.updateAPIKeyIsValid = isValid),
			localValidator: Utils.isValidApiKey,
			remoteValidator: () => this.apiService.checkApiKey(),
		});

		this.createValidatedInput({
			containerEl,
			name: t("Your Email Address"),
			description: t(
				"Please enter the email you provided when you purchase this product"
			),
			placeholder: t("Enter your email"),
			reload: true,
			getValue: () => this.plugin.settings.userEmail,
			setValue: (value) => (this.plugin.settings.userEmail = value),
			getIsValid: () => this.plugin.settings.userChecked,
			setIsValid: (isValid) =>
				(this.plugin.settings.userChecked = isValid),
			localValidator: Utils.isValidEmail,
			remoteValidator: () => this.apiService.getUpdateIDs(),
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
	}

	private renderUserSettings(containerEl: HTMLElement): void {
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

	private renderAirtableSettings(containerEl: HTMLElement): void {
		// 渲染Airtable设置内容
	}

	private renderFeishuSettings(containerEl: HTMLElement): void {
		// 渲染Feishu设置内容
	}

	private renderLarkSettings(containerEl: HTMLElement): void {
		// 渲染Lark设置内容
	}

	private renderDingSettings(containerEl: HTMLElement): void {
		// 渲染DingTalk设置内容
	}

	private renderWPSettings(containerEl: HTMLElement): void {
		// 渲染WPS设置内容
	}

	private renderVikaSettings(containerEl: HTMLElement): void {
		// 渲染Vika设置内容
	}

	private createValidatedInput(options: {
		containerEl: HTMLElement;
		name: string;
		description: string;
		placeholder: string;
		reload: boolean;
		getValue: () => string;
		setValue: (value: string) => void;
		getIsValid: () => boolean;
		setIsValid: (isValid: boolean) => void;
		localValidator: (value: string) => boolean;
		remoteValidator: () => Promise<void>;
	}) {
		new Setting(options.containerEl)
			.setName(options.name)
			.setDesc(options.description)
			.addText((text) => {
				const controlEl = text.inputEl.parentElement;
				let statusEl: HTMLElement | null = null;

				const updateVisualState = (
					state: "valid" | "invalid" | "loading" | "idle"
				) => {
					// Clear previous state
					statusEl?.remove();
					text.inputEl.classList.remove(
						"valid-input",
						"invalid-input"
					);

					switch (state) {
						case "loading":
							statusEl = createEl("span", {
								text: t("Validating..."),
								cls: "setting-item-control-status loading-text",
							});
							controlEl?.prepend(statusEl);
							break;
						case "valid":
							statusEl = createEl("span", {
								text: t("Valid"),
								cls: "setting-item-control-status valid-text",
							});
							controlEl?.prepend(statusEl);
							text.inputEl.classList.add("valid-input");
							break;
						case "invalid":
							text.inputEl.classList.add("invalid-input");
							break;
						case "idle":
						default:
							break;
					}
				};

				const initialState = options.getIsValid() ? "valid" : "idle";
				updateVisualState(initialState);

				const initialValue = options.getValue();
				let hasValueChanged = false;

				text.setPlaceholder(options.placeholder)
					.setValue(initialValue)
					.onChange(async (value: string) => {
						options.setValue(value);
						hasValueChanged = true;
						await this.plugin.saveSettings();
					});

				text.inputEl.addEventListener("blur", async () => {
					if (!hasValueChanged) {
						return;
					}

					const value = text.inputEl.value;

					if (!options.localValidator(value)) {
						options.setIsValid(false);
						updateVisualState("invalid");
						return;
					}

					updateVisualState("loading");
					try {
						await options.remoteValidator();
						updateVisualState(
							options.getIsValid() ? "valid" : "invalid"
						);
					} catch (error) {
						console.error("Validation error:", error);
						updateVisualState("invalid");
					} finally {
						await this.plugin.saveSettings();
					}
					if (options.getIsValid() && options.reload) {
						// 在输入框后面添加一个重新加载按钮，使用 reload emoji，点击后重新加载 Obsidian
						const reloadButton = document.createElement("button");
						reloadButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;" xmlns="http://www.w3.org/2000/svg"><path d="M12 4a8 8 0 1 1-8 8" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><polyline points="4 4 4 8 8 8" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
						reloadButton.title = t("Reload OB") as string;
						reloadButton.style.padding = "2px 8px";
						reloadButton.style.border = "1px solid #888";
						reloadButton.style.borderRadius = "4px";
						reloadButton.style.cursor = "pointer";
						reloadButton.onclick = () => {
							this.app.commands.executeCommandById("app:reload");
						};
						// 将按钮插入到输入框后面
						text.inputEl.parentElement?.appendChild(reloadButton);
					}

					hasValueChanged = false;
				});
			});
	}
}
