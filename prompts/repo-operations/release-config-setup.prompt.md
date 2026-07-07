---
name: prompts-repo-operations-release-config-setup
description: Add or update release-it release procedures using @dnbhq/release-config
---

# Release config setup

You are working inside the current repository. Add or update the release procedure using `@dnbhq/release-config`.

## Goal

Create a release setup that uses `release-it` through `@dnbhq/release-config`.

The default target behaviour is:

- use `.release-it.ts` as the only release-it configuration file
- use TypeScript for the release configuration
- create a release commit
- create a Git tag
- push the release commit and tag to GitHub
- create a GitHub release with changelog/release notes
- do not publish an npm package unless explicitly requested
- use Conventional Commits to determine changelog grouping and release increments
- configure `npm run release` and helper release scripts in `package.json`

## Required first checks

Before changing files, inspect the repository and report what you find:

1. Detect whether this is an npm project by checking for `package.json`.
2. Detect the package manager from lockfiles.
   - Prefer npm if `package-lock.json` exists.
   - Do not introduce pnpm or yarn.

3. Inspect existing release configuration:
   - `.release-it.ts`
   - `.release-it.js`
   - `.release-it.cjs`
   - `.release-it.mjs`
   - `.release-it.json`
   - `release-it` key in `package.json`
   - `.releaserc`
   - `.releaserc.*`
   - `release.config.*`
   - semantic-release configuration
   - standard-version configuration
   - auto-changelog configuration
   - custom release scripts in `package.json`

4. Inspect existing release-related packages:
   - `release-it`
   - `@dnbhq/release-config`
   - `@release-it/conventional-changelog`
   - `semantic-release`
   - `standard-version`
   - `conventional-changelog-cli`
   - `auto-changelog`
   - other release/changelog/versioning packages

5. Inspect whether `package.json` contains:
   - `repository`
   - `version`
   - `type`
   - existing release scripts

6. Inspect whether `CHANGELOG.md` exists.
7. Inspect whether `CITATION.cff` exists.
8. Inspect whether the repository uses ESM. If `"type": "module"` is missing, decide whether it is safe to add. If not safe, explain the risk before changing it.

## Questions to resolve

Use explicit user-provided values when they exist. If the user did not provide them, use these defaults and report that you used defaults.

### npm publishing

Ask:

> Should this release publish an npm package? Default: no.

If the user does not answer and work must continue, assume:

```text
npm package release: no
```

Configure:

```ts
npm: {
  publish: false;
}
```

through the shared config defaults unless an explicit override is required.

### GitHub token environment key

Ask:

> Which environment variable should release-it use for the GitHub token? Default: GITHUB_TOKEN_CONTENT_PRIVATE.

If the user does not answer and work must continue, use:

```text
GITHUB_TOKEN_CONTENT_PRIVATE
```

Do not create or commit a real `.env` secret.

If the project has `.env.example`, add the key name without a value if appropriate:

```env
GITHUB_TOKEN_CONTENT_PRIVATE=
```

If the project has CI documentation, mention that the same name must exist as a CI secret/environment variable.

### Commit types and release increments

Ask whether the project has custom Conventional Commit types/scopes.

If the user provides commit types, use them.

If not, use the `@dnbhq/release-config` defaults:

```ts
minorTypes: ["feat", "prompts", "instructions", "skills"]
patchTypes: ["fix", "perf", "refactor", "docs", "style", "test", "build", "ci", "chore"]
minorExclusionSubscopes: {
  feat: ["fix"],
  prompts: ["fix"],
  instructions: ["fix"],
  skills: ["fix"]
}
```

If the user explicitly says only `feat` should create minor releases and all other types/scopes should create patch releases, configure:

```ts
minorTypes: ["feat"];
```

and configure `patchTypes` from the detected or requested non-feature commit types.

Do not allow `feat(fix)` to behave like a normal minor change unless the user explicitly requests that behaviour.

## Existing configuration migration

If an existing release configuration exists, migrate it deliberately.

For every existing setting, classify it as one of these:

| Existing setting | Action |
| --------------------------------------------- | ----------------------------------------------------- |
| Directly supported by `@dnbhq/release-config` | Mirror it in `createReleaseConfig(...)` options |
| Supported through `overrides` | Mirror it under `overrides` |
| Not supported | Report it explicitly and explain what would be needed |
| Obsolete after migration | Remove it |
| Unclear | Leave it in place and report why |

Map features like this when possible:

| Old feature | New location |
| --------------------------------- | -------------------------------- |
| changelog file path | `changelogFile` |
| GitHub token env key | `githubTokenRef` |
| custom minor commit types | `scopes.minorTypes` |
| custom patch commit types | `scopes.patchTypes` |
| minor exclusions like `feat(fix)` | `scopes.minorExclusionSubscopes` |
| package.json path | `repository.packageJsonPath` |
| repository fallback URL | `repository.fallbackUrl` |
| git commit/tag/push settings | `overrides.git` |
| GitHub release settings | `overrides.github` |
| npm publish settings | `overrides.npm` |
| plugin settings | `overrides.plugins` |
| release hooks | `overrides.hooks` |

Important: `@dnbhq/release-config` uses shallow merging for the main `git`, `github`, `npm`, and `plugins` objects. Do not assume deep merging. When overriding nested plugin settings, preserve required defaults explicitly.

## Required files and changes

### Dependencies

Install or update these dev dependencies:

```bash
npm install --save-dev @dnbhq/release-config release-it @release-it/conventional-changelog
```

Use the repository's detected npm workflow. Do not use yarn or pnpm unless the repository already uses them and the user explicitly asked for that.

Remove obsolete release packages only when they are no longer referenced anywhere.

Before removing any package, search:

- `package.json`
- scripts
- config files
- GitHub workflows
- local scripts
- imports/requires

Do not remove a dependency if it is still used.

### `.release-it.ts`

Create or replace `.release-it.ts`.

Use this shape as the baseline:

```ts
import { createReleaseConfig } from "@dnbhq/release-config";
import type { Config } from "release-it";

const config: Config = createReleaseConfig({
  githubTokenRef: "GITHUB_TOKEN_CONTENT_PRIVATE",
  scopes: {
    minorTypes: ["feat", "prompts", "instructions", "skills"],
    patchTypes: [
      "fix",
      "perf",
      "refactor",
      "docs",
      "style",
      "test",
      "build",
      "ci",
      "chore",
    ],
    minorExclusionSubscopes: {
      feat: ["fix"],
      prompts: ["fix"],
      instructions: ["fix"],
      skills: ["fix"],
    },
  },
});

export default config;
```

Only include options that are actually needed. Prefer a small config.

If the repository already fits the defaults, this is enough:

```ts
import { createReleaseConfig } from "@dnbhq/release-config";
import type { Config } from "release-it";

const config: Config = createReleaseConfig();

export default config;
```

If only the GitHub token differs, use:

```ts
import { createReleaseConfig } from "@dnbhq/release-config";
import type { Config } from "release-it";

const config: Config = createReleaseConfig({
  githubTokenRef: "GITHUB_TOKEN_CONTENT_PRIVATE",
});

export default config;
```

### `package.json` scripts

Add or update these scripts:

```json
{
  "scripts": {
    "release": "release-it --config .release-it.ts --ci",
    "release:dry": "release-it --config .release-it.ts --dry-run",
    "release:force": "release-it --config .release-it.ts --ci --no-increment",
    "release:patch": "release-it --config .release-it.ts --ci --increment=patch",
    "release:minor": "release-it --config .release-it.ts --ci --increment=minor",
    "release:major": "release-it --config .release-it.ts --ci --increment=major"
  }
}
```

If the installed `release-it` version does not support one of these CLI options, use the valid equivalent for that version and report the change.

Define the scripts as:

| Script | Meaning |
| --------------- | ---------------------------------------------------------------- |
| `release` | normal CI-style release using configured changelog/version rules |
| `release:dry` | dry run without publishing changes |
| `release:force` | re-run/update the current version/tag without incrementing |
| `release:patch` | force patch increment |
| `release:minor` | force minor increment |
| `release:major` | force major increment |

### Repository metadata

If `package.json` lacks `repository`, add it when the GitHub remote can be detected safely.

Supported forms:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/OWNER/REPO.git"
  }
}
```

If the repository URL cannot be detected safely, configure `repository.fallbackUrl` in `.release-it.ts` and report why.

### TypeScript / ESM

The release config must be `.release-it.ts`.

If the repository lacks TypeScript support but has npm tooling, add the minimal required setup only if needed.

Do not add unrelated TypeScript tooling.

If `"type": "module"` is missing and adding it could break the project, do not add it blindly. Instead, explain the compatibility issue and use the safest project-compatible setup.

## Cleanup

After creating the new setup:

1. Remove obsolete release configuration fragments.
2. Remove unused release packages.
3. Remove obsolete release scripts.
4. Preserve unrelated scripts.
5. Update lockfile.
6. Do not delete `CHANGELOG.md`.
7. Do not delete `CITATION.cff`.
8. Do not create a real `.env` file with secrets.

## Validation

Run the safest available validation commands:

```bash
npm install
npm run release:dry
```

If the repository has lint/typecheck/test scripts, run relevant checks unless they are clearly expensive or unrelated.

At minimum, validate that:

- `.release-it.ts` imports correctly
- `npm run release:dry` starts and reads the config
- changelog generation points to the correct GitHub repository
- GitHub token reference uses the selected env key
- npm publishing is disabled unless explicitly requested
- old release config fragments are gone or intentionally retained

## Required final response

Respond with a table.

Use this format:

| Change | Status | Details |
| -------------------------------- | --------------------: | -------------------------------------------------------------------------------------------------- |
| `.release-it.ts` | Done | Created TypeScript release config using `@dnbhq/release-config` |
| GitHub token | Done | Uses `GITHUB_TOKEN_CONTENT_PRIVATE` |
| npm publishing | Done | Disabled |
| Release scripts | Done | Added `release`, `release:dry`, `release:force`, `release:patch`, `release:minor`, `release:major` |
| Existing config migration | Done/Partial/Skipped | Explain what was migrated or why not |
| Removed obsolete packages/config | Done/Partial/Skipped | List removals |
| Validation | Passed/Failed/Skipped | Include command output summary |

Then add one sentence in this exact style, adapted to the currently available features:

```text
Let me know if you want to add npm publishing, custom changelog files, project-specific hooks, repository fallback handling, custom package.json paths, GitHub release overrides, or CITATION.cff release metadata handling to this config.
```

Only mention optional features that are available in the current `@dnbhq/release-config` release or through safe `release-it` overrides.

If something failed, be explicit and include the next concrete fix.
