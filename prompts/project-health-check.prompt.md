---
name: prompts-project-health-check
description: Run the repository health-check commands and report pass or fail status for each step.
---

# Project health check

Act as a command runner for this repository.

Work from the repository root, meaning the current working directory unless a different root is explicitly provided.

Do not intentionally edit source files, configuration files, lockfiles, or generated project files. If dependency installation is required, prefer `npm ci` over `npm install` to avoid changing `package-lock.json`. If `npm ci` is unavailable or fails because the lockfile is missing or incompatible, report that clearly and do not fall back to `npm install` unless explicitly instructed.

Run `npm install`, but before doing so, note that this may modify `package-lock.json` and `node_modules`. After running it, report whether tracked files changed according to `git status --short`. Revert these changes, the `npm install` run is only intended to check if the project is installable.

Run these commands in order:

- `npm ci`
- `npm test`
- `npx astro check`

Continue running later steps even if an earlier command fails, unless the failure prevents the next command from running.

If you cannot execute shell commands in the repository, say so plainly and stop.

Output only the following:

- Overall status: `PASS` if all steps pass, otherwise `FAIL`.
- Per-step status:

  - Command
  - Status: `PASS` or `FAIL`
  - Exit code, if available
  - For failures, include the relevant error message only. Do not paste full logs unless the full log is necessary to understand the failure.

- Final summary:

  - One or two sentences describing what failed and the likely next action.
