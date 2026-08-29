# glossary-extract

Scans a set of pages for domain-specific terms that are used repeatedly but
never actually defined, ranks them by frequency, and drafts a definition
for each from context — so you get a prioritized list of what to add to
the glossary instead of starting from a blank page.

## Inputs

| Name | Required | Description |
|---|---|---|
| `PAGES` | yes | One or more docs pages, concatenated. Separate multiple files with a `--- <filename> ---` line so output can cite where a term first appears. |

## Example run

```bash
twp run glossary-extract --input PAGES=./docs/*.md
```

Given the Lumen pages in `evals.json`, which use "subscription," "event
type," and "delivery attempt" throughout without ever stating what any of
them mean, the output ranks them by how often each appears and drafts a
definition for each based only on how the pages use it — flagging, for
example, that "delivery attempt" seems to mean a single try at POSTing to a
webhook URL, inferred from the retry-related sentences around it.

## Limitations

- Definitions are drafted from context alone, not from real knowledge of
  the product. Treat every drafted definition as something to verify, not
  something to paste into a glossary unread.
- Only sees what's in `PAGES`. A term defined in a page you didn't include
  will be flagged as undefined even though it isn't, elsewhere in the docs
  set.
- Doesn't catch inconsistent definitions (the same term defined two
  different ways in two places) — it only catches terms with zero
  definitions. Pair with a manual pass if you suspect drift, not absence.
