---
name: prompts-20-repository-workflows-dnbhq-config-onboarding
description: Onboard the current repository to all discovered DNBHQ shared config prompts
---

# DNBHQ config onboarding

You are working inside the current target repository. Onboard this repository to
all DNBHQ shared configuration packages that have package-level onboarding
prompts in the prompt source directory.

## Prompt source directory

Use this directory as the default prompt source:

```text
/home/patrick/github.com/davidsneighbour/ai/prompts/20-repository-workflows
```

If this prompt has been copied somewhere else and the local prompt directory is
known, use the directory containing this prompt instead.

Do not rely on a hard-coded package list. Discover the package-level onboarding
prompts from filenames each time this prompt runs.

## Goal

Apply every discovered DNBHQ shared configuration onboarding prompt to the
current repository in a deliberate sequence.

The target behaviour is:

- discover package-level onboarding prompts by filename
- read every selected prompt before making changes for that package
- consult each package page and package README.md through the selected prompt's
  package documentation instructions; those README.md files contain additional
  package information to read before implementation
- inspect the target repository before editing files
- apply each shared configuration package conservatively
- preserve project-specific local overrides
- avoid unrelated refactors and formatting churn
- validate each configuration setup with the safest available commands
- report which prompts were applied, skipped, or blocked

## Discovery rules

List prompt files in the prompt source directory and select files whose basename
matches one of these filename rules:

- `*-onboarding.prompt.md`
- `*-config-setup.prompt.md`

Exclude these files:

- this aggregate prompt, `dnbhq-config-onboarding.prompt.md`
- any `*-prompt-optimise.prompt.md` file
- any prompt that is clearly not a shared configuration package onboarding
  prompt after reading its title and goal

The current expected matches include the Biome, markdownlint, release,
Renovate, and TypeScript config prompts. Treat that as a sanity check only, not
as the authoritative list. When a new config package prompt is added with a
matching filename, include it automatically.

## Ordering

Use this stable order unless a discovered prompt gives a stronger reason to run
elsewhere:

1. TypeScript config prompts
2. code formatter and linter config prompts
3. Markdown and documentation linter config prompts
4. other discovered shared package onboarding prompts, alphabetically
5. release config prompts
6. Renovate config prompts

Run Renovate last so it can see package and lockfile changes from the other
onboarding steps.

## Before changing files

Follow the target repository's local agent instructions first. If the target
repository has a root `RESUME.md`, read and resolve or explicitly abandon that
interrupted work before starting this onboarding.

Then inspect and report:

1. current branch and worktree status
2. package manager and lockfiles
3. existing configuration files for every discovered package prompt
4. existing package scripts and dependencies
5. likely validation commands
6. any conflicts between prompts or target-repository instructions

If the worktree already has unrelated changes, leave them alone. Touch only the
files needed for this onboarding.

## Per-prompt procedure

For each discovered prompt:

1. Read the full prompt.
2. Run that prompt's required first checks.
3. Decide whether it applies to the target repository.
4. If it does not apply, record it as skipped with the reason.
5. If it applies, make the smallest safe set of changes required by that prompt.
6. Preserve target-repository overrides that are still needed.
7. Remove duplicated settings only when they are clearly provided by the shared
   config.
8. Record dependencies, scripts, config files, and validation commands affected
   by that prompt.

Do not run optimisation prompts as part of onboarding. They are for improving
the onboarding prompts after real-world usage.

## Dependency and lockfile handling

Use the target repository's detected package manager. Prefer npm when
`package-lock.json` exists. Do not introduce pnpm, yarn, or bun unless the
target repository already uses that package manager or the user explicitly asks.

It is acceptable to batch dependency edits and run one package-manager install
after all applicable package prompts have updated `package.json`, unless a
specific prompt needs installed package metadata before it can finish safely.

Do not remove dependencies until you have searched for remaining references in:

- package scripts
- config files
- source files
- GitHub workflows
- local scripts
- documentation that defines live commands

## Defaults and questions

Use explicit user-provided values when they exist.

If a package prompt defines defaults and work must continue without another
answer, use those defaults and report them. For the release config prompt, this
means the default is no npm publish and the default GitHub token variable is
`GITHUB_TOKEN_CONTENT_PRIVATE`.

Ask a question only when the answer materially changes repository behaviour and
cannot be inferred safely from the target repository.

## Validation

Run each applicable prompt's validation command where possible. Separate these
outcomes clearly:

- setup or configuration errors, which must be fixed before considering the
  onboarding done
- pre-existing content or source violations, which may prove the setup works
  but still leave follow-up cleanup
- network, credential, or registry failures, which may block validation without
  proving the setup is wrong

After all package prompts have run, use the target repository's top-level
quality gate if one exists and it is reasonable for the touched surface. If the
target repository has no top-level gate, run the relevant per-config validation
commands and report that no broader gate exists.

## Final response

Respond with a table.

Use this format:

| Prompt | Status | Details |
| --- | ---: | --- |
| `tsconfig-onboarding.prompt.md` | Done | Extended `@dnbhq/tsconfig/cli`; validation passed |
| `example-config-onboarding.prompt.md` | Skipped | Target repository has no matching toolchain |
| Validation | Done | Ran `npm run check` |

Include:

- the discovered prompt files
- files changed
- dependencies added, updated, or removed
- validation commands run and their outcomes
- defaults or assumptions used
- blockers or follow-up work, if any
