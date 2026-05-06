# AI

![Oh look Ma! It's AI!!!!!111One](.github/ai.png)

This repository provides a portable structure for my AI assets that can be shared across ChatGPT, Codex, and GitHub Copilot.

- [Structure](#structure)
- [Prompt model](#prompt-model)
- [CLI](#cli)
- [Skills](#skills)
  - [Install patterns](#install-patterns)
- [Licensed content](#licensed-content)

## Structure

- `ai/prompts/`    prompt files grouped by purpose.
- `ai/skills/`     reusable capability files.
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

List assets:

```bash
node ./scripts/ai.ts list
```

Validate prompt files:

```bash
node ./scripts/ai.ts validate
```

Show one resolved prompt:

```bash
node ./scripts/ai.ts show --id test-from-behaviour-spec
```

Run one prompt in assembled form:

```bash
node ./scripts/ai.ts run --id test-from-behaviour-spec
```

The `run` command does not call an external AI service. It resolves and prints the final composed prompt so that ChatGPT, Codex, or Copilot workflows can consume it.

## Skills

### Install patterns

Install all skills from the repo:

```bash
npx skills add davidsneighbour/ai/ai/skills --skill '*'
```

Install one skill:

```bash
npx skills add davidsneighbour/ai/ai/skills --skill signal-extraction-framework
```

Install globally for Codex and Claude Code:

```bash
npx skills add davidsneighbour/ai/ai/skills --skill '*' --global --agent codex --agent claude-code
```

Install project-local:

```bash
npx skills add davidsneighbour/ai/ai/skills --skill '*'
```

Update all installed skills

```bash
npx skills update -g -y
```

## Licensed content

These links into 404s are by design.

- [Tailwind Plus UI-Blocks llms.txt](https://tailwindcss.com/plus/ui-blocks/documentation/llms.txt)
- [Emil.md](https://animations.dev/learn/emil-skill)
- [Animations.dev Skill](https://animations.dev/learn/animation-theory/animations-and-ai#installation)
