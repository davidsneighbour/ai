#!/usr/bin/env node

import {
	asRecord,
	type CommonDirectConfig,
	fetchJson,
	firstString,
	printJson,
	readDotenv,
	readMessage,
	requireEnvValue,
} from "./direct-api-utils.ts";

const DEFAULT_DOTENV_PATH = "~/.env";

function printHelp(): void {
	console.log(`
Post to Tumblr using the Tumblr OAuth2 API.

Usage:
  node post-tumblr.ts --message-file ./message.md

Options:
  --message <text>       Message text to publish.
  --message-file <path>  File containing message text.
  --dotenv <path>        Dotenv path. Default: ${DEFAULT_DOTENV_PATH}.
  --dry-run              Print JSON describing the post without publishing.
  --help                 Show this help text.
`);
}

function requireArg(argv: string[], index: number, flag: string): string {
	const value = argv[index];

	if (!value) {
		throw new Error(`${flag} needs a value.`);
	}

	return value;
}

function parseArgs(argv: string[]): CommonDirectConfig {
	const config: CommonDirectConfig = {
		dotenvPath: DEFAULT_DOTENV_PATH,
		dryRun: false,
	};
	let index = 0;
	const nextValue = (flag: string): string => {
		index += 1;
		return requireArg(argv, index, flag);
	};

	for (; index < argv.length; index += 1) {
		const arg = argv[index];

		switch (arg) {
			case "--help":
			case "-h":
				printHelp();
				process.exit(0);
				break;

			case "--message":
				config.message = nextValue(arg);
				break;

			case "--message-file":
				config.messageFile = nextValue(arg);
				break;

			case "--dotenv":
				config.dotenvPath = nextValue(arg);
				break;

			case "--dry-run":
				config.dryRun = true;
				break;

			default:
				throw new Error(`Unknown option: ${arg}`);
		}
	}

	return config;
}

function assertTumblrTokenNotExpired(
	dotenvValues: Record<string, string>,
): void {
	const expiresAt = dotenvValues.TUMBLR_ACCESS_TOKEN_EXPIRES_AT;

	if (!expiresAt) {
		return;
	}

	const timestamp = Date.parse(expiresAt);

	if (!Number.isFinite(timestamp)) {
		return;
	}

	if (timestamp <= Date.now()) {
		throw new Error(
			"TUMBLR_ACCESS_TOKEN_EXPIRES_AT is in the past. Refresh Tumblr credentials with dnb-tumblr-refresh-token before posting.",
		);
	}
}

async function postTumblr(): Promise<void> {
	const config = parseArgs(process.argv.slice(2));
	const message = await readMessage(config);
	const dotenvValues = await readDotenv(config.dotenvPath);

	if (config.dryRun) {
		printJson({
			network: "tumblr",
			dryRun: true,
			characters: [...message].length,
		});
		return;
	}

	const accessToken = requireEnvValue("TUMBLR_ACCESS_TOKEN", dotenvValues);
	const blogIdentifier = requireEnvValue(
		"TUMBLR_BLOG_IDENTIFIER",
		dotenvValues,
	);
	assertTumblrTokenNotExpired(dotenvValues);
	const json = asRecord(
		await fetchJson(
			`https://api.tumblr.com/v2/blog/${encodeURIComponent(blogIdentifier)}/posts`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: [
						{
							text: message,
							type: "text",
						},
					],
					state: "published",
				}),
			},
			"Tumblr post creation",
			dotenvValues,
		),
	);
	const response = asRecord(json.response);
	const url = firstString(response.post_url, response.url);
	const id = firstString(response.id, json.id);

	printJson({
		network: "tumblr",
		url:
			url ??
			(id ? `https://www.tumblr.com/${blogIdentifier}/${id}` : "unknown"),
		id,
	});
}

postTumblr().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`Error: ${message}`);
	process.exitCode = 1;
});
