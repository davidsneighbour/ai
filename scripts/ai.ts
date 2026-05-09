#!/usr/bin/env -S node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import yaml from "yaml";
import { z } from "zod";
import {
  AllowedKeys,
  DocSchema,
  InstructionSchema,
  PromptSchema,
  type RegistryItemKind,
  SkillSchema,
} from "./lib/ai-schema.ts";

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
  id?: string;
  json: boolean;
  verbose: boolean;
  includeContent: boolean;
  noExitOnError: boolean;
  release: boolean;
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
 * Standalone skill frontmatter accepted by SKILL.md-based skill directories.
 */
const SkillDirectoryFrontmatterSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1).optional(),
    description: z.string().min(1).max(1024).optional(),
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
      rootDir: defaultAiRoot(),
      schemaDir: defaultSchemaRoot(),
      json: false,
      verbose: false,
      includeContent: true,
      noExitOnError: false,
      release: false,
    };
  }

  const commandToken = argv[0] ?? "help";
  const command = isCommandName(commandToken) ? commandToken : "help";

  const options: CliOptions = {
    command,
    rootDir: command === "validate-skills" ? defaultSkillsRoot() : defaultAiRoot(),
    schemaDir: defaultSchemaRoot(),
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
    value === "check"
  );
}

/**
 * Default AI root directory.
 *
 * @returns Absolute path to `ai`.
 */
function defaultAiRoot(): string {
  return path.resolve(process.cwd(), "ai");
}

/**
 * Default SKILL.md skill root directory.
 *
 * @returns Absolute path to `ai/skills`.
 */
function defaultSkillsRoot(): string {
  return path.resolve(process.cwd(), "ai", "skills");
}

/**
 * Default schema output directory.
 *
 * @returns Absolute path to `schemas`.
 */
function defaultSchemaRoot(): string {
  return path.resolve(process.cwd(), "schemas");
}

/**
 * Print CLI usage.
 */
function printHelp(): void {
  const scriptName = path.basename(process.argv[1] ?? "ai.ts");

  console.log(`Usage: node ./scripts/${scriptName} <command> [options]

Commands:
  help
  list
  show --id <id>
  validate
  lint
  validate-skills
  drift-report
  export-schemas
  check

Options:
  --root <path>           Root AI directory (default: ./ai); for validate-skills, skills root (default: ./ai/skills)
  --schemas <path>        Schema output directory (default: ./schemas)
  --id <id>               Item id for show
  --json                  Output JSON
  --verbose               Show additional diagnostics
  --no-content            Do not print item body in show
  --release               Promote warnings to errors where applicable
  --no-exit-on-error      Do not exit non-zero on validation/lint/check failure
  --noExitOnError         Alias for --no-exit-on-error
  --help, -h              Show this help

Examples:
  node ./scripts/${scriptName} list
  node ./scripts/${scriptName} show --id test-from-behaviour-spec
  node ./scripts/${scriptName} validate
  node ./scripts/${scriptName} lint
  node ./scripts/${scriptName} validate-skills --verbose
  node ./scripts/${scriptName} drift-report
  node ./scripts/${scriptName} export-schemas
  node ./scripts/${scriptName} check --release

validate-skills rules:
  - The skills root must exist.
  - Each direct child directory is treated as one skill.
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
  release: boolean,
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
 * This validates direct child directories that use Codex-style SKILL.md files.
 *
 * @param options CLI options.
 */
async function runValidateSkills(options: CliOptions): Promise<void> {
  const results = await validateSkillDirectories(options.rootDir, options.verbose);

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
 * Validate all direct child skill directories in a skills root.
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

  const skillDirectories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(absoluteRoot, entry.name))
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
      console.log(`Validated: ${path.relative(process.cwd(), result.skillFile)}`);
    }
  }

  return results;
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
  const parsed = SkillDirectoryFrontmatterSchema.safeParse(extracted.frontmatter);

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
  console.log(`[ok] ${path.relative(process.cwd(), skillOutputPath)}`);
  console.log(`[ok] ${path.relative(process.cwd(), docOutputPath)}`);
  console.log(`[ok] ${path.relative(process.cwd(), instructionOutputPath)}`);
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
  const files = await walkDirectory(options.rootDir);
  const markdownFiles = files.filter((filePath) => filePath.endsWith(".md"));
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
    getStringField(frontmatter, "id") ?? deriveIdFromFilename(absolutePath);
  const title =
    getStringField(frontmatter, "title") ?? path.basename(absolutePath);

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

  if (absolutePath.includes(`${path.sep}docs${path.sep}`)) {
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
    item.kind === "skill"
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
    !item.absolutePath.includes(
      `${path.sep}ai${path.sep}instructions${path.sep}`,
    )
  ) {
    issues.push({
      severity: release ? "error" : "warning",
      code: "location",
      message:
        "Instruction file should be in the ai/instructions directory (subfolders are allowed).",
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

  if (item.kind === "skill" && !item.absolutePath.endsWith(".skill.md")) {
    issues.push({
      severity: release ? "error" : "warning",
      code: "naming",
      message: "Skill file should use the .skill.md suffix.",
      file: item.relativePath,
    });
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

if (currentFilePath === invokedPath) {
  await main();
}
