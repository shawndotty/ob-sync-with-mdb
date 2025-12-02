import { PluginSettingTab, Setting, App } from "obsidian";
import { t } from "../lang/helpers";
import { ApiService } from "../services/api-service";
import { Utils } from "../utils";
import { TabbedSettings } from "./tabbed-settings";
import { ThirdPartyServiceConfig, SettingConfig } from "../types";
import { FolderSuggest } from "./pickers/folder-picker";

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
				title: "Basic Setting",
				renderMethod: (content: HTMLElement) =>
					this.renderMainSettings(content),
				render: true,
			},
			{
				title: "User Setting",
				renderMethod: (content: HTMLElement) =>
					this.renderUserSettings(content),
				render: true,
			},
			{
				title: "Airtable Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderAirtableSettings(content),
				render:
					this.plugin.settings.updateIDs.obSyncAirtable.viewID !== "",
			},
			{
				title: "Vika Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderVikaSettings(content),
				render: this.plugin.settings.updateIDs.obSyncVika.viewID !== "",
			},
			{
				title: "Feishu Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderFeishuSettings(content),
				render:
					this.plugin.settings.updateIDs.obSyncFeishu.viewID !== "",
			},
			{
				title: "Lark Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderLarkSettings(content),
				render: this.plugin.settings.updateIDs.obSyncLark.viewID !== "",
			},
			{
				title: "DingTalk Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderDingSettings(content),
				render: this.plugin.settings.updateIDs.obSyncDing.viewID !== "",
			},
			{
				title: "WPS Settings",
				renderMethod: (content: HTMLElement) =>
					this.renderWPSettings(content),
				render: this.plugin.settings.updateIDs.obSyncWPS.viewID !== "",
			},
		];

		tabConfigs.forEach((config) => {
			if (config.render) {
				tabbedSettings.addTab(
					t(config.title as any),
					config.renderMethod
				);
			}
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

		const folderSettings = [
			{
				nameKey: "Sync Scripts Folder",
				descKey:
					"Please enter the path to the Templater Scripts Folder",
				placeholderKey:
					"Enter the full path to the Templater Scripts folder",
				value: this.plugin.settings.templaterScriptsFolder,
				onChange: async (newFolder: string, oldFolder: string) => {
					this.plugin.settings.templaterScriptsFolder = newFolder;
					await this.plugin.saveSettings();
					this.plugin.commandService.registerCommands();
				},
			},
			{
				nameKey: "Sync templates Folder",
				descKey: "Please enter the path to the Sync templates folder",
				placeholderKey:
					"Enter the full path to the Sync templates folder",
				value: this.plugin.settings.templaterTemplatesFolder,
				onChange: async (newFolder: string, oldFolder: string) => {
					this.plugin.settings.templaterTemplatesFolder = newFolder;
					await this.plugin.saveSettings();
					this.plugin.commandService.registerCommands();
				},
			},
			{
				nameKey: "HELP_DOCS_FOLDER",
				descKey: "HELP_DOCS_FOLDER_HINT",
				placeholderKey: "HELP_DOCS_FOLDER_PLACEHOLDER",
				value: this.plugin.settings.obSyncHelpDocsFolder,
				onChange: async (newFolder: string, oldFolder: string) => {
					this.plugin.settings.obSyncHelpDocsFolder = newFolder;
					await this.plugin.saveSettings();
					this.plugin.commandService.registerCommands();
				},
			},
		];

		folderSettings.forEach((setting) => {
			this.createFolderSetting(
				containerEl,
				setting.nameKey,
				setting.descKey,
				setting.placeholderKey,
				setting.value,
				setting.onChange
			);
		});
	}

	private renderUserSettings(containerEl: HTMLElement): void {
		this.createToggleSetting(containerEl, {
			name: "USE_USER_TEMPLATE",
			desc: "TOGGLE_USE_USER_TEMPLATE",
			value: this.plugin.settings.useUserTemplate,
			onChange: async (value) => {
				this.plugin.settings.useUserTemplate = value;
				await this.plugin.saveSettings();
			},
		});

		this.createTextSetting(containerEl, {
			name: "USER_TEMPLATE_PREFIX",
			desc: "SET_USER_TEMPLATE_PREFIX",
			placeholder: "USER_TEMPLATE_PREFIX_HINT",
			value: this.plugin.settings.userTemplatePrefix,
			onChange: async (value) => {
				this.plugin.settings.userTemplatePrefix = value;
				await this.plugin.saveSettings();
			},
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

		const folderSettings = [
			{
				nameKey: "Your Sync Templates Folder",
				descKey: "Please enter the path to your sync templates folder",
				placeholderKey:
					"Enter the full path to your sync templates folder",
				value: this.plugin.settings.userSyncScriptsFolder,
				onChange: async (newFolder: string, oldFolder: string) => {
					this.plugin.settings.userSyncScriptsFolder = newFolder;
					await this.plugin.saveSettings();
				},
			},
		];

		folderSettings.forEach((setting) => {
			this.createFolderSetting(
				containerEl,
				setting.nameKey,
				setting.descKey,
				setting.placeholderKey,
				setting.value,
				setting.onChange
			);
		});

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
			href: "https://airtable.com/app84J6QgVNsTUdPQ/shrJhhMFksy7XTrRb",
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
		const services: ThirdPartyServiceConfig[] = [
			{
				serviceName: "Airtable",
				serviceType: "Sync",
				apiKeySetting: "airtableAPIKeyForSync",
				apiKeyHint: "IOTO_AIRTABLE_API_KEY_HINT",
				baseIdSetting: "airtableBaseIDForSync",
				baseIdHint: "IOTO_AIRTABLE_BASE_ID_HINT",
				tableIdSetting: "airtableTableIDForSync",
				tableIdHint: "IOTO_AIRTABLE_TABLE_ID_HINT",
				baseUrl: "https://airtable.com/{baseId}/{tableId}",
				templateUrl: "AirtableSyncTableTemplateURL",
				yourTableText: "YourAirtableSyncTable",
				templateText: "AirtableSyncTemplate",
			},
			{
				serviceName: "Airtable",
				serviceType: "Fetch",
				apiKeySetting: "airtableAPIKeyForFetch",
				apiKeyHint: "IOTO_AIRTABLE_API_KEY_HINT",
				baseIdSetting: "airtableBaseIDForFetch",
				baseIdHint: "IOTO_AIRTABLE_BASE_ID_HINT",
				tableIdSetting: "airtableTableIDForFetch",
				tableIdHint: "IOTO_AIRTABLE_TABLE_ID_HINT",
				baseUrl: "https://airtable.com/{baseId}/{tableId}",
				templateUrl: "AirtableFetchTableTemplateURL",
				yourTableText: "YourAirtableFetchTable",
				templateText: "AirtableFetchTemplate",
			},
		];

		services.forEach((service) => {
			this.createThirdPartyServiceSettings(
				containerEl,
				service,
				this.plugin.settings
			);
		}); // 渲染Airtable设置内容
	}

	private renderFeishuSettings(containerEl: HTMLElement): void {
		// 渲染Feishu设置内容
		const services: ThirdPartyServiceConfig[] = [
			{
				serviceName: "Feishu",
				serviceType: "Sync",
				apiKeySetting: "feishuAppIDForSync",
				apiKeyHint: "IOTO_FEISHU_APP_ID_HINT",
				appSecretSetting: "feishuAppSecretForSync",
				appSecretHint: "IOTO_FEISHU_APP_SECRET_HINT",
				baseIdSetting: "feishuBaseIDForSync",
				baseIdHint: "IOTO_FEISHU_BASE_ID_HINT",
				tableIdSetting: "feishuTableIDForSync",
				tableIdHint: "IOTO_FEISHU_TABLE_ID_HINT",
				baseUrl: "https://feishu.cn/base/{baseId}?table={tableId}",
				templateUrl: "FeishuSyncTableTempalteURL",
				yourTableText: "YourFeishuSyncTable",
				templateText: "FeishuSyncTemplate",
			},
			{
				serviceName: "Feishu",
				serviceType: "Fetch",
				apiKeySetting: "feishuAppIDForFetch",
				apiKeyHint: "IOTO_FEISHU_APP_ID_HINT",
				appSecretSetting: "feishuAppSecretForFetch",
				appSecretHint: "IOTO_FEISHU_APP_SECRET_HINT",
				baseIdSetting: "feishuBaseIDForFetch",
				baseIdHint: "IOTO_FEISHU_BASE_ID_HINT",
				tableIdSetting: "feishuTableIDForFetch",
				tableIdHint: "IOTO_FEISHU_TABLE_ID_HINT",
				baseUrl: "https://feishu.cn/base/{baseId}?table={tableId}",
				templateUrl: "FeishuFetchTableTemplateURL",
				yourTableText: "YourFeishuFetchTable",
				templateText: "FeishuFetchTemplate",
			},
		];

		services.forEach((service) => {
			this.createThirdPartyServiceSettings(
				containerEl,
				service,
				this.plugin.settings
			);
		});
	}

	private renderLarkSettings(containerEl: HTMLElement): void {
		// 渲染Lark设置内容
		const services: ThirdPartyServiceConfig[] = [
			{
				serviceName: "Lark",
				serviceType: "Sync",
				apiKeySetting: "larkAppIDForSync",
				apiKeyHint: "IOTO_LARK_APP_ID_HINT",
				appSecretSetting: "larkAppSecretForSync",
				appSecretHint: "IOTO_LARK_APP_SECRET_HINT",
				baseIdSetting: "larkBaseIDForSync",
				baseIdHint: "IOTO_LARK_BASE_ID_HINT",
				tableIdSetting: "larkTableIDForSync",
				tableIdHint: "IOTO_LARK_TABLE_ID_HINT",
				baseUrl: "https://larksuite.com/base/{baseId}?table={tableId}",
				templateUrl: "LarkSyncTableTempalteURL",
				yourTableText: "YourLarkSyncTable",
				templateText: "LarkSyncTemplate",
			},
			{
				serviceName: "Lark",
				serviceType: "Fetch",
				apiKeySetting: "larkAppIDForFetch",
				apiKeyHint: "IOTO_LARK_APP_ID_HINT",
				appSecretSetting: "larkAppSecretForFetch",
				appSecretHint: "IOTO_LARK_APP_SECRET_HINT",
				baseIdSetting: "larkBaseIDForFetch",
				baseIdHint: "IOTO_LARK_BASE_ID_HINT",
				tableIdSetting: "larkTableIDForFetch",
				tableIdHint: "IOTO_LARK_TABLE_ID_HINT",
				baseUrl: "https://larksuite.com/base/{baseId}?table={tableId}",
				templateUrl: "LarkFetchTableTemplateURL",
				yourTableText: "YourLarkFetchTable",
				templateText: "LarkFetchTemplate",
			},
		];

		services.forEach((service) => {
			this.createThirdPartyServiceSettings(
				containerEl,
				service,
				this.plugin.settings
			);
		});
	}

	private renderDingSettings(containerEl: HTMLElement): void {
		// 渲染DingTalk设置内容
		const services: ThirdPartyServiceConfig[] = [
			{
				serviceName: "Ding",
				serviceType: "Sync",
				apiKeySetting: "dingAppIDForSync",
				apiKeyHint: "IOTO_DING_APP_ID_HINT",
				appSecretSetting: "dingAppSecretForSync",
				appSecretHint: "IOTO_DING_APP_SECRET_HINT",
				userIDSetting: "dingUserIDForSync",
				userIDHint: "IOTO_DING_USER_ID_HINT",
				baseIdSetting: "dingBaseIDForSync",
				baseIdHint: "IOTO_DING_BASE_ID_HINT",
				tableIdSetting: "dingTableIDForSync",
				tableIdHint: "IOTO_DING_TABLE_ID_HINT",
				viewIdSetting: "dingViewIDForSync",
				viewIdHint: "IOTO_DING_VIEW_ID_HINT",
				baseUrl:
					"https://alidocs.dingtalk.com/i/nodes/{baseId}?iframeQuery=entrance%3Ddata%26sheetId%3D{tableId}&viewId%3D{viewId}",
				templateUrl: "DingSyncTableTemplateURL",
				yourTableText: "YourDingSyncTable",
				templateText: "DingSyncTemplate",
			},
			{
				serviceName: "Ding",
				serviceType: "Fetch",
				apiKeySetting: "dingAppIDForFetch",
				apiKeyHint: "IOTO_DING_APP_ID_HINT",
				appSecretSetting: "dingAppSecretForFetch",
				appSecretHint: "IOTO_DING_APP_SECRET_HINT",
				userIDSetting: "dingUserIDForFetch",
				userIDHint: "IOTO_DING_USER_ID_HINT",
				baseIdSetting: "dingBaseIDForFetch",
				baseIdHint: "IOTO_DING_BASE_ID_HINT",
				tableIdSetting: "dingTableIDForFetch",
				tableIdHint: "IOTO_DING_TABLE_ID_HINT",
				viewIdSetting: "dingViewIDForFetch",
				viewIdHint: "IOTO_DING_VIEW_ID_HINT",
				baseUrl:
					"https://alidocs.dingtalk.com/i/nodes/{baseId}?iframeQuery=entrance%3Ddata%26sheetId%3D{tableId}&viewId%3D{viewId}",
				templateUrl: "DingFetchTableTemplateURL",
				yourTableText: "YourDingFetchTable",
				templateText: "DingFetchTemplate",
			},
		];

		services.forEach((service) => {
			this.createThirdPartyServiceSettings(
				containerEl,
				service,
				this.plugin.settings
			);
		});
	}

	private renderWPSettings(containerEl: HTMLElement): void {
		// 渲染WPS设置内容
		const services: ThirdPartyServiceConfig[] = [
			{
				serviceName: "WPS",
				serviceType: "Sync",
				apiKeySetting: "wpsAppIDForSync",
				apiKeyHint: "IOTO_WPS_APP_ID_HINT",
				appSecretSetting: "wpsAppSecretForSync",
				appSecretHint: "IOTO_WPS_APP_SECRET_HINT",
				userTokenSetting: "wpsUserTokenForSync",
				userTokenHint: "IOTO_WPS_USER_TOKEN_HINT",
				baseIdSetting: "wpsBaseIDForSync",
				baseIdHint: "IOTO_WPS_BASE_ID_HINT",
				tableIdSetting: "wpsTableIDForSync",
				tableIdHint: "IOTO_WPS_TABLE_ID_HINT",
				baseUrl:
					"https://alidocs.dingtalk.com/i/nodes/{baseId}?iframeQuery=entrance%3Ddata%26sheetId%3D{tableId}&viewId%3D{viewId}",
				templateUrl: "wpsSyncTableTemplateURL",
				yourTableText: "YourWPSSyncTable",
				templateText: "WPSSyncTemplate",
				apiExplorerUrl: "IOTO_WPS_API_EXPLORER_URL",
				apiExplorerHint: "IOTO_WPS_API_EXPLORER_HINT",
			},
			{
				serviceName: "WPS",
				serviceType: "Fetch",
				apiKeySetting: "wpsAppIDForFetch",
				apiKeyHint: "IOTO_WPS_APP_ID_HINT",
				appSecretSetting: "wpsAppSecretForFetch",
				appSecretHint: "IOTO_WPS_APP_SECRET_HINT",
				userTokenSetting: "wpsUserTokenForFetch",
				userTokenHint: "IOTO_WPS_USER_TOKEN_HINT",
				baseIdSetting: "wpsBaseIDForFetch",
				baseIdHint: "IOTO_WPS_BASE_ID_HINT",
				tableIdSetting: "wpsTableIDForFetch",
				tableIdHint: "IOTO_WPS_TABLE_ID_HINT",
				baseUrl: "https://www.kdocs.cn/l/{baseId}",
				templateUrl: "WPSFetchTableTemplateURL",
				yourTableText: "YourWPSFetchTable",
				templateText: "WPSFetchTemplate",
			},
		];

		services.forEach((service) => {
			this.createThirdPartyServiceSettings(
				containerEl,
				service,
				this.plugin.settings
			);
		});
	}

	private renderVikaSettings(containerEl: HTMLElement): void {
		// 渲染Vika设置内容
		const services: ThirdPartyServiceConfig[] = [
			{
				serviceName: "Vika",
				serviceType: "Sync",
				apiKeySetting: "vikaAPIKeyForSync",
				apiKeyHint: "IOTO_VIKA_API_KEY_HINT",
				tableIdSetting: "vikaTableIDForSync",
				tableIdHint: "IOTO_VIKA_TABLE_ID_HINT",
				baseUrl: "https://vika.cn/workbench/{tableId}",
				templateUrl: "VikaSyncTableTemplateURL",
				yourTableText: "YourVikaSyncTable",
				templateText: "VikaSyncTemplate",
			},
			{
				serviceName: "Vika",
				serviceType: "Fetch",
				apiKeySetting: "vikaAPIKeyForFetch",
				apiKeyHint: "IOTO_VIKA_API_KEY_HINT",
				tableIdSetting: "vikaTableIDForFetch",
				tableIdHint: "IOTO_VIKA_TABLE_ID_HINT",
				baseUrl: "https://vika.cn/workbench/{tableId}",
				templateUrl: "VikaFetchTableTemplateURL",
				yourTableText: "YourVikaFetchTable",
				templateText: "VikaFetchTemplate",
			},
		];

		services.forEach((service) => {
			this.createThirdPartyServiceSettings(
				containerEl,
				service,
				this.plugin.settings
			);
		});
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

	private createThirdPartyServiceSettings(
		content: HTMLElement,
		config: ThirdPartyServiceConfig,
		settings: any
	): void {
		content.createEl("h6", {
			text: t(
				`IOTO_${config.serviceName.toUpperCase()}_${config.serviceType.toUpperCase()}_SETTINGS` as any
			),
		});

		// API Key 设置
		this.createTextSetting(content, {
			name: `IOTO_${config.serviceName.toUpperCase()}_API_KEY`,
			desc: config.apiKeyHint,
			value: settings[config.apiKeySetting],
			onChange: async (value) => {
				settings[config.apiKeySetting] = value;
				await this.plugin.saveSettings();
			},
		});

		// App Secret 设置（如果存在）
		if (config.appSecretSetting && config.appSecretHint) {
			this.createTextSetting(content, {
				name: `IOTO_${config.serviceName.toUpperCase()}_APP_SECRET`,
				desc: config.appSecretHint,
				value: settings[config.appSecretSetting],
				onChange: async (value) => {
					(settings as any)[config.appSecretSetting!] = value;
					await this.plugin.saveSettings();
				},
			});
		}

		// User ID 设置（如果存在）
		if (config.userIDSetting && config.userIDHint) {
			this.createTextSetting(content, {
				name: `IOTO_${config.serviceName.toUpperCase()}_USER_ID`,
				desc: config.userIDHint,
				value: settings[config.userIDSetting],
				onChange: async (value) => {
					(settings as any)[config.userIDSetting!] = value;
					await this.plugin.saveSettings();
				},
			});
		}

		// Base ID 设置（如果存在）
		if (config.baseIdSetting && config.baseIdHint) {
			this.createTextSetting(content, {
				name: `IOTO_${config.serviceName.toUpperCase()}_BASE_ID`,
				desc: config.baseIdHint,
				value: settings[config.baseIdSetting],
				onChange: async (value) => {
					(settings as any)[config.baseIdSetting!] = value;
					await this.plugin.saveSettings();
				},
			});
		}

		// Table ID 设置
		this.createTextSetting(content, {
			name: `IOTO_${config.serviceName.toUpperCase()}_TABLE_ID`,
			desc: config.tableIdHint,
			value: settings[config.tableIdSetting],
			onChange: async (value) => {
				settings[config.tableIdSetting] = value;
				await this.plugin.saveSettings();
			},
		});

		// View ID 设置
		if (config.viewIdSetting && config.viewIdHint) {
			this.createTextSetting(content, {
				name: `IOTO_${config.serviceName.toUpperCase()}_VIEW_ID`,
				desc: config.viewIdHint || "",
				value: settings[config.viewIdSetting!],
				onChange: async (value) => {
					(settings as any)[config.viewIdSetting!] = value;
					await this.plugin.saveSettings();
				},
			});
		}

		// View ID 设置
		if (config.userTokenSetting && config.userTokenHint) {
			this.createTextSetting(content, {
				name: `IOTO_${config.serviceName.toUpperCase()}_USER_TOKEN`,
				desc: config.userTokenHint || "",
				value: settings[config.userTokenSetting!],
				onChange: async (value) => {
					(settings as any)[config.userTokenSetting!] = value;
					await this.plugin.saveSettings();
				},
			});
		}

		// 创建链接信息
		this.createServiceLinks(content, config, settings);
	}

	private createServiceLinks(
		content: HTMLElement,
		config: ThirdPartyServiceConfig,
		settings: any
	): void {
		const serviceInfo = content.createEl("div");

		// 构建链接URL
		let linkUrl = config.baseUrl;
		if (config.baseIdSetting && settings[config.baseIdSetting]) {
			linkUrl = linkUrl.replace(
				"{baseId}",
				settings[config.baseIdSetting]
			);
		}
		if (settings[config.tableIdSetting]) {
			linkUrl = linkUrl.replace(
				"{tableId}",
				settings[config.tableIdSetting]
			);
		}

		const baseLink = serviceInfo.createEl("a", {
			text: t(config.yourTableText as any),
			href: linkUrl,
		});
		baseLink.setAttr("target", "_blank");
		baseLink.setAttr("rel", "noopener noreferrer");

		serviceInfo.createEl("span", { text: " | " });

		const templateLink = serviceInfo.createEl("a", {
			text: t(config.templateText as any),
			href: t(config.templateUrl as any),
		});
		templateLink.setAttr("target", "_blank");
		templateLink.setAttr("rel", "noopener noreferrer");

		// API Explorer 链接
		if (config.apiExplorerUrl && config.apiExplorerHint) {
			serviceInfo.createEl("span", { text: " | " });
			const apiExplorerLink = serviceInfo.createEl("a", {
				text: t(config.apiExplorerHint as any),
				href: t(config.apiExplorerUrl as any),
			});
			apiExplorerLink.setAttr("target", "_blank");
			apiExplorerLink.setAttr("rel", "noopener noreferrer");
		}
	}

	// 通用方法：创建文本设置项
	private createTextSetting(
		content: HTMLElement,
		config: SettingConfig
	): void {
		new Setting(content)
			.setName(t(config.name as any))
			.setDesc(t(config.desc as any))
			.addText((text) => {
				if (config.placeholder) {
					text.setPlaceholder(t(config.placeholder as any));
				}
				text.setValue(config.value).onChange(config.onChange);
			});
	}

	// 通用方法：创建切换设置项
	private createToggleSetting(
		content: HTMLElement,
		config: SettingConfig
	): void {
		new Setting(content)
			.setName(t(config.name as any))
			.setDesc(t(config.desc as any))
			.addToggle((toggle) => {
				toggle.setValue(config.value).onChange(config.onChange);
			});
	}

	// 通用方法：创建文件夹设置项
	private createFolderSetting(
		content: HTMLElement,
		nameKey: string,
		descKey: string,
		placeholderKey: string,
		value: string,
		onChange: (newFolder: string, oldFolder: string) => Promise<void>
	): void {
		new Setting(content)
			.setName(t(nameKey as any))
			.setDesc(t(descKey as any))
			.addSearch((text) => {
				new FolderSuggest(this.app, text.inputEl);
				text.setPlaceholder(t(placeholderKey as any))
					.setValue(value)
					.onChange(async (newFolder) => {
						const oldFolder = value;
						if (newFolder) {
							await onChange(newFolder, oldFolder);
						}
					});
			});
	}
}
