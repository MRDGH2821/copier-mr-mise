# mise lockfile changes and automatic package installs

Researched on 2026-10-24 against the official mise documentation index and the linked official docs. Repository configuration was inspected in [`mise.toml`](https://github.com/MRDGH2821/copier-mr-mise/blob/v0.23.0/mise.toml) and [`template/mise.toml.jinja`](https://github.com/MRDGH2821/copier-mr-mise/blob/v0.23.0/template/mise.toml.jinja). <!-- rumdl-disable-line existing-relative-links -->

## Findings

- **mise does not generally auto-detect a project's package manager or lockfile and install dependencies by default.** The official docs index lists [Hooks](https://mise.jdx.dev/hooks.html) and [Project dependencies (experimental)](https://mise.jdx.dev/dev-tools/deps.html) as separate documentation topics. The project-dependencies feature says to configure providers explicitly; mise does not detect them on its own. [Official index](https://mise.jdx.dev/llms.txt); [Project dependencies](https://mise.jdx.dev/dev-tools/deps.html#enable-and-disable-providers)

- **`[[watch_files]]` is a configured file-change hook, not dependency installation behavior by itself.** It runs the configured command/task when a matching pattern changes; patterns are globs relative to the project root.
  It checks at prompts in a `mise activate` shell—not in a background watcher. To run `npm install`, a project must explicitly watch its manifest/lockfile and set `run = "npm install"` or a task.
  [Hooks: watch files](https://mise.jdx.dev/hooks.html#watch-files)

- **The other hooks do not imply lockfile monitoring.** Directory hooks (`enter`, `leave`, `cd`) require activation; install hooks (`preinstall`, `postinstall`) run around mise tool installs and do not require activation. `postinstall = "npm install"` would run after mise installs tools, not in response to an npm lockfile changing. [Hooks](https://mise.jdx.dev/hooks.html#hooks)

- **Automatic dependency installation uses experimental `[deps.*]` providers.** Enable with `[settings] experimental = true` or `MISE_EXPERIMENTAL=1`; configure a provider such as `[deps.npm]`.
  `auto` defaults to `false`. A provider becomes active only when required inputs exist; npm needs `package.json` and `package-lock.json`.
  With `auto = true`, a stale provider runs before `mise run` or `mise exec`. Staleness means tracked source contents changed or required outputs are missing.
  The built-in npm provider tracks those two files and `node_modules/`, and defaults to `npm install`. Configure `run = "npm ci"` to require a clean lockfile install.
  [Project dependencies](https://mise.jdx.dev/dev-tools/deps.html#project-dependencies-experimental); [built-in providers](https://mise.jdx.dev/dev-tools/deps.html#built-in-providers); [automatic runs](https://mise.jdx.dev/dev-tools/deps.html#run-providers-automatically)

- **`mise.toml`'s `lockfile = true` refers to mise's own `mise.lock`, not npm/Bun project dependencies.** `mise.lock` pins versions of tools requested in mise config; its docs explicitly distinguish it from application lockfiles such as `package-lock.json` and `uv.lock`. [mise lockfile docs](https://mise.jdx.dev/dev-tools/mise-lock.html)

## This repository

- Root [`mise.toml`](https://github.com/MRDGH2821/copier-mr-mise/blob/v0.23.0/mise.toml#L4) has a `postinstall` hook that runs `hk install --mise` after mise installs tools. This is not an npm install hook. Its `[[watch_files]]` table (lines 53–60) watches capability configuration paths and runs `ai-setup`; it does not watch `package.json`, `package-lock.json`, `bun.lock`, or `bun.lockb`. <!-- rumdl-disable-line existing-relative-links -->
- [`template/mise.toml.jinja`](https://github.com/MRDGH2821/copier-mr-mise/blob/v0.23.0/template/mise.toml.jinja#L4) has the same mise-tool `postinstall` hook. Its `[[watch_files]]` entry (lines 60–62) watches only `capabilities.yaml` and runs `ai-setup`. <!-- rumdl-disable-line existing-relative-links -->
- Neither file configures `[deps.*]` or enables `experimental = true`. The root config's `lockfile = true` (line 9) enables mise's tool lockfile behavior, not application dependency installation. The configs define explicit `prepare` (`bun install`) and root `prepare-ci` (`bun ci`) tasks; those commands are not triggered merely by a package lockfile changing.

**Conclusion:** Neither repository config enables automatic package installation on npm/Bun lockfile changes. A `[[watch_files]]` rule could be explicitly configured to run a package install, but would be prompt-checked and require shell activation; the experimental `[deps.bun]` provider would require explicit configuration (and `auto = true` for automatic pre-`mise run`/`mise exec` synchronization).

## Sources

- [Official mise documentation index](https://mise.jdx.dev/llms.txt)
- [Hooks](https://mise.jdx.dev/hooks.html)
- [Project dependencies (experimental)](https://mise.jdx.dev/dev-tools/deps.html)
- [mise lockfile (`mise.lock`)](https://mise.jdx.dev/dev-tools/mise-lock.html)
