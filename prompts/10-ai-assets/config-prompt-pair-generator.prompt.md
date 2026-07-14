---
name: prompts-10-ai-assets-config-prompt-pair-generator
description: Create an onboarding prompt and optimisation prompt for a shared configuration repository
---

# Config prompt pair generator

You are creating reusable prompt files for onboarding projects to a shared configuration repository.

The user will give you one configuration repository, package, preset, or shared tooling repo.

Your job is to analyse that source repository and produce two prompts:

1. an onboarding prompt that applies the shared configuration to the current repository
2. an optimisation prompt that improves the onboarding prompt after real-world usage

## Input

The user may provide any of:

- a GitHub repository URL
- an npm package name
- a preset name
- a local package path
- a short description of the shared configuration
- existing draft instructions
- known defaults
- required scripts
- known edge cases

If the user only provides a repository URL, inspect the repository and infer the current package surface from:

- `README.md`
- `package.json`
- exported files
- documented usage
- examples
- release notes or changelog if useful
- configuration files in the source repo
- tests if they clarify behaviour

Use the latest visible repository/package state. Do not rely on outdated assumptions.

## Goal

Create a prompt pair following this pattern:

```text
<config-name>-onboarding.prompt.md
<config-name>-prompt-optimise.prompt.md
```

The onboarding prompt must help an agent apply the shared config to whichever repository it is run in.

The optimisation prompt must help improve the onboarding prompt after testing it in real repositories.

## Decide prompt vs skill

Default to prompt files.

Use a skill file only if all of these are true:

- the process is stable
- the process has been tested in several repositories
- the workflow has clear trigger conditions
- the workflow needs repeatable procedural behaviour more than editable prompt text
- the user explicitly wants a skill or the repo is mature enough for one

If in doubt, create prompt files and say that a skill can come later after testing.

## Naming

Infer a concise config name from the source repo.

Examples:

| Source | Prompt names |
| ---------------------- | --------------------------------------------------------------------------------- |
| `dnbhq/release-config` | `release-config-onboarding.prompt.md`, `release-config-prompt-optimise.prompt.md` |
| `dnbhq/tsconfig` | `tsconfig-onboarding.prompt.md`, `tsconfig-prompt-optimise.prompt.md` |
| `dnbhq/biome-config` | `biome-config-onboarding.prompt.md`, `biome-config-prompt-optimise.prompt.md` |

Prefer storing these in:

```text
prompts/20-repository-workflows/
```

unless the config is clearly framework-specific.

## Required source-repo analysis

Before writing the prompts, identify:

1. package name
2. repository name
3. installation method
4. package manager assumptions
5. exported config files or preset names
6. documented usage
7. required peer dependencies
8. required direct dependencies
9. optional dependencies
10. config file names expected in consuming repositories
11. whether consuming projects should install a package, extend a GitHub preset, copy a file, or call a factory function
12. available configuration options
13. default behaviour
14. unsupported features
15. migration risks
16. validation commands
17. package scripts worth adding
18. cleanup rules
19. common existing config fragments to scan for
20. final reporting format

Do not invent features. If the source repo does not document a feature, either omit it or mark it as unavailable.

## Required output structure

Return:

```markdown
## Recommendation

...

## Suggested files

...

## Prompt 1: onboarding

...

## Prompt 2: optimisation

...
```

The two prompts must be complete, standalone prompt files.

## Onboarding prompt requirements

The onboarding prompt must include these sections:

```markdown
# <config-name>-onboarding.prompt.md

---

## description: Onboard the current repository to <shared config/package/preset>

## Goal

## Available shared config

## Known shared behaviour

## Required first checks

## Installation

## Target configuration

## Existing configuration migration

## Package scripts

## Cleanup

## Validation

## Required final response
```

Add or remove sections only when the specific config requires it.

## Onboarding prompt content rules

The onboarding prompt must tell the agent to inspect the current repository before changing anything.

It must include exact file names to scan for existing config.

It must include exact dependencies to add or avoid.

It must distinguish between:

- shared defaults
- local overrides
- unsupported features
- obsolete fragments
- ambiguous settings

It must preserve project-specific configuration unless clearly obsolete.

It must remove duplicated configuration only when the shared config already provides it.

It must avoid unsafe mass rewrites.

It must validate the final setup.

It must require a final table of changes.

## Required first checks section

The onboarding prompt must include checks for:

- `package.json`
- package manager lockfiles
- existing config files for the relevant tool
- existing scripts
- existing dependencies
- framework indicators
- generated folders
- monorepo/workspace layout if relevant
- CI/workflow usage if relevant

Use exact filenames wherever possible.

## Existing configuration migration section

Use this table pattern:

```markdown
| Existing setting                        | Action                       |
| --------------------------------------- | ---------------------------- |
| Already provided by the shared config   | Remove local duplicate       |
| Project-specific and still required     | Preserve locally             |
| Overrides shared defaults intentionally | Preserve locally and explain |
| Obsolete after migration                | Remove                       |
| Unsupported by the shared config        | Report explicitly            |
| Ambiguous                               | Preserve and report why      |
```

Adapt the rows to the specific tool.

## Package scripts section

Add scripts only when appropriate for the tool.

The prompt must say:

- do not overwrite existing scripts blindly
- preserve existing project conventions
- add tool-specific scripts with clear names
- avoid changing unrelated scripts

Include exact script examples.

## Cleanup section

The onboarding prompt must require:

1. remove obsolete config fragments
2. remove unused dependencies only after checking references
3. preserve project-local overrides
4. update lockfile
5. avoid unrelated formatting
6. avoid creating secrets
7. avoid changing package manager

Adapt this list to the specific tool.

## Validation section

The onboarding prompt must include exact validation commands.

It must distinguish between:

- configuration errors caused by the migration
- existing content/code violations
- missing credentials/network problems
- unsupported feature errors

The agent must fix migration-caused configuration errors.

The agent must report unrelated existing violations separately.

## Required final response section

The onboarding prompt must require a table:

```markdown
| Change                    |                Status | Details |
| ------------------------- | --------------------: | ------- |
| Dependency install        |  Done/Partial/Skipped | ...     |
| Config file               |  Done/Partial/Skipped | ...     |
| Existing config migration |  Done/Partial/Skipped | ...     |
| Scripts                   |  Done/Partial/Skipped | ...     |
| Cleanup                   |  Done/Partial/Skipped | ...     |
| Validation                | Passed/Failed/Skipped | ...     |
```

Adapt the rows to the tool.

After the table, require one sentence in this style:

```text
Let me know if you want to add x, y, or z to this setup.
```

The optional features must be based on the currently available source-repo features, not invented.

## Optimisation prompt requirements

The optimisation prompt must include these sections:

```markdown
# <config-name>-prompt-optimise.prompt.md

---

## description: Improve the <config-name> onboarding prompt from real repository usage

## Input I will provide

## Your job

## Required output

## Focus of changes

## Editing rules

## Current <package/config> assumptions

## Regression checks added
```

## Optimisation prompt behaviour

The optimisation prompt must improve the onboarding prompt based on real usage.

It must not merely summarise the run.

It must return the full updated onboarding prompt, not a patch.

It must include:

```markdown
## Focus of changes

...

## Updated prompt

...

## Regression checks added

...
```

## Focus of changes rules

For each focus item, require:

1. what went wrong
2. why the original prompt allowed it
3. how the prompt was changed to prevent it

Include examples specific to the tool, such as:

- wrong config path
- missed existing config file
- wrong package manager
- unsafe dependency removal
- wrong validation command
- duplicated inherited settings
- removed project-specific overrides
- overwrote existing scripts
- confused config errors with existing project violations
- bad final reporting format

## Current assumptions section

The optimisation prompt must contain a concise list of known current source-repo assumptions.

Examples:

- package name
- exported config paths
- preset names
- direct dependencies required in consumers
- peer dependencies
- validation commands
- known defaults
- unsupported features

It must say:

```text
If follow-up work proves one of these assumptions wrong, update the onboarding prompt and require an explicit warning.
```

## Output style

Be direct and practical.

Do not include filler.

Do not produce generic advice.

The final answer must contain the complete two prompt files.

## Quality bar

The generated onboarding prompt is good only if another agent can run it inside an arbitrary repository and safely:

- detect current state
- install the shared config
- migrate existing config
- preserve local needs
- remove obsolete fragments
- add useful scripts
- validate the setup
- report exactly what changed

The generated optimisation prompt is good only if it can turn messy real usage feedback into a better onboarding prompt.
