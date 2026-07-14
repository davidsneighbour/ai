#!/usr/bin/env tsx

import { constants as fsConstants } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

interface CliConfig {
	url?: string;
	logPath: string;
}

interface PostedRecord {
	url: string;
	canonicalUrl?: string;
	mastodonUrl: string;
	postedAt: string;
	message: string;
}

const DEFAULT_LOG_PATH = "~/.local/share/dnb-post-link-into-void/posted.jsonl";

function printHelp(): void {
	console.log(`
Check whether a URL has already been posted, using the shared post log.

Usage:
  tsx check-posted-log.ts --url https://example.com/post

Options:
  --url <url>         URL to check. Required.
  --log-path <path>   Log file path. Default: ${DEFAULT_LOG_PATH}.
  --help               Show this help text.

Output:
  JSON on stdout: { alreadyPosted: boolean, record?: {...} }
`);
}

function expandHomePath(input: string): string {
	if (input === "~") {
		return homedir();
	}

	if (input.startsWith("~/")) {
		return join(homedir(), input.slice(2));
	}

	return input;
}

function normaliseUrl(value: string): string {
	return value.trim().replace(/\/+$/, "").toLowerCase();
}

function parseArgs(argv: string[]): CliConfig {
	const config: CliConfig = { logPath: DEFAULT_LOG_PATH };

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];

		switch (arg) {
			case "--help":
			case "-h":
				printHelp();
				process.exit(0);
				break;

			case "--url":
				config.url = argv[++index];
				break;

			case "--log-path":
				config.logPath = argv[++index] ?? DEFAULT_LOG_PATH;
				break;

			default:
				throw new Error(`Unknown option: ${arg}`);
		}
	}

	if (!config.url) {
		throw new Error("Missing required --url.");
	}

	return config;
}

async function readLog(logPath: string): Promise<PostedRecord[]> {
	try {
		await access(logPath, fsConstants.R_OK);
	} catch {
		return [];
	}

	const content = await readFile(logPath, "utf8");
	const records: PostedRecord[] = [];

	for (const line of content.split("\n")) {
		const trimmed = line.trim();

		if (trimmed.length === 0) {
			continue;
		}

		try {
			records.push(JSON.parse(trimmed) as PostedRecord);
		} catch {
			// Skip a malformed line rather than fail the whole check.
		}
	}

	return records;
}

async function main(): Promise<void> {
	const config = parseArgs(process.argv.slice(2));
	const logPath = resolve(expandHomePath(config.logPath));
	const records = await readLog(logPath);
	const target = normaliseUrl(config.url as string);

	const match = records.find(
		(record) =>
			normaliseUrl(record.url) === target ||
			(record.canonicalUrl !== undefined && normaliseUrl(record.canonicalUrl) === target),
	);

	if (match) {
		console.log(JSON.stringify({ alreadyPosted: true, record: match }, null, 2));
		return;
	}

	console.log(JSON.stringify({ alreadyPosted: false }, null, 2));
}

main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`Error: ${message}`);
	process.exitCode = 1;
});
