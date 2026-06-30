---
description: Conventional Commit rules to use whenever creating commits.
applyTo: "**/*.*"
references:
  - name: Conventional Commits specification
    src: https://www.conventionalcommits.org/en/v1.0.0/
---

# Commit message instructions

Use these instructions whenever creating, proposing, rewriting, or reviewing a commit message.

All commit messages must follow Conventional Commits.

## Required format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

The scope is optional, but strongly preferred when a short noun can name the affected area. Omit the scope only for truly global changes.

## Type selection

Use these commit types consistently:

- `feat`: new user-facing feature or capability
- `fix`: bug fix or correction of wrong behavior
- `refactor`: internal restructuring with no behavior change
- `perf`: performance improvement
- `docs`: documentation-only change
- `test`: tests added or updated
- `chore`: maintenance, repository housekeeping, or non-feature configuration
- `build`: build system, packaging, dependencies, release tooling, or generated build assets
- `ci`: CI/CD pipeline or workflow change
- `revert`: revert of an earlier commit

Use repository-specific release scopes when they exist. In this repository, prefer scopes such as `skills`, `instructions`, and `prompts` when work should appear in its own release-note section.

## Scope guidelines

Choose scopes that are:

- short nouns identifying the affected area, such as `auth`, `api`, `dashboard`, `payments`, `skills`, `instructions`, or `prompts`
- consistent across the project
- specific enough to avoid generic labels such as `misc`, `stuff`, `changes`, or `workspace`

If the change touches multiple unrelated areas, split it into separate commits when practical. If one commit is still the right choice, use the smallest accurate global scope or omit the scope.

## Subject line style

The description after the colon must:

- start with an imperative verb
- describe the actual change
- stay specific and concrete
- use lower case unless a proper noun requires capitals
- avoid a trailing period
- avoid filler such as `update stuff`, `misc changes`, `fix bug`, or `WIP`

Good examples:

```text
feat(payments): add Apple Pay support for checkout flow
fix(api): correct pagination offset calculation
docs(readme): add local development setup instructions
chore(deps): upgrade eslint to v9
ci: cache npm dependencies in GitHub Actions
```

Bad examples:

```text
fix bug
updates
WIP
misc changes
John's changes
```

## Body guidelines

Add a body when the reason, risk, or impact is not obvious from the subject line.

Use the body to explain:

- what was broken or missing before the change
- why this approach was chosen
- what will be different for users, maintainers, or developers

Avoid restating the diff. Prefer present or past tense over future tense.

## Footers

Use issue-closing footers when relevant:

```text
Fixes #201
Closes #88
```

For breaking changes, add `!` after the type or scope and include a `BREAKING CHANGE:` footer:

```text
feat(api)!: remove v1 endpoints

All v1 REST endpoints have been removed following the deprecation period.
Consumers must migrate to v2 before upgrading.

BREAKING CHANGE: /api/v1/* routes no longer exist.
```

## Reverts

Use `revert` for commits that revert an earlier change:

```text
revert: feat(notifications): add push notification opt-in

Reverts commit a3f92bc.

The push notification feature caused a crash on Android 12 devices.
```

## Merge commits

All merge commits must also follow Conventional Commits. Do not use Git's default merge subject.

Format merge subjects as:

```text
chore(git): merge <source> into <target>
```

Add a body explaining why the merge was needed and how conflicts were resolved.

## Final check

Before creating a commit, verify that the message:

- uses a valid Conventional Commit type
- uses a precise scope when a scope helps
- describes the change rather than the author or process
- avoids vague or temporary wording
- includes a body or footer when needed for context, issues, breaking changes, or merges
