---
name: freshness-triage
description: >
  Cross-references a documentation page against its git log and the source files it documents to rank which claims are most likely stale, with a specific check for each. Use this skill when the task is: Cross-references a documentation page against its git log and the current source it documents to rank which specific claims are most likely stale — confirmed contradictions first, then claims whose underlying source changed after the page was last touched — each with a concrete check to confirm it.
version: 1.0.1
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
---

<!-- Generated from prompts/freshness-triage/prompt.md by `twp gen-skills`. Do not edit by hand. -->

# Freshness Triage

Cross-references a documentation page against its git log and the current source it documents to rank which specific claims are most likely stale — confirmed contradictions first, then claims whose underlying source changed after the page was last touched — each with a concrete check to confirm it.

## Inputs

- `{{PAGE}}`: The documentation page to check for staleness.
- `{{GIT_LOG}}`: Git log entries (commit date, message, changed files) for the page and/or the source it documents.
- `{{SOURCE}}`: The current contents of the source file(s) the page documents (config, constants, code).

## How to apply

Substitute each `{{PLACEHOLDER}}` above with the user's actual content, then
follow the prompt below exactly — including its output format and its stated
limits.

---

You are triaging PAGE for staleness by cross-referencing its claims against
GIT_LOG (the commit history for the page and/or its source) and SOURCE
(the current state of what it documents). You are not confirming anything
is actually wrong — you're ranking which specific claims deserve a human's
attention first, because the evidence suggests they might have drifted
from reality.

## Method

1. Extract the concrete, checkable claims from PAGE — specific numbers,
   named behaviors, field names, defaults, limits — not general prose.
2. For each claim, check whether SOURCE currently supports it. A claim
   that directly contradicts SOURCE is the highest-risk finding there is.
3. For claims SOURCE doesn't directly settle, use GIT_LOG: if the relevant
   file was changed by a commit dated after the page's last edit (or after
   whichever commit most plausibly wrote that claim, if that's inferable
   from GIT_LOG), treat the claim as at elevated risk even without direct
   contradiction — something nearby changed after the docs were last
   touched.
4. Claims neither contradicted by SOURCE nor touched by a later commit in
   GIT_LOG are lower priority — the evidence doesn't suggest they moved.

## Output format

A ranked numbered list, highest risk first:

```
N. [Risk: Confirmed stale | Elevated | Low]
   Claim: "<quoted claim from PAGE>"
   Evidence: <what in SOURCE or GIT_LOG supports this risk level -- cite
   the specific line/value in SOURCE, or the specific commit in GIT_LOG>
   What to check: <the specific action that would confirm or clear this,
   phrased so someone unfamiliar with the investigation could do it>
```

Use "Confirmed stale" only when SOURCE directly contradicts the claim.
Use "Elevated" when GIT_LOG shows relevant-looking change after the page's
last edit but SOURCE doesn't directly settle it.

If no claim on the page is Confirmed stale or Elevated, output exactly this
line and nothing else — do not list Low-risk claims in that case:

`No claims found with evidence of staleness.`

Only when at least one claim is Elevated or Confirmed do you produce the
ranked list; there, you may also include "Low" rows for claims you checked
and found no contradicting evidence for. Never list a claim you didn't
actually check against SOURCE or GIT_LOG.

## Limits

This only sees what's in SOURCE and GIT_LOG — it cannot detect staleness
caused by a change to something neither of those covers (a change in a
different service, an infrastructure change, a policy change). "Low" risk
means no evidence of staleness was found in what was checked, not that the
claim is confirmed current.

## Page

{{PAGE}}

## Git log

{{GIT_LOG}}

## Source

{{SOURCE}}
