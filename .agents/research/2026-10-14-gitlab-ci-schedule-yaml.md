# Can GitLab CI schedules be declared in `.gitlab-ci.yml`?

Researched on 2026-10-14 against GitLab documentation version 19.5.

## Conclusion

No. A normal GitLab project cannot declare a cron-based pipeline schedule in
`.gitlab-ci.yml` or `workflow` YAML. GitLab's documented schedule setup is
through **Build > Pipeline schedules**. The schedule stores its own cron
interval, target branch or tag, and optional inputs and variables. CI YAML
configures jobs and pipeline behavior, not the recurring schedule.
[Scheduled pipelines](https://docs.gitlab.com/ci/pipelines/schedules/),
[CI/CD YAML syntax reference](https://docs.gitlab.com/ci/yaml/)

The supported API alternative is to create that project schedule outside the CI YAML with `POST /projects/:id/pipeline_schedules`. The request requires `cron`, `description`, and `ref` (with optional `cron_timezone`, `active`, and `inputs`). This is API-driven schedule creation, not a YAML schedule declaration. [Pipeline schedules API: create a new pipeline schedule](https://docs.gitlab.com/api/pipeline_schedules/#create-a-new-pipeline-schedule)

## What `rules` and `workflow: rules` do

YAML can react to a pipeline already started as scheduled. Job-level `rules`
can use `if: '$CI_PIPELINE_SOURCE == "schedule"'` to include a job only in
scheduled pipelines. This selects jobs in a pipeline; it does not set a cron
expression or create the schedule that starts the pipeline.
[Scheduled job rules](https://docs.gitlab.com/ci/jobs/job_rules/#run-jobs-for-scheduled-pipelines),
[CI_PIPELINE_SOURCE values](https://docs.gitlab.com/ci/jobs/job_rules/#ci_pipeline_source-predefined-variable)

Similarly, `workflow: rules` controls whether GitLab creates a pipeline for a given event/source, and is evaluated before jobs. A workflow rule can allow or prevent schedule-source pipelines, but it does not configure their timing. [The `workflow` keyword](https://docs.gitlab.com/ci/yaml/workflow/)

## Separate policy-based exception

GitLab Ultimate has **scheduled pipeline execution policies**, a separate
security-policy feature. The `pipeline_execution_schedule_policy` lives in a
security policy project's `.gitlab/security-policies/policy.yml`, not the
target project's `.gitlab-ci.yml`. It defines daily, weekly, or monthly
schedules that create independent pipelines; those pipelines do not execute
the target project's CI/CD jobs. This is not a project workflow cron.
[Scheduled pipeline execution policies](https://docs.gitlab.com/user/application_security/policies/scheduled_pipeline_execution_policies/)

## Sources

- [Scheduled pipelines](https://docs.gitlab.com/ci/pipelines/schedules/) — project schedule creation and management in the UI.
- [CI/CD YAML syntax reference](https://docs.gitlab.com/ci/yaml/) — `.gitlab-ci.yml` configuration keywords, including `workflow` and job keywords.
- [Specify when jobs run with `rules`](https://docs.gitlab.com/ci/jobs/job_rules/) — selecting jobs by `CI_PIPELINE_SOURCE == "schedule"` and the source-value definition.
- [The `workflow` keyword](https://docs.gitlab.com/ci/yaml/workflow/) — pipeline creation controls and evaluation order.
- [Pipeline schedules API](https://docs.gitlab.com/api/pipeline_schedules/) — API operations, including creating schedules with cron, description, and ref.
- [Scheduled pipeline execution policies](https://docs.gitlab.com/user/application_security/policies/scheduled_pipeline_execution_policies/) — Ultimate policy-based schedule exception, location, cadence, and independent pipeline behavior.
