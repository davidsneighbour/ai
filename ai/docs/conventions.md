---
id: docs-conventions
title: Conventions
description: Conventions for prompt and skill organization
---

# Conventions

## Prompt IDs

Use lowercase kebab-case IDs.

## Folder rules

* `ai/prompts/agents/` for reusable agent-style prompts
* `ai/prompts/tasks/` for execution prompts
* `ai/prompts/reviews/` for validation prompts
* `ai/prompts/system/` for shared rules
* `ai/skills/` for reusable capability files

## Resolution order

1. resolve `extends`
2. append referenced skills
3. append the prompt body
