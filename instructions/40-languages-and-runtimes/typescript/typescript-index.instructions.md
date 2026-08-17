---
name: TypeScript instructions entry point
description: Overview of the TypeScript instruction files in this folder, what each one covers, and how they relate.
applyTo: "**/*.{ts,tsx,mts,cts,astro}"
---

# TypeScript instructions

This folder holds the TypeScript-specific instruction files. Several of them
share the same `applyTo` glob and therefore apply together to most `.ts`
files - this file exists to explain what each one is for so they read as one
coherent set rather than five overlapping documents.

| File | Covers | Applies to |
| --- | --- | --- |
| [`typescript-programming.instructions.md`](typescript-programming.instructions.md) | Baseline day-to-day programming rules: types, narrowing, error handling, idioms. Start here for "how do I write this line of TypeScript." | `**/*.{ts,tsx,mts,cts,astro}` |
| [`architecture.instructions.md`](architecture.instructions.md) | Module boundaries, dependency direction, and service/layer design. Applies at the structural level, above individual statements. | `**/*.{ts,tsx,mts,cts,astro}` |
| [`review.instructions.md`](review.instructions.md) | Checklist and verification protocol to run before returning TypeScript work as finished. | `**/*.{ts,tsx,mts,cts,astro}` |
| [`testing.instructions.md`](testing.instructions.md) | Vitest/Playwright rules for test files specifically; narrower than the other three. | `**/*.{test,spec}.{ts,tsx,js,mjs,cjs}`, `tests/**` |
| [`configuration.instructions.md`](configuration.instructions.md) | `tsconfig.json` compiler baseline; only relevant when editing `tsconfig*.json`, not general `.ts` files. | `**/tsconfig*.json` |

## How to use these together

- Treat `typescript-programming.instructions.md` as the default rule set for
  any TypeScript edit.
- Layer `architecture.instructions.md` on top when a change crosses module
  or service boundaries, not just within a single function.
- Run `review.instructions.md` as a final pass before returning the work,
  not as a per-line rule set.
- Only load `testing.instructions.md` and `configuration.instructions.md`
  when the file being touched actually matches their narrower scope.

## Astro-specific extensions

Astro projects extend these rules further; see
`instructions/50-frameworks-and-libraries/astro/astro-index.instructions.md`.
