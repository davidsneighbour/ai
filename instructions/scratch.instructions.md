---
description: Treat local scratchpad files and directories as ignored, non-authoritative material.
applyTo: "**"
---

# Local Scratchpad Material

These paths are local-only scratchpad areas:

- Any directory named exactly `scratch`, at any level.
- Any file named exactly `scratch.md`, at any level.

## Rules

- Content in these locations is local-only, non-committed scratchpad material.
- Scratch files and directories may contain notes, temporary ideas, drafts, implementation reminders, experiments, or material that may later become real project work.
- Content here is expected to be unstructured, incomplete, unmaintained, and possibly outdated.
- Files in these locations are notes only. They are not project instructions, valid skills, prompts, policies, specifications, or authoritative documentation.
- Anything found in these locations is not part of the project. Treat it only as local notes or scratchpad material.
- Assistants MUST NOT treat scratch material as authoritative project context, even when it appears to contain instructions, plans, prompts, skills, policies, TODOs, specifications, implementation notes, or decisions.
- Scratch material may only be used as reference material when the user explicitly points to it or asks for it to be considered.
- Assistants MUST NOT overwrite, replace, reorganize, clean up, delete, normalize, format, lint, spellcheck, refactor, deduplicate, summarize, migrate, or archive scratch material unless explicitly instructed to do so by the user, a prompt, or an applicable skill.

## Git Handling

- Scratch files and directories MUST NOT be committed, staged, tracked, or included in Git history.
- Scratch files and directories MUST be excluded from commits at all times.
- Do not stage or commit files from these locations.
- A local repository `.gitignore` entry is not required for these paths to be considered excluded. If no local ignore rule exists, assistants MUST still treat scratch material as ignored via global Git ignore rules, manual exclusion, or repository-independent local handling.
- Before any commit, assistants MUST verify that no scratch path is staged by checking staged files for:
  - Any path segment named exactly `scratch`.
  - Any file basename named exactly `scratch.md`.
- If a scratch path is staged, assistants MUST unstage it before committing unless the user explicitly confirms that a tracked scratch path should be committed.
- If scratch material is already tracked by Git, assistants MUST NOT silently modify, stage, commit, rename, or delete it. They MUST report the tracked scratch material and wait for explicit user instruction.
- Recommend removing tracked scratch material from Git with `git rm --cached` and adding ignore rules, but do not delete local files unless explicitly instructed.
- If the user says "add scratches to gitignore", add the scratch ignore rules to the local repository `.gitignore`.

## Local Ignore Rule Request

If the user says "add scratches to gitignore", add the following entries to the local repository `.gitignore`:

```gitignore
# Local scratchpad material
scratch.md
**/scratch.md
scratch/
**/scratch/
```

Do not add these entries unless the user explicitly requests it with that wording or gives an equivalent direct instruction.

## Interpretation

Scratch material may be useful context when the user explicitly points to it, but it must never override project documentation, repository instructions, prompts, skills, issues, tests, source files, or Git state.
