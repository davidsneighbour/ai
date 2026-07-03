---
name: prompts-refactor-utility-script
description: Refactor a single TypeScript utility file for strict typing, full test coverage, and documentation, after checking for duplication elsewhere in the utils directory.
argument-hint: Path to the utility file to refactor, e.g. src/utils/format-date.ts
---

# Refactor and optimise a TypeScript utility file

Target file: the utility file provided as the argument (referred to below as
`{{FILE}}`, with `{{BASENAME}}` for its name without extension and
`{{IMPORT_PATH}}` for its import specifier).

Scope: only this file, plus minimal supporting files such as its test file
and type helpers if strictly needed. Do not refactor unrelated files beyond
creating or adjusting a shared helper found during the duplication check
below.

Apply this repository's own TypeScript rules
(`instructions/programming-languages/typescript/`) and testing rules
(`instructions/programming-languages/typescript/testing.instructions.md`)
throughout. Where those instructions and this prompt overlap, the
instructions win; this prompt only adds the specific workflow and
acceptance bar for a single-file refactor.

## Tasks

1. **Pre-check for duplication**
   - Scan the other files in the same utilities directory to confirm no
     function in `{{FILE}}` is already defined elsewhere.
   - If overlapping or duplicate functionality exists, document it and
     refactor to use a shared implementation instead of redefining it (for
     example, extract to a shared helper module or import the canonical
     version). Do not refactor unrelated files beyond that shared helper.

2. **Refactor for strict typing**
   - Replace loose or implicit types with precise ones.
   - Add type guards, discriminated unions, and generics only where they
     earn their complexity; avoid over-generic APIs.
   - Document thrown errors and return types.

3. **Documentation**
   - Add JSDoc for every exported symbol: a one-line summary, a longer
     description if needed, `@param`, `@returns`, and a runnable
     `@example`.
   - Note edge cases and performance characteristics where relevant.

4. **Testing**
   - Create or update `{{BASENAME}}.test.ts` next to the file.
   - Cover happy paths, edge cases, invalid inputs, error branches, async
     branches, and type-level behaviour (`@ts-expect-error` where it
     proves an invalid type is rejected).
   - Tests must be deterministic: no reliance on unmocked time or I/O.
   - Aim for full coverage of the refactored file specifically.

5. **Linting and formatting**
   - Ensure the file passes this repository's configured linter (for
     example `npx biome check <path>` in a Biome-based project) with no
     warnings or errors.

6. **Performance and stability**
   - Assess algorithmic complexity; improve naive loops only when the
     improvement is clear and simple.
   - Prefer readability when the trade-off is negligible.
   - Add input validation and defensive checks where external callers are
     likely.

## Acceptance criteria

All of the following must be true before returning the result:

- The public API is unchanged, or improved with stricter types and better
  documentation.
- `{{FILE}}` compiles without type errors under the project's strict
  TypeScript settings.
- `{{BASENAME}}.test.ts` exists and covers the refactored behaviour fully.
- The project's linter runs cleanly against the changed files.
- No `any`, and no blanket type-suppression comment used to bypass a real
  type error.
- Every exported function or type has JSDoc with a runnable example.
- No duplicate or overlapping functionality remains in other files in the
  same utilities directory.

## Output

Return, in this order:

1. The refactored file.
2. The test file.
3. A short notes list covering: duplicates found or confirmed unique,
   de-duplication performed or skipped (with reasons), type refinements
   introduced, edge cases covered in tests, and any behavioural changes
   (there should be none unless explicitly called out as an improvement).

Keep the diff minimal but meaningful, and use the project's existing
import style (absolute, aliased, or relative) consistently.
