---
name: tech-writer-prompts
description: >
  A tested library of 15 prompts for technical-writing tasks: auditing docs
  pages, walking quickstarts as a hostile first-time user, building error
  catalogs, drafting API references from OpenAPI specs, writing release
  notes, extracting glossaries, style-checking, rating pages for agent
  readers, Diataxis classification, IA review, drafting docs from
  transcripts, converting screenshots to procedures, localization prep,
  drafting SKILL.md files, and freshness triage. Use this skill when the
  user asks to review, audit, draft, or improve technical documentation and
  a specialized, tested prompt would do better than an ad-hoc one.
---

# tech-writer-prompts

This repository is a library of prompts for technical writers, each one
versioned, documented, and tested with evals. When a documentation task
matches one of the prompts below, load that prompt's `prompt.md`, fill in
its inputs, and apply it — rather than improvising.

## How to use a prompt

1. Pick the prompt whose purpose matches the task (see the index below).
2. Read `prompts/<slug>/prompt.md`. Everything after the YAML frontmatter
   is the prompt body.
3. Substitute the `{{PLACEHOLDER}}` tokens with the user's actual content.
   The frontmatter's `inputs` map documents what each placeholder expects.
4. Produce output in exactly the structure the prompt specifies — these
   prompts define strict output formats on purpose, and the evals check
   for them.
5. Honor the prompt's stated **Limits** section. Every prompt is explicit
   about what it can't do; don't present its output as more authoritative
   than the prompt itself claims to be.

## When NOT to use a prompt here

If the task is genuinely one-off and none of these prompts fits, write a
purpose-built prompt instead of forcing a near-match. These are specialized
tools, not a general docs-assistant.

## The prompts

| Slug | Use it when the user wants to... |
|---|---|
| `audit-page` | Review a docs page against a 10-point quality rubric and get a prioritized fix list. |
| `quickstart-hostile-user` | Find every unstated prerequisite and ambiguous step in a quickstart by walking it as a literal first-time user. |
| `error-catalog` | Turn raw error codes/strings into a troubleshooting table plus agent-readable JSON. |
| `api-ref-skeleton` | Draft an API reference page from an OpenAPI spec, with TODOs where the spec is silent. |
| `release-notes` | Turn a commit list or changelog into customer-facing notes grouped by impact. |
| `glossary-extract` | Find domain terms used but never defined across a set of pages. |
| `style-check` | Apply a style guide to a draft as a list of violations, without rewriting/flattening voice. |
| `agent-readiness` | Rate a page for how safely an autonomous agent could act on it directly. |
| `diataxis-classify` | Identify a page's Diataxis mode, where it mixes modes, and how to split it. |
| `ia-review` | Review a nav/sidebar structure for orphans, duplicate scopes, and missing landing pages. |
| `doc-from-transcript` | Draft docs from a meeting transcript or Slack thread, with a verify-against-source checklist. |
| `screenshot-to-steps` | Convert screenshot/recording descriptions into a redesign-proof written procedure. |
| `localization-prep` | Flag idioms, cultural references, and ambiguous antecedents that break in translation. |
| `skill-file-draft` | Draft a SKILL.md (with two starter eval cases) from a docs section. |
| `freshness-triage` | Rank which claims on a page are most likely stale, using its git log and current source. |

## Running the evals (optional)

The library ships a runner. From the repo root, with `ANTHROPIC_API_KEY`
set:

```bash
npm install && npm run build
node runner/dist/cli.js eval <slug>          # one prompt
node runner/dist/cli.js eval --all --judge   # everything, including rubric cases
```

You don't need to run evals to use a prompt — they're the library's
guarantee that each prompt still does what its docs claim.
