# diataxis-classify

Classifies a page against the four [Diataxis](https://diataxis.fr) modes —
tutorial, how-to guide, reference, explanation — identifies passages that
belong to a different mode than the page's primary one, and proposes a
concrete split when the mixing is bad enough to matter.

## Inputs

| Name | Required | Description |
|---|---|---|
| `PAGE` | yes | The documentation page to classify. |

## Example run

```bash
twp run diataxis-classify --input PAGE=./docs/webhooks.md
```

Given the Lumen page in `evals.json` — numbered how-to steps for setting up
a webhook subscription, interrupted by three paragraphs explaining why
Lumen chose at-least-once delivery semantics over exactly-once — the output
classifies the page as primarily a how-to guide, flags the delivery-
semantics paragraphs as explanation-mode content that belongs elsewhere,
and proposes splitting it into "Set Up a Webhook Subscription" (how-to)
and "How Lumen Delivers Webhooks" (explanation).

## Limitations

- A judgment call, not a mechanical rule: one sentence of "why" inside a
  how-to guide is normal and not flagged as mixing. The bar is passages
  substantial enough that they'd genuinely serve the reader better on
  their own page.
- Doesn't know your team's actual IA, traffic patterns, or maintenance
  capacity — a proposed split is a starting point for that conversation,
  not a mandate to always split.
- Classifies the page as given; it can't tell you whether the underlying
  Diataxis framework is the right structure for your specific docs set.
