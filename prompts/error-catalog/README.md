# error-catalog

Converts a raw list of error codes and strings — the kind pulled straight
from an enum or error-constants file — into a troubleshooting table with
cause, fix, and "how you got here" for each one, plus a machine-readable
JSON array of the same data for agents to consume.

## Inputs

| Name | Required | Description |
|---|---|---|
| `ERRORS` | yes | Raw error codes, constants, or strings from source. Include inline comments — they're often the only stated cause. |

## Example run

```bash
twp run error-catalog --input ERRORS=./src/errors.ts
```

Given the Lumen API error constants in `evals.json` — codes like
`LUMEN_401_INVALID_KEY`, `LUMEN_429_RATE_LIMITED`, and a bare
`LUMEN_500_INTERNAL` with no comment — the output gives the first two a
specific cause and fix drawn from the naming and any inline comment, and
marks `LUMEN_500_INTERNAL`'s cause as `Unclear from source — ask an
engineer` rather than inventing one.

## Limitations

- Causes and fixes are inferred from names, messages, and inline comments —
  not from the runtime behavior of the code. An error that only makes sense
  given call-site context the source doesn't show will get a flagged,
  best-effort answer rather than a fabricated specific one.
- The JSON output's shape (`code`, `message`, `cause`, `fix`, `trigger`) is
  fixed by this prompt version. If you change it, bump the prompt version —
  agents built against `1.0.0`'s shape will break.
- Doesn't deduplicate or group related errors (e.g. several 4xx validation
  errors that share a fix). Do that pass yourself if the source has a lot
  of near-duplicate codes.
