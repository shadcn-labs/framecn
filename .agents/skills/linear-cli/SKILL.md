---
name: linear-cli
description: Load Linear issues to initiate tasks, search/list issues, view issue details, and manage issue state using the linear CLI. Use when the user references a Linear issue, wants to start work from Linear, or asks to search Linear.
---

# Linear CLI

Interact with the Linear issue tracker from the command line. The primary use cases are:

- **Starting tasks from issues** -- fetch an issue by ID, read its description, and begin work
- **Searching/listing issues** -- find issues by state, assignee, team, or free-text search
- **Viewing issue details** -- read full descriptions, comments, and metadata
- **Updating issue state** -- mark issues as started, add comments with progress

## Setup

### Install

```bash
brew install schpet/tap/linear
```

### Authenticate

1. Create an API key at https://linear.app/settings/account/security (requires member access, not guest)
2. Run `linear auth login` and paste the key when prompted
3. Verify: `linear auth whoami`

### Configure for this repo

```bash
linear config
```

This writes a `.linear.toml` in the repo root with the team ID and workspace slug. The file is checked into git so all agents and developers share the same config.

## Starting a Task from an Issue

When given an issue ID (e.g. `ENG-123`):

```bash
# Read the full issue -- description, state, assignee, labels, comments
linear issue view ENG-123

# Get just the title (useful for branch names or commit messages)
linear issue title ENG-123

# Get the Linear URL
linear issue url ENG-123
```

The agent should read the issue description to understand requirements before starting implementation.

## Task Lifecycle

**On start**: Move the issue to "In Progress" immediately when beginning implementation.

```bash
linear issue update ENG-123 -s started
# or via GraphQL if CLI fails (see Updating Issues below)
```

**On deploy to production**: Move to "In Review" only after the deploy has fully completed and the change is live on production. Never update Linear state speculatively or immediately after pushing — a reviewer loading the issue will open the production site, which must already reflect the change.

The required sequence:
1. Push to telecine main (or merge PR)
2. **Block** on `scripts/wait-for-telecine-action` until the deploy job completes successfully
3. Only then move to "In Review" and add a comment

```bash
# From monorepo/ — MUST complete before touching Linear
scripts/wait-for-telecine-action

# Then move to In Review
linear api <<'GRAPHQL'
mutation {
  issueUpdate(id: "EF2-123", input: { stateId: "2717b5fe-9ea0-429f-8edd-cf8eabe0551d" }) { success }
}
GRAPHQL

linear issue comment add EF2-123 -b "Deployed to production. <one-line summary of what changed>"
```

The comment should be a single sentence describing what was implemented or fixed, not a list of commits.

## Searching and Listing Issues

```bash
# List unstarted issues assigned to you (default)
# --sort is required: manual or priority (NOT "updated")
linear issue list --sort priority

# List issues in a specific state
linear issue list -s started --sort priority
linear issue list -s backlog --sort priority
linear issue list --all-states --sort priority

# List issues for all assignees
linear issue list -A --sort priority

# List unassigned issues
linear issue list -U --sort priority

# Filter by project -- requires exact name match; use GraphQL if not found
linear issue list --project "Project Name" --sort priority --team ENG

# Filter by team (required if no .linear.toml in repo)
linear issue list --team ENG --sort priority

# Limit results
linear issue list --limit 10 --sort priority
```

### List issues in a project via GraphQL (preferred for project browsing)

The CLI `--project` filter is fragile (exact name match, requires team). Use GraphQL instead:

```bash
# First find the project ID
linear api <<'GRAPHQL'
query {
  projects(first: 50) {
    nodes { id name }
  }
}
GRAPHQL

# Then fetch its issues
linear api <<'GRAPHQL'
query {
  project(id: "<id>") {
    issues(first: 50) {
      nodes { identifier title state { name } assignee { name } priority }
    }
  }
}
GRAPHQL
```

### Free-text search via GraphQL

The CLI doesn't have a built-in search command, but the `api` subcommand exposes the full GraphQL API:

```bash
linear api --variable term="onboarding" <<'GRAPHQL'
query($term: String!) {
  searchIssues(term: $term, first: 20) {
    nodes { identifier title state { name } assignee { name } }
  }
}
GRAPHQL
```

Pipe to `jq` for filtering:

```bash
linear api --variable term="bug" <<'GRAPHQL'
query($term: String!) {
  searchIssues(term: $term, first: 20) {
    nodes { identifier title state { name } }
  }
}
GRAPHQL
```

## Updating Issues

```bash
# Mark as started (sets state to "In Progress")
# NOTE: linear issue update fails with "Could not determine team key from issue ID"
# for non-standard prefixes (e.g. EF2-123). Use GraphQL mutation instead (see below).
linear issue update ENG-123 -s started

# Update title or description
linear issue update ENG-123 -t "New title"
linear issue update ENG-123 --description-file /tmp/desc.md

# Add a comment
linear issue comment add ENG-123 -b "Started implementation"

# For multi-line markdown comments, use a file
linear issue comment add ENG-123 --body-file /tmp/comment.md
```

### Update issue state via GraphQL (when CLI update fails)

```bash
# Find the state ID first
linear api <<'GRAPHQL'
query {
  workflowStates(filter: { name: { eq: "Done" } }) {
    nodes { id name team { key } }
  }
}
GRAPHQL

# Then update one or more issues in a single mutation
linear api <<'GRAPHQL'
mutation {
  issueUpdate(id: "EF2-123", input: { stateId: "<state-id>" }) { success }
}
GRAPHQL

# Batch update multiple issues
linear api <<'GRAPHQL'
mutation {
  a: issueUpdate(id: "EF2-436", input: { stateId: "<state-id>" }) { success }
  b: issueUpdate(id: "EF2-435", input: { stateId: "<state-id>" }) { success }
}
GRAPHQL
```

## Creating Issues

```bash
# Interactive (prompts for details)
linear issue create

# Non-interactive
linear issue create -t "Fix rendering bug" --description-file /tmp/desc.md -a self -s unstarted

# Create and immediately start working
linear issue create -t "Investigate flaky test" --start
```

Always use `--description-file` or `--body-file` for multi-line markdown content to avoid shell escaping issues.

## Discovering CLI Options

Every command supports `--help`:

```bash
linear --help
linear issue --help
linear issue list --help
linear issue create --help
```

The CLI has extensive subcommands beyond issues -- `linear team`, `linear project`, `linear document`, `linear label`, `linear milestone`. Run `--help` on any of them.

## Workspace Reference

Use these IDs directly in mutations — no need to query for them first.

### Users

| Name | ID |
|---|---|
| Collin Miller | `7fa0b8f1-b1d2-462a-8edd-5365fb5e1d4a` |
| Jeremy Yudkin | `12ae7fdb-6af1-45fd-b656-a1052b387605` |

### Workflow States (team: EF2)

| State | ID | Type |
|---|---|---|
| Backlog | `deceb52d-a969-493a-974c-228d0e595e08` | backlog |
| Todo | `fb95e2be-9938-42bf-8248-276d4b1af951` | unstarted |
| In Progress | `ac7b4c8f-d2a9-4e74-a9ff-392506703bd2` | started |
| In Review | `2717b5fe-9ea0-429f-8edd-cf8eabe0551d` | started |
| Done | `5fcec8c5-d69d-4cf4-bcad-e73654b2fae2` | completed |
| Canceled | `1fbe9606-44eb-486c-8521-daf848673435` | canceled |
| Duplicate | `ec2113c9-0b49-407a-82e1-3d1f39c7037a` | canceled |

### Projects

| Name | ID | State |
|---|---|---|
| Editframe 2026 Launch / Bug Fixes | `b43b5d1d-8431-4e19-b4ae-c05760c02996` | planned |
| App and Dashboard For Launch | `5fbea590-482f-4fcd-89f3-b0e581e43546` | started |
| Demo Improvements (Pre Launch) | `6c616f08-8bc9-4f8c-9109-26863099ffc3` | started |
| Dev Rel Catnip | `90b4643c-9b09-43fc-8fd8-9e78de7669a5` | started |
| Bug Fixes | `9c2beb23-32c3-4c24-a896-ca69eb99da49` | started |
| Clean Slate Task Collection | `12e632b9-6ce7-4a06-8403-46b419e3f649` | started |
| Docs/Site Feedback (2025) | `4ccf4054-9b6a-4ccf-85e6-088fe60851e4` | started |
| EF - Rendering Improvements | `fd8a3df6-e174-41ee-a7f2-b7d49bca6094` | backlog |
| EF - Preview Improvements | `4772c169-6f0f-4c01-b408-801ebd49bb3a` | backlog |
| Launch Documentation Beta | `f8babb39-f732-4611-999e-f7db4d0aa48c` | backlog |
| Stack Trace Project | `e2f37910-6a4f-4f45-a877-889c62526e6b` | planned |

## When to Use This Skill

- User provides a Linear issue ID and wants to begin work on it
- User asks to find or search for Linear issues
- User wants to see what's assigned to them or what's in a specific state
- User asks to update an issue's status or add a comment
- Agent needs to read issue requirements before starting implementation
