---
description: TypeScript code review checklist and verification protocol
applyTo: "**/*.{ts,tsx,mts,cts,astro}"
---

Use these instructions when reviewing or validating TypeScript code.

## TR024 - Code Review Checklist

A TypeScript review must verify:

- correctness
- type safety
- maintainability
- security
- architectural consistency

## Type Safety

Confirm:

- `TR002` - No `any` is used.
- `TR002` - `unknown` values are narrowed or validated.
- `TR004` - Type assertions are avoided or justified.
- `TR004` - `satisfies` is used where it preserves inference better than `as`.
- `TR005` - Types are derived from values where possible.
- `TR006` - Impossible states are modelled with discriminated unions.
- `TR007` - Switch statements over unions are exhaustive.
- `TR013` - Generics infer naturally for callers.

## Runtime Boundaries

Confirm:

- `TR011` - External data is validated at runtime.
- `TR016` - Runtime safety is not assumed from static types alone.
- `TR017` - Runtime errors are handled explicitly.

## Nullability

Confirm:

- `TR019` - Optional properties are handled intentionally.
- `TR020` - Indexed access handles `undefined`.
- `TR021` - Non-null assertions are avoided.

## Module Design

Confirm:

- `TR023` - Imports use ESM syntax.
- imports are explicit and correctly cased
- module boundaries are clear
- reusable helpers are extracted appropriately
- no unnecessary abstraction layers were introduced

## Architecture

Confirm:

- responsibilities are clear
- functions remain small and focused
- architecture follows `architecture.instructions.md`
- domain logic and external integrations are separated where possible

## Documentation

Confirm:

- `TR022` - Exported helpers have useful JSDoc.
- comments explain intent, constraints, or non-obvious behaviour
- obsolete comments were removed

## Security

Verify that code does not introduce:

- injection vulnerabilities
- unsanitised HTML rendering
- hardcoded secrets
- dynamic code execution

## Maintainability Review

Check for:

- excessive nesting
- duplicated types
- large monolithic files
- implicit behaviour
- stale comments

## Final Review Checklist

Before approving TypeScript code, confirm:

- strict typing is maintained
- errors are not silently swallowed
- external input is validated
- architecture is consistent
- code remains readable and maintainable
- the implementation follows the rule intent, not only the literal examples
