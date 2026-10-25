# AGENTS Instructions

This file provides guidance for AI coding assistants working with this project.

If none of the skills or tools specified in `mise.toml` are available, run the following commands and alert the user to reload the agent.

```sh
mise trust
mise install
mise run prepare
```

Refuse to do anything until `mise run prepare` has run atleast once and the agent is reloaded with the skills & MCP servers as specified in `capabilities.yaml`.
MCP servers should be accessible via Capa MCP.

<!-- capa:start:rule:engineering -->
## Engineering Guidelines

- Explain the intended change, state material assumptions, and clarify ambiguous requirements.
- Read the relevant code and configuration before editing; reuse existing functionality.
- Inspect the working tree and preserve changes made by the user or other agents.
- Match existing style and keep every changed line within the requested scope.
- Define how to verify the change, run the relevant checks, and review the final diff.
- Report what changed, which checks ran, and any failures or checks you could not run.
<!-- capa:end:rule:engineering -->

<!-- capa:start:rule:commits -->
## Commit policy

### Branch naming strategy

Before creating a branch, follow the branch naming strategy in the project-root
`CONTRIBUTING.md` (`#branch-naming-strategy`).

### Commit Messages

Every commit MUST be atomic (one logical change), and every commit message MUST use Conventional Commits format: `<type>(<scope>): <description>`.
Consult `cog.toml` for valid scopes and release hooks; it is the source of truth.

Version bumps use cocogitto (`cog bump`). Inspect the configured hooks before
running a release command.
<!-- capa:end:rule:commits -->

<!-- capa:start:__base__ -->
## Agent instruction sources

Edit this file for shared guidance. Use other files in
`.config/capabilities/instructions/` for project-specific context and
`.config/capabilities/rules/` for shared policies.

After editing these sources, run `mise run ai-setup` when `capabilities.yaml`
exists. Otherwise, keep corresponding `AGENTS.md` sections in sync. Keep
editable sources outside `.agents/rules/`; Capa prunes that generated directory.

### Conditional guidance

Read the relevant rule before acting:

- Branching or committing: `.config/capabilities/rules/commits.md`.
- For an AI-assisted commit, also read `.config/capabilities/rules/ai-co-author.md`.
- Recording AI-assisted work: `.config/capabilities/rules/ai-logs.md`.
- Reviewing on behalf of a human: `.config/capabilities/rules/ai-reviews.md`.
- Using mise or hk, or running project checks: `.config/capabilities/rules/tooling.md`.

### Dependencies

Prefer lightweight, cross-platform dependencies. Use the project's package
manager, update relevant configuration and lockfiles, and document installation.

### Verification and documentation

If no relevant test or check exists, verify behavior directly. Update
documentation when setup or behavior changes.
<!-- capa:end:__base__ -->

<!-- capa:start:repository-context -->
## Copier Template Repository context

### Project Context

- **Project**: `copier-mr-mise` — Copier 9+ template for MRDGH2821 projects
- **Purpose**: Scaffold new repos with mise tools, hk git hooks, MegaLinter, cspell, and optional AGENTS.md / capa skills
- **Usage**: `copier copy gh:MRDGH2821/copier-mr-mise "/path/to/folder"` then later `copier update`

This repository is the **template**, not a generated project. Generated files live under `template/` (`_subdirectory: template` in `copier.yml`).

### Template repository layout

| Path                                | Purpose                                       |
|-------------------------------------|-----------------------------------------------|
| `copier.yml`                        | Copier questions, exclusions, post-copy tasks |
| `template/`                         | Files copied into generated projects          |
| `.github/workflows/mega-linter.yml` | MegaLinter CI configuration                   |

### Copier maintenance

Many tooling files exist at the **root** (this repo) **and** under `template/` (generated projects). When you change a shared config, update both copies.
Keep common policies in `.config/capabilities/rules/` and `template/.config/capabilities/rules/` aligned; keep Copier maintenance instructions in `.config/capabilities/instructions/repository.md`.

**Jinja templates** (do not break Copier syntax): `template/AGENTS.md.jinja`, `template/CLAUDE.md.jinja`, `template/README.md.jinja`, `template/package.json.jinja`, `template/capabilities.yaml.jinja`, `template/.v8rignore.jinja`, `template/{{_copier_conf.answers_file}}.jinja`.

**Copier answers** (`copier.yml`): `project_name`, `ci` (`github`, `gitlab`, or `forgejo`), `use_ai`, and `use_taste_skill` (available only when `use_ai` is enabled). Post-copy checks mise; `lic` runs on copy; Capa installs managed agent files and skills from `capabilities.yaml`.

**Template syntax errors:**

- Ensure Jinja / Copier syntax is valid before committing
- Check for missing closing tags or brackets
- Test with `copier copy` into a throwaway directory when changing `copier.yml` or `template/`

#### Before changing the template

1. Consider impact on users who will generate projects from this template
2. If the file also exists under `template/`, update both (including `template/.config/capabilities/` when changing these instructions)

#### Dependency configuration

- Update relevant configuration files in **root and** `template/`

#### Template validation

- Test template rendering with Copier when template files change
<!-- capa:end:repository-context -->

<!-- capa:start:rule:karpathy-guidelines -->
---
description: Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code to avoid overcomplication, make surgical changes, surface assumptions, and define verifiable success criteria.
alwaysApply: true
---

# Karpathy behavioral guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
<!-- capa:end:rule:karpathy-guidelines -->
