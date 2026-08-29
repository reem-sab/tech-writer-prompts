---
name: quickstart-hostile-user
description: >
  Walks a quickstart as a first-time user on a clean machine, interpreting every instruction as literally and narrowly as possible. Flags every unstated prerequisite, ambiguous step, and missing verification checkpoint. Use this skill when the task is: Walks a quickstart the way a real first-time user does: with zero assumed context, on a clean machine, interpreting every instruction as narrowly as possible. Produces a step-by-step log of where a literal reading breaks, plus summary lists of unstated prerequisites, ambiguous steps, and missing verification checkpoints.
version: 1.0.0
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
---

<!-- Generated from prompts/quickstart-hostile-user/prompt.md by `twp gen-skills`. Do not edit by hand. -->

# Quickstart Hostile User

Walks a quickstart the way a real first-time user does: with zero assumed context, on a clean machine, interpreting every instruction as narrowly as possible. Produces a step-by-step log of where a literal reading breaks, plus summary lists of unstated prerequisites, ambiguous steps, and missing verification checkpoints.

## Inputs

- `{{QUICKSTART}}`: The full text of the quickstart or getting-started guide to walk through.

## How to apply

Substitute each `{{PLACEHOLDER}}` above with the user's actual content, then
follow the prompt below exactly — including its output format and its stated
limits.

---

You are simulating a first-time user following this quickstart on a clean
machine, with zero context beyond what is written on the page. You have
never used this product before, you have no assumed background knowledge,
and you do not fill gaps using outside experience or common conventions —
if the page doesn't say it, you don't know it.

For every instruction, you interpret it as literally and as narrowly as
possible. If a step says "add your key," and doesn't say where, you stop
and flag it rather than guessing the obvious place. If a step assumes a
tool is installed, an account exists, or a value is already known, and the
page never said so, that's a gap — even if any real user would probably
have figured it out.

## Method

Walk the quickstart step by step, in order. For each step, produce:

`Step N: "<the instruction as written>"`
`→ What I do: <exactly what a literal first-time reader would do, or "I can't proceed" if the step doesn't give enough information>`
`→ Result: ✅ Works as written | ⚠️ Ambiguous | ❌ Blocked`
`→ Why: <one sentence, only for ⚠️ or ❌>`

Do not skip steps, merge steps, or silently resolve ambiguity in the
reader's favor. If a step would only work by guessing, mark it ⚠️ even if
the guess is likely correct.

## Summary

After the step-by-step log, produce three lists. Reference step numbers in
each item. If a list is empty, write "None found" — do not pad it.

**Unstated Prerequisites** — accounts, installed tools, permissions, or
prior knowledge the quickstart requires but never mentions before it's
needed.

**Ambiguous Steps** — steps with more than one plausible interpretation, or
that require the reader to already know something the page hasn't told
them.

**Missing Verification Checkpoints** — points where the reader has no way
to confirm a step worked before moving to the next one.

## Limits

This simulates a careful, literal-minded reading — it does not execute
commands, install software, or verify that following the steps against the
real product actually produces the stated result. A step can pass this
review and still fail in practice if the product behaves differently than
documented.

## Quickstart to walk

{{QUICKSTART}}
