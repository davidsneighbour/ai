# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A structured registry of portable AI assets (prompts, skills, instructions, docs) for use with ChatGPT, Codex, GitHub Copilot, and Claude Code. The `scripts/ai.ts` CLI manages validation, linting, schema export, and VS Code integration.

## Common commands

```bash
# Validate frontmatter against schemas
node ./scripts/ai.ts validate

# Lint for style and policy issues (suffix, empty body, drift)
node ./scripts/ai.ts lint

# Validate installable skill directories
node ./scripts/ai.ts validate-skills --verbose

# Full health check (validation + linting); use before commits and releases
node ./scripts/ai.ts check --release

# List all registry items
node ./scripts/ai.ts list

# Show one item by ID
node ./scripts/ai.ts show --id <id>

# Export Zod schemas to JSON Schema files in schemas/
node ./scripts/ai.ts export-schemas

# Regenerate prompt-location section in README.md
node ./scripts/ai.ts build-documentation

# Configure VS Code prompt file locations in .vscode/settings.json
node ./scripts/ai.ts setup --prompts --mode glob

# Run AI asset linting via npm alias
npm run ai:lint

# Lint skills and skill Markdown
npm run lint:skills
npm run lint:skills:markdown

# Full combined quality gate (Biome, TypeScript, AI registry check, skills, repo-wide Markdown lint, ai-symlink tests)
npm run check
```

Node version is pinned in `.nvmrc`; `package.json` requires `>=25`.

There is no `npm test` — `npm run check` is the top-level quality gate; `npm run ai:check` or `npm run ai:check:release` cover just the AI registry.

## Git hooks

`simple-git-hooks` runs two hooks:

- **pre-commit**: `lint-staged` — runs Biome, markdownlint, secretlint, and `node ./scripts/ai.ts lint` (when AI files are staged).
- **pre-push**: `node ./scripts/ai.ts check --release` — full registry check in strict mode.

Install hooks after cloning: `npm run hooks:install`.

## Architecture

### Registry classification (`scripts/ai.ts`)

Registry Markdown files are scanned from the managed asset directories:

- root `prompts/`
- root `instructions/`
- `ai/agents/`, `documentation/`, `ai/templates/`, and `ai/workflows/`

Files are classified by path:

- **skill** — path contains `/skills/` or frontmatter says `type: skill`
- **agent** — path contains `/agents/`
- **doc** — path contains `/documentation/`
- **instruction** — path contains `/instructions/`
- **prompt** — everything else (the fallback)

The data model lives in `scripts/lib/ai-schema.ts` (Zod schemas). The CLI in `scripts/ai.ts` reads, validates, lints, and exports based on that model. Keep schema changes in `ai-schema.ts`; keep runtime logic in `ai.ts`.

### File naming conventions

- Prompts: `<name>.prompt.md`
- Skills (registry entries): `<name>.skill.md`
- Installable skills: `skills/<skill-id>/SKILL.md` where the directory name matches the `id` field
- Agents: `<name>.agent.md`
- Docs: `<name>.doc.md`

Suffixes are enforced by the linter, not the classifier — a misnamed file may still be classified correctly but will fail `lint`.

### Frontmatter requirements

Every file needs YAML frontmatter and a non-empty Markdown body. Prompt files use `name` as their canonical identifier. Prompt `name` values must be lowercase kebab-case matching `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`, unique across the registry, and derived from the repository-relative file path, e.g. `prompts-hugo-upgrade` for `prompts/hugo/upgrade.prompt.md`.

Prompt-specific optional fields: `argument-hint` (string), `agent` (string), `model` (string), `skills` (string array), `tools` (string array), and `strict` (boolean). Do not use `id` or `title` in prompt frontmatter.

Docs and installable skills still use `id`, `title`, and `description` according to their schemas.

Agent-specific optional fields follow the VS Code custom agent format: `name`, `argument-hint`, `tools`, `agents`, `model`, `handoffs`, and `target`.

### Installable skills (`skills/<id>/`)

Each installable skill is a directory with a `SKILL.md`. The directory name must match the `id` in frontmatter. Install patterns:

```bash
npx skills add davidsneighbour/ai/skills --skill '*' --yes          # all skills
npx skills add davidsneighbour/ai/skills --skill <id> --yes         # one skill
npx skills add davidsneighbour/ai/skills --skill '*' --global --yes # globally
npx skills add emilkowalski/skill --yes                             # external repository
```

### Config-driven paths (`config.toml`)

Paths for `README.md`, `.vscode/settings.json`, and `.github/prompts/` are configured in `config.toml`. The `build-documentation` and `setup` commands read from there — edit `config.toml` rather than hardcoding paths in scripts.

### TypeScript style

Strict mode throughout (`tsconfig.json`). Biome for formatting: tabs, double quotes. Module system is NodeNext with `.ts` import extensions allowed. Run `npx biome check scripts` before TypeScript changes.

## Workflow for registry changes

1. Create/edit a file in a managed asset directory with the correct suffix and frontmatter.
2. Run `node ./scripts/ai.ts validate` then `node ./scripts/ai.ts lint`.
3. For skill directory changes: `node ./scripts/ai.ts validate-skills`.
4. Run `node ./scripts/ai.ts check --release` before committing.
5. If the data model in `scripts/lib/ai-schema.ts` changed: run `node ./scripts/ai.ts export-schemas`.
6. If prompt folder layout changed: run `node ./scripts/ai.ts build-documentation`.

## File location shorthands

When the user refers to files using these shorthand phrases, resolve the actual path from the `[locations]` section of `config.toml`. That file is the single source of truth — check it if a mapping is unclear or new types have been added.

Current mappings:

| Phrase | Resolved path |
| --- | --- |
| "local instruction file in `<path>`" | `.vscode/instructions/<path>` |
| "instruction file in `<path>`" | `instructions/<path>` |
| "local prompt file in `<path>`" | `.vscode/prompts/<path>` |
| "prompt file in `<path>`" | `prompts/<path>` |
| "local skills file in `<path>`" | `.vscode/skills/<path>` |
| "skills file in `<path>`" | `skills/<path>` |
| "local docs file in `<path>`" | `.vscode/docs/<path>` |
| "docs file in `<path>`" | `documentation/<path>` |

The resolution rule is: `<qualifier-prefix>/<type-subdir>/<path>` where:

- **no qualifier** → `registry` prefix (`./`)
- **"local"** qualifier → `local` prefix (`.vscode/`)
- the asset type word maps to a subdir via `[locations.types]`

To extend this system, add new entries to `config.toml [locations.qualifiers]` or `[locations.types]` and update the table above.

## Commit style

Conventional commits with scoped prefixes: `feat:`, `fix:`, `build(deps):`, `chore(release):`, `prompts:`, `instructions:`, and `skills:`. Keep commits scoped and imperative. Check `.release-it.ts` before choosing asset-specific commit types so release notes land in the intended section.
