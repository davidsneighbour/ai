---
name: prompts-node-configuration-setup
agent: agent
model: GPT-5.5 Thinking
tools:
  [
    "search/codebase",
    "edit/editFiles",
    "execute/getTerminalOutput",
    "execute/runInTerminal",
    "read/terminalLastCommand",
    "read/terminalSelection",
  ]
description: Implement a reusable c12/confbox-based package configuration system.
---

# Implement package configuration loading

You are working in an npm package repository. Implement a reusable configuration loading system for this package using `c12` for config discovery/loading and `confbox` for JSONC parsing support.

## Goal

Add a package-level configuration system that lets users define configuration in common config file locations, including JSONC files, TypeScript/JavaScript config files, YAML files, rc files, and a package-specific object inside `package.json`.

The implementation MUST be reusable, strictly typed, documented, and easy to adapt to other packages.

## Required behaviour

The package MUST support configuration from these sources, in this precedence order:

1. CLI flags or direct function overrides
2. Environment variables, if the package already uses them for config overrides
3. Package configuration loaded through `c12`
4. Internal default values

The implementation MUST use:

- `c12` for config file discovery/loading
- `confbox` for JSONC parsing
- strict TypeScript types
- explicit runtime validation of the loaded config object

The implementation MUST NOT silently accept invalid config. Invalid config MUST fail fast with a useful error message.

## Dependencies

Add direct runtime dependencies:

```bash
npm install c12 confbox
```

If the package currently uses `jsonc-parser` only for JSONC config parsing, replace that usage with `confbox` and remove `jsonc-parser` if it is no longer needed.

After changing dependencies, update the lockfile:

```bash
npm install --package-lock-only
```

## Configuration naming

Infer the config namespace from the package name.

Examples:

- `@example/nanny` uses config name `nanny`
- `@davidsneighbour/nanny` uses config name `nanny`
- `my-tool` uses config name `my-tool`

Use the config name consistently for:

- `name` in `loadConfig`
- `packageJson` in `loadConfig`
- config file examples
- documentation

## Supported config locations

The package SHOULD support the standard `c12` locations for the chosen config name, including:

- `<name>.config.ts`
- `<name>.config.js`
- `<name>.config.mjs`
- `<name>.config.cjs`
- `<name>.config.json`
- `<name>.config.jsonc`
- `<name>.config.yaml`
- `<name>.config.yml`
- `.<name>rc`
- `.<name>rc.json`
- `.<name>rc.jsonc`
- `.<name>rc.yaml`
- `.<name>rc.yml`
- `.config/<name>.jsonc`
- the `<name>` property in `package.json`

Do not hard-code this list into the loader unless necessary. Prefer relying on `c12` defaults where possible, but document the supported locations.

## Implementation pattern

Create a central config module, for example:

- `src/lib/config.ts`
- `src/config.ts`
- or the closest existing equivalent in the repository

The module MUST export:

- a config name constant
- a default config object
- a public config type
- a loaded config result type
- a `load<PackageName>Config()` function
- optional parser helpers such as `parseJsoncObject()` if the package reads JSONC fragment files directly

Example structure:

```ts
import path from "node:path";

import { loadConfig } from "c12";
import { parseJSONC } from "confbox";

import { PackageError } from "./errors.js";

export const PACKAGE_CONFIG_NAME = "PACKAGE_NAME_HERE";

type JsonObject = Record<string, unknown>;

export type PackageConfig = {
  exampleOption: string;
};

export type LoadedPackageConfig = {
  config: PackageConfig;
  configFile: string | null;
  cwd: string;
};

export type LoadPackageConfigOptions = {
  cwd: string;
  exampleOptionOverride?: string | undefined;
};

const DEFAULT_PACKAGE_CONFIG: PackageConfig = {
  exampleOption: "default-value",
};

export async function loadPackageConfig(options: LoadPackageConfigOptions): Promise<LoadedPackageConfig> {
  const cwd = path.resolve(options.cwd);
  const overrides = getOverrides(options);

  try {
    const result = await loadConfig<unknown>({
      cwd,
      name: PACKAGE_CONFIG_NAME,
      packageJson: PACKAGE_CONFIG_NAME,
      defaults: DEFAULT_PACKAGE_CONFIG,
      ...(overrides ? { overrides } : {}),
    });

    return {
      config: parsePackageConfig(result.config),
      configFile: typeof result.configFile === "string" ? result.configFile : null,
      cwd,
    };
  } catch (error: unknown) {
    if (error instanceof PackageError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new PackageError(`Failed to load ${PACKAGE_CONFIG_NAME} configuration: ${message}`, 1);
  }
}

export function parseJsoncObject(filePath: string, content: string): JsonObject {
  try {
    const parsed = parseJSONC(content) as unknown;

    if (!isPlainObject(parsed)) {
      throw new PackageError(`JSONC root must be an object: ${filePath}`, 1);
    }

    return parsed;
  } catch (error: unknown) {
    if (error instanceof PackageError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new PackageError(`Failed to parse JSONC file ${filePath}: ${message}`, 1);
  }
}

function getOverrides(options: LoadPackageConfigOptions): Partial<PackageConfig> | undefined {
  const overrides: Partial<PackageConfig> = {};

  if (typeof options.exampleOptionOverride === "string" && options.exampleOptionOverride.trim().length > 0) {
    overrides.exampleOption = options.exampleOptionOverride.trim();
  }

  return Object.keys(overrides).length > 0 ? overrides : undefined;
}

function parsePackageConfig(value: unknown): PackageConfig {
  if (!isPlainObject(value)) {
    throw new PackageError(`Invalid ${PACKAGE_CONFIG_NAME} config: expected an object.`, 1);
  }

  const exampleOption = value["exampleOption"];

  if (typeof exampleOption !== "string" || exampleOption.trim().length === 0) {
    throw new PackageError('Invalid config value for "exampleOption": expected a non-empty string.', 1);
  }

  return {
    exampleOption: exampleOption.trim(),
  };
}

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
```

Adapt:

- `PACKAGE_NAME_HERE`
- `PackageError`
- `PackageConfig`
- config fields
- override logic
- default values

Do not use `any`. Use `unknown` and validate.

## CLI integration

If the package has CLI commands:

- parse CLI flags first
- collect relevant config override values
- call the central config loader after parsing
- use the loaded config object for command execution

Do not resolve configurable paths directly in each command. Route all package-level config through the central config loader.

Example:

```ts
const loadedConfig = await loadPackageConfig({
  cwd,
  exampleOptionOverride: cliExampleOption,
});

const resolvedPath = path.resolve(cwd, loadedConfig.config.exampleOption);
```

## JSONC fragment files

If the package also reads project fragment files ending in `.jsonc`, use the shared `confbox` helper instead of local parser logic.

Example:

```ts
function readJsoncObject(filePath: string): Record<string, unknown> {
  const content = fs.readFileSync(filePath, "utf8");
  return parseJsoncObject(filePath, content);
}
```

The parser MUST verify that the parsed root is an object.

## Documentation

Update the README or docs with:

- a "Configuration" section
- supported config file locations
- config precedence order
- each supported config option
- default values
- JSONC support note
- `package.json` config example
- config file examples

Include examples for at least:

```jsonc
{
  // Example option.
  "exampleOption": "custom-value",
}
```

```ts
export default {
  exampleOption: "custom-value",
};
```

```json
{
  "PACKAGE_NAME_HERE": {
    "exampleOption": "custom-value"
  }
}
```

Replace `PACKAGE_NAME_HERE` with the actual config namespace.

## Validation requirements

The implementation MUST:

- compile under strict TypeScript
- avoid `any`
- avoid empty catch blocks
- report useful errors
- avoid silently falling back for invalid config values
- avoid writing `undefined` optional fields into typed objects when `exactOptionalPropertyTypes` is enabled
- keep config defaults centralised
- keep CLI override precedence intact

## Tests or verification

Run the existing verification commands, usually:

```bash
npm run typecheck
npm run build
npm run ci
```

If the package has tests, run them.

If commands fail, fix the implementation instead of documenting the failure away.

## Final response

After implementation, report:

- files changed
- config fields added
- config locations supported
- dependency changes
- verification commands run and their result
- any remaining manual step, such as lockfile update if commands could not be run
