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

<!-- capa:start:rule:ai-co-author -->
## AI Co-authored-by Trailer (MANDATORY)

Every AI-assisted commit MUST include this trailer:

```txt
Co-authored-by: <Model full Name and version> via <Harness> <noreply@provider-domain>
```

Use the email address for the model provider, not the harness provider.

| Provider                | noreply address          |
| ----------------------- | ------------------------ |
| Anthropic (Claude)      | `noreply@anthropic.com`  |
| Cursor                  | `cursoragent@cursor.com` |
| Google (Gemini)         | `noreply@google.com`     |
| Meta (Llama)            | `noreply@meta.com`       |
| Microsoft (Copilot)     | `noreply@microsoft.com`  |
| Mistral                 | `noreply@mistral.ai`     |
| OpenAI (GPT / o-series) | `noreply@openai.com`     |
| xAI (Grok)              | `noreply@x.ai`           |

If a provider is missing, search its official documentation or public
repositories for a documented address; never guess from the provider's domain.

Use the full model name and version supplied by the session. If the exact
version is unavailable, use the most specific known name and do not guess.
Use the common harness name. Add one trailer per AI model; never omit it.

Example:

```txt
fix(cspell): resolve configuration issue

Co-authored-by: GPT-4o via Cursor <noreply@openai.com>
```
<!-- capa:end:rule:ai-co-author -->

<!-- capa:start:rule:ai-logs -->
## AI-assisted work documentation

- Document all AI-assisted changes in the `.agents/logs` folder as markdown files
- Use the naming format: `YYYY-MM-DD.md` (e.g., `2024-12-15.md`)
- Each documentation file should include:
  - The prompt or request that initiated the work
  - The author of the prompt (can be obtained from `git config user.name` or by asking the user)
  - Description of what was done
  - Which AI model was used (e.g., Claude Sonnet 4.5, GPT-4, etc.)
- If more prompts are provided on the same day, append them to the existing log file with timestamps
- Use the `date` command to generate timestamps (e.g., `date --iso-8601=seconds` or `date '+%Y-%m-%d %H:%M:%S'`)
- Place any other relevant documents (prompts, examples, references) in the `.agents` folder
- This provides transparency and helps track AI contributions to the project
<!-- capa:end:rule:ai-logs -->

<!-- capa:start:rule:ai-reviews -->
## AI-Assisted Reviews

When reviewing on behalf of a human, end with this footer. Get the model name,
harness, and provider address from
`.config/capabilities/rules/ai-co-author.md`.

```md
***

<sub>Co-authored-by: <Model full Name and version> via <Harness> <noreply@provider-domain></sub>
```
<!-- capa:end:rule:ai-reviews -->

<!-- capa:start:rule:tooling -->
## Tooling policy

### Setup: skills and MCP

Prefer an existing `mise run <task>` over an ad-hoc command. Inspect
`mise.toml` and command `--help` output before assuming a task or option exists.

Consult tool documentation and existing config examples before asking the user
about configuration.

If `capabilities.yaml` exists and project skills or MCP tools are missing or
stale:

1. From the repository root, run `mise run ai-setup` (or `capa install --yes`).
2. Reload the agent session so installed skills and MCP servers are picked up.

If the project omits `capabilities.yaml`, use the available tools and
instructions.

### mise & hk

Use configured mise and hk MCP tools when available. If their configuration is
missing, report it and refer to:

- mise: <https://mise.jdx.dev/mcp.html>
- hk: <https://hk.jdx.dev/agents.html#mcp>

### Using hk from a coding agent

Inspect the configuration and plan before running checks. Scope them to changed
files with `--files0-from` and select the project root with `--cd`. Prefer
`--safe`; review command effects and require approval for unknown or destructive
commands.

Use `--no-stage` when formatting and `--stash none` when checking explicit
working-tree files.

Retain raw JSON or JSONL diagnostics and review diffs from fixes. MCP clients
should use `inspect_project`, `plan`, safe run tools, paged output, and
`get_diff`.

### CSpell

Use the hk `cspell` step configured in `.config/hk.pkl`. Fix spelling errors
and add legitimate project terms to `.config/cspell.json` instead of disabling
the check.

### Formatting and hooks

Before committing, format affected files with `hk fix --no-stage` and run
`hk run pre-commit --check` on the same files. Resolve failures and retry
without skipping hooks. `mise run fmt` formats the full repository; review its
scope before running it.

If a hook fails, follow its diagnostic, fix the cause, and retry.
<!-- capa:end:rule:tooling -->

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
| ----------------------------------- | --------------------------------------------- |
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
