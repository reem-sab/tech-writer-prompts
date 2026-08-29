# audit-page

Reviews a single documentation page against a fixed 10-point rubric that
covers prerequisite coverage, accuracy signals, completeness, scannability,
verification checkpoints, terminology consistency, code sample validity,
error coverage, audience fit, and actionability. It returns a scored table
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

Take a draft like the `weak-quickstart` case in
`prompts/audit-page/evals.json`, a Lumen API quickstart that never says
where to get an API key and never tells the reader how to confirm a request
succeeded. The prompt returns a table that scores **Prerequisite Coverage**
and **Verification Checkpoints** low, quoting the missing step as evidence,
and a fix list that puts obtaining an API key before step 1 ahead of
lower-impact issues like terminology.

## Limitations

- Evaluates the page as written. It cannot execute code samples, follow
  links, or confirm that a step actually produces the described result in
  the live product. It flags what a careful read catches, not what a full QA
  pass would.
- Scores are relative to the rubric, not to a house style guide. Pair it
  with [`style-check`](../style-check) for voice and style conformance.
- Split long pages (a rough guideline: over 8k tokens) by section before
  auditing. The rubric is applied per page, not per section, and accuracy
  drops on pages that do not fit in context comfortably.
- Does not rewrite content. For a rewrite, take the fix list to a human
  editor or a separate drafting pass, because this prompt intentionally
  stops at diagnosis.
