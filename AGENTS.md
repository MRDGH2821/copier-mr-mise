# AGENTS Instructions

This file provides guidance for AI coding assistants working with this project.

## Andrej Karpathy's Guidelines

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

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

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Setup: skills and MCP

Before substantive work, ensure project skills and MCP servers are installed.

1. From the repository root, run `mise run ai-setup`, or:

   ```sh
   capa install
   ```

2. **Reload the agent** (new chat / restart the agent session) so installed skills and MCP servers are picked up.

Configuration lives in `capabilities.yaml`. Do not skip this when skills or MCP tools are missing or stale.

## Project Context

- **Project**: `copier-mr-mise` (v0.1.0) — Copier 9+ template for MRDGH2821 projects
- **Purpose**: Scaffold new repos with mise tools, hk git hooks, MegaLinter, cspell, and optional AGENTS.md / capa skills
- **Usage**: `copier copy gh:MRDGH2821/copier-mr-mise "/path/to/folder"` then later `copier update`

This repository is the **template**, not a generated project. Generated files live under `template/` (`_subdirectory: template` in `copier.yml`).

## Layout

| Path                   | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------ |
| `copier.yml`           | Copier questions, exclusions, post-copy tasks                |
| `template/`            | Files copied into generated projects                         |
| `mise.toml`            | Tools, tasks, `hk install --mise` postinstall hook           |
| `.config/hk.pkl`       | hk hook config (pre-commit, commit-msg, fix, check)          |
| `capabilities.yaml`    | Skills, MCP servers, and providers (capa)                    |
| `cog.toml`             | Conventional-commit scopes and version bump hooks            |
| `.mega-linter.yml`     | MegaLinter config; CI in `.github/workflows/mega-linter.yml` |
| `.config/treefmt.toml` | Full-tree formatter                                          |
| `.config/cspell.json`  | Spell-check dictionary                                       |
| `.agents/logs/`        | AI-assisted work logs                                        |

Many tooling files exist at the **root** (this repo) **and** under `template/` (generated projects). When you change a shared config, update both copies.

**Jinja templates** (do not break Copier syntax): `template/README.md.jinja`, `template/package.json.jinja`, `template/capabilities.yaml.jinja`, `template/.v8rignore.jinja`, `template/{{_copier_conf.answers_file}}.jinja`.

**Copier answers** (`copier.yml`): `project_name`, `ci` (`github` or `gitlab`), `use_agents`, `use_skills`, `use_taste_skill`. Post-copy checks direnv and Nix; `lic` runs on copy; `capa install` runs automatically via mise's tool postinstall hook and its `capabilities.yaml` file watcher.

## General Guidelines

### Communication

- Explain what you're doing and why before making changes
- Ask for clarification when requirements are ambiguous
- Provide context for decisions, especially when multiple approaches exist

### Code Quality

- Follow existing code style and conventions in the project
- Run linters and formatters before committing changes
- Ensure all changes pass git hooks (`hk run pre-commit`)

### File Operations

- Always check if a file exists before attempting to modify it
- Use appropriate tools to search for files rather than guessing paths
- Preserve file formatting and structure unless explicitly asked to change it

## Dev Environment Tips

- Use `--help` or `help` subcommand to get help on a command. It can even reveal hints on how to proceed ahead or optimize the number of steps.
- Check tool documentation before asking the user for configuration details
- Tools are managed by **mise**. Prefer `mise run <task>` over ad-hoc binaries when a task exists.

## Tooling

### mise & hk

Use the configured mise mcp server. If mise's mcp tools are not available, tell the user to fix by referring the following:

- For mise - <https://mise.jdx.dev/mcp.html>
- For hk - <https://hk.jdx.dev/agents.html#mcp>

### Using hk from a coding agent

Inspect and plan before running. Scope checks to changed files with `--files0-from` and use `--cd` to select the project root. Prefer `--safe`, inspect command effects, and require approval for unknown or destructive commands.

Consume JSON or JSONL diagnostics while retaining raw output, and always review the diff produced by a fix.

MCP clients should use `inspect_project`, `plan`, safe run tools, paged output, and `get_diff` rather than invoking arbitrary shell commands.

### MegaLinter

- Config: `.mega-linter.yml` (CI: oxsecurity/megalinter v10.0.0)
- Use the project MegaLinter skill rather than inventing a flavor
- Reports: `megalinter-reports/`
- Not all linters need to pass — some are informational

### CSpell

- Config: `.config/cspell.json`
- Add project-specific words to the `words` array
- Don't disable spell checking without good reason
- Run with `mise run cspell`

### Formatting and Hooks (hk)

- Run `hk run fix` or `mise run fmt` before committing to format all supported file types
- `hk` integrates formatters and linters in `.config/hk.pkl` for staged files and hook checks

## Troubleshooting

### Common Issues

**Git hooks failing on commit:**

- Read the error message — it usually points directly to the fix
- Try to fix the issue and retry the commit; do not skip hooks
- Fix formatting first (`hk run fix` or `mise run fmt`)
- Then address spell checking and linting

**Spell check failures:**

- Add legitimate technical terms to `.config/cspell.json` `words` array
- Use proper capitalization for proper nouns
- Don't add obvious typos to the dictionary

**Template syntax errors:**

- Ensure Jinja / Copier syntax is valid before committing
- Check for missing closing tags or brackets
- Test with `copier copy` into a throwaway directory when changing `copier.yml` or `template/`

### Getting Help

- Review existing configuration files for examples

## Best Practices

### Before Making Changes

1. Understand the current state of the project
2. Check if similar functionality already exists
3. Review relevant configuration files
4. Consider impact on users who will generate projects from this template
5. If the file also exists under `template/`, update both (and `template/AGENTS.md` when changing these instructions)

### When Adding Dependencies

- Prefer tools that don't require heavy installation; add them via `mise.toml` when they should ship with the template
- Document installation steps clearly
- Consider cross-platform compatibility
- Update relevant configuration files in **root and** `template/`

### Testing Changes

- Verify the project structure is correct
- Test template rendering with Copier when template files change
- Ensure documentation is updated
