---
name: prompts-20-repository-workflows-markdownlint-config-prompt-optimise
description: Improve the markdownlint config onboarding prompt from real repository usage
---

# Markdownlint config prompt optimise

You are improving an existing prompt named `markdownlint-config-onboarding.prompt.md`.

Use the results of a real repository run to make the onboarding prompt more reliable, more precise, and less ambiguous.

## Input I will provide

I may provide any mix of:

- the original onboarding prompt
- the changed files from a repository
- follow-up instructions I had to give after the initial prompt
- mistakes the agent made
- missing questions
- bad defaults
- failed lint output
- old markdownlint config fragments that were missed
- wrong CLI usage
- dependency cleanup mistakes
- ignored Markdown files
- over-broad globs
- accidental content rewrites
- final diff
- final working package scripts
- final working markdownlint config

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

The `Updated prompt` section must contain the full revised `markdownlint-config-onboarding.prompt.md`, not a patch.

## Focus of changes

For each focus item, explain:

1. what went wrong
2. why the original prompt allowed it
3. how the prompt was changed to prevent it

Useful categories include:

- used old `markdownlint` CLI instead of `markdownlint-cli2`
- installed duplicate markdownlint dependencies
- used the wrong shared config path
- created `.markdownlint.jsonc` with CLI2 options
- failed to preserve `.markdownlintignore`
- missed MDX files
- linted generated output
- over-fixed Markdown content
- removed custom project rules incorrectly
- bad package manager choice
- failed to update lockfile
- content violations confused with config errors
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

## Current @dnbhq/markdownlint-config assumptions

Keep the prompt aligned with the currently available package.

Known package behaviour:

- consumed as `@dnbhq/markdownlint-config`
- designed for `markdownlint-cli2`
- shared config path is `./node_modules/@dnbhq/markdownlint-config/.markdownlint-cli2.jsonc`
- consuming projects normally install only `@dnbhq/markdownlint-config`
- the package carries `markdownlint-cli2`, `markdownlint`, GitHub markdownlint rules, and custom rule packages
- `.markdownlint-cli2.jsonc` is for CLI2 config
- `.markdownlint.jsonc` is not for CLI2-only options
- package scripts should support lint and fix mode

If the follow-up work reveals a feature is not actually supported, update this list inside the setup prompt and require an explicit warning.

## Regression checks added

After the updated prompt, list the concrete checks added to prevent the same failure in future runs.
