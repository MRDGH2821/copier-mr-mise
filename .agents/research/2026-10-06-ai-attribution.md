# AI attribution in Git commits

Research date: 2026-10-06.

Request: identify current conventions for recording AI assistance, including
`Co-authored-by`, `AI-Model`, and alternatives. Scope: a small primary-source
sample, not a prevalence survey. This note recommends a policy; it does not
change the repository's current mandatory co-author policy.

## What Git and hosting platforms support

Git trailers are metadata at the end of a commit message, separated from the
body by a blank line. Keys contain ASCII letters, numbers, and hyphens. Git
accepts custom keys; it does not prescribe an AI attribution vocabulary.
Consequently, `AI-Model` is syntactically valid, but validity does not establish
adoption or special hosting-platform support. [Git trailer documentation](https://git-scm.com/docs/git-interpret-trailers)

GitHub documents `Co-authored-by: name <email>` for multiple authors. An email
associated with a GitHub account is needed for contribution credit; an arbitrary
provider-domain address does not establish that association. GitLab also emits
co-author trailers through its merge/squash commit-template variable. These are
co-author mechanisms, not an AI-specific standard. [GitHub documentation](https://docs.github.com/en/pull-requests/how-tos/commit-changes/creating-a-commit-with-multiple-authors),
[GitLab commit templates](https://docs.gitlab.com/user/project/merge_requests/commit_templates/)

## Verified conventions

| Convention       | Current primary-source example                                                                                                                                   | Practical distinction                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Co-authored-by` | Claude Code's default commit attribution names the model and uses `noreply@anthropic.com`.                                                                       | Uses the existing co-author convention.                                                      |
| `Assisted-by`    | Node.js requires the agent name and forbids agent co-author/sign-off trailers. GitHub Spec Kit requires the agent, model, and autonomous/supervised status.      | Records assistance without treating the tool as a human co-author.                           |
| `Generated-by`   | Mesa suggests this when almost all code was generated. DebOps requires `Generated-By: LLM` for substantially generated contributions, optionally naming a model. | Records generation provenance; scope and threshold vary by project.                          |
| `AI-Model`       | No adoption requirement or standardized meaning verified in this sample.                                                                                         | A possible project-specific metadata field, not an established convention demonstrated here. |

Sources: [Claude Code attribution settings](https://code.claude.com/docs/en/settings-reference#attribution-commit),
[Node.js AGENTS.md](https://github.com/nodejs/node/blob/main/AGENTS.md),
[Spec Kit contribution guide](https://github.com/github/spec-kit/blob/main/CONTRIBUTING.md#agent-authored-git-and-review-activity),
[Mesa submission guide](https://docs.mesa3d.org/submittingpatches.html),
[DebOps policy](https://docs.debops.org/en/stable-3.2/meta/policy/ai-contributions.html).

Claude Code can replace or hide its commit attribution through
`attribution.commit`. Its PR attribution is separate plain text, and cloud or
Remote Control commits can additionally carry `Claude-Session` links. The
official Markdown reference was downloaded because the HTML exceeded the web
tool's size limit. [Official settings reference](https://code.claude.com/docs/en/settings-reference.md)

GitHub Copilot cloud agent uses another arrangement: Copilot is the commit author,
the initiating human is co-author, and the commit message links to session logs.
This is product behavior, not a convention all assistants follow.
[GitHub agent-session documentation](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents)

OpenInfra's September 2026 policy recommends `Assisted-By` going forward while
still accepting `Generated-By`. Apache's published generative-tooling guidance
recommends identifying tool and version, giving both generated-by and co-author
forms as examples. Linux currently requests `Assisted-by: LLM` with optional
specialized analysis tools. These different policies demonstrate that there is
no single convention shared by this sample. [OpenInfra policy](https://openinfra.org/legal/ai-policy/),
[Apache guidance](https://www.apache.org/legal/generative-tooling.html),
[Linux kernel documentation](https://cdn.kernel.org/doc/html/latest/process/coding-assistants.html)

## Recommendation for this repository

For a reusable project template, prefer one explicit disclosure trailer:

```txt
Assisted-by: Codex (model: GPT-6)
```

This is a recommendation based on the surveyed assistance policies. It preserves
the desired tool/model traceability without maintaining a provider-email table.
Reserve human co-author trailers for humans; retain mandatory tool-generated
trailers when a platform requires them. Record unknown model details honestly
rather than guessing. Keep detailed prompts and verification in the existing
work logs. A second `AI-Model` field adds little unless automated reporting later
needs to parse the model independently.

Adopting this recommendation requires synchronizing root and template policies;
until then, the existing mandatory `Co-authored-by` policy remains in force.
