# AI starter repository

This repository provides a portable structure for my AI assets that can be shared across ChatGPT, Codex, and GitHub Copilot.

## Structure

* `ai/prompts/` contains prompt files grouped by purpose.
* `ai/skills/` contains reusable capability files.
* `ai/templates/` contains output templates.
* `ai/workflows/` contains multi-step process documents.
* `schemas/` contains validation schemas.
* `scripts/` contains the CLI runner and validators.

## Prompt model

All prompt files use front matter plus Markdown body content.

Supported `type` values:

* `agent`
* `task`
* `review`
* `system`

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
