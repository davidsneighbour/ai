#!/usr/bin/env -S node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  buildFolderPromptGlob,
  buildRecursivePromptGlob,
  loadRepositoryConfig,
  resolveConfiguredPath,
  toPosixPath,
  type PromptSetupMode,
  type RepositoryConfig,
} from "./lib/config.ts";

/**
 * Supported setup targets.
 */
type SetupTarget = "prompts";

/**
 * CLI setup options.
 */
interface SetupOptions {
  readonly rootDir: string;
  readonly settingsPath: string;
  readonly targets: readonly SetupTarget[];
  readonly promptMode: PromptSetupMode;
  readonly verbose: boolean;
  readonly config: RepositoryConfig;
}

/**
 * VS Code settings object.
 */
type SettingsJson = Record<string, unknown>;

/**
 * Prompt files setting value.
 */
type PromptFilesLocations = Record<string, boolean>;

/**
 * Minimal directory entry used for setup.
 */
interface PromptFolder {
  readonly name: string;
  readonly relativePath: string;
}

/**
 * Main entry point.
 *
 * @returns Promise that resolves after setup.
 */
async function main(): Promise<void> {
  try {
    const options = await parseArgs(process.argv.slice(2));
    await runSetup(options);
  } catch (error: unknown) {
    console.error(`[setup] ${getErrorMessage(error)}`);
    process.exit(1);
  }
}

/**
 * Parse CLI arguments.
 *
 * Supported forms:
 * - node ./scripts/setup.ts --prompts
 * - node ./scripts/setup.ts --setup-prompts
 * - node ./scripts/setup.ts --setup --prompts
 * - node ./scripts/setup.ts --setup-prompts --mode folders
 * - node ./scripts/setup.ts --setup-prompts --mode glob
 *
 * @param argv CLI arguments after the script name.
 * @returns Parsed setup options.
 */
async function parseArgs(argv: readonly string[]): Promise<SetupOptions> {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  const rootDir = process.cwd();
  const config = await loadRepositoryConfig(rootDir);
  const targets: SetupTarget[] = [];

  if (argv.includes("--prompts") || argv.includes("--setup-prompts")) {
    targets.push("prompts");
  }

  if (targets.length === 0) {
    throw new Error("No setup target selected. Use --prompts or --setup-prompts.");
  }

  return {
    rootDir,
    settingsPath: resolveConfiguredPath(rootDir, config.paths.vscodeSettings),
    targets,
    promptMode: parsePromptMode(argv, config.prompts.defaultSetupMode),
    verbose: argv.includes("--verbose"),
    config,
  };
}

/**
 * Parse the prompt setup mode.
 *
 * @param argv CLI arguments.
 * @param fallback Fallback mode from config.
 * @returns Prompt setup mode.
 */
function parsePromptMode(
  argv: readonly string[],
  fallback: PromptSetupMode,
): PromptSetupMode {
  const modeIndex = argv.indexOf("--mode");

  if (modeIndex === -1) {
    return fallback;
  }

  const value = argv[modeIndex + 1];

  if (value === "glob" || value === "folders") {
    return value;
  }

  throw new Error('--mode must be "glob" or "folders".');
}

/**
 * Print help output.
 */
function printHelp(): void {
  const scriptName = path.basename(process.argv[1] ?? "setup.ts");

  console.log(`Usage: node ./scripts/${scriptName} [options]

Options:
  --setup --prompts       Configure VS Code prompt file locations
  --setup-prompts         Alias for --setup --prompts
  --prompts               Alias for --setup --prompts
  --mode glob             Use one recursive prompt glob
  --mode folders          Use individual folder prompt globs
  --verbose               Show additional diagnostics
  --help, -h              Show this help

Examples:
  node ./scripts/${scriptName} --setup --prompts
  node ./scripts/${scriptName} --setup-prompts --mode glob
  node ./scripts/${scriptName} --setup-prompts --mode folders

Configuration:
  Reads paths, setting names, and the default prompt mode from config.toml.
`);
}

/**
 * Run selected setup targets.
 *
 * @param options Setup options.
 */
async function runSetup(options: SetupOptions): Promise<void> {
  for (const target of options.targets) {
    switch (target) {
      case "prompts":
        await setupPromptFilesLocation(options);
        break;
      default:
        assertNever(target);
    }
  }
}

/**
 * Add or update the VS Code prompt files location setting.
 *
 * @param options Setup options.
 */
async function setupPromptFilesLocation(options: SetupOptions): Promise<void> {
  await fs.mkdir(path.dirname(options.settingsPath), { recursive: true });

  const settings = await readSettingsJson(options.settingsPath);
  const locations =
    options.promptMode === "glob"
      ? buildGlobPromptLocations(options.config)
      : await buildFolderPromptLocations(options);

  settings[options.config.prompts.settingKey] = locations;

  await fs.writeFile(
    options.settingsPath,
    `${JSON.stringify(settings, null, 2)}\n`,
    "utf8",
  );

  if (options.verbose) {
    console.log(`[ok] Updated ${path.relative(options.rootDir, options.settingsPath)}`);
    console.log(`[ok] Prompt setup mode: ${options.promptMode}`);
    console.log(`[ok] Prompt entries: ${Object.keys(locations).length}`);
  }
}

/**
 * Build prompt locations for recursive glob mode.
 *
 * @param config Repository config.
 * @returns Prompt files locations setting.
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
 * @param options Setup options.
 * @returns Prompt files locations setting.
 */
async function buildFolderPromptLocations(
  options: SetupOptions,
): Promise<PromptFilesLocations> {
  const folders = await listPromptFolders(options);
  const locations: PromptFilesLocations = {};

  for (const folder of folders) {
    locations[buildFolderPromptGlob(options.config, folder.relativePath)] = true;
  }

  return locations;
}

/**
 * List direct prompt folders under the configured prompt files root.
 *
 * @param options Setup options.
 * @returns Sorted prompt folder list.
 */
async function listPromptFolders(options: SetupOptions): Promise<PromptFolder[]> {
  const promptsRoot = resolveConfiguredPath(
    options.rootDir,
    options.config.paths.promptFilesRoot,
  );

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
          relativePath: toPosixPath(path.relative(options.rootDir, absolutePath)),
        };
      })
      .sort((left, right) => left.relativePath.localeCompare(right.relativePath));
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
 * Check whether a value is a plain object.
 *
 * @param value Unknown value.
 * @returns True when the value is a non-array object.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
 * Convert an unknown error into a printable message.
 *
 * @param error Unknown error value.
 * @returns Error message.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

/**
 * Exhaustiveness guard.
 *
 * @param value Unhandled value.
 */
function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${String(value)}`);
}

await main();
