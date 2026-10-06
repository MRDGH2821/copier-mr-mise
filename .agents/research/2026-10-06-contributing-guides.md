# Research: contribution guides

Researched on 2026-10-06 for `copier-mr-mise` and the projects it generates.
The observations below come from first-party documentation and repository files.
Recommendations are our interpretation of those examples and the local configuration,
not requirements imposed by the upstream projects.

## What public repositories do

- **GitHub makes the guide discoverable.** A contribution guide can live at the
  repository root, in `docs/`, or in `.github/`. GitHub links it from issue and pull
  request creation. Its suggested content includes useful issue and pull request
  instructions and links to existing community documentation. Keep our existing
  root location and write for someone making their first contribution.
  [GitHub contributor guidelines](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors).
- **Copier describes the whole contributor journey.** Its guide covers bug reports,
  feedback, setup, local checks, pull requests, and commit messages. Bug reports
  request operating system, local setup, and reproduction steps. Feature proposals
  should have narrow scope. Pull requests need appropriate tests, passing CI, and
  documentation for significant changes. Copier uses Conventional Commits. These
  are useful patterns for our template maintenance guide; its Python development
  commands belong to Copier itself and should not be copied here.
  [Copier contributing](https://copier.readthedocs.io/en/stable/contributing/).
- **Cookiecutter separates contribution types from execution.** It welcomes bug
  fixes and documentation, gives setup and testing instructions, discourages
  combining unrelated features, and asks for contained pull requests with tests,
  documentation updates, and passing CI. It also contains a substantial core
  committer handbook. Our guides need the contributor workflow, without adopting
  its project-specific governance or Python conventions.
  [Cookiecutter contribution guide](https://raw.githubusercontent.com/cookiecutter/cookiecutter/main/CONTRIBUTING.md).
- **mise ties instructions to the actual development tasks.** Its guide covers
  prerequisites, installation, supported tasks, a pull request checklist, and
  hooks. It tells contributors to inspect resolved tasks and run focused checks.
  Non-obvious changes should be discussed before substantial implementation.
  Conventional pull request titles are a mise policy; our existing commit policy
  can be documented without inventing new title enforcement.
  [mise contributing](https://mise.jdx.dev/contributing.html).
- **hk makes validation concrete.** Its guide lists focused test and lint commands,
  identifies documentation sources, asks contributors to explain the problem,
  resulting behavior, and validation, and uses Conventional Commits. It links
  coding agents to separate agent guidance. That supports keeping the contributor
  guide readable for humans while retaining detailed agent execution rules in
  `AGENTS.md`.
  [hk contributing](https://hk.jdx.dev/contributing.html).

## Apply to both guides

Use a short workflow: find or report a problem, prepare the environment, make one
focused change, verify it, and submit a reviewable pull request or merge request.
For reports, request expected and actual behavior, reproduction steps, relevant
versions, and useful command output. Ask for discussion before large changes,
without making an issue mandatory for small corrections.

Document the tooling already present: install mise, inspect the configuration,
install project tools, discover tasks with `mise tasks ls`, and use configured
checks. The inspected root `mise.toml` defines `prepare`, `check`, `format`/`fmt`,
and `ai-setup`; `.config/hk.pkl` defines checks and formatting. Explain that
formatting changes files and contributors should review the resulting diff.
Keep full-repository checks distinguishable from checks for affected files.

Describe Conventional Commits and point to `cog.toml` for configuration. Preserve
the user's existing agent branch naming section and its examples. Keep the rule
explicitly limited to branches created by AI agents. This policy comes from the
user, rather than the researched repositories.

Finish with a short submission checklist: focused diff, relevant verification,
updated documentation, explanation of the result, and disclosure of checks that
failed or could not run. Use “pull request or merge request” where the host is
unknown, since the template offers GitHub and GitLab.

## Root repository only

Explain that this repository maintains a Copier template. `copier.yml` owns
questions and generation behavior; `template/` contains generated project files.
For shared configuration, update both copies. Contributor reports should include
Copier answers and whether the failure occurred during copy or update.

Include a repeatable render check using the working checkout and disposable
output directories. Exercise affected answer combinations, especially GitHub
versus GitLab and optional agents/skills. Inspect the generated files and links;
a successful render alone does not establish that the documented commands work.
Keep post-copy tasks separate from a rendering check so contributors do not
mistake skipped side effects for tested behavior. These recommendations follow
the local template's configuration and the distinction Copier makes between
questions, settings, and tasks.
[Copier template configuration](https://copier.readthedocs.io/en/stable/configuring/).

## Generated projects only

Refer to their own README, task configuration, dependencies, and tests. Do not
assume a language, application build command, test suite, repository URL, or
community channel. Make AI setup conditional on `capabilities.yaml` and references
to agent guidance conditional on `AGENTS.md` existing. Keep the guide useful when
both optional features are disabled. Application maintainers can add concrete
build and test instructions as their project develops.

## Deliberate omissions

Do not add a contributor agreement, mandatory sign-off, maintainer voting rules,
response-time promise, security contact, release authority, or code of conduct
link without an existing local policy. Copier, mise, and hk have their own AI
policies; they are examples of explicit local decisions, not defaults to import.
Avoid copying upstream dependency lists or inventing `mise run test` when no such
task exists. Research citations belong in this note so routine contributor
instructions stay focused on this repository's workflow.
