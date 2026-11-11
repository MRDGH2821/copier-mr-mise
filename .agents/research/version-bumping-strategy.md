# Version-bumping and release strategy

## Recommendation at a glance

**Recommendation (judgment):** treat versioning as a maintainer-controlled
release PR, not as a direct push to protected `main`. Run Cocogitto on a named
work branch based on current `main`, inspect the version and changelog diff, and
merge that PR using a merge commit if available. Push the signed version tag
only after the PR has merged; then publish a GitHub Release separately if the
project intends a public release. This keeps `main` protected and preserves the
tagged bump commit as an ancestor when using a merge commit. GitHub protection
rules can require PRs and disallow force pushes, while merge methods determine
commit identity/history
([CONTRIBUTING.md](../../CONTRIBUTING.md#branch-naming-strategy),
[GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches),
[GitHub merge methods](https://docs.github.com/en/pull-requests/reference/pull-request-merges)).

Do **not** assume every PR uses a merge commit. The observed merge commit for PR #29 is evidence of that merge only; check the actual release PR's selected merge method before relying on its tag target ([PR #29](https://github.com/MRDGH2821/copier-mr-mise/pull/29)).

## What this repository currently does

- The repository's current package version is `0.25.2` ([`package.json`](../../package.json#L1-L4)).
- `cog.toml` sets `disable_bump_commit = false`, so Cocogitto is configured to create a version-bump commit; `disable_changelog = true`, so its built-in changelog append is disabled ([`cog.toml`](../../cog.toml#L1-L8); [Cocogitto config reference: `disable_bump_commit`, `disable_changelog`](https://docs.cocogitto.io/reference/config.html#disable-bump-commit)).
- Instead, the configured pre-bump hooks set the package version with `bun pm version {{version}} --no-git-tag-version`, generate `CHANGELOG.md` with `bunx git-cliff -o CHANGELOG.md --tag {{version_tag}}`, then run `hk fix CHANGELOG.md` ([`cog.toml`](../../cog.toml#L12-L17)). Cocogitto runs pre-bump hooks before creating the version commit ([Cocogitto bump guide: pre-bump hooks](https://docs.cocogitto.io/guide/bump.html#pre-bump-hooks)).
- `tag_prefix = "v"` means the version tag is prefixed, e.g. `v0.25.3`; Cocogitto documents this prefix as applying to generated versions and tag-oriented commands ([`cog.toml`](../../cog.toml#L37-L38); [Cocogitto config reference: `tag_prefix`](https://docs.cocogitto.io/reference/config.html#tag-prefix)).
- The post-bump hook runs
  `git tag {{version_tag}} {{version_tag}}^{} --force --sign`. In Git's tag
  syntax this force-creates a signed tag named for the version, targeting the
  commit resolved by the existing tag's `^{}` peel expression; Cocogitto runs
  post-bump hooks after its version commit/tag steps
  ([`cog.toml`](../../cog.toml#L9-L10);
  [Cocogitto bump guide](https://docs.cocogitto.io/guide/bump.html#automatic-versioning)).
  It creates a **local Git tag**; the hook does not push it or publish a GitHub
  Release ([same hook](../../cog.toml#L9-L10);
  [Cocogitto post-bump hooks](https://docs.cocogitto.io/guide/bump.html#post-bump-hooks)).
- Cocogitto is configured to ignore merge commits for bump analysis. Therefore release-driving commit types should remain visible in non-merge commits that Cocogitto sees; for squash-based PRs, use an intentional Conventional Commit squash title/message ([`cog.toml`](../../cog.toml#L7-L8); [Cocogitto bump guide](https://docs.cocogitto.io/guide/bump.html#auto-bump-commit-types)).
- Contribution instructions require PRs in the repo's development flow and prescribe branch names in the form `<username>/<work type>/<work name>` for agents; they also require Conventional Commit messages ([`CONTRIBUTING.md`](../../CONTRIBUTING.md#branch-naming-strategy), [`CONTRIBUTING.md`](../../CONTRIBUTING.md#commit-messages)).

## What `cog bump` does

Cocogitto documents `cog bump` as calculating a version from commits since the
latest SemVer tag, running configured pre-bump hooks, generating a changelog
unless disabled, creating a version commit and Git tag, then running post-bump
hooks ([Cocogitto automatic versioning](https://docs.cocogitto.io/guide/bump.html#automatic-versioning)).
Here, explicit hooks make the file changes; `disable_changelog = true` disables
Cocogitto's own changelog step ([`cog.toml`](../../cog.toml#L3-L4),
[config reference](https://docs.cocogitto.io/reference/config.html#disable-changelog)).

Use `cog bump --auto --dry-run` to preview without changing files. For a real
automatic bump, use `cog bump --auto`. Cocogitto also documents `--major`,
`--minor`, `--patch`, `--version <version>`, `--pre <metadata>`, and
`--build <metadata>` ([Cocogitto bump flags](https://docs.cocogitto.io/guide/bump.html#automatic-versioning)).
Prefer `--auto` when commit history matches the intended release impact; select
an explicit increment only when the maintainer determines the history-derived
result is inappropriate.

The version-bump commit, changelog, tag, and GitHub Release are different things:

1. **Version/changelog file edits:** the configured hooks update `package.json` and `CHANGELOG.md` before the version commit ([`cog.toml`](../../cog.toml#L12-L17); [Cocogitto hook order](https://docs.cocogitto.io/guide/bump.html#pre-bump-hooks)).
2. **Bump commit:** with `disable_bump_commit = false`, Cocogitto creates a commit containing the hook-generated changes; this repository setting is explicit ([`cog.toml`](../../cog.toml#L1-L3); [Cocogitto config reference](https://docs.cocogitto.io/reference/config.html#disable-bump-commit)).
3. **Git tag:** Cocogitto creates a tag, and this repo's post-hook force-recreates it as a signed tag; this does not push it ([`cog.toml`](../../cog.toml#L9-L10); [Cocogitto bump steps](https://docs.cocogitto.io/guide/bump.html#automatic-versioning)).
4. **GitHub Release:** GitHub Releases are a separate publication based on a Git tag, with distinct release notes/assets/publication controls ([GitHub: About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases); [Managing releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)).

Cocogitto's default mapping is `fix` → patch, `feat` → minor, and a breaking
change (`BREAKING CHANGE:` footer or `!`) → major
([Cocogitto bump guide](https://docs.cocogitto.io/guide/bump.html#auto-bump-commit-types)).
This matches Conventional Commits
([specification](https://www.conventionalcommits.org/en/v1.0.0/)) and SemVer's
compatibility rules ([SemVer 2.0.0](https://semver.org/spec/v2.0.0.html)).
Other Conventional Commit types have no implicit SemVer effect unless they
mark a breaking change
([Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)).

## Recommended safe release sequence

1. **Finish and merge product changes first.** Land feature/fix PRs to `main` through the repository's required review/check process. This lets the release bump be calculated against the integrated history rather than an unmerged feature branch; protected branch rules can require changes to reach the branch through PRs ([GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)).
2. **Create a release PR branch from current `main`.** Use the repo's branch pattern, e.g. `<username>/chore/release-version`, and ensure the release PR is based on the current target branch ([`CONTRIBUTING.md`](../../CONTRIBUTING.md#branch-naming-strategy); [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)).
3. **Preview, then bump.** Run `cog bump --auto --dry-run`; review whether the calculated increment matches the changes. Then run `cog bump --auto` on that branch. Cocogitto's pre-hooks update package version/changelog, its configured bump commit records them, and the signed-tag hook runs locally ([`cog.toml`](../../cog.toml#L1-L17); [Cocogitto bump guide](https://docs.cocogitto.io/guide/bump.html)).
4. **Inspect the release PR.** Confirm `package.json` version, `CHANGELOG.md` content, the generated bump commit, and expected signed local tag name/target. The release PR transports file edits and commits to `main`; the tag still needs to target the commit object that actually lands on `main` ([GitHub merge methods](https://docs.github.com/en/pull-requests/reference/pull-request-merges)).
5. **Merge using a method compatible with the local tag.** Prefer a merge
   commit: GitHub retains the branch commits, including the bump commit, as
   ancestors of the merge result ([GitHub merge methods](https://docs.github.com/en/pull-requests/reference/pull-request-merges)).
   After merging, verify that the bump commit is reachable from `main`, then
   push the existing signed tag. Do not push the tag before merging the PR.
6. **Publish separately.** After the tag is present remotely and points to the intended release commit, create/publish a GitHub Release for that tag if a public release is desired. GitHub release creation can select an existing tag, and release publication is separate from tag creation ([GitHub managing releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)).

## If the PR is not merged with a merge commit

A tag points to a particular Git object, not to the eventual contents of a PR. GitHub's merge methods have different object/history outcomes ([GitHub merge methods](https://docs.github.com/en/pull-requests/reference/pull-request-merges)).

- **Squash merge:** GitHub combines the PR commits into a new commit on the
  base branch. The pre-merge tag points to the original branch bump commit, not
  the squash commit. Do not push that tag as the release tag. After merging,
  recreate/sign the version tag against the merged `main` commit, then push it.
  The version and changelog file contents survive in the squashed tree, but the
  original bump-commit identity does not
  ([GitHub squash merge behavior](https://docs.github.com/en/pull-requests/reference/pull-request-merges#squash-and-merge-your-commits)).
  Ensure the squash message is a valid Conventional Commit: this repo ignores
  merge commits and automatic bumps depend on commit messages
  ([`cog.toml`](../../cog.toml#L7-L8);
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)).
- **Rebase and merge:** GitHub writes new commit SHAs when it rebases PR commits
  onto the base branch. The local tag still points to the old SHA, so do not
  push it as the release tag. After merging, create/sign the tag against the
  corresponding new bump commit on `main` (or the intended release commit) and
  push it
  ([GitHub rebase merge behavior](https://docs.github.com/en/pull-requests/reference/pull-request-merges#rebase-and-merge-your-commits)).
- **If local tags were accidentally pushed before a squash/rebase merge:** do not force-move a published release tag casually. SemVer says released version contents must not be modified; treat a wrongly published tag as a release incident and follow repository policy rather than silently retargeting an already-consumed release ([SemVer rule 3](https://semver.org/spec/v2.0.0.html#spec-item-3)).

## Sources

- Repository config: [`cog.toml`](../../cog.toml)
- Repository release/contribution convention: [`CONTRIBUTING.md`](../../CONTRIBUTING.md)
- Current manifest version: [`package.json`](../../package.json)
- Cocogitto official docs: [automatic versioning](https://docs.cocogitto.io/guide/bump.html), [configuration reference](https://docs.cocogitto.io/reference/config.html)
- SemVer official specification: [2.0.0](https://semver.org/spec/v2.0.0.html)
- Conventional Commits official specification: [1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- GitHub official docs: [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [PR merge methods](https://docs.github.com/en/pull-requests/reference/pull-request-merges), [about releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases), [managing releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
