# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root, or
- **`GLOSSARY-MAP.md`** at the repo root if it exists: it points at one `GLOSSARY.md` per context. Read each one relevant to the topic.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-scoped decisions.

If any of these files don't exist, proceed silently. Don't flag their absence or suggest creating them upfront. The `/domain-modeling` skill creates them lazily when terms or decisions are resolved.

## File structure

Single-context repo (this repo):

```text
/
├── GLOSSARY.md
└── docs/adr/
```

## Use the glossary's vocabulary

When an output names a domain concept, use the term defined in `GLOSSARY.md`. Don't drift to synonyms the glossary avoids.

If the concept isn't in the glossary yet, reconsider whether the project uses it or note the gap for `/domain-modeling`.

## Flag ADR conflicts

If an output contradicts an existing ADR, surface it explicitly instead of silently overriding it.
