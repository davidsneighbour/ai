#!/usr/bin/env tsx

import { spawn } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import {
	access,
	appendFile,
	mkdir,
	mkdtemp,
	readFile,
	rm,
	writeFile,
} from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";

type Network =
	| "mastodon"
	| "bluesky"
	| "linkedin"
	| "nostr"
	| "reddit"
	| "threads"
	| "tumblr";
type NetworkTransport = "crosspost" | "direct";

interface NetworkConfig {
	transport: NetworkTransport;
	flag?: string;
	requiredEnv: string[];
	alternativeRequiredEnv?: string[][];
	maxChars: number;
	supportsImages: boolean;
	description: string;
}

interface CliConfig {
	message?: string;
	messageFile?: string;
	networkMessageFiles: Partial<Record<Network, string>>;
	title?: string;
	image?: string;
	imageAlt?: string;
	dotenvPath: string;
	sourceUrl?: string;
	canonicalUrl?: string;
	logPath: string;
	noLog: boolean;
	dryRun: boolean;
	force: boolean;
	info: boolean;
	targetNetworks: Network[];
}

interface CommandResult {
	exitCode: number;
	stdout: string;
	stderr: string;
}

interface DirectPublishContext {
	config: CliConfig;
	dotenvValues: Record<string, string>;
}

interface NetworkPostRecord {
	url: string;
	postedAt: string;
}

interface PostedRecord {
	url: string;
	canonicalUrl?: string;
	mastodonUrl?: string;
	postedAt?: string;
	message?: string;
	networks?: Partial<Record<Network, NetworkPostRecord>>;
	messages?: Partial<Record<Network, string>>;
}

interface PreparedMessage {
	network: Network;
	message: string;
	filePath: string;
	cleanup?: () => Promise<void>;
}

const SUPPORTED_NETWORKS: Record<Network, NetworkConfig> = {
	mastodon: {
		transport: "crosspost",
		flag: "--mastodon",
		requiredEnv: ["MASTODON_ACCESS_TOKEN", "MASTODON_HOST"],
		maxChars: 1000,
		supportsImages: true,
		description: "Crosspost Mastodon status with optional image attachment.",
	},
	bluesky: {
		transport: "crosspost",
		flag: "--bluesky",
		requiredEnv: ["BLUESKY_HOST", "BLUESKY_IDENTIFIER", "BLUESKY_PASSWORD"],
		maxChars: 300,
		supportsImages: true,
		description: "Crosspost Bluesky post with optional image attachment.",
	},
	linkedin: {
		transport: "crosspost",
		flag: "--linkedin",
		requiredEnv: ["LINKEDIN_ACCESS_TOKEN"],
		maxChars: 3000,
		supportsImages: true,
		description: "Crosspost LinkedIn share with optional image attachment.",
	},
	nostr: {
		transport: "crosspost",
		flag: "--nostr",
		requiredEnv: ["NOSTR_PRIVATE_KEY", "NOSTR_RELAYS"],
		maxChars: 280,
		supportsImages: false,
		description: "Crosspost Nostr text note.",
	},
	reddit: {
		transport: "direct",
		requiredEnv: [
			"REDDIT_ACCESS_TOKEN",
			"REDDIT_USER_AGENT",
			"REDDIT_SUBREDDIT",
		],
		alternativeRequiredEnv: [
			[
				"REDDIT_CLIENT_ID",
				"REDDIT_CLIENT_SECRET",
				"REDDIT_REFRESH_TOKEN",
				"REDDIT_USER_AGENT",
				"REDDIT_SUBREDDIT",
			],
		],
		maxChars: 40_000,
		supportsImages: false,
		description:
			"Direct Reddit self post via OAuth. Uses --title or derives a title from the post text.",
	},
	threads: {
		transport: "direct",
		requiredEnv: ["THREADS_ACCESS_TOKEN", "THREADS_USER_ID"],
		maxChars: 500,
		supportsImages: false,
		description:
			"Direct Threads text post via the official two-step media container/publish API.",
	},
	tumblr: {
		transport: "direct",
		requiredEnv: ["TUMBLR_ACCESS_TOKEN", "TUMBLR_BLOG_IDENTIFIER"],
		maxChars: 4096,
		supportsImages: false,
		description:
			"Direct Tumblr Neue Post Format text post via OAuth2 bearer token.",
	},
};
const DEFAULT_DOTENV_PATH = "~/.env";
const DEFAULT_LOG_PATH = "~/.local/share/dnb-post-link-into-void/posted.jsonl";
const LOGGED_MESSAGE_PREVIEW_LENGTH = 200;
const CROSSPOST_NETWORKS = (
	Object.keys(SUPPORTED_NETWORKS) as Network[]
).filter((network) => SUPPORTED_NETWORKS[network].transport === "crosspost");
const DIRECT_NETWORKS = (Object.keys(SUPPORTED_NETWORKS) as Network[]).filter(
	(network) => SUPPORTED_NETWORKS[network].transport === "direct",
);

function printHelp(): void {
	console.log(`
Post a confirmed message using @humanwhocodes/crosspost or direct network APIs,
and record each network in the shared "posted into the void" log.

Usage:
  tsx post-crosspost.ts --message-file ./message.txt --image ./shot.png --image-alt "..." --source-url https://example.com/post
  tsx post-crosspost.ts --message-file ./message.txt --message-file-bluesky ./message.bluesky.txt --message-file-nostr ./message.nostr.txt --to mastodon,bluesky,nostr
  tsx post-crosspost.ts --info

Options:
  --info                             Print configuration info and exit.
  --message <text>                   Message text to publish.
  --message-file <path>              File containing the default message text.
  --message-file-mastodon <path>     Mastodon-specific message text.
  --message-file-bluesky <path>      Bluesky-specific message text.
  --message-file-linkedin <path>     LinkedIn-specific message text.
  --message-file-nostr <path>        Nostr-specific message text.
  --message-file-reddit <path>       Reddit-specific message text.
  --message-file-threads <path>      Threads-specific message text.
  --message-file-tumblr <path>       Tumblr-specific message text.
  --title <text>                     Optional post title for networks that require one, currently Reddit.
  --to <networks>                    Comma-separated networks. Default: all configured supported networks.
  --image <path>                     Optional image path.
  --image-alt <text>                 Required when --image is used.
  --dotenv <path>                    Dotenv path for posting credentials. Default: ${DEFAULT_DOTENV_PATH}.
  --source-url <url>                 Original link this post is about. Enables log tracking.
  --canonical-url <url>              Canonical form of the source URL, if different.
  --log-path <path>                  Posted-log file path. Default: ${DEFAULT_LOG_PATH}.
  --force                            Repost even if the target network is already logged.
  --no-log                           Publish without recording to the posted log.
  --dry-run                          Validate and print the commands without publishing.
  --help                             Show this help text.

Supported Crosspost networks in this helper:
  ${CROSSPOST_NETWORKS.join(", ")}

Supported direct API networks in this helper:
  ${DIRECT_NETWORKS.join(", ")}

Required environment by network:
  Mastodon: MASTODON_ACCESS_TOKEN, MASTODON_HOST
  Bluesky: BLUESKY_HOST, BLUESKY_IDENTIFIER, BLUESKY_PASSWORD
  LinkedIn: LINKEDIN_ACCESS_TOKEN
  Nostr: NOSTR_PRIVATE_KEY, NOSTR_RELAYS
  Reddit: REDDIT_ACCESS_TOKEN, REDDIT_USER_AGENT, REDDIT_SUBREDDIT
    or REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_REFRESH_TOKEN, REDDIT_USER_AGENT, REDDIT_SUBREDDIT
  Threads: THREADS_ACCESS_TOKEN, THREADS_USER_ID
  Tumblr: TUMBLR_ACCESS_TOKEN, TUMBLR_BLOG_IDENTIFIER

Notes:
  - CROSSPOST_DOTENV is set to ~/.env unless already present.
  - Nostr, Reddit, Threads, and Tumblr posts are text-only in this helper.
  - Threads image posts require publicly hosted image URLs and are not wired here.
  - When --source-url is given, each successful network publish appends one JSON
    line to the log so future runs can post only to missing networks.
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

function getEffectiveDotenvPath(config: CliConfig): string {
	if (!process.env.CROSSPOST_DOTENV) {
		return config.dotenvPath;
	}

	if (process.env.CROSSPOST_DOTENV === "1") {
		return ".env";
	}

	return process.env.CROSSPOST_DOTENV;
}

function normaliseUrl(value: string): string {
	return value.trim().replace(/\/+$/, "").toLowerCase();
}

function isNetwork(value: string): value is Network {
	return Object.hasOwn(SUPPORTED_NETWORKS, value);
}

function parseNetworks(value: string): Network[] {
	const networks = value
		.split(",")
		.map((network) => network.trim().toLowerCase())
		.filter(Boolean);

	if (networks.length === 0) {
		throw new Error("--to must name at least one network.");
	}

	const result: Network[] = [];

	for (const network of networks) {
		if (!isNetwork(network)) {
			throw new Error(
				`Unknown network: ${network}. Supported networks here: ${Object.keys(SUPPORTED_NETWORKS).join(", ")}.`,
			);
		}

		if (!result.includes(network)) {
			result.push(network);
		}
	}

	return result;
}

function parseArgs(argv: string[]): CliConfig {
	const config: CliConfig = {
		networkMessageFiles: {},
		targetNetworks: [],
		dotenvPath: DEFAULT_DOTENV_PATH,
		logPath: DEFAULT_LOG_PATH,
		noLog: false,
		dryRun: false,
		force: false,
		info: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];

		switch (arg) {
			case "--help":
			case "-h":
				printHelp();
				process.exit(0);
				break;

			case "--info":
				config.info = true;
				break;

			case "--message":
				config.message = argv[++index];
				break;

			case "--message-file":
				config.messageFile = argv[++index];
				break;

			case "--message-file-mastodon":
				config.networkMessageFiles.mastodon = argv[++index];
				break;

			case "--message-file-bluesky":
				config.networkMessageFiles.bluesky = argv[++index];
				break;

			case "--message-file-linkedin":
				config.networkMessageFiles.linkedin = argv[++index];
				break;

			case "--message-file-nostr":
				config.networkMessageFiles.nostr = argv[++index];
				break;

			case "--message-file-reddit":
				config.networkMessageFiles.reddit = argv[++index];
				break;

			case "--message-file-threads":
				config.networkMessageFiles.threads = argv[++index];
				break;

			case "--message-file-tumblr":
				config.networkMessageFiles.tumblr = argv[++index];
				break;

			case "--title":
				config.title = argv[++index];
				break;

			case "--to":
				config.targetNetworks = parseNetworks(argv[++index] ?? "");
				break;

			case "--image":
				config.image = argv[++index];
				break;

			case "--image-alt":
				config.imageAlt = argv[++index];
				break;

			case "--dotenv":
				config.dotenvPath = argv[++index] ?? DEFAULT_DOTENV_PATH;
				break;

			case "--source-url":
				config.sourceUrl = argv[++index];
				break;

			case "--canonical-url":
				config.canonicalUrl = argv[++index];
				break;

			case "--log-path":
				config.logPath = argv[++index] ?? DEFAULT_LOG_PATH;
				break;

			case "--force":
				config.force = true;
				break;

			case "--no-log":
				config.noLog = true;
				break;

			case "--dry-run":
				config.dryRun = true;
				break;

			default:
				throw new Error(`Unknown option: ${arg}`);
		}
	}

	if (config.info) {
		return config;
	}

	if (config.message && config.messageFile) {
		throw new Error("Use either --message or --message-file, not both.");
	}

	if (!config.message && !config.messageFile) {
		throw new Error("Missing message. Use --message or --message-file.");
	}

	return config;
}

async function assertReadableFile(
	filePath: string,
	label: string,
): Promise<void> {
	try {
		await access(filePath, fsConstants.R_OK);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`${label} is not readable: ${filePath}\n${message}`);
	}
}

async function readOptionalFile(filePath: string): Promise<string | undefined> {
	try {
		await access(filePath, fsConstants.R_OK);
	} catch {
		return undefined;
	}

	return readFile(filePath, "utf8");
}

async function readDotenv(dotenvPath: string): Promise<Record<string, string>> {
	const resolved = resolve(expandHomePath(dotenvPath));
	const content = await readOptionalFile(resolved);

	if (!content) {
		return {};
	}

	const values: Record<string, string> = {};

	for (const line of content.split("\n")) {
		const trimmed = line.trim();

		if (!trimmed || trimmed.startsWith("#")) {
			continue;
		}

		const withoutExport = trimmed.startsWith("export ")
			? trimmed.slice("export ".length).trim()
			: trimmed;
		const separatorIndex = withoutExport.indexOf("=");

		if (separatorIndex === -1) {
			continue;
		}

		const key = withoutExport.slice(0, separatorIndex).trim();
		let value = withoutExport.slice(separatorIndex + 1).trim();

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		if (key) {
			values[key] = value;
		}
	}

	return values;
}

function envHasValue(
	name: string,
	dotenvValues: Record<string, string>,
): boolean {
	return Boolean(process.env[name] || dotenvValues[name]);
}

function getEnvValue(
	name: string,
	dotenvValues: Record<string, string>,
): string | undefined {
	return process.env[name] || dotenvValues[name];
}

function envRequirementGroups(networkConfig: NetworkConfig): string[][] {
	return [
		networkConfig.requiredEnv,
		...(networkConfig.alternativeRequiredEnv ?? []),
	];
}

function missingEnvForGroup(
	group: string[],
	dotenvValues: Record<string, string>,
): string[] {
	return group.filter((name) => !envHasValue(name, dotenvValues));
}

function bestMissingEnv(
	networkConfig: NetworkConfig,
	dotenvValues: Record<string, string>,
): string[] {
	const missingGroups = envRequirementGroups(networkConfig).map((group) =>
		missingEnvForGroup(group, dotenvValues),
	);

	return missingGroups.sort((a, b) => a.length - b.length)[0] ?? [];
}

function isNetworkConfigured(
	networkConfig: NetworkConfig,
	dotenvValues: Record<string, string>,
): boolean {
	return envRequirementGroups(networkConfig).some(
		(group) => missingEnvForGroup(group, dotenvValues).length === 0,
	);
}

function getConfiguredNetworks(
	dotenvValues: Record<string, string>,
): Network[] {
	return (Object.keys(SUPPORTED_NETWORKS) as Network[]).filter((network) =>
		isNetworkConfigured(SUPPORTED_NETWORKS[network], dotenvValues),
	);
}

async function fileExists(filePath: string): Promise<boolean> {
	try {
		await access(filePath, fsConstants.F_OK);
		return true;
	} catch {
		return false;
	}
}

async function printInfo(
	config: CliConfig,
	effectiveDotenvPath: string,
	dotenvValues: Record<string, string>,
): Promise<void> {
	const logPath = resolve(expandHomePath(config.logPath));
	const dotenvPath = resolve(expandHomePath(effectiveDotenvPath));
	const configuredNetworks = getConfiguredNetworks(dotenvValues);
	const networkInfo = Object.fromEntries(
		(Object.keys(SUPPORTED_NETWORKS) as Network[]).map((network) => {
			const networkConfig = SUPPORTED_NETWORKS[network];
			const missingEnv = bestMissingEnv(networkConfig, dotenvValues);

			return [
				network,
				{
					configured: missingEnv.length === 0,
					transport: networkConfig.transport,
					flag: networkConfig.flag,
					maxChars: networkConfig.maxChars,
					supportsImages: networkConfig.supportsImages,
					description: networkConfig.description,
					requiredEnvOptions: envRequirementGroups(networkConfig),
					missingEnv,
					networkSpecificDraftSuffix: `.${network}.md`,
				},
			];
		}),
	);

	console.log(
		JSON.stringify(
			{
				dotenvPath,
				logPath,
				logExists: await fileExists(logPath),
				configuredNetworks,
				supportedNetworks: networkInfo,
				crosspostNetworks: CROSSPOST_NETWORKS,
				directApiNetworks: DIRECT_NETWORKS,
				unsupportedNetworks: [],
				defaults: {
					messageFile: "<slug>.md",
					networkSpecificDraftPattern: "<slug>.<network>.md",
					crosspostDotenvEnv: "CROSSPOST_DOTENV",
				},
			},
			null,
			2,
		),
	);
}

function validateNetworkConfiguration(
	networks: Network[],
	dotenvValues: Record<string, string>,
): void {
	const missingByNetwork = networks
		.map((network) => {
			const missing = bestMissingEnv(SUPPORTED_NETWORKS[network], dotenvValues);
			return { network, missing };
		})
		.filter(({ missing }) => missing.length > 0);

	if (missingByNetwork.length === 0) {
		return;
	}

	throw new Error(
		[
			"Some requested networks are not configured:",
			...missingByNetwork.map(
				({ network, missing }) => `- ${network}: missing ${missing.join(", ")}`,
			),
		].join("\n"),
	);
}

async function createTempMessageFile(
	message: string,
	network: Network,
): Promise<{ path: string; cleanup: () => Promise<void> }> {
	const directory = await mkdtemp(join(tmpdir(), `dnb-crosspost-${network}-`));
	const filePath = join(directory, "message.txt");

	await writeFile(filePath, message, "utf8");

	return {
		path: filePath,
		cleanup: async () => {
			await rm(directory, {
				recursive: true,
				force: true,
			});
		},
	};
}

function inferredNetworkMessagePath(
	defaultMessageFile: string,
	network: Network,
): string {
	const resolved = resolve(expandHomePath(defaultMessageFile));
	const extension = extname(resolved);
	const stem = extension ? basename(resolved, extension) : basename(resolved);

	return join(dirname(resolved), `${stem}.${network}${extension || ".txt"}`);
}

async function readMessageFile(filePath: string): Promise<string> {
	const resolved = resolve(expandHomePath(filePath));
	await assertReadableFile(resolved, "Message file");
	const content = await readFile(resolved, "utf8");
	return content.trim();
}

async function prepareMessages(
	config: CliConfig,
	networks: Network[],
): Promise<PreparedMessage[]> {
	const prepared: PreparedMessage[] = [];

	for (const network of networks) {
		const networkFile = config.networkMessageFiles[network];

		if (networkFile) {
			const filePath = resolve(expandHomePath(networkFile));
			prepared.push({
				network,
				filePath,
				message: await readMessageFile(filePath),
			});
			continue;
		}

		if (config.messageFile) {
			const inferredPath = inferredNetworkMessagePath(
				config.messageFile,
				network,
			);
			const inferredContent = await readOptionalFile(inferredPath);

			if (inferredContent !== undefined) {
				prepared.push({
					network,
					filePath: inferredPath,
					message: inferredContent.trim(),
				});
				continue;
			}

			const filePath = resolve(expandHomePath(config.messageFile));
			prepared.push({
				network,
				filePath,
				message: await readMessageFile(filePath),
			});
			continue;
		}

		const tempMessage = await createTempMessageFile(
			config.message?.trim() ?? "",
			network,
		);
		prepared.push({
			network,
			filePath: tempMessage.path,
			message: config.message?.trim() ?? "",
			cleanup: tempMessage.cleanup,
		});
	}

	return prepared;
}

function validateMessageLengths(messages: PreparedMessage[]): void {
	const failures = messages
		.map((prepared) => {
			const length = [...prepared.message].length;
			const maxChars = SUPPORTED_NETWORKS[prepared.network].maxChars;
			return {
				...prepared,
				length,
				maxChars,
			};
		})
		.filter(({ length, maxChars }) => length > maxChars);

	if (failures.length === 0) {
		return;
	}

	throw new Error(
		[
			"Message length exceeds one or more network limits:",
			...failures.map(
				({ network, length, maxChars, filePath }) =>
					`- ${network}: ${length}/${maxChars} characters in ${filePath}`,
			),
			"Create a network-specific variant such as <slug>.bluesky.md or <slug>.nostr.md, or pass --message-file-<network>.",
		].join("\n"),
	);
}

async function validateImage(config: CliConfig): Promise<void> {
	if (!config.image) {
		return;
	}

	if (!config.imageAlt || config.imageAlt.trim().length === 0) {
		throw new Error("--image-alt is required when --image is used.");
	}

	const imagePath = resolve(expandHomePath(config.image));
	await assertReadableFile(imagePath, "Image file");
}

function runCommand(
	command: string,
	args: string[],
	env: NodeJS.ProcessEnv,
): Promise<CommandResult> {
	return new Promise((resolvePromise, rejectPromise) => {
		const child = spawn(command, args, {
			env,
			stdio: ["ignore", "pipe", "pipe"],
		});

		let stdout = "";
		let stderr = "";

		child.stdout.setEncoding("utf8");
		child.stderr.setEncoding("utf8");

		child.stdout.on("data", (chunk: string) => {
			stdout += chunk;
		});

		child.stderr.on("data", (chunk: string) => {
			stderr += chunk;
		});

		child.on("error", (error) => {
			rejectPromise(new Error(`Failed to start ${command}: ${error.message}`));
		});

		child.on("close", (exitCode) => {
			resolvePromise({
				exitCode: exitCode ?? 1,
				stdout,
				stderr,
			});
		});
	});
}

function extractFirstUrl(output: string): string | undefined {
	const urlMatch = output.match(/https?:\/\/[^\s"'<>]+/u);
	return urlMatch?.[0];
}

function messagePreview(message: string): string {
	return message.length > LOGGED_MESSAGE_PREVIEW_LENGTH
		? `${message.slice(0, LOGGED_MESSAGE_PREVIEW_LENGTH)}...`
		: message;
}

async function readLog(logPath: string): Promise<PostedRecord[]> {
	const content = await readOptionalFile(logPath);

	if (!content) {
		return [];
	}

	const records: PostedRecord[] = [];

	for (const line of content.split("\n")) {
		const trimmed = line.trim();

		if (!trimmed) {
			continue;
		}

		try {
			records.push(JSON.parse(trimmed) as PostedRecord);
		} catch {
			// Skip malformed lines; this log is append-only and should remain usable.
		}
	}

	return records;
}

function recordMatchesUrl(record: PostedRecord, url: string): boolean {
	const target = normaliseUrl(url);

	return (
		normaliseUrl(record.url) === target ||
		(record.canonicalUrl !== undefined &&
			normaliseUrl(record.canonicalUrl) === target)
	);
}

function hasPostedNetwork(record: PostedRecord, network: Network): boolean {
	if (record.networks?.[network]) {
		return true;
	}

	return network === "mastodon" && Boolean(record.mastodonUrl);
}

function alreadyPostedNetworks(
	records: PostedRecord[],
	url: string | undefined,
	networks: Network[],
): Network[] {
	if (!url) {
		return [];
	}

	return networks.filter((network) =>
		records.some(
			(record) =>
				recordMatchesUrl(record, url) && hasPostedNetwork(record, network),
		),
	);
}

async function recordPostedNetwork(
	config: CliConfig,
	prepared: PreparedMessage,
	publishedUrl: string,
): Promise<void> {
	if (config.noLog || !config.sourceUrl) {
		return;
	}

	const logPath = resolve(expandHomePath(config.logPath));
	await mkdir(dirname(logPath), { recursive: true });

	const postedAt = new Date().toISOString();
	const record: PostedRecord = {
		url: config.sourceUrl,
		canonicalUrl: config.canonicalUrl,
		postedAt,
		message: messagePreview(prepared.message),
		networks: {
			[prepared.network]: {
				url: publishedUrl,
				postedAt,
			},
		},
		messages: {
			[prepared.network]: messagePreview(prepared.message),
		},
	};

	if (prepared.network === "mastodon") {
		record.mastodonUrl = publishedUrl;
	}

	await appendFile(logPath, `${JSON.stringify(record)}\n`, "utf8");
}

function commandForNetwork(
	prepared: PreparedMessage,
	config: CliConfig,
): string[] {
	const networkConfig = SUPPORTED_NETWORKS[prepared.network];

	if (networkConfig.transport !== "crosspost" || !networkConfig.flag) {
		throw new Error(`${prepared.network} is not a Crosspost network.`);
	}

	const args = [
		"--yes",
		"@humanwhocodes/crosspost",
		networkConfig.flag,
		"--file",
		prepared.filePath,
	];

	if (config.image && SUPPORTED_NETWORKS[prepared.network].supportsImages) {
		args.push("--image", resolve(expandHomePath(config.image)));
		args.push("--image-alt", config.imageAlt ?? "");
	}

	return args;
}

function requireEnvValue(
	name: string,
	dotenvValues: Record<string, string>,
): string {
	const value = getEnvValue(name, dotenvValues);

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

function redactSecrets(
	text: string,
	dotenvValues: Record<string, string>,
): string {
	let redacted = text;
	const values = [
		...Object.values(dotenvValues),
		...Object.values(process.env).filter(
			(value): value is string => typeof value === "string",
		),
	]
		.filter((value) => value.length >= 8)
		.sort((a, b) => b.length - a.length);

	for (const value of values) {
		redacted = redacted.split(value).join("[redacted]");
	}

	return redacted;
}

async function responseBodyPreview(response: Response): Promise<string> {
	const text = await response.text();
	return text.length > 1000 ? `${text.slice(0, 1000)}...` : text;
}

async function fetchJson(
	url: string,
	init: RequestInit,
	label: string,
	dotenvValues: Record<string, string>,
): Promise<unknown> {
	const response = await fetch(url, init);
	const body = await responseBodyPreview(response);

	if (!response.ok) {
		throw new Error(
			`${label} failed with HTTP ${response.status}: ${redactSecrets(body, dotenvValues)}`,
		);
	}

	if (!body.trim()) {
		return {};
	}

	try {
		return JSON.parse(body);
	} catch {
		throw new Error(
			`${label} returned non-JSON response: ${redactSecrets(body, dotenvValues)}`,
		);
	}
}

function asRecord(value: unknown): Record<string, unknown> {
	return value && typeof value === "object"
		? (value as Record<string, unknown>)
		: {};
}

function firstString(...values: unknown[]): string | undefined {
	for (const value of values) {
		if (typeof value === "string" && value.trim()) {
			return value;
		}

		if (typeof value === "number" && Number.isFinite(value)) {
			return String(value);
		}
	}

	return undefined;
}

function deriveTitle(
	message: string,
	explicitTitle: string | undefined,
): string {
	const title =
		explicitTitle?.trim() ??
		message
			.split("\n")
			.map((line) => line.trim())
			.find(Boolean) ??
		"Shared link";

	return [...title].slice(0, 300).join("");
}

async function getRedditAccessToken(
	dotenvValues: Record<string, string>,
): Promise<string> {
	const accessToken = getEnvValue("REDDIT_ACCESS_TOKEN", dotenvValues);

	if (accessToken) {
		return accessToken;
	}

	const clientId = requireEnvValue("REDDIT_CLIENT_ID", dotenvValues);
	const clientSecret = requireEnvValue("REDDIT_CLIENT_SECRET", dotenvValues);
	const refreshToken = requireEnvValue("REDDIT_REFRESH_TOKEN", dotenvValues);
	const userAgent = requireEnvValue("REDDIT_USER_AGENT", dotenvValues);
	const body = new URLSearchParams({
		grant_type: "refresh_token",
		refresh_token: refreshToken,
	});
	const json = asRecord(
		await fetchJson(
			"https://www.reddit.com/api/v1/access_token",
			{
				method: "POST",
				headers: {
					Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
					"Content-Type": "application/x-www-form-urlencoded",
					"User-Agent": userAgent,
				},
				body,
			},
			"Reddit access-token refresh",
			dotenvValues,
		),
	);
	const refreshedToken = firstString(json.access_token);

	if (!refreshedToken) {
		throw new Error("Reddit access-token refresh did not return access_token.");
	}

	return refreshedToken;
}

async function postReddit(
	prepared: PreparedMessage,
	context: DirectPublishContext,
): Promise<string> {
	const { config, dotenvValues } = context;
	const token = await getRedditAccessToken(dotenvValues);
	const subreddit = requireEnvValue("REDDIT_SUBREDDIT", dotenvValues);
	const userAgent = requireEnvValue("REDDIT_USER_AGENT", dotenvValues);
	const body = new URLSearchParams({
		api_type: "json",
		kind: "self",
		resubmit: "true",
		sendreplies: "true",
		sr: subreddit,
		text: prepared.message,
		title: deriveTitle(prepared.message, config.title),
	});
	const flairId = getEnvValue("REDDIT_FLAIR_ID", dotenvValues);

	if (flairId) {
		body.set("flair_id", flairId);
	}

	const json = asRecord(
		await fetchJson(
			"https://oauth.reddit.com/api/submit",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/x-www-form-urlencoded",
					"User-Agent": userAgent,
				},
				body,
			},
			"Reddit submit",
			dotenvValues,
		),
	);
	const responseJson = asRecord(json.json);
	const errors = responseJson.errors;

	if (Array.isArray(errors) && errors.length > 0) {
		throw new Error(
			`Reddit submit returned errors: ${redactSecrets(JSON.stringify(errors), dotenvValues)}`,
		);
	}

	const data = asRecord(responseJson.data);
	const url = firstString(data.url, data.permalink);

	if (url?.startsWith("/")) {
		return `https://www.reddit.com${url}`;
	}

	return url ?? "unknown";
}

async function postThreads(
	prepared: PreparedMessage,
	context: DirectPublishContext,
): Promise<string> {
	const { dotenvValues } = context;
	const userId = requireEnvValue("THREADS_USER_ID", dotenvValues);
	const accessToken = requireEnvValue("THREADS_ACCESS_TOKEN", dotenvValues);
	const createBody = new URLSearchParams({
		access_token: accessToken,
		media_type: "TEXT",
		text: prepared.message,
	});

	const created = asRecord(
		await fetchJson(
			`https://graph.threads.net/v1.0/${encodeURIComponent(userId)}/threads`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: createBody,
			},
			"Threads media container creation",
			dotenvValues,
		),
	);
	const creationId = firstString(created.id);

	if (!creationId) {
		throw new Error("Threads media container creation did not return id.");
	}

	const publishBody = new URLSearchParams({
		access_token: accessToken,
		creation_id: creationId,
	});
	const published = asRecord(
		await fetchJson(
			`https://graph.threads.net/v1.0/${encodeURIComponent(userId)}/threads_publish`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: publishBody,
			},
			"Threads publish",
			dotenvValues,
		),
	);
	const username = getEnvValue("THREADS_USERNAME", dotenvValues);
	const postId = firstString(published.id);

	if (username && postId) {
		return `https://www.threads.net/@${username}/post/${postId}`;
	}

	return postId ? `threads:${postId}` : "unknown";
}

async function postTumblr(
	prepared: PreparedMessage,
	context: DirectPublishContext,
): Promise<string> {
	const { dotenvValues } = context;
	const accessToken = requireEnvValue("TUMBLR_ACCESS_TOKEN", dotenvValues);
	const blogIdentifier = requireEnvValue(
		"TUMBLR_BLOG_IDENTIFIER",
		dotenvValues,
	);
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
							text: prepared.message,
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

	return (
		url ?? (id ? `https://www.tumblr.com/${blogIdentifier}/${id}` : "unknown")
	);
}

async function publishDirectNetwork(
	prepared: PreparedMessage,
	context: DirectPublishContext,
): Promise<string> {
	switch (prepared.network) {
		case "reddit":
			return postReddit(prepared, context);

		case "threads":
			return postThreads(prepared, context);

		case "tumblr":
			return postTumblr(prepared, context);

		default:
			throw new Error(`${prepared.network} is not a direct API network.`);
	}
}

async function main(): Promise<void> {
	const config = parseArgs(process.argv.slice(2));
	const effectiveDotenvPath = getEffectiveDotenvPath(config);
	const dotenvValues = await readDotenv(effectiveDotenvPath);

	if (config.info) {
		await printInfo(config, effectiveDotenvPath, dotenvValues);
		return;
	}

	const configuredNetworks = getConfiguredNetworks(dotenvValues);
	const selectedNetworks =
		config.targetNetworks.length > 0
			? config.targetNetworks
			: configuredNetworks;

	if (selectedNetworks.length === 0) {
		throw new Error(
			`No supported networks are configured. Add env vars for one of: ${Object.keys(SUPPORTED_NETWORKS).join(", ")}.`,
		);
	}

	validateNetworkConfiguration(selectedNetworks, dotenvValues);
	await validateImage(config);

	const logPath = resolve(expandHomePath(config.logPath));
	const records = await readLog(logPath);
	const loggedNetworks = config.force
		? []
		: alreadyPostedNetworks(
				records,
				config.canonicalUrl ?? config.sourceUrl,
				selectedNetworks,
			);
	const networksToPost = selectedNetworks.filter(
		(network) => !loggedNetworks.includes(network),
	);

	if (networksToPost.length === 0) {
		console.log(
			`Already posted to all requested networks: ${selectedNetworks.join(", ")}`,
		);
		return;
	}

	const preparedMessages = await prepareMessages(config, networksToPost);
	validateMessageLengths(preparedMessages);

	const env: NodeJS.ProcessEnv = {
		...process.env,
		CROSSPOST_DOTENV:
			process.env.CROSSPOST_DOTENV ??
			resolve(expandHomePath(effectiveDotenvPath)),
	};
	const published: string[] = [];

	try {
		if (loggedNetworks.length > 0) {
			console.log(
				`Skipping already-posted networks: ${loggedNetworks.join(", ")}`,
			);
		}

		for (const prepared of preparedMessages) {
			const networkConfig = SUPPORTED_NETWORKS[prepared.network];

			if (config.dryRun) {
				console.log(`Dry run for ${prepared.network}. No post was published.`);
				console.log(`Transport: ${networkConfig.transport}`);
				if (networkConfig.transport === "crosspost") {
					const args = commandForNetwork(prepared, config);
					console.log(
						`Command: npx ${args.map((arg) => JSON.stringify(arg)).join(" ")}`,
					);
				} else {
					console.log(`Direct API: ${networkConfig.description}`);
				}
				console.log(`Characters: ${[...prepared.message].length}`);
				console.log(`CROSSPOST_DOTENV: ${env.CROSSPOST_DOTENV}`);
				continue;
			}

			let url: string;

			if (networkConfig.transport === "crosspost") {
				const args = commandForNetwork(prepared, config);
				const result = await runCommand("npx", args, env);
				const combinedOutput = [result.stdout, result.stderr]
					.filter(Boolean)
					.join("\n")
					.trim();

				if (result.exitCode !== 0) {
					throw new Error(
						`Crosspost failed for ${prepared.network} with exit code ${result.exitCode}.\n${combinedOutput}`,
					);
				}

				url = extractFirstUrl(combinedOutput) ?? "unknown";
			} else {
				url = await publishDirectNetwork(prepared, {
					config,
					dotenvValues,
				});
			}

			await recordPostedNetwork(config, prepared, url);
			published.push(`${prepared.network}: ${url}`);
		}
	} finally {
		await Promise.all(preparedMessages.map((prepared) => prepared.cleanup?.()));
	}

	if (config.dryRun) {
		return;
	}

	if (published.length === 0) {
		console.log("No networks were published.");
		return;
	}

	console.log("Published:");

	for (const line of published) {
		console.log(`- ${line}`);
	}
}

main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`Error: ${message}`);
	process.exitCode = 1;
});
