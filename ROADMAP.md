# ROADMAP

## Project state

This repository is a structured registry of portable AI assets for prompts, skills, instructions, docs, and VS Code custom agents. The `scripts/ai.ts` CLI manages registry listing, validation, linting, schema export, and VS Code prompt-file integration.

As of 2026-06-30, the local release gate is clean and the issue tracker has two open issues. The prompt `name` migration issue is closed; the remaining work is now focused on quality-gate policy: deciding how networked OSV scanning should run and whether ignored `scratch/` notes belong in Markdown lint scope.

## Project health

| Indicator | Status |
| --- | --- |
| Release gate | Passes: `npm run ai:check:release` |
| Registry validation | Passes: `npm run ai:check` reports 0 errors and 0 warnings |
| Registry lint | Passes: `npm run ai:check` and `npm run ai:check:release` report 0 warnings |
| Skill validation | Passes: `node ./scripts/ai.ts validate-skills --root skills` validates 12 skills |
| Skill Markdown lint | Passes: `npm run lint` |
| Broad Markdown lint | Passes: `npm run lint:markdown` |
| Script formatting | Passes: `npx biome check scripts` |
| Script test | Passes: `npm run test:ai-symlink` |
| System vulnerability scan | Not completed locally; `npm run lint:system` requires explicit approval to contact OSV |
| Open issues | 2 |
| CI | Not configured |

## Open issues

### Quality gates

- **[#16](https://github.com/davidsneighbour/ai/issues/16) - chore: decide OSV system lint policy**
  Decide whether `npm run lint:system` should remain a manual/networked check, move into CI or another trusted environment, use an offline alternative, or be documented as optional because it sends dependency metadata to OSV.

- **[#17](https://github.com/davidsneighbour/ai/issues/17) - fix: align markdown lint scope with ignored scratch files**
  Decide whether ignored `scratch/` notes should be linted. If not, adjust the command or ignore configuration so untracked local notes do not make tracked repository checks fail.

## Suggested order of work

1. **#17** - Fix the Markdown lint scope first. It is local, low-risk, and removes a surprising contributor workflow failure.
2. **#16** - Decide the OSV policy after that. This needs an explicit trust-boundary decision, and may tie into future CI setup.

## Recent triage outcomes

Created during this triage run:

- **#16** - Tracks the OSV system-lint trust boundary and release-gate policy.
- **#17** - Tracks the mismatch between ignored `scratch/` notes and the broad Markdown lint glob.

Already closed before this triage run:

- **#6** - Instruction frontmatter lint errors are fixed and the release gate passes.
- **#7** - Registry asset suffix warnings are resolved; installable `skills/<id>/SKILL.md` remains the documented convention.
- **#8** - README documents external `npx skills add <author>/<repo>` install patterns.
- **#9** - `prompts/project-health-check.prompt.md` has valid frontmatter and validates.
- **#11** - `documentation/external-tools.md` exists with the Understand Anything entry.
- **#12** - Prompt frontmatter uses `name` as the canonical prompt identifier.
- **#13** - VS Code prompt fields `argument-hint`, `agent`, and `tools` are present in the prompt schema and exported schema.
- **#14** - `ai/agents/` is recognized, `.agent.md` files validate, and an example agent exists.
- **#15** - `skills.sh.json` exists at the repository root and lists the current `dnb-*` skills.

## TODO inbox

`TODO.md` currently has no actionable items. The OSV policy item and Markdown scratch-lint item were moved into GitHub Issues #16 and #17. The prompt `name` item was removed because issue #12 is already closed.

## Open clarification questions

- **#16**: Should OSV scanning be considered part of the default release gate, or a manual/security-only check? Is sending dependency metadata to the public OSV API acceptable for this repo?
- **#17**: Should `scratch/` be a linted local workspace despite being ignored, or should lint commands focus only on tracked repository content?
