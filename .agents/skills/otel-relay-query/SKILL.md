---
name: otel-relay-query
description: Query the otel-relay span store directly via HTTP to interrogate traces from local render runs without consuming the full SSE stream.
---

# otel-relay Query API

The otel-relay collects OTel spans from all local telecine services (including the Electron renderer via IPC) and exposes them through both a live SSE stream and a queryable HTTP API. Use the query API during render analysis to find specific spans, compare traces, and verify instrumentation without loading the full buffer.

The query API runs on the same port as the SSE stream (default `4319`, set by `WORKTREE_TRACING_SSE_PORT` in docker-compose). No separate port or service required.

## Quick Start

```bash
# 1. Clear state before a test run
curl -X DELETE http://localhost:4319/api/buffer

# 2. Start a render (via the app or a test script)

# 3. Query what arrived
curl http://localhost:4319/api/summary
```

## Endpoints

### `GET /api/summary`
Span count, trace count, service names, and time range. Use first to confirm spans are arriving.

### `GET /api/traces`
List of traces, most recent first. Optional query params: `?service=`, `?name=` (root span name contains), `?from=` / `?to=` (unix ms), `?limit=` (default 50).

### `GET /api/traces/{traceId}`
All spans for one trace sorted by start time. Returns `{ traceId, spans: [...] }`.

### `GET /api/spans`
Flat list of matching spans. Query params:
- `?name=` — exact span name
- `?namePrefix=` — prefix match (e.g. `SegmentEncoder`)
- `?traceId=` — all spans in a trace
- `?attr.{key}={value}` — attribute filter, repeatable (e.g. `?attr.renderId=abc&attr.jobId=xyz`)
- `?from=` / `?to=` — unix ms time range
- `?limit=` — default 100, max 1000

### `DELETE /api/buffer`
Clears the span store and the SSE ring buffer. Run before each test render for a clean baseline.

## Common Patterns

**Check whether SegmentEncoder spans are reaching Cloud Trace**
```bash
# If these exist locally, missing production spans = exporter/context issue, not missing instrumentation
curl "http://localhost:4319/api/spans?namePrefix=SegmentEncoder&limit=5"
curl "http://localhost:4319/api/spans?namePrefix=ElectronEngine&limit=5"
```

**Measure Electron cold-start overhead**
```bash
# rpcReady span is present on cold instances, absent when Electron is reused
curl "http://localhost:4319/api/spans?name=rpcReady"
```

**Get the full trace for a specific render job**
```bash
# traceId comes from Cloud Logging: jsonPayload.workflowId → find matching "Claimed job" log entry
curl "http://localhost:4319/api/traces/{traceId}"
```

**Find all spans for a render by attribute**
```bash
curl "http://localhost:4319/api/spans?attr.renderId=6b529000-4b6d-4103-a4e5-3d803dfa64c8"
```

**Compare fast vs slow traces**
```bash
# List all traces, note the traceIds of slow vs fast jobs
curl "http://localhost:4319/api/traces?limit=20"

# Then pull each trace for comparison
curl "http://localhost:4319/api/traces/{slow-traceId}"
curl "http://localhost:4319/api/traces/{fast-traceId}"
```

## Architecture

Spans are indexed in a `SpanStore` on every ingest event (both gRPC and HTTP OTLP paths). Three secondary indexes — by traceId, by span name, by attribute key+value — allow `QuerySpans` to pick the most selective index before filtering, keeping queries fast even at the 50k-span buffer cap. Spans are deduplicated by spanId and evicted FIFO when the cap is hit.

The `SpanStore` is parallel to the SSE ring buffer; clearing one clears both via `DELETE /api/buffer`.

Source: `telecine/services/otel-relay/store.go`, `api.go`.

## When to Use This Skill

Use when running a local render and need to:
- Verify that specific spans (e.g. `SegmentEncoder.renderFrame`, `ElectronEngine.captureFrame`) are being emitted
- Diagnose missing production traces by confirming the instrumentation works locally
- Compare span structure between fast and slow jobs
- Measure cold-start rate (`rpcReady` presence) or GCS write overhead during a benchmark run
