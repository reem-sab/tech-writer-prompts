---
name: API Reference Skeleton
version: 1.0.0
description: >
  Turns an OpenAPI spec into a reference page draft — per-endpoint
  descriptions, parameter tables, and request/response examples — with
  explicit TODO markers wherever the spec doesn't say enough to write from.
inputs:
  SPEC:
    description: An OpenAPI spec (JSON or YAML), complete or partial.
    required: true
model_notes: >
  Output quality tracks spec quality directly and intentionally — a spec
  missing descriptions and examples should produce a page dense with TODOs,
  not a page where the model quietly filled gaps with guesses. If the
  output has very few TODOs on a thin spec, check whether the model
  invented content instead of flagging the gap.
tags:
  - api
tested_with:
  - model: claude-sonnet-5
    date: 2026-08-29
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
example_output: |
  ## `POST /v1/events`

  Send an event for delivery to matching subscriptions.

  ### Parameters
  | Name | In | Type | Required | Description |
  |---|---|---|---|---|
  | payload | body | object | yes | > TODO: no description in spec |

  > TODO: spec defines no error responses for this operation.
---

You are drafting an API reference page from an OpenAPI spec. Your job is to
structure and phrase what's in SPEC clearly — not to invent behavior,
constraints, or examples the spec doesn't state.

For every operation (path + method) in SPEC, in the order they appear,
produce a section in this exact shape:

```
## `<METHOD> <path>`

<one- to two-sentence description, drawn from the spec's summary/description
fields. If both are missing, write:
> TODO: spec has no summary or description for this operation.>

### Parameters

| Name | In | Type | Required | Description |
|---|---|---|---|---|
<one row per parameter. If a parameter has no description in the spec,
put "> TODO: no description in spec" in the Description cell instead of
inventing one.>

### Request body

<if the operation has a request body, describe its shape and content type
from the schema. If the schema has no description, name the fields and
types you can see and mark undocumented fields individually with a TODO.
Omit this section entirely if the operation has no request body.>

### Responses

| Status | Description | Notes |
|---|---|---|
<one row per response defined in the spec. If a response has no
description, use "> TODO: no description in spec". If the spec defines no
error responses (4xx/5xx) at all for an operation that plausibly has them,
add a closing line: "> TODO: spec defines no error responses for this
operation.">
```

## Rules

- Never write a parameter constraint, default value, or behavior that
  isn't stated in SPEC, even if it seems obvious from the operation name.
  Silence in the spec becomes a TODO, not an inference.
- If SPEC includes an `example` or `examples` field, reproduce it in a
  fenced code block under the relevant section. If it doesn't, don't
  fabricate one — add "> TODO: no example in spec" instead.
- Preserve the spec's own terminology for field and parameter names exactly
  as written, even if inconsistent across endpoints — flag inconsistencies
  as a TODO rather than silently normalizing them.

## Output format

The per-operation sections above, concatenated in spec order, under a
single top-level heading naming the API (from SPEC's `info.title`, or
`> TODO: spec has no info.title` if absent).

## Limits

This drafts structure and phrasing from what SPEC already states — it does
not know the actual API behavior, cannot verify the spec matches the live
implementation, and will not catch a spec that is internally consistent but
wrong. A page with few TODOs still needs a human pass against the real API
before publishing.

## Spec to draft from

{{SPEC}}
