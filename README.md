# AI

![Oh look Ma! It's AI!!!!!111One](.github/ai.png)

This repository provides a portable structure for my AI assets that can be shared across ChatGPT, Codex, and GitHub Copilot.

* [Structure](#structure)
* [Prompt model](#prompt-model)
* [CLI](#cli)
* [Skills](#skills)
  * [Install patterns](#install-patterns)
  * [Updating installed skills](#updating-installed-skills)
  * [Available skills](#available-skills)
  * [Issue handling skills](#issue-handling-skills)
  * [Project management skills](#project-management-skills)
  * [Reference and documentation skills](#reference-and-documentation-skills)
  * [Social media posting](#social-media-posting)
* [Configure vSCode](#configure-vscode)
* [VS code prompt file recommendations](#vs-code-prompt-file-recommendations)
  * [Option 1: one recursive glob](#option-1-one-recursive-glob)
  * [Option 2: individual folder entries](#option-2-individual-folder-entries)
* [Licensed content](#licensed-content)
* [Shared config onboarding prompts](#shared-config-onboarding-prompts)
  * [Available config prompt pairs](#available-config-prompt-pairs)
  * [Adding another shared config](#adding-another-shared-config)

## Structure

- `prompts/`       prompt files grouped by purpose.
- `instructions/`  reusable instruction files.
- `skills/`        installable skill directories. Each skill lives in its own directory with a `SKILL.md`.
- `ai/templates/`  output templates (obsolete, should be part of the skill).
- `schemas/`       validation schemas.
- `scripts/`       CLI runner and validators.

## Prompt model

All prompt files use front matter plus Markdown body content.

Supported `type` values:

- `agent`
- `task`
- `review`
- `system`

## CLI

- List assets: `node ./scripts/ai.ts list`
- Validate registry files: `node ./scripts/ai.ts validate`
- Show one registry item: `node ./scripts/ai.ts show --id test-from-behaviour-spec`
- Validate installable skill directories: `node ./scripts/ai.ts validate-skills --verbose`
- Generate README prompt-location documentation: `node ./scripts/ai.ts build-documentation`
- Configure VS Code prompt file locations: `node ./scripts/ai.ts setup --prompts --mode glob`
- Run the standard repository AI checks: `node ./scripts/ai.ts check --release`

## Skills

> [!CAUTION]
> Skills are engineering knowledge packaged into reusable instructions. My own skills start with `dnb-` and are opinionated and based on my own experience and used tools. The fact that they are published here under a MIT license does not mean it's a released and supported end product. It's work in progress, and will expand as my experience will do over time. If you wish to pay for a supported product, feel free to contact me.

### Install patterns

Install all skills from the repository without an interactive selector:

```bash
npx skills add davidsneighbour/ai/skills --skill '*' --yes
```

Install one selected skill by id:

```bash
npx skills add davidsneighbour/ai/skills --skill dnb-project-task-triage --yes
```

List the available skills without installing them:

```bash
npx skills add davidsneighbour/ai/skills --list
```

Install globally for Codex and Claude Code when the skills should be available outside the current project:

```bash
npx skills add davidsneighbour/ai/skills --skill '*' --global --agent codex claude-code --yes
```

Install project-local skills when they should be available only in the current repository:

```bash
npx skills add davidsneighbour/ai/skills --skill '*' --yes
```

From a local checkout of this repository, use the root `skills/` directory directly:

```bash
npx skills add ./skills --skill '*' --yes
```

### Updating installed skills

Update globally installed skills to the latest version:

```bash
npx skills update --global --yes
```

For project-local skills, run the update command from that project:

```bash
npx skills update --project --yes
```

Re-run `npx skills add davidsneighbour/ai/skills --skill <id>` when you want to install a newly added skill that is not already present locally.

### Available skills

- [dnb-create-js-documentation](skills/dnb-create-js-documentation/SKILL.md) — Add or improve generated API documentation for JavaScript or TypeScript npm projects.
- [dnb-dependency-maintenance](skills/dnb-dependency-maintenance/SKILL.md) — Safely maintain npm dependencies in a single-package repository or npm monorepo.
- [dnb-post-into-void](skills/dnb-post-into-void/SKILL.md) — Prepare and publish a casual Mastodon post from user-supplied text.
- [dnb-post-session-into-void](skills/dnb-post-session-into-void/SKILL.md) — Draft and publish a confirmed Mastodon post from the current AI session context.
- [dnb-project-task-triage](skills/dnb-project-task-triage/SKILL.md) — Maintain project tracking by syncing TODO.md with GitHub Issues and regenerating ROADMAP.md.
- [dnb-quality-gate-organisation](skills/dnb-quality-gate-organisation/SKILL.md) — Name repository quality-check commands consistently.
- [dnb-reference](skills/dnb-reference/SKILL.md) — Add or update strict references frontmatter on AI asset files.
- [dnb-select-next-issue](skills/dnb-select-next-issue/SKILL.md) — Select one suitable open GitHub issue by priority and roadmap relevance.
- [dnb-voice](skills/dnb-voice/SKILL.md) — Edit, rewrite, or review prose so it reads in Patrick's own voice.
- [dnb-work-on-issue](skills/dnb-work-on-issue/SKILL.md) — Inspect a specific GitHub issue, implement the change, validate, and commit.
- [dnb-work-on-next-issue](skills/dnb-work-on-next-issue/SKILL.md) — Select and implement the next suitable open GitHub issue.
- [dnb-work-through-issues](skills/dnb-work-through-issues/SKILL.md) — Continuously work through suitable open GitHub issues.

### Issue handling skills

- [dnb-select-next-issue](skills/dnb-select-next-issue/SKILL.md) — Select one suitable open GitHub issue by priority and roadmap relevance, without implementing it.
- [dnb-work-on-issue](skills/dnb-work-on-issue/SKILL.md) — Inspect a specific GitHub issue by number, implement the required change, validate, and commit with a Conventional Commits message that closes the issue.
- [dnb-work-on-next-issue](skills/dnb-work-on-next-issue/SKILL.md) — Orchestrate selecting and implementing the next suitable open GitHub issue without a specific issue number provided.
- [dnb-work-through-issues](skills/dnb-work-through-issues/SKILL.md) — Continuously work through open GitHub issues until no suitable actionable issues remain, committing each fix individually.

### Project management skills

- [dnb-dependency-maintenance](skills/dnb-dependency-maintenance/SKILL.md) — Safely maintain npm dependencies in a single-package repository or npm monorepo.
- [dnb-project-task-triage](skills/dnb-project-task-triage/SKILL.md) — Maintain the repository task-tracking system by syncing TODO.md with GitHub Issues and regenerating ROADMAP.md.
- [dnb-quality-gate-organisation](skills/dnb-quality-gate-organisation/SKILL.md) — Name repository quality-check commands consistently.

### Reference and documentation skills

- [dnb-create-js-documentation](skills/dnb-create-js-documentation/SKILL.md) — Add or improve generated API documentation for JavaScript or TypeScript npm projects.
- [dnb-reference](skills/dnb-reference/SKILL.md) — Add or update strict references frontmatter on AI asset files.
- [dnb-voice](skills/dnb-voice/SKILL.md) — Edit, rewrite, or review prose so it reads in Patrick's own voice.

### Social media posting

- [dnb-post-into-void](skills/dnb-post-into-void/SKILL.md) — Prepare and publish a casual Mastodon post from text supplied with the request or collected through questions.
- [dnb-post-session-into-void](skills/dnb-post-session-into-void/SKILL.md) — Draft and publish a confirmed Mastodon post from the current AI session context.

## Configure vSCode

<!-- ai:prompt-files-settings:start -->
<!-- This section is generated by `npm run build:documentation` (`node ./scripts/ai.ts build-documentation`). Do not edit manually. -->

## VS code prompt file recommendations

VS Code can load prompt files from configured workspace locations. This repository keeps generated prompt files under `.github/prompts/`.

There are two useful configuration styles.

### Option 1: one recursive glob

Use this when all prompt recommendations should be available at once and new folders should be picked up automatically.

```jsonc
{
  "chat.promptFilesLocations": {
    ".github/prompts/**/*.prompt.md": true
  }
}
```

### Option 2: individual folder entries

Use this when prompt recommendation groups should be enabled or disabled independently.

```jsonc
{
  "chat.promptFilesLocations": {
    ".github/prompts/example/*.prompt.md": true
  }
}
```

Current prompt folders covered by the individual-folder example:

- No direct prompt folders were found.

<!-- ai:prompt-files-settings:end -->

## Licensed content

These links into 404s are by design.

- [Tailwind Plus UI-Blocks llms.txt](https://tailwindcss.com/plus/ui-blocks/documentation/llms.txt)
- [Emil.md](https://animations.dev/learn/emil-skill)
- [Animations.dev Skill](https://animations.dev/learn/animation-theory/animations-and-ai#installation)

## Shared config onboarding prompts

This repository uses a two-step prompt pattern for applying shared DNBHQ configuration packages to other projects.

The workflow starts with one generator prompt:

- [`prompts/prompt-management/config-prompt-pair-generator.prompt.md`](./prompts/prompt-management/config-prompt-pair-generator.prompt.md)

That prompt analyses a shared configuration repository and creates a pair of reusable prompts:

1. an onboarding prompt that applies the shared config to the current project
2. an optimisation prompt that improves the onboarding prompt after real-world usage

The onboarding prompt is used inside a target repository. It inspects the current project, applies the shared configuration, migrates existing setup where possible, removes obsolete fragments, adds useful scripts, validates the result, and reports the completed changes.

The optimisation prompt is used after testing the onboarding prompt in one or more repositories. It takes follow-up changes, mistakes, failed commands, or manual corrections and turns them into a better version of the onboarding prompt.

### Available config prompt pairs

| Config | Onboarding prompt | Optimisation prompt |
| --- | --- | --- |
| Release config | [`release-config-onboarding.prompt.md`](./prompts/repo-operations/release-config-onboarding.prompt.md) | [`release-config-prompt-optimise.prompt.md`](./prompts/repo-operations/release-config-prompt-optimise.prompt.md) |
| TypeScript config | [`tsconfig-onboarding.prompt.md`](./prompts/repo-operations/tsconfig-onboarding.prompt.md) | [`tsconfig-prompt-optimise.prompt.md`](./prompts/repo-operations/tsconfig-prompt-optimise.prompt.md) |
| Renovate config | [`renovate-config-onboarding.prompt.md`](./prompts/repo-operations/renovate-config-onboarding.prompt.md) | [`renovate-config-prompt-optimise.prompt.md`](./prompts/repo-operations/renovate-config-prompt-optimise.prompt.md) |
| Markdownlint config | [`markdownlint-config-onboarding.prompt.md`](./prompts/repo-operations/markdownlint-config-onboarding.prompt.md) | [`markdownlint-config-prompt-optimise.prompt.md`](./prompts/repo-operations/markdownlint-config-prompt-optimise.prompt.md) |
| Biome config | [`biome-config-onboarding.prompt.md`](./prompts/repo-operations/biome-config-onboarding.prompt.md) | [`biome-config-prompt-optimise.prompt.md`](./prompts/repo-operations/biome-config-prompt-optimise.prompt.md) |

### Adding another shared config

To add another shared configuration workflow:

1. run [`config-prompt-pair-generator.prompt.md`](./prompts/prompt-management/config-prompt-pair-generator.prompt.md) with the shared config repository or package
2. save the generated onboarding prompt in `prompts/repo-operations/`
3. save the generated optimisation prompt in `prompts/repo-operations/`
4. test the onboarding prompt in real repositories
5. use the optimisation prompt to fold lessons from those runs back into the onboarding prompt

This keeps shared configuration rollouts repeatable while still allowing each prompt to improve from actual repository usage.
