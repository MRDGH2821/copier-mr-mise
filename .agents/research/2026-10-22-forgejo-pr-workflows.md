# Forgejo Actions pull-request creation

Researched on 2026-10-22 against Forgejo v17.0 (`latest`) documentation and first-party action source. The target workflow is [`template/.forgejo/workflows/mega-linter.yml`](../../template/.forgejo/workflows/mega-linter.yml).

## Findings

- **`peter-evans/create-pull-request` is not documented as Forgejo-compatible.** Its upstream describes it as "A GitHub action," and its README discusses GitHub repository settings, tokens, and permission scopes.
  Forgejo says Actions aims for _familiarity_, not compatibility; some `github` context keys are missing, and `jobs.<job_id>.permissions` is ignored.
  The workflow's permission mapping is therefore ineffective on Forgejo; use of this action is an unsupported compatibility assumption.
  [Forgejo compatibility differences](https://forgejo.org/docs/latest/user/actions/github-actions/); [action README](https://github.com/peter-evans/create-pull-request#readme); [action metadata](https://github.com/peter-evans/create-pull-request/blob/main/action.yml)

- **The pinned action targets the wrong API path for Forgejo.** In v8.1.1 it derives the API client from the Git remote hostname and hardcodes `/api/v3` for non-`github.com` hosts.
  Forgejo documents its REST API at `/api/v1`, so the PR API call targets an unsupported path on a standard instance unless a proxy supplies a compatibility route.
  [Pinned action source](https://github.com/peter-evans/create-pull-request/blob/v8.1.1/src/github-helper.ts); [Forgejo API usage](https://forgejo.org/docs/v17.0/user/api/usage/)

- **`secrets.GITHUB_TOKEN` is supported as an alias, but is not GitHub's token on Forgejo.** Forgejo maps it to the per-workflow automatic `FORGEJO_TOKEN`, which has repository write permission.
  Fork-based `pull_request` runs are an exception: secrets are unavailable and the automatic token is read-only.
  In this workflow, `secrets.PAT || secrets.GITHUB_TOKEN` uses a configured PAT if provided, otherwise the Forgejo token alias.
  [Forgejo automatic token](https://forgejo.org/docs/latest/user/actions/basic-concepts/); [fork permissions](https://forgejo.org/docs/latest/user/actions/reference/#onpull_request)

- **The GitHub-shaped contexts are not all assured.** Forgejo documents that some `github` context keys are missing, but not whether each key used here is affected.
  Treat these expressions as needing instance/version validation.
  Forgejo also ignores job-level `permissions`, so the workflow's permission mappings are not an effective access-control boundary.
  [Forgejo GitHub Actions differences](https://forgejo.org/docs/latest/user/actions/github-actions/)

- **Forgejo's documented API is the dependable native route.** Use `POST /api/v1/repos/{owner}/{repo}/pulls` with `title`, `head`, and `base`; push the source branch first.
  Authenticate with `Authorization: token …` or `Authorization: Bearer …`. The in-workflow token supports same-repository operations, subject to event permissions.
  A separate credential needs `write:repository`. API access can be disabled by an administrator; Forgejo API compatibility is guaranteed within a major version, with breaking changes across major versions.
  [Forgejo API usage](https://forgejo.org/docs/latest/user/api/usage/); [token scopes](https://forgejo.org/docs/latest/user/authentication/token-scope/); [automatic token](https://forgejo.org/docs/latest/user/actions/basic-concepts/)

- **Forgejo's built-in `forgejo` CLI is not a PR-creation client.** Its documented CLI is for administrative actions and Actions runner management; the docs refer to separate, third-party user CLIs for interacting with an instance. The REST API (or a user-installed client that calls it) is the relevant CLI/workflow approach, rather than `forgejo` server CLI. [Forgejo CLI documentation](https://forgejo.org/docs/latest/admin/command-line/)

## Compatibility conclusion

**Not confirmed correct/supported as written.** The fallback `secrets.GITHUB_TOKEN` resolves to Forgejo's token, but that does not establish compatibility for the action's API calls or the workflow's GitHub-context expressions.
The action docs do not advertise Forgejo support or document an API base-URL input. Prefer Forgejo-native API calls and contexts; this report does not claim a runtime incompatibility test.

## Sources

- [Forgejo Actions: GitHub Actions differences](https://forgejo.org/docs/latest/user/actions/github-actions/)
- [Forgejo Actions: basic concepts, secrets and automatic token](https://forgejo.org/docs/latest/user/actions/basic-concepts/)
- [Forgejo Actions workflow reference](https://forgejo.org/docs/latest/user/actions/reference/)
- [Forgejo API usage and authentication](https://forgejo.org/docs/latest/user/api/usage/)
- [Forgejo access-token scopes](https://forgejo.org/docs/latest/user/authentication/token-scope/)
- [Forgejo administrative CLI](https://forgejo.org/docs/latest/admin/command-line/)
- [peter-evans/create-pull-request README](https://github.com/peter-evans/create-pull-request#readme) and [action metadata](https://github.com/peter-evans/create-pull-request/blob/main/action.yml)
- [Forgejo API reference (instance-generated Swagger)](https://try.next.forgejo.org/api/swagger)
