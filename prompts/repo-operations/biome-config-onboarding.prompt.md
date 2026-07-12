---
name: prompts-repo-operations-biome-config-onboarding
description: Onboard the current repository to the shared DNBHQ Biome config
---

# Biome config onboarding

You are working inside the current repository. Add or update Biome so this project uses `@dnbhq/biome-config`.

## Goal

Onboard the repository to the shared DNBHQ Biome configuration.

The default target behaviour is:

- install `@dnbhq/biome-config` as a development dependency
- install `@biomejs/biome` as a project-local development dependency
- create or update `biome.json`
- extend the shared config from `./node_modules/@dnbhq/biome-config/config.json`
- preserve project-specific local overrides
- remove obsolete duplicated Biome settings already provided by the shared config
- add or update useful package scripts
- validate the resulting Biome setup

## Available shared config

Before editing, consult the package documentation:

- package page: [`@dnbhq/biome-config` on npm](https://www.npmjs.com/package/@dnbhq/biome-config)
- package README.md: read the README shown on the package page, and read
  `node_modules/@dnbhq/biome-config/README.md` after installation when it is
  available

Use the package README as the current source for exported config paths, version
notes, migration details, and package-specific caveats. If network access is not
available, report that and continue from the installed package README or the
baseline instructions in this prompt.

The shared package exports one config:

```json
{
  "extends": ["./node_modules/@dnbhq/biome-config/config.json"]
}
```

The consuming project should install both:

```bash
npm install --save-dev @dnbhq/biome-config @biomejs/biome
```

Do not rely on a transitive Biome binary from the shared package. The consuming project should own its Biome version for editor integrations, CLI usage, and lockfile stability.

## Known shared config behaviour

Assume the shared config currently provides:

- formatter enabled
- import organisation enabled
- linter enabled
- strict rule set for performance, complexity, correctness, and suspicious-code checks
- VCS integration for Git
- `useIgnoreFile: true`
- default branch set to `main`
- LF line endings
- two-space indentation
- line width `80`
- JavaScript formatter defaults
- selected overrides for HTML, JavaScript, TypeScript, and properties files
- broad browser/global names

Do not duplicate these locally unless the project intentionally overrides them.

## Required first checks

Before changing files, inspect the repository and report what you find:

1. Detect whether this is an npm project by checking for `package.json`.
2. Detect the package manager from lockfiles.
   - Prefer npm if `package-lock.json` exists.
   - Do not introduce pnpm or yarn.

3. Inspect existing Biome configuration files:
   - `biome.json`
   - `biome.jsonc`
   - `.biome.json`
   - `.biome.jsonc`

4. Inspect existing formatting/linting config:
   - `.prettierrc`
   - `.prettierrc.*`
   - `prettier.config.*`
   - `.prettierignore`
   - `eslint.config.*`
   - `.eslintrc.*`
   - `stylelint.config.*`
   - `.editorconfig`

5. Inspect existing package scripts:
   - `lint`
   - `lint:fix`
   - `format`
   - `format:check`
   - `check`
   - `check:fix`
   - `biome:*`
   - `prettier:*`
   - `eslint:*`

6. Inspect existing dependencies:
   - `@biomejs/biome`
   - `@dnbhq/biome-config`
   - `eslint`
   - Prettier packages
   - ESLint plugins/configs
   - format/lint related packages

7. Inspect source file types:
   - JavaScript
   - TypeScript
   - JSX
   - TSX
   - JSON
   - JSONC
   - CSS
   - GraphQL
   - Astro
   - Markdown
   - generated files

8. Inspect ignore needs:
   - `node_modules`
   - `dist`
   - `build`
   - `coverage`
   - `public`
   - `.astro`
   - `.next`
   - `.nuxt`
   - `resources/_gen`
   - `_vendor`
   - generated assets

9. Determine whether Biome should replace existing ESLint/Prettier usage or run alongside it.
   - If unclear, preserve existing ESLint/Prettier scripts and report the overlap.
   - Do not remove ESLint or Prettier unless Biome fully replaces their current role and validation passes.

## Target `biome.json`

If no project-specific overrides are needed, use:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["./node_modules/@dnbhq/biome-config/config.json"]
}
```

If project-specific overrides are needed, keep them local after the shared config:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["./node_modules/@dnbhq/biome-config/config.json"],
  "files": {
    "ignoreUnknown": false,
    "includes": ["**", "!dist", "!coverage"]
  }
}
```

Use `biome.json` unless the existing project already uses `biome.jsonc` for comments. Do not create both.

## Local override rules

Keep these local when needed:

- project-specific file includes/excludes
- generated output exclusions
- test-specific relaxed rules
- framework-specific parser behaviour
- formatter line width overrides
- VCS default branch override if not `main`
- linter rule downgrades that are required for existing code
- temporary migration suppressions

Do not copy the whole shared config into the consuming repository.

Do not duplicate local rule settings that are already inherited.

## Package scripts

Add or update scripts conservatively.

Default scripts:

```json
{
  "scripts": {
    "check": "biome check .",
    "check:fix": "biome check --write .",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "lint": "biome lint .",
    "lint:fix": "biome lint --write ."
  }
}
```

If the repository already has `lint`, `format`, or `check` scripts, do not overwrite them blindly.

Use one of these strategies:

| Existing scripts | Action |
| ---------------------------------------------- | -------------------------------------------- |
| No lint/format scripts | Add the default scripts |
| Existing `lint` is ESLint and still needed | Add `lint:biome` and `lint:biome:fix` |
| Existing `format` is Prettier and still needed | Add `format:biome` and `format:biome:check` |
| Existing `check` is project build/typecheck | Do not replace it; add `check:biome` |
| Biome fully replaces old tools | Replace scripts only after validation passes |

## Cleanup

After updating the setup:

1. Remove obsolete Biome config fragments.
2. Remove duplicated local Biome settings already inherited from the shared config.
3. Remove unused ESLint/Prettier packages only if Biome fully replaces them and no scripts/configs still reference them.
4. Preserve `.editorconfig`.
5. Preserve `.prettierignore` or ESLint ignores if old tools remain.
6. Update lockfile.
7. Do not reformat the whole repository unless the user asked for fixes.
8. Do not run `biome check --write .` unless safe and requested.

## Validation

Run the safest available validation commands.

At minimum:

```bash
npm install
npx biome check .
```

For CI-style validation, run when appropriate:

```bash
npx biome ci .
```

If the repository has many existing formatting/lint violations, do not mass-fix unless requested.

Separate configuration errors from existing code violations.

A configuration error means the setup is wrong and should be fixed.

A code violation means the setup works and the repository has code quality or formatting issues.

## Required final response

Respond with a table.

Use this format:

| Change | Status | Details |
| ------------------------- | --------------------: | -------------------------------------------------------- |
| Dependency install | Done | Added `@dnbhq/biome-config` and `@biomejs/biome` |
| Config file | Done | Created or updated `biome.json` |
| Shared config path | Done | Extends `./node_modules/@dnbhq/biome-config/config.json` |
| Scripts | Done/Partial/Skipped | List added or changed scripts |
| Existing config migration | Done/Partial/Skipped | Explain what was migrated |
| Cleanup | Done/Partial/Skipped | List removed old packages/config/scripts |
| Validation | Passed/Failed/Skipped | Include command output summary |

Then add one sentence in this exact style, adapted to this repository:

```text
Let me know if you want to add project-specific file ignores, framework-specific overrides, separate CI scripts, safe auto-fix scripts, ESLint/Prettier migration cleanup, or test-specific Biome rule overrides to this setup.
```

Only mention optional features that make sense for the current repository.

If something failed, be explicit and include the next concrete fix.
