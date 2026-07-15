---
name: prompts-80-knowledge-research-and-data-second-brain
description: Set up a local Obsidian second brain with Claude through an interview and generated linked Markdown notes.
---

# How to set up a Second Brain with Claude and Obsidian

> Two free apps and one prompt. Claude asks you a few questions, builds a folder of connected notes about your work, your projects and your people, and Obsidian shows it as a living graph. No code, no template to buy, and every file stays on your own computer.

By Fionn Tobin · [How to set up a Second Brain with Claude and Obsidian](https://fionntobin.com/guides/second-brain-claude-obsidian)

---

You watched the video, so here's the whole thing in one place, plus the exact prompt. This is the one that builds you a second brain: a folder of notes about your work, your projects and your ideas, all connected, that Claude can read and write and that you can see as a map.

## What a second brain actually is

Strip away the productivity-guru noise and a second brain is one folder of notes that link to each other. A note for each project. A note for each person who matters. A place to dump ideas. A daily line about what happened. The magic is the links: when notes connect, you stop losing things, and your tools can finally see how your life fits together.

Most people never build one because the setup feels like a weekend project. Buy the template, learn the method, tag everything. You don't need any of that. Claude does the setup, and you just answer a few questions.

## Why Claude and Obsidian

Both free to start, and they cover each other's blind spots.

- **Claude** does the thinking: it interviews you, writes the starter notes, links them, and later helps you keep the whole thing tidy.
- **Obsidian** does the seeing: it's a free app that opens any folder of notes and shows every connection as a graph you can click around.

The part people miss: your second brain is just files on your own computer. No subscription holding your notes hostage, nothing uploaded anywhere, works with no internet. If you delete both apps tomorrow, your notes are still there in plain text.

## Set it up

**Step 1. Download Claude for desktop.** Get the desktop app at [claude.ai/download](https://claude.ai/download), not the website version. The desktop app is the one that can create files on your computer.

**Step 2. Download Obsidian.** Free at [obsidian.md](https://obsidian.md). Install it, but you don't need to set anything up. Ignore the welcome screen for now.

**Step 3. Paste the prompt below into Claude.** It asks you up to five short questions, then builds the whole brain: folders, starter notes, links, all written from your own answers.

**Step 4. Open it in Obsidian.** Open Obsidian, choose "Open folder as vault", and pick the Second Brain folder Claude just made. Then open the graph view (the icon in the left rail, or Cmd+G) and watch your life show up as a constellation.

## The prompt

```text
You're going to set up my personal second brain as a folder of linked notes I'll open in Obsidian.

First, interview me. One question at a time, five questions max: what I do, what projects I'm juggling right now, who the key people are, and what I want this brain to help me with.

Then create a folder called "Second Brain" on my Desktop with this structure, as plain markdown files:

- Home.md, my dashboard: who I am, what matters right now, with links to everything below
- A Projects folder, one note per active project from my answers
- A People folder, one note per key person
- An Ideas folder with one note called Inbox.md, where quick thoughts go
- A Journal folder with a note for today

Write real starter content in every note from my answers, no placeholders, and connect the notes to each other with standard markdown links so the graph view shows the web.

If you can't create files on this computer, tell me first, then give me each note one at a time to paste in myself.

Finish by telling me: the two-line instruction for opening the folder in Obsidian ("Open folder as vault"), and the three habits that keep this alive: capture quick thoughts to Inbox, write one journal line a day, and make a note for anything I mention twice.
```

## What it looks like when it runs

Claude asks what you do. You tell it you run a small landscaping business, you're quoting two big jobs, hiring your first employee, and you keep forgetting what you agreed with suppliers.

Two minutes later there's a folder on your desktop: a Home note that reads like a briefing about your business, a note for each of the two jobs with what stage they're at, a note for the hire, notes for your main suppliers, an empty Inbox waiting for ideas, and today's journal started. Every note links to the others.

You open it in Obsidian, hit the graph view, and there it is: your business as a map, on day one. From then on, every note you add makes it denser.

## Keeping it alive

A second brain dies when it becomes a chore. Three habits, none longer than a minute:

1. **Capture to Inbox.** Idea in the shower, thing someone said, link you want to keep: one line in Inbox.md. Don't sort it, just catch it.
2. **One journal line a day.** What happened, what you decided. Future you will thank present you constantly.
3. **Link anything you mention twice.** Second time a person or project comes up, it gets its own note.

And once a week, let Claude do the tidying:

```text
Open my Second Brain folder. Read Inbox.md and my journal notes from this week. File each inbox item where it belongs, create notes for anything that deserves one, link them up, and give me a five-line summary of my week. Ask before you move anything.
```

## A few more to try

```text
Read my whole Second Brain and tell me: what am I dropping? Which projects have gone quiet, which people have I not spoken to, what did I say I'd do that has no follow-up anywhere?
```

```text
Here are my rough notes from a meeting I just had. Turn them into a proper note in my Second Brain, link it to the right project and people, and add any actions to my Inbox.
```

## The one rule

Your second brain is exactly as private as your computer, so treat it that way. Everything stays in that one local folder: nothing is uploaded, and Claude asks before it moves or changes anything, because the prompt tells it to. Two things to keep it that way. Don't turn on sync or publishing features until you've thought about what's in there. And write about other people the way you'd be comfortable with them reading, because notes have a way of being seen. Your notes, your machine, your rules.

---

From fionntobin.com. More free guides: [fionntobin.com/guides](https://fionntobin.com/guides)
Follow along: TikTok @fionntobin · Instagram @fionn.tobin · YouTube @fionn-ai
