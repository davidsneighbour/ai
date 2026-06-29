---
name: prompts-repo-operations-tsconfig-onboarding
description: Onboard the current repository to @dnbhq/tsconfig
---

You are working inside the current repository. Add or update the TypeScript configuration so this project uses `@dnbhq/tsconfig`.

## Goal

Onboard the current project to the shared DNBHQ TypeScript configuration package.

The default target behaviour is:

- install `@dnbhq/tsconfig` as a development dependency
- ensure `typescript` is installed as a development dependency
- choose the correct shared config for this repository
- keep the local `tsconfig.json` small and project-specific
- keep project-specific `include`, `exclude`, `files`, `references`, `paths`, `baseUrl`, `outDir`, and framework settings local
- remove obsolete duplicated compiler options that are already provided by the shared config
- preserve required project-specific overrides
- add or repair useful package scripts for type checking
- validate the resulting configuration with `tsc`

## Available shared configs

Use only currently available configs from `@dnbhq/tsconfig`.

| Shared config            | Use for                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `@dnbhq/tsconfig/strict` | Generic strict TypeScript projects                             |
| `@dnbhq/tsconfig/cli`    | Node.js CLI tools, Node scripts, and packages that run in Node |
| `@dnbhq/tsconfig/astro`  | Astro projects using TypeScript                                |

Do not invent config names.

Do not use `@dnbhq/tsconfig` without a subpath unless package metadata proves that is intended for the installed version.

## Required first checks

Before changing files, inspect the repository and report what you find:

1. Detect whether this is an npm project by checking for `package.json`.
2. Detect the package manager from lockfiles.
   - Prefer npm if `package-lock.json` exists.
   - Do not introduce pnpm or yarn.

3. Inspect existing TypeScript configuration files:
   - `tsconfig.json`
   - `tsconfig.base.json`
   - `tsconfig.node.json`
   - `tsconfig.app.json`
   - `tsconfig.build.json`
   - `tsconfig.test.json`
   - `tsconfig.*.json`
   - `jsconfig.json`

4. Inspect existing framework indicators:
   - Astro: `astro.config.*`, `astro` dependency, `src/env.d.ts`
   - Node CLI: `bin` in `package.json`, `scripts/**/*.ts`, CLI shebang files, Node-only imports
   - Library/package: `exports`, `main`, `types`, `files`, `src/index.ts`
   - Browser app: Vite, React, Vue, Svelte, DOM-heavy code
   - Test tooling: Vitest, Playwright, Jest, Node test runner

5. Inspect existing dependencies:
   - `typescript`
   - `@dnbhq/tsconfig`
   - `@types/node`
   - framework-specific TypeScript packages

6. Inspect package scripts:
   - `typecheck`
   - `check`
   - `build`
   - `test`
   - `astro check`
   - `tsc`

7. Inspect whether the repo uses ESM:
   - `"type": "module"` in `package.json`
   - `.mts` / `.cts`
   - `module` settings
   - NodeNext requirements

8. Inspect whether the project currently emits JavaScript with `tsc`.
   - If yes, preserve emit-related settings locally.
   - If no, prefer `noEmit` from the shared config.

## Choose the correct config

Use this decision table:

| Project shape                                                      | Config                                                                                        |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Astro project                                                      | `@dnbhq/tsconfig/astro`                                                                       |
| Node CLI or Node scripts project                                   | `@dnbhq/tsconfig/cli`                                                                         |
| Generic strict TypeScript package without Node runtime assumptions | `@dnbhq/tsconfig/strict`                                                                      |
| Mixed Astro + Node scripts                                         | Use `@dnbhq/tsconfig/astro` for root/app config and a separate Node-specific config if needed |
| Mixed browser app + Node tooling                                   | Use the closest root config and add separate tool/test configs if needed                      |
| Existing multi-tsconfig project                                    | Preserve the multi-config structure and extend the appropriate shared config in each file     |

If unsure, ask which project shape this repository should use. If work must continue without an answer, choose the safest config based on detected files and report the assumption.

## Installation

Install or update required development dependencies:

```bash
npm install --save-dev @dnbhq/tsconfig typescript
```

For Node CLI projects, install Node types if the project uses Node globals or `node:*` imports:

```bash
npm install --save-dev @types/node
```

Do not install `@types/node` for browser-only or Astro-only projects unless Node types are explicitly needed by local scripts, tests, or config files.

Use the repository's existing package manager. Do not change package manager.

## `tsconfig.json` rules

The local `tsconfig.json` must extend one of the shared configs.

### Generic strict project

Use this for generic TypeScript projects:

```json
{
  "extends": "@dnbhq/tsconfig/strict",
  "include": ["src/**/*.ts"]
}
```

### Node CLI project

Use this for Node CLI tools and scripts:

```json
{
  "extends": "@dnbhq/tsconfig/cli",
  "include": ["src/**/*.ts", "scripts/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Astro project

Use this for Astro projects:

```json
{
  "extends": "@dnbhq/tsconfig/astro",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

## Preserve local-only settings

Do not move these into the shared package. Keep them local when needed:

- `include`
- `exclude`
- `files`
- `references`
- `compilerOptions.baseUrl`
- `compilerOptions.paths`
- `compilerOptions.rootDir`
- `compilerOptions.outDir`
- `compilerOptions.declaration`
- `compilerOptions.declarationMap`
- `compilerOptions.sourceMap`
- `compilerOptions.incremental`
- `compilerOptions.tsBuildInfoFile`
- `compilerOptions.composite`
- `compilerOptions.jsxImportSource`
- framework-specific plugin settings
- test-runner-specific settings
- generated type paths

## Remove duplicated compiler options

Remove local `compilerOptions` that are already provided by the selected shared config, unless the project deliberately overrides them.

Examples of usually removable options:

- `strict`
- `useUnknownInCatchVariables`
- `skipLibCheck`
- `forceConsistentCasingInFileNames`
- `moduleDetection`
- `verbatimModuleSyntax`
- `noUnusedLocals`
- `noUnusedParameters`
- `noFallthroughCasesInSwitch`
- `noUncheckedIndexedAccess`
- `noPropertyAccessFromIndexSignature`
- `exactOptionalPropertyTypes`
- `noImplicitOverride`
- `noEmit`

Do not remove an option if doing so changes project behaviour in a way the project clearly depends on.

## Emit behaviour

The shared strict config uses `noEmit`.

If the project uses TypeScript only for type checking, keep that.

If the project uses `tsc` to build output files, preserve emit-specific local overrides, for example:

```json
{
  "extends": "@dnbhq/tsconfig/cli",
  "compilerOptions": {
    "noEmit": false,
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Only add this when the repository actually builds with `tsc`.

## Multiple configs

If the repository has multiple TypeScript configs, update each intentionally.

Examples:

### Root app config

```json
{
  "extends": "@dnbhq/tsconfig/astro",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

### Node scripts config

```json
{
  "extends": "@dnbhq/tsconfig/cli",
  "include": ["scripts/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Build config

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "outDir": "dist"
  }
}
```

Preserve project references if they already exist.

Do not collapse a multi-config project into one file unless it is obviously redundant.

## `package.json` scripts

Add or update scripts conservatively.

For normal TypeScript projects, prefer:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

For projects with a dedicated config:

```json
{
  "scripts": {
    "typecheck": "tsc --project tsconfig.json --noEmit"
  }
}
```

For Astro projects, prefer preserving Astro's own check if already present:

```json
{
  "scripts": {
    "typecheck": "astro check"
  }
}
```

If the project already has `check`, `typecheck`, or `test` conventions, do not rename everything. Add the smallest useful script and preserve existing behaviour.

## Cleanup

After updating the configuration:

1. Remove obsolete local compiler options that are now inherited.
2. Remove unused TypeScript config files only if they are not referenced by scripts, tools, editors, or other configs.
3. Remove obsolete TypeScript-related dependencies only if they are unused.
4. Preserve framework-generated files.
5. Preserve comments if using JSONC files.
6. Update lockfile.
7. Do not add unrelated tooling.
8. Do not reformat the whole repository.

## Validation

Run the safest available validation commands.

At minimum:

```bash
npm install
npx tsc --showConfig
```

Then run the most appropriate project command:

```bash
npm run typecheck
```

If no typecheck script exists and this is not an Astro project:

```bash
npx tsc --project tsconfig.json --noEmit
```

For Astro projects:

```bash
npx astro check
```

If validation fails, fix configuration errors caused by the onboarding.

Do not suppress legitimate project type errors unless they are clearly unrelated to the config migration. Report unrelated errors separately.

## Required final response

Respond with a table.

Use this format:

| Change                 |                Status | Details                                                                          |
| ---------------------- | --------------------: | -------------------------------------------------------------------------------- |
| Dependency install     |                  Done | Added `@dnbhq/tsconfig` and ensured `typescript` exists                          |
| Selected shared config |                  Done | Uses `@dnbhq/tsconfig/astro`, `@dnbhq/tsconfig/cli`, or `@dnbhq/tsconfig/strict` |
| `tsconfig.json`        |                  Done | Simplified local config and preserved project-local settings                     |
| Additional TS configs  |  Done/Partial/Skipped | Explain what was updated                                                         |
| Scripts                |  Done/Partial/Skipped | List added or changed scripts                                                    |
| Cleanup                |  Done/Partial/Skipped | List removed duplicated options, obsolete files, or unused packages              |
| Validation             | Passed/Failed/Skipped | Include command output summary                                                   |

Then add one sentence in this exact style, adapted to this repository:

```text
Let me know if you want to add separate build configs, separate Node script configs, project references, declaration output, path aliases, test-specific TypeScript configs, or stricter migration cleanup to this setup.
```

Only mention optional features that make sense for the current repository.

If something failed, be explicit and include the next concrete fix.
