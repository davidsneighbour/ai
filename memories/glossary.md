---
id: glossary
title: Repository glossary
content: Canonical meanings for recurring terms used in this repository's documentation, instructions, prompts, skills, memories, agents, and structural taxonomy.
importance: high
tags: terminology, documentation, ai-assets, taxonomy
---

This glossary defines the terms used in this repository's documentation and AI
asset instructions. Use these meanings when writing or reviewing repository
content so the same word describes the same kind of asset every time.

## Format

- Terms are written in plural form until this glossary needs singular entries.
- Each entry defines the repository meaning first, then clarifies nearby terms
  that should not be used interchangeably.
- Prefer the glossary term when a document depends on a specific asset type.
- Use `leaves` as the formal plural of `leaf` in repository documentation.

## Terms

### Agents

Agents are sub-agent profiles that define a role, responsibility area, and
operating posture for a delegated AI assistant. In this repository, agent
profiles live under `agents/`, use the `.agents` protocol shape, and are indexed
from `agents.index.md`.

Agents are not [prompts](#prompts), because they describe a reusable assistant
persona or specialised worker rather than a one-time task request. Agents are
not [skills](#skills), because they define who should do a kind of work, not the
full reusable workflow for doing it.

### Branches

Branches are [structural nodes](#structural-nodes) that group, route, or
categorise other structural nodes. A branch is usually a folder. It may contain
one or more child branches, one or more [leaves](#leaves), or a mix of both.

Branches are not [leaves](#leaves), because their primary purpose is
organisation rather than being the final item. For example,
`skills/20-repository-workflows/` is a branch because it groups workflow skill
leaves.

### Instructions

Instructions are reusable rule files that constrain how an AI assistant should
behave in a context, project, language, framework, or workflow. In this
repository, instruction files live under `instructions/` and are indexed from
`instructions.index.md`.

Instructions are not [prompts](#prompts), because they are standing guidance
rather than a specific request to execute. Instructions are not
[memories](#memories), because their purpose is to direct behaviour, not record
durable context or decisions.

### Leaves

Leaves are [structural nodes](#structural-nodes) that represent the concrete
item being organised. A leaf may be a single file or a folder-backed package,
depending on the asset type.

In the [skills](#skills) tree, a leaf is the skill package itself: the folder
that contains `SKILL.md` plus any accompanying files or folders for that skill.
In another tree, a leaf might be a [prompt](#prompts) file, an
[instruction](#instructions) file, an [agent](#agents) profile folder, or
another final item defined by that tree.

Leaves are not [branches](#branches), because they are the item at the end of
the classification path rather than a grouping layer for other items.

### Memories

Memories are durable source files that record context, decisions, policies,
terminology, or operating knowledge that should survive beyond one chat session.
In this repository, memory source files live under `memories/`.

Memories are not [instructions](#instructions), though a memory can explain why
an instruction exists. Memories are not tasks, because they preserve context
rather than track work to be done.

### Prompts

Prompts are reusable task requests that can be given to an AI assistant to start
or shape a specific kind of work. In this repository, prompt files live under
`prompts/`, include prompt front matter, and are indexed from
`prompts.index.md`.

Prompts are not [instructions](#instructions), because prompts ask for an
outcome while instructions set durable behaviour rules. Prompts are not
[skills](#skills), because they do not need to package the full discovery,
workflow, validation, and handoff logic for repeated expert execution.

### Skills

Skills are reusable workflow packages that teach an AI assistant how to perform
a bounded class of work, including when to use the skill, what context to read,
what steps to follow, and how to validate the result. In this repository,
installable skills live under `skills/`, each skill directory contains a
`SKILL.md`, and the skill list is indexed from `skills.index.md`.

Skills are not [prompts](#prompts), because they are installed capability
packages rather than one-time requests. Skills are not [agents](#agents),
because they define how to do a workflow rather than who should perform it.

### Structural nodes

Structural nodes are the generic parts of a repository taxonomy tree. Every
structural node is either a [branch](#branches) or a [leaf](#leaves).

Use this term when discussing the reusable structure itself instead of one asset
type. For example, [prompts](#prompts), [instructions](#instructions),
[skills](#skills), [memories](#memories), and [agents](#agents) can each have
their own tree of structural nodes, even though their leaves take different
forms.
