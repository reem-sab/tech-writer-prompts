---
name: Glossary Extract
version: 1.0.0
description: >
  Scans a set of pages for domain-specific terms that are used but never
  defined anywhere in them, ranks them by frequency, and drafts a
  definition for each from context, to review before publishing.
inputs:
  PAGES:
    description: >
      One or more documentation pages, concatenated. If from multiple
      files, separate them with a line like "--- <filename> ---" so the
      output can cite where each term first appears.
    required: true
model_notes: >
  Drafted definitions are inferred from usage context alone, not from
  outside knowledge of the product -- they are a starting point for a
  human who knows the product, not a publishable glossary entry.
tags:
  - docs-review
tested_with:
  - model: claude-sonnet-5
    date: 2026-08-29
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
example_output: |
  | Term | Frequency | First Appears In | Drafted Definition (verify before publishing) |
  |---|---|---|---|
  | subscription | 6 | webhooks.md | A standing request to receive events matching a filter. |
  | delivery attempt | 5 | webhooks.md | A single try at POSTing an event to a subscription's URL. |
---

You are building a glossary by finding the gaps in one: every domain-
specific term used across PAGES that is never explicitly defined anywhere
in them.

## What counts as a term

A domain-specific noun, acronym, or short phrase specific to this product
or its problem space — not a common English word, not a generic software
term every reader already knows (`API`, `endpoint`, `JSON` don't count
unless PAGES uses them in a specific, non-standard way). If in doubt
whether a reader outside this product would already know the term, it
probably doesn't belong in the glossary.

## What counts as "defined"

The term is used with an explicit definition somewhere in PAGES — a
sentence that states what it is, not just a sentence that uses it in
context. "A subscription is a standing request to receive events matching
a filter" is a definition. Five sentences that each use "subscription" in
a different code sample are not.

If a term is defined once but used many more times, it does not belong in
the output — it only qualifies if it is undefined everywhere it appears.

## Method

1. Scan PAGES for candidate terms.
2. For each candidate, check every occurrence — if none of them define it,
   it's undefined.
3. Count occurrences (frequency) and note where it first appears.
4. Draft a definition using only what context across PAGES implies about
   the term — do not use outside knowledge of what a term like this
   "usually" means in other products.

## Output format

A single table, ranked by frequency descending:

| Term | Frequency | First Appears In | Drafted Definition (verify before publishing) |
|---|---|---|---|

If PAGES defines every domain term it uses, output exactly: `No undefined
terms found.` instead of an empty table.

## Limits

Drafted definitions are inferred from how the term is used across PAGES,
not from authoritative knowledge of the product — treat every one as a
draft that needs a person who knows the product to confirm or correct
before it goes into a real glossary. This also can't catch a term that's
defined in a page outside what you provided as PAGES.

## Pages to scan

{{PAGES}}
