## AI Attribution (MANDATORY)

Every AI-assisted commit MUST include this trailer:

```txt
Co-authored-by: <Model full Name and version> via <Harness> <noreply@provider-domain>
```

For AI-assisted reviews, pull request and issue descriptions, comments, and
other published text, end the text with a `Co-authored-by` or `Assisted-by`
line in the same format. Prefer `Assisted-by` when it better describes the
contribution. When editing existing text, preserve existing attribution and add
attribution for each contributing model.

Actions without a text field, such as applying a label or changing a status,
do not require a separate attribution comment. Local commands, read-only
actions, and chat replies do not require attribution.

Use the email address for the model provider, not the harness provider.
<!-- smt -->

| Provider                | noreply address          |
| ----------------------- | ------------------------ |
| Anthropic (Claude)      | `noreply@anthropic.com`  |
| Cursor                  | `cursoragent@cursor.com` |
| Google (Gemini)         | `noreply@google.com`     |
| Meta (Llama)            | `noreply@meta.com`       |
| Microsoft (Copilot)     | `noreply@microsoft.com`  |
| Mistral                 | `noreply@mistral.ai`     |
| OpenAI (GPT / o-series) | `noreply@openai.com`     |
| Z.ai (GLM)              | `noreply@z.ai`           |
| xAI (Grok)              | `noreply@x.ai`           |

If a provider is missing, search its official documentation or public
repositories for a documented address; never guess from the provider's domain.

Use the full model name and version supplied by the session. If the exact
version is unavailable, use the most specific known name and do not guess.
Use the common harness name. Add one trailer per AI model; never omit it.

Example:

```txt
fix(cspell): resolve configuration issue

Co-authored-by: GPT-4o via Cursor <noreply@openai.com>
```
