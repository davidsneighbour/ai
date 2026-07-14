---
name: prompts-20-repository-workflows-scratch-cleanup
description: Incrementally clean up a scratch/ directory by surveying content, detecting duplicates, grouping into smallest sensible tasks, and tracking progress across sessions.
---

# Scratch cleanup

You are analysing a `scratch/` directory that has grown organically — files were dropped in from many sources at different times, references may be stale, and the same content often appears in multiple places.

**Important constraints:**

- `scratch/` is gitignored. Never run any git commands inside it or referring to it.
- Do not move, copy, or delete any files during the survey phases. Only read and analyze.
- After completing the survey (phases 1–4), present the task table and wait for the user to choose what to work on next.

The goal is to reach an empty `scratch/` directory, one focused task group at a time. Every run either reduces the directory or records why something must stay.

## Before you begin

Read `scratch/CLEANUP.md` if it exists. That file is the persistent state of this cleanup. If it does not exist, create it now following the structure described in the "Tracking file" section below.

The `CLEANUP.md` records previously agreed groupings, completed tasks, and the preferred order of work. Do not re-derive groupings that are already in `CLEANUP.md` — pick up from where the last session left off. If there are already agreed groupings, skip phases 1–3 and go straight to phase 4 to present the current task table.

## Phase 1: survey

Walk every file and directory under `scratch/`. Build a flat inventory grouped by theme. Themes emerge from the content, not the existing folder structure — the existing structure is part of what needs fixing.

Useful grouping signals:

- same tool, technology, or domain (e.g. all Obsidian-related, all prose-style, all TypeScript)
- same asset type across folders (e.g. all agents, all instruction files, all skill directories)
- same original source (e.g. files cloned from an external repo all together)
- duplicates of each other or of files already committed to the main repository asset directories

Record every file. No file should be invisible in the inventory.

## Phase 2: cross-check against the main repository

For each scratch item, check whether equivalent content already exists in the committed tree:

- `instructions/` for instruction files
- `prompts/` for prompt files
- `skills/` for skill directories
- `ai/workflows/`, `ai/templates/`, `documentation/` for structured documents

Check for identical or near-identical content, not just identical filenames. A scratch file with the same substance as a committed file is a candidate for deletion, not promotion.

Mark each item with one of:

- **duplicate** — content is already in the committed tree, delete it
- **superseded** — an older or partial version of something already committed, delete it
- **candidate** — has real value, not yet in the committed tree, needs promotion
- **external** — sourced from a third-party repo or ZIP, keep only if we intend to integrate it
- **obsolete** — references dead links, stale plans, or things that no longer apply
- **unclear** — needs a human decision before acting

## Phase 3: group into tasks

Group the remaining non-duplicate, non-obsolete items into the smallest tasks that still make coherent sense together. Items that depend on each other or that belong in the same target asset location should be one task.

Rules for grouping:

- all Obsidian-related skills together
- all prose/writing-style instructions together
- all TypeScript instruction files together
- all agent files together
- all standalone prompts together
- external/import sources (cloned repos, ZIPs) each get their own task
- planning/process documents (PLANS, ExecPlan format) together
- files that need a human decision together as a single "needs review" task

For each task, record this in `scratch/CLEANUP.md`:

```markdown
### Task N: <slug>

Files:
- scratch/path/to/file1
- scratch/path/to/file2

Status: pending | in-progress | done
Action: promote to <target> | delete (duplicate/obsolete) | review needed
Notes: <anything relevant>
```

## Phase 4: present the task table

After completing the survey, output a Markdown table with all pending tasks:

| # | Slug | Description | Action | Priority | Suggested? |
| --- | ------ | ------------- | -------- | ---------- | ------------ |
| 1 | `prose-instructions` | 9 prose/writing instruction files | promote to `instructions/writing/` | high | ✓ |
| 2 | `typescript-instructions` | 6 TypeScript instruction files | promote to `instructions/40-languages-and-runtimes/typescript/` | medium | ✓ |
| … | … | … | … | … | … |

Priority rules:

- **high**: pure deletes (confirmed duplicates, clearly obsolete) — zero risk, zero judgement needed
- **medium**: small promotions (1–3 files, clear destination, complete content)
- **low**: large clusters, external sources, binary-heavy directories, or anything needing a human decision

Mark up to 3 tasks as **Suggested** (✓) — these are the simplest, safest starting points.

After presenting the table, stop and ask: **"Which task would you like to work on?"**

Do not proceed until the user picks a task.

## Phase 5: execute one task at a time

Only enter this phase when the user has explicitly chosen a task from the table.

For each task:

1. State exactly what you will do before doing it.
2. For promotions: move or copy the file(s) to their target asset location, add required frontmatter if missing, run `node ./scripts/ai.ts validate` to confirm the registry accepts them.
3. For deletes: remove the file(s) or directory.
4. Update `scratch/CLEANUP.md`: mark the task done, note what was done and why.
5. Commit to the **main repo** (not scratch): stage only the asset files changed in this task and create a focused commit. Do not stage or reference anything under `scratch/`.
6. Report what was done and what is next, then stop.

Do not combine multiple task groups into one step. Do not move on to the next task without being asked.

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

Update this file at the end of every session.

## Invariants

- Never run git commands inside `scratch/` or with paths that include `scratch/`.
- Never delete a file without recording the reason in `CLEANUP.md`.
- Never promote a file without verifying it passes `node ./scripts/ai.ts validate`.
- Never batch-delete without reading each file first.
- Commit only main repository asset changes — scratch is gitignored, its state is not tracked.
- If a task turns out to be larger than expected, split it and update `CLEANUP.md`.
- Always stop after presenting the task table (phase 4) and wait for user input before executing anything.
