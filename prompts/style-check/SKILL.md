---
name: style-check
description: >
  Applies a style guide to a draft without flattening the author's voice. Outputs a diff-style list of specific violations with minimal targeted fixes -- never a full rewrite. Use this skill when the task is: Checks a draft against a style guide and reports violations as a numbered, diff-style list — quoted span, rule violated, minimal fix — without rewriting the piece. Built to be run before a human edit, not instead of one: the output is something an author reviews and applies themselves, which keeps their voice intact.
version: 1.0.0
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
---

<!-- Generated from prompts/style-check/prompt.md by `twp gen-skills`. Do not edit by hand. -->

# Style Check

Checks a draft against a style guide and reports violations as a numbered, diff-style list — quoted span, rule violated, minimal fix — without rewriting the piece. Built to be run before a human edit, not instead of one: the output is something an author reviews and applies themselves, which keeps their voice intact.

## Inputs

- `{{DRAFT}}`: The draft text to check.
- `{{STYLE_GUIDE}}`: The style guide rules to apply (prose, a list of rules, or both).

## How to apply

Substitute each `{{PLACEHOLDER}}` above with the user's actual content, then
follow the prompt below exactly — including its output format and its stated
limits.

---

You are checking DRAFT against STYLE_GUIDE. You are not an editor rewriting
the piece — you are a linter reporting violations for the author to fix
themselves. The author's voice, sentence rhythm, and word choices that
aren't covered by STYLE_GUIDE are not your concern and must not change.

## Rules

- Only flag things STYLE_GUIDE actually says something about. If
  STYLE_GUIDE doesn't mention passive voice, don't flag passive voice, even
  if you personally would.
- Quote the smallest span of text that contains the violation — a phrase or
  clause, not the whole paragraph it's in.
- Propose the smallest possible fix that resolves the violation — a word
  swap or a small rephrase, not a rewritten sentence. If the smallest fix
  would require rewriting the whole sentence to satisfy the rule, say so
  explicitly instead of doing it.
- Never propose a fix for something STYLE_GUIDE doesn't cover, even to
  "improve" the writing. That's out of scope for this pass.
- If DRAFT has zero violations, say so — don't invent minor nitpicks to
  have something to report.

## Output format

A numbered list, one entry per violation, in the order they appear in
DRAFT:

```
N. Found: "<exact quoted span from DRAFT>"
   Rule: <the specific STYLE_GUIDE rule this violates, quoted or closely
   paraphrased>
   Fix: "<the smallest edit that resolves it>" (or: "Requires a full
   sentence rewrite to satisfy this rule — flagging for the author rather
   than rewriting.")
```

If there are no violations, output exactly: `No style guide violations
found.`

## Limits

This only catches what STYLE_GUIDE explicitly states — it is not a general
proofreader and will not flag grammar, factual errors, or awkward phrasing
outside the guide's scope. A style guide with vague or contradictory rules
will produce vague or inconsistent flags; the fix for that is a clearer
style guide, not a smarter reading of an unclear one.

## Style guide

{{STYLE_GUIDE}}

## Draft to check

{{DRAFT}}
