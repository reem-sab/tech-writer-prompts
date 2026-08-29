# api-ref-skeleton

Turns an OpenAPI spec into a reference page draft, one section per
operation, with a description, a parameter table, request body notes, and a
response table. It marks every place the spec does not say enough to write
from with an explicit `> TODO:` line instead of inventing content.

## Inputs

| Name | Required | Description |
|---|---|---|
| `SPEC` | yes | An OpenAPI spec (JSON or YAML), complete or partial. |

## Example run

```bash
twp run api-ref-skeleton --input SPEC=./openapi/lumen.yaml
```

Given the partial Lumen API spec in `evals.json`, a `POST /v1/events`
operation whose `payload` parameter has no description and whose spec
defines no 4xx or 5xx responses, the draft renders the documented fields
normally. It adds `> TODO: no description in spec` for `payload` and a
closing `> TODO: spec defines no error responses for this operation.` line,
rather than guessing what a validation error would look like.

## Limitations

- Drafts from what the spec states, not from the live API. A spec that is
  internally consistent but does not match the deployed behavior produces a
  clean-looking page that is still wrong, so always verify against the real
  API before publishing.
- Output density is a direct function of spec quality: a thin spec produces
  a TODO-heavy page by design. This prompt does not pad a sparse spec to
  make the draft look more complete than the source actually is.
- Does not generate SDK-specific code samples (curl-only or language-neutral
  shapes). Layer those in separately once the spec-derived structure is
  confirmed correct.
