# AGENTS Instructions

This file provides guidance for AI coding assistants working with this project.

Before starting, identify the skills, mise tools, and MCP tools this task needs.
Check only those dependencies; an unrelated missing skill, tool, or server must
not block the task.

For MCP dependencies managed by Capa, use the Capa MCP tools exposed in the
current session. This project uses `toolExposure: search`, so discover upstream
tools with Capa's `search` tool and invoke them with `call_tool`. A successful
call verifies the capability needed for the task. Do not infer server health
from `.mcp.json`, the absence of a direct upstream tool, or a shell request to
the local Capa URL; agent runtimes may isolate loopback networking.

If a required tool is not exposed or its call fails, report the check and say
the capability is unavailable from this session. That does not establish that
the Capa service or upstream server is stopped. Continue work that does not
depend on it, and stop only the part that cannot proceed without it. Recommend
`mise trust`, `mise install`, and `mise run prepare` only when setup is the
identified cause of a required dependency being unavailable.