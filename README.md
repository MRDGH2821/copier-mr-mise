# copier-mr-mise

[![MegaLinter](https://github.com/MRDGH2821/copier-mr-mise/workflows/MegaLinter/badge.svg?branch=main)](https://github.com/MRDGH2821/copier-mr-mise/actions?query=workflow%3AMegaLinter+branch%3Amain)

[Copier](https://copier.readthedocs.io/en/stable/) template for my projects.

This template assumes that you have [mise](https://mise.jdx.dev/) installed already.

Install it before using

To use:

```sh
mise exec copier -- copier copy gh:MRDGH2821/copier-mr-mise "/path/to/folder"
```

To update:

```sh
mise exec copier -- copier update
```

Copier will warn you about scripts. Review them in [copier.yml](./copier.yml)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, checks, and template validation.

To compare the repository root with the template, run:

```sh
sh .github/scripts/diff-template.sh
```

The command lists files unique to either directory and matching files that differ, without showing their contents. It excludes the template directory itself, Git metadata, dependencies, worktrees, and local tool caches. Like `diff`, it exits with status 1 when differences are found.

## License

[MIT](./LICENCE.txt)
