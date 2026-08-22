# Repository guidelines

## Project structure and module organization

This repository stores reusable AI assets for ChatGPT, Codex, and GitHub Copilot.

- `agents/` contains `.agents` protocol sub-agent profiles grouped under numbered purpose folders. See `agents.index.md`.
- `prompts/` contains prompt Markdown files with YAML front matter, grouped under numbered purpose folders. See `prompts.index.md`.
- `instructions/` contains shared instruction files grouped under numbered purpose folders. See `instructions.index.md` for the full file-by-file index, and read `instructions/index.instructions.md` at the start of a session for a short orientation to the folder and its `applyTo` scoping model.
- `memories/` contains durable memory source files, including the repository glossary. See `memories/glossary.md`.
- `ai/templates/` and `ai/workflows/` contain shared templates and workflow documents.
- `schemas/` contains JSON schemas for prompts, agents, instructions, and docs.
- `scripts/` contains the TypeScript CLI and validators.
- `documentation/` contains notes that have no single home elsewhere in the repository, or that touch multiple scattered locations. Topic-specific documentation belongs next to its topic instead — see "Documentation conventions" below.

## Build, test, and development commands

Use Node from `.nvmrc`; `package.json` requires Node `>=25`.

- `npm install` installs project dependencies.
- `npm run check` runs the full combined quality gate: Biome, TypeScript, the AI registry check, repository-wide Markdown lint, and the `ai-symlink` test suite.
- `npm run ai:list` lists registered AI assets.
- `npm run ai:validate` validates prompt and registry data.
- `npm run ai:lint` runs AI asset linting.
- `npm run ai:check` runs the standard repository checks.
- `npm run ai:check:release` runs stricter release checks.
- `npm run lint` runs AI asset linting and repository-wide Markdown lint.
- `npm run lint:code` runs Biome against `scripts/`.
- `npm run lint:markdown` runs markdownlint for Markdown files.
- `npm run validate:types` runs `tsc --noEmit`.
- `npm run ai:schemas` exports schemas from the TypeScript definitions.

There is no `npm test` script; run `npm run check` as the top-level quality gate before considering work done.

## Documentation conventions

Document a topic in a `README.md` next to what it describes, for example `scripts/README.md` for everything under `scripts/`. Use `documentation/` only when a topic has no single home in the repository or spans multiple scattered locations.

Every README.md in the repository, and every doc in `documentation/`, must be linked from the root `README.md` so nothing is undiscoverable.

Use `memories/glossary.md` as the canonical source for recurring repository terms in documentation, instructions, prompts, skills, memories, and agent profiles. Update it when a term's repository meaning is added or changed.

The root files `agents.index.md`, `instructions.index.md`, and `prompts.index.md` are the discovery indexes for local AI asset roots and external skill collections. Update the matching index in the same change whenever an agent, instruction, prompt, or collection reference is added, removed, renamed, moved, or recategorized.

## Resuming interrupted work

Before starting repository work, agents must check for project-root `RESUME.md`. If it exists, they must read it, resolve or explicitly abandon the unfinished work, and remove `RESUME.md` before starting unrelated work.

## Coding style and naming conventions

TypeScript uses strict settings from `tsconfig.json` with NodeNext modules and no emit. Biome is configured for tabs and double quotes in JavaScript and TypeScript. Run `npx biome check scripts` before changing TypeScript-heavy code.

Prompt and instruction names must be lowercase kebab-case, unique, and match `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`.

Do not add installable skills to this repository. Put new skills in one of the external collection repositories listed in `README.md`.

Markdown should use ATX headings, dash bullets, fenced backtick code blocks, ASCII text, and descriptive link text.

## Testing guidelines

For prompt, schema, or CLI changes, run `npm run ai:validate` and `npm run ai:check`. For repository-wide validation, run `npm run check`.

## Commit and pull request guidelines

Git history uses concise Conventional Commit subjects such as `feat:`, `fix:`, `build(deps):`, `chore(release):`, `prompts:`, `instructions:`, and `skills:`. Keep commits scoped and imperative.

Follow `instructions/commit-and-issue.instructions.md` in this repository, or
`.github/instructions/issue-handling.instructions.md` when this shared
instruction is installed into a project, for all issue, validation, and commit
workflows. Committed AI-assisted changes must reference an issue, but incidental
untracked files must not trigger issue creation unless they are intentionally
added.

Release notes are generated with conventional changelog, but the allowed release scopes are defined in `.release-it.ts`. Check `const minorTypes = new Set([` and `const patchTypes = new Set([` before choosing a subject. Use scopes such as `skills`, `instructions`, and `prompts` when work should appear in its own release-note section.

All commits must follow Conventional Commits, including merge commits. Do not use
Git's default merge subject. Format merge subjects as
`chore(git): merge <source> into <target>` and add a body explaining why the merge
was needed and how conflicts were resolved.

Pull requests should describe the changed asset type, list validation commands run, link related issues when available, and include before/after examples for prompt or workflow behavior changes.
