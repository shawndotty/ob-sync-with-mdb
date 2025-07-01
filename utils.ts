// 工具函数 from main.ts

/**
 * 校验 API Key 是否有效
 */
export function isValidApiKey(apiKey: string): boolean {
	return Boolean(
		apiKey &&
			apiKey.length >= 82 &&
			apiKey.includes("pat") &&
			apiKey.includes(".")
	);
}

/**
 * 校验邮箱格式是否有效
 */
export function isValidEmail(email: string): boolean {
	// 基础格式检查：非空、包含@符号、@后包含点号
	if (
		!email ||
		email.indexOf("@") === -1 ||
		email.indexOf(".", email.indexOf("@")) === -1 ||
		email.length < 10
	) {
		return false;
	}

	// 正则表达式验证（符合RFC 5322标准）
	const emailRegex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	return emailRegex.test(email);
}

/**
 * 从 Airtable 分享链接中提取 baseId、tableId、viewId
 */
export function extractAirtableIds(url: string) {
	// Regular expression to match Airtable URL pattern
	const regex =
		/https?:\/\/airtable\.com\/(app[^\/]+)\/(tbl[^\/]+)(?:\/(viw[^\/?]+))?/;
	const match = url.match(regex);

	if (!match) {
		return null;
	}

	return {
		baseId: match[1] || "",
		tableId: match[2] || "",
		viewId: match[3] || "",
	};
}
