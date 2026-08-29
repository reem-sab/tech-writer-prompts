---
name: Skill File Draft
version: 1.0.0
description: >
  Turns a docs section describing a capability or workflow into a SKILL.md
  draft in the Agent Skills format, with two starter eval cases so the
  skill ships testable from day one.
inputs:
  SECTION:
    description: A docs section describing a capability, workflow, or tool a coding agent should be able to use.
    required: true
model_notes: >
  Produces a draft to review, not a final skill -- the description field in
  particular (which controls when an agent decides to load the skill) is
  the highest-leverage part to get right and the hardest to get right
  without seeing real trigger/non-trigger examples in practice.
tags:
  - agents
tested_with:
  - model: claude-sonnet-5
    date: 2026-08-29
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
example_output: |
  ## Drafted SKILL.md
  ---
  name: rotate-lumen-api-key
  description: Rotates a Lumen API key without downtime. Use when the user asks
    to rotate, replace, or roll a Lumen key, or says a key may be compromised.
  ---
  1. In the dashboard, go to Settings → API Keys and click Generate new key...

  ## Starter eval cases
  [
    { "id": "happy-path", "input": { "REQUEST": "rotate my key" },
      "expect": { "contains": ["Revoke"] } }
  ]
---

You are drafting a SKILL.md file from SECTION, a piece of documentation
describing a capability, workflow, or tool. The skill file is what an
agent reads to decide (a) whether this skill is relevant to the task in
front of it, and (b) how to carry it out once loaded.

## What makes a good draft

- **`name`**: short, kebab-case, matching what the capability is actually
  called — not a generic label.
- **`description`**: the single most important field. It must state both
  *what the skill does* and *when to use it* — specific enough that an
  agent scanning many skill descriptions at once can tell this one applies
  to the task in front of it, and specific enough to tell when it
  *doesn't* apply. A description that only says what the skill does,
  without trigger conditions, is incomplete.
- **Body**: the actual instructions — written as steps or rules an agent
  follows, not as prose explaining the feature to a human reader. Pull the
  concrete steps, constraints, and edge cases out of SECTION; don't
  summarize SECTION, operationalize it.
- If SECTION doesn't give you enough to write a specific trigger condition
  or a concrete step, say so with a `<!-- TODO: ... -->` comment rather
  than inventing plausible-sounding specifics.

## Output format

````
## Drafted SKILL.md

```markdown
---
name: <kebab-case-name>
description: <what it does, and specifically when an agent should use it>
---

<body: instructions as steps/rules, pulled from SECTION>
```

## Starter eval cases

```json
[
  {
    "id": "<case-id>",
    "input": { "<INPUT_NAME>": "<realistic sample input drawn from or consistent with SECTION>" },
    "expect": { "contains": ["<specific string the correct behavior would produce>"] }
  },
  {
    "id": "<case-id-2>",
    "input": { "<INPUT_NAME>": "<a second, different realistic sample input>" },
    "expect": { "contains": ["<specific string the correct behavior would produce>"] }
  }
]
```
````

The two eval cases must be different enough to actually test distinct
behavior — not the same scenario with different variable names.

## Limits

This drafts structure and a starting description from SECTION alone — it
cannot observe how the description performs at actual trigger time (false
positives loading when it shouldn't, false negatives missing when it
should). Treat the `description` field especially as a first draft to
tune after watching it work — or fail to trigger — in practice.

## Docs section

{{SECTION}}
