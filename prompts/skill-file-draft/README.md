# skill-file-draft

Turns a docs section describing a capability or workflow into a SKILL.md
draft in the Agent Skills format — frontmatter `name` and a trigger-aware
`description`, plus an instructions body operationalized from the source
section — along with two starter eval cases so the skill isn't shipped
untested.

## Inputs

| Name | Required | Description |
|---|---|---|
| `SECTION` | yes | A docs section describing a capability, workflow, or tool a coding agent should be able to use. |

## Example run

```bash
twp run skill-file-draft --input SECTION=./docs/rotating-keys.md
```

Given the Lumen key-rotation docs section in `evals.json`, the output
drafts a `rotate-lumen-api-key` skill with a description stating both what
it does ("rotates a Lumen API key without downtime") and when to trigger
("when the user asks to rotate, replace, or roll a Lumen API key, or
mentions a key may be compromised"), a body listing the actual dashboard
and redeploy steps as agent instructions, and two eval cases exercising
different rotation scenarios.

## Limitations

- Drafts a starting `description` field, which is the hardest part of a
  skill to get right without live trigger data. Expect to tune it after
  observing real false-positive or false-negative triggers.
- Operationalizes only what `SECTION` states. A docs section missing a
  step or edge case produces a skill draft with the same gap, marked with
  a `<!-- TODO -->` rather than a fabricated specific.
- The two starter eval cases are a floor, not a full eval suite — treat
  them the way this library's own `CONTRIBUTING.md` treats a new prompt's
  evals: a starting 3–5, expanded as real usage surfaces edge cases.
