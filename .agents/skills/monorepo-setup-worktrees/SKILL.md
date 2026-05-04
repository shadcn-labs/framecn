---
name: monorepo-setup-worktrees
description: git worktrees, git worktree setup, git worktree configuration, branching work syncing branches
---
# Monorepo Worktree System

Scope-based worktree isolation for parallel development streams. Each worktree gets isolated Docker services, databases, and domains.

## Scopes

| Scope | Services | Containers | Create time |
|-------|----------|------------|-------------|
| `elements` | Elements runner + dev-projects only | 2 | ~28s |
| `web` | Elements + telecine core (web, hasura, valkey, maintenance) | 8 | ~1:30 |
| `render` | Elements + telecine core + render pipeline (workers, scheduler) | ~22 | ~2:30 |

Upgrade path: `elements` → `web` → `render`. Downgrade not supported.

## Worktree Management

All worktree operations use the unified CLI: `scripts/worktree <command>`.

```bash
worktree create <branch> [scope]       # Create new worktree (default: web)
worktree list                          # List all worktrees
worktree status [branch]               # Health check
worktree pause <branch>                # Stop containers
worktree resume <branch>               # Start containers
worktree remove <branch> [--force]     # Full cleanup
worktree upgrade <branch> <scope>      # Escalate scope (elements→web→render)
worktree merge <branch>                # Merge branch into main (feature → main)
worktree pull                          # Fetch upstream, update local main, sync main → all worktrees
worktree prune [--dry-run]             # Remove worktrees whose branches are fully merged into main
worktree smoke <branch>                # One-shot render verification
worktree logs [branch] [options]       # View logs
worktree doctor [branch] [--skills]    # Diagnose issues
worktree editor-deps [branch]          # Install host-side node_modules for editor tooling
worktree deps [--workspace=...]        # Show dependency graph
```

## Architecture

### Repo layout

```
~/Editframe/
  monorepo -> worktrees/main/monorepo   (symlink for convenience)
  worktrees/
    main/
      .worktree-scope               # scope for main (e.g. "render")
      monorepo/                     # primary monorepo checkout [main]
        telecine -> ../telecine     # symlink
        elements -> ../elements     # symlink
      telecine/                     # primary telecine clone [main]
      elements/                     # primary elements clone [main]
    <branch>/
      .worktree-scope               # scope for this branch
      monorepo/                     # monorepo worktree [branch]
      telecine/                     # telecine git worktree [branch]
      elements/                     # elements git worktree [branch]
```

**The main worktree (`worktrees/main/`) must always be on the `main` branch.** Never run `git checkout`, `git switch`, or any branch-switching command in the main worktree directories. All feature work lives in a dedicated branch worktree created with `worktree create`. An LLM agent is most likely to violate this by running `git checkout <branch>` directly, treating the main worktree like a normal single-checkout repo, or using merge patterns that require a prior checkout.

`scripts/worktree.ts` enforces this with two hard guards — do not remove or relax them:
1. `cmdCreate` asserts the main worktree is on `main` before creating any new worktree, and always bases new branches off `main`.
2. `cmdMerge` asserts each repo is already on `main` and merges without a checkout — never calls `git checkout` in the main worktree.

`~/Editframe/monorepo` is a convenience symlink and the entry point for all worktree commands.

### Working in a branch worktree as an agent

An agent's working directory is fixed at launch — typically `worktrees/main/monorepo`. **There is no persistent `cd`.** After creating or identifying a branch worktree, every file edit, git command, and script invocation must use the full absolute path rooted at the branch worktree, not a relative path from the agent's cwd.

Given branch `my-feature` the worktree root is `~/Editframe/worktrees/my-feature/monorepo/`. Concrete rules:

- **File reads/edits**: absolute paths under `~/Editframe/worktrees/my-feature/monorepo/`
- **Git operations**: `git -C ~/Editframe/worktrees/my-feature/monorepo <command>` or use the `workdir` parameter in tool calls
- **Elements scripts**: `~/Editframe/worktrees/my-feature/elements/scripts/<script>`
- **Telecine scripts**: `~/Editframe/worktrees/my-feature/telecine/scripts/<script>`
- **Never** use relative paths or paths under `worktrees/main/` for branch work

To find the root for an existing branch: `git worktree list | grep my-feature`

`EDITFRAME_DIR` in scripts is always `$(dirname $(dirname $(dirname $(git rev-parse --show-toplevel))))` — three levels up from the monorepo checkout path.

### Shared infrastructure
- `editframe-postgres` — single shared PostgreSQL, each worktree gets its own database (`telecine-<branch>`)
- `editframe-traefik` — shared reverse proxy, routes by `Host` header (`<branch>.localhost`)
- `telecine-runner` / `elements-runner` — shared Docker images (not rebuilt per worktree)

### Database template
`telecine-template` is cloned from `telecine-main` (304 migrations + seed data, ~0.6s clone). Template auto-refreshes when `telecine/scripts/start` runs migrations on main.

### Port offsets
Worktree services use `cksum`-based port offsets (200 slots, spacing of 100) so host tools like Postico can connect. Main worktree uses standard ports.

### Config scripts
- `telecine/scripts/worktree-config` — exports `WORKTREE_ID`, `WORKTREE_DATABASE`, `WORKTREE_DOMAIN`, `WORKTREE_DOCKER_PROJECT_NAME`, port variables
- `elements/scripts/worktree-config` — same pattern for elements
- `.worktree-scope` file in monorepo worktree root tracks current scope

### Docker Compose profiles
- No profile = core services (always start): runner, web, valkey, graphql-engine, data-connector-agent, maintenance
- `render` profile: all worker services, scheduler-go, jit-transcoding
- `dev` profile: tracing, otel-viewer, mailhog, playwright
- `telecine/scripts/start` reads `.worktree-scope` to set `COMPOSE_PROFILES`

### Service startup ordering
Runner must start and `npm install` must complete before other services that execute application code (web, dev-projects, workers). The create and upgrade scripts handle this: `up -d runner` → `npm install` → `up -d` (remaining services).

## Syncing main into worktrees

After PRs merge to main (which happens frequently), run `worktree pull` from the main worktree:

```bash
worktree pull
```

This does three things in sequence:
1. Fetches upstream remotes for monorepo, telecine, and elements
2. Merges `origin/main` into local main for telecine and elements (fast-forward when clean)
3. Merges local main into every active worktree branch

Conflicts in `package.json`, `package-lock.json`, and `VERSION.ts` are auto-resolved by accepting main's version. All other conflicts are reported and skipped — the affected worktree is left untouched for manual resolution.

To clean up worktrees whose branches have been fully merged into main across all three repos:

```bash
worktree prune           # remove all fully-merged worktrees
worktree prune --dry-run # preview what would be removed
```

`prune` checks all three repos before removing anything — a worktree is only pruned when its branch is an ancestor of main in monorepo, telecine, and elements simultaneously.

## Worktree lifecycle

```
create (elements, 28s) → upgrade (web, 63s) → upgrade (render)
     ↓                         ↓
  pause/resume             pause/resume
     ↓
   remove
```

## Dev Server URLs

The elements dev-projects Vite server uses `root: elements/dev-projects/`. Files are served at the root path — **not** under `/dev-projects/`.

- `video.html` → `http://<branch>.localhost:4321/video.html`
- `canvas-demo.html` → `http://<branch>.localhost:4321/canvas-demo.html`

Never include `dev-projects/` in the URL path.

## dev-projects in worktrees

`elements/dev-projects/` is gitignored. Worktrees would only have committed stubs without the full asset/src tree.

`worktree create` sets `DEV_PROJECTS_HOST` in the worktree's `elements/.env` to point at main's dev-projects. The `docker-compose.yaml` dev-projects service mounts this path over `/packages/dev-projects`, so the worktree's dev server always has the full file tree from main.

## Smoke testing

`worktree smoke <branch>` is a one-shot render verification. It's not a persistent scope; use it as a pre-merge gate for render pipeline changes.

1. Requires `web` or `render` scope (errors on `elements`)
2. If scope is `web`: temporarily starts render-profile services, registers a cleanup trap to stop them on exit
3. If scope is `render`: runs against already-running services, no lifecycle management
4. Runs `telecine/scripts/smoke-test.ts` inside the runner container with `EF_HOST=http://web:3000` and the worktree's `EF_TOKEN`
5. Prints the dashboard URL (`http://<branch>.localhost:3000`) for visual inspection of render outputs
6. Prompts to press enter before stopping render services (if they were started)

Render development workflow: stay at `web` scope, run unit tests directly, use `worktree smoke` as the merge gate rather than keeping a full render stack running all day.

`scheduler-go` is a pre-built Go image not managed by docker-compose. `worktree smoke` builds it automatically on first run. `scripts/build-runner-images` also builds it.

## Editor tooling

Docker containers use named volumes for `node_modules`, which are invisible to the host filesystem. The host-side editor (VS Code, Cursor, etc.) needs its own `node_modules` to resolve TypeScript types and JSX intrinsics.

`worktree create` installs host-side deps automatically with `npm install --ignore-scripts`. For existing worktrees missing host types, run `worktree editor-deps <branch>`. `worktree doctor` detects and reports missing host-side types.

## Troubleshooting

- **Port conflict**: two branches hashed to same offset. Extremely unlikely with cksum/200 slots but possible. Remove one worktree and recreate.
- **Orphaned containers**: `worktree doctor` detects orphaned projects (containers with no matching git worktree) and prints the exact `docker rm -f` command to clean them up.
- **Partial create failure**: if `worktree create` fails partway through, the worktree directory exists but is incomplete. Run `worktree remove --force <branch>` before retrying.
- **Stale template**: run `scripts/update-template-db` to refresh from current main DB state.
