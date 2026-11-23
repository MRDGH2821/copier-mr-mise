#!/bin/sh

root=$(CDPATH='' cd -- "$(dirname -- "$0")/../.." && pwd)
diff -rq -x template -x .git -x node_modules -x .worktrees \
  -x megalinter-reports -x .ruff_cache -x .rumdl_cache -x .ryl_cache \
  "${root}" "${root}/template"
