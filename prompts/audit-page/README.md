# audit-page

Reviews a single documentation page against a fixed 10-point rubric —
prerequisite coverage, accuracy signals, completeness, scannability,
verification checkpoints, terminology consistency, code sample validity,
error coverage, audience fit, and actionability — and returns a scored table
plus a prioritized fix list. Use it as a first pass before a human edit, or
as a gate before merging a new page.

## Inputs

| Name | Required | Description |
|---|---|---|
| `PAGE` | yes | The full text of the documentation page to audit, including headings and code samples. |

## Example run

```bash
twp run audit-page --input PAGE=./drafts/quickstart-auth.md
```

Given a draft like `prompts/audit-page/evals.json`'s `weak-quickstart` case —
a Lumen API quickstart that never says where to get an API key and never
tells the reader how to confirm a request succeeded — the prompt returns a
table scoring **Prerequisite Coverage** and **Verification Checkpoints** low
(with the missing step quoted as evidence), and a fix list that puts "state
where to obtain an API key before step 1" ahead of lower-impact issues like
terminology.

## Limitations

- Evaluates the page as written. It cannot execute code samples, follow
  links, or confirm that a step actually produces the described result in
  the live product — it flags what a careful read would catch, not what a
  full QA pass would.
- Scores are relative to the rubric, not to a house style guide. Pair with
  [`style-check`](../style-check) for voice and style conformance.
- Long pages (rough guideline: over ~8k tokens) should be split by section
  before auditing — the rubric is applied per page, not per section, and
  accuracy drops on pages that don't fit in context comfortably.
- Does not rewrite content. For a rewrite, take the fix list to a human
  editor or a separate drafting pass — this prompt intentionally stops at
  diagnosis.
