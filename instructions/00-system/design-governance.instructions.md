---
title: DESIGN.md design source of truth
description: This file describes the design governance system for the repository.
applyTo: "**/*"
---

Use the repository root-level `DESIGN.md` as the canonical source of truth for all visual, theme, layout, UI, UX, component styling, typography, colour, spacing, animation, accessibility, and brand-related decisions in this repository.

Use the Google Labs Code `DESIGN.md` standard at [google-labs-code/design.md](https://github.com/google-labs-code/design.md) only as a reference for structure and intent, not as a second source of truth.

Check this repository's root-level `DESIGN.md` before design-related changes and treat it as authoritative for this repository. If the remote standard and the repository's `DESIGN.md` conflict, the repository's `DESIGN.md` wins and the remote standard is used only to fill gaps in structure or documentation.

If the remote `DESIGN.md` standard URL is unreachable, fall back to the repository's local `DESIGN.md` as the sole source of truth and note in the response that the remote standard could not be fetched.

If a change is primarily functional but touches a file that contains styles or visual tokens, check `DESIGN.md` only if the change modifies a visual property. Pure logic or data changes in styled files do not require a `DESIGN.md` review.

## Design lookup order

When resolving a design decision, use this order:

1. `DESIGN.md`
2. Existing design token files
3. Tailwind v4 `@theme` declarations or CSS variables
4. Existing component implementations
5. Existing layout and template patterns
6. Repository documentation
7. Inferred current behaviour from the codebase

Do not introduce a new pattern until the existing sources have been checked.

### Required behaviour

1. Read `DESIGN.md` before changing design-related code

   Before editing styles, components, layouts, tokens, themes, templates, or visual behaviour:

   - read the repository's `DESIGN.md`
   - follow its documented rules
   - treat its design tokens as authoritative
   - treat its design rationale as binding unless the user's request includes an explicit instruction to change a `DESIGN.md` rule and the response includes a corresponding `DESIGN.md` update in the same change
   - prefer existing documented patterns over new one-off decisions

2. Create `DESIGN.md` if it is missing

   If the repository does not contain a root-level `DESIGN.md`:

   - create it before making design-related changes
   - infer the current design system from the existing repository
   - inspect relevant files, including CSS, SCSS, Tailwind v4 setup, theme files, component files, layout files, design tokens, documentation, and screenshots if available
   - document what the repository currently does instead of inventing a new design system
   - clearly mark uncertain observations as `inferred` or `needs confirmation`

   If the existing root-level `DESIGN.md` is empty, unparseable, or clearly inconsistent with the codebase, do not silently replace it.

   - preserve the file
   - inspect the codebase
   - document inferred findings
   - note the inconsistency plainly in the response
   - update `DESIGN.md` only when the requested task allows design-system maintenance or when the user explicitly approves the correction

3. Follow the DESIGN.md standard

   `DESIGN.md` should follow the structure and intent defined by the Google Labs Code `DESIGN.md` standard.

   Use machine-readable front matter where useful for design tokens, and Markdown sections for human-readable guidance and rationale.

   Include sections where relevant:

   - Overview
   - Design principles
   - Colours
   - Typography
   - Layout
   - Spacing
   - Breakpoints
   - Components
   - States and interaction
   - Motion
   - Accessibility
   - Do's and don'ts
   - Known exceptions

4. Keep implementation and DESIGN.md synchronised

   When a design-related change adds, removes, or changes a visual rule:

   - update `DESIGN.md` in the same change
   - document the new token, component pattern, variant, exception, or rationale
   - do not leave new design decisions undocumented
   - make the update explicit in the final response, pull request summary, or commit message with: `DESIGN.md updated`

5. Do not bypass the design system

   Do not introduce raw colours, arbitrary spacing values, ad-hoc font sizes, one-off shadows, isolated border-radius values, undocumented animations, or custom component variants if an existing token or documented pattern can be used.

   If an exception is required:

   - document why the exception exists
   - document where it is allowed
   - document whether it is temporary or permanent
   - add it to `DESIGN.md`

6. Use Tailwind v4 consistently where applicable

   If the repository uses Tailwind, assume Tailwind v4 or newer.

   - map design tokens to Tailwind v4 theme values, CSS variables, or `@theme` declarations where practical
   - do not suggest Tailwind v3 configuration patterns
   - do not introduce legacy Tailwind config approaches unless the repository already uses them and the change is explicitly about migration
   - prefer documented project tokens and semantic utilities over arbitrary values

7. Protect accessibility requirements

   Design decisions must preserve or improve accessibility.

   `DESIGN.md` should document baseline rules for:

   - colour contrast
   - focus states
   - keyboard navigation
   - reduced motion
   - readable typography
   - interactive target sizes
   - semantic structure

   Do not remove accessible behaviour for visual convenience.

8. Resolve conflicts explicitly

   If a requested change conflicts with `DESIGN.md`:

   - state the conflict clearly
   - do not silently override the design system
   - propose either an implementation that follows `DESIGN.md` or a deliberate update to `DESIGN.md`
   - only proceed with a design-system change when the change is intentional and documented

   To resolve a conflict:

   1. state the conflict
   2. propose the `DESIGN.md` update text
   3. confirm with the user, unless the user's request explicitly requires changing the design system
   4. apply both the `DESIGN.md` change and the implementation change together

9. Validate after changes

   Run the linter if a terminal is available and the project has a Node.js environment, meaning a `package.json` is present:

   ```bash
   npx @google/design.md lint DESIGN.md
   ```

   Do not modify package files or lockfiles just to run the linter.

   If validation cannot be run, state: `Linter not run: [reason]`.

10. Final response requirements

At the end of any design-related task, state:

- whether `DESIGN.md` was checked
- whether `DESIGN.md` was created or updated
- which design rules, tokens, or patterns were added, changed, or relied upon
- if `DESIGN.md` was not changed, why no update was needed

1. Distinguish implementation changes from design-system changes

A `DESIGN.md` update is required when a change introduces, removes, renames, or changes a design rule, token, component variant, layout pattern, interaction pattern, accessibility rule, or documented exception.

A `DESIGN.md` update is not required when the change only applies an already documented rule correctly.

If no `DESIGN.md` update is required, state which existing rule or pattern was followed.
