---
id: docs-ai-linker-script
title: AI linker script
description: Usage, configuration, safety rules, and tests for scripts/ai-symlink.ts.
---

`scripts/ai-symlink.ts` creates symlinks from this repository into either a
global tool location or a local workspace location. It is intended for AI assets
that should be available to tools without copying files out of the repository.

## Configuration

The script reads `config.toml` from the repository root detected from the script
location. It uses one of two TOML tables:

```toml
[linking.global]
"AGENTS.md" = ".agents/agents.md"
skills = [".agents/skills", ".claude/skills"]
agents = ".agents/agents"
"ai/tasks" = ".agents/tasks"
"ai/memories" = ".agents/memories"

[linking.local]
"AGENTS.md" = ".agents/agents.md"
skills = [".agents/skills", ".claude/skills"]
agents = ".agents/agents"
"ai/tasks" = ".agents/tasks"
"ai/memories" = ".agents/memories"
```

Each entry maps:

- the left side to a source file or directory relative to this repository root
- the right side to one target path, or an array of target paths, relative to
  the selected base path

Use a quoted string for one target, or a quoted string array when the same
source should be linked to multiple tool-specific locations.

For the starter config, the configured targets follow the `.agents` protocol:

- `AGENTS.md` becomes `.agents/agents.md`
- `skills/` becomes `.agents/skills/` and `.claude/skills/`
- `agents/` becomes `.agents/agents/`
- `ai/tasks/` becomes `.agents/tasks/`
- `ai/memories/` becomes `.agents/memories/`

In global mode those targets are created under `~/.agents/`. In local mode,
they are created under `<current-working-directory>/.agents/`.

## Link modes

Use global mode when the symlink should be available from the user home
directory:

```bash
node ./scripts/ai-symlink.ts global
node ./scripts/ai-symlink.ts --global
node ./scripts/ai-symlink.ts --mode global
```

Use local mode when the symlink should be created under the directory where the
command is run:

```bash
node ./scripts/ai-symlink.ts local
node ./scripts/ai-symlink.ts --local
node ./scripts/ai-symlink.ts --mode local
```

When no mode is provided, the script defaults to global mode.

## Existing targets

The script creates missing parent folders before creating symlinks.
Symlink targets are written as relative paths so checked-in local `.agents`
links stay portable across clones.

If the target path already exists:

- a correct symlink is left unchanged
- a non-symlink path is not replaced
- a symlink that points elsewhere is reported
- a broken symlink is reported

Use `--force` to replace an existing wrong or broken symlink:

```bash
node ./scripts/ai-symlink.ts local --force
```

The script does not replace existing non-symlink files or directories, even with
`--force`.

## Verbose output

Use `--verbose` to print changed symlink targets in a `.gitignore`-compatible
format:

```bash
node ./scripts/ai-symlink.ts local --verbose
```

Example output:

```gitignore
# created or replaced symlinks
.agents/agents.md
.agents/skills/
.claude/skills/
.agents/agents/
.agents/tasks/
.agents/memories/
```

If nothing was created or replaced, verbose mode prints:

```gitignore
# no symlinks created or replaced
```

## Path safety

Configured paths are intentionally strict. Source paths must be quoted TOML
strings. Target paths must be quoted TOML strings or arrays of quoted TOML
strings. Every configured path must be relative.

The script rejects configured paths that contain:

- absolute paths
- `.` or `..` path segments
- `~`
- empty path segments
- NUL characters
- tabs or line breaks
- spaces or shell-special path characters

Allowed path segment characters are letters, numbers, dots, underscores, and
hyphens. Forward slashes separate path segments. This keeps TOML values literal:
there is no home expansion, environment expansion, or special interpretation of
dots.

## Safety checks

The script refuses to run as root unless
`ALLOW_ROOT_POSTINSTALL_SYMLINK=1` is set. This keeps postinstall-like runs from
creating links under `/root` by accident.

It also checks that every configured source exists and is a file or directory
before creating a target symlink.

## Testing

Run the focused test suite with:

```bash
npm run test:ai-symlink
```

The tests use temporary local workspaces under the operating system temp
directory. They cover:

- TOML linking section parsing
- string and array target values
- path validation
- local symlink creation
- repeat runs against already-correct symlinks
- refusal to replace a mismatched symlink without `--force`
- replacement of a mismatched symlink with `--force`
