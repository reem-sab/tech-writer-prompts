# doc-from-transcript

Drafts a documentation update from an engineering meeting transcript or
Slack thread, tagging every factual claim with a numbered marker tied to a
verify-against-source checklist, so nothing said informally in a meeting
ships as documented fact without someone confirming it first.

## Inputs

| Name | Required | Description |
|---|---|---|
| `TRANSCRIPT` | yes | A meeting transcript or Slack thread discussing a change worth documenting. |

## Example run

```bash
twp run doc-from-transcript --input TRANSCRIPT=./meeting-notes/2026-08-20-webhooks.txt
```

Take the Lumen thread in `evals.json`, where an engineer initially says the
retry limit is 5 attempts, then corrects themselves later in the same
thread to 3 because the team changed it last sprint. The draft states 3
attempts, but the checklist lists both the original claim of 5 attempts and
the correction to 3 as needing verification, because a same-thread
correction is still just someone's memory, not the source.

## Limitations

- Drafts from what people said, not from the implementation. A claim every
  participant in the thread agreed on can still be wrong. The checklist is
  not optional busywork; it is the actual verification step.
- Does not resolve unresolved disagreements in the transcript. It flags
  them for a human to settle rather than picking the more confident-sounding
  speaker.
- Only extracts claims about system behavior. Process discussion, planning,
  and opinions in the transcript are deliberately left out of the draft.
