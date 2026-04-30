---
id: signal-extraction-framework
name: signal-extraction-framework
title: Signal Extraction Framework
version: 1.0.0
category: analysis
description: Extracts signal, frameworks, and reusable systems from screenshots, social media posts, visual carousels, and externally sourced content while filtering hype, noise, and weak reasoning.
triggers:
  - social media screenshot
  - carousel analysis
  - prompt analysis
  - framework extraction
  - image transcription
  - content audit
input_types:
  - image
  - multiple_images
  - screenshot
  - text
output_types:
  - transcription
  - structural analysis
  - framework extraction
  - reusable prompts
  - critical audit
strict: true
---

# Purpose

The Signal Extraction Framework exists to analyse externally sourced content and separate useful operational knowledge from:

- hype
- authority signalling
- engagement bait
- fake sophistication
- recycled productivity advice
- low-quality frameworks
- shallow prompt engineering content

The goal is not summarisation.

The goal is to convert noisy content into reusable systems.

---

# When to use

Use this skill when analysing:

- screenshots
- social media posts
- carousel posts
- infographic-style advice posts
- "X things you need to know"
- prompt collections
- productivity systems
- business frameworks
- creator advice
- thought-leader content
- viral educational content

Use when the source material may contain:

- useful ideas hidden in poor formatting
- oversimplified frameworks
- exaggerated claims
- recycled concepts
- unclear reasoning

---

# When NOT to use

Do not use this skill for:

- legal documents
- contracts
- academic papers
- medical reports
- highly technical manuals
- purely visual artwork analysis
- emotional support conversations
- casual chat

These require different analytical frameworks.

---

# Behaviour rules

The skill must assume:

- content may be incomplete
- content may be misleading
- formatting may create false authority
- lists may contain duplicates disguised as categories
- confidence does not equal correctness

The skill must remain sceptical.

---

# Mandatory workflow

## 1. Faithful transcription

Extract visible text exactly as shown.

Preserve:

- order
- structure
- numbering
- repetition
- mistakes
- contradictions

Do not rewrite.

---

## 2. OCR limitations

Explicitly identify:

- unreadable sections
- cropped text
- low resolution issues
- formatting ambiguity

Never guess missing text.

---

## 3. Sanity analysis

Identify:

- contradictions
- vague claims
- fake precision
- redundancy
- unsupported claims
- authority signalling

Separate:

- useful claims
- weak claims
- manipulative framing

---

## 4. Structural analysis

Collapse overlapping ideas into higher-order systems.

Identify:

- repeated patterns
- renamed duplicates
- surface complexity
- real operational layers

---

## 5. Framework extraction

Convert useful material into operational systems.

Each framework should include:

- purpose
- inputs
- outputs
- process
- failure conditions
- trade-offs

---

## 6. Reusable prompt extraction

Create reusable prompts that help analyse future content.

Prompts must:

- be reusable
- remain topic agnostic
- prioritise depth

---

## 7. Final verdict

Classify the source as:

- High signal
- Mixed signal
- Mostly recycled
- Mostly marketing
- Pure bullshit

Then explain why.

---

# Reset behaviour

Whenever a new image is uploaded:

restart the workflow completely.

Do not assume continuity unless explicitly instructed.

This includes:

- single screenshots
- multi-image uploads
- image-only messages

---

# Output format

Always output in this order:

1. Faithful transcription
2. OCR limitations
3. Sanity analysis
4. Structural analysis
5. Framework extraction
6. Reusable prompts
7. Final verdict

---

# Success criteria

This skill succeeds when:

- weak ideas are exposed quickly
- strong ideas survive scrutiny
- duplicated ideas are collapsed
- frameworks become reusable
- noise gets removed
- users leave with operational clarity

This skill fails when:

- it summarises instead of analysing
- it blindly validates content
- it ignores weak logic
- it preserves hype language
- it mistakes formatting for substance