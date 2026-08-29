---
name: release-notes
description: >
  Turns a commit list or internal changelog into customer-facing release notes grouped by impact (breaking, new, and fixed), with a one-line summary a support team could paste straight into a ticket. Use this skill when the task is: Turns a raw commit list or internal changelog into customer-facing release notes grouped into Breaking Changes, New, and Fixed, plus a one-line support-team summary you can paste straight into a ticket reply.
version: 1.0.0
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
---

<!-- Generated from prompts/release-notes/prompt.md by `twp gen-skills`. Do not edit by hand. -->

# Release Notes

Turns a raw commit list or internal changelog into customer-facing release notes grouped into Breaking Changes, New, and Fixed, plus a one-line support-team summary you can paste straight into a ticket reply.

## Inputs

- `{{CHANGES}}`: A commit list, PR titles, or an internal changelog for the release.

## How to apply

Substitute each `{{PLACEHOLDER}}` above with the user's actual content, then
follow the prompt below exactly — including its output format and its stated
limits.

---

You are turning an internal commit list or changelog into release notes for
customers, written from the perspective of someone using the product — not
someone who wrote the code. Translate implementation language into effect
language: not "refactored the rate limiter," but what a user of the API
would actually notice, if anything.

If a change has no user-visible effect (internal refactors, test-only
changes, dependency bumps with no behavior change), leave it out of the
notes entirely — don't manufacture a customer-facing line for something no
customer would notice. It's fine for the notes to be shorter than the input
list.

## Grouping

Sort every user-visible change into exactly one of these three groups:

- **Breaking Changes** — anything that requires the customer to change
  their own code, config, or integration to keep working.
- **New** — new capability that wasn't possible before.
- **Fixed** — previously broken or incorrect behavior that now works as
  documented.

If a change is ambiguous between New and Fixed (e.g. a bug fix that also
changes behavior customers may have relied on), put it under Breaking
Changes instead — when in doubt, over-warn rather than under-warn.

## Output format

```
## Support summary

<one sentence, written so a support agent could paste it directly into a
reply to a customer asking "what changed in this release." State the
single most impactful thing in this release, or "No customer-facing
changes in this release." if the notes are empty.>

## Breaking Changes

- <item, or "None in this release.">

## New

- <item, or "None in this release.">

## Fixed

- <item, or "None in this release.">
```

Each item is one line: what changed, from the customer's point of view,
phrased as a statement of fact (not "we improved X" — "X now does Y").

## Limits

Notes are written from the commit list or changelog text alone — this
prompt does not read the actual diff, so a commit message that
mischaracterizes its own change (or omits a side effect) will produce
release notes with the same gap. Have an engineer who worked on the release
skim the output before publishing.

## Changes for this release

{{CHANGES}}
