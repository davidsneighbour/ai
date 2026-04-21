---
id: review-behaviour-spec
type: review
title: Review behaviour spec
description: Review a Behaviour.spec.md file for missing clarity, thresholds, and testability.
model:
  - chatgpt
  - codex
extends:
  - ai-repository-rules
skills:
  - enforce-strict-mode
  - validate-rfc2119
strict: true
inputs:
  - name: specPath
    required: true
    description: Path to the Behaviour.spec.md file being reviewed.
outputs:
  - markdown-review
  - issue-list
tags:
  - review
  - testing
---

Review the behavioural specification and identify:

* vague wording
* missing thresholds
* non-testable statements
* contradictions
* undefined inputs or outputs

Return concrete fixes, not general advice.
