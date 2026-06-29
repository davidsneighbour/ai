---
name: prompts-extend-instructions-extend-typescript-programming
agent: agent
description: Extend the TypeScript programming instructions with a new rule
---

# Extend TypeScript programming instructions

You are updating the TypeScript programming instructions file.

Target file:

`instructions/typescript-programming.instructions.md`

## Task

Add a new TypeScript programming rule to the existing instruction file.

The rule must be based on the request I provide after this prompt.

## Rule identifier system

The instruction file uses stable rule identifiers.

For this file, rule identifiers use the format `TR###`.

Examples:

- `TR001`
- `TR002`
- `TR003`

`TR` means TypeScript rule.

The numeric part is zero-padded and sequential.

Before editing, inspect the existing rule index and determine the next available identifier.

Rules for identifiers:

- Do not renumber existing rules.
- Do not reuse an identifier for a different rule.
- Do not remove identifiers from existing rules.
- Do not change an identifier unless the user explicitly asks for an index migration.
- If a rule is deprecated, keep the identifier and mark the rule as deprecated.
- If a new rule is added, assign the next available identifier.
- If an existing rule is extended, keep its existing identifier.
- If a rule is split into multiple rules, keep the old identifier for the primary rule and assign new identifiers only to the new separated rules.
- If two rules are merged, keep both identifiers visible unless the user explicitly asks for cleanup.

## Required behaviour

Before editing the file, inspect the existing instruction file and determine:

- Where the new rule belongs.
- Whether it overlaps with an existing rule.
- Whether an existing section should be extended instead of creating a new section.
- Which rule identifier applies.
- Which checklist or summary sections must also be updated.
- Whether any examples should be added, replaced, or moved.

Do not duplicate existing guidance.

Prefer extending the most relevant existing section when the new rule is a refinement of an existing rule.

Create a new section only when the rule introduces a clearly separate concept.

## Required content for each new or updated rule

Each rule must include:

- A stable rule identifier.
- A clear heading or subheading.
- A short explanation of the rule.
- The reason the rule exists.
- At least one bad example, unless the rule is purely positive and a bad example would be artificial.
- At least one good example.
- A short note about when the rule applies.
- Any exceptions or edge cases, if relevant.

Examples must be realistic and copy-paste ready.

Use TypeScript for code examples unless another language is explicitly required.

## Example style requirements

Code examples must:

- Use ESM syntax.
- Avoid `any`.
- Avoid empty `catch` blocks.
- Use `unknown` plus narrowing where appropriate.
- Prefer strict typing.
- Prefer fail-fast error handling.
- Include useful error messages.
- Avoid unnecessary type assertions.
- Avoid non-null assertions unless the example is specifically showing why they are unsafe.
- Follow the existing style of the instruction file.

When using functions in examples, add JSDoc if the function is reusable or exported.

## Rule index maintenance

After adding, updating, splitting, merging, or deprecating a rule, update the `Rule index` section.

The index must remain:

- Complete
- Sequential
- Stable
- Human-readable
- Suitable for linter-style reporting

Each index entry must use this format:

```markdown
- `TR001` - Rule title
```

Do not skip numbers unless the missing rule is explicitly marked as deprecated or reserved.

## File maintenance requirements

After adding or updating the rule, update every affected listicle in the file.

This includes, but is not limited to:

- Rule index
- Code review checklist
- Core principles
- Runtime safety notes
- Function design notes
- Compiler or linting recommendations
- Any summary list that would become incomplete without the new rule

Do not leave the checklist outdated.

Checklist entries should include the related rule identifier where useful.

Example:

```markdown
- `TR011` - External data is validated at runtime.
```

If the new rule affects linting, TypeScript compiler options, project structure, validation, tests, or code review, update the corresponding section as well.

## Consistency requirements

Keep the instruction file internally consistent.

Check for:

- Contradictory rules.
- Repeated advice.
- Different terminology for the same concept.
- Examples that violate another rule in the file.
- Checklist items that no longer match the body text.
- Headings that are too broad or too narrow.
- Rules that are written as suggestions but should be mandatory.
- Rules that are mandatory but need an exception.
- Missing or duplicated rule identifiers.
- Rule identifiers that do not match the rule index.
- Checklist entries that should reference a rule identifier but do not.

Use British English.

Use plain ASCII punctuation.

Do not use typographic quotes, m-dashes, or decorative separators.

Do not add emojis.

## Output requirements

After editing, summarise the change with:

- The new or updated rule.
- The rule identifier used.
- The section where it was added.
- Any listicles or checklists that were updated.
- Any overlaps or conflicts that were resolved.
- Any rule request that could not be implemented and why.

## Rule request

Add or update the TypeScript instructions with this rule:

[PASTE RULE REQUEST HERE]
