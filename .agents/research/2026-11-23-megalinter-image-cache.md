# MegaLinter image caching on GitHub Actions

Research date: 2026-11-23

The pinned [MegaLinter
action](https://raw.githubusercontent.com/oxsecurity/megalinter/f2fe8c1cba37091848df3e524066c8c23ef353ed/action.yml)
references the prebuilt image `ghcr.io/oxsecurity/megalinter:v10.2.0`. The GitHub Actions runner
adds image preparation to pre-job steps and runs `docker pull` before ordinary workflow steps ([job
setup](https://github.com/actions/runner/blob/main/src/Runner.Worker/JobExtension.cs), [image
preparation](https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionManager.cs)). A
cache-restore step before the existing MegaLinter step is therefore too late to prevent that pull.
This describes current runner implementation and could change.

Docker's [BuildKit cache backends](https://docs.docker.com/build/cache/backends/) cache build
results; they do not cache the pull of this prebuilt container action. A different workflow could
cache an archive created by [`docker image
save`](https://docs.docker.com/reference/cli/docker/image/save/) and restore it with [`docker image
load`](https://docs.docker.com/reference/cli/docker/image/load/), then invoke MegaLinter after the
restore. That changes the invocation and requires verification of outputs, mounts, environment, and
failure behavior.

An archive cache needs a pull fallback for misses or eviction. Benchmark restoration, decompression,
and loading against a normal pull; no live benchmark was run. A [digest-pinned
image](https://docs.docker.com/reference/cli/docker/image/pull/) and exact cache key prevent a
mutable tag or partial cache match from silently selecting stale content. GitHub's [cache
documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)
describes cache scope, security, expiration, and storage limits; do not store secrets or allow
untrusted cache writes to feed privileged workflows.

A persistent self-hosted runner can retain Docker layers between jobs, though Docker still contacts
the registry for a pull. The existing hosted-runner workflow cannot achieve the requested behavior
by simply adding a cache step. Keep the current action until an alternative invocation is tested and
measured.
