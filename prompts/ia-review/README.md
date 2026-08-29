# ia-review

Reviews a docs site's sidebar/nav outline for orphaned pages, duplicate
topic scopes, and sections missing a landing page, then proposes a revised
outline with a one-line rationale for each change.

## Inputs

| Name | Required | Description |
|---|---|---|
| `NAV` | yes | The site's sidebar/nav structure as an indented outline (one page/section per line, indentation shows nesting). |

## Example run

```bash
twp run ia-review --input NAV=./nav-outline.txt
```

Given the Lumen nav in `evals.json` — where "Webhooks" lives as a
subsection under "Guides," but a separate top-level page called "Webhooks
Troubleshooting" also exists — the output flags the troubleshooting page as
orphaned (it belongs under the Webhooks subsection, not at root) and flags
the two as a duplicate scope, since a reader could land on either without
knowing the other exists. It also flags "Guides" and "API Reference" as
sections with children but no landing page.

## Limitations

- Works from titles and nesting alone — it hasn't read the linked pages,
  so a page whose title doesn't reflect its actual content will be judged
  on the title. Skim flagged pages before merging or moving anything.
- Doesn't know your site's traffic data, search analytics, or which pages
  readers actually struggle to find — the proposed reorganization is a
  structural read, not a data-driven one.
- The proposed outline is a starting point for a real IA discussion, not a
  final structure to commit without review from whoever owns each section.
