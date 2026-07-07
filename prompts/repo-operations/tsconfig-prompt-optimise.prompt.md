---
name: prompts-repo-operations-tsconfig-prompt-optimise
description: Improve the tsconfig onboarding prompt from real repository usage
---

# Tsconfig prompt optimise

You are improving an existing prompt named `tsconfig-onboarding.prompt.md`.

Use the results of a real repository run to make the onboarding prompt more reliable, more precise, and less ambiguous.

## Input I will provide

I may provide any mix of:

- the original onboarding prompt
- the changed files from a repository
- follow-up instructions I had to give after the initial prompt
- mistakes the agent made
- missing questions
- bad defaults
- failed commands
- TypeScript errors
- Astro errors
- ESM or NodeNext problems
- package manager problems
- dependency cleanup problems
- old config fragments that were missed
- final diff
- final working `tsconfig.json`
- final working `package.json` scripts

## Your job

Analyse the follow-up work and update the original onboarding prompt.

Do not merely summarise what happened.

Improve the prompt so the same correction is less likely to be needed in the next repository.

## Required analysis

Create a section called:

```markdown
## Focus of changes
```

List the main categories of prompt improvements, for example:

- wrong shared config selected
- missing Astro detection
- missing Node CLI detection
- unsafe removal of compiler options
- wrong handling of `include` / `exclude`
- missing `@types/node`
- unnecessary `@types/node`
- wrong `noEmit` behaviour
- broken build output
- missed multi-config setup
- path aliases removed incorrectly
- package manager mismatch
- bad typecheck script
- `astro check` not used
- `tsc --showConfig` not run
- validation failure ignored
- unrelated type errors mixed with migration errors
- project references broken
- JSON comments removed unnecessarily

For each focus item, explain:

1. what went wrong
2. why the original prompt allowed it
3. how the prompt was changed to prevent it

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

The `Updated prompt` section must contain the full revised `tsconfig-onboarding.prompt.md`, not a patch.

Preserve useful existing instructions unless the follow-up work proves they are wrong.

## Editing rules

When improving the onboarding prompt:

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

## Current @dnbhq/tsconfig assumptions

Keep the prompt aligned with the currently available `@dnbhq/tsconfig` feature set.

Known available configs:

- `@dnbhq/tsconfig/strict`
- `@dnbhq/tsconfig/cli`
- `@dnbhq/tsconfig/astro`

Known package assumptions:

- consuming projects install `@dnbhq/tsconfig` and `typescript`
- Node CLI projects may also need `@types/node`
- local projects must define their own `include`, `exclude`, or `files`
- generic strict config should avoid environment-specific assumptions
- Node types belong in Node-specific configs, not in generic strict configs
- Astro config depends on Astro being installed in the consuming project
- inherited compiler options may not be obvious; use `npx tsc --showConfig` when debugging

If the follow-up work reveals a feature is not actually supported, update this list inside the setup prompt and make the prompt require an explicit warning.

## Required final note

After the updated prompt, add:

```markdown
## Regression checks added

- ...
```

List the concrete checks added to prevent the same failure in future runs.
