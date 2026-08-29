# screenshot-to-steps

Turns a numbered sequence of screenshot or screen-recording frame
descriptions into a written procedure phrased by what controls are
*named*, not where they sit or what they look like, so the steps stay
accurate after the next redesign moves the button.

## Inputs

| Name | Required | Description |
|---|---|---|
| `SCREENS` | yes | Numbered descriptions of screenshots or recording frames, in order, describing the visible labels and controls and what changed between frames. |

## Example run

```bash
twp run screenshot-to-steps --input SCREENS=./frames.txt
```

Take the Lumen dashboard frames in `evals.json`, one of which shows only a
small gear icon in the sidebar with no visible text label. The output
writes that step as clicking the icon that opens account settings instead
of clicking the small gear icon in the sidebar, and lists it under Fragile
References because it had to fall back to a function description in the
absence of a label.

## Limitations

- Bounded entirely by what the frame descriptions capture. A description
  that omits the label of a button produces a vaguer, explicitly flagged
  step. It does not invent a plausible label to fill the gap.
- Takes textual descriptions of screens as input, not image files. If you
  have actual screenshots, describe the visible labels and controls of each
  one first (or use a model or tool that can read images to produce that
  description), then run this prompt on the result.
- Does not verify the procedure against the live product. It restates what
  the screens show, in more durable language, but a frame that misdescribes
  the UI produces a procedure with the same error.
