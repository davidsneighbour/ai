---
description: Improve the release-config setup prompt from real repository usage
---

You are improving an existing prompt named `release-config-setup.prompt.md`.

Use the results of a real repository run to make the setup prompt more reliable, more precise, and less ambiguous.

## Input I will provide

I may provide any mix of:

- the original setup prompt
- the changed files from a repository
- follow-up instructions I had to give after the initial prompt
- mistakes the agent made
- missing questions
- bad defaults
- failed commands
- package manager problems
- release-it errors
- TypeScript or ESM problems
- old config fragments that were missed
- dependency cleanup problems
- final diff
- final working `.release-it.ts`
- final working `package.json` scripts

## Your job

Analyse the follow-up work and update the original setup prompt.

Do not merely summarise what happened.

Improve the prompt so the same correction is less likely to be needed in the next repository.

## Required analysis

Create a section called:

```markdown
## Focus of changes
```

List the main categories of prompt improvements, for example:

- missing repository scan step
- unclear npm publishing default
- wrong release-it CLI flag
- unsafe dependency removal
- missed old config file
- missing lockfile update
- TypeScript/ESM incompatibility
- unclear GitHub token handling
- bad final reporting format
- missing validation command
- wrong interpretation of forced release
- shallow override problem
- package manager mismatch

For each focus item, explain:

1. what went wrong
2. why the original prompt allowed it
3. how the prompt was changed to prevent it

## Required output

Return two sections:

```markdown
## Focus of changes

...

## Updated prompt

...
```

The `Updated prompt` section must contain the full revised `release-config-setup.prompt.md`, not a patch.

Preserve useful existing instructions unless the follow-up work proves they are wrong.

## Editing rules

When improving the setup prompt:

1. Make vague instructions operational.
2. Replace ambiguous words with exact checks.
3. Add file names and command names where possible.
4. Add decision tables when they prevent mistakes.
5. Add default values when a question may go unanswered.
6. Add explicit cleanup rules when old fragments were missed.
7. Add explicit "do not" rules when the agent performed unsafe work.
8. Add validation commands when a failure could have been caught.
9. Add final response requirements when reporting was incomplete.
10. Keep the prompt reusable across repositories.

## Release-config assumptions

Keep the prompt aligned with the currently available `@dnbhq/release-config` feature set.

Known supported areas include:

- `.release-it.ts`
- `createReleaseConfig(...)`
- `githubTokenRef`
- `changelogFile`
- `scopes.minorTypes`
- `scopes.patchTypes`
- `scopes.minorExclusionSubscopes`
- `repository.packageJsonPath`
- `repository.fallbackUrl`
- `overrides.git`
- `overrides.github`
- `overrides.npm`
- `overrides.plugins`
- `overrides.hooks`
- disabled npm publishing by default
- Git release commit/tag/push defaults
- GitHub release defaults
- conventional changelog generation
- built-in `CITATION.cff` hook when `CITATION.cff` exists

If the follow-up work reveals a feature is not actually supported, update this list inside the setup prompt and make the prompt require an explicit warning.

## Required final note

After the updated prompt, add:

```markdown
## Regression checks added

- ...
```

List the concrete checks added to prevent the same failure in future runs.
