---
description: TypeScript architecture and module boundary rules
applyTo: "**/*.{ts,tsx,mts,cts,astro}"
---

# TypeScript architecture

Use these instructions when designing, refactoring, or reviewing TypeScript module structure.

## Architectural Principles

All architecture must prioritise:

- clarity
- stability
- maintainability
- predictable boundaries

Architecture must avoid:

- implicit coupling
- hidden dependencies
- tightly interwoven modules

Design decisions should remain understandable to future maintainers.

## Module Boundaries

Modules must have clear responsibilities.

A module should represent:

- a domain concept
- a specific capability
- a defined system boundary

Modules must not become general-purpose dumping grounds.

## Separation Of Concerns

Code should separate the following concerns whenever possible:

- domain logic
- data access
- external integrations
- user interface
- orchestration

Mixing these layers inside a single module should be avoided.

Example structure:

```text
domain/
services/
integrations/
utils/
```

## Dependency Direction

Dependencies should point inward toward domain logic.

Higher-level modules may depend on lower-level modules. Lower-level modules must not depend on higher-level modules.

Example:

```text
domain
up
services
up
controllers / UI
```

Domain modules should remain independent from infrastructure details.

## Dependency Injection

External dependencies should be injected rather than created internally.

Instead of:

```ts
const client = new DatabaseClient();
```

Prefer:

```ts
function createUserService(client: DatabaseClient) {
  return {
    async findUser(id: string): Promise<User> {
      return client.findUser(id);
    },
  };
}
```

This improves:

- testability
- modularity
- dependency visibility

## State Management

Shared mutable state should be avoided.

Prefer:

- immutable data
- explicit state containers
- functional transformations

Global mutable variables must not be introduced without strong justification.

## Service Design

Services should follow these rules:

- single responsibility
- explicit lifecycle
- explicit dependencies

Services may expose lifecycle methods such as `initialize()` and `dispose()`, but should remain minimal and predictable.

## Utilities

Utility modules should contain:

- stateless helpers
- reusable pure functions

Utility modules must not accumulate domain-specific logic. Domain-specific behaviour belongs in domain modules.

## Domain Modelling

Domain objects should be represented through explicit types.

Example:

```ts
type OrderStatus = "pending" | "processing" | "completed";
```

Discriminated unions should be used for state machines or event systems.

Domain shapes must not be duplicated across modules.

## External Integrations

External integrations should be isolated.

Examples:

```text
integrations/github
integrations/database
integrations/payment
```

These modules must translate external data into internal domain shapes.

Domain code should not depend directly on external APIs.

## Configuration

Configuration must be centralised.

Modules should receive configuration via:

- constructor parameters
- explicit config objects
- shared configuration helpers

Modules must not read environment variables directly in many locations.

Environment access should be centralised.

## Error Boundaries

Errors should be translated at module boundaries.

External errors should not leak directly into domain logic.

Example:

```text
APIError -> DomainError
```

This keeps internal logic stable even if integrations change.
