---
name: doc-from-transcript
description: >
  Drafts documentation updates from an engineering meeting transcript or Slack thread, with a "verify against source" checklist attached to every factual claim so nothing informal ships as fact unreviewed. Use this skill when the task is: Drafts a documentation update from an engineering meeting transcript or Slack thread, tagging every factual claim with a numbered marker tied to a "verify against source" checklist — so nothing said informally in a meeting ships as documented fact without someone confirming it first.
version: 1.0.0
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
---

<!-- Generated from prompts/doc-from-transcript/prompt.md by `twp gen-skills`. Do not edit by hand. -->

# Doc From Transcript

Drafts a documentation update from an engineering meeting transcript or Slack thread, tagging every factual claim with a numbered marker tied to a "verify against source" checklist — so nothing said informally in a meeting ships as documented fact without someone confirming it first.

## Inputs

- `{{TRANSCRIPT}}`: A meeting transcript or Slack thread discussing a change worth documenting.

## How to apply

Substitute each `{{PLACEHOLDER}}` above with the user's actual content, then
follow the prompt below exactly — including its output format and its stated
limits.

---

You are drafting a documentation update from TRANSCRIPT — a meeting
transcript or Slack thread where engineers discussed a change. Nothing said
in a meeting is documentation-grade until someone verifies it against the
actual implementation; your job is to produce a draft plus an explicit list
of exactly what needs that verification.

## Handling the transcript

- Extract only claims about what the system does, will do, or now does
  differently — not opinions, small talk, or process discussion ("let's
  sync next week" isn't documentation content).
- If someone states something and a later message in the same transcript
  corrects or contradicts it, use the corrected version in the draft — but
  list both the original and the correction in the checklist, since a
  correction stated in a meeting is still unverified.
- If two participants disagree and the thread doesn't resolve which is
  right, don't pick a side in the draft — flag the disagreement itself as
  an item needing verification instead of drafting either claim as fact.
- Every factual claim in the draft gets a numbered marker (`[1]`, `[2]`, …)
  linking it to its checklist entry.

## Output format

```
## Drafted doc update

<the documentation content itself, written as if for publication, with
each factual claim tagged with a [N] marker>

## Verify against source

| # | Claim | Said By | Why it needs verification |
|---|---|---|---|
```

One checklist row per numbered marker, in order. `Why it needs
verification` should be specific: "stated once, no confirmation in
thread," "contradicts an earlier message from the same person," "the two
participants disagreed and never resolved it," etc. — not a generic "please
verify."

## Limits

This drafts from what people said, not from the code — even a claim
several participants agree on in the transcript can still be wrong. Treat
every row in the checklist as required, not optional, before publishing;
this prompt cannot tell you which claims are actually correct, only which
ones it has no independent way to confirm.

## Transcript

{{TRANSCRIPT}}
