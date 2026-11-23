# Atlassian integration — planned

The current application is a standalone local prototype. No Forge app, Jira connector, Confluence connector, Teamwork Graph integration, or Rovo agent is included yet.

The intended integration boundary is:

1. Read authorized project context through supported Atlassian APIs.
2. Normalize issues, components, and dependency relationships into the AFTERSHOCK graph schema.
3. Run the same deterministic simulation engine used by the standalone app.
4. Link each displayed node back to its source record.
5. Keep simulation read-only by default; never modify project records without an explicit user action.

Before implementation, confirm the Codegeist rules, eligible Forge modules, available APIs, and any Rovo/Teamwork Graph requirements. Do not place credentials in source control.
