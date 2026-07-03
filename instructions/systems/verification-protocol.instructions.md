---
name: Verification protocol
description: The verification protocol agents follow before returning results to the user.
applyTo: "**/*.*"
---

# Verification protocol

## Purpose

This protocol prevents incomplete work, unchecked assumptions, and silent
failures. It enforces a verification loop, explicit requirement checking,
and clear reporting of blockers.

Unless a more specific instruction file overrides it, apply this protocol
to all tasks.

## Default verification protocol

Run this before returning a final result.

1. **Re-read the full request.** Re-check the complete task specification,
   including any corrections or clarifications made later in the
   conversation. Treat the latest user instruction as authoritative when it
   overrides earlier wording.
2. **Identify requirements.** Extract all explicit requirements from the
   request. Identify relevant implicit quality expectations such as
   correctness, completeness, formatting, consistency, and edge-case
   handling.
3. **Verify instead of assuming.** Do not claim a task is complete based on
   intention. Verify results using actual evidence: execution, inspection,
   output validation, format verification, behaviour testing.
4. **Rework failures.** If a requirement fails verification, fix the issue,
   then repeat the verification process. Do not assume previously passing
   parts still pass.
5. **Respect the planned process.** Check whether all planned steps were
   followed in the intended order. If steps were skipped, reordered, or
   replaced, state what changed and why.
6. **Stop after repeated failure.** If the same issue persists after three
   full fix-and-verify cycles, stop. Report the blocker clearly: the
   failing requirement, the attempted fixes, and the likely cause.
7. **Return only verified results.** Return the final result only when
   every requirement has verified evidence of passing, or unresolved
   blockers have been explicitly reported.

## Extended verification protocol

Use this for tasks where failure could propagate silently: code
generation, file creation or modification, scripts and automation,
configuration changes, and multi-step workflows.

### Requirement mapping

Identify every explicit requirement in the task, and map each one to the
exact implementation element that satisfies it, for example a file path, a
function, a configuration section, an output section, or a command's
behaviour.

### Implementation traceability

When code or files were modified, map each requirement to the relevant
implementation location, explain how the implementation satisfies the
requirement, and identify any requirement that could not be implemented or
verified.

### Evidence-based verification

Base verification on observable evidence rather than assumptions: confirm
file structure, validate CLI parameters, confirm output formatting, review
error handling paths, and test expected behaviour and edge cases.

### Full re-verification after fixes

If an issue is found, fix it, then re-run the entire verification process.
Do not assume unaffected sections remain correct.

### Failure escalation

After three full fix-and-verify cycles with the same unresolved problem,
stop attempting silent fixes, report the blocker, provide a diagnosis of
the cause, and suggest possible next actions if available. Do not return
unverified or partially broken work.

## Verification summary

For complex tasks, include a concise verification summary: requirements
checked, verification evidence, and confirmation of successful completion
or disclosure of unresolved blockers. The goal is transparency, not
verbosity.

## Guiding principle

Do not rely on assumptions when verifying work. Back completion claims
with verification evidence, or explicitly disclose the limitations.
