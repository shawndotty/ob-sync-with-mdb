import { Notice, Plugin } from "obsidian";
import { t } from "../lang/helpers";
import { AirtableIds, OBSyncWithMDBSettings } from "../types";
import { NocoDB } from "./db-sync/nocodb";
import { ObSyncer } from "./db-sync/ob-syncer";
import { NocoDBSync } from "./db-sync/nocodb-sync";
import { extractAirtableIds } from "src/utils";

export class CommandService {
	private plugin: Plugin;
	private settings: OBSyncWithMDBSettings;
	private userSyncSettingAirtableIds: AirtableIds | null;

	constructor(plugin: Plugin, settings: OBSyncWithMDBSettings) {
		this.plugin = plugin;
		this.settings = settings;
		this.userSyncSettingAirtableIds = extractAirtableIds(
			this.settings.userSyncSettingUrl
		);
	}

	registerCommands() {
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
			this.plugin.addCommand({
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
					const myNocoDB = new NocoDB(nocoDBSettings);
					const nocoDBSync = new NocoDBSync(
						myNocoDB,
						this.plugin.app
					);
					const myObsidian = new ObSyncer(
						this.plugin.app,
						nocoDBSync
					);
					await myObsidian.onlyFetchFromNocoDB(
						nocoDBSettings.tables[0],
						cmd.iotoUpdate,
						this.settings.updateAPIKeyIsValid
					);
					if (cmd.reloadOB) {
						this.plugin.app.commands.executeCommandById(
							"app:reload"
						);
					}
				},
			});
		});
	}
}
