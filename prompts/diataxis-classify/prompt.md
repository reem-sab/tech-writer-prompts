---
name: Diataxis Classify
version: 1.0.0
description: >
  Identifies whether a page is trying to be a tutorial, how-to guide,
  reference, or explanation (per the Diataxis framework), flags where it
  mixes modes, and proposes how to split it into one page per mode.
inputs:
  PAGE:
    description: The documentation page to classify.
    required: true
model_notes: >
  Assumes familiarity with the Diataxis framework's four modes as defined
  in the prompt body. A page can legitimately be pure reference with a
  short explanatory aside -- the bar for "mixed" is a passage that would
  need to move to a different page to serve its mode well, not any
  deviation at all.
tags:
  - ia
  - docs-review
tested_with:
  - model: claude-sonnet-5
    date: 2026-08-29
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
example_output: |
  ## Primary mode: How-to guide
  Numbered steps to accomplish one task (set up a webhook subscription).

  ## Mixed-in passages
  "Lumen uses at-least-once delivery semantics..." — belongs in [Explanation].

  ## Proposed split
  - Set Up a Webhook Subscription (how-to) — the numbered steps.
  - How Lumen Delivers Webhooks (explanation) — the delivery-semantics rationale.
---

You are classifying a documentation page against the Diataxis framework's
four modes:

- **Tutorial** — learning-oriented. A guided lesson for a beginner, taking
  them through a complete experience step by step. Success is "the reader
  learned something by doing it," not "the reader accomplished a specific
  real task."
- **How-to guide** — task-oriented. Steps to accomplish a specific goal,
  written for someone who already has the basics and wants to get
  something done. Assumes competence; skips explaining why.
- **Reference** — information-oriented. Dry, structured, complete
  description of the system (parameters, options, behavior) — describes,
  doesn't guide or persuade.
- **Explanation** — understanding-oriented. Discussion of concepts, design
  decisions, and the "why" behind the system. Doesn't tell the reader to do
  anything.

## Method

1. Determine the page's primary mode from its overall structure and intent
   — what is it actually trying to help the reader do?
2. Scan for passages that belong to a different mode than the primary one.
   A passage counts as "mixed in" only if it would genuinely serve the
   reader better on a separate page written for that mode — not every
   aside or one-sentence rationale is a violation. A how-to guide with one
   sentence of "why" for a non-obvious step is fine; three paragraphs of
   conceptual explanation embedded in the middle of numbered steps is not.
3. For each mixed-in passage, name which mode it actually belongs to and
   quote it.

## Output format

```
## Primary mode: <Tutorial | How-to guide | Reference | Explanation>

<2-3 sentences of evidence: what about the page's structure and intent
support this classification.>

## Mixed-in passages

<for each: "<quoted passage>" — belongs in [<mode>], because <reason>.
If none, write "This page stays in its primary mode throughout.">

## Proposed split

<if there are mixed-in passages: one entry per resulting page --
title, mode, one-sentence purpose, and which content from the original
moves there. If there are no mixed-in passages, write "No split needed."
>
```

## Limits

This classifies structure and intent as written — it doesn't know whether
splitting the page is worth the maintenance cost for a given team, or
whether readers actually navigate this documentation set in a way that
would benefit from the split. Treat the proposed split as a starting point
for an information-architecture decision, not a mandate.

## Page to classify

{{PAGE}}
