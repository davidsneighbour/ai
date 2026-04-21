---
id: ai-repository-rules
type: system
title: AI repository rules
description: Global rules for portable AI prompts across ChatGPT, Codex, and Copilot.
model:
  - chatgpt
  - codex
  - copilot
strict: true
tags:
  - global
  - policy
---

Use Markdown output unless the target tool requires a different format.

Treat frontmatter as configuration and the Markdown body as executable instruction text.

When `strict: true` applies to the current prompt:

* reject vague wording
* reject missing thresholds
* reject unclear behaviour
* prefer explicit failure over guessing

If required input is missing, state exactly which input is missing.
