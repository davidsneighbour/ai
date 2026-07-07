---
name: prompts-repo-operations-renovate-config-prompt-optimise
description: Improve the Renovate config onboarding prompt from real repository usage
---

# Renovate config prompt optimise

You are improving an existing prompt named `renovate-config-onboarding.prompt.md`.

Use the results of a real repository run to make the onboarding prompt more reliable, more precise, and less ambiguous.

## Input I will provide

I may provide any mix of:

- the original onboarding prompt
- the changed files from a repository
- follow-up instructions I had to give after the initial prompt
- mistakes the agent made
- missing questions
- bad defaults
- failed validation output
- old Renovate config fragments that were missed
- custom package rules that were removed incorrectly
- package manager detection problems
- Renovate preset resolution problems
- dependency cleanup mistakes
- final diff
- final working `renovate.json5`

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

The `Updated prompt` section must contain the full revised `renovate-config-onboarding.prompt.md`, not a patch.

## Focus of changes

For each focus item, explain:

1. what went wrong
2. why the original prompt allowed it
3. how the prompt was changed to prevent it

Useful categories include:

- wrong config file name
- created duplicate Renovate config files
- used npm package installation incorrectly
- missed existing `.renovaterc`
- removed project-specific package rules incorrectly
- duplicated settings already provided by the shared preset
- missed monorepo-specific settings
- wrong validator command
- treated preset resolution failure as syntax failure
- failed to preserve host rules or custom registries
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

## Current dnbhq/renovate-config assumptions

Keep the prompt aligned with the currently available shared preset.

Known shared preset behaviour:

- consumed through `github>dnbhq/renovate-config`
- root config file convention is `renovate.json5`
- provides `config:recommended`
- sets semantic commits to `chore`
- disables Dependency Dashboard
- uses `Asia/Bangkok`
- schedules updates for weekends
- contains ignore paths
- includes selected package grouping
- includes selected automerge rules
- enables lock file maintenance
- automerges lock file maintenance
- uses additional branch prefix based on `parentDir`

If the follow-up work reveals a feature is not actually supported, update this list inside the setup prompt and require an explicit warning.

## Regression checks added

After the updated prompt, list the concrete checks added to prevent the same failure in future runs.
