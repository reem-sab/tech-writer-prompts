---
name: Doc From Transcript
version: 1.0.0
description: >
  Drafts documentation updates from an engineering meeting transcript or
  Slack thread, with a "verify against source" checklist attached to every
  factual claim so nothing informal ships as fact unreviewed.
inputs:
  TRANSCRIPT:
    description: A meeting transcript or Slack thread discussing a change worth documenting.
    required: true
model_notes: >
  Transcripts are conversational and often self-correcting -- someone
  states something, then someone else corrects it later in the thread.
  This prompt is instructed to use the corrected version in the draft
  while still flagging the original claim in the checklist, since the
  correction itself might be wrong too.
tags:
  - docs-review
tested_with:
  - model: claude-sonnet-5
    date: 2026-08-29
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
example_output: |
  ## Drafted doc update
  Lumen retries a failed webhook delivery up to 3 times [1] with exponential backoff.

  ## Verify against source
  | # | Claim | Said By | Why it needs verification |
  |---|---|---|---|
  | 1 | 3 retry attempts | Priya | Corrected from "5" mid-thread; correction still unverified. |
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
