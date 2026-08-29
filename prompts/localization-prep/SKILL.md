---
name: localization-prep
description: >
  Flags idioms, cultural references, ambiguous antecedents, and merged sentences in a draft that will break or distort in translation, and suggests a neutral rewrite for each. Use this skill when the task is: Flags idioms, cultural references, ambiguous antecedents, and merged sentences that tend to break or distort in translation, and suggests a neutral, literal-translation-friendly rewrite for each. Run it before a page goes to a translation team or pipeline.
version: 1.0.0
author:
  name: Reem Sabawi
  url: https://github.com/reem-sab
---

<!-- Generated from prompts/localization-prep/prompt.md by `twp gen-skills`. Do not edit by hand. -->

# Localization Prep

Flags idioms, cultural references, ambiguous antecedents, and merged sentences that tend to break or distort in translation, and suggests a neutral, literal-translation-friendly rewrite for each. Run it before a page goes to a translation team or pipeline.

## Inputs

- `{{DRAFT}}`: The draft text to prepare for translation.

## How to apply

Substitute each `{{PLACEHOLDER}}` above with the user's actual content, then
follow the prompt below exactly — including its output format and its stated
limits.

---

You are preparing DRAFT for translation. A translator (or a translation
model) working sentence by sentence, without the cultural or product
context you have, will hit specific failure points. Find them before they
find your translation team.

## What to flag

1. **Idioms** — figurative phrases that don't survive literal translation
   ("under the hood," "out of the box," "a ballpark figure," "hit the
   ground running"). A translator either mistranslates these literally or
   has to guess the intended meaning.
2. **Cultural references** — sports metaphors, holiday references, or
   region-specific analogies that assume shared context a reader in
   another culture won't have ("like a Hail Mary pass," "Black Friday
   pricing," "as American as apple pie").
3. **Ambiguous antecedents** — a pronoun or reference where the noun it
   refers to isn't unambiguous from the immediate sentence alone. This
   matters more for translation than for a native English reader, because
   many target languages require choosing a gender, number, or case for
   the referent — an ambiguous "it" in English forces the translator to
   guess which noun to agree with.
4. **Merged sentences** — a single sentence carrying more than one
   instruction or claim, joined by "and," "which," or a comma splice.
   These are more likely to be mistranslated or split incorrectly, and
   should be broken into separate sentences even though the meaning is
   already clear to an English reader.

## Output format

A numbered list, one entry per issue found, in the order it appears in
DRAFT:

```
N. [<Idiom | Cultural reference | Ambiguous antecedent | Merged sentence>]
   Original: "<quoted text>"
   Rewrite: "<neutral, literal-translation-friendly replacement that
   preserves the exact original meaning>"
```

If DRAFT has no issues, output exactly: `No localization issues found.`

## Limits

This flags patterns known to cause translation problems in general — it
doesn't know the specific target language(s) your team translates into, so
it can't catch a phrase that's fine in most languages but breaks in one
specific one (a term that collides with an unrelated word, for example).
Have a native speaker of each target language review translation-critical
pages regardless.

## Draft to prepare

{{DRAFT}}
