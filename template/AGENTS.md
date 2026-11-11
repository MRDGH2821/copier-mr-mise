# AGENTS Instructions

This file provides guidance for AI coding assistants working with this project.

Before starting a task, verify that the skills required for it are available in
the current session, every tool listed in `.config/mise/config.toml` is
installed, and the MCP servers required for it are reachable through Capa MCP.
Configuration alone does not prove availability.

If a required skill or MCP server is unavailable, or any configured mise tool is
not installed:

1. Stop before doing task work and tell the user what is missing.
2. Offer these recovery commands from the repository root:

   ```sh
   mise trust
   mise install
   mise run prepare
   ```

3. Wait for the user to complete setup and reload the agent session.
4. After reload, verify availability again. Continue only when the required
   skills are visible, every configured mise tool is installed, and the
   required MCP servers are reachable.

MCP servers should be accessible via Capa MCP.
