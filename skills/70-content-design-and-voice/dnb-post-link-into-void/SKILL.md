---
id: dnb-post-link-into-void
name: dnb-post-link-into-void
title: DNB Post Link Into Void
description: Take a URL, pull its title/description/tags, screenshot the page, and draft a long-form Mastodon post with that screenshot attached, in Patrick's voice, with hashtags derived from the page's own tags. Publishes through @humanwhocodes/crosspost only after explicit confirmation, and keeps a durable log of what has already been posted so the same link is never posted twice by accident. Use for `/dnb-post-link-into-void`, "post this link to Mastodon", "share this article", or "make a post about this page".
---

Turn a single URL into one confirmed, image-attached Mastodon post: fetch the
page's own metadata, screenshot the page, draft an interesting long-form post
in Patrick's voice with hashtags pulled from the site's own tags, publish
through `@humanwhocodes/crosspost` only after explicit confirmation, and log
the URL so it does not get posted again later.

## Context boundary

Treat the supplied URL, the metadata fetched from it, and the user's answers
to this skill's questions as the source material for the post. Do not invent
facts, quotes, or claims about the linked page beyond what the fetched
metadata and screenshot actually show. If the page's own description is thin,
say so and ask the user for the angle they want, rather than making one up.

## Required input

If no URL followed the command, ask: `What URL do you want to post about?`

Reject non-`http(s)` URLs and ask for a corrected one.

## Workflow

1. **Fetch page metadata.**

   ```bash
   tsx skills/70-content-design-and-voice/dnb-post-link-into-void/resources/fetch-link-metadata.ts --url "<url>"
   ```

   This returns JSON with `title`, `description`, `siteName`, `canonicalUrl`,
   `finalUrl`, `ogImage`, and `tags` (from the page's own `keywords` meta tag
   and any `article:tag` entries). Use `canonicalUrl` (falling back to
   `finalUrl`) as the stable identifier for dedup and logging in the next
   step.

   If the fetch fails (network error, non-2xx status, timeout), report the
   failure and ask the user how to proceed. Do not fabricate metadata to
   route around a failed fetch.

2. **Check the posted log before doing any more work.**

   ```bash
   tsx skills/70-content-design-and-voice/dnb-post-link-into-void/resources/check-posted-log.ts --url "<canonicalUrl>"
   ```

   If `alreadyPosted` is `true`, tell the user this URL was already posted
   (show `mastodonUrl` and `postedAt` from the record) and ask whether they
   want to post about it again anyway. Do not silently skip or silently
   repost — always surface the prior post and get an explicit decision.

3. **Take a screenshot.**

   ```bash
   tsx skills/70-content-design-and-voice/dnb-post-link-into-void/resources/screenshot-site.ts \
     --url "<url>" \
     --output /tmp/.../dnb-post-link-into-void/<slug>.png
   ```

   Use a scratchpad path for the output file. Default viewport is
   1280x800; pass `--full-page` only if the user asks for the whole page
   rather than the fold. Known limitation: cookie-consent banners and other
   overlays are not dismissed automatically, since that needs page-specific
   JavaScript. Show the resulting screenshot to the user (e.g. via a
   file-sending tool) before asking for publish confirmation, so they can
   catch a banner-dominated or broken capture and ask for a retake instead of
   publishing it blind.

4. **Derive hashtags from the site's own tags.**

   Start from the `tags` array returned in step 1. Select two to four that
   are specific and genuinely relevant to the post's angle — skip generic or
   noisy tags (e.g. a bare "news" or "blog"). Convert each selected tag into a
   valid Mastodon hashtag: strip punctuation, title-case each word, and join
   with no spaces (`"web development"` becomes `#WebDevelopment`,
   `"typescript"` becomes `#TypeScript`). If the page provides no usable tags,
   either propose one or two hashtags inferred from the title/description and
   say so explicitly, or ask the user for hashtags — do not silently publish
   with none when the user's request implies tagging.

5. **Draft the post.**

   Use the fetched title, description, and your own reading of the page's
   subject to write one interesting, concrete Mastodon post — a specific
   detail or a point of view, not just a restated headline or "Check this
   out:". Avoid hype, clickbait phrasing, and unsupported claims. Include the
   `canonicalUrl` (or `finalUrl`) in the post text so readers can reach the
   source. Write in Patrick's voice: plain-spoken, specific, sceptical of
   hype, direct, British English by default. If the `dnb-voice` skill is
   available in this session, prefer running the draft through it before
   presenting it; otherwise apply that same profile directly.

   Default length target:

   ```text
   min: 400 characters
   max: 500 characters
   ```

   This is intentionally long-form — use the available room rather than
   writing a one-liner with a bare link. Use a different range only when the
   user asks for one; pass `--min-chars`/`--max-chars` through to the
   publishing script to match.

6. **Present the draft for confirmation.**

   Show the exact post text, the selected hashtags folded into that text,
   the screenshot, its alt text, and the character count. Ask for explicit
   confirmation before publishing.

## Image handling

The screenshot from step 3 is the image attachment. Write concise, accurate
alt text describing what the screenshot actually shows (page title/section,
not a guess at content off-screen). Do not invent alt text unrelated to the
captured image.

If the user wants a different image instead of the auto-captured screenshot,
collect a local image path and alt text for it in place of the screenshot
step.

## Confirmation protocol

Accept clear publishing instructions such as:

- `post`
- `publish`
- `send it`
- `post this version`

Treat requests to revise the text, change hashtags, retake the screenshot, or
cancel as not being publishing confirmation.

Immediately before publishing, restate the exact post text and image details.
Never publish without explicit confirmation.

## Publishing

The CLI session is expected to expose:

```text
MASTODON_ACCESS_TOKEN
MASTODON_HOST
```

The resource script defaults `CROSSPOST_DOTENV` to `~/.env` when the variable
is not already set.

```bash
tsx skills/70-content-design-and-voice/dnb-post-link-into-void/resources/post-mastodon.ts \
  --message-file /path/to/message.txt \
  --image /path/to/screenshot.png \
  --image-alt "Concise screenshot description" \
  --source-url "<canonicalUrl>" \
  --canonical-url "<canonicalUrl>"
```

Pass `--min-chars`/`--max-chars` when the user requested a custom length
range. Pass `--no-log` only if the user explicitly does not want this post
tracked.

On success, the script itself appends a record to the posted log — no
separate logging step is needed. The log defaults to:

```text
~/.local/share/dnb-post-link-into-void/posted.jsonl
```

one JSON object per line: `{ url, canonicalUrl, mastodonUrl, postedAt,
message }`. Pass `--log-path` to both the check and publish scripts together
if the user wants a non-default log location.

## Final checks

Before publishing, verify:

- the final post text matches the version the user approved
- the post is within the configured character range
- the selected hashtags are present in the post text and are genuinely
  relevant, not generic filler
- the screenshot exists, has alt text, and was shown to the user before this
  confirmation step
- the URL was checked against the posted log, and if it was already posted,
  the user explicitly chose to post again anyway
- no secrets, tokens, credentials, or private paths are exposed
- the user explicitly confirmed publishing

If a check fails, do not publish. Explain the issue and ask for the smallest
needed correction.

After successful publishing, return:

```text
Published: <URL>
```

If no URL can be extracted, return the raw Crosspost output and state that no
URL was found — the post was still logged with `mastodonUrl: "unknown"` in
that case, so a duplicate check will still work.

## Cleanup

After publishing (or if the user cancels), remove the temporary screenshot
file from the scratchpad unless the user asks to keep it.
