---
id: test-from-behaviour-spec
type: task
title: Test from behaviour spec
description: Generate tests from Behaviour.spec.md after strict validation.
model:
  - chatgpt
  - codex
  - copilot
extends:
  - ai-repository-rules
  - test-writer
skills:
  - enforce-strict-mode
  - strict-typescript-check
inputs:
  - name: specPath
    required: true
    description: Path to the Behaviour.spec.md file.
outputs:
  - test-file
  - validation-notes
strict: true
tags:
  - task
  - testing
---

Generate tests only from explicit behaviour.

If the specification contains ambiguity, stop and list blockers before generating tests.

Prefer exact assertions, thresholds, and edge cases.
