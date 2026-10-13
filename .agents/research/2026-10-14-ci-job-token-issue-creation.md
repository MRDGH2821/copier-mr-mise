# Can a GitLab CI job token create an issue?

Researched on 2026-10-14 against GitLab documentation version 19.5.

## Conclusion

No. `CI_JOB_TOKEN` cannot create a project issue through GitLab's REST API,
and it cannot create an issue comment (note) either. The CI job-token access
list is an endpoint allowlist: it includes only listed resources and methods.
It lists limited `GET` access for the Notes API (merge-request notes only), and
does not include the Issues API or issue-note creation. Adding a source
project to a target project's allowlist does not add unsupported endpoints;
the allowlist controls cross-project eligibility, while supported job-token
endpoints are specified separately.
[CI/CD job token access and allowlist](https://docs.gitlab.com/ci/jobs/ci_job_token/#job-token-access)

## Issue creation versus comments

The Issues API provides an issue-creation endpoint:
`POST /projects/:id/issues`, requiring a project ID and issue title. However,
that endpoint is not in the CI job-token access list, so it is not available
to `CI_JOB_TOKEN`.
[Issues API: create an issue](https://docs.gitlab.com/api/issues/#create-an-issue),
[CI/CD job token access list](https://docs.gitlab.com/ci/jobs/ci_job_token/#job-token-access)

A comment is separate. The Notes API creates a note on an existing issue with
`POST /projects/:id/issues/:issue_iid/notes`; that write endpoint is also
absent from the CI job-token access list. The list permits only `GET` on two
merge-request-note endpoints, not issue notes or note creation. Therefore,
`CI_JOB_TOKEN` cannot create an issue comment as an alternative to creating
the issue.
[Notes API: create an issue note](https://docs.gitlab.com/api/notes/#create-an-issue-note),
[CI/CD job token access list](https://docs.gitlab.com/ci/jobs/ci_job_token/#job-token-access)

## Allowlist and user permissions are not endpoint support

The allowlist governs which projects' or groups' job tokens may access a
target project. GitLab also requires the triggering user to have permission
for an action, and limits job tokens to fewer resources than personal access
tokens. User role, project visibility, disabling the allowlist, or adding a
project to it cannot enable the unlisted issue-creation or issue-note
endpoints.
[CI/CD job token overview and allowlist rules](https://docs.gitlab.com/ci/jobs/ci_job_token/#control-job-token-access-to-your-project)

## Project access token and `glab`

A project access token is distinct from `CI_JOB_TOKEN`. With the `api` scope,
it has read/write API access within its project scope. A suitably authorized
token can create issues and issue notes, subject to the token bot's project
role.

Project access tokens are available on GitLab.com with Premium or Ultimate,
and on all tiers for Self-Managed and Dedicated.
[Access token scopes](https://docs.gitlab.com/security/tokens/access_token_scopes/),
[Project access tokens](https://docs.gitlab.com/user/project/settings/project_access_tokens/),
[REST API authentication](https://docs.gitlab.com/api/rest/authentication/)

`glab issue create` creates an issue. `glab auth login` can authenticate
with either a CI job token (`--job-token`) or an access token (`--token`), but
the CLI does not change server-side endpoint permissions. `CI_JOB_TOKEN`
still cannot call the unsupported issue-creation endpoint. GitLab documents
CI auto-login for supported commands, and manual login when a command does
not support job tokens or when an access token is needed. `GITLAB_TOKEN` and
related access-token variables take precedence over stored credentials.
[glab issue create](https://docs.gitlab.com/cli/issue/create/),
[glab auth login](https://docs.gitlab.com/cli/auth/login/)

## Sources

- [CI/CD job token](https://docs.gitlab.com/ci/jobs/ci_job_token/) — token access list, lifetime, allowlist, and user-permission constraints.
- [Issues API](https://docs.gitlab.com/api/issues/) — `POST /projects/:id/issues`.
- [Notes API](https://docs.gitlab.com/api/notes/) — `POST /projects/:id/issues/:issue_iid/notes`.
- [REST API authentication](https://docs.gitlab.com/api/rest/authentication/) — job tokens work only with specific API endpoints; project access-token authentication.
- [Access token scopes](https://docs.gitlab.com/security/tokens/access_token_scopes/) and [Project access tokens](https://docs.gitlab.com/user/project/settings/project_access_tokens/) — `api` scope and project token boundaries/availability.

## Merge request creation

### Merge Requests API: direct creation is not supported

The GitLab 19.5 job-token access list allows only
`GET /projects/:id/merge_requests` and
`GET /projects/:id/merge_requests/:merge_request_iid`; it does not allow
`POST /projects/:id/merge_requests`. That is the documented endpoint for
creating an MR, but its existence does not make it callable with
`CI_JOB_TOKEN`. User permissions, enabling repository push, or adding a
source project to the job-token allowlist do not expand the endpoint list.
[CI/CD job-token access list](https://docs.gitlab.com/ci/jobs/ci_job_token/#job-token-access),
[Merge Requests API: create an MR](https://docs.gitlab.com/api/merge_requests/#create-a-merge-request),
[job-token allowlist rules](https://docs.gitlab.com/ci/jobs/ci_job_token/#add-a-group-or-project-to-the-job-token-allowlist)

### Git push option: an MR can be created without a separate token

This is a Git operation, not an API call. GitLab documents
`merge_request.create` as a push option that creates an MR for the pushed
branch. Other `merge_request.*` push options can set its title, description,
target branch, or target project. Git push options require Git 2.10 or later;
the shorter `-o` syntax requires Git 2.18 or later. When pushing from the
default branch, specify `merge_request.target`.
[GitLab push options](https://docs.gitlab.com/topics/git/commit/#push-options-for-merge-requests)

For a same-project workflow, the project must enable **Allow Git push requests
to the repository** under **Settings > CI/CD > Job token permissions**. It is
off by default; only job tokens from that project's own pipelines can push.
The triggering user must also have permission to push and create an MR. A
successful job-token push does not trigger a CI/CD pipeline in the target
project. These conditions are separate from API endpoint support.
[Allow Git push requests](https://docs.gitlab.com/ci/jobs/ci_job_token/#allow-git-push-requests-to-your-project-repository),
[CI/CD job token permissions](https://docs.gitlab.com/ci/jobs/ci_job_token/)

For a cross-project push, GitLab 19.1+ requires additional settings on the
target project: enable both **Allow Git push requests to the repository** and
**Allow cross-project Git push requests from allowlisted projects**, keep the
job-token allowlist enabled, and allowlist the source with `admin_repositories`
fine-grained permission (or default permissions when no fine-grained
restriction is set). The triggering user must have at least Developer access
to the target. A job-token push still does not start a target pipeline.
[Cross-project Git push requirements](https://docs.gitlab.com/ci/jobs/ci_job_token/#allow-cross-project-git-push-requests-from-allowlisted-projects)

**Conclusion:** `CI_JOB_TOKEN` cannot create an MR using `POST /projects/:id/merge_requests`. A CI job can nevertheless create one without a separate access token by pushing a branch with `merge_request.create`, provided the applicable job-token repository-push setting, target-project conditions, and triggering user's permissions are satisfied. [CI/CD job token access list](https://docs.gitlab.com/ci/jobs/ci_job_token/#job-token-access), [GitLab push options](https://docs.gitlab.com/topics/git/commit/#push-options-for-merge-requests)

MR-specific sources:

- [CI/CD job token](https://docs.gitlab.com/ci/jobs/ci_job_token/) — endpoint access list, user permissions, repository push setting, and cross-project push requirements.
- [Merge Requests API](https://docs.gitlab.com/api/merge_requests/#create-a-merge-request) — API creation endpoint and parameters.
- [Git push options](https://docs.gitlab.com/topics/git/commit/#push-options-for-merge-requests) — `merge_request.create`, target and metadata options, and Git client version requirements.
