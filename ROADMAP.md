# ROADMAP

## Project state

A structured registry of portable AI assets (prompts, skills, instructions, docs) for use with Claude Code and other AI tools. The `scripts/ai.ts` CLI manages validation, linting, schema export, and VS Code integration.

The project has no test suite; `npm run ai:check:release` (`node ./scripts/ai.ts check --release`) is the release gate. As of 2026-06-28, the release gate still **fails** and stops first on the missing frontmatter in `ai/prompts/project-health-check.prompt.md` (#9). The skill-only validator now passes against the root `skills/` directory. Additional tracked validation and lint issues may still be hidden behind the prompt parse failure.

## Project health

| Indicator | Status |
| --- | --- |
| Release gate | Fails: `npm run ai:check:release` stops at #9 |
| Validation | Fails: `npm run ai:validate` stops at #9 |
| AI lint | Fails: `npm run ai:lint` stops at #9 |
| Skill validation | Passes: `npm run lint:skills` validates 12 root skills |
| Known hidden issues | #6 and #7 remain tracked behind early exits |
| Open issues | 11 |
| CI | not configured |

## Open issues

### Bugs / errors (release-blocking)

- **[#9](https://github.com/davidsneighbour/ai/issues/9) — Add YAML frontmatter to `ai/prompts/project-health-check.prompt.md`**
  The file is missing its `---` frontmatter block entirely. The linter exits early on this, hiding all other lint errors and warnings. Fix first — it unblocks visibility into the rest of the lint output.

- **[#5](https://github.com/davidsneighbour/ai/issues/5) — Fix missing `id` and `title` in `dnb-project-task-triage/SKILL.md`**
  Locally resolved by adding `id` and `title` after moving installable skills to the root `skills/` directory. Close once the structure commit is pushed.

- **[#10](https://github.com/davidsneighbour/ai/issues/10) — Fix missing `id` in `dnb-create-js-documentation/SKILL.md`**
  Locally resolved by adding `id` and `title` after moving installable skills to the root `skills/` directory. Close once the structure commit is pushed.

- **[#6](https://github.com/davidsneighbour/ai/issues/6) — Fix lint errors in instruction files**
  Two instruction files have errors: `exec-plans.instructions.md` is missing `applyTo`; `package-json.instructions.md` is missing `description`. Both block `check --release`.

### Warnings / quality

- **[#7](https://github.com/davidsneighbour/ai/issues/7) — Resolve 38+ naming lint warnings**
  Most warnings come from `SKILL.md` files inside installable skill directories — the linter should skip `SKILL.md` when it lives inside `skills/<id>/`. Additionally, several non-skill files need suffix renames. See issue for full file list. Option A (fix the linter) is confirmed as the preferred approach.

### Schema / model

- **[#12](https://github.com/davidsneighbour/ai/issues/12) — Rename `title` to `name` in prompt frontmatter and add validation**
  VS Code uses `name` as the official frontmatter field for prompts. The current schema uses `title`. Needs decision on migration strategy before implementation.

- **[#13](https://github.com/davidsneighbour/ai/issues/13) — Add VS Code prompt file format fields to prompt schema**
  Missing fields: `argument-hint`, `agent` (not yet in schema), and `tools` (verify current impl matches VS Code spec). Depends on #12 decision. Reference: VS Code prompt file format docs.

### New features

- **[#11](https://github.com/davidsneighbour/ai/issues/11) — Add `EXTERNAL.md` — curated list of external AI tools**
  Tracked list of external tools, plugins, and CLI programs used in the AI workflow. First entry: [Understand Anything](https://github.com/Egonex-AI/Understand-Anything). Decision needed: repo root vs `ai/docs/external-tools.doc.md`.

- **[#14](https://github.com/davidsneighbour/ai/issues/14) — Add agents subfolder with validation and schema**
  VS Code custom agents are not yet managed by this registry. Needs new `ai/agents/` directory, naming convention, Zod schema, classifier, validator, and linter support. Review VS Code custom agents docs before implementing.

- **[#15](https://github.com/davidsneighbour/ai/issues/15) — Create `skills.sh.json` config for `dnb-*` skills**
  The skills.sh ecosystem supports per-repo configuration. Create `skills.sh.json` that includes only `dnb-*` prefixed skills. Review [skills.sh/docs/customize](https://www.skills.sh/docs/customize) before implementing.

### Documentation

- **[#8](https://github.com/davidsneighbour/ai/issues/8) — Document external skill install pattern (emilkowalski/skill)**
  README only shows install patterns for this repo. Add a note about the broader `npx skills add <author>/<repo>` pattern and reference emilkowal.ski/skill.

## Suggested order of work

1. **#9** — Fix missing frontmatter in `project-health-check.prompt.md` (unblocks lint visibility)
2. **#6** — Fix lint errors in instruction files (unblocks release gate after #9)
3. **#7** — Update linter to skip `SKILL.md` in installable skill dirs + rename non-skill files
4. **#8** — Add external skill documentation (standalone, 15 min)
5. **#12** — Decide on `title` vs `name` rename strategy; implement
6. **#13** — Add remaining VS Code prompt fields to schema (after #12)
7. **#11** — Add `EXTERNAL.md` (standalone)
8. **#14** — Add agents support (larger feature)
9. **#15** — Create `skills.sh.json` (standalone after reviewing skills.sh docs)

After #9 and #6, `check --release` should exit cleanly. After #7, warnings will also be resolved.

## Open clarification questions

- **#11**: Should the external tools file live at `EXTERNAL.md` (repo root) or `ai/docs/external-tools.doc.md`?
- **#12**: Should `title` be replaced by `name`, or should both coexist as separate fields?
- **#14**: What frontmatter fields does the VS Code custom agent format require?
- **#15**: Where exactly should `skills.sh.json` be placed?
