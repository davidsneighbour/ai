---
name: prompts-repo-operations-renovate-config-onboarding
description: Onboard the current repository to the shared DNBHQ Renovate config
---

You are working inside the current repository. Add or update Renovate configuration so this project uses `dnbhq/renovate-config`.

## Goal

Onboard the repository to the shared Renovate preset.

The default target behaviour is:

- create or update `renovate.json5` in the repository root
- extend `github>dnbhq/renovate-config`
- preserve required project-specific Renovate overrides
- remove obsolete duplicated settings already provided by the shared preset
- validate the resulting Renovate config
- report exactly what was changed and what project-local options remain

## Available shared config

Use the GitHub preset:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>dnbhq/renovate-config"]
}
```

Do not install `@dnbhq/renovate-config` from npm. This is a Renovate GitHub preset, not a normal runtime package dependency.

## Known shared preset behaviour

Assume the shared preset currently provides:

- `config:recommended`
- semantic commit type set to `chore`
- Dependency Dashboard disabled
- timezone set to `Asia/Bangkok`
- scheduled updates on weekends
- ignore paths for dependency folders and scratch/vendor folders
- selected package grouping
- selected automerge rules
- lock file maintenance enabled
- lock file maintenance automerge
- additional branch prefix based on `parentDir`

Do not duplicate these locally unless the project intentionally overrides them.

## Required first checks

Before changing files, inspect the repository and report what you find:

1. Detect existing Renovate configuration files:
   - `renovate.json`
   - `renovate.json5`
   - `.github/renovate.json`
   - `.github/renovate.json5`
   - `.renovaterc`
   - `.renovaterc.json`
   - `.renovaterc.json5`
   - `renovate` key in `package.json`

2. Inspect GitHub workflow files for Renovate usage:
   - `.github/workflows/*.yml`
   - `.github/workflows/*.yaml`

3. Inspect package manager and lockfiles:
   - `package-lock.json`
   - `pnpm-lock.yaml`
   - `yarn.lock`
   - `bun.lock`

4. Inspect dependency ecosystems present:
   - npm
   - GitHub Actions
   - Docker
   - Hugo modules
   - Go modules
   - Composer
   - Python
   - Rust
   - other detected package files

5. Inspect whether the repository has monorepo/workspace layout:
   - npm workspaces
   - `packages/*`
   - `apps/*`
   - nested lockfiles

6. Inspect current project-specific Renovate settings:
   - schedules
   - package rules
   - ignore paths
   - enabled managers
   - automerge behaviour
   - post-update options
   - custom registries
   - host rules
   - constraints
   - labels
   - reviewers
   - assignees
   - commit message settings
   - branch naming

7. Identify settings that are probably duplicated by `dnbhq/renovate-config`.

## Migration rules

Use this classification for every existing setting:

| Existing setting                                   | Action                       |
| -------------------------------------------------- | ---------------------------- |
| Already provided by `github>dnbhq/renovate-config` | Remove local duplicate       |
| Project-specific and still required                | Preserve locally             |
| Overrides shared preset intentionally              | Preserve locally and explain |
| Obsolete or unused                                 | Remove                       |
| Ambiguous                                          | Preserve and report why      |

Do not blindly delete package rules. Many package rules are project-specific.

Do not remove `hostRules`, custom registries, encrypted secrets, reviewers, labels, or manager-specific settings unless they are clearly obsolete.

## Target `renovate.json5`

If no project-specific overrides are needed, use:

```json5
{
  $schema: "https://docs.renovatebot.com/renovate-schema.json",
  extends: ["github>dnbhq/renovate-config"],
}
```

If project-specific overrides are needed, keep them after the shared preset:

```json5
{
  $schema: "https://docs.renovatebot.com/renovate-schema.json",
  extends: ["github>dnbhq/renovate-config"],
  packageRules: [
    {
      description: "Project-specific rule. Explain why this is local.",
      matchPackageNames: ["example-package"],
      enabled: false,
    },
  ],
}
```

Prefer `renovate.json5` over `renovate.json` because it allows comments and is already the DNBHQ project convention.

Do not create both `renovate.json` and `renovate.json5`.

## Cleanup

After updating the config:

1. Remove obsolete Renovate config fragments.
2. Remove duplicated shared settings.
3. Preserve project-local overrides.
4. Remove obsolete Renovate validation scripts only if replaced.
5. Do not remove unrelated dependency update tooling unless the user asked.
6. Do not add Renovate as a dev dependency unless the project already has a reason to run Renovate locally.
7. Do not create secrets.
8. Do not reformat unrelated files.

## Optional package scripts

If the repository is an npm project, add a validation script only when useful:

```json
{
  "scripts": {
    "renovate:validate": "renovate-config-validator renovate.json5"
  }
}
```

If `renovate-config-validator` is not locally available, prefer using it through `npx` during validation instead of adding Renovate as a permanent dependency.

Do not add this script if the repository does not use npm.

## Validation

Run the safest available validation.

Preferred command:

```bash
npx --yes renovate-config-validator renovate.json5
```

If that command is not available, use the currently valid Renovate validator invocation for the installed Renovate version and report the exact command used.

Validate that:

- `renovate.json5` parses
- the shared preset reference is present
- local overrides are valid Renovate configuration
- old config fragments are gone or intentionally retained
- no duplicate config files conflict with each other

If validation fails because the shared GitHub preset cannot be resolved locally without credentials or network access, report that separately from syntax/config errors.

## Required final response

Respond with a table.

Use this format:

| Change                    |                Status | Details                                  |
| ------------------------- | --------------------: | ---------------------------------------- |
| Config file               |                  Done | Created or updated `renovate.json5`      |
| Shared preset             |                  Done | Extends `github>dnbhq/renovate-config`   |
| Existing config migration |  Done/Partial/Skipped | Explain what was migrated                |
| Local overrides           |             Done/None | List preserved project-specific settings |
| Cleanup                   |  Done/Partial/Skipped | List removed duplicate files/settings    |
| Validation                | Passed/Failed/Skipped | Include command output summary           |

Then add one sentence in this exact style, adapted to this repository:

```text
Let me know if you want to add project-specific package rules, custom schedules, additional automerge rules, reviewer/label settings, manager-specific configuration, host rules, or CI validation for Renovate.
```

Only mention optional features that make sense for the current repository.

If something failed, be explicit and include the next concrete fix.
