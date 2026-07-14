---
name: prompts-10-ai-assets-rule-particles
agent: agent
description: Add or maintain stable rule identifiers in an instruction document
---

# Add stable rule identifiers to an instruction document

You are updating an instruction document so its rules can be referenced in an organised, linter-style way.

The goal is to make every rule addressable by a stable identifier, similar to rule codes such as `MD001`, `MD002`, or `TR001`.

## Concept

A rule identifier is a short, stable code attached to one rule.

It allows humans, AI reviewers, custom linters, reports, checklists, and automated tools to refer to a rule without relying on a heading that might change.

For example:

```text
TR011 - Validate external data at runtime
```

A validator can then report:

```text
TR011: API response data is used without runtime validation.
```

## Task

Add or maintain a rule identifier system for the target instruction document.

Use the rule prefix I provide.

If I do not provide a prefix, ask for one before editing.

## Identifier format

Use this format:

```text
PREFIX###
```

Examples:

```text
TR001
TR002
TR003
```

Rules:

- `PREFIX` is an uppercase short code that identifies the rule family or document type.
- `###` is a zero-padded sequential number.
- The first rule starts at `PREFIX001`.
- Every rule gets one stable identifier.
- Existing identifiers must not be changed during normal edits.
- Identifiers must not be reused for different rules.
- Deprecated rules keep their identifiers.
- New rules receive the next available identifier.

## Required document changes

Add a `Rule index` section near the top of the document.

The section must explain:

- What the identifiers are for.
- Which prefix is used.
- How new identifiers are assigned.
- That existing identifiers are stable.
- That deprecated rules keep their identifiers.

Then add a complete index using this format:

```markdown
- `TR001` - Rule title
- `TR002` - Rule title
- `TR003` - Rule title
```

Replace `TR` with the requested prefix.

## Heading format

Update rule headings to include the identifier.

Preferred format:

```markdown
## TR001 - Rule title
```

For nested rules, use the most appropriate heading level while preserving the identifier.

Example:

```markdown
### TR014 - Compiler settings
```

Do not add identifiers to purely structural headings unless they represent an actual rule.

Structural headings may include:

- Introduction
- Scope
- Background
- Examples
- Appendix
- References

## Checklist and listicle updates

Update all checklists, summaries, validation lists, and review lists so they reference the relevant rule identifiers where useful.

Preferred format:

```markdown
- `TR011` - External data is validated at runtime.
```

If one checklist item covers multiple rules, include the most relevant rule identifier or split the item.

## Maintenance rules

When editing a document with rule identifiers:

- Do not renumber existing identifiers.
- Do not reorder identifiers only to make them look cleaner.
- Do not reuse identifiers.
- Do not remove identifiers from deprecated rules.
- Do not change the prefix unless the user asks for an index migration.
- When adding a rule, use the next available identifier.
- When extending a rule, keep the same identifier.
- When splitting a rule, keep the original identifier for the primary rule and assign new identifiers to newly separated rules.
- When merging rules, keep both identifiers visible unless the user asks for cleanup.
- When deleting a rule, prefer marking it as deprecated instead of removing it.

## Linter-style reporting guidance

After the rule index is added, validators and AI reviewers should report findings using this format:

```text
RULE_ID: Short finding.
```

Example:

```text
TR011: API response data is used without runtime validation.
```

A more detailed report may use:

```markdown
- `TR011` - API response data is used without runtime validation.
  - File: `src/lib/user.ts`
  - Reason: `response.json()` returns untrusted data.
  - Suggested fix: Validate the value with the relevant schema before using it as typed data.
```

## Consistency checks

After applying or updating identifiers, check that:

- Every actual rule has exactly one identifier.
- The rule index includes every identifier.
- The document contains no duplicated identifiers.
- Checklist references match existing identifiers.
- Deprecated identifiers are still listed.
- The prefix is used consistently.
- Headings and index titles match.
- Structural sections are not accidentally treated as rules.

## Output requirements

After editing, summarise:

- The prefix used.
- The identifiers added.
- The highest identifier now in use.
- Any rule headings changed.
- Any checklist or listicle updates.
- Any deprecated, merged, or split rules.
- Any ambiguity that could not be resolved.

## Request

Apply this rule identifier system to the document below.

Prefix:

`[PASTE PREFIX HERE]`

Document or file path:

`[PASTE DOCUMENT OR FILE PATH HERE]`
