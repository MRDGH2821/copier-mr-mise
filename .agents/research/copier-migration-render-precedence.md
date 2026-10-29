# Copier migration: rename an old file and render the current template

**Conclusion:** A `before` migration can move a legacy config to a path newly added by the current template, but this does not reliably merge the old config with the rendered file or produce conflict markers. In a disposable update from v0.9.0 to the current template, a user change to `.cspell.json` was replaced by the rendered `.config/cspell.json` without a conflict marker. See [Test result](#test-result).

## Why

Copier's update flow runs pre-migrations on the project, then applies the template update, then runs post-migrations. The update guide describes this sequence and the conflict behavior (`inline` by default, or `.rej` files with `--conflict rej`). [Updating a project: how the update works and conflicts](https://copier.readthedocs.io/en/stable/updating/).

Copier v9.19.1 runs `before` migrations before applying the template update and specially handles files newly added in both the project and rendered template. This does not guarantee preservation or conflict markers at a newly added template path; the test below observed the rendered content replacing the migration's content.

[Migration sequencing](https://github.com/copier-org/copier/blob/v9.19.1/copier/_main.py#L1430-L1438) · [Same-path additions](https://github.com/copier-org/copier/blob/v9.19.1/copier/_main.py#L1516-L1533) · [Diff application](https://github.com/copier-org/copier/blob/v9.19.1/copier/_main.py#L1573-L1580) · [Cleanup and post-migrations](https://github.com/copier-org/copier/blob/v9.19.1/copier/_main.py#L1706-L1713).

Copier migration entries support `command`, optional `version`, and optional `when`; default stage is `after`. Migrations run in declaration order, only on updates, and a versioned migration runs when `new version >= migration version > old version`. Unversioned migrations run on every update. [Copier migration settings](https://copier.readthedocs.io/en/stable/configuring/#migrations).

The destination file must be present in Copier's template tree under the desired rendered path (or use Copier's normal Jinja path templating); Copier renders template paths/content as part of generating the new template version. Conditional filenames use Jinja in the path and retain the `.jinja` suffix outside the conditional. [Conditional files and directories](https://copier.readthedocs.io/en/stable/configuring/#conditional-files-and-directories).

## Test result

Using Copier 9.19.1, I generated a project from v0.9.0, changed `.cspell.json`'s `caseSensitive` value from `false` to `true`, committed the fixture, and updated to the current template with `--conflict=inline`.
The migration moved the config to `.config/cspell.json`; the resulting file had the rendered template value `false`. No conflict markers appeared, and the old `.cspell.json` path was removed.

The same update produced `~` backups at `.oxfmtrc.json~`, `.config/ryl.toml~`, and `.config/mise/config.toml~` through existing `mv -b` migrations. The disposable project was removed after inspection.

This confirms the direct-move approach does not meet the goal of preserving old edits for review. The update docs describe inline markers for merge conflicts, but they do not promise that this migration/path-addition case will create one. [Copier update conflict behavior](https://copier.readthedocs.io/en/stable/updating/).

## Repository-specific observations

Root [`copier.yml`](../../copier.yml#L24-L106) has `_min_copier_version: 9.3.0` and before/after migration examples, including versions `v0.16.0` and `v0.24.0`.
Its `mv -b` commands preserve a backup if the destination already exists; plain `mv` may replace an existing destination on typical Unix systems.
Guard moves and choose an explicit collision policy. Existing repository discussion of file renames/removals is in [copier-update-file-removal.md](copier-update-file-removal.md).
