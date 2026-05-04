---
name: debug-production-renders
description: Debug production render failures in telecine. Inspect render state in the database, Valkey queues, and Cloud Run logs. Restart failed renders, trace the render pipeline flow, and diagnose fragment-level failures.
---

# Debug Production Renders

Telecine renders flow through a queue-based pipeline backed by Valkey (Redis-compatible). Each render is a **workflow** that progresses through multiple **queues**, each served by a dedicated Cloud Run worker service. Debugging a render means checking its state at three layers: the Postgres database, the Valkey queue state, and the Cloud Run worker logs.

## Quick Start

All debug scripts run inside docker. From the monorepo root:

```bash
# Full render status: DB row, fragment breakdown, error detail
telecine/scripts/debug-render <render-id>

# Add live Valkey state (queued/claimed/completed/failed jobs)
telecine/scripts/debug-render <render-id> --redis

# Add docker compose log grep (local dev only)
telecine/scripts/debug-render <render-id> --logs

# All three
telecine/scripts/debug-render <render-id> --redis --logs
```

## Render Pipeline Flow

A render progresses through queues in this order:

1. **process-html-initializer** -- Preprocesses raw HTML from the API submission.
2. **process-html-finalizer** -- Sets workflow data, then enqueues the render-initializer job. This is the bridge from the HTML pipeline into the render pipeline.
3. **render-initializer** -- Checks out render source, extracts render info (dimensions, duration, fps) via Electron RPC, creates an assets metadata bundle, then fans out N fragment jobs. For still images (png/jpeg/webp), renders the image directly and skips fragments.
4. **render-fragment** (N parallel) -- Each job renders one time slice of the video via Electron RPC, writes the fragment file to storage, and reports progress.
5. **render-finalizer** -- Auto-triggered when all fragment jobs complete. Merges fragment files into the final output. Marks the render as complete.

The pipeline is triggered by a Hasura event on `INSERT` into `video2.renders`. The workflow system automatically routes the finalizer queue job when all child jobs complete or when any job fails with exhausted retries.

Queue names, worker service names, and resource allocations are defined in source files -- see "Key Source Files" below.

## Debug Scripts

| Script | Purpose |
|---|---|
| `telecine/scripts/debug-render <id> [--redis] [--logs]` | Primary debug tool: DB state, fragments, errors, optional Valkey + logs |
| `telecine/scripts/inspect-render.ts` | Lower-level Valkey inspection: workflow data, claimed jobs with ages, all workflow keys |
| `telecine/scripts/check-queue.ts` | Queue-level Valkey state: queued/claimed/failed counts, org membership |
| `telecine/scripts/restart-render.ts` | Restart a failed render: resets DB status, re-enqueues initializer job |
| `telecine/scripts/create-render.ts` | Create a test render from an existing render's org context |
| `telecine/scripts/render-logs [-f] <id>` | Grep docker compose logs for initializer/fragment/finalizer services |
| `worktree smoke [branch]` (runs `telecine/scripts/smoke-test.ts`) | End-to-end smoke tests via the public API |
| `telecine/scripts/smoke-test-waveform.ts` | Waveform-specific smoke test: inserts renders directly into DB, exercises all ef-waveform modes concurrently |
| `telecine/scripts/console` | Node REPL with project imports (db, valkey, queues available) |

Run `.ts` scripts via: `telecine/scripts/run tsx scripts/<script>.ts <args>`

## Querying Cloud Run Logs

There are no dedicated log-querying scripts. Use `gcloud` directly. Workers log structured JSON via pino, so use `jsonPayload` filters:

```bash
# All render workers for a specific render ID
gcloud logging read \
  'resource.type="cloud_run_revision"
   AND resource.labels.service_name=~"telecine-worker-render"
   AND jsonPayload.renderId="<RENDER-ID>"' \
  --project=editframe --limit=100 --format=json

# Specific worker stage
gcloud logging read \
  'resource.type="cloud_run_revision"
   AND resource.labels.service_name="telecine-worker-render-initializer"
   AND jsonPayload.renderId="<RENDER-ID>"' \
  --project=editframe --limit=100

# Errors only across all workers
gcloud logging read \
  'resource.type="cloud_run_revision"
   AND resource.labels.service_name=~"telecine-worker"
   AND severity>=ERROR
   AND jsonPayload.renderId="<RENDER-ID>"' \
  --project=editframe --limit=50
```

Cloud Run service names follow the pattern `telecine-worker-{queue-name}`. See `telecine/deploy/resources/queues/configs.ts` for the full list of queue names.

## Valkey Key Schema

Queues and workflows use predictable Valkey key patterns. Understanding these lets you query state directly when scripts don't cover your case.

**Queue-level keys** (per queue name):
- `queues:{queueName}:queued` -- zset of job keys waiting to be claimed
- `queues:{queueName}:claimed` -- zset of job keys being processed (score = claim timestamp)
- `queues:{queueName}:completed` -- zset of completed job keys
- `queues:{queueName}:failed` -- zset of failed job keys
- `queues:{queueName}:jobs:{jobId}` -- serialized job data (SuperJSON)
- `queues:{queueName}:orgs` -- zset of org keys with active jobs

**Workflow-level keys** (per render ID):
- `workflows:{renderId}:queued` -- zset of workflow-level queued jobs
- `workflows:{renderId}:claimed` -- zset of claimed jobs
- `workflows:{renderId}:completed` -- zset of completed jobs
- `workflows:{renderId}:failed` -- zset of failed jobs
- `workflows:{renderId}:data` -- SuperJSON workflow payload (render config)
- `workflows:{renderId}:status` -- workflow status string

**Progress tracking:**
- `render:{renderId}` -- Redis stream for fragment completion progress

Stalled jobs are detected by checking claimed jobs whose score (claim timestamp) is older than 10 seconds.

## Database Tables

Render state is persisted in Postgres via Kysely (not Prisma). The `db` client is imported from `@/sql-client.server`.

- `video2.renders` -- Main render record: status, html, org_id, dimensions, fps, duration_ms, failure_detail, timestamps
- `video2.render_fragments` -- Per-segment fragment records: render_id, segment_id, attempt_number, timestamps, last_error
- `video2.process_html` -- HTML processing records
- `video2.files` -- File records (used by process-isobmff and ingest-image)

Render status values: `created` -> `queued` -> `rendering` -> `complete` | `failed`

## Debugging Workflow

1. **Start with `debug-render`** -- get the DB status, error detail, and fragment breakdown.
2. **If stuck in "rendering"** -- add `--redis` to see if jobs are queued, claimed (possibly stalled), or silently failed in Valkey.
3. **If Valkey state is unclear** -- use `inspect-render.ts` for detailed claimed job ages and `check-queue.ts` for queue-level counts.
4. **If you need worker logs** -- query Cloud Run logs with `gcloud` using the render ID (see commands above). In local dev, use `--logs` flag or `render-logs` script.
5. **To retry** -- use `restart-render.ts` to reset DB state and re-enqueue the initializer.
6. **For production DB access** -- use `telecine/scripts/debug-prod-web --use-prod-db --shell` to get a container with production database connectivity.

## Diagnosing Electron RPC Failures

Fragment renders fail via RPC timeout. The stack trace tells you how far rendering got:

- **`RPC.ts:182`** — initial 5 s timer fired, no keepalives received at all. Electron never started rendering. Causes: scheduler opened more connections than the single local container can handle (see below), Electron failed to load the page, or the render context couldn't be created.
- **`RPC.ts:153`** — keepalive-reset timer fired mid-render. At least one frame rendered before the hang. Causes: a race condition aborted an in-flight fetch (the `AbortError` case), a frame took too long, or Electron crashed mid-segment.

### AbortError / FrameController race

If Electron logs show `[EF_FRAMEGEN.beginFrame] error: [object DOMException]` / `AbortError: The user aborted a request`, a fetch started during `seekForRender` was cancelled by an autonomous re-render firing concurrently. This is a timing-dependent race: `EFTemporal.updated()` or `EFTimegroup.updated()` fires when media loads and calls `FrameController.abort()`, killing the in-flight GCS fetch.

Fix: set `data-no-playback-controller` on the timegroup before `seekForRender` to suppress autonomous re-renders — the same attribute used on render clones. Check `EF_FRAMEGEN.ts` `initialize()` and `EFTemporal.ts`/`EFTimegroup.ts` `updated()`.

### Scheduler over-scaling in local dev

In production, `MAX_WORKER_COUNT` controls how many Cloud Run instances the scheduler spins up. Locally there is one container per queue. If the scheduler opens more WebSocket connections than the single container expects (e.g. 30 connections for 30 queued jobs), every concurrent `renderFragment` RPC call beyond the worker's `WORKER_CONCURRENCY` quota times out at `RPC.ts:182` before Electron starts processing it.

The two dials and how they interact:

| Dial | Production | Local dev |
|---|---|---|
| `MAX_WORKER_COUNT` | scales container count | must match `scale:` in docker-compose (usually 1) |
| `WORKER_CONCURRENCY` | jobs per container | effective parallelism when `MAX_WORKER_COUNT=1` |

Both are read from `telecine/.env` (via `env_file` in worker containers and `${VAR:-default}` substitution in `scheduler-go/docker-compose.yaml`). Changing them requires `telecine/scripts/docker-compose up -d` (not just `restart`) to force recreation with the new env.

## Key Source Files

- `telecine/scripts/debug-render.ts` -- Primary debug tool implementation
- `telecine/scripts/inspect-render.ts` -- Low-level Valkey render inspection
- `telecine/scripts/check-queue.ts` -- Queue-level Valkey state checker
- `telecine/scripts/restart-render.ts` -- Render restart/retry tool
- `telecine/lib/queues/Queue.ts` -- Queue base class, key patterns
- `telecine/lib/queues/Workflow.ts` -- Workflow base class, workflow key patterns
- `telecine/lib/queues/Job.ts` -- Job serialization, enqueue, stall detection
- `telecine/lib/queues/units-of-work/Render/` -- Render pipeline queue/worker definitions
- `telecine/lib/queues/units-of-work/ProcessHtml/` -- HTML pipeline queue/worker definitions
- `telecine/deploy/resources/queues/configs.ts` -- Production queue names and scaling config
- `telecine/deploy/resources/queues/defineWorker.ts` -- Cloud Run service definition template
- `telecine/deploy/resources/constants.ts` -- GCP project/region constants
- `telecine/lib/valkey/valkey.ts` -- Valkey connection setup

## When to Use This Skill

Use this skill when:
- A production render is stuck, failed, or producing unexpected results
- You need to trace a render through the pipeline to find where it stalled
- You need to query Cloud Run logs for a specific render
- You need to inspect or manipulate Valkey queue state
- You need to restart a failed render
- You need to understand the render pipeline architecture
