# Contributing

This repository is a Copier template. Files under `template/` become files in
new projects. Contributions can improve the template, shared tooling, or documentation.

## Report a bug or propose a change

Search the [issue tracker](https://github.com/MRDGH2821/copier-mr-mise/issues)
before opening an issue. Use the bug or feature request form.
For a substantial change, discuss the problem and approach in an issue first.

For a bug report, include:

- The steps to reproduce it, plus the expected and actual results.
- Whether it occurs during `copier copy`, `copier update`, or work in this repository.
- Your operating system, relevant tool versions, and the Copier answers that affect it.
- Relevant log output with credentials and personal data removed.

For a feature request, explain the problem, the proposed solution, and alternatives.
Describe how the change affects projects generated from this template.

## Prepare your contribution

Fork the repository and clone your fork, or use a branch if you have write access.
Keep the change focused. Follow the existing configuration and file style.
Include documentation changes when setup or behavior changes.

## Set up the development environment

Install [mise](https://mise.jdx.dev/getting-started.html) before you start.
Run these commands from the repository root:

```sh
mise trust
mise install
mise run prepare
```

Read `mise.toml` before trusting it. Installation runs the configured tool hooks.
The `prepare` task installs the package dependencies with Bun.
The tool installation also configures Git hooks with hk.

If `capabilities.yaml` exists and you need the project skills or MCP tools, run
`mise run ai-setup`. Restart the agent session after installation.
If `AGENTS.md` exists, read it before using an AI agent on this project.

## Branch naming strategy

### For agents

When an AI agent creates a branch, it must use the following naming strategy:

`<human first name or username>/<work type>/<work name>`

For example:

- `john/feat/add-packages`
- `jane/fix/ui-bugs`
- `joy/refactor/payment`

`<human first name or username>` - will be derived from `git config user.name` or the author's first name. Ask the author for their first name if it's not available.
`<work type>` - the type of work being done (e.g., `feat`, `fix`, `refactor`). Should match commit types from conventional commits.
`<work name>` - the name of the work being done (e.g., `add-packages`, `ui-bugs`, `payment`)

### For humans

If you are one of the maintainers of this repo, ideally follow the same naming structure as stated in above section.
Shouldn't matter in long run.

If you are contributor, branch name wouldn't matter as it would be in your own fork. You are welcome to use same naming scheme as described above.

## Change the template safely

`copier.yml` defines the questions, exclusions, and copy or update tasks.
The `template/` directory contains the generated files.
Preserve Jinja expressions in filenames and files that end in `.jinja`.

When a tooling configuration exists at the root and under `template/`, update both.
The root configuration runs this repository. The template copy runs generated projects.
Keep common contribution policies aligned in both `CONTRIBUTING.md` files.
Keep template maintenance instructions in this root guide.

### Render the affected choices

Run these commands from the repository root. Use new directories outside the
repository for the generated output:

```sh
mise exec -- uvx --from copier copier copy --defaults --skip-tasks --vcs-ref=HEAD \
  --data project_name=TemplateCheck --data ci=github \
  --data use_agents=true --data use_skills=true \
  . ../copier-template-check-github

mise exec -- uvx --from copier copier copy --defaults --skip-tasks --vcs-ref=HEAD \
  --data project_name=TemplateCheck --data ci=gitlab \
  --data use_agents=false --data use_skills=false \
  . ../copier-template-check-gitlab
```

`uvx` runs Copier without adding it as a project dependency.
`--vcs-ref=HEAD` selects the current revision rather than the latest release tag.
`--skip-tasks` skips post-copy commands, including license generation.
These commands check rendering. They do not test post-copy commands or migrations.

Inspect the generated content and selected CI files.
Make sure that `AGENTS.md` and `capabilities.yaml` follow their selected options.
Repeat with other affected combinations of `ci`, `use_agents`, `use_skills`,
and `use_taste_skill`.

If a change affects post-copy commands, test them in a disposable project.
If it affects update behavior or migrations, test `copier update` from the relevant
previous template version and inspect the resulting changes.
Include the tested answers and starting version in your pull request.

## Format and check your changes

Run the configured tasks from the repository root:

```sh
mise run fmt
mise run check
```

The `fmt` task formats the repository. Review its diff before committing.
The `check` task runs hk checks and validates commit history with cocogitto.
These tasks are defined in `mise.toml`.

For a smaller formatting change, pass the affected files to
`mise exec -- hk fix --no-stage`. Agent-specific guidance for scoped checks
lives in `AGENTS.md`, when that file exists.

Fix hook failures and retry without bypassing the hooks.
Correct spelling errors. Add legitimate project terms to `.config/cspell.json`.
CI also runs MegaLinter. Read its reports and `.mega-linter.yml` when a check fails.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>(<scope>): <description>
```

The scope is optional.

Examples:

```text
fix(hk): correct the formatting hook
feat(mise): add a development tool
docs: clarify setup instructions
```

Use `cog.toml` for the configured scopes. Keep each commit focused on one change.
Follow any AI attribution and work-log requirements in the applicable `AGENTS.md`.

## Open a pull request

Describe the problem and the resulting behavior. Link the related issue, if any.
Include the following information:

- The root and template files affected by the change.
- The commands and Copier answer combinations that you tested.
- Any check failures, skipped checks, or compatibility effects.
- The effect on both new projects and existing projects that run `copier update`.

Review the final diff and keep unrelated changes out of the pull request.
Respond to review feedback and fix failed CI checks.
The GitHub workflows run mise checks and MegaLinter.
