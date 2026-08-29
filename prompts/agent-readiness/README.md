# agent-readiness

Rates a page for how safely an autonomous agent could act on it directly —
no human in the loop to catch a misreading. Flags ambiguous pronouns,
steps that depend on context the page never states, prose that buries
instructions instead of structuring them, underspecified actions with real
blast radius, and genuinely non-deterministic steps. Outputs a score and a
blast-radius-ordered fix list.

This is one of this library's four flagship prompts — as agents read and
act on documentation more directly, this is the check that catches the gap
between "a human would figure this out" and "an agent will guess wrong."

## Inputs

| Name | Required | Description |
|---|---|---|
| `PAGE` | yes | The documentation page to rate for agent readiness. |

## Example run

```bash
twp run agent-readiness --input PAGE=./runbooks/rotate-keys.md
```

Given the Lumen runbook in `evals.json` — "Revoke the old key once you've
confirmed the new one works" without saying which dashboard action revokes
it, and "restart the service" without naming the service — the output
scores the page down for two dangerous underspecified claims, quoting each
exactly and proposing a specific rewrite for each ("Revoke the old key" →
"In Settings → API Keys, click Revoke next to the key you just replaced").

## Limitations

- Evaluates how a passage is likely to be parsed, not how any specific
  model or agent actually parsed it. A finding is a risk flag, not proof
  a given agent will fail on that exact passage.
- Optimizing purely for this score can produce over-specified, stilted
  prose. Use judgment on findings that would only matter for an
  adversarially literal reader no real agent resembles.
- Doesn't execute anything — it can't tell you a command is wrong, only
  that its scope or target is underspecified in the text.
