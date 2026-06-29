#!/usr/bin/env node

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse } from "smol-toml";

type LinkMode = "global" | "local";

interface CliOptions {
	readonly force: boolean;
	readonly mode: LinkMode;
	readonly verbose: boolean;
}

interface LinkDefinition {
	readonly sourceRelativePath: string;
	readonly targetRelativePath: string;
}

interface LinkPlan extends LinkDefinition {
	readonly sourcePath: string;
	readonly targetPath: string;
}

interface LinkResult extends LinkPlan {
	readonly action: "created" | "replaced" | "ok";
}

const CONFIG = {
	allowRoot: process.env["ALLOW_ROOT_POSTINSTALL_SYMLINK"] === "1",
	configFileName: "config.toml",
};

export class SymlinkError extends Error {
	readonly details: Record<string, string>;

	constructor(message: string, details: Record<string, string> = {}) {
		super(message);
		this.name = "SymlinkError";
		this.details = details;
	}
}

function reportOk(message: string): void {
	console.log(`ok: ${message}`);
}

function reportWarning(message: string, details: Record<string, string>): void {
	console.warn(`warning: ${message}`);

	for (const [key, value] of Object.entries(details)) {
		console.warn(`${key}: ${value}`);
	}
}

function reportError(error: unknown): void {
	console.error("error: could not ensure configured AI symlinks");

	if (error instanceof SymlinkError) {
		console.error(error.message);

		for (const [key, value] of Object.entries(error.details)) {
			console.error(`${key}: ${value}`);
		}

		return;
	}

	if (error instanceof Error) {
		console.error(error.message);
		return;
	}

	console.error(String(error));
}

async function pathExists(filePath: string): Promise<boolean> {
	try {
		await fs.lstat(filePath);
		return true;
	} catch (error: unknown) {
		if (isNodeError(error) && error.code === "ENOENT") {
			return false;
		}

		throw error;
	}
}

async function assertNotUnsafeRootRun(
	repoRoot: string,
	targetBasePath: string,
): Promise<void> {
	if (typeof process.getuid !== "function") {
		return;
	}

	if (process.getuid() !== 0) {
		return;
	}

	if (CONFIG.allowRoot) {
		return;
	}

	throw new SymlinkError(
		"Refusing to run as root. In postinstall scripts this commonly creates links under /root instead of the user's home directory.",
		{
			hint: "Run npm install without sudo, or set ALLOW_ROOT_POSTINSTALL_SYMLINK=1 if this is intentional.",
			repoRoot,
			targetBasePath,
		},
	);
}

export function parseArgs(argv: readonly string[]): CliOptions {
	let force = false;
	let mode: LinkMode | undefined;
	let verbose = false;

	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];

		if (argument === "--force") {
			force = true;
			continue;
		}

		if (argument === "--verbose") {
			verbose = true;
			continue;
		}

		if (argument === "--global") {
			mode = setMode(mode, "global", argument);
			continue;
		}

		if (argument === "--local") {
			mode = setMode(mode, "local", argument);
			continue;
		}

		if (argument === "--mode") {
			const value = argv[index + 1];

			if (value === undefined) {
				throw new SymlinkError("--mode requires a value of global or local.");
			}

			mode = setMode(mode, parseMode(value, "--mode"), "--mode");
			index += 1;
			continue;
		}

		if (argument?.startsWith("--mode=")) {
			mode = setMode(
				mode,
				parseMode(argument.slice("--mode=".length), "--mode"),
				"--mode",
			);
			continue;
		}

		if (argument === "global" || argument === "local") {
			mode = setMode(mode, argument, "mode argument");
			continue;
		}

		throw new SymlinkError(`Unknown option: ${argument}`, {
			usage:
				"node scripts/ai-symlink.ts [global|local|--mode global|--mode local] [--force] [--verbose]",
		});
	}

	return {
		force,
		mode: mode ?? "global",
		verbose,
	};
}

function parseMode(value: string, label: string): LinkMode {
	if (value === "global" || value === "local") {
		return value;
	}

	throw new SymlinkError(`${label} must be global or local.`, {
		value,
	});
}

function setMode(
	current: LinkMode | undefined,
	next: LinkMode,
	source: string,
): LinkMode {
	if (current !== undefined && current !== next) {
		throw new SymlinkError("Choose only one linking mode.", {
			current,
			next,
			source,
		});
	}

	return next;
}

function getScriptRepoRoot(): string {
	const scriptPath = fileURLToPath(import.meta.url);

	return path.dirname(path.dirname(scriptPath));
}

async function loadLinkDefinitions(
	repoRoot: string,
	mode: LinkMode,
): Promise<readonly LinkDefinition[]> {
	const configPath = path.join(repoRoot, CONFIG.configFileName);

	try {
		const content = await fs.readFile(configPath, "utf8");
		const parsed = parse(content);

		return parseLinkDefinitions(parsed, mode, configPath);
	} catch (error: unknown) {
		throw new SymlinkError(`Could not load ${configPath}.`, {
			reason: getErrorMessage(error),
		});
	}
}

export function parseLinkDefinitions(
	value: unknown,
	mode: LinkMode,
	configPath: string,
): readonly LinkDefinition[] {
	const root = requirePlainObject(value, CONFIG.configFileName);
	const linking = requirePlainObject(root["linking"], "linking");
	const section = requirePlainObject(linking[mode], `linking.${mode}`);
	const definitions: LinkDefinition[] = [];

	for (const [sourceRelativePath, targetRelativePath] of Object.entries(
		section,
	)) {
		definitions.push({
			sourceRelativePath: requireSafeRelativePath(
				sourceRelativePath,
				`linking.${mode} key`,
				configPath,
			),
			targetRelativePath: requireSafeRelativePath(
				requireString(
					targetRelativePath,
					`linking.${mode}.${sourceRelativePath}`,
				),
				`linking.${mode}.${sourceRelativePath}`,
				configPath,
			),
		});
	}

	if (definitions.length === 0) {
		throw new SymlinkError(`No symlinks configured in linking.${mode}.`, {
			configPath,
		});
	}

	return definitions;
}

export function buildLinkPlans(
	definitions: readonly LinkDefinition[],
	repoRoot: string,
	targetBasePath: string,
): readonly LinkPlan[] {
	return definitions.map((definition) => ({
		...definition,
		sourcePath: path.resolve(repoRoot, definition.sourceRelativePath),
		targetPath: path.resolve(targetBasePath, definition.targetRelativePath),
	}));
}

async function assertSourceIsValid(plan: LinkPlan): Promise<void> {
	let stats: Awaited<ReturnType<typeof fs.lstat>>;

	try {
		stats = await fs.lstat(plan.sourcePath);
	} catch (error: unknown) {
		if (isNodeError(error) && error.code === "ENOENT") {
			throw new SymlinkError(
				"The source path does not exist. Refusing to create a broken symlink.",
				{
					sourcePath: plan.sourcePath,
					targetPath: plan.targetPath,
				},
			);
		}

		throw error;
	}

	if (!stats.isDirectory()) {
		throw new SymlinkError(
			"The source path exists, but it is not a directory.",
			{
				sourcePath: plan.sourcePath,
				targetPath: plan.targetPath,
			},
		);
	}
}

async function getComparableRealPath(filePath: string): Promise<string> {
	return fs.realpath(filePath);
}

async function inspectExistingSymlink(plan: LinkPlan): Promise<"ok" | "wrong"> {
	const linkTarget = await fs.readlink(plan.targetPath);
	const absoluteLinkTarget = path.isAbsolute(linkTarget)
		? linkTarget
		: path.resolve(path.dirname(plan.targetPath), linkTarget);
	const expectedRealPath = await getComparableRealPath(plan.sourcePath);

	let existingRealPath: string;

	try {
		existingRealPath = await getComparableRealPath(absoluteLinkTarget);
	} catch (_error: unknown) {
		reportWarning(
			"The target already exists as a symlink, but it points to a missing or inaccessible path.",
			{
				targetPath: plan.targetPath,
				currentLinkTarget: linkTarget,
				expectedLinkTarget: plan.sourcePath,
			},
		);

		return "wrong";
	}

	if (existingRealPath === expectedRealPath) {
		return "ok";
	}

	reportWarning(
		"The target already exists as a symlink, but it points elsewhere.",
		{
			targetPath: plan.targetPath,
			currentLinkTarget: linkTarget,
			expectedLinkTarget: plan.sourcePath,
		},
	);

	return "wrong";
}

async function createSymlink(plan: LinkPlan): Promise<LinkResult> {
	await fs.mkdir(path.dirname(plan.targetPath), { recursive: true });
	await fs.symlink(plan.sourcePath, plan.targetPath, "dir");

	return {
		...plan,
		action: "created",
	};
}

async function replaceSymlink(plan: LinkPlan): Promise<LinkResult> {
	await fs.unlink(plan.targetPath);
	await fs.symlink(plan.sourcePath, plan.targetPath, "dir");

	return {
		...plan,
		action: "replaced",
	};
}

async function ensureSymlink(
	plan: LinkPlan,
	force: boolean,
): Promise<LinkResult> {
	await assertSourceIsValid(plan);

	const targetExists = await pathExists(plan.targetPath);

	if (!targetExists) {
		return createSymlink(plan);
	}

	const targetStats = await fs.lstat(plan.targetPath);

	if (!targetStats.isSymbolicLink()) {
		throw new SymlinkError(
			"The target path already exists and is not a symlink. Refusing to replace it.",
			{
				targetPath: plan.targetPath,
				expectedLinkTarget: plan.sourcePath,
			},
		);
	}

	const existingState = await inspectExistingSymlink(plan);

	if (existingState === "ok") {
		return {
			...plan,
			action: "ok",
		};
	}

	if (!force) {
		throw new SymlinkError(
			"Use --force to replace the existing symlink with the configured target.",
			{
				targetPath: plan.targetPath,
				expectedLinkTarget: plan.sourcePath,
			},
		);
	}

	return replaceSymlink(plan);
}

function requirePlainObject(
	value: unknown,
	label: string,
): Record<string, unknown> {
	if (!isPlainObject(value)) {
		throw new SymlinkError(`${label} must be an object.`);
	}

	return value;
}

function requireString(value: unknown, label: string): string {
	if (typeof value !== "string" || value.trim() === "") {
		throw new SymlinkError(`${label} must be a non-empty quoted string.`);
	}

	return value;
}

export function requireSafeRelativePath(
	value: string,
	label: string,
	configPath: string,
): string {
	if (value !== value.trim()) {
		throw new SymlinkError(
			`${label} must not contain surrounding whitespace.`,
			{
				configPath,
				value,
			},
		);
	}

	if (path.isAbsolute(value) || path.win32.isAbsolute(value)) {
		throw new SymlinkError(`${label} must be relative.`, {
			configPath,
			value,
		});
	}

	if (value.includes("\0")) {
		throw new SymlinkError(`${label} must not contain NUL characters.`, {
			configPath,
			value,
		});
	}

	if (/[\r\n\t]/u.test(value)) {
		throw new SymlinkError(`${label} must not contain control whitespace.`, {
			configPath,
			value,
		});
	}

	const normalised = value.replaceAll("\\", "/");
	const segments = normalised.split("/");

	if (segments.some((segment) => segment === "")) {
		throw new SymlinkError(`${label} must not contain empty path segments.`, {
			configPath,
			value,
		});
	}

	for (const segment of segments) {
		if (segment === "." || segment === "..") {
			throw new SymlinkError(`${label} must not contain . or .. segments.`, {
				configPath,
				value,
			});
		}

		if (segment.includes("~")) {
			throw new SymlinkError(`${label} must not contain tildes.`, {
				configPath,
				value,
			});
		}

		if (!/^[A-Za-z0-9._-]+$/u.test(segment)) {
			throw new SymlinkError(
				`${label} must use only letters, numbers, dots, underscores, and hyphens in path segments.`,
				{
					configPath,
					value,
				},
			);
		}
	}

	return normalised;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
	return error instanceof Error && "code" in error;
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	return String(error);
}

export function formatGitignorePath(
	result: LinkResult,
	targetBasePath: string,
): string {
	const relativePath = path.relative(targetBasePath, result.targetPath);
	const posixPath = relativePath.split(path.sep).join("/");

	return `${posixPath}/`;
}

function reportSummary(
	results: readonly LinkResult[],
	targetBasePath: string,
	verbose: boolean,
): void {
	const created = results.filter((result) => result.action === "created");
	const replaced = results.filter((result) => result.action === "replaced");
	const ok = results.filter((result) => result.action === "ok");

	reportOk(
		`symlink summary: ${created.length} created, ${replaced.length} replaced, ${ok.length} already correct`,
	);

	if (!verbose) {
		return;
	}

	const changed = [...created, ...replaced];

	if (changed.length === 0) {
		console.log("# no symlinks created or replaced");
		return;
	}

	console.log("# created or replaced symlinks");

	for (const result of changed) {
		console.log(formatGitignorePath(result, targetBasePath));
	}
}

async function main(): Promise<void> {
	const options = parseArgs(process.argv.slice(2));
	const repoRoot = getScriptRepoRoot();
	const targetBasePath =
		options.mode === "global" ? os.homedir() : process.cwd();
	const definitions = await loadLinkDefinitions(repoRoot, options.mode);
	const plans = buildLinkPlans(definitions, repoRoot, targetBasePath);
	const results: LinkResult[] = [];

	await assertNotUnsafeRootRun(repoRoot, targetBasePath);

	for (const plan of plans) {
		const result = await ensureSymlink(plan, options.force);
		results.push(result);
		reportOk(`${result.action}: ${result.targetPath} -> ${result.sourcePath}`);
	}

	reportSummary(results, targetBasePath, options.verbose);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
	main().catch((error: unknown) => {
		reportError(error);
		process.exitCode = 1;
	});
}
