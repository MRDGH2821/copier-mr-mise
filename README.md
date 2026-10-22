# copier-mr-mise

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

## Agent instructions

Instruction sources live in `.config/capabilities/`: `instructions/project.md`
holds common guidance; `instructions/repository.md` holds this repository's context.
The template mirrors the common file and supplies `instructions/template.md` for
generated-project context. `rules/engineering.md`, `rules/commits.md`,
`rules/ai-co-author.md`, `rules/ai-logs.md`, `rules/ai-reviews.md`, and
`rules/tooling.md` hold shared policies. Keep the common files and rules aligned.

Run `capa open` through mise to edit their declarations in the browser, then
`mise run ai-setup` to regenerate provider instruction files. Edit the Markdown
sources rather than capa-managed blocks in `AGENTS.md` or provider rule files.
Keep sources outside `.agents/rules/`: capa uses that directory for generated output.

All policies always apply. Providers without separate rule support receive
them in `AGENTS.md`, so this split improves maintenance, not necessarily context size.
Copier renders a complete `AGENTS.md` when `use_agents` is enabled, including when
`use_skills` is disabled; disabling `use_agents` also omits the instruction sources
and capa declarations.

## License

[MIT](./LICENCE.txt)
