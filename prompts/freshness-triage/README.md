# freshness-triage

Cross-references a documentation page against its git log and the current
source it documents to rank which specific claims are most likely stale —
confirmed contradictions first, then claims whose underlying source
changed after the page was last touched — each with a concrete check to
confirm it.

## Inputs

| Name | Required | Description |
|---|---|---|
| `PAGE` | yes | The documentation page to check for staleness. |
| `GIT_LOG` | yes | Git log entries (date, message, changed files) for the page and/or the source it documents. |
| `SOURCE` | yes | The current contents of the source file(s) the page documents. |

## Example run

```bash
twp run freshness-triage \
  --input PAGE=./docs/rate-limits.md \
  --input GIT_LOG="$(git log --date=short --pretty='%ad %s' -- src/rateLimiter.ts)" \
  --input SOURCE=./src/rateLimiter.ts
```

Given the Lumen example in `evals.json` — a docs page stating a rate limit
of "100 requests per minute," a source file whose constant is now `150`,
and a git log entry showing that constant changed after the page's last
edit — the output ranks the rate-limit claim as **Confirmed stale**, citing
the exact line in `SOURCE` that contradicts it, with "update the docs page
to 150 requests/minute and re-check against the constant" as the concrete
next step.

## Limitations

- Only as good as what's in `GIT_LOG` and `SOURCE`. A claim that went stale
  because of a change somewhere neither input covers (a different service,
  an infra change, a policy shift) won't be caught.
- "Low" risk means no contradicting evidence was found in what this prompt
  checked — it is not a certification that the claim is still accurate.
- Ranks risk; it doesn't rewrite the page. Feed a "Confirmed stale" finding
  into [`audit-page`](../audit-page) or a direct edit once you've verified
  it.
