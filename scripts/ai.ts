#!/usr/bin/env -S node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import yaml from "yaml";
import { z } from "zod";
import {
	AgentSchema,
	AllowedKeys,
	DocSchema,
	InstructionSchema,
	PromptSchema,
	ReferencesSchema,
	type RegistryItemKind,
	SkillSchema,
} from "./lib/ai-schema.ts";
import {
	buildFolderPromptGlob,
	buildRecursivePromptGlob,
	loadRepositoryConfig,
	type PromptSetupMode,
	type RepositoryConfig,
	resolveConfiguredPath,
	toPosixPath,
} from "./lib/config.ts";

/**
 * Supported CLI commands.
 */
type CommandName =
	| "help"
	| "list"
	| "show"
	| "validate"
	| "lint"
	| "validate-skills"
	| "drift-report"
	| "export-schemas"
	| "build-documentation"
	| "setup"
	| "check";

/**
 * Lint issue severity.
 */
type LintSeverity = "warning" | "error";

/**
 * Frontmatter data type.
 */
type FrontmatterRecord = Record<string, unknown>;

/**
 * CLI options.
 */
interface CliOptions {
	command: CommandName;
	rootDir: string;
	schemaDir: string;
	useRepositoryAssetFilter: boolean;
	id?: string;
	json: boolean;
	verbose: boolean;
	includeContent: boolean;
	noExitOnError: boolean;
	release: boolean;
	mode?: PromptSetupMode;
}

/**
 * Registry item after parsing.
 */
interface RegistryItem {
	id: string;
	title: string;
	kind: RegistryItemKind;
	absolutePath: string;
	relativePath: string;
	body: string;
	frontmatter: FrontmatterRecord;
}

/**
 * Validation issue for a single file.
 */
interface ValidationIssue {
	severity: "error";
	code: string;
	message: string;
	file: string;
}

/**
 * Lint issue for a single file.
 */
interface LintIssue {
	severity: LintSeverity;
	code: string;
	message: string;
	file: string;
}

/**
 * Validation result for one file.
 */
interface ValidationResult {
	item: RegistryItem;
	issues: ValidationIssue[];
}

/**
 * Lint result for one file.
 */
interface LintResult {
	item: RegistryItem;
	issues: LintIssue[];
}

/**
 * Drift report structure.
 */
interface DriftReport {
	unknownKeys: Record<string, string[]>;
	filesWithUnknownKeys: Record<string, string[]>;
}

/**
 * Minimal directory entry used for prompt setup and generated documentation.
 */
interface PromptFolder {
	readonly name: string;
	readonly relativePath: string;
}

/**
 * VS Code settings object.
 */
type SettingsJson = Record<string, unknown>;

/**
 * Prompt files location setting value.
 */
type PromptFilesLocations = Record<string, boolean>;

const REPOSITORY_ASSET_DIRECTORIES = [
	"prompts",
	"instructions",
	"agents",
	"documentation",
	path.join("ai", "templates"),
	path.join("ai", "workflows"),
];

/**
 * Standalone skill frontmatter accepted by SKILL.md-based skill directories.
 */
const SkillDirectoryFrontmatterSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().min(1).optional(),
		description: z.string().min(1).max(1024).optional(),
		references: ReferencesSchema,
	})
	.passthrough();

type SkillDirectoryFrontmatter = z.infer<
	typeof SkillDirectoryFrontmatterSchema
>;

/**
 * Validation result for a SKILL.md skill directory.
 */
interface SkillDirectoryValidationResult {
	skillDirectory: string;
	skillName: string;
	skillFile: string;
	frontmatter: SkillDirectoryFrontmatter;
}

/**
 * Main entrypoint.
 */
async function main(): Promise<void> {
	try {
		const options = parseArgs(process.argv.slice(2));

		switch (options.command) {
			case "help":
				printHelp();
				return;
			case "list":
				await runList(options);
				return;
			case "show":
				await runShow(options);
				return;
			case "validate":
				await runValidate(options);
				return;
			case "lint":
				await runLint(options);
				return;
			case "validate-skills":
				await runValidateSkills(options);
				return;
			case "drift-report":
				await runDriftReport(options);
				return;
			case "export-schemas":
				await runExportSchemas(options);
				return;
			case "build-documentation":
				await runBuildDocumentation(options);
				return;
			case "setup":
				await runSetup(options);
				return;
			case "check":
				await runCheck(options);
				return;
			default:
				assertNever(options.command);
		}
	} catch (error: unknown) {
		printError(getErrorMessage(error));
		process.exit(1);
	}
}

/**
 * Parse command-line arguments.
 *
 * @param argv CLI arguments after script name.
 * @returns Parsed CLI options.
 */
function parseArgs(argv: string[]): CliOptions {
	if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
		return {
			command: "help",
			rootDir: defaultRegistryRoot(),
			schemaDir: defaultSchemaRoot(),
			useRepositoryAssetFilter: true,
			json: false,
			verbose: false,
			includeContent: true,
			noExitOnError: false,
			release: false,
		};
	}

	const commandToken = argv[0] ?? "help";
	if (!isCommandName(commandToken)) {
		throw new Error(
			`I do not know what to do with "${commandToken}". Run "ai help" for available commands.`,
		);
	}

	const command = commandToken;

	const options: CliOptions = {
		command,
		rootDir:
			command === "validate-skills"
				? defaultSkillsRoot()
				: defaultRegistryRoot(),
		schemaDir: defaultSchemaRoot(),
		useRepositoryAssetFilter: command !== "validate-skills",
		json: argv.includes("--json"),
		verbose: argv.includes("--verbose"),
		includeContent: !argv.includes("--no-content"),
		noExitOnError:
			argv.includes("--no-exit-on-error") || argv.includes("--noExitOnError"),
		release: argv.includes("--release"),
	};

	for (let index = 1; index < argv.length; index += 1) {
		const token = argv[index];

		if (token === "--root") {
			const value = argv[index + 1];
			if (!value) {
				throw new Error("Missing value for --root");
			}
			options.rootDir = path.resolve(process.cwd(), value);
			options.useRepositoryAssetFilter = false;
			index += 1;
			continue;
		}

		if (token === "--schemas") {
			const value = argv[index + 1];
			if (!value) {
				throw new Error("Missing value for --schemas");
			}
			options.schemaDir = path.resolve(process.cwd(), value);
			index += 1;
			continue;
		}

		if (token === "--id") {
			const value = argv[index + 1];
			if (!value) {
				throw new Error("Missing value for --id");
			}
			options.id = value;
			index += 1;
			continue;
		}

		if (token === "--mode") {
			const value = argv[index + 1];
			if (!value) {
				throw new Error("Missing value for --mode");
			}
			options.mode = parsePromptSetupMode(value);
			index += 1;
		}
	}

	return options;
}

/**
 * Create a contextual file error message.
 *
 * @param filePath Relative or absolute file path.
 * @param error Unknown error value.
 * @returns Formatted error string.
 */
function formatFileError(filePath: string, error: unknown): string {
	const message = getErrorMessage(error);
	return `${filePath}: ${message}`;
}

/**
 * Check whether a token is a supported command.
 *
 * @param value Raw command token.
 * @returns True if valid.
 */
function isCommandName(value: string): value is CommandName {
	return (
		value === "help" ||
		value === "list" ||
		value === "show" ||
		value === "validate" ||
		value === "lint" ||
		value === "validate-skills" ||
		value === "drift-report" ||
		value === "export-schemas" ||
		value === "build-documentation" ||
		value === "setup" ||
		value === "check"
	);
}

/**
 * Parse a prompt setup mode option.
 *
 * @param value Raw mode option value.
 * @returns Prompt setup mode.
 */
function parsePromptSetupMode(value: string): PromptSetupMode {
	if (value === "glob" || value === "folders") {
		return value;
	}

	throw new Error('--mode must be "glob" or "folders".');
}

/**
 * Default registry root directory.
 *
 * @returns Absolute path to the repository root.
 */
function defaultRegistryRoot(): string {
	return getScriptRepoRoot();
}

/**
 * Default SKILL.md skill root directory.
 *
 * @returns Absolute path to `skills`.
 */
function defaultSkillsRoot(): string {
	return path.resolve(getScriptRepoRoot(), "skills");
}

/**
 * Default schema output directory.
 *
 * @returns Absolute path to `schemas`.
 */
function defaultSchemaRoot(): string {
	return path.resolve(getScriptRepoRoot(), "schemas");
}

/**
 * Resolve the repository root from this script location.
 *
 * @returns Absolute path to the repository root.
 */
function getScriptRepoRoot(): string {
	const scriptPath = fileURLToPath(import.meta.url);

	return path.dirname(path.dirname(scriptPath));
}

/**
 * Print CLI usage.
 */
function printHelp(): void {
	const scriptName = path.basename(process.argv[1] ?? "ai.ts");
	const commandName = scriptName.endsWith(".ts")
		? `node ./scripts/${scriptName}`
		: scriptName;

	console.log(`Usage: ${commandName} <command> [options]

Commands:
  help
  list
  show --id <id>
  validate
  lint
  validate-skills
  drift-report
  export-schemas
  build-documentation
  setup --prompts
  check

Options:
  --root <path>           Registry root (default: current repository); for validate-skills, skills root (default: ./skills)
  --schemas <path>        Schema output directory (default: ./schemas)
  --id <id>               Item id for show
  --mode glob|folders     Prompt setup mode for setup --prompts
  --json                  Output JSON
  --verbose               Show additional diagnostics
  --no-content            Do not print item body in show
  --release               Promote warnings to errors where applicable
  --no-exit-on-error      Do not exit non-zero on validation/lint/check failure
  --noExitOnError         Alias for --no-exit-on-error
  --help, -h              Show this help

Examples:
  ${commandName} list
  ${commandName} show --id test-from-behaviour-spec
  ${commandName} validate
  ${commandName} lint
  ${commandName} validate-skills --verbose
  ${commandName} drift-report
  ${commandName} export-schemas
  ${commandName} build-documentation --verbose
  ${commandName} setup --prompts --mode glob
  ${commandName} check --release

validate-skills rules:
  - The skills root must exist.
  - Skill directories may be direct children or one level below a numbered category.
  - Each skill directory must contain SKILL.md.
  - SKILL.md must start with non-empty YAML frontmatter and a non-empty body.
  - Frontmatter must contain an id field.
  - The skill directory name must match the frontmatter id.
  - If name exists, it must match id.
  - id must match /^[a-z0-9-]+$/.
`);
}

/**
 * Run the list command.
 *
 * @param options CLI options.
 */
async function runList(options: CliOptions): Promise<void> {
	const items = await loadRegistryItems(options);

	const output = items.map((item) => ({
		id: item.id,
		title: item.title,
		kind: item.kind,
		file: item.relativePath,
	}));

	if (options.json) {
		console.log(JSON.stringify(output, null, 2));
		return;
	}

	for (const item of output) {
		console.log(`${item.kind.padEnd(6)} ${item.id}  ${item.file}`);
	}
}

/**
 * Run the show command.
 *
 * @param options CLI options.
 */
async function runShow(options: CliOptions): Promise<void> {
	if (!options.id) {
		throw new Error("The show command requires --id <id>");
	}

	const items = await loadRegistryItems(options);
	const matchingItems = items.filter(
		(candidate) => candidate.id === options.id,
	);

	if (matchingItems.length === 0) {
		throw new Error(`No item found with id: ${options.id}`);
	}

	if (matchingItems.length > 1) {
		throw new Error(
			`Multiple items found with id "${options.id}": ${matchingItems
				.map((item) => item.relativePath)
				.join(", ")}`,
		);
	}

	const [item] = matchingItems;

	if (!item) {
		throw new Error(`No item found with id: ${options.id}`);
	}

	if (options.json) {
		console.log(
			JSON.stringify(
				{
					id: item.id,
					title: item.title,
					kind: item.kind,
					file: item.relativePath,
					frontmatter: item.frontmatter,
					body: options.includeContent ? item.body : undefined,
				},
				null,
				2,
			),
		);
		return;
	}

	console.log(`# ${item.title}`);
	console.log("");
	console.log(`* id: ${item.id}`);
	console.log(`* kind: ${item.kind}`);
	console.log(`* file: ${item.relativePath}`);
	console.log("");
	console.log("Frontmatter:");
	console.log("```yaml");
	console.log(yaml.stringify(item.frontmatter).trimEnd());
	console.log("```");

	if (options.includeContent) {
		console.log("");
		console.log("Body:");
		console.log("```md");
		console.log(item.body.trimEnd());
		console.log("```");
	}
}

/**
 * Run the validate command.
 *
 * Validation is binary at the schema level.
 *
 * @param options CLI options.
 */
async function runValidate(options: CliOptions): Promise<void> {
	const items = await loadRegistryItems(options);
	const results = items.map((item) => validateRegistryItem(item));
	const errorCount = results.reduce(
		(sum, result) => sum + result.issues.length,
		0,
	);

	if (options.json) {
		console.log(
			JSON.stringify(
				{
					summary: {
						files: results.length,
						errors: errorCount,
					},
					results,
				},
				null,
				2,
			),
		);
	} else {
		for (const result of results) {
			if (result.issues.length === 0) {
				console.log(`[ok] ${result.item.relativePath}`);
				continue;
			}

			console.log(`[errors] ${result.item.relativePath}`);
			for (const issue of result.issues) {
				console.log(`  [error] ${issue.code}: ${issue.message}`);
			}
		}

		console.log("");
		console.log(
			`Checked ${results.length} file(s), found ${errorCount} schema error(s).`,
		);
	}

	if (errorCount > 0 && !options.noExitOnError) {
		process.exit(1);
	}
}

/**
 * Build lint issues for duplicate ids across the whole registry.
 *
 * @param items Loaded registry items.
 * @param release Whether release mode is active.
 * @returns Duplicate-id lint issues keyed by file path.
 */
function buildDuplicateIdIssues(
	items: RegistryItem[],
	_release: boolean,
): Map<string, LintIssue[]> {
	const idsToItems = new Map<string, RegistryItem[]>();

	for (const item of items) {
		const existingItems = idsToItems.get(item.id) ?? [];
		existingItems.push(item);
		idsToItems.set(item.id, existingItems);
	}

	const issuesByFile = new Map<string, LintIssue[]>();

	for (const [id, duplicateItems] of idsToItems.entries()) {
		if (duplicateItems.length < 2) {
			continue;
		}

		const duplicateFiles = duplicateItems
			.map((item) => item.relativePath)
			.sort((left, right) => left.localeCompare(right));

		for (const item of duplicateItems) {
			const otherFiles = duplicateFiles.filter(
				(file) => file !== item.relativePath,
			);
			const issues = issuesByFile.get(item.relativePath) ?? [];

			issues.push({
				severity: "error",
				code: "duplicate-id",
				message: `Duplicate id "${id}" also used in: ${otherFiles.join(", ")}`,
				file: item.relativePath,
			});

			issuesByFile.set(item.relativePath, issues);
		}
	}

	return issuesByFile;
}

/**
 * Run the lint command.
 *
 * @param options CLI options.
 */
async function runLint(options: CliOptions): Promise<void> {
	const items = await loadRegistryItems(options);
	const results = items.map((item) => lintRegistryItem(item, options.release));

	const duplicateIdIssues = buildDuplicateIdIssues(items, options.release);

	for (const result of results) {
		const extraIssues = duplicateIdIssues.get(result.item.relativePath) ?? [];
		result.issues.push(...extraIssues);
	}
	const summary = summariseLintResults(results);

	if (options.json) {
		console.log(
			JSON.stringify(
				{
					summary,
					results,
				},
				null,
				2,
			),
		);
	} else {
		for (const result of results) {
			if (result.issues.length === 0) {
				console.log(`[ok] ${result.item.relativePath}`);
				continue;
			}

			console.log(`[issues] ${result.item.relativePath}`);
			for (const issue of result.issues) {
				console.log(`  [${issue.severity}] ${issue.code}: ${issue.message}`);
			}
		}

		console.log("");
		console.log(
			`Checked ${summary.files} file(s), found ${summary.errors} error(s), ${summary.warnings} warning(s), ${summary.total} total issue(s).`,
		);
	}

	if (summary.errors > 0 && !options.noExitOnError) {
		process.exit(1);
	}
}

/**
 * Run the validate-skills command.
 *
 * This validates categorized or legacy direct child directories that use
 * Codex-style SKILL.md files.
 *
 * @param options CLI options.
 */
async function runValidateSkills(options: CliOptions): Promise<void> {
	const results = await validateSkillDirectories(
		options.rootDir,
		options.verbose,
	);

	if (options.json) {
		console.log(
			JSON.stringify(
				{
					summary: {
						skills: results.length,
						root: path.relative(process.cwd(), options.rootDir),
					},
					results: results.map((result) => ({
						skillName: result.skillName,
						skillDirectory: path.relative(process.cwd(), result.skillDirectory),
						skillFile: path.relative(process.cwd(), result.skillFile),
						frontmatter: result.frontmatter,
					})),
				},
				null,
				2,
			),
		);
		return;
	}

	console.log(
		`Validated ${results.length} skill(s) in ${path.relative(
			process.cwd(),
			options.rootDir,
		)}.`,
	);
}

/**
 * Validate all skill directories in a skills root.
 *
 * @param rootDirectory Skills root directory.
 * @param verbose Whether to print validated paths.
 * @returns Validated skill directory results.
 */
async function validateSkillDirectories(
	rootDirectory: string,
	verbose: boolean,
): Promise<SkillDirectoryValidationResult[]> {
	const absoluteRoot = path.resolve(process.cwd(), rootDirectory);
	const rootStat = await fs.stat(absoluteRoot).catch((error: unknown) => {
		throw new Error(
			`Skills root does not exist: ${absoluteRoot}. ${getErrorMessage(error)}`,
		);
	});

	if (!rootStat.isDirectory()) {
		throw new Error(`Skills root is not a directory: ${absoluteRoot}`);
	}

	const entries = await fs.readdir(absoluteRoot, {
		withFileTypes: true,
	});

	const skillDirectories = (
		await Promise.all(
			entries
				.filter((entry) => entry.isDirectory())
				.map((entry) =>
					findSkillDirectories(path.join(absoluteRoot, entry.name)),
				),
		)
	)
		.flat()
		.sort((left, right) => left.localeCompare(right));

	if (skillDirectories.length === 0) {
		throw new Error(`No skill directories found in: ${absoluteRoot}`);
	}

	const seenIds = new Set<string>();
	const results: SkillDirectoryValidationResult[] = [];

	for (const skillDirectory of skillDirectories) {
		const result = await validateSkillDirectory(skillDirectory);

		if (seenIds.has(result.frontmatter.id)) {
			throw new Error(`Duplicate skill id found: ${result.frontmatter.id}`);
		}

		seenIds.add(result.frontmatter.id);
		results.push(result);

		if (verbose) {
			console.log(
				`Validated: ${path.relative(process.cwd(), result.skillFile)}`,
			);
		}
	}

	return results;
}

/**
 * Find direct or one-level categorized skill directories.
 *
 * @param directory Candidate directory under the skills root.
 * @returns Skill directories containing a top-level SKILL.md.
 */
async function findSkillDirectories(directory: string): Promise<string[]> {
	if (await fileExists(path.join(directory, "SKILL.md"))) {
		return [directory];
	}

	const entries = await fs.readdir(directory, {
		withFileTypes: true,
	});

	const nestedSkillDirectories: string[] = [];

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		const nestedDirectory = path.join(directory, entry.name);

		if (await fileExists(path.join(nestedDirectory, "SKILL.md"))) {
			nestedSkillDirectories.push(nestedDirectory);
		}
	}

	return nestedSkillDirectories;
}

/**
 * Validate one SKILL.md skill directory.
 *
 * @param skillDirectory Absolute path to the skill directory.
 * @returns Validated skill metadata.
 */
async function validateSkillDirectory(
	skillDirectory: string,
): Promise<SkillDirectoryValidationResult> {
	const skillName = path.basename(skillDirectory);
	const skillFile = path.join(skillDirectory, "SKILL.md");
	const skillFileStat = await fs.stat(skillFile).catch((error: unknown) => {
		throw new Error(
			`${skillDirectory}: Missing SKILL.md. ${getErrorMessage(error)}`,
		);
	});

	if (!skillFileStat.isFile()) {
		throw new Error(`${skillFile}: SKILL.md must be a file.`);
	}

	const content = await fs.readFile(skillFile, "utf8");
	const extracted = extractSkillFrontmatter(content, skillFile);
	const parsed = SkillDirectoryFrontmatterSchema.safeParse(
		extracted.frontmatter,
	);

	if (!parsed.success) {
		throw new Error(
			`${skillFile}: Invalid frontmatter: ${z.prettifyError(parsed.error)}`,
		);
	}

	const frontmatter = parsed.data;

	if (!/^[a-z0-9-]+$/u.test(frontmatter.id)) {
		throw new Error(
			`${skillFile}: Frontmatter id "${frontmatter.id}" must match /^[a-z0-9-]+$/.`,
		);
	}

	if (skillName !== frontmatter.id) {
		throw new Error(
			`${skillFile}: Skill directory "${skillName}" must match frontmatter id "${frontmatter.id}".`,
		);
	}

	if (frontmatter.name !== undefined && frontmatter.name !== frontmatter.id) {
		throw new Error(
			`${skillFile}: Optional frontmatter name "${frontmatter.name}" must match id "${frontmatter.id}".`,
		);
	}

	return {
		skillDirectory,
		skillName,
		skillFile,
		frontmatter,
	};
}

/**
 * Extract YAML frontmatter and Markdown body from a SKILL.md file.
 *
 * @param content Raw SKILL.md content.
 * @param filePath File path used for error messages.
 * @returns Parsed frontmatter and Markdown body.
 */
function extractSkillFrontmatter(
	content: string,
	filePath: string,
): {
	frontmatter: unknown;
	body: string;
} {
	if (!content.startsWith("---\n")) {
		throw new Error(`${filePath}: SKILL.md must start with YAML frontmatter.`);
	}

	const closingFenceIndex = content.indexOf("\n---", 4);

	if (closingFenceIndex === -1) {
		throw new Error(
			`${filePath}: YAML frontmatter is missing its closing --- fence.`,
		);
	}

	const yamlContent = content.slice(4, closingFenceIndex).trim();
	const body = content.slice(closingFenceIndex + 4).trim();

	if (yamlContent.length === 0) {
		throw new Error(`${filePath}: YAML frontmatter must not be empty.`);
	}

	if (body.length === 0) {
		throw new Error(`${filePath}: Markdown body must not be empty.`);
	}

	try {
		return {
			frontmatter: yaml.parse(yamlContent),
			body,
		};
	} catch (error: unknown) {
		throw new Error(
			`${filePath}: Failed to parse YAML frontmatter: ${getErrorMessage(error)}`,
		);
	}
}

/**
 * Run the drift-report command.
 *
 * @param options CLI options.
 */
async function runDriftReport(options: CliOptions): Promise<void> {
	const items = await loadRegistryItems(options);
	const report = buildDriftReport(items);

	if (options.json) {
		console.log(JSON.stringify(report, null, 2));
		return;
	}

	console.log("# Schema drift report");
	console.log("");

	const unknownKeys = Object.keys(report.unknownKeys).sort();

	if (unknownKeys.length === 0) {
		console.log("No unknown frontmatter keys found.");
		return;
	}

	console.log("Unknown frontmatter keys:");
	for (const key of unknownKeys) {
		console.log(`* ${key}`);
		const files = report.unknownKeys[key];
		if (!files) {
			continue;
		}

		for (const file of files) {
			console.log(`  * ${file}`);
		}
	}

	console.log("");
	console.log("Files with unknown keys:");
	for (const [file, keys] of Object.entries(report.filesWithUnknownKeys).sort(
		(a, b) => a[0].localeCompare(b[0]),
	)) {
		console.log(`* ${file}`);
		for (const key of keys) {
			console.log(`  * ${key}`);
		}
	}
}

/**
 * Run the export-schemas command.
 *
 * @param options CLI options.
 */
async function runExportSchemas(options: CliOptions): Promise<void> {
	await fs.mkdir(options.schemaDir, { recursive: true });

	const promptSchemaJson = z.toJSONSchema(PromptSchema, {
		target: "draft-7",
	});

	const agentSchemaJson = z.toJSONSchema(AgentSchema, {
		target: "draft-7",
	});

	const skillSchemaJson = z.toJSONSchema(SkillSchema, {
		target: "draft-7",
	});

	const docSchemaJson = z.toJSONSchema(DocSchema, {
		target: "draft-7",
	});
	const instructionSchemaJson = z.toJSONSchema(InstructionSchema, {
		target: "draft-7",
	});

	addGeneratedComment(
		promptSchemaJson,
		"Generated from scripts/ai.ts. Do not edit manually.",
	);
	addGeneratedComment(
		agentSchemaJson,
		"Generated from scripts/ai.ts. Do not edit manually.",
	);
	addGeneratedComment(
		skillSchemaJson,
		"Generated from scripts/ai.ts. Do not edit manually.",
	);
	addGeneratedComment(
		docSchemaJson,
		"Generated from scripts/ai.ts. Do not edit manually.",
	);
	addGeneratedComment(
		instructionSchemaJson,
		"Generated from scripts/ai.ts. Do not edit manually.",
	);

	const promptOutputPath = path.join(options.schemaDir, "prompt.schema.json");
	const agentOutputPath = path.join(options.schemaDir, "agent.schema.json");
	const skillOutputPath = path.join(options.schemaDir, "skill.schema.json");
	const docOutputPath = path.join(options.schemaDir, "doc.schema.json");
	const instructionOutputPath = path.join(
		options.schemaDir,
		"instruction.schema.json",
	);

	await fs.writeFile(
		promptOutputPath,
		`${JSON.stringify(promptSchemaJson, null, 2)}\n`,
		"utf8",
	);
	await fs.writeFile(
		agentOutputPath,
		`${JSON.stringify(agentSchemaJson, null, 2)}\n`,
		"utf8",
	);
	await fs.writeFile(
		skillOutputPath,
		`${JSON.stringify(skillSchemaJson, null, 2)}\n`,
		"utf8",
	);
	await fs.writeFile(
		docOutputPath,
		`${JSON.stringify(docSchemaJson, null, 2)}\n`,
		"utf8",
	);
	await fs.writeFile(
		instructionOutputPath,
		`${JSON.stringify(instructionSchemaJson, null, 2)}\n`,
		"utf8",
	);

	if (options.json) {
		console.log(
			JSON.stringify(
				{
					written: [
						promptOutputPath,
						agentOutputPath,
						skillOutputPath,
						docOutputPath,
						instructionOutputPath,
					],
				},
				null,
				2,
			),
		);
		return;
	}

	console.log(`[ok] ${path.relative(process.cwd(), promptOutputPath)}`);
	console.log(`[ok] ${path.relative(process.cwd(), agentOutputPath)}`);
	console.log(`[ok] ${path.relative(process.cwd(), skillOutputPath)}`);
	console.log(`[ok] ${path.relative(process.cwd(), docOutputPath)}`);
	console.log(`[ok] ${path.relative(process.cwd(), instructionOutputPath)}`);
}

/**
 * Run the build-documentation command.
 *
 * @param options CLI options.
 */
async function runBuildDocumentation(options: CliOptions): Promise<void> {
	const rootDir = options.rootDir;
	const config = await loadRepositoryConfig(rootDir);
	const readmePath = resolveConfiguredPath(rootDir, config.paths.readme);
	const promptsRoot = resolveConfiguredPath(
		rootDir,
		config.paths.promptFilesRoot,
	);

	const readme = await fs.readFile(readmePath, "utf8");
	const promptFolders = await listPromptFolders(rootDir, promptsRoot);
	const replacement = buildGeneratedPromptSettingsSection(
		config,
		promptFolders,
	);
	const updated = replaceMarkedSection(readme, replacement, config);

	await fs.writeFile(readmePath, updated, "utf8");

	if (options.verbose) {
		console.log(`[ok] Updated ${path.relative(rootDir, readmePath)}`);
		console.log(`[ok] Found ${promptFolders.length} prompt folder(s)`);
	}
}

/**
 * Run the setup command.
 *
 * @param options CLI options.
 */
async function runSetup(options: CliOptions): Promise<void> {
	const rootDir = options.rootDir;
	const config = await loadRepositoryConfig(rootDir);

	await setupPromptFilesLocation({
		rootDir,
		settingsPath: resolveConfiguredPath(rootDir, config.paths.vscodeSettings),
		promptMode: options.mode ?? config.prompts.defaultSetupMode,
		verbose: options.verbose,
		config,
	});
}

/**
 * Add or update the VS Code prompt files location setting.
 *
 * @param options Prompt setup options.
 */
async function setupPromptFilesLocation(options: {
	readonly rootDir: string;
	readonly settingsPath: string;
	readonly promptMode: PromptSetupMode;
	readonly verbose: boolean;
	readonly config: RepositoryConfig;
}): Promise<void> {
	await fs.mkdir(path.dirname(options.settingsPath), { recursive: true });

	const settings = await readSettingsJson(options.settingsPath);
	const locations =
		options.promptMode === "glob"
			? buildGlobPromptLocations(options.config)
			: await buildFolderPromptLocations(options.rootDir, options.config);

	settings[options.config.prompts.settingKey] = locations;

	await fs.writeFile(
		options.settingsPath,
		`${JSON.stringify(settings, null, 2)}\n`,
		"utf8",
	);

	if (options.verbose) {
		console.log(
			`[ok] Updated ${path.relative(options.rootDir, options.settingsPath)}`,
		);
		console.log(`[ok] Prompt setup mode: ${options.promptMode}`);
		console.log(`[ok] Prompt entries: ${Object.keys(locations).length}`);
	}
}

/**
 * Build prompt locations for recursive glob mode.
 *
 * @param config Repository config.
 * @returns Prompt file locations setting.
 */
function buildGlobPromptLocations(
	config: RepositoryConfig,
): PromptFilesLocations {
	return {
		[buildRecursivePromptGlob(config)]: true,
	};
}

/**
 * Build prompt locations for individual folder mode.
 *
 * @param rootDir Repository root directory.
 * @param config Repository config.
 * @returns Prompt file locations setting.
 */
async function buildFolderPromptLocations(
	rootDir: string,
	config: RepositoryConfig,
): Promise<PromptFilesLocations> {
	const promptsRoot = resolveConfiguredPath(
		rootDir,
		config.paths.promptFilesRoot,
	);
	const folders = await listPromptFolders(rootDir, promptsRoot);
	const locations: PromptFilesLocations = {};

	for (const folder of folders) {
		locations[buildFolderPromptGlob(config, folder.relativePath)] = true;
	}

	return locations;
}

/**
 * List direct prompt folders under the configured prompt files root.
 *
 * @param rootDir Repository root directory.
 * @param promptsRoot Absolute prompt files root path.
 * @returns Sorted prompt folder list.
 */
async function listPromptFolders(
	rootDir: string,
	promptsRoot: string,
): Promise<PromptFolder[]> {
	try {
		const entries = await fs.readdir(promptsRoot, {
			withFileTypes: true,
		});

		return entries
			.filter((entry) => entry.isDirectory())
			.map((entry) => {
				const absolutePath = path.join(promptsRoot, entry.name);

				return {
					name: entry.name,
					relativePath: toPosixPath(path.relative(rootDir, absolutePath)),
				};
			})
			.sort((left, right) =>
				left.relativePath.localeCompare(right.relativePath),
			);
	} catch (error: unknown) {
		if (isNodeError(error) && error.code === "ENOENT") {
			return [];
		}

		throw error;
	}
}

/**
 * Read JSON or JSONC-ish VS Code settings.
 *
 * This parser supports line comments and trailing commas. It does not support
 * block comments.
 *
 * @param settingsPath Absolute settings path.
 * @returns Parsed settings object.
 */
async function readSettingsJson(settingsPath: string): Promise<SettingsJson> {
	try {
		const content = await fs.readFile(settingsPath, "utf8");
		const cleaned = stripJsonCommentsAndTrailingCommas(content);
		const parsed: unknown = JSON.parse(cleaned);

		if (!isPlainObject(parsed)) {
			throw new Error(`${settingsPath} must contain a JSON object.`);
		}

		return parsed;
	} catch (error: unknown) {
		if (isNodeError(error) && error.code === "ENOENT") {
			return {};
		}

		throw error;
	}
}

/**
 * Strip line comments and trailing commas from JSONC-like content.
 *
 * @param content Raw JSONC content.
 * @returns JSON-compatible content.
 */
function stripJsonCommentsAndTrailingCommas(content: string): string {
	const withoutLineComments = content
		.split("\n")
		.map((line) => stripLineComment(line))
		.join("\n");

	return withoutLineComments.replace(/,\s*([}\]])/gu, "$1");
}

/**
 * Strip a `//` comment from one line while preserving strings.
 *
 * @param line Input line.
 * @returns Line without comments.
 */
function stripLineComment(line: string): string {
	let inString = false;
	let escaped = false;

	for (let index = 0; index < line.length - 1; index += 1) {
		const current = line[index];
		const next = line[index + 1];

		if (current === "\\" && !escaped) {
			escaped = true;
			continue;
		}

		if (current === '"' && !escaped) {
			inString = !inString;
		}

		if (!inString && current === "/" && next === "/") {
			return line.slice(0, index);
		}

		escaped = false;
	}

	return line;
}

/**
 * Build the generated README prompt settings section.
 *
 * @param config Repository config.
 * @param promptFolders Prompt folders found under the configured prompt root.
 * @returns Markdown content to place between the markers.
 */
function buildGeneratedPromptSettingsSection(
	config: RepositoryConfig,
	promptFolders: readonly PromptFolder[],
): string {
	const startMarker = config.readme.promptFilesSettings.startMarker;
	const endMarker = config.readme.promptFilesSettings.endMarker;
	const settingKey = config.prompts.settingKey;
	const recursiveGlob = buildRecursivePromptGlob(config);
	const folderEntries = buildPromptFolderEntries(config, promptFolders);

	return `${startMarker}
<!-- This section is generated by \`npm run build:documentation\` (\`node ./scripts/ai.ts build-documentation\`). Do not edit manually. -->

## VS code prompt file recommendations

VS Code can load prompt files from configured workspace locations. This repository keeps prompt files under \`${config.paths.promptFilesRoot}/\`.

There are two useful configuration styles.

### Option 1: one recursive glob

Use this when all prompt recommendations should be available at once and new folders should be picked up automatically.

\`\`\`jsonc
{
  "${settingKey}": {
    "${recursiveGlob}": true
  }
}
\`\`\`

### Option 2: individual folder entries

Use this when prompt recommendation groups should be enabled or disabled independently.

\`\`\`jsonc
{
  "${settingKey}": {
${folderEntries}
  }
}
\`\`\`

${endMarker}`;
}

/**
 * Build JSONC lines for the individual folder configuration sample.
 *
 * @param config Repository config.
 * @param promptFolders Prompt folders.
 * @returns JSONC object entries.
 */
function buildPromptFolderEntries(
	config: RepositoryConfig,
	promptFolders: readonly PromptFolder[],
): string {
	if (promptFolders.length === 0) {
		const fallback = buildFolderPromptGlob(
			config,
			path.posix.join(config.paths.promptFilesRoot, "example"),
		);

		return `    "${fallback}": true`;
	}

	return promptFolders
		.map((folder, index) => {
			const suffix = index === promptFolders.length - 1 ? "" : ",";
			const folderGlob = buildFolderPromptGlob(config, folder.relativePath);

			return `    "${folderGlob}": true${suffix}`;
		})
		.join("\n");
}

/**
 * Replace a marked section in a Markdown file.
 *
 * @param content Original Markdown content.
 * @param replacement Full replacement content, including markers.
 * @param config Repository config.
 * @returns Updated Markdown content.
 */
function replaceMarkedSection(
	content: string,
	replacement: string,
	config: RepositoryConfig,
): string {
	const startMarker = config.readme.promptFilesSettings.startMarker;
	const endMarker = config.readme.promptFilesSettings.endMarker;
	const startIndex = content.indexOf(startMarker);
	const endIndex = content.indexOf(endMarker);

	if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
		throw new Error(
			`README.md must contain ${startMarker} and ${endMarker} markers.`,
		);
	}

	const before = content.slice(0, startIndex).trimEnd();
	const after = content.slice(endIndex + endMarker.length).trimStart();

	return `${before}\n\n${replacement}\n\n${after}`;
}

/**
 * Run the check command.
 *
 * This combines:
 * - validate
 * - lint
 *
 * @param options CLI options.
 */
async function runCheck(options: CliOptions): Promise<void> {
	const items = await loadRegistryItems(options);
	const validationResults = items.map((item) => validateRegistryItem(item));
	const lintResults = items.map((item) =>
		lintRegistryItem(item, options.release),
	);

	const duplicateIdIssues = buildDuplicateIdIssues(items, options.release);

	for (const result of lintResults) {
		const extraIssues = duplicateIdIssues.get(result.item.relativePath) ?? [];
		result.issues.push(...extraIssues);
	}

	const validationErrorCount = validationResults.reduce(
		(sum, result) => sum + result.issues.length,
		0,
	);

	const lintSummary = summariseLintResults(lintResults);
	const totalErrors = validationErrorCount + lintSummary.errors;
	const totalWarnings = lintSummary.warnings;

	if (options.json) {
		console.log(
			JSON.stringify(
				{
					summary: {
						files: items.length,
						validationErrors: validationErrorCount,
						lintErrors: lintSummary.errors,
						lintWarnings: lintSummary.warnings,
						totalErrors,
						totalWarnings,
					},
					validationResults,
					lintResults,
				},
				null,
				2,
			),
		);
	} else {
		console.log(`Validation errors: ${validationErrorCount}`);
		console.log(`Lint errors: ${lintSummary.errors}`);
		console.log(`Lint warnings: ${lintSummary.warnings}`);
		console.log(`Total errors: ${totalErrors}`);
		console.log(`Total warnings: ${totalWarnings}`);
	}

	if (totalErrors > 0 && !options.noExitOnError) {
		process.exit(1);
	}
}

/**
 * Load all registry items from disk.
 *
 * @param options CLI options.
 * @returns Loaded items.
 */
async function loadRegistryItems(options: CliOptions): Promise<RegistryItem[]> {
	const files = options.useRepositoryAssetFilter
		? await walkRepositoryAssetDirectories(options.rootDir)
		: await walkDirectory(options.rootDir);
	const markdownFiles = files.filter((filePath) => {
		if (!filePath.endsWith(".md")) return false;

		// Inside skills/, only installable direct or categorized SKILL.md files
		// are registry items. Ancillary files in references/, examples/, bundled
		// plugin folders, etc. are not.
		const rel = path.relative(options.rootDir, filePath);
		const parts = rel.split(path.sep);
		if (parts[0] === "skills") {
			return isRegistrySkillFile(parts);
		}
		return true;
	});
	const items: RegistryItem[] = [];

	for (const absolutePath of markdownFiles) {
		const relativePath = path.relative(process.cwd(), absolutePath);

		try {
			const item = await loadRegistryItem(absolutePath, options.rootDir);
			items.push(item);
		} catch (error: unknown) {
			printError(formatFileError(relativePath, error));

			if (options.verbose) {
				console.error(`[verbose] absolute_path=${absolutePath}`);

				if (error instanceof Error && error.stack) {
					console.error("[verbose] stack:");
					console.error(error.stack);
				}
			}

			if (!options.noExitOnError) {
				process.exit(1);
			}
		}
	}

	items.sort((left, right) => left.id.localeCompare(right.id));
	return items;
}

/**
 * Check whether a path under skills/ is a registry skill entrypoint.
 *
 * @param parts Repository-relative path parts.
 * @returns True when the path is a direct or categorized SKILL.md entrypoint.
 */
function isRegistrySkillFile(parts: readonly string[]): boolean {
	return (
		(parts.length === 3 && parts[2] === "SKILL.md") ||
		(parts.length === 4 && parts[3] === "SKILL.md")
	);
}

/**
 * Walk the managed repository-level AI asset directories.
 *
 * @param rootDir Repository root directory.
 * @returns Absolute file paths from existing asset directories.
 */
async function walkRepositoryAssetDirectories(
	rootDir: string,
): Promise<string[]> {
	const files: string[] = [];

	for (const relativeDirectory of REPOSITORY_ASSET_DIRECTORIES) {
		const absoluteDirectory = path.join(rootDir, relativeDirectory);
		if (await directoryExists(absoluteDirectory)) {
			files.push(...(await walkDirectory(absoluteDirectory)));
		}
	}

	return files;
}

/**
 * Load one registry item from disk.
 *
 * @param absolutePath Absolute file path.
 * @param rootDir Registry root directory.
 * @returns Parsed registry item.
 */
async function loadRegistryItem(
	absolutePath: string,
	rootDir: string,
): Promise<RegistryItem> {
	const content = await fs.readFile(absolutePath, "utf8");
	const { frontmatter, body } = parseFrontmatter(content);
	const kind = detectKind(absolutePath, frontmatter);
	const relativePath = path.relative(rootDir, absolutePath);
	const id =
		kind === "prompt"
			? (getStringField(frontmatter, "name") ??
				deriveIdFromFilename(absolutePath))
			: (getStringField(frontmatter, "id") ??
				deriveIdFromFilename(absolutePath));
	const title =
		getStringField(frontmatter, "title") ??
		getStringField(frontmatter, "name") ??
		path.basename(absolutePath);

	return {
		id,
		title,
		kind,
		absolutePath,
		relativePath,
		body,
		frontmatter,
	};
}

/**
 * Parse YAML frontmatter and Markdown body.
 *
 * @param content File content.
 * @returns Parsed frontmatter and body.
 */
function parseFrontmatter(content: string): {
	frontmatter: FrontmatterRecord;
	body: string;
} {
	const normalized = content.replace(/^\uFEFF/u, "");
	const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/u);

	if (!match) {
		throw new Error(
			"Missing or malformed YAML frontmatter block. Expected a leading --- block.",
		);
	}

	const [, frontmatterRaw = "", body = ""] = match;

	let parsed: unknown;

	try {
		parsed = yaml.parse(frontmatterRaw);
	} catch (error: unknown) {
		throw new Error(`Invalid YAML frontmatter: ${getErrorMessage(error)}`);
	}

	if (!isPlainObject(parsed)) {
		throw new Error("Frontmatter must parse to an object.");
	}

	return {
		frontmatter: parsed,
		body,
	};
}

/**
 * Detect item kind.
 *
 * @param absolutePath Absolute file path.
 * @param frontmatter Frontmatter object.
 * @returns Detected kind.
 */
function detectKind(
	absolutePath: string,
	frontmatter: FrontmatterRecord,
): RegistryItemKind {
	const explicitType = getStringField(frontmatter, "type");

	if (explicitType === "skill") {
		return "skill";
	}

	if (absolutePath.includes(`${path.sep}skills${path.sep}`)) {
		return "skill";
	}

	if (absolutePath.includes(`${path.sep}agents${path.sep}`)) {
		return "agent";
	}

	if (absolutePath.includes(`${path.sep}documentation${path.sep}`)) {
		return "doc";
	}

	if (absolutePath.includes(`${path.sep}instructions${path.sep}`)) {
		return "instruction";
	}

	return "prompt";
}

/**
 * Validate one registry item strictly against schema.
 *
 * @param item Registry item.
 * @returns Validation result.
 */
function validateRegistryItem(item: RegistryItem): ValidationResult {
	const schema =
		item.kind === "agent"
			? AgentSchema
			: item.kind === "skill"
				? SkillSchema
				: item.kind === "doc"
					? DocSchema
					: item.kind === "instruction"
						? InstructionSchema
						: PromptSchema;

	const result = schema.safeParse(item.frontmatter);
	const issues: ValidationIssue[] = [];

	if (!result.success) {
		for (const issue of result.error.issues) {
			const issuePath = issue.path.length > 0 ? issue.path.join(".") : "<root>";
			issues.push({
				severity: "error",
				code: "schema-validation",
				message: `${issuePath}: ${issue.message}`,
				file: item.relativePath,
			});
		}
	}

	return { item, issues };
}

/**
 * Lint one registry item.
 *
 * This layer supports warnings and errors.
 * In release mode, warnings are promoted to errors.
 *
 * @param item Registry item.
 * @param release Whether release mode is active.
 * @returns Lint result.
 */
function lintRegistryItem(item: RegistryItem, release: boolean): LintResult {
	const issues: LintIssue[] = [];

	const unknownKeys = getUnknownFrontmatterKeys(item.frontmatter, item.kind);
	for (const key of unknownKeys) {
		issues.push({
			severity: release ? "error" : "warning",
			code: "schema-drift",
			message: `Unknown frontmatter key "${key}" detected.`,
			file: item.relativePath,
		});
	}

	if (item.body.trim().length === 0) {
		issues.push({
			severity: release ? "error" : "warning",
			code: "empty-body",
			message: "Body content is empty.",
			file: item.relativePath,
		});
	}

	if (item.kind === "doc" && !item.absolutePath.endsWith(".doc.md")) {
		issues.push({
			severity: release ? "error" : "warning",
			code: "naming",
			message: "Doc file should use the .doc.md suffix.",
			file: item.relativePath,
		});
	}

	if (
		item.kind === "instruction" &&
		!item.absolutePath.endsWith(".instructions.md")
	) {
		issues.push({
			severity: release ? "error" : "warning",
			code: "naming",
			message: "Instruction file should use the .instructions.md suffix.",
			file: item.relativePath,
		});
	}

	if (
		item.kind === "instruction" &&
		!item.absolutePath.includes(`${path.sep}instructions${path.sep}`)
	) {
		issues.push({
			severity: release ? "error" : "warning",
			code: "location",
			message:
				"Instruction file should be in the instructions directory (subfolders are allowed).",
			file: item.relativePath,
		});
	}

	if (item.kind === "doc") {
		if (
			typeof item.frontmatter["description"] !== "string" ||
			item.frontmatter["description"].trim() === ""
		) {
			issues.push({
				severity: "error",
				code: "missing-description",
				message: "Doc description is missing or empty.",
				file: item.relativePath,
			});
		}
	}

	if (item.kind === "instruction") {
		if (
			typeof item.frontmatter["description"] !== "string" ||
			item.frontmatter["description"].trim() === ""
		) {
			issues.push({
				severity: "error",
				code: "missing-description",
				message: "Instruction description is missing or empty.",
				file: item.relativePath,
			});
		}

		if (
			typeof item.frontmatter["applyTo"] !== "string" ||
			item.frontmatter["applyTo"].trim() === ""
		) {
			issues.push({
				severity: "error",
				code: "missing-apply-to",
				message: "Instruction applyTo is missing or empty.",
				file: item.relativePath,
			});
		}
	}

	if (item.kind === "prompt" && !item.absolutePath.endsWith(".prompt.md")) {
		issues.push({
			severity: release ? "error" : "warning",
			code: "naming",
			message: "Prompt file should use the .prompt.md suffix.",
			file: item.relativePath,
		});
	}

	if (
		item.kind === "agent" &&
		path.basename(item.absolutePath) !== "agent.md"
	) {
		issues.push({
			severity: release ? "error" : "warning",
			code: "naming",
			message:
				"Agent file should use the .agents protocol path agents/<category>/<id>/agent.md.",
			file: item.relativePath,
		});
	}

	if (
		item.kind === "skill" &&
		!item.absolutePath.endsWith(".skill.md") &&
		path.basename(item.absolutePath) !== "SKILL.md"
	) {
		issues.push({
			severity: release ? "error" : "warning",
			code: "naming",
			message:
				"Skill file should use the .skill.md suffix unless it is an installable skills/<category>/<id>/SKILL.md file.",
			file: item.relativePath,
		});
	}

	if (item.kind === "agent") {
		if (
			typeof item.frontmatter["id"] !== "string" ||
			item.frontmatter["id"].trim() === ""
		) {
			issues.push({
				severity: "error",
				code: "missing-id",
				message: "Agent id is missing or empty.",
				file: item.relativePath,
			});
		}

		if (
			typeof item.frontmatter["description"] !== "string" ||
			item.frontmatter["description"].trim() === ""
		) {
			issues.push({
				severity: "error",
				code: "missing-description",
				message: "Agent description is missing or empty.",
				file: item.relativePath,
			});
		}

		if (
			typeof item.frontmatter["role"] !== "string" ||
			item.frontmatter["role"].trim() === ""
		) {
			issues.push({
				severity: "error",
				code: "missing-role",
				message: "Agent role is missing or empty.",
				file: item.relativePath,
			});
		}

		if (typeof item.frontmatter["enabled"] !== "boolean") {
			issues.push({
				severity: "error",
				code: "enabled-type",
				message: "Agent enabled must be a boolean.",
				file: item.relativePath,
			});
		}

		if (
			typeof item.frontmatter["id"] === "string" &&
			path.basename(path.dirname(item.absolutePath)) !== item.frontmatter["id"]
		) {
			issues.push({
				severity: release ? "error" : "warning",
				code: "agent-directory-id",
				message: "Agent directory name should match the agent id.",
				file: item.relativePath,
			});
		}

		if (
			item.frontmatter["tools"] !== undefined &&
			!isStringArray(item.frontmatter["tools"])
		) {
			issues.push({
				severity: "error",
				code: "tools-type",
				message: "tools must be an array of strings.",
				file: item.relativePath,
			});
		}
	}

	if (item.kind === "prompt") {
		if (
			typeof item.frontmatter["description"] !== "string" ||
			item.frontmatter["description"].trim() === ""
		) {
			issues.push({
				severity: "error",
				code: "missing-description",
				message: "Prompt description is missing or empty.",
				file: item.relativePath,
			});
		}

		if (
			item.frontmatter["skills"] !== undefined &&
			!isStringArray(item.frontmatter["skills"])
		) {
			issues.push({
				severity: "error",
				code: "skills-type",
				message: "skills must be an array of strings.",
				file: item.relativePath,
			});
		}

		if (
			item.frontmatter["tools"] !== undefined &&
			!isStringArray(item.frontmatter["tools"])
		) {
			issues.push({
				severity: "error",
				code: "tools-type",
				message: "tools must be an array of strings.",
				file: item.relativePath,
			});
		}

		if (
			item.frontmatter["strict"] !== undefined &&
			typeof item.frontmatter["strict"] !== "boolean"
		) {
			issues.push({
				severity: "error",
				code: "strict-type",
				message: "strict must be a boolean.",
				file: item.relativePath,
			});
		}
	}

	return { item, issues };
}

/**
 * Build aggregated schema drift report.
 *
 * @param items Registry items.
 * @returns Drift report.
 */
function buildDriftReport(items: RegistryItem[]): DriftReport {
	const unknownKeys: Record<string, string[]> = {};
	const filesWithUnknownKeys: Record<string, string[]> = {};

	for (const item of items) {
		const keys = getUnknownFrontmatterKeys(item.frontmatter, item.kind);

		if (keys.length === 0) {
			continue;
		}

		filesWithUnknownKeys[item.relativePath] = [...keys].sort();

		for (const key of keys) {
			if (!unknownKeys[key]) {
				unknownKeys[key] = [];
			}
			unknownKeys[key].push(item.relativePath);
		}
	}

	for (const key of Object.keys(unknownKeys)) {
		const entries = unknownKeys[key];
		if (!entries) {
			continue;
		}
		entries.sort();
	}

	return {
		unknownKeys,
		filesWithUnknownKeys,
	};
}

/**
 * Get unknown frontmatter keys for an item.
 *
 * @param frontmatter Frontmatter object.
 * @param kind Registry kind.
 * @returns Unknown keys.
 */
function getUnknownFrontmatterKeys(
	frontmatter: FrontmatterRecord,
	kind: RegistryItemKind,
): string[] {
	const allowedKeys = AllowedKeys[kind];
	return Object.keys(frontmatter)
		.filter((key) => !allowedKeys.has(key))
		.sort();
}

/**
 * Summarise lint results.
 *
 * @param results Lint results.
 * @returns Summary object.
 */
function summariseLintResults(results: LintResult[]): {
	files: number;
	warnings: number;
	errors: number;
	total: number;
} {
	let warnings = 0;
	let errors = 0;

	for (const result of results) {
		for (const issue of result.issues) {
			if (issue.severity === "warning") {
				warnings += 1;
			} else {
				errors += 1;
			}
		}
	}

	return {
		files: results.length,
		warnings,
		errors,
		total: warnings + errors,
	};
}

/**
 * Recursively walk a directory and return all files.
 *
 * @param directory Absolute directory path.
 * @returns Absolute file paths.
 */
async function walkDirectory(directory: string): Promise<string[]> {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		const absolutePath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await walkDirectory(absolutePath)));
			continue;
		}

		if (entry.isFile()) {
			files.push(absolutePath);
		}
	}

	return files;
}

/**
 * Check whether a directory exists.
 *
 * @param directory Absolute directory path.
 * @returns True when the path exists and is a directory.
 */
async function directoryExists(directory: string): Promise<boolean> {
	try {
		const stats = await fs.lstat(directory);
		return stats.isDirectory();
	} catch (error: unknown) {
		if (isNodeError(error) && error.code === "ENOENT") {
			return false;
		}

		throw error;
	}
}

/**
 * Check whether a file exists.
 *
 * @param filePath Absolute file path.
 * @returns True when the path exists and is a file.
 */
async function fileExists(filePath: string): Promise<boolean> {
	try {
		const stats = await fs.lstat(filePath);
		return stats.isFile();
	} catch (error: unknown) {
		if (isNodeError(error) && error.code === "ENOENT") {
			return false;
		}

		throw error;
	}
}

/**
 * Get a string field from a frontmatter record.
 *
 * @param record Frontmatter record.
 * @param key Field key.
 * @returns String value or undefined.
 */
function getStringField(
	record: FrontmatterRecord,
	key: string,
): string | undefined {
	const value = record[key];
	return typeof value === "string" ? value : undefined;
}

/**
 * Derive an id from filename if missing.
 *
 * @param absolutePath File path.
 * @returns Derived id.
 */
function deriveIdFromFilename(absolutePath: string): string {
	return path
		.basename(absolutePath)
		.replace(/\.prompt\.md$/u, "")
		.replace(/\.agent\.md$/u, "")
		.replace(/^agent\.md$/u, path.basename(path.dirname(absolutePath)))
		.replace(/\.skill\.md$/u, "")
		.replace(/\.instructions\.md$/u, "")
		.replace(/\.md$/u, "");
}

/**
 * Check whether a value is a plain object.
 *
 * @param value Unknown value.
 * @returns True if object-like and not an array.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Check whether a value is an array of strings.
 *
 * @param value Unknown value.
 * @returns True if string array.
 */
function isStringArray(value: unknown): value is string[] {
	return (
		Array.isArray(value) && value.every((entry) => typeof entry === "string")
	);
}

/**
 * Add a generator comment to exported schema JSON.
 *
 * @param schemaObject Schema object to mutate.
 * @param comment Comment string.
 */
function addGeneratedComment(schemaObject: unknown, comment: string): void {
	if (!isPlainObject(schemaObject)) {
		return;
	}

	const entries = Object.entries(schemaObject).filter(
		([key]) => key !== "$comment",
	);

	for (const key of Object.keys(schemaObject)) {
		delete schemaObject[key];
	}

	schemaObject["$comment"] = comment;

	for (const [key, value] of entries) {
		schemaObject[key] = value;
	}
}

/**
 * Check whether a value is a Node.js error with a code.
 *
 * @param value Unknown error value.
 * @returns True when the value has a string code.
 */
function isNodeError(value: unknown): value is NodeJS.ErrnoException {
	return value instanceof Error && "code" in value;
}

/**
 * Convert unknown error value to human-readable message.
 *
 * @param error Unknown error.
 * @returns Error message.
 */
function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	return String(error);
}

/**
 * Print a formatted error.
 *
 * @param message Error message.
 */
function printError(message: string): void {
	console.error(`[error] ${message}`);
}

/**
 * Exhaustiveness guard.
 *
 * @param value Unexpected value.
 */
function assertNever(value: never): never {
	throw new Error(`Unhandled value: ${String(value)}`);
}

/**
 * Run only when executed directly.
 */
const currentFilePath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";

async function isDirectRun(): Promise<boolean> {
	if (invokedPath === "") {
		return false;
	}

	try {
		const [currentRealPath, invokedRealPath] = await Promise.all([
			fs.realpath(currentFilePath),
			fs.realpath(invokedPath),
		]);

		return currentRealPath === invokedRealPath;
	} catch (_error: unknown) {
		return currentFilePath === invokedPath;
	}
}

if (await isDirectRun()) {
	await main();
}
