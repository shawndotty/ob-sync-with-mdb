import { Notice, Plugin, App, Command } from "obsidian";
import { t } from "../lang/helpers";
import {
	AirtableIds,
	OBSyncWithMDBSettings,
	NocoDBSettings,
	NocoDBTable,
} from "../types";
import { NocoDB } from "./db-sync/nocodb";
import { ObsidianSyncer } from "./db-sync/ob-syncer";
import { NocoDBSync } from "./db-sync/nocodb-sync";
import { Utils } from "src/utils";
import { TemplaterService } from "./templater-service";

interface CommandConfig {
	id: string;
	name: string;
	tableConfig: () => NocoDBTable;
	reloadOB?: boolean;
	iotoUpdate?: boolean;
	filterRecordsByDate?: boolean;
	apiKey?: () => string;
	forceEnSyncFields?: boolean;
	isPartOfAllUpdates?: boolean;
}

export class CommandService {
	private app: App;
	private addCommand: (command: Command) => void;
	private settings: OBSyncWithMDBSettings;
	private templaterService: TemplaterService;
	private userSyncSettingAirtableIds: AirtableIds | null;

	constructor(
		app: App,
		addCommand: (command: Command) => void,
		settings: OBSyncWithMDBSettings,
		templaterService: TemplaterService
	) {
		this.app = app;
		this.addCommand = addCommand;
		this.settings = settings;
		this.templaterService = templaterService;
		this.userSyncSettingAirtableIds = Utils.extractAirtableIds(
			this.settings.userSyncSettingUrl
		);
	}

	private getCommandConfigs(): CommandConfig[] {
		return [
			{
				id: "get-core-files",
				name: t("Update Core Files"),
				tableConfig: () => ({
					baseID: this.settings.updateIDs.obSyncCore.baseID,
					tableID: this.settings.updateIDs.obSyncCore.tableID,
					viewID: this.settings.updateIDs.obSyncCore.viewID,
					targetFolderPath: this.settings.userSyncScriptsFolder,
				}),
				isPartOfAllUpdates: true,
			},
			{
				id: "get-help-doc",
				name: t("Update Help Docs"),
				tableConfig: () => ({
					baseID: this.settings.updateIDs.obSyncHelpDocs.baseID,
					tableID: this.settings.updateIDs.obSyncHelpDocs.tableID,
					viewID: this.settings.updateIDs.obSyncHelpDocs.viewID,
					targetFolderPath: this.settings.userSyncHelpDocsFolder,
				}),
				iotoUpdate: false,
				filterRecordsByDate: true,
				isPartOfAllUpdates: true,
			},
			{
				id: "get-airtable-sync-scripts",
				name: t("Update Airtable Sync Scripts"),
				tableConfig: () => ({
					baseID: this.settings.updateIDs.obSyncAirtable.baseID,
					tableID: this.settings.updateIDs.obSyncAirtable.tableID,
					viewID: this.settings.updateIDs.obSyncAirtable.viewID,
					targetFolderPath: this.settings.userSyncScriptsFolder,
				}),
				isPartOfAllUpdates: true,
			},
			{
				id: "get-vika-sync-scripts",
				name: t("Update Vika Sync Scripts"),
				tableConfig: () => ({
					baseID: this.settings.updateIDs.obSyncVika.baseID,
					tableID: this.settings.updateIDs.obSyncVika.tableID,
					viewID: this.settings.updateIDs.obSyncVika.viewID,
					targetFolderPath: this.settings.userSyncScriptsFolder,
				}),
				isPartOfAllUpdates: true,
			},
			{
				id: "get-feishu-sync-scripts",
				name: t("Update Feishu Sync Scripts"),
				tableConfig: () => ({
					baseID: this.settings.updateIDs.obSyncFeishu.baseID,
					tableID: this.settings.updateIDs.obSyncFeishu.tableID,
					viewID: this.settings.updateIDs.obSyncFeishu.viewID,
					targetFolderPath: this.settings.userSyncScriptsFolder,
				}),
				isPartOfAllUpdates: true,
			},
			{
				id: "get-lark-sync-scripts",
				name: t("Update Lark Sync Scripts"),
				tableConfig: () => ({
					baseID: this.settings.updateIDs.obSyncLark.baseID,
					tableID: this.settings.updateIDs.obSyncLark.tableID,
					viewID: this.settings.updateIDs.obSyncLark.viewID,
					targetFolderPath: this.settings.userSyncScriptsFolder,
				}),
				isPartOfAllUpdates: true,
			},
			{
				id: "get-wps-sync-scripts",
				name: t("Update WPS Sync Scripts"),
				tableConfig: () => ({
					baseID: this.settings.updateIDs.obSyncWPS.baseID,
					tableID: this.settings.updateIDs.obSyncWPS.tableID,
					viewID: this.settings.updateIDs.obSyncWPS.viewID,
					targetFolderPath: this.settings.userSyncScriptsFolder,
				}),
				isPartOfAllUpdates: true,
			},
			{
				id: "get-ding-sync-scripts",
				name: t("Update DingTalk Sync Scripts"),
				tableConfig: () => ({
					baseID: this.settings.updateIDs.obSyncDing.baseID,
					tableID: this.settings.updateIDs.obSyncDing.tableID,
					viewID: this.settings.updateIDs.obSyncDing.viewID,
					targetFolderPath: this.settings.userSyncScriptsFolder,
				}),
				isPartOfAllUpdates: true,
			},
		];
	}

	registerCommands() {
		const commandConfigs = this.getCommandConfigs();

		commandConfigs.forEach((config) => {
			this.createNocoDBCommand(
				config.id,
				config.name,
				config.tableConfig(),
				config.reloadOB,
				config.iotoUpdate,
				config.filterRecordsByDate,
				config.apiKey ? config.apiKey() : this.settings.updateAPIKey,
				config.forceEnSyncFields
			);
		});

		this.createRunAllUpdatesCommand(commandConfigs);
	}

	async executeNocoDBCommand(
		tableConfig: NocoDBTable,
		iotoUpdate: boolean = true,
		filterRecordsByDate: boolean = false,
		apiKey: string = this.settings.updateAPIKey,
		forceDefaultFetchFields: boolean = false
	) {
		const fieldNames = Utils.buildFieldNames(
			forceDefaultFetchFields,
			this.settings.obSyncRunningLanguage
		);
		const nocoDBSettings: NocoDBSettings = {
			apiKey: apiKey,
			tables: [tableConfig],
			iotoUpdate: iotoUpdate,
			syncSettings: {
				recordFieldsNames: fieldNames,
			},
		};
		const nocoDB = new NocoDB(nocoDBSettings);
		const nocoDBSync = new NocoDBSync(nocoDB, this.app);
		const obSyncer = new ObsidianSyncer(this.app, nocoDBSync);
		await obSyncer.onlyFetchFromNocoDB(
			tableConfig,
			iotoUpdate,
			this.settings.updateAPIKeyIsValid,
			filterRecordsByDate
		);
	}

	private async withDisabledTemplaterTrigger(
		action: () => Promise<void>
	): Promise<void> {
		const templaterTrigerAtCreate = this.templaterService.getPluginSetting(
			"trigger_on_file_creation"
		);
		try {
			if (templaterTrigerAtCreate) {
				await this.templaterService.setTemplaterSetting(
					"trigger_on_file_creation",
					false
				);
			}
			await action();
		} finally {
			if (templaterTrigerAtCreate) {
				await this.templaterService.setTemplaterSetting(
					"trigger_on_file_creation",
					true
				);
			}
		}
	}

	createNocoDBCommand(
		id: string,
		name: string,
		tableConfig: NocoDBTable,
		reloadOB: boolean = false,
		iotoUpdate: boolean = true,
		filterRecordsByDate: boolean = false,
		apiKey: string = this.settings.updateAPIKey,
		forceEnSyncFields: boolean = false
	) {
		this.addCommand({
			id,
			name,
			callback: async () => {
				try {
					await this.withDisabledTemplaterTrigger(async () => {
						await this.executeNocoDBCommand(
							tableConfig,
							iotoUpdate,
							filterRecordsByDate,
							apiKey,
							forceEnSyncFields
						);
					});
				} catch (error) {
					new Notice(error.message);
				} finally {
					if (reloadOB) {
						setTimeout(() => {
							this.app.commands.executeCommandById("app:reload");
						}, 1000);
						return;
					}
				}
			},
		});
	}

	createRunAllUpdatesCommand(commandConfigs: CommandConfig[]) {
		this.addCommand({
			id: "run-all-updates",
			name: t("Deploy OBSync With One Click"),
			callback: async () => {
				const updateTasks = commandConfigs
					.filter((config) => config.isPartOfAllUpdates)
					.map((config) => ({
						id: config.id,
						name: config.name,
						tableConfig: config.tableConfig(),
					}));

				await this.withDisabledTemplaterTrigger(async () => {
					const updatePromises = updateTasks.map((task) => {
						return (async () => {
							try {
								new Notice(`${t("Executing")} ${task.name}...`);
								// 优化写法，直接通过对象映射判断是否需要设置 intialSetup
								const needInitialSetupIds = new Set([
									"get-myioto",
								]);
								if (needInitialSetupIds.has(task.id)) {
									task.tableConfig.intialSetup = true;
								}
								await this.executeNocoDBCommand(
									task.tableConfig
								);
								new Notice(`${task.name} ${t("completed")}`);
								return {
									status: "fulfilled",
									name: task.name,
								};
							} catch (error) {
								new Notice(
									`${task.name} ${t("failed")}: ${
										error.message
									}`
								);
								return {
									status: "rejected",
									name: task.name,
									reason: error,
								};
							}
						})();
					});

					const results = await Promise.allSettled(updatePromises);
					const successfulUpdates = results.filter(
						(r) => r.status === "fulfilled"
					).length;

					if (successfulUpdates === updateTasks.length) {
						this.app.commands.executeCommandById("app:reload");
					}
				});
			},
		});
	}

	// registerCommands() {
	// 	// 优化后的 addCommand 方法，减少重复代码，提升可维护性
	// 	const commands = [
	// 		{
	// 			id: "ob-sync-with-mdb-update-core",
	// 			name: t("Get The Latest Version Of Sync Scripts"),
	// 			tableConfig: {
	// 				baseID: this.settings.updateIDs.obSyncCore.baseID,
	// 				tableID: this.settings.updateIDs.obSyncCore.tableID,
	// 				viewID: this.settings.updateIDs.obSyncCore.viewID,
	// 				targetFolderPath: this.settings.templaterScriptsFolder,
	// 			},
	// 			iotoUpdate: true,
	// 			reloadOB: false,
	// 			apiKey: this.settings.updateAPIKey,
	// 		},
	// 		{
	// 			id: "ob-sync-with-mdb-update-user-sync-scripts",
	// 			name: t("Get Your Personal Sync Templates"),
	// 			tableConfig: {
	// 				baseID: this.userSyncSettingAirtableIds?.baseId || "",
	// 				tableID: this.userSyncSettingAirtableIds?.tableId || "",
	// 				viewID: this.userSyncSettingAirtableIds?.viewId || "",
	// 				targetFolderPath: this.settings.userSyncScriptsFolder,
	// 			},
	// 			iotoUpdate: false,
	// 			reloadOB: false,
	// 			apiKey: this.settings.userAPIKey,
	// 		},
	// 	];

	// 	commands.forEach((cmd) => {
	// 		this.plugin.addCommand({
	// 			id: cmd.id,
	// 			name: cmd.name,
	// 			callback: async () => {
	// 				if (!cmd.apiKey) {
	// 					new Notice(
	// 						t("You must provide an API Key to run this command")
	// 					);
	// 					return;
	// 				}
	// 				if (!this.settings.userEmail) {
	// 					new Notice(
	// 						t(
	// 							"You need to provide the email for your account to run this command"
	// 						)
	// 					);
	// 					return;
	// 				}
	// 				const nocoDBSettings = {
	// 					apiKey: cmd.apiKey,
	// 					tables: [cmd.tableConfig],
	// 				};
	// 				const myNocoDB = new NocoDB(nocoDBSettings);
	// 				const nocoDBSync = new NocoDBSync(
	// 					myNocoDB,
	// 					this.plugin.app
	// 				);
	// 				const myObsidian = new ObSyncer(
	// 					this.plugin.app,
	// 					nocoDBSync
	// 				);
	// 				await myObsidian.onlyFetchFromNocoDB(
	// 					nocoDBSettings.tables[0],
	// 					cmd.iotoUpdate,
	// 					this.settings.updateAPIKeyIsValid
	// 				);
	// 				if (cmd.reloadOB) {
	// 					this.plugin.app.commands.executeCommandById(
	// 						"app:reload"
	// 					);
	// 				}
	// 			},
	// 		});
	// 	});
	// }
}
