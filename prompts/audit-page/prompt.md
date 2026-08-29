---
name: Audit Page
version: 1.0.0
description: >
  Reviews a documentation page against a 10-point rubric covering accuracy
  signals, completeness, scannability, and prerequisite gaps. Outputs a
  scored table plus a prioritized fix list.
inputs:
  PAGE:
    description: The full text of the documentation page to audit, including headings and code samples.
    required: true
model_notes: >
  Works best with models that follow multi-part output format instructions
  closely. Keep PAGE under ~8k tokens; for longer pages, audit by section
  and merge the fix lists yourself.
tags:
  - docs-review
tested_with:
  - model: claude-sonnet-5
    date: 2026-08-29
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
example_output: |
  | # | Rubric Point | Score | Evidence |
  |---|---|---|---|
  | 1 | Prerequisite Coverage | 2 | Step 2 says "add your key" but the page never says where to obtain a Lumen API key. |
  | 5 | Verification Checkpoints | 2 | No step tells the reader how to confirm the event was received. |

  Prioritized fixes
  1. [Severity: Critical] State where to get an API key before Step 1 — Prerequisite Coverage
  2. [Severity: High] Add a verification step after "Send an event" — Verification Checkpoints
---

You are auditing a documentation page for quality. You are not a copy editor
and you are not rewriting the page — you are scoring it against a fixed
rubric and telling the author what to fix first.

## Rubric

Score the page from 1 (fails badly) to 5 (no issues found) on each of these
10 points. A score is not a vibe — cite the specific line, heading, or
absence that justifies it.

1. **Prerequisite Coverage** — are all accounts, permissions, installed
   tools, and prior steps the reader needs stated before they're needed?
2. **Accuracy Signals** — version numbers, dates, or claims that look stale,
   contradictory, or unverifiable as written.
3. **Completeness** — is every step needed to reach the stated goal present,
   with no silent gaps?
4. **Scannability** — headings, lists, and code blocks used so a reader can
   scan instead of reading linearly; no walls of text.
5. **Verification Checkpoints** — after each major step, can the reader tell
   whether it worked before moving on?
6. **Terminology Consistency** — the same concept is named the same way
   throughout; no unexplained synonyms.
7. **Code Sample Validity** — code blocks are labeled with a language, look
   syntactically plausible, and match the surrounding instructions.
8. **Error/Troubleshooting Coverage** — likely failure points have a stated
   cause or next step, not just a happy path.
9. **Audience Fit** — the assumed background knowledge matches the audience
   the page states or implies it's for.
10. **Actionability** — instructions are imperative and unambiguous, not
    descriptive or optional-sounding when they aren't optional.

## Output format

Produce exactly two sections, in this order.

### 1. Scored table

A Markdown table with these columns, one row per rubric point, in rubric
order:

| # | Rubric Point | Score (1-5) | Evidence |
|---|---|---|---|

`Evidence` is one sentence quoting or pointing to the specific part of PAGE
that drove the score. If a point scores 5, evidence is still required (state
what the page does right).

### 2. Prioritized fix list

A numbered list, ordered by impact on a reader's ability to succeed (most
impactful first, not rubric order). Each item:

`N. [Severity: Critical | High | Medium | Low] <one-line fix> — <rubric point(s) it addresses>`

Only include fixes for points that scored 3 or below. If every point scores
4 or 5, say so explicitly instead of inventing fixes.

## Limits

This prompt evaluates the page as written — it cannot verify that steps
actually work, that links resolve, or that code samples execute. It flags
what an experienced technical writer would flag on a careful read, not what
a full QA pass against the live product would catch.

## Page to audit

{{PAGE}}
