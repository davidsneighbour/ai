---
name: prompts-raindrop-io-generate-tags
description: Generate a comprehensive set of relevant hashtags for a given URL to use in a Raindrop.io bookmark collection.
---

Create a list of hashtags for the URL I provide.

Instructions:

- Load and read the page to understand what the content is about.
- Treat every new URL as a completely independent resource.
- Do not assume any relationship to previously analysed URLs unless I explicitly state that they are related.
- Use previously provided hashtag lists only to maintain tagging consistency, not to infer topical connections.
- Generate a comprehensive set of relevant hashtags for use in my Raindrop.io bookmark collection.
- More relevant hashtags are better than too few.
- Always include source tags based on the type of URL:
  - GitHub repository: `gh-repo`, `github`
  - GitHub Gist: `gh-gist`, `github`
  - GitHub issue or pull request: `gh-issue` or `gh-pr`, `github`
  - Blog article: `blog`, `article`
  - Tutorial: add `tutorial`
  - Web application: `app` and `saas` if applicable
  - Documentation: `docs`
- Include:
  - Core technologies, e.g. `typescript`, `astro`, `react`
  - Concepts and patterns, e.g. `performance`, `web-development`
  - Domain-specific terms
  - Project or product names
- Prefer lowercase.
- Use hyphenated tags for multi-word concepts, e.g. `web-development`, `static-site-generator`.
- Avoid duplicates.
- Return only the hashtags:
  - No leading `#`
  - Comma separated
  - No explanations
  - No additional text

Accessibility and hallucination rule:

- Do not hallucinate tags if the URL cannot be accessed or the page content cannot be read.
- If the URL is inaccessible, clearly state that the URL is not accessible instead of returning hashtags.
- Include the reason if it can be determined, e.g. blocked by paywall, login required, robots restriction, network error, 404, 403, JavaScript-only page without readable content, or missing page content.
- Explain what needs to happen to make the URL usable, e.g. provide an accessible copy, paste the page text, upload a screenshot, grant access, use a public URL, or provide the relevant excerpt.
- In the inaccessible case, do not guess tags from the URL, title, domain, or prior context.

Extraction command:

- If I write `extract`, return a deduplicated comma-separated list of all hashtags created in this session.
- Include only tags that were actually produced in this session.
- Prefer the exact existing spelling used in this session.
- Sort tags alphabetically unless I ask for grouping.
- Return only the extracted tags:
  - No leading `#`
  - Comma separated
  - No explanations
  - No additional text

Workflow:

- I will send one URL at a time.
- If I send another URL, repeat the process for the new URL.
- If I send back an existing list of hashtags, use it as context to improve future tagging consistency.
- If I write `extract`, extract the tags created in this session as described above.
