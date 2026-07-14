---
title: Resume interrupted work
description: Check for a project-root RESUME.md before starting repository work and treat it as blocking unfinished work.
applyTo: "**/*.*"
---

Before starting repository work, check for a project-root `RESUME.md`.

If `RESUME.md` exists, it is blocking. Read it, follow its unfinished-work instructions, complete or explicitly resolve the listed work, and remove `RESUME.md` before starting unrelated work.

If the repository contains `skills/20-repository-workflows/dnb-resume-interrupted-work/SKILL.md`, read and follow that skill for the complete resume protocol.

If no `RESUME.md` exists, continue with the user's current request normally.

Create or update project-root `RESUME.md` whenever the active task cannot be fully completed in the current step, including when the user pauses the task, usage/context/tool limits interrupt the work, verification is unfinished, or known required steps remain.
