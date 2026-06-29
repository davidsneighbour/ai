---
name: prompts-repo-operations-biome-config-prompt-optimise
description: Improve the Biome config onboarding prompt from real repository usage
---

You are improving an existing prompt named `biome-config-onboarding.prompt.md`.

Use the results of a real repository run to make the onboarding prompt more reliable, more precise, and less ambiguous.

## Input I will provide

I may provide any mix of:

- the original onboarding prompt
- the changed files from a repository
- follow-up instructions I had to give after the initial prompt
- mistakes the agent made
- missing questions
- bad defaults
- failed Biome output
- old Biome config fragments that were missed
- ESLint or Prettier migration problems
- dependency cleanup mistakes
- package script conflicts
- unsafe auto-formatting
- final diff
- final working `biome.json`
- final working package scripts

## Your job

Analyse the follow-up work and update the original onboarding prompt.

Do not merely summarise what happened.

Improve the prompt so the same correction is less likely to be needed in the next repository.

## Required output

Return three sections:

```markdown
## Focus of changes

...

## Updated prompt

...

## Regression checks added

...
```

The `Updated prompt` section must contain the full revised `biome-config-onboarding.prompt.md`, not a patch.

## Focus of changes

For each focus item, explain:

1. what went wrong
2. why the original prompt allowed it
3. how the prompt was changed to prevent it

Useful categories include:

- wrong shared config path
- forgot `@biomejs/biome`
- relied on transitive Biome binary
- overwrote existing `lint` or `check` scripts incorrectly
- removed ESLint too early
- removed Prettier too early
- duplicated inherited Biome settings
- created both `biome.json` and `biome.jsonc`
- used unsafe `--write` command
- failed to preserve generated file ignores
- confused code violations with config errors
- bad package manager choice
- failed to update lockfile
- bad final reporting format

## Editing rules

When improving the onboarding prompt:

1. Make vague instructions operational.
2. Replace ambiguous words with exact checks.
3. Add file names and command names where possible.
4. Add decision tables when they prevent mistakes.
5. Add explicit defaults.
6. Add explicit cleanup rules when old fragments were missed.
7. Add explicit "do not" rules when the agent performed unsafe work.
8. Add validation commands when a failure could have been caught.
9. Keep the prompt reusable across repositories.
10. Preserve useful existing instructions unless the follow-up work proves them wrong.

## Current @dnbhq/biome-config assumptions

Keep the prompt aligned with the currently available package.

Known package behaviour:

- consumed as `@dnbhq/biome-config`
- shared config path is `./node_modules/@dnbhq/biome-config/config.json`
- consuming projects should install `@biomejs/biome` directly
- local project config should extend the shared config
- local settings override inherited settings
- the shared config enables formatting, import organisation, VCS integration, and a strict linter rule set
- the shared package publishes only config/docs/release files, not a project-specific setup wrapper

If the follow-up work reveals a feature is not actually supported, update this list inside the setup prompt and require an explicit warning.

## Regression checks added

After the updated prompt, list the concrete checks added to prevent the same failure in future runs.
