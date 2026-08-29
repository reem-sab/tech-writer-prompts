# diataxis-classify

Classifies a page against the four [Diataxis](https://diataxis.fr) modes,
which are tutorial, how-to guide, reference, and explanation. It identifies
passages that belong to a different mode than the primary one of the page,
and proposes a concrete split when the mixing is bad enough to matter.

## Inputs

| Name | Required | Description |
|---|---|---|
| `PAGE` | yes | The documentation page to classify. |

## Example run

```bash
twp run diataxis-classify --input PAGE=./docs/webhooks.md
```

Take the Lumen page in `evals.json`, numbered how-to steps for setting up a
webhook subscription, interrupted by three paragraphs explaining why Lumen
chose at-least-once delivery semantics over exactly-once. The output
classifies the page as primarily a how-to guide, flags the delivery-
semantics paragraphs as explanation-mode content that belongs elsewhere,
and proposes splitting it into `Set Up a Webhook Subscription` (how-to) and
`How Lumen Delivers Webhooks` (explanation).

## Limitations

- This is a judgment call, not a mechanical rule. One sentence of rationale
  inside a how-to guide is normal and not flagged as mixing. The bar is
  passages substantial enough that they would genuinely serve the reader
  better on their own page.
- Does not know your team's actual IA, traffic patterns, or maintenance
  capacity. A proposed split is a starting point for that conversation, not
  a mandate to always split.
- Classifies the page as given. It cannot tell you whether the underlying
  Diataxis framework is the right structure for your specific docs set.
