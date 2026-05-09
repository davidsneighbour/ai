import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "smol-toml";

/**
 * Prompt setup mode.
 */
export type PromptSetupMode = "glob" | "folders";

/**
 * Repository configuration loaded from config.toml.
 */
export interface RepositoryConfig {
  readonly paths: {
    readonly readme: string;
    readonly vscodeSettings: string;
    readonly promptFilesRoot: string;
  };
  readonly prompts: {
    readonly settingKey: string;
    readonly filePattern: string;
    readonly recursiveGlob: string;
    readonly defaultSetupMode: PromptSetupMode;
  };
  readonly readme: {
    readonly promptFilesSettings: {
      readonly startMarker: string;
      readonly endMarker: string;
    };
  };
}

/**
 * Load and validate the repository config.
 *
 * @param rootDir Repository root directory.
 * @returns Parsed repository config.
 */
export async function loadRepositoryConfig(
  rootDir: string,
): Promise<RepositoryConfig> {
  const configPath = path.join(rootDir, "config.toml");

  try {
    const content = await fs.readFile(configPath, "utf8");
    const parsed: unknown = parse(content);

    return parseRepositoryConfig(parsed, configPath);
  } catch (error: unknown) {
    throw new Error(
      `Could not load ${path.relative(rootDir, configPath)}: ${getErrorMessage(error)}`,
    );
  }
}

/**
 * Build the recursive prompt glob setting path.
 *
 * @param config Repository config.
 * @returns VS Code setting key for all prompt files recursively.
 */
export function buildRecursivePromptGlob(config: RepositoryConfig): string {
  return toPosixPath(
    path.posix.join(
      config.paths.promptFilesRoot,
      config.prompts.recursiveGlob,
    ),
  );
}

/**
 * Build an individual folder prompt glob setting path.
 *
 * @param config Repository config.
 * @param folderRelativePath Folder path relative to the repository root.
 * @returns VS Code setting key for prompt files in that folder.
 */
export function buildFolderPromptGlob(
  config: RepositoryConfig,
  folderRelativePath: string,
): string {
  return toPosixPath(
    path.posix.join(folderRelativePath, config.prompts.filePattern),
  );
}

/**
 * Resolve a configured repository-relative path.
 *
 * @param rootDir Repository root directory.
 * @param configuredPath Repository-relative path from config.
 * @returns Absolute path.
 */
export function resolveConfiguredPath(
  rootDir: string,
  configuredPath: string,
): string {
  return path.resolve(rootDir, configuredPath);
}

/**
 * Convert path separators to POSIX style.
 *
 * @param value Path string.
 * @returns POSIX-normalised path.
 */
export function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

/**
 * Parse and validate repository config.
 *
 * @param value Parsed TOML value.
 * @param configPath Config path for diagnostics.
 * @returns Repository config.
 */
function parseRepositoryConfig(
  value: unknown,
  configPath: string,
): RepositoryConfig {
  const root = requirePlainObject(value, configPath);

  const paths = requirePlainObject(root["paths"], "paths");
  const prompts = requirePlainObject(root["prompts"], "prompts");
  const readme = requirePlainObject(root["readme"], "readme");
  const promptFilesSettings = requirePlainObject(
    readme["promptFilesSettings"],
    "readme.promptFilesSettings",
  );

  const defaultSetupMode = requirePromptSetupMode(
    prompts["defaultSetupMode"],
    "prompts.defaultSetupMode",
  );

  return {
    paths: {
      readme: requireString(paths["readme"], "paths.readme"),
      vscodeSettings: requireString(
        paths["vscodeSettings"],
        "paths.vscodeSettings",
      ),
      promptFilesRoot: requireString(
        paths["promptFilesRoot"],
        "paths.promptFilesRoot",
      ),
    },
    prompts: {
      settingKey: requireString(prompts["settingKey"], "prompts.settingKey"),
      filePattern: requireString(prompts["filePattern"], "prompts.filePattern"),
      recursiveGlob: requireString(
        prompts["recursiveGlob"],
        "prompts.recursiveGlob",
      ),
      defaultSetupMode,
    },
    readme: {
      promptFilesSettings: {
        startMarker: requireString(
          promptFilesSettings["startMarker"],
          "readme.promptFilesSettings.startMarker",
        ),
        endMarker: requireString(
          promptFilesSettings["endMarker"],
          "readme.promptFilesSettings.endMarker",
        ),
      },
    },
  };
}

/**
 * Require a plain object value.
 *
 * @param value Unknown value.
 * @param label Diagnostic label.
 * @returns Plain object.
 */
function requirePlainObject(
  value: unknown,
  label: string,
): Record<string, unknown> {
  if (!isPlainObject(value)) {
    throw new Error(`${label} must be an object.`);
  }

  return value;
}

/**
 * Require a string value.
 *
 * @param value Unknown value.
 * @param label Diagnostic label.
 * @returns String value.
 */
function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

/**
 * Require a prompt setup mode.
 *
 * @param value Unknown value.
 * @param label Diagnostic label.
 * @returns Prompt setup mode.
 */
function requirePromptSetupMode(
  value: unknown,
  label: string,
): PromptSetupMode {
  if (value === "glob" || value === "folders") {
    return value;
  }

  throw new Error(`${label} must be "glob" or "folders".`);
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
