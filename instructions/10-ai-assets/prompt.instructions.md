---
description: Guidelines for creating high-quality prompt files for AI coding assistants.
applyTo: "**/*.prompt.md"
---

# Prompt file guidelines

Instructions for creating effective and maintainable prompt files that
guide an AI coding assistant in delivering consistent, high-quality
outcomes across any repository.

## Scope and principles

- Target audience: maintainers and contributors authoring reusable prompts
  for a chat-based AI assistant.
- Goals: predictable behaviour, clear expectations, minimal permissions,
  and portability across repositories.
- Primary references: the assistant's own documentation on prompt files,
  plus organisation-specific conventions.

## Frontmatter requirements

Every prompt file should include YAML frontmatter. Check the specific
registry or tool's own schema for exact allowed fields; common ones
include:

| Field | Description |
| --- | --- |
| `description` | A short description of the prompt (single sentence, actionable outcome). |
| `name` | The name shown after typing `/` in chat. Defaults to the filename if not specified. |
| `agent` | The agent to use, for example `ask`, `edit`, `agent`, or a custom agent name. Defaults to the current agent. |
| `model` | The language model to use. Defaults to the currently selected model. |
| `tools` | A list of tool or tool-set names available for this prompt. |
| `argument-hint` | Hint text shown in the chat input to guide user interaction. |

### Guidelines

- Use consistent quoting and keep one field per line, for readability and
  version control clarity.
- If `tools` are specified and the current agent is `ask` or `edit`, the
  default agent typically becomes `agent`; check the specific tool's rules.
- Preserve any additional metadata (`language`, `tags`, `visibility`, etc.)
  required by the project or organisation, as long as the registry's schema
  allows it.

## File naming and placement

- Use kebab-case filenames ending with `.prompt.md`.
- Store them under the project's own conventional prompts directory (for
  example `.github/prompts/` or a root `prompts/` directory); check the
  project's own convention rather than assuming one.
- In this repository, place prompt files directly inside the numbered
  top-level prompt folder that owns their primary subject. Keep the top-level
  folder taxonomy aligned with
  [`../index.instructions.md`](../index.instructions.md).
- When flattening a prompt from a more specific folder, preserve important
  context in the filename, for example `hugo-upgrade.prompt.md` instead of
  `upgrade.prompt.md`.
- Use a short filename that communicates the action, for example
  `generate-readme.prompt.md` rather than `prompt1.prompt.md`.

## Body structure

- Start with a `#` level heading that matches the prompt's intent, so it
  surfaces well in a command or Quick Pick search.
- Organise content with predictable sections. A reasonable baseline:
  `Mission` or `Primary Directive`, `Scope & Preconditions`, `Inputs`,
  `Workflow` (step-by-step), `Output Expectations`, and
  `Quality Assurance`.
- Adjust section names to fit the domain, but keep the logical flow: why,
  context, inputs, actions, outputs, validation.
- Reference related prompts or instruction files using relative links to
  aid discoverability.

## Input and context handling

- Use the assistant's own variable-substitution syntax (for example
  `${input:variableName[:placeholder]}` in VS Code) for required values,
  and explain when the user must supply them. Provide defaults or
  alternatives where possible.
- Call out contextual variables such as the current selection, file, or
  workspace folder only when they are essential, and describe how the
  assistant should interpret them.
- Document how to proceed when mandatory context is missing, for example
  "Request the file path and stop if it remains undefined."

## Tool and permission guidance

- Limit tools to the smallest set that enables the task. List them in the
  preferred execution order when the sequence matters.
- If the prompt inherits tools from a chat mode or agent, mention that
  relationship and state any critical tool behaviours or side effects.
- Warn about destructive operations (file creation, edits, terminal
  commands) and include guard rails or confirmation steps in the workflow.

## Instruction tone and style

- Write in direct, imperative sentences targeted at the assistant, for
  example "Analyse", "Generate", "Summarise".
- Keep sentences short and unambiguous, to support translation and
  localisation.
- Avoid idioms, humour, or culturally specific references; favour neutral,
  inclusive language.

## Output definition

- Specify the format, structure, and location of expected results, for
  example "Create `docs/adr/adr-XXXX.md` using the template below."
- Include success criteria and failure triggers so the assistant knows
  when to halt or retry.
- Provide validation steps, manual checks, automated commands, or
  acceptance criteria lists, that reviewers can execute after running the
  prompt.

## Examples and reusable assets

- Embed good/bad examples or scaffolds (Markdown templates, JSON stubs)
  that the prompt should produce or follow.
- Maintain reference tables (capabilities, status codes, role
  descriptions) inline to keep the prompt self-contained. Update these
  tables when upstream resources change.
- Link to authoritative documentation instead of duplicating lengthy
  guidance.

## Quality assurance checklist

- Frontmatter fields are complete, accurate, and least-privilege.
- Inputs include placeholders, default behaviours, and fallbacks.
- The workflow covers preparation, execution, and post-processing without
  gaps.
- Output expectations include formatting and storage details.
- Validation steps are actionable (commands, diff checks, review prompts).
- Security, compliance, and privacy policies referenced by the prompt are
  current.
- The prompt executes successfully in the target assistant using
  representative scenarios.

## Maintenance guidance

- Version-control prompts alongside the code they affect; update them when
  dependencies, tooling, or review processes change.
- Review prompts periodically to ensure tool lists, model requirements,
  and linked documents remain valid.
- When a prompt proves broadly useful, extract the common guidance into an
  instruction file or a shared prompt pack rather than duplicating it.

## Additional resources

- [VS Code prompt files documentation](https://code.visualstudio.com/docs/copilot/customization/prompt-files#_prompt-file-format)
- [Awesome Copilot prompt files](https://github.com/github/awesome-copilot/tree/main/prompts)
- [VS Code agent mode tool configuration](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode#_agent-mode-tools)
