---
name: error-catalog
description: >
  Turns raw error codes and strings pulled from source into a troubleshooting table with cause, fix, and "how you got here" for each one, plus a JSON version meant for agents to consume directly. Use this skill when the task is: Converts a raw list of error codes and strings — the kind pulled straight from an enum or error-constants file — into a troubleshooting table with cause, fix, and "how you got here" for each one, plus a machine-readable JSON array of the same data for agents to consume.
version: 1.0.0
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
---

<!-- Generated from prompts/error-catalog/prompt.md by `twp gen-skills`. Do not edit by hand. -->

# Error Catalog

Converts a raw list of error codes and strings — the kind pulled straight from an enum or error-constants file — into a troubleshooting table with cause, fix, and "how you got here" for each one, plus a machine-readable JSON array of the same data for agents to consume.

## Inputs

- `{{ERRORS}}`: Raw error codes, constants, or strings from source (an enum, an error class, log lines, or a list of code/message pairs). Include any inline comments from the source — they're often the only stated cause.

## How to apply

Substitute each `{{PLACEHOLDER}}` above with the user's actual content, then
follow the prompt below exactly — including its output format and its stated
limits.

---

You are turning a raw list of error codes into a troubleshooting reference
for two audiences at once: a developer scanning a table, and an agent
parsing structured data to decide what to do next.

For each error in ERRORS, work out:

- **Likely cause** — based on the code's name, its message text, and any
  inline comment in the source. If the source gives an explicit cause
  (a comment, a check right before the throw), use it; don't invent a more
  specific cause than the source supports.
- **Fix** — the concrete action that resolves it, phrased as an instruction
  ("Wait for the rate limit window to reset and retry" not "rate limiting
  occurred").
- **How you got here** — the request or condition that triggers this error,
  phrased so a reader can pattern-match it against what they just did
  ("Sent a request with an expired or revoked API key").

If ERRORS gives you nothing to go on beyond a bare name (no message, no
comment, and the name itself is ambiguous), say so directly in the Cause
column instead of guessing — write `Unclear from source — ask an engineer`.
Do not fabricate a plausible-sounding cause for an error you can't actually
reason about.

## Output format

Produce exactly two sections.

### 1. Troubleshooting table

| Error Code | Message | Likely Cause | Fix | How You Got Here |
|---|---|---|---|---|

One row per error, in the order they appeared in ERRORS.

### 2. Agent-readable JSON

The same data as a JSON array, in a fenced ` ```json ` code block, using
this shape for every entry:

```json
{
  "code": "string",
  "message": "string",
  "cause": "string",
  "fix": "string",
  "trigger": "string"
}
```

`trigger` corresponds to the "How You Got Here" column. Emit valid JSON —
no trailing commas, no comments inside the block.

## Limits

Causes and fixes are inferred from what's visible in ERRORS, not from
executing the code or reading the full call graph. An error whose real
cause depends on runtime state the source doesn't reveal will get a best-
effort answer, flagged as such — verify those against the implementation
before publishing.

## Errors to catalog

{{ERRORS}}
