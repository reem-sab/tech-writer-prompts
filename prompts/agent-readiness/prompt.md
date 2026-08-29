---
name: Agent Readiness
version: 1.0.0
description: >
  Rates a documentation page for machine readers, flagging ambiguous
  pronouns, steps that depend on unstated context, missing structure, and
  claims an agent would execute wrongly, then returns an overall score with
  specific fixes.
inputs:
  PAGE:
    description: The documentation page to rate for agent readiness.
    required: true
model_notes: >
  Written for pages that coding agents or automation are expected to read
  and act on directly (setup guides, CLI references, runbooks) rather than
  pages meant purely for human judgment calls.
tags:
  - agents
tested_with:
  - model: claude-sonnet-5
    date: 2026-08-29
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
featured_month: 2026-08
featured_note: >
  The prompt to reach for as agents start reading your docs and acting on
  them unsupervised. It catches the exact gap between "a human would figure
  this out" and "an agent will guess wrong" — underspecified deletes,
  ambiguous pronouns, steps that assume context the page never states.
example_output: |
  Agent Readiness: 4/10 — two dangerous underspecified actions dominate the score.

  [Dangerous underspecified claim] "revoke the old key" — an agent can't tell
  which key or how; it may revoke the wrong one.

  Fixes
  1. Change "revoke the old key" to "In Settings → API Keys, click Revoke next
     to the key you replaced" — resolves dangerous underspecified claim.
---

You are rating how safely an autonomous agent (not a human) could read this
page and act on it directly — running commands, editing files, calling
APIs — without a human in the loop to catch a misreading.

## Checks

Go through PAGE looking for each of these failure modes. For each instance
found, quote the exact text.

1. **Ambiguous pronouns/references** — "it," "this," "that config" where
   more than one plausible referent exists nearby. An agent will pick one;
   you're checking whether it could pick wrong.
2. **Context-dependent steps** — a step that only makes sense if the reader
   already has state the page never established (a variable value, a
   working directory, a prior step's output) and doesn't say so.
3. **Missing structure** — instructions buried in prose paragraphs instead
   of numbered steps or code blocks, where an agent parsing for actions
   would have to infer step boundaries.
4. **Dangerous underspecified claims** — an instruction phrased as an
   executable action but missing a detail that changes its blast radius
   ("delete the old key" without which key, "run the migration" without
   which environment) — the kind of gap a careful human fills with
   judgment that an agent won't have.
5. **Non-determinism** — a step with genuinely more than one valid reading,
   where different correct-sounding interpretations lead to different
   outcomes.

## Output format

### Score

`Agent Readiness: N/10` — one sentence justifying the number by referencing
how many and how severe the findings below are. A page with zero findings
scores 10; each finding lowers the score roughly in proportion to its
blast radius, not just its count (one dangerous underspecified delete
outweighs three ambiguous pronouns).

### Findings

One entry per instance found, grouped by check category, in this shape:

`[<category>] "<quoted text>" — <why this would cause an agent to act incorrectly, and what it might do instead>`

If a category has no instances, omit it — do not list categories with
nothing found.

### Fixes

A numbered list of concrete rewrites, one per finding, ordered by blast
radius (most dangerous first):

`N. Change "<quoted text>" to "<specific fix>" — resolves <category>`

## Limits

This evaluates how an agent would likely parse the text — it does not run
an actual agent against the page, so it can't guarantee a specific model
would misread a given passage, only that the passage has more than one
reasonable reading. Treat findings as risk flags to close, not proof of an
actual failure.

## Page to rate

{{PAGE}}
