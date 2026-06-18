---
description: Incrementally clean up a scratch/ directory by surveying content, detecting duplicates, grouping into smallest sensible tasks, and tracking progress across sessions.
---

You are cleaning up a `scratch/` directory that has grown organically — files were dropped in from many sources at different times, references may be stale, and the same content often appears in multiple places.

The goal is to reach an empty `scratch/` directory, one focused task group at a time. Every run either reduces the directory or records why something must stay.

## Before you begin

Read `scratch/CLEANUP.md` if it exists. That file is the persistent state of this cleanup. If it does not exist, create it now following the structure described in the "Tracking file" section below.

The `CLEANUP.md` records previously agreed groupings, completed tasks, and the preferred order of work. Do not re-derive groupings that are already in `CLEANUP.md` — pick up from where the last session left off.

## Phase 1: survey

Walk every file and directory under `scratch/`. Build a flat inventory grouped by theme. Themes emerge from the content, not the existing folder structure — the existing structure is part of what needs fixing.

Useful grouping signals:
- same tool, technology, or domain (e.g. all Obsidian-related, all prose-style, all TypeScript)
- same asset type across folders (e.g. all agents, all instruction files, all skill directories)
- same original source (e.g. files cloned from an external repo all together)
- duplicates of each other or of files already committed to `ai/`

Record every file. No file should be invisible in the inventory.

## Phase 2: cross-check against the main repository

For each scratch item, check whether equivalent content already exists in the committed tree:
- `ai/instructions/` for instruction files
- `ai/prompts/` for prompt files
- `ai/skills/` for skill directories
- `ai/workflows/`, `ai/templates/`, `ai/docs/` for structured documents

Check for identical or near-identical content, not just identical filenames. A scratch file with the same substance as a committed file is a candidate for deletion, not promotion.

Mark each item with one of:
- **duplicate** — content is already in the committed tree, delete it
- **superseded** — an older or partial version of something already committed, delete it
- **candidate** — has real value, not yet in the committed tree, needs promotion
- **external** — sourced from a third-party repo or ZIP, keep only if we intend to integrate it
- **obsolete** — references dead links, stale plans, or things that no longer apply
- **unclear** — needs a human decision before acting

## Phase 3: group into tasks

Group the remaining non-duplicate, non-obsolete items into the smallest tasks that still make coherent sense together. Items that depend on each other or that belong in the same target location in `ai/` should be one task.

Rules for grouping:
- all Obsidian-related skills together
- all prose/writing-style instructions together
- all TypeScript instruction files together
- all agent files together
- all standalone prompts together
- external/import sources (cloned repos, ZIPs) each get their own task
- planning/process documents (PLANS, ExecPlan format) together
- files that need a human decision together as a single "needs review" task

For each task, write:

```
### Task N: <short name>

Files:
- scratch/path/to/file1
- scratch/path/to/file2

Status: pending | in-progress | done
Action: promote to <target> | delete (duplicate/obsolete) | review needed
Notes: <anything relevant>
```

## Phase 4: offer the work queue

At the end of the survey, list the next 3–5 tasks in order of simplest-first:
1. Start with obvious deletes (duplicates, empty files, superseded copies).
2. Then small promotions (a single file with a clear destination).
3. Save large skill directories and external sources for later.

Ask the user which task to start with, or proceed with the first item if they say to continue.

## Phase 5: execute one task at a time

For each task:
1. State exactly what you will do before doing it.
2. For promotions: move or copy the file(s) to their target location in `ai/`, add required frontmatter if missing, run `node ./scripts/ai.ts validate` to confirm the registry accepts them.
3. For deletes: remove the file(s) or directory.
4. Update `scratch/CLEANUP.md`: mark the task done, note what was done and why.
5. Commit: stage only the files changed in this task and create a focused commit.
6. Then stop and report what was done and what is next.

Do not combine multiple task groups into one step. Do not move on until the current task is committed and `CLEANUP.md` is updated.

## Tracking file

`scratch/CLEANUP.md` has this structure:

```markdown
# Scratch Cleanup

Last updated: YYYY-MM-DD

## Inventory summary

<one-line description of what was found in the initial survey>

## Agreed groupings

<the task table from Phase 3, kept up to date>

## Completed tasks

| Task | Date | Action | Notes |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

## Deferred / needs human decision

<items that are unclear and require input>
```

Update this file at the end of every session before committing.

## Invariants

- Never delete a file without recording the reason in `CLEANUP.md`.
- Never promote a file without verifying it passes `node ./scripts/ai.ts validate`.
- Never batch-delete without reading each file first.
- Commit after each completed task — never accumulate multiple tasks in one commit.
- If a task turns out to be larger than expected, split it and update `CLEANUP.md`.
