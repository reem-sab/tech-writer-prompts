# Prompt frontmatter schema

Every `prompts/<slug>/prompt.md` starts with a YAML frontmatter block. This is
the contract the runner, the evals, and the dashboard all read — a prompt that
doesn't match this schema fails validation (`twp lint`, run automatically by
`twp eval`).

```yaml
---
name: Audit Page
version: 1.0.0
description: >
  Reviews a documentation page against a 10-point rubric covering accuracy
  signals, completeness, scannability, and prerequisite gaps.
inputs:
  PAGE:
    description: The full text of the documentation page to audit, including headings.
    required: true
model_notes: >
  Written for long-context, instruction-following models. Works best when the
  page is under ~8k tokens; for longer pages, split by section.
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
  | 1 | Prerequisite Coverage | 2 | Step 2 never says where to get a key. |
featured_month: 2026-08          # optional
featured_note: Why this is the pick this month.   # optional
---
```

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Human-readable title, shown on dashboard cards. |
| `version` | string | yes | [Semver](https://semver.org). Bump on any change to the prompt body — evals should be re-run and, if behavior changed, `tested_with` updated. |
| `description` | string | yes | One or two sentences. The dashboard also shows the first paragraph of `README.md`, so keep this to a summary, not the full pitch. |
| `inputs` | map of `NAME -> { description, required }` | yes | Keys are the exact placeholder tokens used in the prompt body, written in the body as `{{NAME}}`. `required` defaults to `true` if omitted. The dashboard renders these as an ordered inputs table. |
| `model_notes` | string | no | Caveats about model choice, context length, or known failure modes. |
| `tags` | string[] | yes | **Must be drawn from the controlled vocabulary below.** `tags[0]` drives the card's accent color on the dashboard. |
| `tested_with` | array of `{ model, date }` | yes | One entry per model this prompt's evals have been run and passed against. `date` is `YYYY-MM-DD`. |
| `author` | `{ name, url }` | no | Defaults to `{ name: "Reem Sabawi", url: "https://github.com/reem-sab" }` when omitted. Contributors: set this to get credit on the dashboard card. |
| `example_output` | string | no | A short, pre-formatted snippet of real output, shown in the dashboard's detail overlay. Newlines are preserved — author it as a YAML `|` block scalar. |
| `featured_month` | `YYYY-MM` | no | "Prompt of the Month" flag. The prompt with the greatest `featured_month` becomes the featured card on the dashboard. |
| `featured_note` | string | no | The editorial reason for the pick. Only meaningful alongside `featured_month`. |

## Controlled tag vocabulary

`tags` must be a subset of these seven values, in any order:

```
docs-review   api   agents   release   localization   style   ia
```

This is enforced by the schema — a tag outside this set fails `twp lint`. The
dashboard only has an accent hue and a filter pill for these seven; an
arbitrary tag would render as a broken-color, unfilterable chip. Adding a
new tag therefore means adding it **both** here (and in
[`runner/src/schema.ts`](../runner/src/schema.ts)'s `TAG_VOCABULARY`) **and**
as a hue in the dashboard's design tokens — the two are coupled on purpose.

## Placeholders

Input placeholders in the prompt body are written `{{LIKE_THIS}}` — uppercase
snake_case, matching a key in `inputs`. The runner substitutes them verbatim
(no escaping, no partial matches) when you run `twp run <slug> --input NAME=value`.
A prompt.md with a `{{PLACEHOLDER}}` not declared in `inputs` (or vice versa)
fails lint.

## Enforcement

The authoritative version of this schema is the Zod schema in
[`runner/src/schema.ts`](../runner/src/schema.ts). This document is the
human-readable mirror of it — if they disagree, the code wins and this file
has a bug.
