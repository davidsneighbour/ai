# Token-wasting patterns

## Task Patterns

| # | Type | Pattern | Bad Example | Fixed |
| --- | --- | --- | --- | --- |
| 1 | task | **Vague task verb** | "help me with my code" | "Refactor `getUserData()` to use async/await and handle null returns" |
| 2 | task | **Two tasks in one prompt** | "explain AND rewrite this function" | Split into two prompts: explain first, rewrite second |
| 3 | task | **No success criteria** | "make it better" | "Done when the function passes existing unit tests and handles null input without throwing" |
| 4 | task | **Over-permissive agent** | "do whatever it takes" | Explicit allowed actions list + explicit forbidden actions list |
| 5 | task | **Emotional task description** | "it's totally broken, fix everything" | "Throws uncaught TypeError on line 43 when `user` is null" |
| 6 | task | **Build-the-whole-thing** | "build my entire app" | Break into Prompt 1 (scaffold), Prompt 2 (core feature), Prompt 3 (polish) |
| 7 | task | **Implicit reference** | "now add the other thing we discussed" | Always restate the full task — never reference "the thing we discussed" |
| 8 | context | **Assumed prior knowledge** | "continue where we left off" | Include Memory Block with all prior decisions |
| 9 | context | **No project context** | "write a cover letter" | "PM role at B2B fintech, 2yr SWE experience transitioning to product, shipped 3 features as tech lead" |
| 10 | context | **Forgotten stack** | New prompt contradicts prior tech choice | Always include Memory Block with established stack |
| 11 | context | **Hallucination invite** | "what do experts say about X?" | "Cite only sources you are certain of. If uncertain, say so explicitly rather than guessing." |
| 12 | context | **Undefined audience** | "write something for users" | "Non-technical B2B buyers, no coding knowledge, decision-maker level" |
| 13 | context | **No mention of prior failures** | (blank) | "I already tried X and it didn't work because Y. Do not suggest X." |
| 14 | format | **Missing output format** | "explain this concept" | "3 bullet points, each under 20 words, with a one-sentence summary at top" |
| 15 | format | **Implicit length** | "write a summary" | "Write a summary in exactly 3 sentences" |
| 16 | format | **No role assignment** | (blank) | "You are a senior backend engineer specializing in Node.js and PostgreSQL" |
| 17 | format | **Vague aesthetic adjectives** | "make it look professional" | "Monochrome palette, 16px base font, 24px line height, no decorative elements" |
| 18 | format | **No negative prompts for image AI** | "a portrait of a woman" | Add: "no watermark, no blur, no extra fingers, no distortion, no text overlay" |
| 19 | format | **Prose prompt for Midjourney** | Full descriptive sentence | "subject, style, mood, lighting, composition, --ar 16:9 --v 6" |
| 20 | scope | **No scope boundary** | "fix my app" | "Fix only the login form validation in `src/auth.js`. Touch nothing else." |
| 21 | scope | **No stack constraints** | "build a React component" | "React 18, TypeScript strict, no external libraries, Tailwind only" |
| 22 | scope | **No stop condition for agents** | "build the whole feature" | Explicit stop conditions + checkpoint output after each step |
| 23 | scope | **No file path for IDE AI** | "update the login function" | "Update `handleLogin()` in `src/pages/Login.tsx` only" |
| 24 | scope | **Wrong template for tool** | GPT-style prose prompt used in Cursor | Adapt to File-Scope Template (Template G) |
| 25 | scope | **Pasting entire codebase** | Full repo context every prompt | Scope to only the relevant function and file |
| 26 | reasoning | **No CoT for logic task** | "which approach is better?" | "Think through both approaches step by step before recommending" |
| 27 | reasoning | **Adding CoT to reasoning models** | "think step by step" sent to o1/o3 | Remove it — reasoning models think internally, CoT instructions degrade output |
| 28 | reasoning | **Expecting inter-session memory** | "you already know my project" | Always re-provide the Memory Block in every new session |
| 29 | reasoning | **Contradicting prior work** | New prompt ignores earlier architecture | Include Memory Block with all established decisions |
| 30 | reasoning | **No grounding rule for factual tasks** | "summarize what experts say about X" | "Use only information you are highly confident is accurate. Say `uncertain` if not." |
| 31 | agent | **No starting state** | "build me a REST API" | "Empty Node.js project, Express installed, `src/app.js` exists" |
| 32 | agent | **No target state** | "add authentication" | "`/src/middleware/auth.js` with JWT verify. `POST /login` and `POST /register` in `/src/routes/auth.js`" |
| 33 | agent | **Silent agent** | No progress output | "After each step output what was completed" |
| 34 | agent | **Unlocked filesystem** | No file restrictions | "Only edit files inside `src/`. Do not touch `package.json`, `.env`, or any config file." |
| 35 | agent | **No human review trigger** | Agent decides everything autonomously | "Stop and ask before: deleting any file, adding any dependency, or changing the database schema" |
