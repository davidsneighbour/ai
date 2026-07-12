---
name: prompts-repo-operations-markdownlint-config-onboarding
description: Onboard the current repository to the shared DNBHQ markdownlint config
---

# Markdownlint config onboarding

You are working inside the current repository. Add or update Markdown linting so this project uses `@dnbhq/markdownlint-config`.

## Goal

Onboard the repository to the shared DNBHQ `markdownlint-cli2` configuration.

The default target behaviour is:

- install `@dnbhq/markdownlint-config` as a development dependency
- do not install separate markdownlint packages unless required for a project-specific reason
- use `markdownlint-cli2`, not the older `markdownlint` CLI
- add or update `package.json` scripts for Markdown linting
- preserve project-specific Markdown ignores and custom lint needs
- remove obsolete duplicated markdownlint dependencies and config fragments
- validate the resulting setup

## Available shared config

Before editing, consult the package documentation:

- package page: [`@dnbhq/markdownlint-config` on npm](https://www.npmjs.com/package/@dnbhq/markdownlint-config)
- package README.md: read the README shown on the package page, and read
  `node_modules/@dnbhq/markdownlint-config/README.md` after installation when it
  is available

Use the package README as the current source for exported config paths,
included custom rules, version notes, migration details, and package-specific
caveats. If network access is not available, report that and continue from the
installed package README or the baseline instructions in this prompt.

The shared package exposes:

```text
./node_modules/@dnbhq/markdownlint-config/.markdownlint-cli2.jsonc
```

Use that file as the config path.

The package already carries the required markdownlint runtime dependencies and custom rules. Consuming projects should normally install only:

```bash
npm install --save-dev @dnbhq/markdownlint-config
```

Do not install these separately unless the project has a specific local reason:

- `markdownlint-cli2`
- `markdownlint`
- `@github/markdownlint-github`
- `markdownlint-rule-extended-ascii`
- `markdownlint-rule-list-duplicates`
- `markdownlint-rule-relative-links`
- `markdownlint-rule-search-replace`
- `markdownlint-rule-title-case-style`

## Required first checks

Before changing files, inspect the repository and report what you find:

1. Detect whether this is an npm project by checking for `package.json`.
2. Detect the package manager from lockfiles.
   - Prefer npm if `package-lock.json` exists.
   - Do not introduce pnpm or yarn.

3. Inspect existing markdownlint config files:
   - `.markdownlint-cli2.jsonc`
   - `.markdownlint-cli2.json`
   - `.markdownlint-cli2.yaml`
   - `.markdownlint-cli2.yml`
   - `.markdownlint.jsonc`
   - `.markdownlint.json`
   - `.markdownlintrc`
   - `.markdownlintrc.json`
   - `.markdownlintignore`

4. Inspect existing Markdown lint scripts:
   - `lint:markdown`
   - `lint:markdown:fix`
   - `markdownlint`
   - `markdownlint-cli2`
   - generic `lint`

5. Inspect existing dependencies:
   - `@dnbhq/markdownlint-config`
   - `markdownlint-cli2`
   - `markdownlint`
   - `@github/markdownlint-github`
   - markdownlint custom rule packages

6. Inspect Markdown file locations:
   - `README.md`
   - `CHANGELOG.md`
   - `docs/**/*.md`
   - `content/**/*.md`
   - `src/**/*.md`
   - `src/**/*.mdx`
   - `.github/**/*.md`
   - `prompts/**/*.md`
   - `instructions/**/*.md`
   - `ai/**/*.md`

7. Inspect whether generated/vendor folders should be excluded:
   - `node_modules`
   - `public`
   - `dist`
   - `build`
   - `coverage`
   - `.astro`
   - `.next`
   - `.nuxt`
   - `resources/_gen`
   - `_vendor`
   - `vendor`

## Important config distinction

Do not put `markdownlint-cli2` options into `.markdownlint.jsonc`.

Use `.markdownlint-cli2.jsonc` only when the consuming project needs CLI2-only local fields such as:

- `globs`
- `ignores`
- `customRules`
- `config`

Use `.markdownlint.jsonc` only for rule configuration, and only if the project has a specific local rule override.

The default setup should not create local rule overrides.

## Package scripts

Add or update these scripts in `package.json`:

```json
{
  "scripts": {
    "lint:markdown": "markdownlint-cli2 --config ./node_modules/@dnbhq/markdownlint-config/.markdownlint-cli2.jsonc \"**/*.{md,mdx}\"",
    "lint:markdown:fix": "markdownlint-cli2 --config ./node_modules/@dnbhq/markdownlint-config/.markdownlint-cli2.jsonc --fix \"**/*.{md,mdx}\""
  }
}
```

If the repository does not use MDX, keep `mdx` anyway unless the user asks for Markdown only. It is harmless and useful for Astro/content projects.

If the repository has Markdown in unusual file extensions, add them deliberately and report why.

If the repository has a top-level `lint` script, do not replace it. Integrate `lint:markdown` only if that matches the existing script style.

## Local ignore handling

The shared package includes a `.markdownlintignore` baseline.

Choose one of these:

| Situation | Action |
| ------------------------------------------------------------------------------ | -------------------------------------- |
| No local ignore file and default globs are safe | Do not create `.markdownlintignore` |
| Project has generated/vendor Markdown that should be skipped | Create or update `.markdownlintignore` |
| Existing `.markdownlintignore` contains project-specific ignores | Preserve and clean it |
| Existing ignore entries duplicate generated folders already excluded elsewhere | Keep only if still needed |

Do not copy the shared `.markdownlintignore` blindly unless the project needs that baseline locally.

## Existing configuration migration

Classify every existing setting:

| Existing setting | Action |
| ------------------------------------------------ | -------------------------------------------- |
| Already provided by `@dnbhq/markdownlint-config` | Remove local duplicate |
| Project-specific rule override | Preserve locally and explain |
| CLI2-only option | Move to `.markdownlint-cli2.jsonc` if needed |
| Old markdownlint CLI usage | Replace with `markdownlint-cli2` |
| Obsolete custom rule dependency | Remove if no longer referenced |
| Ambiguous | Preserve and report why |

Do not remove project-specific exceptions without reporting them.

## Cleanup

After updating the setup:

1. Remove obsolete markdownlint config fragments.
2. Remove unused markdownlint dependencies.
3. Remove old scripts that call the older `markdownlint` CLI.
4. Preserve project-specific ignores.
5. Preserve project-specific custom rules only if still used.
6. Update lockfile.
7. Do not reformat unrelated files.

## Validation

Run the safest available validation commands.

At minimum:

```bash
npm install
npm run lint:markdown
```

If there are many existing Markdown failures, do not mass-edit content unless the user asked for fixes.

If safe and requested or already expected by the repo, run:

```bash
npm run lint:markdown:fix
npm run lint:markdown
```

Separate configuration errors from existing Markdown content violations.

A configuration error means the setup is wrong and should be fixed.

A content violation means the setup works and the repository has Markdown issues.

## Required final response

Respond with a table.

Use this format:

| Change | Status | Details |
| ------------------------- | --------------------: | ------------------------------------------------------------------------- |
| Dependency install | Done | Added `@dnbhq/markdownlint-config` |
| Lint scripts | Done | Added or updated `lint:markdown` and `lint:markdown:fix` |
| Shared config path | Done | Uses `./node_modules/@dnbhq/markdownlint-config/.markdownlint-cli2.jsonc` |
| Existing config migration | Done/Partial/Skipped | Explain what was migrated |
| Cleanup | Done/Partial/Skipped | List removed old packages/config/scripts |
| Validation | Passed/Failed/Skipped | Include command output summary |

Then add one sentence in this exact style, adapted to this repository:

```text
Let me know if you want to add project-specific ignores, MDX-only globs, local rule overrides, CI Markdown linting, documentation-only lint targets, or automatic Markdown fixes to this setup.
```

Only mention optional features that make sense for the current repository.

If something failed, be explicit and include the next concrete fix.
