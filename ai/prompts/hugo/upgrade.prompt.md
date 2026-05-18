---
name: hugo-upgrade
title: Hugo Upgrade
type: task
---

You are working on a GoHugo website repository.

Your task is to apply a hosted set of versioned upgrade instructions from `git@github.com:bep/myhugofixer.git`. Use the `fixes/` directory in that repository as the source of upgrade steps.

## Inputs

Ask the user for the following before changing files:

1. Which mode to use:
   - `asking`
   - `automatic`

2. Which starting version to use:
   - If the user provides a starting version, only apply upgrade files from that version onward.
   - If the user does not provide a starting version, apply all available upgrade files.

## Pre-flight checks

Before starting:

1. Check that the current repository is a Git repository.
2. Check that the working tree is clean.
3. If uncommitted changes exist, stop and ask the user how to proceed.
4. Check that the `hugo` command is available.
5. Check the currently installed GoHugo version with `hugo version`.
6. Report the detected GoHugo version before applying changes.
7. Detect the current branch and remember it as the base branch.

## Branch handling

### Mode: asking

In `asking` mode, stay on the current branch unless the user explicitly requests a separate branch.

Do not create or switch branches automatically in `asking` mode.

### Mode: automatic

In `automatic` mode, do not commit directly to the current branch.

Before applying upgrade changes:

1. Create or update a working branch named `fixes/upgrade`

2. If the branch already exists locally:
   - Check it out.
   - Rebase or merge the latest base branch if safe.
   - If this cannot be done cleanly, stop and report the conflict.

3. If the branch does not exist locally create it from the current base branch.

4. Apply all automatic upgrade commits only on `fixes/upgrade`.

5. After all upgrade steps succeed:
   - Push the branch to the remote if possible.
   - Open a pull request if the available tooling supports it.
   - If a pull request cannot be opened, report the pushed branch and the reason.

Suggested pull request title: `fix: apply GoHugo upgrade fixes`

Suggested pull request body:

```markdown
## Summary

This pull request applies versioned GoHugo upgrade fixes from `git@github.com:bep/myhugofixer.git`.

## Applied upgrades

- List applied versions here.

## Verification

- `hugo`
```

## Upgrade file handling

1. Clone or load the reference repository:

```bash
git clone git@github.com:bep/myhugofixer.git
```

2. Read all files in the `fixes/` directory.

3. Treat each filename as a semantic version, using the filename without `.md`.

   Example:

   `0.123.0.md` becomes version `0.123.0`.

4. Sort all upgrade files by semantic version, lowest to highest.

5. If a starting version was provided, skip all upgrade files lower than the starting version.

6. Apply each upgrade file in order.

## Per-version workflow

For each upgrade file:

1. Read the upgrade instructions fully.

2. Analyse the current website repository and determine which changes are relevant.

3. Before editing files, create a short plan containing:
   - Target version
   - Upgrade file used
   - Files likely to be changed
   - Changes to apply
   - Any risks or assumptions

4. Apply only the changes required by that upgrade file.

5. Keep an internal log of:
   - Version
   - Upgrade file used
   - Files changed
   - Summary of applied changes
   - Verification result
   - Commit hash, if committed

## Mode: asking

For each version:

1. Show the planned changes before editing.
2. Ask the user to approve applying the changes.
3. After applying the changes, run verification.
4. Show the resulting diff summary.
5. Ask the user whether to commit.
6. Commit only if the user approves.
7. Continue to the next version only after the current version is verified.

## Mode: automatic

For each version:

1. Apply the changes on the `fixes/upgrade` branch.
2. Run verification.
3. Fix any verification errors before continuing.
4. Commit the successfully verified changes.
5. Continue to the next version.

If a step cannot be completed safely, stop and report the problem instead of guessing.

## Verification

After each versioned upgrade step, run `hugo`. If `hugo` fails:

1. Analyse the error.
2. Fix the cause.
3. Re-run `hugo`.
4. Do not move to the next upgrade file until `hugo` succeeds.

If the error cannot be fixed confidently, stop and report:

- The version being applied
- The failing command
- The error output
- Files already changed
- Suggested next action

## Commit rules

Do not apply multiple version upgrade files in a single commit. Each upgrade file must be verified and committed independently.

When committing an upgrade step, use:

```text
fix: apply fixes to upgrade to $VERSION
```

Where `$VERSION` is the upgrade filename without `.md`.

Example:

```text
fix: apply fixes to upgrade to 0.123.0
```

## Pull request rules

In `automatic` mode, after all applicable upgrade files have been processed and verified:

1. Push the `fixes/upgrade` branch to the default remote.
2. Open a pull request against the original base branch if possible.
3. Include the final upgrade summary in the pull request body.
4. If the pull request cannot be opened, report:
   - Branch name
   - Remote push result
   - Reason the pull request was not opened
   - Manual pull request instructions, if available

Do not open a pull request if verification fails.

## Final report

When all applicable upgrade files have been processed, show a final summary containing:

- Starting version used
- Final version reached
- Base branch
- Working branch, if used
- Number of upgrade files processed
- Number of upgrade files skipped
- Number of commits created
- List of applied upgrade versions
- List of changed files grouped by version
- Commit hashes, if commits were created
- Pull request URL, if opened
- Any warnings, assumptions, or skipped changes
- Final `hugo` verification result
