---
name: Astro instructions entry point
description: Overview of the Astro instruction files in this folder, what each one covers, and where broader Astro architecture guidance now lives.
applyTo: "**/*.astro, **/*.ts"
---

# Astro instructions

This folder holds Astro-specific TypeScript rules. It intentionally does
not include general Astro architecture, content-collection, or
project-standards guidance - that content belongs in external skills,
because "is this actually an Astro project" cannot be answered from an
`applyTo` glob on `.ts`/`.js`/`.md` files alone. A `.ts` file matches that
glob whether or not the project uses Astro; a skill lets the agent judge
from real project signals (`astro.config.mjs`, `.astro` files, an `astro`
dependency) before applying framework-specific rules. See the collection
repositories listed in
[`skills.index.md`](../../../skills.index.md).

| File | Covers | Applies to |
| --- | --- | --- |
| [`typescript.instructions.md`](typescript.instructions.md) | Astro-specific TypeScript rules that extend the generic TypeScript instructions (content collections, component props, client/server separation). | `**/*.ts`, `**/*.astro` |
| [`typescript-reference.instructions.md`](typescript-reference.instructions.md) | Lookup reference for Astro's built-in type utilities and official docs pointers. | `**/*.astro` |

## How to use these together

Read `typescript.instructions.md` for the rules themselves; use
`typescript-reference.instructions.md` as a lookup when you need the exact
type utility or documentation link. Both extend
`instructions/40-languages-and-runtimes/typescript/` rather than repeating
it - see that folder's
[`typescript-index.instructions.md`](../../40-languages-and-runtimes/typescript/typescript-index.instructions.md)
for the generic TypeScript rule set.

For framework-level Astro guidance (architecture, content collections,
routing, performance, deployment), use the relevant external skill collection
once the project is confirmed to be Astro-based.
