---
id: docs-conventions
title: Conventions
description: Conventions for prompt and skill organization
---

## Prompt IDs

* MUST be lowercase kebab-case that can contain numbers, e.g. `my-prompt-1`
* MUST be unique across the registry
* MUST validate against `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`
* SHOULD be formed from the path to the prompt file inside of the `ai` folder, excluding the file extension, e.g. `prompts-agents-my-agent` for `ai/prompts/agents/my-agent.md`

## Folders

* `ai/prompts/agents/`  for reusable agent-style prompts
* `ai/prompts/reviews/` for validation prompts
* `ai/prompts/system/`  for shared rules
* `ai/prompts/tasks/`   for repeatable execution prompts
* `ai/skills/`          for reusable capability files

## Resolution order

1. resolve `extends`
2. append referenced skills
3. append the prompt body
