# ROADMAP

## Project State

This repository is a structured registry of portable AI assets for prompts, skills, instructions, docs, and VS Code custom agents. The `scripts/ai.ts` CLI manages registry listing, validation, linting, schema export, and VS Code prompt-file integration.

As of 2026-06-29, the release gate is clean and the issue tracker has one open issue. The recent issue batch closed the previous release blockers, naming cleanup, external-tool documentation, VS Code prompt-field support, agent registry support, and skills.sh configuration work.

## Project Health

| Indicator | Status |
| --- | --- |
| Release gate | Passes: `node ./scripts/ai.ts check --release` |
| Registry validation | Passes: included in release gate |
| Registry lint | Passes: included in release gate with 0 warnings |
| Skill validation | Passes: `node ./scripts/ai.ts validate-skills --root skills` validates 12 skills |
| Script formatting | Passes for changed script files: `npx biome check scripts/ai.ts scripts/lib/ai-schema.ts` |
| Open issues | 1 |
| CI | Not configured |

## Open Issues

### Schema / Model

- **[#12](https://github.com/davidsneighbour/ai/issues/12) - Rename `title` to `name` in prompt frontmatter and add validation**
  VS Code prompt files use `name` as the canonical field. The schema already accepts and validates `name`, but the repository still allows legacy `title` and several prompt files still use it. Decide whether to fully migrate prompt frontmatter to `name` or keep `title` as a separate human-readable display field.

## Suggested Order Of Work

1. **#12** - Finish the prompt `name` strategy. Recommended path: treat `name` as canonical for VS Code prompt identity, keep `title` only if the registry still needs a human-readable label, migrate existing prompt frontmatter accordingly, regenerate schemas, and run the release gate.

## Recent Triage Outcomes

Closed as completed during this triage run:

- **#6** - Instruction frontmatter lint errors are fixed and the release gate passes.
- **#7** - Registry asset suffix warnings are resolved; installable `skills/<id>/SKILL.md` remains the documented convention.
- **#8** - README documents external `npx skills add <author>/<repo>` install patterns.
- **#9** - `prompts/project-health-check.prompt.md` has valid frontmatter and validates.
- **#11** - `documentation/external-tools.md` exists with the Understand Anything entry.
- **#13** - VS Code prompt fields `argument-hint`, `agent`, and `tools` are present in the prompt schema and exported schema.
- **#14** - `ai/agents/` is recognized, `.agent.md` files validate, and an example agent exists.
- **#15** - `skills.sh.json` exists at the repository root and lists the current `dnb-*` skills.

## TODO Inbox

`TODO.md` currently has no actionable items. New rough notes should stay there only until they are clear enough to become GitHub Issues.

## Open Clarification Questions

- **#12**: Should `title` be removed from prompt frontmatter entirely, or retained as an optional display label while `name` becomes the canonical VS Code prompt identifier?
