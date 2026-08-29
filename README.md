# tech-writer-prompts

**Prompts are documentation. Documentation gets tested.**

A small, opinionated library of prompts for technical writers — each one
versioned, documented, and shipped with eval cases that run in CI. Nothing
here merges until its tests pass. By [Reem Sabawi](https://github.com/reem-sab).
MIT licensed.

---

## 60-second quickstart

```bash
git clone https://github.com/reem-sab/tech-writer-prompts
cd tech-writer-prompts
npm install && npm run build

# See what's in the library
node runner/dist/cli.js list

# Run a prompt against your own draft
node runner/dist/cli.js run audit-page --input PAGE=./your-draft.md

# Run a prompt's tests (offline matchers; add --judge for rubric cases)
node runner/dist/cli.js eval audit-page
```

`--input NAME=value` takes either a literal string or a path to a file,
whose contents are read in. Set `ANTHROPIC_API_KEY` before `run` or `eval`.

> If a prompt here saves you an hour, [star the repo](https://github.com/reem-sab/tech-writer-prompts) — stars are the signal that decides what gets tested next.

---

## The four to read first

The whole point of this library is that a prompt states its contract up
front. Here are four, in full, so you can judge them without clicking
through.

### 1. `audit-page`

Reviews a docs page against a fixed 10-point rubric and returns a scored
table plus a prioritized fix list.

```text
You are auditing a documentation page for quality. You are not a copy editor
and you are not rewriting the page — you are scoring it against a fixed
rubric and telling the author what to fix first.

## Rubric

Score the page from 1 (fails badly) to 5 (no issues found) on each of these
10 points. A score is not a vibe — cite the specific line, heading, or
absence that justifies it.

1. Prerequisite Coverage — are all accounts, permissions, installed tools,
   and prior steps the reader needs stated before they're needed?
2. Accuracy Signals — version numbers, dates, or claims that look stale,
   contradictory, or unverifiable as written.
3. Completeness — is every step needed to reach the stated goal present,
   with no silent gaps?
4. Scannability — headings, lists, and code blocks used so a reader can scan
   instead of reading linearly; no walls of text.
5. Verification Checkpoints — after each major step, can the reader tell
   whether it worked before moving on?
6. Terminology Consistency — the same concept is named the same way
   throughout; no unexplained synonyms.
7. Code Sample Validity — code blocks are labeled with a language, look
   syntactically plausible, and match the surrounding instructions.
8. Error/Troubleshooting Coverage — likely failure points have a stated
   cause or next step, not just a happy path.
9. Audience Fit — the assumed background knowledge matches the audience the
   page states or implies it's for.
10. Actionability — instructions are imperative and unambiguous, not
    descriptive or optional-sounding when they aren't optional.

## Output format

1. A Markdown table: | # | Rubric Point | Score (1-5) | Evidence |, one row
   per rubric point, evidence quoting the specific part of the page.
2. A prioritized fix list, ordered by impact (not rubric order), each item:
   N. [Severity: Critical | High | Medium | Low] <fix> — <rubric point(s)>.
   Only include fixes for points that scored 3 or below.
```

*(Full text, inputs, and limits: [prompts/audit-page/](prompts/audit-page/).)*

### 2. `quickstart-hostile-user`

Walks a quickstart as a literal first-time user on a clean machine, with
zero assumed context — the fastest way to find the prerequisite you forgot
you knew.

```text
You are simulating a first-time user following this quickstart on a clean
machine, with zero context beyond what is written on the page. You have never
used this product before, you have no assumed background knowledge, and you
do not fill gaps using outside experience or common conventions — if the page
doesn't say it, you don't know it.

For every instruction, you interpret it as literally and as narrowly as
possible. If a step says "add your key," and doesn't say where, you stop and
flag it rather than guessing the obvious place.

Walk the quickstart step by step. For each step, produce:
  Step N: "<the instruction as written>"
  → What I do: <what a literal first-time reader would do, or "I can't proceed">
  → Result: ✅ Works as written | ⚠️ Ambiguous | ❌ Blocked
  → Why: <one sentence, only for ⚠️ or ❌>

Then produce three lists (reference step numbers; "None found" if empty):
  Unstated Prerequisites — accounts, tools, permissions, or knowledge required
    but never mentioned before they're needed.
  Ambiguous Steps — steps with more than one plausible interpretation.
  Missing Verification Checkpoints — points where the reader can't confirm a
    step worked before moving on.
```

*(Full text, inputs, and limits: [prompts/quickstart-hostile-user/](prompts/quickstart-hostile-user/).)*

### 3. `error-catalog`

Turns raw error codes from source into a troubleshooting table — plus a
matching JSON array for agents to consume directly.

```text
You are turning a raw list of error codes into a troubleshooting reference
for two audiences at once: a developer scanning a table, and an agent parsing
structured data to decide what to do next.

For each error, work out:
  Likely cause — from the code's name, message text, and any inline comment.
    Don't invent a more specific cause than the source supports.
  Fix — the concrete action that resolves it, phrased as an instruction.
  How you got here — the request or condition that triggers this error.

If a bare name gives you nothing to go on (no message, no comment, ambiguous
name), write "Unclear from source — ask an engineer" instead of guessing.

Output two sections:
  1. A table: | Error Code | Message | Likely Cause | Fix | How You Got Here |
  2. The same data as a JSON array in a ```json block, one object per error:
     { "code", "message", "cause", "fix", "trigger" }. Emit valid JSON.
```

*(Full text, inputs, and limits: [prompts/error-catalog/](prompts/error-catalog/).)*

### 4. `agent-readiness`

Rates a page for how safely an autonomous agent could act on it directly —
the check for the moment your docs stop being read only by humans.

```text
You are rating how safely an autonomous agent (not a human) could read this
page and act on it directly — running commands, editing files, calling APIs —
without a human in the loop to catch a misreading.

Look for each failure mode; quote the exact text of each instance:
  1. Ambiguous pronouns/references — "it," "this," where more than one
     referent is plausible.
  2. Context-dependent steps — a step that only makes sense given state the
     page never established.
  3. Missing structure — instructions buried in prose instead of steps/code.
  4. Dangerous underspecified claims — an executable action missing a detail
     that changes its blast radius ("delete the old key" — which key?).
  5. Non-determinism — a step with more than one valid reading that lead to
     different outcomes.

Output: an "Agent Readiness: N/10" score (blast radius, not just count),
findings grouped by category with quoted text, and a Fixes list ordered by
blast radius — most dangerous first.
```

*(Full text, inputs, and limits: [prompts/agent-readiness/](prompts/agent-readiness/).)*

---

## The full library

All 15 prompts. Every example input uses a shared fictional product, the
**Lumen API** (event notifications + webhooks), so the library reads as one
coherent set. Badges reflect the most recent CI eval run, not a claim.

| Prompt | What it does | Tags | Evals |
|---|---|---|---|
| [audit-page](prompts/audit-page/) | Review a page against a 10-point rubric → scored table + fix list. | `docs-review` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/audit-page/badge.json) |
| [quickstart-hostile-user](prompts/quickstart-hostile-user/) | Walk a quickstart as a literal first-time user; flag every gap. | `docs-review` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/quickstart-hostile-user/badge.json) |
| [error-catalog](prompts/error-catalog/) | Raw error codes → troubleshooting table + agent-readable JSON. | `api` `agents` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/error-catalog/badge.json) |
| [api-ref-skeleton](prompts/api-ref-skeleton/) | OpenAPI spec → reference draft with TODOs where the spec is silent. | `api` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/api-ref-skeleton/badge.json) |
| [release-notes](prompts/release-notes/) | Commit list → customer notes grouped breaking/new/fixed. | `release` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/release-notes/badge.json) |
| [glossary-extract](prompts/glossary-extract/) | Pages → terms used but never defined, ranked, with draft definitions. | `docs-review` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/glossary-extract/badge.json) |
| [style-check](prompts/style-check/) | Apply a style guide as a violation list, without flattening voice. | `style` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/style-check/badge.json) |
| [agent-readiness](prompts/agent-readiness/) | Rate a page for machine readers → score + fixes. | `agents` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/agent-readiness/badge.json) |
| [diataxis-classify](prompts/diataxis-classify/) | Identify a page's Diataxis mode, where it mixes, how to split. | `ia` `docs-review` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/diataxis-classify/badge.json) |
| [ia-review](prompts/ia-review/) | Nav structure → orphans, duplicate scopes, missing landing pages. | `ia` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/ia-review/badge.json) |
| [doc-from-transcript](prompts/doc-from-transcript/) | Transcript → draft doc with a verify-against-source checklist. | `docs-review` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/doc-from-transcript/badge.json) |
| [screenshot-to-steps](prompts/screenshot-to-steps/) | Screenshot descriptions → a redesign-proof written procedure. | `docs-review` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/screenshot-to-steps/badge.json) |
| [localization-prep](prompts/localization-prep/) | Flag idioms and ambiguities that break in translation; suggest rewrites. | `localization` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/localization-prep/badge.json) |
| [skill-file-draft](prompts/skill-file-draft/) | Docs section → SKILL.md draft with two starter eval cases. | `agents` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/skill-file-draft/badge.json) |
| [freshness-triage](prompts/freshness-triage/) | Page + git log + source → which claims are most likely stale, ranked. | `docs-review` | ![evals](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/freshness-triage/badge.json) |

> The badges above render from each prompt's `badge.json`, a
> [shields.io endpoint](https://shields.io/endpoint) file the CI eval run
> regenerates. On GitHub they display through a shields.io endpoint URL; the
> raw JSON is committed so the count never drifts from the last real run.

Browse the same data as a **[marketplace dashboard](https://reem-sab.github.io/tech-writer-prompts/)**,
generated from this repo on every push.

---

## How the evals work

Every prompt ships 3–5 cases in `evals.json`. A case is an input plus an
expectation:

```json
{
  "id": "weak-quickstart-missing-prerequisite",
  "input": { "PAGE": "# Quickstart...\n## Step 2: Add your key\nJust add your key..." },
  "expect": {
    "contains": ["Prerequisite Coverage", "Verification Checkpoints"],
    "regex": ["\\[Severity: (Critical|High|Medium|Low)\\]"]
  }
}
```

Three matcher types:

- **`contains`** — every listed substring must appear in the output. Runs
  offline.
- **`regex`** — every pattern must match (compiled case-insensitively). Runs
  offline.
- **`judge_rubric`** — a natural-language rubric graded by a second model
  call. Runs only under `--judge`; skipped otherwise.

```bash
node runner/dist/cli.js eval agent-readiness            # offline matchers only
node runner/dist/cli.js eval agent-readiness --judge    # includes rubric cases
node runner/dist/cli.js eval --all --judge              # the whole library
```

`eval` writes `evals/results.json` and a shields.io `badge.json` per prompt.
The [evals workflow](.github/workflows/evals.yml) runs `eval --all --judge`
on every push and PR, then commits the results, the badges, and the
dashboard's `prompts.json` — so the numbers on the dashboard and in this
README can never drift from a real run. See
[CONTRIBUTING.md](CONTRIBUTING.md): **no prompt merges without passing
evals.**

---

## Use with Claude Code / Cursor

The whole library loads as a skill. In a coding agent, point it at
[`SKILL.md`](SKILL.md) — it indexes which prompt fits which task and how to
apply one.

You can also install a single prompt as a skill. Each prompt folder has a
generated `SKILL.md`:

```bash
# Claude Code — installs the prompt as a skill it picks up automatically
mkdir -p .claude/skills/audit-page && \
  curl -sL https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/audit-page/SKILL.md \
  -o .claude/skills/audit-page/SKILL.md

# Cursor — drops the prompt into Cursor rules
mkdir -p .cursor/rules && \
  curl -sL https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main/prompts/audit-page/SKILL.md \
  -o .cursor/rules/audit-page.mdc
```

For agents working *inside* this repo, see [AGENTS.md](AGENTS.md).

---

## Repository layout

```
prompts/<slug>/
  prompt.md      the prompt, with YAML frontmatter (see prompts/SCHEMA.md)
  README.md      what it does, inputs, example, limitations
  evals.json     3–5 test cases
  SKILL.md       generated — installable single-prompt skill
  badge.json     generated — shields.io eval badge
runner/          the twp CLI (TypeScript)
site/            static dashboard (build-data.mjs emits prompts.json)
```

## License

[MIT](LICENSE) © 2026 Reem Sabawi.
