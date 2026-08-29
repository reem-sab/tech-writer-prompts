# style-check

Checks a draft against a style guide and reports violations as a numbered,
diff-style list, giving the quoted span, the rule violated, and a minimal
fix, without rewriting the piece. Run it before a human edit, not instead
of one: the output is something an author reviews and applies themselves,
which keeps their voice intact.

## Inputs

| Name | Required | Description |
|---|---|---|
| `DRAFT` | yes | The draft text to check. |
| `STYLE_GUIDE` | yes | The style guide rules to apply (prose, a list of rules, or both). |

## Example run

```bash
twp run style-check --input DRAFT=./draft.md --input STYLE_GUIDE=./style-guide.md
```

Take the Lumen style guide in `evals.json` (second person, no Latin
abbreviations, and the product name is `Lumen`, not `the Lumen API`, after
first mention) checked against a draft that uses `e.g.` and refers to
`the Lumen API` five times after its first mention. The output flags each
Latin abbreviation and each redundant repetition of `the Lumen API`
individually, with a minimal fix for each, and does not rewrite the
surrounding sentences.

## Limitations

- Only enforces what is explicitly in `STYLE_GUIDE`. It is not a general
  proofreader, so grammar and factual issues outside the scope of the guide
  are not flagged, by design.
- A vague or self-contradictory style guide produces vague or inconsistent
  results. If the output looks unreliable, tighten the guide before
  assuming the prompt is at fault.
- Deliberately does not rewrite. If you want a full pass into house style,
  that is a different and riskier task. This one exists specifically to
  avoid flattening voice.
