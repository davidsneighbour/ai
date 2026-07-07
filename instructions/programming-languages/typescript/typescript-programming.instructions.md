---
description: Core TypeScript programming instructions
applyTo: "**/*.{ts,tsx,mts,cts,astro}"
---

# TypeScript programming

Use these instructions whenever creating, reviewing, refactoring, or documenting TypeScript code.

## Rule Index

Each rule has a stable identifier.

Rule identifiers are used by humans, AI reviewers, custom linters, prompt-based validators, and automated reports to refer to rules in an organised way.

Use the format `TR###`, where:

- `TR` means TypeScript rule.
- `###` is a zero-padded sequential number.
- Existing identifiers must never be reused for a different rule.
- Existing identifiers must not be renumbered during normal editing.
- Deprecated rules must keep their identifier and be marked as deprecated instead of being removed silently.
- New rules must receive the next available identifier.

Current rule index:

- `TR001` - Core principles
- `TR002` - Strict type safety
- `TR003` - Type inference
- `TR004` - Prefer `satisfies` over unsafe assertions
- `TR005` - Derive types from values
- `TR006` - Model impossible states with discriminated unions
- `TR007` - Use exhaustive checks
- `TR008` - Use `as const` for constants and configuration
- `TR009` - Use type predicates for reusable narrowing
- `TR010` - Build types from existing types
- `TR011` - Validate external data at runtime
- `TR012` - Avoid `enum` in most cases
- `TR013` - Prefer inferable generics
- `TR015` - Template literal types
- `TR016` - Runtime safety
- `TR017` - Error handling
- `TR018` - Function design
- `TR019` - Optional properties
- `TR020` - Indexed access
- `TR021` - Non-null assertions
- `TR022` - Comments and documentation
- `TR023` - Imports and modules

`TR014` lives in `configuration.instructions.md`.

`TR024` lives in `review.instructions.md`.

## TR001 - Core Principles

Write TypeScript for correctness, maintainability, and safe refactoring.

Prefer code that lets the compiler prove correctness instead of code that relies on comments, manual discipline, or unchecked assumptions.

TypeScript types must describe the real runtime behaviour of the code. Do not use types to silence errors unless the value has actually been validated or narrowed.

## TR002 - Strict Type Safety

Do not use `any`.

Use `unknown` for values whose shape is not yet known. Narrow or validate the value before accessing properties, calling methods, or passing it into typed functions.

```ts
function parseInput(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected value to be a string.");
  }

  return value.toUpperCase();
}
```

Avoid type leakage. A single `any` can weaken type safety across a larger part of the codebase.

When handling errors, use `unknown` in `catch` blocks and narrow explicitly.

```ts
try {
  runTask();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
    throw error;
  }

  console.error("Unknown error:", error);
  throw new Error("An unknown error occurred.");
}
```

## TR003 - Type Inference

Let TypeScript infer obvious local types.

Do not over-annotate simple constants, return values, or intermediate values when inference is clearer and safer.

Prefer this:

```ts
const name = "Ada";
```

Avoid this:

```ts
const name: string = "Ada";
```

Use explicit types when they document an API boundary, prevent unwanted widening, or make intent clearer.

Good places for explicit types include:

- exported function parameters and return values
- public interfaces
- configuration objects
- external data boundaries
- complex generic helpers
- values where inference becomes too broad or unclear

## TR004 - Prefer `satisfies` Over Unsafe Assertions

Use `satisfies` when a value must conform to a type while preserving its precise inferred shape.

```ts
const routes = {
  home: "/",
  about: "/about/",
} satisfies Record<string, string>;
```

Avoid using `as` to force a value into a type unless there is no safer alternative.

Do not use assertions to bypass missing properties, incompatible values, or incomplete validation.

Bad:

```ts
const user = responseData as User;
```

Better:

```ts
const user = UserSchema.parse(responseData);
```

## TR005 - Derive Types From Values

Avoid duplicating runtime values and TypeScript types manually.

Use `as const`, indexed access types, and `typeof` to keep types and values in sync.

```ts
const roles = ["admin", "user", "guest"] as const;

type Role = (typeof roles)[number];
```

Use this pattern for:

- allowed string values
- configuration keys
- route names
- event names
- status values
- feature flags
- design tokens

## TR006 - Model Impossible States With Discriminated Unions

Use discriminated unions instead of loose optional-property objects.

Bad:

```ts
interface RequestState {
  status: "loading" | "success" | "error";
  data?: User;
  error?: Error;
}
```

Better:

```ts
type RequestState =
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: Error };
```

Each state must contain only the fields that are valid for that state.

This makes invalid combinations unrepresentable.

## TR007 - Use Exhaustive Checks

When switching over discriminated unions, handle every case explicitly.

Use `never` in the fallback branch to make future missing cases a compiler error.

```ts
function renderState(state: RequestState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return state.data.name;
    case "error":
      return state.error.message;
    default: {
      const exhaustive: never = state;
      throw new Error(`Unhandled state: ${JSON.stringify(exhaustive)}`);
    }
  }
}
```

Do not silently ignore unknown states.

## TR008 - Use `as const` For Constants And Configuration

Use `as const` when values should remain literal and readonly.

```ts
const theme = {
  mode: "dark",
  contrast: "high",
} as const;
```

This is especially useful for:

- constants
- route maps
- configuration objects
- test fixtures
- lookup tables
- static data used to derive types

Do not use `as const` to hide mutability problems. Use it when the value is intentionally fixed.

## TR009 - Use Type Predicates For Reusable Narrowing

When runtime checks are repeated, extract them into type predicates.

```ts
interface User {
  id: string;
  name: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}
```

Type predicates must perform real runtime checks. They must not simply return `true`.

Prefer schema validation for complex external data.

## TR010 - Build Types From Existing Types

Do not duplicate object shapes manually.

Use TypeScript utility types and indexed access types to derive new types from existing ones.

Useful utilities include:

- `Pick`
- `Omit`
- `Partial`
- `Required`
- `Readonly`
- `Record`
- `Extract`
- `Exclude`
- `NonNullable`
- indexed access types

Example:

```ts
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

type UserPreview = Pick<User, "id" | "name">;
```

Prefer type transformations over repeated parallel interfaces.

## TR011 - Validate External Data At Runtime

TypeScript does not validate runtime data.

Always validate data from external or untrusted sources before treating it as typed.

External boundaries include:

- API responses
- JSON files
- environment variables
- CLI arguments
- user input
- CMS content
- database rows
- local storage
- third-party package output

Prefer Zod for runtime validation where possible.

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type User = z.infer<typeof UserSchema>;

function parseUser(value: unknown): User {
  return UserSchema.parse(value);
}
```

Never assume that `response.json()` returns the expected shape.

Bad:

```ts
const user = (await response.json()) as User;
```

Better:

```ts
const data: unknown = await response.json();
const user = UserSchema.parse(data);
```

## TR012 - Avoid `enum` In Most Cases

Prefer literal unions derived from readonly arrays or objects.

```ts
const statuses = ["draft", "published", "archived"] as const;

type Status = (typeof statuses)[number];
```

This is usually easier to serialise, test, refactor, and use with external data.

Only use `enum` when there is a strong project-specific reason.

## TR013 - Prefer Inferable Generics

Design generic APIs so callers rarely need to provide manual generic arguments.

Less ideal:

```ts
const user = await getData<User>();
```

Better:

```ts
const user = await getData(UserSchema);
```

Prefer passing values that allow TypeScript to infer the result type.

Good generic helpers should infer from parameters, schemas, callbacks, or configuration objects.

## TR015 - Template Literal Types

Use template literal types when string structure matters.

```ts
type ApiRoute = `/api/${string}`;
type LocaleRoute = `/${"en" | "de"}/${string}`;
```

Good use cases include:

- routes
- event names
- CSS utility names
- design token names
- query keys
- translation keys
- file path conventions

Avoid overly clever template literal types that make code harder to read or maintain.

## TR016 - Runtime Safety

Type safety is not runtime safety.

TypeScript helps prevent many classes of bugs, but it does not:

- validate external data
- guarantee good architecture
- eliminate runtime exceptions
- replace tests
- replace input validation
- protect against incorrect type assertions

Treat runtime boundaries as unsafe until validated.

## TR017 - Error Handling

Handle errors explicitly.

Do not use empty `catch` blocks.

Bad:

```ts
try {
  await writeFile();
} catch {}
```

Better:

```ts
try {
  await writeFile();
} catch (error: unknown) {
  console.error("Failed to write file:", error);
  throw error;
}
```

If an error is intentionally ignored, document why and still leave a traceable action.

Errors must be handled, logged, or rethrown, but never silently discarded.

## TR018 - Function Design

Keep function inputs and outputs precise.

Prefer:

- narrow parameter types
- explicit return types for exported functions
- fail-fast validation
- exhaustive handling
- clear error messages
- small reusable helpers

Avoid:

- boolean flag parameters that create unclear control flow
- broad object blobs with many optional properties
- implicit mutation
- hidden global state
- silent fallback behaviour
- assertions instead of validation

Functions must follow single-responsibility principles. Large functions should be decomposed into smaller helpers.

## TR019 - Optional Properties

With `exactOptionalPropertyTypes`, distinguish between a missing property and a property set to `undefined`.

Prefer omitting optional properties instead of assigning `undefined`.

```ts
interface Options {
  label?: string;
}

const options: Options = {};
```

Avoid:

```ts
const options: Options = {
  label: undefined,
};
```

Only use `undefined` explicitly when the type intentionally allows it.

## TR020 - Indexed Access

With `noUncheckedIndexedAccess`, array and object indexing can return `undefined`.

Always handle this explicitly.

```ts
const first = users[0];

if (first === undefined) {
  throw new Error("Expected at least one user.");
}

console.log(first.name);
```

Do not silence the compiler with non-null assertions unless the invariant has already been checked.

## TR021 - Non-Null Assertions

Avoid `!`.

Bad:

```ts
const user = users[0]!;
```

Better:

```ts
const user = users[0];

if (user === undefined) {
  throw new Error("Expected at least one user.");
}
```

Use explicit checks so runtime failures are understandable.

## TR022 - Comments And Documentation

Document exported functions and reusable helpers with JSDoc.

Include:

- purpose
- parameters
- return value
- errors thrown
- example usage where useful

```ts
/**
 * Returns the first item from a non-empty array.
 *
 * @template T
 * @param items - Items to read from.
 * @returns The first item.
 * @throws Error if the array is empty.
 *
 * @example
 * const first = getFirst(["a", "b"]);
 */
function getFirst<T>(items: readonly T[]): T {
  const first = items[0];

  if (first === undefined) {
    throw new Error("Expected at least one item.");
  }

  return first;
}
```

Comments must explain intent, constraints, or non-obvious behaviour. Do not comment obvious syntax.

Stale comments must be removed during refactors.

## TR023 - Imports And Modules

Use ESM syntax.

Do not introduce `require`, `module.exports`, or other CommonJS patterns.

Prefer explicit imports for types.

```ts
import type { ImageMetadata } from "astro";
```

Avoid relying on implicit global types when an explicit import is clearer and more maintainable.

Use path aliases where the project defines them.
