---
name: Screenshot to Steps
version: 1.0.0
description: >
  Turns a screen recording description or a set of numbered screenshot
  descriptions into a written procedure phrased by what UI elements are
  named, not where they sit or what they look like -- so it survives a
  redesign.
inputs:
  SCREENS:
    description: >
      Numbered descriptions of screenshots or recording frames, in order.
      Each should describe what's visible: labels, buttons, fields, and
      what changed from the previous frame.
    required: true
model_notes: >
  Takes textual descriptions of screens, not image files -- describe each
  frame's visible labels and controls in SCREENS rather than passing an
  image. Output quality depends on how much label text the descriptions
  capture; a description that only says "clicks a button" with no label
  produces a correspondingly vague, flagged step.
tags:
  - docs-review
tested_with:
  - model: claude-sonnet-5
    date: 2026-08-29
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
example_output: |
  ## Procedure
  1. Click **Create API Key**.
  2. Enter a name in the **Key name** field and click **Generate**.
  3. Click **Copy** to copy the generated key.

  ## Fragile references
  Step 4 describes the account-settings control by function — no visible label
  in the source description.
---

You are converting a sequence of screen descriptions (SCREENS) into a
written procedure. The procedure must still be correct after the UI is
redesigned — buttons move, colors change, layouts get reorganized — as
long as the underlying feature still exists. That constraint drives every
phrasing choice below.

## Phrasing rules

- Refer to controls by their visible text label or accessible name ("click
  **Create API Key**"), never by color, position, or size ("the blue
  button," "the button in the top right," "the small icon").
- If a control has no visible label in the description (an icon-only
  button, for example), describe it by its function instead ("the icon
  that opens account settings") and add it to the Fragile References list
  — icon-only controls are exactly the elements most likely to move or
  change appearance in a redesign, and function-based phrasing is the best
  available fallback, not a full fix.
- Describe screen locations by structural region only when necessary
  (`"in the sidebar"`, `"on the Settings page"`), never by pixel position
  (`"top right"`, `"below the second card"`).
- Merge frames that represent a single logical action (a click and the
  resulting page load) into one step. Don't create a step for a frame that
  shows no new action, only a state change resulting from the previous
  step.

## Output format

```
## Procedure

1. <step, phrased per the rules above>
2. ...

## Fragile references

<one line per step number whose phrasing had to fall back to a function
description because no label was available: "Step N describes <element>
by function, not label -- no visible label in the source description."
If none, write "No fragile references.">
```

## Limits

Quality is bounded by what SCREENS actually describes — if a frame
description omits a button's label, this prompt can't recover it and will
flag the step as fragile instead of guessing a plausible-sounding label.
This also can't verify the procedure against the live product; it only
restates what the screen descriptions show, in UI-independent language.

## Screens

{{SCREENS}}
