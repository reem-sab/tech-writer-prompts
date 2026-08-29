# quickstart-hostile-user

Walks a quickstart the way a real first-time user does: with zero
assumed context, on a clean machine, interpreting every instruction as
narrowly as possible. Produces a step-by-step log of where a literal
reading breaks, plus summary lists of unstated prerequisites, ambiguous
steps, and missing verification checkpoints.

This is the single highest-leverage prompt in this library for catching
the onboarding failures that cost the most support tickets — the ones
where the writer knew the missing piece so well they forgot to write it
down.

## Inputs

| Name | Required | Description |
|---|---|---|
| `QUICKSTART` | yes | The full text of the quickstart or getting-started guide to walk through. |

## Example run

```bash
twp run quickstart-hostile-user --input QUICKSTART=./docs/quickstart.md
```

Run against the Lumen API quickstart in `evals.json` (the one that says
"just add your key to the header" without naming the header, and never
says where the key comes from), the output flags Step 1 as blocked
("no mention of a Lumen account or dashboard — I have nothing to install
the SDK against") and Step 2 as ambiguous ("header" is never named, and the
code sample right below it passes the key as a constructor argument, not a
header — these two instructions conflict).

## Limitations

- This is a reading exercise, not execution. It does not run commands,
  install packages, or confirm the real product behaves as documented — a
  step can pass here and still fail against a live API that drifted from
  its docs.
- The persona deliberately refuses to infer reasonable defaults. That's the
  point for finding gaps, but it means the raw output will read as more
  pedantic than a real user report — triage the flagged items, don't ship
  them verbatim as bug reports.
- Works best on quickstarts under ~15 steps. Longer onboarding flows should
  be split into stages and walked separately.
