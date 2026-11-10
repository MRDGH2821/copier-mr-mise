# Agent plugin compatibility and overlap

**Refreshed:** 2026-11-11. This report checks the user-specified upstreams
against current `main` revisions. The repository lockfile pins Superpowers
7.0.2, Matt Pocock skills 1.3.2, and PAAD 2.1.0; Caveman and Ponytail are not
installed in this repository.

Current upstream refs:

- Superpowers: `22f0b463e7a5e579904dd6211a520321035526f7`
- Matt: `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`
- Caveman: `3dc497a7f858c774d6e15b25e8c6120ef3a0eda8`
- Ponytail: `96608e078b2d5ea607c5c3b8b5a54d1c1fba6846`
- PAAD: `b57ee4201f1bff94b01dbb6ca40f1ab5323f7602`

Sources: [local lockfile](../../capabilities.lock),
[Superpowers](https://github.com/obra/superpowers/tree/22f0b463e7a5e579904dd6211a520321035526f7),
[Matt skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d),
[Caveman](https://github.com/JuliusBrussee/caveman/tree/3dc497a7f858c774d6e15b25e8c6120ef3a0eda8),
[Ponytail](https://github.com/DietrichGebert/ponytail/tree/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846),
[PAAD](https://github.com/Ovid/paad/tree/b57ee4201f1bff94b01dbb6ca40f1ab5323f7602).

## What they provide

- **Superpowers:** broad, automatically triggered software-development workflow.
  Its README describes clarification, design approval, planning, TDD, subagent
  implementation, review, and verification as an integrated methodology.
  Individually selectable skills include `brainstorming`,
  `test-driven-development`, `systematic-debugging`, `writing-plans`,
  `subagent-driven-development`, `requesting-code-review`,
  `receiving-code-review`, and `verification-before-completion`.
  [README](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/README.md)
  · [skills](https://github.com/obra/superpowers/tree/22f0b463e7a5e579904dd6211a520321035526f7/skills).
- **Matt Pocock skills:** explicitly small and composable, with user-invoked
  orchestration and model-invoked disciplines. Useful individual choices
  include `grill-with-docs`, `tdd`, `diagnosing-bugs`, `code-review`,
  `domain-modeling`, `codebase-design`, `to-spec`, `to-tickets`, and `implement`.
  The current README warns that installing the plugin and separately copied
  skills for the same agent duplicates skills.
  [README](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/README.md)
  · [skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills).
- **PAAD:** review-oriented, human-steered stages: `pushback`, `alignment`,
  `agentic-architecture`, and `agentic-review`; specialized options include
  `agentic-a11y`, `agentic-owasp`, `agentic-dedup`, and `test-roadmap`.
  Its README explicitly says it complements Superpowers; the listed skills
  review decisions and results rather than replacing the implementation
  harness. [README](https://github.com/Ovid/paad/blob/b57ee4201f1bff94b01dbb6ca40f1ab5323f7602/README.md)
  · [skills](https://github.com/Ovid/paad/tree/b57ee4201f1bff94b01dbb6ca40f1ab5323f7602/plugins/paad/skills).
- **Caveman 4.1:** broader than a response-style prompt. Its README describes
  six components: shorter output, compressed tool input, model/effort
  selection, reusable code-mode blocks, waste fixes, and compressed browsing.
  For only shorter replies, the standalone `caveman` skill is narrower than
  the full CLI install. Other relevant skills include `ultracave`,
  `megacave`, `caveman-review`, `caveman-commit`, `investigate-first`, and
  `surgical-patch`. The install enables multiple components by default; review
  its switches before adopting the whole package.
  [README](https://github.com/JuliusBrussee/caveman/blob/3dc497a7f858c774d6e15b25e8c6120ef3a0eda8/README.md)
  · [skills](https://github.com/JuliusBrussee/caveman/tree/3dc497a7f858c774d6e15b25e8c6120ef3a0eda8/skills).
- **Ponytail 5.3:** always-on minimum-complete-code guidance plus
  `ponytail-review`, `ponytail-audit`, `ponytail-debt`, and `ponytail-gain`.
  Its prompt asks for existing-code inspection and small implementations while
  retaining necessary tests, validation, security, and accessibility. Its
  benchmark claims are upstream claims, not independent comparisons.
  [README](https://github.com/DietrichGebert/ponytail/blob/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/README.md)
  · [core skill](https://github.com/DietrichGebert/ponytail/blob/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/skills/ponytail/SKILL.md).

## Compatibility and likely conflicts

**No hard incompatibility was found among the five repositories at the
skill-content level.** They can be installed together, but their overlapping
instructions can compete for control of the same task. This is trigger/policy
overlap, not a claim that the plugins are technically incompatible.

- **Choose one default workflow owner:** Superpowers activates a cohesive
  process automatically. Matt offers a modular, user-steered approach but also
  supplies its own `implement`/`implement-spec` orchestration. Having both
  active without a precedence rule can cause repeated planning, TDD, review,
  or different subagent strategies. Matt's current README warns specifically
  against installing its plugin and separate copied skills twice for one agent.
- **TDD policy differs:** Superpowers requires a watched failing test before
  production changes for most feature/fix/refactor work. Ponytail describes
  testing logic-bearing or risky work and otherwise favors the smallest
  sufficient change. This is a genuine policy conflict on trivial changes;
  choose a precedence rule or avoid activating both globally.
  [Superpowers TDD](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/test-driven-development/SKILL.md)
  · [Ponytail core prompt](https://github.com/DietrichGebert/ponytail/blob/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/skills/ponytail/SKILL.md).
- **Review skills overlap:** Superpowers, Matt, PAAD, Ponytail, and Caveman all offer some review/audit behavior. Select one default review path; add PAAD's accessibility/security checks or other specialized lenses where needed. Do not assume same-named reviews have the same scope.
- **Style policies overlap:** Caveman and Ponytail can both make responses terser. Caveman's full install additionally changes input/output processing and model/effort selection. Trial one at a time, especially in teams, and preserve required caveats and technical detail.
- **PAAD is the most explicitly complementary:** its own README recommends using it with Superpowers. Its unique value here is specialist review (notably accessibility and OWASP) around a separate implementation workflow.

### Individual skill installation

Capa distinguishes `plugins` from direct `skills` entries. A plugin is
unpacked into discovered skills and other supported artifacts; the documented
plugin entry does not offer a per-skill allowlist. To select one capability,
use a direct skill source and verify its path. Examples:
`obra/superpowers@systematic-debugging`,
`mattpocock/skills@domain-modeling`,
`Ovid/paad::plugins/paad/skills/agentic-owasp`,
`JuliusBrussee/caveman@caveman`, and
`DietrichGebert/ponytail@ponytail`. The Matt repository warns that some skills
depend on companions: `grill-me` and `grill-with-docs` need `grilling` and
`domain-modeling`.
[Capa v2.4.0 schema](https://github.com/infragate/capa/blob/v2.4.0/schema/capabilities.schema.json)
· [Matt dependency issue #685](https://github.com/mattpocock/skills/issues/685).

## Team versus solo (judgment, not measured evidence)

- **Teams seeking one repeatable process:** choose either Superpowers as the automatic lifecycle or a deliberately selected Matt-led workflow; document which owns planning, TDD, implementation, and review. Add PAAD checks as explicit, human-reviewed quality gates where relevant. Avoid globally stacking both style plugins without a shared decision about voice and code-size policy.
- **Solo users:** start with the workflow that fits how much process they want: Superpowers for an integrated automatic path; Matt skills for explicit, user-led modular workflows. Add individual PAAD review/audit skills or one style plugin only when a concrete gap warrants it.

These are fit-based recommendations from documented behavior, not a controlled head-to-head evaluation.

## Online discourse (anecdotal)

Searches found discussion about overlap and individual plugins, but no controlled study comparing all five together. Treat forum reports as anecdotes.

- **Superpowers + Matt:** In [Matt discussion #257](https://github.com/mattpocock/skills/discussions/257),
  one user says both can coexist but advises specifying which flow to use;
  another describes Superpowers planning work that was already fully specified.
  This supports trigger-ownership concerns, not a technical incompatibility.
  [Superpowers issue #1007](https://github.com/obra/superpowers/issues/1007)
  discusses composition through a third-party installation tool; the maintainer
  says that bridge belongs in the consuming tool.
  [Superpowers issue #2583](https://github.com/obra/superpowers/issues/2583)
  is an OpenCode skill-ID compatibility report, not a Matt conflict.
- **Caveman:** [Issue #721](https://github.com/JuliusBrussee/caveman/issues/721)
  reported duplicate manifest entries and was closed after a naming collision
  was addressed. [Issue #1083](https://github.com/JuliusBrussee/caveman/issues/1083)
  concerns OpenCode V2 and was marked fixed for that host/version.
  The [Hacker News benchmark discussion](https://news.ycombinator.com/item?id=47954745)
  reports a small 24-prompt, single-run-per-arm comparison; commenters question
  its statistical strength. These do not establish current cross-plugin
  conflicts or generalized savings.
- **Ponytail:** [Hacker News launch discussion](https://news.ycombinator.com/item?id=48527946)
  is mixed about minimalism and context-sensitive judgment. Project issues
  discuss install scope ([#311](https://github.com/DietrichGebert/ponytail/issues/311)),
  evaluation methodology ([#65](https://github.com/DietrichGebert/ponytail/issues/65)),
  and OpenCode V2 support ([#892](https://github.com/DietrichGebert/ponytail/issues/892));
  these are feature/version issues, not evidence of incompatibility with the
  other four.
- **PAAD:** The [r/perl discussion](https://www.reddit.com/r/perl/comments/1v44w36/how_to_write_productionquality_code_with_ai_yes/)
  contains positive user reports and general concerns about AI code quality
  and the need for tests/human review. PAAD's README says it complements
  Superpowers; this is the project's position, not independent evaluation.

Community search is not exhaustive. Silence on a particular pairing is not evidence of compatibility.
