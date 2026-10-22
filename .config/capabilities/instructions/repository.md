## Repository context

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

**Copier answers** (`copier.yml`): `project_name`, `ci` (`github` or `gitlab`), `use_agents`, `use_skills`, `use_taste_skill`. Post-copy checks mise; `lic` runs on copy; `capa install` runs automatically via mise's tool postinstall hook and its `capabilities.yaml` file watcher.

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
