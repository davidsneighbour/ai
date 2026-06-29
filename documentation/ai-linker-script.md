# AI linker script

`scripts/ai-symlink.ts` creates symlinks from this repository into either a
global tool location or a local workspace location. It is intended for AI assets
that should be available to tools without copying files out of the repository.

## Configuration

The script reads `config.toml` from the repository root detected from the script
location. It uses one of two TOML tables:

```toml
[linking.global]
skills = ".agents/skills"

[linking.local]
skills = ".agents/skills"
```

Each entry maps:

- the left side to a source directory relative to this repository root
- the right side to a target directory relative to the selected base path

For the starter config, `skills = ".agents/skills"` means:

- source: `<repo-root>/skills`
- global target: `~/.agents/skills`
- local target: `<current-working-directory>/.agents/skills`

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
.agents/skills/
```

If nothing was created or replaced, verbose mode prints:

```gitignore
# no symlinks created or replaced
```

## Path safety

Configured paths are intentionally strict. Source and target paths must be
quoted TOML strings and must be relative path values.

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

It also checks that every configured source exists and is a directory before
creating a target symlink.

## Testing

Run the focused test suite with:

```bash
npm run test:ai-symlink
```

The tests use temporary local workspaces under the operating system temp
directory. They cover:

- TOML linking section parsing
- path validation
- local symlink creation
- repeat runs against already-correct symlinks
- refusal to replace a mismatched symlink without `--force`
- replacement of a mismatched symlink with `--force`
