# ROADMAP

## Project state

A structured registry of portable AI assets (prompts, skills, instructions, docs) for use with Claude Code and other AI tools. The `scripts/ai.ts` CLI manages validation, linting, schema export, and VS Code integration.

The project has no test suite; `npm run ai:check:release` (`node ./scripts/ai.ts check --release`) is the release gate. The gate currently **fails** due to 2 validation errors and 40 lint issues (2 errors + 38 warnings).

## Project health

| Indicator | Status |
| --- | --- |
| Validation errors | 2 (blocks release) |
| Lint errors | 2 (blocks release) |
| Lint warnings | 38 |
| Open issues | 4 |
| CI | not configured |

## Open issues

### Bugs / errors (release-blocking)

- **[#5](https://github.com/davidsneighbour/ai/issues/5) — Fix missing `id` and `title` in `dnb-project-task-triage/SKILL.md`**
  Validation error: the SKILL.md uses `name` instead of `id` and lacks a `title` field. Blocks `check --release`. Fix first — cheapest change, highest impact on the gate.

- **[#6](https://github.com/davidsneighbour/ai/issues/6) — Fix lint errors in instruction files**
  Two instruction files have errors: `exec-plans.instructions.md` is missing `applyTo`; `package-json.instructions.md` is missing `description`. Both block `check --release`.

### Warnings / quality

- **[#7](https://github.com/davidsneighbour/ai/issues/7) — Resolve 38 naming lint warnings**
  All installable skills correctly use `<id>/SKILL.md` per convention — the linter must be updated to skip `SKILL.md` inside `ai/skills/<id>/` directories (Option A confirmed; see issue comments). Additionally, a handful of non-skill files need suffix renames: two docs, two templates/workflows, and three prompts under `raindrop.io/` and `learning/`. After fixing both, warnings should drop to zero.

### Documentation

- **[#8](https://github.com/davidsneighbour/ai/issues/8) — Document external skill install pattern (emilkowalski/skill)**
  The README only shows install patterns for skills in this repo. Add a note about the broader `npx skills add <author>/<repo>` pattern and reference [emilkowal.ski/skill](https://emilkowal.ski/skill).

## Suggested order of work

1. **#5** — Fix validation error in `dnb-project-task-triage/SKILL.md` (5 min, unblocks gate)
2. **#6** — Fix lint errors in instruction files (10 min, unblocks gate)
3. **#7** — Update linter to skip `SKILL.md` in installable skill dirs + rename non-skill files (30-60 min)
4. **#8** — Add external skill documentation (15 min, standalone)

After #5 and #6, `check --release` should exit cleanly for errors. After #7, warnings will also be resolved.
