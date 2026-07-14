---
description: Repository Markdown formatting rules with stable rule identifiers.
applyTo: "**/*.md"
---

# Markdown authoring rules

Write Markdown that complies with these rules from the first edit. Do not rely on formatters or linting tools to repair avoidable formatting problems afterwards.

These instructions apply to all manually authored Markdown files unless a more specific instruction file explicitly overrides them.

## Rule identifiers

Every Markdown rule has a permanent identifier in the form `MKD###`.

- Rule identifiers must never be changed, renumbered, or reused.
- New rules must use the next available identifier.
- Rules must not be deleted when they become obsolete.
- An obsolete rule must remain in this file with its status changed to `obsolete`.
- An obsolete rule must include the reason it became obsolete and, when applicable, the identifier of its replacement.
- References to rule identifiers in issues, commits, documentation, and linting output must remain valid permanently.

Use this format for obsolete rules:

- Status: `obsolete`
- Obsoleted: `YYYY-MM-DD`
- Reason: concise explanation
- Replacement: replacement rule identifier or `none`

## MKD001: CommonMark baseline

Status: `active`

All Markdown must conform to the CommonMark specification.

CommonMark defines the baseline Markdown syntax for this repository. Markdown syntax that is invalid under CommonMark must not be used unless it is explicitly permitted by an active GitHub Flavoured Markdown or repository-specific rule.

Rule precedence is:

1. CommonMark
2. GitHub Flavoured Markdown
3. Repository-specific `MKD###` rules

A rule later in this precedence order overrides a conflicting rule earlier in the order.

## MKD002: GitHub Flavoured Markdown

Status: `active`

Markdown may use syntax defined by GitHub Flavoured Markdown.

GitHub Flavoured Markdown extends and, where applicable, overrides the CommonMark baseline. Repository-specific `MKD###` rules may further restrict or override GitHub Flavoured Markdown formatting.

Rule precedence is:

1. CommonMark
2. GitHub Flavoured Markdown
3. Repository-specific `MKD###` rules

## MKD003: Table separator width

Status: `active`

GitHub-flavoured Markdown tables are permitted.

Each table header separator cell must contain exactly three hyphens.

Valid:

`| --- | --- |`

Invalid:

`| -------- | ------------- |`

When explicit alignment is required, the separator must still contain exactly three hyphens:

- Left aligned: `:---`
- Right aligned: `---:`
- Centred: `:---:`

Do not extend separator cells to match the width of the corresponding header text.

## MKD004: Table pipe spacing

Status: `active`

Table rows must contain spaces between the pipe characters and the cell content.

Valid:

`| Name | Value |`

Invalid:

`|Name|Value|`

This rule also applies to table header separator rows:

`| --- | --- |`

## MKD005: Unordered list markers

Status: `active`

Every unordered list item must use a hyphen followed by exactly one space:

`- List item`

Do not use asterisks or plus signs as unordered list markers.

Invalid markers include:

- `* List item`
- `+ List item`

Nested unordered lists must also use a hyphen followed by one space as their marker.

Numbered lists may be used only when the order or sequence of the items is meaningful.

## MKD006: Fenced code blocks

Status: `active`

Code blocks must use fenced code block syntax with exactly three backticks.

Do not create code blocks through four-space indentation.

Do not use tilde-based code fences.

Indented text that is not intended to be code must not accidentally contain four leading spaces.

## MKD007: Code block language identifiers

Status: `active`

Every fenced code block must declare an appropriate language identifier immediately after its opening backticks.

Use the most specific applicable identifier, such as:

- `bash` for shell commands and shell scripts
- `typescript` for TypeScript
- `javascript` for JavaScript
- `json` for JSON
- `yaml` for YAML
- `markdown` for Markdown
- `html` for HTML
- `css` for CSS
- `text` only when no more specific language applies

An opening fence without a language identifier is invalid.

## MKD008: YAML frontmatter

Status: `active`

When frontmatter is present, it must use YAML syntax.

Frontmatter must:

- Begin on the first line of the file with exactly `---`.
- End with a line containing exactly `---`.
- Be followed by exactly one empty line before the Markdown content begins.

Valid:

```markdown
---
title: Example
description: Example description
---

# Example
```

Invalid:

```markdown
+++
title = "Example"
+++

# Example
```

```markdown
---
title: Example
---
# Example
```

## Compliance

When creating or editing Markdown:

- Follow these rules while writing rather than fixing violations afterwards.
- Preserve surrounding compliant formatting unless the task requires changing it.
- Do not introduce an alternative Markdown style merely because it is technically valid.
- Run the project's configured Markdown formatter, linter, or validation command when available.
- Report any rule conflict by its `MKD###` identifier with a link into the instruction.
