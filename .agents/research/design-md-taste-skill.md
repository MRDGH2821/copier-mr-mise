# DESIGN.md and Taste Skill

**Answer:** The current `design-taste-frontend` skill does not document `DESIGN.md` as a requirement or a file it reads.
At upstream commit [`f6b76575`](https://github.com/Leonxlnx/taste-skill/tree/f6b76575f949707b4e3c37cd86cb44b0b98643e8), a case-insensitive text search of the checkout found no `design.md` reference.
Its [skill instructions](https://github.com/Leonxlnx/taste-skill/blob/f6b76575f949707b4e3c37cd86cb44b0b98643e8/skills/taste-skill/SKILL.md) instead require a brief, a page plan, named references, and checks.
This search is evidence about that revision, not proof that every agent or future version ignores the file.

## User-facing guidance

Creating `DESIGN.md` is optional for users of the current skill.
If a project has design rules, users can document them and explicitly ask their agent to read and apply the file.
Do not promise automatic discovery or enforcement by Taste Skill.
The skill's current instructions direct the agent to use the client's colors when supplied and to work in an existing project's stack.
[Taste Skill instructions, sections 4.0 and 4.4](https://github.com/Leonxlnx/taste-skill/blob/f6b76575f949707b4e3c37cd86cb44b0b98643e8/skills/taste-skill/SKILL.md#4-the-run).

State which guidance takes priority if a project's design rules conflict with the skill. This is a recommendation, not a documented Taste Skill conflict-resolution feature. The current skill describes its own house rules as taking priority over other instructions in the skill. [Taste Skill house rules](https://github.com/Leonxlnx/taste-skill/blob/f6b76575f949707b4e3c37cd86cb44b0b98643e8/skills/taste-skill/SKILL.md#house-rules).

## Formats and the older Stitch skill

`DESIGN.md` is not a single universal format.
[Google Labs' alpha specification](https://github.com/google-labs-code/design.md/blob/1ed38aa9dd4451b9039f9aeb9ed1d2579edafddf/docs/spec.md) defines design rationale in Markdown and design tokens in YAML front matter or fenced YAML blocks.
It specifies an ordered set of sections, allows irrelevant sections to be omitted, and treats token values as normative.
Its [README](https://github.com/google-labs-code/design.md/blob/1ed38aa9dd4451b9039f9aeb9ed1d2579edafddf/README.md#getting-started) documents an optional `npx @google/design.md lint DESIGN.md` command for files that follow that specification.
Do not present its schema or linter as Taste Skill requirements.

The separate classic `stitch-design-taste` skill explicitly generates a `DESIGN.md` for Google Stitch and gives its own numbered prose structure. It is opt-in and now lives in `taste-skill-classics`, not the current `design-taste-frontend` skill. Do not generalize its output format or rules to all Taste Skill installations. [Classic Stitch skill](https://github.com/Leonxlnx/taste-skill-classics/blob/main/skills/stitch-skill/SKILL.md) · [Current repository's moved-skills list](https://github.com/Leonxlnx/taste-skill/blob/f6b76575f949707b4e3c37cd86cb44b0b98643e8/README.md#moved-skills).
