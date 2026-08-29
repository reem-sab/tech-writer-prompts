# ia-review

Reviews the sidebar or nav outline of a docs site for orphaned pages,
duplicate topic scopes, and sections missing a landing page, then proposes
a revised outline with a one-line rationale for each change.

## Inputs

| Name | Required | Description |
|---|---|---|
| `NAV` | yes | The nav structure of the site as an indented outline (one page or section per line, indentation shows nesting). |

## Example run

```bash
twp run ia-review --input NAV=./nav-outline.txt
```

Take the Lumen nav in `evals.json`, where `Webhooks` lives as a subsection
under `Guides` but a separate top-level page called `Webhooks
Troubleshooting` also exists. The output flags the troubleshooting page as
orphaned, because it belongs under the Webhooks subsection rather than at
the root, and flags the two as a duplicate scope, because a reader could
land on either without knowing the other exists. It also flags `Guides` and
`API Reference` as sections with children but no landing page.

## Limitations

- Works from titles and nesting alone. It has not read the linked pages, so
  a page whose title does not reflect its actual content is judged on the
  title. Skim flagged pages before merging or moving anything.
- Does not know the traffic data of your site, its search analytics, or
  which pages readers actually struggle to find. The proposed
  reorganization is a structural read, not a data-driven one.
- The proposed outline is a starting point for a real IA discussion, not a
  final structure to commit without review from whoever owns each section.
