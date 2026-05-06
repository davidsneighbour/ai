# Repository Guidelines

## Project structure and module organization

This repository stores reusable AI assets for ChatGPT, Codex, and GitHub Copilot.

- `ai/prompts/` contains prompt Markdown files with YAML front matter.
- `ai/skills/` contains reusable skills. Each skill lives in its own directory and must include `SKILL.md`.
- `ai/instructions/`, `ai/templates/`, and `ai/workflows/` contain shared instructions, templates, and workflow documents.
- `schemas/` contains JSON schemas for prompts, skills, and docs.
- `scripts/` contains the TypeScript CLI and validators.
- `documentation/` and `ai/docs/` contain repository notes and conventions.

## Build, test, and development commands

Use Node from `.nvmrc`; `package.json` requires Node `>=25`.

- `npm install` installs project dependencies.
- `npm run ai:list` lists registered AI assets.
- `npm run ai:validate` validates prompt and registry data.
- `npm run ai:lint` runs AI asset linting.
- `npm run ai:check` runs the standard repository checks.
- `npm run ai:check:release` runs stricter release checks.
- `npm run lint` validates skills and skill Markdown.
- `npm run lint:markdown` runs markdownlint for Markdown files.
- `npm run ai:schemas` exports schemas from the TypeScript definitions.

There is currently no general `npm test` script; use the validation commands above as the test gate.

## Coding style and naming conventions

TypeScript uses strict settings from `tsconfig.json` with NodeNext modules and no emit. Biome is configured for tabs and double quotes in JavaScript and TypeScript. Run `npx biome check scripts` before changing TypeScript-heavy code.

Prompt and instruction names must be lowercase kebab-case, unique, and match `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`. Skill directory names must match the `id` in `SKILL.md` front matter.

Markdown should use ATX headings, dash bullets, fenced backtick code blocks, ASCII text, and descriptive link text.

## Testing guidelines

For prompt, schema, or CLI changes, run `npm run ai:validate` and `npm run ai:check`. For skill changes, run `npm run lint:skills` or `npm run lint:skills:verbose`, plus `npm run lint:skills:markdown`.

Name new skills as `ai/skills/<skill-id>/SKILL.md`, where `<skill-id>` is lowercase kebab-case.

## Commit and pull request guidelines

Git history uses concise conventional-style prefixes such as `feat:`, `fix:`, `build(deps):`, `chore(release):`, `prompts:`, and `ai(instructions):`. Keep commits scoped and imperative.

Pull requests should describe the changed asset type, list validation commands run, link related issues when available, and include before/after examples for prompt or workflow behavior changes.
