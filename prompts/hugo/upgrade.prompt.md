---
name: hugo-upgrade
title: Hugo Upgrade
type: task
description: Upgrade a Hugo site using versioned migration instructions from bep/myhugofixer fixes
---

# Hugo Upgrade

You are working on a Hugo website repository.

Your task is to upgrade this Hugo site to a requested Hugo version using the latest versioned migration instructions from the online `fixes/` directory in `bep/myhugofixer`.

The goal is to provide a safe, repeatable upgrade path for older Hugo sites.

## Source of upgrade instructions

Use the latest online version of the upgrade instruction files from `https://github.com/bep/myhugofixer/tree/main/fixes`.

Treat the Markdown files in that directory as the authoritative source of upgrade guidance.

## Inputs

Before changing files, determine or ask for:

1. Upgrade mode:
   - `asking`
   - `automatic`

2. Target Hugo version:
   - If the user provides a target version, upgrade towards that version.
   - If no target version is provided, use the newest available relevant fixer version and state this assumption clearly.

3. Starting Hugo version:
   - If the user provides a starting version, use that as the lower bound.
   - If the user does not provide a starting version, detect it from the repository.
   - If it cannot be detected, use all available upgrade files and state the risk clearly before changing files.

4. Whether commits should be created:
   - In `asking` mode, commit only after explicit user approval per upgrade step.
   - In `automatic` mode, create one commit per successfully verified upgrade step.

## Version detection

If the starting Hugo version is not provided, check these sources in order:

1. `netlify.toml`
2. `.github/workflows/*`
3. `package.json`
4. `go.mod`
5. `config.*`
6. `hugo.*`
7. project documentation
8. local `hugo version`, if available

Report the detected Hugo version before applying changes.

If multiple versions are found, prefer the version used by the active build or deployment path. Report all detected versions and explain which one is used as the starting version.

## Pre-flight checks

Before starting:

1. Check that the current directory is a Git repository.

   ```bash
   git rev-parse --is-inside-work-tree
   ```

2. Check the working tree state.

   ```bash
   git status --short
   ```

3. If uncommitted changes exist, stop and ask the user how to proceed.

   Exception: In `automatic` mode, do not continue if the working tree is dirty.

4. Check that Hugo is available.

   ```bash
   hugo version
   ```

5. Report the installed Hugo version.

6. Detect the current branch and remember it as the base branch.

   ```bash
   git branch --show-current
   ```

7. Determine how the site is built:
   - direct `hugo`
   - npm script
   - Netlify build command
   - GitHub Actions workflow
   - Docker wrapper
   - custom script

8. Run the current build command before making changes if dependencies are available.

## Branch handling

### Mode: asking

In `asking` mode:

1. Stay on the current branch unless the user explicitly requests a separate branch.
2. Do not create or switch branches automatically.
3. Show the plan before each versioned change.
4. Ask for approval before editing.
5. Ask for approval before committing.

### Mode: automatic

In `automatic` mode:

1. Do not commit directly to the current branch.

2. Create or update a working branch named:

   ```text
   fixes/upgrade
   ```

3. If the branch already exists locally:
   - check it out
   - rebase or merge the latest base branch if safe
   - stop and report the conflict if this cannot be done cleanly

4. If the branch does not exist locally, create it from the current base branch.

5. Apply all upgrade commits only on `fixes/upgrade`.

6. After all upgrade steps succeed:
   - push the branch to the default remote if possible
   - open a pull request if available tooling supports it
   - otherwise report the pushed branch and explain how to open the pull request manually

Suggested pull request title:

```text
fix: apply Hugo upgrade fixes
```

Suggested pull request body:

```markdown
## Summary

This pull request applies versioned Hugo upgrade fixes from `bep/myhugofixer`.

## Applied upgrades

- List applied versions here.

## Verification

- `hugo`
```

## Loading upgrade files

Always load the latest upgrade files from the online repository.

Preferred source:

```text
https://github.com/bep/myhugofixer/tree/main/fixes
```

If a direct Git clone is needed, clone the repository into a temporary location outside the project being upgraded:

```bash
tmpdir="$(mktemp -d)"
git clone https://github.com/bep/myhugofixer.git "$tmpdir/myhugofixer"
```

Then read:

```text
$tmpdir/myhugofixer/fixes
```

Do not copy the fixer repository into the website repository.

Do not commit the fixer repository.

## Upgrade file handling

1. Read all Markdown files in the `fixes/` directory.

2. Treat each filename as a semantic Hugo version.

3. Normalise filenames before sorting:
   - remove `.md`
   - remove a leading `v` if present
   - parse the remaining value as a semantic version

4. Sort all upgrade files by semantic version, lowest to highest.

5. If a starting version was provided or detected, skip all upgrade files lower than or equal to that version.

6. If a target version was provided, skip all upgrade files higher than the target version.

7. Apply each relevant upgrade file in order.

Valid filename examples:

```text
v0.123.0.md
0.123.0.md
```

Both examples represent Hugo version:

```text
0.123.0
```

## Per-version workflow

For each upgrade file:

1. Read the upgrade instructions fully.

2. Analyse the current website repository.

3. Determine which changes are relevant.

4. Ignore instructions that do not apply to this repository.

5. Before editing files, create a short plan containing:
   - target version
   - upgrade file used
   - files likely to be changed
   - changes to apply
   - validation command
   - risks or assumptions

6. Apply only the changes required for that upgrade step.

7. Preserve existing behaviour unless the migration instruction requires a change.

8. Do not perform unrelated cosmetic rewrites.

9. Do not reformat unrelated files.

10. Keep an internal upgrade log containing:

- version
- upgrade file used
- files changed
- summary of applied changes
- verification result
- commit hash, if committed

## Mode: asking workflow

For each version:

1. Show the planned changes before editing.
2. Ask the user to approve applying the changes.
3. Apply the approved changes only.
4. Run verification.
5. Show the resulting diff summary.
6. Ask the user whether to commit.
7. Commit only if the user approves.
8. Continue to the next version only after the current version is verified.

Do not continue through multiple versions without user approval.

## Mode: automatic workflow

For each version:

1. Apply the changes on the `fixes/upgrade` branch.
2. Run verification.
3. Fix verification errors caused by the upgrade.
4. Re-run verification.
5. Commit the successfully verified upgrade step.
6. Continue to the next version.

If a step cannot be completed safely, stop and report the problem instead of guessing.

## Relevant repository areas to inspect

Check these areas even if the first build succeeds:

- Hugo configuration files:
  - `config.toml`
  - `config.yaml`
  - `config.json`
  - `hugo.toml`
  - `hugo.yaml`
  - `hugo.json`
  - `config/_default/*`
  - environment-specific config directories

- Module configuration

- Theme imports

- Template functions

- Deprecated page methods

- Shortcodes

- Render hooks

- Partial templates

- Taxonomy configuration

- Permalink configuration

- Imaging configuration

- Markup configuration

- Output formats

- Asset pipeline usage

- Mounts

- Deployment configuration

- Netlify Hugo version settings

- GitHub Actions Hugo setup steps

- npm scripts that pin, install, or invoke Hugo

- Dockerfiles or container build scripts

- Documentation that mentions the required Hugo version

## Verification

After each versioned upgrade step, run the best available Hugo build command.

Prefer the repository's own build command if one exists.

Common commands to check:

```bash
hugo version
hugo
hugo --gc --minify
npm install
npm test
npm run build
npm run check
npm run lint
npx astro check
```

Do not invent mandatory commands if the project does not use them.

Skip commands that clearly do not apply and report them as skipped.

At minimum, every applied upgrade step must be verified with:

```bash
hugo
```

If `hugo` fails:

1. Analyse the error.
2. Fix the cause if it is clearly related to the current upgrade step.
3. Re-run `hugo`.
4. Do not move to the next upgrade file until `hugo` succeeds.

If the error cannot be fixed confidently, stop and report:

- version being applied
- failing command
- error output
- files already changed
- suggested next action

## Commit rules

Do not apply multiple version upgrade files in a single commit.

Each upgrade file must be:

1. applied independently
2. verified independently
3. committed independently

When committing an upgrade step, use:

```text
fix: apply fixes to upgrade to Hugo $VERSION
```

Where `$VERSION` is the normalised upgrade version without `.md`.

Example:

```text
fix: apply fixes to upgrade to Hugo 0.123.0
```

If the repository has stricter commit rules, follow the repository rules instead.

Stage only files changed for the current Hugo upgrade step.

Do not stage unrelated files.

## Pull request rules

In `automatic` mode, after all applicable upgrade files have been processed and verified:

1. Push the `fixes/upgrade` branch to the default remote.
2. Open a pull request against the original base branch if possible.
3. Include the final upgrade summary in the pull request body.
4. Do not open a pull request if verification fails.

If the pull request cannot be opened, report:

- branch name
- remote push result
- reason the pull request was not opened
- manual pull request instructions, if available

## Safety rules

Do not overwrite user changes.

Do not silently continue with a dirty working tree.

Do not apply upgrade instructions that are not relevant to this repository.

Do not change content, styling, or site behaviour unless required by the Hugo migration.

Do not combine unrelated cleanup with the Hugo upgrade.

Do not mark verification as successful unless the command actually passed.

Do not skip a failing upgrade step and continue to later versions.

Do not use or install the `myhugofixer` CLI.

## Final report

When all applicable upgrade files have been processed, show a final summary:

```markdown
## Hugo upgrade report

- Mode:
- Starting version used:
- Target version:
- Final version reached:
- Base branch:
- Working branch:
- Upgrade source:
- Number of upgrade files processed:
- Number of upgrade files skipped:
- Number of commits created:
- Pull request URL:

## Applied upgrades

| Version   | Result | Commit   | Notes |
| --------- | ------ | -------- | ----- |
| `0.123.0` | PASS   | `<hash>` | ...   |

## Changed files

### `0.123.0`

- `path/to/file`

## Verification

| Step   | Result            | Notes |
| ------ | ----------------- | ----- |
| `hugo` | PASS/FAIL/SKIPPED | ...   |

## Remaining issues

- ...

## Warnings and assumptions

- ...
```

If the upgrade cannot be completed, stop at the failing step and report the exact error.
