# release-notes

Turns a raw commit list or internal changelog into customer-facing release
notes grouped into Breaking Changes, New, and Fixed, plus a one-line
support-team summary you can paste straight into a ticket reply.

## Inputs

| Name | Required | Description |
|---|---|---|
| `CHANGES` | yes | A commit list, PR titles, or an internal changelog for the release. |

## Example run

```bash
twp run release-notes --input CHANGES=./CHANGELOG-internal.md
```

Take the Lumen commit list in `evals.json`, which includes a commit
renaming the `payload` field to `data` in the event schema, a new bulk
`/v1/events/batch` endpoint, a fix for webhook signature verification, and
a test-only refactor commit. The output puts the field rename under
Breaking Changes, the batch endpoint under New, and the signature fix under
Fixed, and it drops the test-only commit entirely because it has no
customer-visible effect.

## Limitations

- Works from the commit list or changelog text alone, not the actual diff.
  A commit message that undersells or mischaracterizes its own change
  produces release notes with the same blind spot, so have someone who
  worked on the release review before publishing.
- Ambiguous changes are deliberately over-classified as Breaking rather
  than New or Fixed. Expect to occasionally downgrade an item after human
  review, not the other way around.
- Does not version the release itself or infer a release number or date from
  CHANGES unless that information is already in the input.
