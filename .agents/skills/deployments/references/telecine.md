---
name: telecine-deployment
description: GCP Cloud Run deployment architecture, CI/CD workflow, and manual deployment procedures for telecine services.
---

# Telecine Deployment

## Architecture

Telecine runs on GCP Cloud Run (v2), managed by Pulumi (TypeScript). All infrastructure definitions live in `telecine/deploy/`. Docker images are built with buildx and pushed to GCP Artifact Registry, tagged with the git commit SHA.

An HTTPS load balancer with URL-map routing directs traffic to the appropriate Cloud Run service based on path and host rules. Cloudflare manages DNS for the production domains.

GCP Secret Manager stores application secrets, which are mounted as environment variables in Cloud Run services. Workload Identity Federation authenticates GitHub Actions for CI/CD.

Run `scripts/deploy-info telecine` to see all current services, resource allocations, routes, secrets, and domains.

## CI/CD Workflow

Defined in `telecine/.github/workflows/deploy.yaml`. Triggered on push to `main`.

**Test gate (required before deploy):** The `deploy` job depends on `integration`, `playwright`, and `typecheck` all passing. Pushing directly to `main` without those jobs green will not trigger a deploy. The standard flow is to push to a branch, open a PR, let CI pass, then merge.

```bash
# Standard deploy flow (run from worktrees/<branch>/telecine/)
git push origin <branch>            # push branch to telecine remote
# open PR at github.com/editframe/telecine, enable auto-merge (squash)
# CI runs integration + playwright + typecheck
# on pass: PR auto-merges to main, deploy workflow triggers
scripts/wait-for-telecine-action    # poll until deploy completes (run from monorepo)
```

**Step 1: Docker builds (parallel matrix).** All services build in parallel using a GitHub Actions strategy matrix. Each job authenticates to GCP via Workload Identity Federation, builds with `scripts/build-docker-prod <service>`, and pushes with `scripts/push-docker-prod <service>`. Images use registry-based build caching.

**Step 2: Pulumi deploy (after all builds and tests).** Logs into Pulumi state storage, selects the stack, and runs `pulumi up`. Pulumi picks up the new image tags (git SHA) and updates Cloud Run services.

Run `scripts/deploy-info telecine` to see the current CI/CD build matrix.

## Manual Deployment

### Deploy specific services

```bash
# Build and push one or more services (from telecine/ directory)
scripts/build-and-push web scheduler-go

# Then run Pulumi to update Cloud Run
cd deploy && pulumi up
```

### Deploy all services

```bash
# Build and push every service
scripts/build-and-push-all

# Then run Pulumi
cd deploy && pulumi up
```

### Build without pushing (local testing)

```bash
scripts/build-docker-prod web
```

Images are tagged with the current git SHA (or `latest` if no SHA available). Always use `build-docker-prod` to reproduce CI Docker build failures locally — it's much faster than waiting for CI round-trips.

## Web Build: react-router config resolution

The web service uses React Router v7 with the `--config services/web/vite.config.ts` flag. The `react-router build` CLI derives `rootDirectory` from the config file path (`path.dirname(resolve(configPath))`), NOT from `process.cwd()`. This means `rootDirectory` resolves to `/app/services/web/` in Docker, while `react-router.config.ts` lives at `/app/`.

The fix: `Dockerfile.web.prod` sets `ENV REACT_ROUTER_ROOT=/app` before the build command, which overrides the path-derived root. `react-router.config.ts` sets `buildDirectory: "./services/web/build"` to keep output at the expected location relative to root.

If `react-router.config.ts` is not found during build, `future` flags (including `v8_middleware`) silently default to `false`. The build still succeeds because `appDirectory` defaults to `"app"` which happens to resolve correctly from either root. Symptoms: middleware never runs in production, `context.get()` throws "No value found for context" in route loaders.

To verify the config was picked up, extract the server build JS from the Docker image and check:

```bash
rg "v8_middleware" /tmp/extracted/server-build-*.js
# Should show: "v8_middleware": true
```

## Pulumi Resource Layout

Each Cloud Run service has its own directory under `telecine/deploy/resources/` containing `cloudrun.ts` (the service definition), `serviceAccount.ts`, and for public services `backendService.ts` and `endpointGroup.ts` (for load balancer integration).

Workers are defined in `telecine/deploy/resources/queues/`. Worker CPU and memory allocations come from `telecine/deploy/worker-resources.config.ts`. The `defineWorker.ts` helper creates a Cloud Run service for each worker with standard settings (min instances 0, internal-only ingress).

The load balancer URL map in `telecine/deploy/resources/loadbalancer/urlmap.ts` defines path-based routing to backend services.

Run `scripts/deploy-info telecine` for the current file listing, routes, and resource values.
