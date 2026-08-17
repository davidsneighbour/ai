---
description: Guidelines for creating high-quality custom instruction files for AI coding assistants.
applyTo: "**/*.instructions.md"
---

# Custom instructions file guidelines

Instructions for creating effective and maintainable instruction files that
guide an AI coding assistant in generating domain-specific code and
following project conventions.

## Project context

- Target audience: developers and AI assistants working with
  domain-specific code.
- File format: Markdown with YAML frontmatter.
- File naming convention: lowercase with hyphens, for example
  `react-best-practices.instructions.md`.
- Common location: `.github/instructions/` or `instructions/`, depending on
  the project's own convention; check that before assuming a path.
- Purpose: provide context-aware guidance for code generation, review, and
  documentation.

## Repository folder taxonomy

In this repository, place instruction files under the numbered top-level
folder that owns their primary subject. Use
[`../../instructions.index.md`](../../instructions.index.md) as the source of truth
for the current folder map and instruction index.

Use [`../../memories/glossary.md`](../../memories/glossary.md) as the canonical
source for repository terms such as instructions, prompts, skills, memories,
agents, branches, leaves, and structural nodes. Link to glossary entries when
an instruction file depends on a repository-specific term.

When a topic naturally touches two categories, keep the file in the most
specific owner category and add references from adjacent guidance instead of
duplicating rules. For example, TypeScript testing belongs under
`40-languages-and-runtimes/typescript/`; general quality guidance may point to
that file.

### Subtopic: folder vs. single file

A numbered top-level folder (`xx-topic/`) gets a subtopic folder only when
more than one instruction file covers that subtopic. If a subtopic has
exactly one file, keep it directly inside the numbered folder - do not
create a single-file subfolder for it.

When a subtopic folder does contain more than one file, add an entry-point
file inside that folder named `<subtopic>-index.instructions.md` (for
example `typescript-index.instructions.md`, not a bare
`index.instructions.md`) - the registry derives a file's id from its bare
filename, not its path, so multiple `index.instructions.md` files across
different folders collide on the same id and fail `ai:lint`. The entry
point is not itself a rule set; it explains what each sibling file covers,
how they relate (read order, precedence, narrower vs. broader scope), and
links out to any related skill when framework detection can't be done from
an `applyTo` glob alone. See
`instructions/40-languages-and-runtimes/typescript/typescript-index.instructions.md`
and
`instructions/50-frameworks-and-libraries/astro/astro-index.instructions.md`
for worked examples, and the repository root
`instructions/index.instructions.md` for the same pattern applied at the
folder root (unique already, since nothing else in the tree is named
`index.instructions.md`). Apply this pattern to any other subtopic folder
once it grows past one file, rather than introducing a separate
meta-instruction file for it.

## Required frontmatter

Every instruction file must include YAML frontmatter with these fields:

```yaml
---
description: 'Brief description of the instruction purpose and scope'
applyTo: 'glob pattern for target files (e.g., **/*.ts, **/*.py)'
---
```

### Frontmatter guidelines

- **description**: a single-quoted string, 1-500 characters, clearly
  stating the purpose.
- **applyTo**: a glob pattern, or comma-separated patterns, specifying
  which files the instructions apply to.
  - Single pattern: `'**/*.ts'`
  - Multiple patterns: `'**/*.ts, **/*.tsx, **/*.js'`
  - Specific files: `'src/**/*.py'`
  - All files: `'**'`

## File structure

A well-structured instruction file should include:

### 1. Title and overview

- A clear, descriptive title using a `#` heading.
- A brief introduction explaining the purpose and scope.
- Optional: a project context section with key technologies and versions.

### 2. Core sections

Organise content into logical sections based on the domain:

- **General instructions**: high-level guidelines and principles.
- **Best practices**: recommended patterns and approaches.
- **Code standards**: naming conventions, formatting, style rules.
- **Architecture/structure**: project organisation and design patterns.
- **Common patterns**: frequently used implementations.
- **Security**: security considerations, if applicable.
- **Performance**: optimisation guidelines, if applicable.
- **Testing**: testing standards and approaches, if applicable.

### 3. Examples and code snippets

Provide concrete examples with clear labels, for example a "Good example"
and a "Bad example" fenced code block pair.

### 4. Validation and verification (optional but recommended)

- Build commands to verify code.
- Linting and formatting tools.
- Testing requirements.
- Verification steps.

## Content guidelines

### Writing style

- Use clear, concise language.
- Write in imperative mood: "Use", "Implement", "Avoid".
- Be specific and actionable.
- Avoid ambiguous terms like "should", "might", "possibly" where a firm
  rule is actually intended.
- Use bullet points and lists for readability.
- Keep sections focused and scannable.

### Best practices

- **Be specific**: provide concrete examples rather than abstract concepts.
- **Show why**: explain the reasoning behind a recommendation when it adds
  value.
- **Use tables**: for comparing options, listing rules, or showing
  patterns.
- **Include examples**: real code snippets are more effective than
  descriptions.
- **Stay current**: reference current versions and best practices.
- **Link resources**: include official documentation and authoritative
  sources.

### Common patterns to include

1. Naming conventions: how to name variables, functions, classes, files.
2. Code organisation: file structure, module organisation, import order.
3. Error handling: preferred error handling patterns.
4. Dependencies: how to manage and document dependencies.
5. Comments and documentation: when and how to document code.
6. Version information: target language or framework versions.

## Patterns to avoid

- Overly verbose explanations: keep it concise and scannable.
- Outdated information: reference current versions and practices.
- Ambiguous guidelines: be specific about what to do or avoid.
- Missing examples: abstract rules without concrete code examples.
- Contradictory advice: keep the file consistent throughout.
- Copy-paste from documentation: add value by distilling and
  contextualising, not by reproducing upstream docs.

## Testing instructions before finalising

1. Try the instructions with actual prompts in the target assistant.
2. Verify code examples are correct and run without errors.
3. Confirm `applyTo` glob patterns match the intended files.

## Example structure

A minimal example structure for a new instruction file:

````markdown
---
description: 'Brief description of purpose'
applyTo: '**/*.ext'
---

# Technology name development

Brief introduction and context.

## General instructions

- High-level guideline 1
- High-level guideline 2

## Best practices

- Specific practice 1
- Specific practice 2

## Code standards

### Naming conventions
- Rule 1
- Rule 2

### File organisation
- Structure 1
- Structure 2

## Common patterns

### Pattern 1
Description and example

```language
code example
```

## Validation

- Build command: `command to verify`
- Linting: `command to lint`
- Testing: `command to test`
````

## Maintenance

- Review instructions when dependencies or frameworks are updated.
- Update examples to reflect current best practices.
- Remove outdated patterns or deprecated features.
- Add new patterns as they emerge.
- Keep glob patterns accurate as project structure evolves.

## Additional resources

- [VS Code custom instructions documentation](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Awesome Copilot instructions](https://github.com/github/awesome-copilot/tree/main/instructions)
