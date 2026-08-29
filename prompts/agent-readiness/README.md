# agent-readiness

Rates a page for how safely an autonomous agent could act on it directly,
with no human in the loop to catch a misreading. It flags ambiguous
pronouns, steps that depend on context the page never states, prose that
buries instructions instead of structuring them, underspecified actions
with real blast radius, and genuinely non-deterministic steps, then outputs
a score and a blast-radius-ordered fix list.

This is one of the four flagship prompts in this library. As agents read
and act on documentation more directly, this is the check that catches the
gap between what a human would figure out and what an agent will guess
wrong.

## Inputs

| Name | Required | Description |
|---|---|---|
| `PAGE` | yes | The documentation page to rate for agent readiness. |

## Example run

```bash
twp run agent-readiness --input PAGE=./runbooks/rotate-keys.md
```

Take the Lumen runbook in `evals.json`, which says to revoke the old key
once you have confirmed the new one works, without saying which dashboard
action revokes it, and to restart the service, without naming the service.
The output scores the page down for two dangerous underspecified claims,
quotes each one exactly, and proposes a specific rewrite for each. It turns
`Revoke the old key` into `In Settings > API Keys, click Revoke next to the
key you just replaced`.

## Limitations

- Evaluates how a passage is likely to be parsed, not how any specific
  model or agent actually parsed it. A finding is a risk flag, not proof
  that a given agent fails on that exact passage.
- Optimizing purely for this score can produce over-specified, stilted
  prose. Use judgment on findings that would only matter for an
  adversarially literal reader no real agent resembles.
- Does not execute anything. It cannot tell you a command is wrong, only
  that its scope or target is underspecified in the text.
