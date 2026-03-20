# ob-sync-with-mdb（Obsidian 插件）工作指南

## 项目定位

该插件用于把在线表格（主要通过 Airtable API 形态的接口）中的记录同步为 Obsidian Vault 里的文件（Markdown、JS 等），并提供：

- 一键拉取/更新“核心文件、同步脚本、帮助文档、各平台模板”等
- 与 Templater 插件联动：写文件时临时关闭 trigger_on_file_creation，避免触发模板执行；可批量写入 Templater 热键与 Obsidian hotkeys.json
- 多语言 UI（en / zh-cn / zh-tw）

入口与主流程在 [main.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/main.ts)。

## 快速上手（开发/构建）

- 安装依赖：`npm ci`
- 开发模式（watch）：`npm run dev`
- 生产构建：`npm run build`

构建产物：

- `main.js`（esbuild bundling 输出，仓库默认忽略该文件）
- sourcemap（dev 模式 inline，prod 关闭）

配置见 [esbuild.config.mjs](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/esbuild.config.mjs) 与 [tsconfig.json](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/tsconfig.json)。

## 代码结构（按职责）

- 插件入口与生命周期
    - [main.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/main.ts)：Plugin onload/onunload，加载设置、注册命令、挂载设置页
    - [service-container.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/service-container.ts)：延迟初始化服务（SettingsManager / ApiService / TemplaterService / HotkeyService / CommandService）

- 设置与默认值
    - [default-settings.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/models/default-settings.ts)：DEFAULT_SETTINGS（大量第三方平台配置字段）
    - [settings.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/models/settings.ts)：SettingsManager，合并默认值 + Templater 路径 + loadData()
    - [settings-tab.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/ui/settings-tab.ts)：设置 UI（TabbedSettings、多平台配置、输入验证、文件夹 picker）

- 命令与同步（核心业务）
    - [command-service.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/command-service.ts)
        - 根据 settings.updateIDs 生成命令列表（核心文件/帮助文档/各平台脚本/用户私有模板）
        - “一键部署”会并发执行所有标记为 isPartOfAllUpdates 的任务
        - 写文件前后通过 TemplaterService 临时关闭 trigger_on_file_creation
    - [nocodb-sync.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/db-sync/nocodb-sync.ts)
        - 从 API 拉取 records（支持 offset 分页）
        - 将 record.fields 映射为统一字段 Title/SubFolderForOBSync/MDForOBSync（兼容多语言字段名）
        - 批量创建/更新 vault 文件（支持写入隐藏目录如 .obsidian 下的配置文件）
    - [ob-syncer.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/db-sync/ob-syncer.ts)：同步执行封装（包含 update key 过期提示）
    - [nocodb.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/db-sync/nocodb.ts)：API URL 与字段名配置载体（apiUrlRoot 当前为 Airtable API）

- 许可/更新权限校验与远程配置
    - [api-service.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/api-service.ts)
        - checkApiKey：通过 webhook 写入并回查 Airtable 验证 updateAPIKey 是否有效
        - getUpdateIDs：按 email 查询并下发各更新表（updateIDs）配置
    - `src/airtable-config.ts`：本地私有配置（在 [.gitignore](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/.gitignore) 中忽略），用于存储 TOKEN / WEBHOOK_URL 等敏感信息

- Templater/热键联动
    - [templater-service.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/templater-service.ts)：读取并写入 Templater 插件设置、启用模板热键列表
    - [hotkey-services.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/hotkey-services.ts)：更新 `.obsidian/hotkeys.json`，为 Templater 模板生成默认快捷键（Alt/Alt+Shift + 平台字母）

- i18n
    - [helpers.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/lang/helpers.ts)：t(key, vars)，基于 moment.locale() 选语言包
    - [locale](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/lang/locale)：en / zh-cn / zh-tw

- 工具
    - [utils/index.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/utils/index.ts)：API key/email 校验、从 Airtable URL 提取 base/table/view、按语言生成字段名映射等

## 关键运行时数据流

### 插件启动

1. onload 初始化 ServiceContainer
2. SettingsManager.load() 合并默认值 + Templater 路径 + data.json 持久化设置
3. CommandService.registerCommands() 根据 settings（包含 update key validity + userChecked + updateIDs.viewID 等）决定是否注册命令
4. 注册设置页（SettingTab）

入口见 [main.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/main.ts)。

### “更新/同步”命令执行

1. 从 CommandConfig 取目标表配置（baseID/tableID/viewID/targetFolderPath 等）
2. 计算字段名映射（Utils.buildFieldNames，受 moment.locale 与 settings.obSyncRunningLanguage 影响）
3. NocoDBSync 拉取 records，映射 fields，写入文件
4. 必要时 reload Obsidian（app:reload）

核心实现见 [command-service.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/command-service.ts#L267-L420) 与 [nocodb-sync.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/db-sync/nocodb-sync.ts#L160-L250)。

## 本仓库的“敏感信息”约定

- `src/airtable-config.ts` 被 gitignore：用于放置 Airtable TOKEN / webhook URL 等敏感值，不应提交到仓库
- 插件设置 data.json（同样 gitignore）会保存用户的 API Key / App Secret / Token 等：不要在日志里输出这些字段

## 常见改动点（给代码助手/贡献者）

- 新增/调整同步任务
    - 修改 [command-service.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/command-service.ts) 的 getCommandConfigs() 与 i18n 文案

- 调整写入文件规则（路径、扩展名、非法字符处理、批量策略）
    - 修改 [nocodb-sync.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/db-sync/nocodb-sync.ts)

- 调整设置 UI / 输入校验
    - 修改 [settings-tab.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/ui/settings-tab.ts) 与 [utils/index.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/utils/index.ts)

- 调整热键生成策略
    - 修改 [hotkey-services.ts](file:///Users/johnny/Documents/Sync/IOTO-Plugins/.obsidian/plugins/ob-sync-with-mdb/src/services/hotkey-services.ts)

## 工作约束（建议遵守）

- 不要把 `src/airtable-config.ts` 或任何 token/secret 写进提交历史
- 尽量复用现有 ServiceContainer 结构，不要在 onload 里直接 new 太多依赖
- 写 Vault 文件时注意 `.obsidian/` 下是配置目录：该插件对隐藏路径采用 adapter.write 分支
