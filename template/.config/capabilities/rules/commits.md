## Commit policy

### Branch naming strategy

Before creating a branch, follow the branch naming strategy in the project-root
`CONTRIBUTING.md` (`#branch-naming-strategy`).

Before creating a pull request, check that the current branch follows the
branch-naming strategy. If it does not, tell the user, rename the branch to a
compliant name, then create the pull request.

### Commit Messages

Every commit MUST be atomic (one logical change), and every commit message MUST use Conventional Commits format: `<type>(<scope>): <description>`.
Consult `cog.toml` for valid scopes and release hooks; it is the source of truth.

Version bumps use cocogitto (`cog bump`). Inspect the configured hooks before
running a release command.
