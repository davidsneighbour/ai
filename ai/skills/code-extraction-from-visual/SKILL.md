---
id: code-extraction-from-visual
title: Code Extraction From Visual
name: code-extraction-from-visual
description: "Extract visible code from videos, shorts, reels, screen recordings, and screenshot sequences into structured code blocks with explicit uncertainty handling."
---

# Video code extraction

## Purpose

Use this skill when a user wants code extracted from a video or video-like source, including:

* YouTube Shorts
* YouTube videos
* social media clips
* screen recordings
* GIFs
* uploaded video files
* sequential screenshots taken from a video

The goal is to convert visually shown code into clean, reusable code blocks while clearly separating exact extraction from reconstruction.

## When to use

Use this skill when the user asks to:

* extract code shown in a video
* turn visible code into a code block
* reconstruct code from frames or screenshots
* identify HTML, CSS, JavaScript, TypeScript, Bash, config, or terminal commands shown on screen
* merge code fragments shown across multiple frames

Do not use this skill when:

* the source contains no visible code
* the user wants a general summary of the video rather than code extraction
* the user expects perfect extraction from unreadable, blurred, cropped, or skipped frames without accepting uncertainty

## Input requirements

The agent SHOULD collect the following information before extraction.

### Required minimum

The agent MUST determine:

1. the source
2. the extraction scope
3. whether reconstruction is allowed
4. the preferred output format

### Intake questionnaire

Use this intake block before starting if the requirements are not already clear.

```md
## Video code extraction intake

* Source type: URL / uploaded video / GIF / screenshots
* Source location:
* Timestamp range:
* Extract scope: all code / HTML / CSS / JS / TS / Bash / config / terminal / all technical text
* Merge repeated frames: yes / no
* Include partial fragments: yes / no
* Output format: single block / multiple blocks / markdown with notes / raw text / diff
* Preserve visible formatting or normalise: preserve / normalise
* Mark uncertain parts: yes / no
* Reconstruction allowed: none / light / full runnable reconstruction
* Fix obvious syntax issues caused by visibility: no / annotated / silent
* Expected language or framework:
* Confidence summary wanted: yes / no
* Additional notes:
````

### Fast-path intake

If the user wants speed, ask only:

```md
1. Extract exactly what is visible, or may missing lines be reconstructed?
2. Do you want all code or only a specific language/file type?
3. Should I return one merged code block or separate blocks by file/language?
```

## Output contract

The output MUST contain:

1. a short extraction note
2. one or more code blocks
3. a list of unclear, omitted, or inferred parts
4. a confidence assessment

The output MUST distinguish between:

* exact extraction
* probable reconstruction
* inferred boilerplate

The agent MUST NOT present inferred code as exact extraction.

## Behaviour rules

The agent MUST:

* extract only what is visible unless reconstruction is explicitly allowed
* preserve the source language and framework where identifiable
* keep code copy-pasteable
* annotate unclear lines or tokens when necessary
* merge repeated frames carefully
* state uncertainty explicitly
* preserve file boundaries when visible
* note when multiple frames were combined into a single result

The agent MUST NOT:

* invent hidden lines without marking them as inferred
* claim full accuracy when frames are blurred, cropped, or skipped
* silently change syntax, framework, or file structure
* hide ambiguity between conflicting frame readings

The agent SHOULD:

* normalise obvious OCR artefacts only when the intended token is highly certain
* preserve original indentation if visible and useful
* remove duplicated lines created by overlapping frames
* group output by file or language when multiple code areas are shown

## Extraction procedure

### Step 1: identify the source

Determine:

* source type
* whether code appears in one frame or across multiple frames
* approximate timestamps where code is visible
* likely language or framework
* whether the code is complete, scrolling, partial, or obstructed

### Step 2: gather constraints

Collect the user's preferences for:

* scope
* strict extraction vs reconstruction
* output format
* uncertainty handling

If the user gives no preferences, use the defaults in this skill.

### Step 3: inspect visible code

Read the code frame by frame.

Pay special attention to tokens that are commonly misread:

* `{}[]()`
* `; , : .`
* `' " ``
* `< > /`
* `=>`
* `==` and `===`
* `&&` and `||`
* `_` and `-`
* `O` and `0`
* `l`, `1`, and `I`

Track:

* repeated lines
* scrolling continuation
* transitions between files
* cut-off lines
* blurred or obstructed regions
* syntax tokens that may alter meaning

### Step 4: reconcile frames

Merge overlapping frames into the best consolidated version.

If two readings conflict:

* prefer the reading supported by more frames
* otherwise keep the most likely reading
* annotate the conflict in the notes

If part of a line is unreadable:

* omit the unreadable portion, or
* include a marked placeholder, or
* reconstruct only if the user allowed it

### Step 5: structure the result

Return results in this order:

1. extraction note
2. code block or code blocks
3. unclear or inferred parts
4. confidence summary

## Default assumptions

If the user does not specify otherwise, the agent SHOULD assume:

* extract all visible technical code
* merge repeated frames into one best version
* return multiple code blocks if multiple file types appear
* preserve visible formatting where practical
* annotate uncertain parts
* do not invent missing code
* include a short confidence summary

## Confidence levels

Use these levels:

### High

Use when:

* the code is sharp and readable
* lines are fully visible
* multiple frames confirm the same content

### Medium

Use when:

* most code is readable
* some lines or tokens were partially obscured
* minor assumptions were required

### Low

Use when:

* the video is blurred, fast, cropped, or low resolution
* large parts are missing
* several tokens or lines required inference

## Response template

Use this structure.

````md
## Extraction note

Extracted from visible frames only.
This result is: exact extraction / partial extraction / reconstructed from multiple frames.
Some lines were unclear and are noted below.

## Code

```language
...
````

## Unclear or inferred parts

* Line X: token after `foo` is unclear.
* One line between Y and Z was cut off by the frame transition.
* Import path was partially visible and has not been guessed.

## Confidence

Medium. Most lines were readable, but a few tokens were partially obscured during scrolling.

````

## Annotation guidance

When marking uncertainty inside code, use comment syntax appropriate to the language.

Examples:

```js
const value = input?.target?.value; // unclear: optional chain may differ
````

```css
transform: translateX(100%); /* inferred from adjacent frames */
```

```bash
curl --request POST "${url}" # unclear: one flag was cut off
```

If inline comments would make the code harder to reuse, keep the code clean and move uncertainty notes below.

## Failure handling

If the source quality is insufficient, the agent MUST say so clearly.

The response SHOULD ask for one or more of:

* higher-resolution video
* screenshots of the clearest frames
* a narrower timestamp range
* a cropped view of the code area
* slower playback captures

Suggested wording:

```md
The code is not readable enough in the current source to extract reliably.
Please provide either:
* screenshots of the clearest code frames
* a shorter timestamp range
* a higher-resolution copy
* a crop focused only on the code area
```

## Good examples

### Good

* "This block was combined from three frames."
* "Line 12 is partially obscured and has been marked as unclear."
* "The import path is truncated in the source, so it has not been guessed."

### Bad

* "Here is the exact code" when parts were inferred
* silently filling in missing functions or imports
* converting framework syntax without telling the user

## Example minimal response

````md
## Extraction note

Extracted from multiple visible frames. This is a partial extraction with two uncertain tokens.

## Code

```html
<label class="switch">
  <input type="checkbox">
  <span></span>
</label>
````

```css
.switch {
  --size: 60px;
  position: relative;
  display: inline-block;
}
```

## Unclear or inferred parts

* One CSS declaration between `display` and the closing brace was cut off.
* The custom property name is clear, but one value in a later frame was unreadable.

## Confidence

Medium. The code is mostly readable, but some declarations were cut off during motion.

```

## Compatibility note

This skill is designed for strict, source-faithful extraction. If the user wants a runnable result, the extracted output SHOULD be followed by a second clearly labelled reconstructed version rather than silently extending the original.

