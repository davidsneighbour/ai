---
id: docs-conventions
title: Conventions
description: Prompt name conventions
---

## Prompt `name`

- MUST be lowercase kebab-case that can contain numbers, e.g. `my-prompt-1`
- MUST be unique across the registry
- MUST validate against `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`
- MUST be formed from the repository-relative path to the prompt file, excluding the `.prompt.md` extension, with separators and punctuation normalized to hyphens, e.g. `prompts-hugo-upgrade` for `prompts/hugo/upgrade.prompt.md`
- MUST be used instead of `id` or `title` in prompt frontmatter
