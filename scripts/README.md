# scripts/

This directory contains the tooling that manages the AI asset registry: validation, linting, schema export, README generation, VS Code setup, and the symlink installer used to expose repository assets under `.agents`-protocol paths.

- [scripts/ai.ts](#scriptsaits)
  - [Commands](#commands)
  - [Global options](#global-options)
  - [Classification](#classification)
  - [validate](#validate)
  - [lint](#lint)
  - [validate-skills](#validate-skills)
  - [check](#check)
  - [drift-report](#drift-report)
  - [export-schemas](#export-schemas)
  - [build-documentation](#build-documentation)
  - [setup --prompts](#setup---prompts)
- [scripts/ai-symlink.ts](#scriptsai-symlinkts)
  - [Configuration](#configuration)
  - [Modes](#modes)
  - [Existing targets and safety](#existing-targets-and-safety)
  - [Options](#options)
  - [Testing](#testing)
- [scripts/lib/](#scriptslib)
- [npm script reference](#npm-script-reference)

## scripts/ai.ts

`ai.ts` is the registry CLI. It reads Markdown files with YAML frontmatter from the managed asset directories, classifies them, and validates, lints, or reports on them. It's runnable directly with `node ./scripts/ai.ts <command>` or, once installed globally (`npm run setup:cli`), as the `ai` command.

### Commands

| Command | Purpose |
| --- | --- |
| `help` | Print usage, options, and `validate-skills` rules. |
| `list` | List all registry items. |
| `show --id <id>` | Print one registry item by id. |
| `validate` | Validate frontmatter against the Zod schema for each item's kind. |
| `lint` | Check style and policy rules: unknown frontmatter keys, empty bodies, filename suffixes, required fields. |
| `validate-skills` | Validate installable `skills/<id>/` directories independently of the registry classification. |
| `drift-report` | List frontmatter keys not recognised by any schema, grouped by key and by file. |
| `export-schemas` | Write the Zod schemas to JSON Schema files under `schemas/`. |
| `build-documentation` | Regenerate the prompt-file-locations section of `README.md` between its marker comments. |
| `setup --prompts` | Write `chat.promptFilesLocations` into `.vscode/settings.json`. |
| `check` | Run `validate` and `lint` together and report combined totals; the release gate. |

### Global options

| Option | Effect |
| --- | --- |
| `--root <path>` | Registry root (default: repository root); for `validate-skills`, the skills root (default: `./skills`). |
| `--schemas <path>` | Schema output directory for `export-schemas` (default: `./schemas`). |
| `--id <id>` | Item id, required by `show`. |
| `--mode glob\|folders` | Prompt setup mode for `setup --prompts`. |
| `--json` | Print machine-readable JSON instead of formatted text. |
| `--verbose` | Print additional diagnostics. |
| `--no-content` | For `show`, omit the item body from output. |
| `--release` | Promote lint warnings to errors (used before releases and in the pre-push hook). |
| `--no-exit-on-error` / `--noExitOnError` | Don't exit non-zero on validation/lint/check failure. |
| `--help`, `-h` | Show usage. |

### Classification

Files are scanned from the managed asset directories (`prompts/`, `instructions/`, `agents/`, `documentation/`, `ai/templates/`, `ai/workflows/`, all resolved from the repository root) and classified by path, checked in this order:

1. `type: skill` in frontmatter, or a path containing `/skills/` → **skill**
2. Path containing `/agents/` → **agent**
3. Path containing `/documentation/` → **doc**
4. Path containing `/instructions/` → **instruction**
5. Anything else → **prompt** (the fallback)

Each kind validates against its own Zod schema (`PromptSchema`, `AgentSchema`, `SkillSchema`, `DocSchema`, `InstructionSchema` in [lib/ai-schema.ts](lib/ai-schema.ts)).

### validate

Parses each item's frontmatter against its kind's schema and reports schema-validation errors (missing required fields, wrong types, failed regex patterns, and so on). This is a strict pass/fail check with no warning tier.

### lint

Style and policy checks, each emitted as a warning by default and promoted to an error under `--release`:

- **schema-drift** — unknown frontmatter key not defined by the schema.
- **empty-body** — the Markdown body is empty after trimming.
- **naming** — wrong file suffix for the kind (`.doc.md`, `.instructions.md`, `.prompt.md`, `.skill.md`, or the `.agents` protocol's `agent.md` / `SKILL.md` filenames).
- **location** — instruction files must live under an `instructions/` directory (subfolders allowed).

A few checks are always hard errors, regardless of `--release`:

- **missing-description** — doc and instruction files must have a non-empty `description`.
- **missing-apply-to** — instruction files must have a non-empty `applyTo`.
- **missing-id** — agent files must have a non-empty `id`.
- duplicate `id`/`name` values across the registry.

### validate-skills

Validates installable skill directories under `skills/<id>/` independently of the prompt/agent/doc/instruction registry:

- The skills root must exist.
- Each direct child directory is treated as one skill.
- Each skill directory must contain `SKILL.md`.
- `SKILL.md` must start with non-empty YAML frontmatter and a non-empty body.
- Frontmatter must contain an `id` field.
- The skill directory name must match the frontmatter `id`.
- If `name` exists, it must match `id`.
- `id` must match `/^[a-z0-9-]+$/`.

### check

Runs `validate` and `lint` together, adds duplicate-id checks, and prints combined totals (`Validation errors`, `Lint errors`, `Lint warnings`, `Total errors`, `Total warnings`). Exits non-zero when `Total errors` is above zero, unless `--no-exit-on-error` is passed. This is the command run by the pre-push hook (`--release`), scoped to the AI registry only. The repository-wide quality gate is `npm run check` (see the [npm script reference](#npm-script-reference)) — there is no `npm test`.

### drift-report

Lists every frontmatter key that no schema recognises, grouped both by key (with the files that use it) and by file (with the keys it uses). Useful for spotting typos or fields that should be promoted into the schema before they spread.

### export-schemas

Converts the Zod schemas in `lib/ai-schema.ts` to JSON Schema (draft-7) and writes them to `schemas/*.schema.json`. Run this whenever the data model changes.

### build-documentation

Regenerates the content between `<!-- ai:prompt-files-settings:start -->` and `<!-- ai:prompt-files-settings:end -->` in `README.md`: it lists the direct child folders of the configured `promptFilesRoot` (`config.toml`'s `[paths]` section) and writes both the recursive-glob and individual-folder `chat.promptFilesLocations` examples. Do not hand-edit the generated block — rerun this command instead, or the next run will overwrite manual edits.

### setup --prompts

Writes `chat.promptFilesLocations` into `.vscode/settings.json`:

- `--mode glob` (default) — one recursive glob covering all prompt folders.
- `--mode folders` — one entry per direct prompt folder, so groups can be toggled independently.

## scripts/ai-symlink.ts

`ai-symlink.ts` creates the symlinks that expose this repository's assets at the paths other tools expect (the `.agents` protocol, Claude Code's `.claude/skills`, and so on). It reads the `[linking.global]` / `[linking.local]` tables in `config.toml` from the repository root detected from the script location.

Installed as the `ai-symlink` bin (see `package.json`); run directly with `node ./scripts/ai-symlink.ts`.

### Configuration

Each entry in `[linking.global]` / `[linking.local]` maps:

- the left side (key) to a source file or directory relative to the repository root
- the right side (value) to one target path, or an array of target paths, relative to the selected base path

Use a quoted string for one target, or a string array when the same source should be linked to multiple tool-specific locations. For the current config, sources follow the `.agents` protocol (`AGENTS.md` → `.agents/agents.md`, `skills/` → `.agents/skills/` and `.claude/skills/`, `agents/` → `.agents/agents/`, `tasks/` → `.agents/tasks/`, `memories/` → `.agents/memories/`).

### Modes

```bash
node ./scripts/ai-symlink.ts global   # link into $HOME (e.g. ~/.agents/skills)
node ./scripts/ai-symlink.ts local    # link into the current project (cwd)
node ./scripts/ai-symlink.ts --mode global --force --verbose
```

In global mode, targets are created under `~/.agents/` (and `~/.claude/skills/`, etc.). In local mode they're created under `<cwd>/.agents/`. When no mode is given, the script defaults to global.

### Existing targets and safety

The script creates missing parent folders before creating symlinks and writes targets as relative paths so checked-in local `.agents` links stay portable across clones. If the target path already exists: a correct symlink is left unchanged, a non-symlink path is never replaced (even with `--force`), and a symlink pointing elsewhere or a broken symlink is reported. Use `--force` to replace a wrong or broken symlink.

Configured paths are checked strictly: every path must be relative, and the script rejects absolute paths, `.`/`..` segments, `~`, empty segments, NUL/tab/newline characters, and shell-special characters. It also refuses to run as root unless `ALLOW_ROOT_POSTINSTALL_SYMLINK=1` is set, and refuses to create a symlink whose source path doesn't exist rather than creating a broken link.

### Options

- `--force` — replace an existing wrong or broken symlink at the target path.
- `--verbose` — print the list of created or replaced symlinks in gitignore-style path form (e.g. `.agents/skills/` for a directory, `.agents/agents.md` for a file).

### Testing

Tested by `scripts/ai-symlink.test.ts` (`npm run test:ai-symlink`), using temporary local workspaces under the OS temp directory. Coverage includes TOML linking-section parsing, string and array target values, path validation, local symlink creation, repeat runs against already-correct symlinks, refusal to replace a mismatched symlink without `--force`, and replacement with `--force`.

## scripts/lib/

| File | Purpose |
| --- | --- |
| [ai-schema.ts](lib/ai-schema.ts) | Zod schemas for the data model: `PromptSchema`, `AgentSchema`, `SkillSchema`, `DocSchema`, `InstructionSchema`, plus shared fragments (`ReferenceSchema`, `InputFieldSchema`). Source of truth for both validation and `export-schemas`. |
| [config.ts](lib/config.ts) | Loads and parses `config.toml`'s `[paths]`, `[prompts]`, and `[readme.promptFilesSettings]` sections into a typed `RepositoryConfig`, used by `build-documentation` and `setup --prompts`. |

## npm script reference

| npm script | Underlying command |
| --- | --- |
| `ai:check` | `node ./scripts/ai.ts check` |
| `ai:check:release` | `node ./scripts/ai.ts check --release` |
| `ai:drift` | `node ./scripts/ai.ts drift-report` |
| `ai:lint` | `node ./scripts/ai.ts lint` |
| `ai:list` | `node ./scripts/ai.ts list` |
| `ai:schemas` | `node ./scripts/ai.ts export-schemas` |
| `ai:show` | `node ./scripts/ai.ts show` |
| `ai:validate` | `node ./scripts/ai.ts validate` |
| `build:documentation` | `node ./scripts/ai.ts build-documentation` |
| `check` | `npm run lint:code && npm run validate:types && npm run ai:check && npm run lint && npm run lint:markdown && npm run test:ai-symlink` — the repository-wide quality gate |
| `lint:code` | `biome check scripts` |
| `lint:skills` | `node ./scripts/ai.ts validate-skills --root skills` |
| `lint:skills:verbose` | `node ./scripts/ai.ts validate-skills --root skills --verbose` |
| `setup`, `setup:prompts` | `node ./scripts/ai.ts setup --prompts` |
| `setup:prompts:glob` | `node ./scripts/ai.ts setup --prompts --mode glob` |
| `setup:prompts:folders` | `node ./scripts/ai.ts setup --prompts --mode folders` |
| `setup:cli` | `npm install -g .` (installs the `ai` / `ai-symlink` bins globally) |
| `validate:types` | `tsc --noEmit` |
| `hooks:install` | `npx simple-git-hooks` |
| `test:ai-symlink` | `node --test ./scripts/ai-symlink.test.ts` |
