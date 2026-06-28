---
description: TypeScript programming instructions
applyTo: "**/*.{ts,tsx,mts,cts,astro}"
---

Use these instructions whenever creating, reviewing, refactoring, or documenting TypeScript code.

## Rule index

Each rule has a stable identifier.

Rule identifiers are used by humans, AI reviewers, custom linters, prompt-based validators, and automated reports to refer to rules in an organised way.

Use the format `TR###`, where:

* `TR` means TypeScript rule.
* `###` is a zero-padded sequential number.
* Existing identifiers must never be reused for a different rule.
* Existing identifiers must not be renumbered during normal editing.
* Deprecated rules must keep their identifier and be marked as deprecated instead of being removed silently.
* New rules must receive the next available identifier.

Current rule index:

* `TR001` - Core principles
* `TR002` - Strict type safety
* `TR003` - Type inference
* `TR004` - Prefer `satisfies` over unsafe assertions
* `TR005` - Derive types from values
* `TR006` - Model impossible states with discriminated unions
* `TR007` - Use exhaustive checks
* `TR008` - Use `as const` for constants and configuration
* `TR009` - Use type predicates for reusable narrowing
* `TR010` - Build types from existing types
* `TR011` - Validate external data at runtime
* `TR012` - Avoid `enum` in most cases
* `TR013` - Prefer inferable generics
* `TR014` - Compiler settings
* `TR015` - Template literal types
* `TR016` - Runtime safety
* `TR017` - Error handling
* `TR018` - Function design
* `TR019` - Optional properties
* `TR020` - Indexed access
* `TR021` - Non-null assertions
* `TR022` - Comments and documentation
* `TR023` - Imports and modules
* `TR024` - Code review checklist

## TR001 - Core principles

Write TypeScript for correctness, maintainability, and safe refactoring.

Prefer code that lets the compiler prove correctness instead of code that relies on comments, manual discipline, or unchecked assumptions.

TypeScript types must describe the real runtime behaviour of the code. Do not use types to silence errors unless the value has actually been validated or narrowed.

## TR002 - Strict type safety

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

## TR003 - Type inference

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

* Exported function parameters and return values
* Public interfaces
* Configuration objects
* External data boundaries
* Complex generic helpers
* Values where inference becomes too broad or unclear

## TR004 - Prefer `satisfies` over unsafe assertions

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

## TR005 - Derive types from values

Avoid duplicating runtime values and TypeScript types manually.

Use `as const`, indexed access types, and `typeof` to keep types and values in sync.

```ts
const roles = ["admin", "user", "guest"] as const;

type Role = (typeof roles)[number];
```

Use this pattern for:

* Allowed string values
* Configuration keys
* Route names
* Event names
* Status values
* Feature flags
* Design tokens

## TR006 - Model impossible states with discriminated unions

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

## TR007 - Use exhaustive checks

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

## TR008 - Use `as const` for constants and configuration

Use `as const` when values should remain literal and readonly.

```ts
const theme = {
  mode: "dark",
  contrast: "high",
} as const;
```

This is especially useful for:

* Constants
* Route maps
* Configuration objects
* Test fixtures
* Lookup tables
* Static data used to derive types

Do not use `as const` to hide mutability problems. Use it when the value is intentionally fixed.

## TR009 - Use type predicates for reusable narrowing

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

## TR010 - Build types from existing types

Do not duplicate object shapes manually.

Use TypeScript utility types and indexed access types to derive new types from existing ones.

Useful utilities include:

* `Pick`
* `Omit`
* `Partial`
* `Required`
* `Readonly`
* `Record`
* `Extract`
* `Exclude`
* `NonNullable`
* Indexed access types

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

## TR011 - Validate external data at runtime

TypeScript does not validate runtime data.

Always validate data from external or untrusted sources before treating it as typed.

External boundaries include:

* API responses
* JSON files
* Environment variables
* CLI arguments
* User input
* CMS content
* Database rows
* Local storage
* Third-party package output

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

## TR012 - Avoid `enum` in most cases

Prefer literal unions derived from readonly arrays or objects.

```ts
const statuses = ["draft", "published", "archived"] as const;

type Status = (typeof statuses)[number];
```

This is usually easier to serialise, test, refactor, and use with external data.

Only use `enum` when there is a strong project-specific reason.

## TR013 - Prefer inferable generics

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

## TR014 - Compiler settings

Use strict compiler options.

Recommended baseline:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "Bundler",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "useUnknownInCatchVariables": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Do not weaken strictness to make errors disappear.

Fix the code, improve the model, or validate the data.

## TR015 - Template literal types

Use template literal types when string structure matters.

```ts
type ApiRoute = `/api/${string}`;
type LocaleRoute = `/${"en" | "de"}/${string}`;
```

Good use cases include:

* Routes
* Event names
* CSS utility names
* Design token names
* Query keys
* Translation keys
* File path conventions

Avoid overly clever template literal types that make code harder to read or maintain.

## TR016 - Runtime safety

Type safety is not runtime safety.

TypeScript helps prevent many classes of bugs, but it does not:

* Validate external data
* Guarantee good architecture
* Eliminate runtime exceptions
* Replace tests
* Replace input validation
* Protect against incorrect type assertions

Treat runtime boundaries as unsafe until validated.

## TR017 - Error handling

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

## TR018 - Function design

Keep function inputs and outputs precise.

Prefer:

* Narrow parameter types
* Explicit return types for exported functions
* Fail-fast validation
* Exhaustive handling
* Clear error messages
* Small reusable helpers

Avoid:

* Boolean flag parameters that create unclear control flow
* Broad object blobs with many optional properties
* Implicit mutation
* Hidden global state
* Silent fallback behaviour
* Assertions instead of validation

## TR019 - Optional properties

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

## TR020 - Indexed access

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

## TR021 - Non-null assertions

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

## TR022 - Comments and documentation

Document exported functions and reusable helpers with JSDoc.

Include:

* Purpose
* Parameters
* Return value
* Errors thrown
* Example usage where useful

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

## TR023 - Imports and modules

Use ESM syntax.

Prefer explicit imports for types.

```ts
import type { ImageMetadata } from "astro";
```

Avoid relying on implicit global types when an explicit import is clearer and more maintainable.

Use path aliases where the project defines them.

## TR024 - Code review checklist

Before accepting TypeScript code, check that:

* `TR002` - No `any` is used.
* `TR002` - `unknown` values are narrowed or validated.
* `TR011` - External data is validated at runtime.
* `TR004` - Type assertions are avoided or justified.
* `TR004` - `satisfies` is used where it preserves inference better than `as`.
* `TR005` - Types are derived from values where possible.
* `TR006` - Impossible states are modelled with discriminated unions.
* `TR007` - Switch statements over unions are exhaustive.
* `TR020` - Indexed access handles `undefined`.
* `TR019` - Optional properties are handled intentionally.
* `TR013` - Generics infer naturally for callers.
* `TR017` - Runtime errors are handled explicitly.
* `TR022` - Exported helpers have useful JSDoc.
* `TR023` - Imports use ESM syntax.
* `TR001` - Code follows the rule intent, not only the literal examples.
