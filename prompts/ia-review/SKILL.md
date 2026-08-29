---
name: ia-review
description: >
  Reviews a sidebar/nav structure for orphaned pages, duplicate scopes, and missing landing pages, and proposes a reorganization with rationale for each change. Use this skill when the task is: Reviews the sidebar or nav outline of a docs site for orphaned pages, duplicate topic scopes, and sections missing a landing page, then proposes a revised outline with a one-line rationale for each change.
version: 1.0.1
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
---

<!-- Generated from prompts/ia-review/prompt.md by `twp gen-skills`. Do not edit by hand. -->

# IA Review

Reviews the sidebar or nav outline of a docs site for orphaned pages, duplicate topic scopes, and sections missing a landing page, then proposes a revised outline with a one-line rationale for each change.

## Inputs

- `{{NAV}}`: The docs site's sidebar/nav structure as an indented outline (one page or section per line, indentation showing nesting).

## How to apply

Substitute each `{{PLACEHOLDER}}` above with the user's actual content, then
follow the prompt below exactly — including its output format and its stated
limits.

---

You are reviewing a documentation site's navigation structure (NAV) for
three specific structural problems, using only the page titles and their
nesting — you don't have the page content, so judge topic overlap and fit
from what each title implies.

## What to find

1. **Orphaned pages** — a page that sits at the wrong level of nesting for
   what its title implies: a top-level page that's clearly a subtopic of an
   existing section, or a page nested under a section its title doesn't
   relate to.
2. **Duplicate scopes** — two or more sections or pages, anywhere in NAV,
   whose titles imply they cover the same or heavily overlapping topic.
   This is the most common way a docs site accumulates confusion — the
   same subject documented in two unconnected places because whoever wrote
   the second one didn't know the first existed. Exception: a generic
   per-section landing page (several sections each having their own page
   named "Overview," "Introduction," or the section's own name) is expected
   structure, not a duplicate scope — never flag those as duplicates of one
   another.
3. **Missing landing pages** — a section with two or more child pages but
   no page for the section itself (no "Overview," no page sharing the
   section's name) — a reader arriving at that section in the nav has
   nowhere to click that orients them before picking a child page.

## Output format

```
## Orphaned pages

<one per line: "<page>" is nested under "<current parent>" but reads as
belonging under "<better parent>". If none, write "None found.">

## Duplicate scopes

<one per group: "<page/section A>" and "<page/section B>" appear to cover
the same topic based on their titles -- consider merging or clearly
splitting their scope. If none, write "None found.">

## Missing landing pages

<one per section: "<section>" has <N> child pages and no landing page.
If none, write "None found.">

## Proposed reorganization

<a revised indented outline in the same format as NAV, incorporating fixes
for everything found above. For each change from the original, add a
one-line rationale below the outline, referencing the specific finding it
addresses. If nothing was found, write "No reorganization needed.">
```

## Limits

Judgments are based on page titles and nesting only — this prompt hasn't
read the actual page content, so a page whose title undersells or
mischaracterizes what it covers will be judged on the misleading title, not
the real content. Verify duplicate-scope findings by skimming both pages
before merging or restructuring anything.

## Nav structure to review

{{NAV}}
