# screenshot-to-steps

Turns a numbered sequence of screenshot or screen-recording frame
descriptions into a written procedure phrased by what controls are
*named*, not where they sit or what they look like — so the steps are
still accurate after the next redesign moves the button.

## Inputs

| Name | Required | Description |
|---|---|---|
| `SCREENS` | yes | Numbered descriptions of screenshots or recording frames, in order, describing visible labels/controls and what changed between frames. |

## Example run

```bash
twp run screenshot-to-steps --input SCREENS=./frames.txt
```

Given the Lumen dashboard frames in `evals.json` — one of which shows only
"a small gear icon in the sidebar, no visible text label" — the output
writes that step as "click the icon that opens account settings" instead
of "click the small gear icon in the sidebar," and lists it under Fragile
References since it had to fall back to a function description in the
absence of a label.

## Limitations

- Bounded entirely by what the frame descriptions capture. A description
  that omits a button's label produces a vaguer, explicitly flagged step —
  it will not invent a plausible label to fill the gap.
- Takes textual descriptions of screens as input, not image files. If you
  have actual screenshots, describe each one's visible labels and controls
  first (or use a model/tool that can read images to produce that
  description), then run this prompt on the result.
- Doesn't verify the procedure against the live product — it restates what
  the screens show, in more durable language, but a frame that mis-
  describes the UI produces a procedure with the same error.
