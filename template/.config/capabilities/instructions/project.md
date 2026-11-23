## Agent instruction sources

Edit this file for shared guidance. Use other files in
`.config/capabilities/instructions/` for project-specific context and
`.config/capabilities/rules/` for shared policies.

After editing these sources, run `mise run ai-setup` when `capabilities.yaml`
exists. Otherwise, keep corresponding `AGENTS.md` sections in sync. Keep
editable sources outside `.agents/rules/`; Capa prunes that generated directory.

### Conditional guidance

Read the relevant rule before acting:

- Branching, committing, or creating a pull request: `.config/capabilities/rules/commits.md`.
- Committing or publishing or editing reviews, pull requests, issues, or comments: `.config/capabilities/rules/ai-attribution.md`.
- Recording AI-assisted work: `.config/capabilities/rules/ai-logs.md`.
- Reviewing on behalf of a human: `.config/capabilities/rules/ai-reviews.md`.
- Using mise or hk, or running project checks: `.config/capabilities/rules/tooling.md`.

### Dependencies

Prefer lightweight, cross-platform dependencies. Use the project's package
manager, update relevant configuration and lockfiles, and document installation.

### Verification and documentation

If no relevant test or check exists, verify behavior directly. Update
documentation when setup or behavior changes.
