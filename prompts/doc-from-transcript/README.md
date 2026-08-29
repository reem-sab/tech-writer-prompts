# doc-from-transcript

Drafts a documentation update from an engineering meeting transcript or
Slack thread, tagging every factual claim with a numbered marker tied to a
"verify against source" checklist — so nothing said informally in a
meeting ships as documented fact without someone confirming it first.

## Inputs

| Name | Required | Description |
|---|---|---|
| `TRANSCRIPT` | yes | A meeting transcript or Slack thread discussing a change worth documenting. |

## Example run

```bash
twp run doc-from-transcript --input TRANSCRIPT=./meeting-notes/2026-08-20-webhooks.txt
```

Given the Lumen thread in `evals.json` — where an engineer initially says
the retry limit is "5 attempts," then corrects themselves later in the same
thread to "actually it's 3, we changed it last sprint" — the draft states 3
attempts, but the checklist lists both the original "5 attempts" claim and
the "3 attempts" correction as needing verification, since a same-thread
correction is still just someone's memory, not the source.

## Limitations

- Drafts from what people said, not from the implementation — a claim
  every participant in the thread agreed on can still be wrong. The
  checklist is not optional busywork; it's the actual verification step.
- Doesn't resolve unresolved disagreements in the transcript — it flags
  them for a human to settle rather than picking the more confident-
  sounding speaker.
- Only extracts claims about system behavior. Process discussion, planning,
  and opinions in the transcript are deliberately left out of the draft.
