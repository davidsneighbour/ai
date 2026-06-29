---
id: docs-conventions
title: Conventions
description: Conventions for prompt and skill organization
---

## Prompt and instruction `name`

- MUST be lowercase kebab-case that can contain numbers, e.g. `my-prompt-1`
- MUST be unique across the registry
- MUST validate against `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`
- SHOULD be formed from the path to the prompt file, excluding the file extension, e.g. `prompts-agents-my-agent` for `prompts/agents/my-agent.md`

## Folders

- `prompts/agents/`  for reusable agent-style prompts
- `prompts/reviews/` for validation prompts
- `prompts/system/`  for shared rules
- `prompts/tasks/`   for repeatable execution prompts
- `skills/`             for installable reusable capability files

## Resolution order

1. resolve `extends`
2. append referenced skills
3. append the prompt body
