# localization-prep

Flags idioms, cultural references, ambiguous antecedents, and merged
sentences that tend to break or distort in translation, and suggests a
neutral, literal-translation-friendly rewrite for each — a pass to run
before a page goes to a translation team or pipeline.

## Inputs

| Name | Required | Description |
|---|---|---|
| `DRAFT` | yes | The draft text to prepare for translation. |

## Example run

```bash
twp run localization-prep --input DRAFT=./docs/rate-limits.md
```

Given the Lumen draft in `evals.json` — which says a retry "hits the
ground running once the rate limit window resets, so you won't need to
touch it again" — the output flags "hits the ground running" as an idiom
and rewrites it to something literal like "starts retrying immediately,"
and flags the ambiguous "touch it" (unclear whether "it" refers to the
retry logic or the rate limit window) with a rewrite that names the
referent explicitly.

## Limitations

- Flags patterns known to cause translation problems generally — it
  doesn't know your specific target languages, so a phrase that's fine in
  most of them but collides badly in one specific language won't be
  caught. Still get native-speaker review for translation-critical pages.
- Rewrites optimize for surviving translation, not for reading well in
  English — expect the suggested replacements to sound a little flatter
  than the original. That flatness is the point.
- Doesn't touch code samples, product names, or anything that shouldn't be
  translated in the first place — only prose.
