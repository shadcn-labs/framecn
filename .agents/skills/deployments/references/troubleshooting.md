---
name: deployment-troubleshooting
description: Error triage workflow, rollback procedures, debugging failed deployments, production SRE, scaling resources, and managing secrets.
---

# Deployment Troubleshooting & Operations

## Error Triage Workflow

When investigating production issues, start broad and drill down. The workflow is: **grouped errors → service logs → revision correlation**.

### Step 1: Get grouped errors from Error Reporting

The `gcloud` CLI does not have list/describe commands for error groups. Use the Error Reporting REST API via an access token:

```bash
ACCESS_TOKEN=$(gcloud auth print-access-token)
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
  "https://clouderrorreporting.googleapis.com/v1beta1/projects/editframe/groupStats?pageSize=20" \
  | python3 -m json.tool
```

This returns error groups sorted by frequency, each containing:
- `count` — total occurrences
- `group.groupId` — unique error group identifier
- `affectedServices` — which Cloud Run services/revisions are affected
- `representative.message` — a sample stack trace
- `firstSeenTime` / `lastSeenTime` — time range

Filter by service or time window:

```bash
# Filter to a specific service
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
  "https://clouderrorreporting.googleapis.com/v1beta1/projects/editframe/groupStats?serviceFilter.service=telecine-web&pageSize=20" \
  | python3 -m json.tool

# Filter by time range (RFC 3339)
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
  "https://clouderrorreporting.googleapis.com/v1beta1/projects/editframe/groupStats?timeRange.period=PERIOD_1_HOUR&pageSize=20" \
  | python3 -m json.tool
```

Time period options: `PERIOD_1_HOUR`, `PERIOD_6_HOURS`, `PERIOD_1_DAY`, `PERIOD_1_WEEK`, `PERIOD_30_DAYS`.

### Step 2: Drill into Cloud Run logs

Once you've identified the error group and affected service, query Cloud Run logs for details:

```bash
# Get the latest revision for a service
gcloud run services describe <service-name> --region=us-central1 --project=editframe \
  --format="value(status.latestReadyRevisionName)"

# Get errors from a specific service
gcloud logging read 'resource.type="cloud_run_revision"
  AND resource.labels.service_name="<service-name>"
  AND severity>=ERROR' \
  --project=editframe --limit=20 --freshness=1h \
  --format="table(timestamp,textPayload)"

# Get errors from a specific revision
gcloud logging read 'resource.type="cloud_run_revision"
  AND resource.labels.service_name="<service-name>"
  AND resource.labels.revision_name="<revision>"
  AND severity>=ERROR' \
  --project=editframe --limit=20 --freshness=1h \
  --format="table(timestamp,textPayload)"

# Correlate with HTTP 500s
gcloud logging read 'resource.type="cloud_run_revision"
  AND resource.labels.service_name="<service-name>"
  AND httpRequest.status>=500' \
  --project=editframe --limit=10 --freshness=1h \
  --format="table(timestamp,httpRequest.requestUrl,httpRequest.status)"
```

### Step 3: Correlate with revisions and deployments

Determine whether an error is new (introduced by a recent deploy) or pre-existing:

```bash
# List recent revisions for a service
gcloud run revisions list --service <service-name> \
  --region us-central1 --project editframe --limit=5

# Check if the error exists in an older revision
gcloud logging read 'resource.labels.revision_name="<old-revision>"
  AND "<error-substring>"' \
  --project=editframe --limit=5 --freshness=120d

# Compare error counts between revisions
gcloud logging read 'resource.labels.revision_name="<new-revision>"
  AND severity>=ERROR' \
  --project=editframe --limit=50 --freshness=1d \
  --format="table(timestamp,textPayload)" | wc -l
```

If the error only appears in the new revision, the deploy introduced it. If it's present in older revisions too, it's a pre-existing issue.

### Interpreting common error patterns

- **"No route matches URL"** — Requests for paths that don't exist in the router (old asset URLs, bot probes). Usually noise.
- **"Not allowed by CORS"** — Origin mismatch. Check the CORS config in the express middleware.
- **"No such object" (GCS)** — A referenced file was deleted or never created. Check the object path and the workflow that produces it.
- **"No available instance"** — Cloud Run couldn't scale up in time. Check instance limits and cold start time.
- **"RPC timeout"** — Worker-to-worker communication timed out. Check the target worker's health and resource limits.
- **"No value found for context"** — React Router middleware context not available. Usually means `react-router.config.ts` was not picked up during build (see telecine.md, "Web Build" section).
- **Build failures (UNRESOLVED_IMPORT)** — Worker build can't resolve imports. Check that referenced source files exist at the expected paths.
- **"Memory limit exceeded"** — Container hit its memory ceiling. Increase memory in `worker-resources.config.ts` or the service's `cloudrun.ts`.

## Production SRE

The user's machine is authenticated to gcloud. Use it directly for log queries, revision inspection, and service management.

### Booting production containers locally

Run the prod Docker image locally to reproduce issues without deploying. The container needs env vars — provide minimal values for vars that aren't relevant to the issue being debugged:

```bash
docker run --rm -p 3099:3000 \
  -e NODE_ENV=production \
  -e APPLICATION_SECRET=test \
  -e APPLICATION_JWT_SECRET=test \
  <image-sha> 2>&1 | head -40
```

The web container will crash if queue-related env vars are missing (they're required at module load time). For HTTP-layer debugging, provide all required env vars from `scripts/deploy-info telecine`.

### Inspecting server build output from Docker images

Extract files from a Docker image without running it:

```bash
# Create a stopped container, copy files out
docker create --name tmp <image-sha>
docker cp tmp:/app/services/web/build/server/assets/ /tmp/inspect/
docker rm tmp

# Or use tar for full listing (works with distroless images that have no shell)
docker export tmp | tar -t | grep "build/server"
```

## Rollback Procedures

### Telecine: Roll back a Cloud Run service

Cloud Run keeps previous revisions. To roll back to the last known-good revision:

```bash
# List recent revisions for a service (use deploy-info to get service names)
gcloud run revisions list --service <service-name> --region us-central1 --project editframe

# Route 100% traffic to a specific revision
gcloud run services update-traffic <service-name> \
  --to-revisions=<revision-name>=100 \
  --region us-central1 \
  --project editframe
```

To roll back via Pulumi (redeploy a previous image):

```bash
# Find the previous good commit SHA
git log --oneline -10

# Build and push that specific version
cd telecine
scripts/build-and-push <service>  # builds with current HEAD SHA

# Or: manually tag and push an older image
docker tag us-central1-docker.pkg.dev/editframe/telecine-artifacts/<service>:<old-sha> \
           us-central1-docker.pkg.dev/editframe/telecine-artifacts/<service>:<new-sha>
docker push us-central1-docker.pkg.dev/editframe/telecine-artifacts/<service>:<new-sha>
```

Then run `pulumi up` in `telecine/deploy/`.

### Telecine: Full infrastructure rollback

If Pulumi state is corrupted or a resource change broke things:

```bash
cd telecine/deploy
# Preview what Pulumi wants to change
pulumi preview

# If needed, revert the deploy code and re-run
git checkout <good-commit> -- deploy/
pulumi up -y
```

### Elements: Roll back an npm release

npm does not support true unpublish for packages older than 72 hours. Instead:

```bash
# Check what's currently published:
npm view @editframe/elements versions --json

# Tag a previous version as latest:
npm dist-tag add @editframe/elements@<good-version> latest
```

For a full rollback, revert the commit, bump to a new patch version, and run `elements/scripts/prepare-release <new-version>`.

## CI Monitoring

Use the provided scripts to monitor CI runs. Never use raw `gh` commands -- the scripts handle polling, formatting, and log extraction.

```bash
# Poll telecine deploy until complete (30s intervals)
scripts/wait-for-telecine-action

# Poll elements release until complete
scripts/wait-for-elements-action

# Get logs for a failed run (most recent)
scripts/gh-logs editframe/telecine

# Get logs for a specific run
scripts/gh-logs editframe/telecine 22169288214

# Generic poller for any repo
scripts/wait-for-github-action editframe/telecine deploy.yaml
```

## Debugging Failed Deployments

### Telecine CI/CD failures

Start with `scripts/gh-logs editframe/telecine` to get the failed job logs.

**Docker build failures:**
- Common causes: dependency install failures, Dockerfile syntax errors, out of disk (especially `transcribe`)
- The `transcribe` image gets special handling: disk space is freed before build, and the whisper builder cache is pulled separately
- The `web` image requires `skills/skills/` in the build context -- these are embedded in the telecine subtree

**Pulumi failures:**
- Run `pulumi preview` locally to see what Pulumi wants to change
- Check for IAM permission issues (the deployer uses Workload Identity Federation)
- Check for resource quota limits in GCP Console
- Pulumi state is in `gs://deployment-state` -- if state is out of sync, use `pulumi refresh`

**Cloud Run deployment failures:**
- Check Cloud Run logs in GCP Console: `https://console.cloud.google.com/run?project=editframe`
- Check if the container starts successfully: health check failures prevent traffic routing
- Check environment variables and secret bindings in the Pulumi resource definition

### Elements CI/CD failures

Start with `scripts/gh-logs editframe/elements` to get the failed job logs.

**Common failure points:**
1. Type check failed -- fix type errors, beta tags skip this check
2. Tests failed -- fix tests, beta tags skip this check
3. npm publish auth failure -- uses Trusted Publishing (OIDC), check environment and permissions
4. Subtree push failure -- check that `elements` git remote is configured and accessible

**Local debugging:**
```bash
elements/scripts/docker-compose run --rm runner npm run typecheck --workspaces
elements/scripts/docker-compose run --rm runner npm run lint
elements/scripts/docker-compose run --rm runner npm run format
```

## Scaling Resources

### Adjust worker CPU/memory

Edit `telecine/deploy/worker-resources.config.ts`. Values use millicores for CPU (e.g., `"2000m"` = 2 vCPU) and standard Kubernetes memory notation (e.g., `"4Gi"`).

Run `scripts/deploy-info telecine` to see current allocations.

Then deploy: push to `main` or run `pulumi up` manually.

### Adjust instance counts

Instance min/max are defined in each service's Cloud Run definition (`cloudrun.ts`) under `template.scaling.minInstanceCount` and `template.scaling.maxInstanceCount`.

For workers, these are set via `maxWorkerCount` in `telecine/deploy/resources/queues/workers.ts` (all workers have `minInstanceCount: 0`). For public services, check their respective directories under `telecine/deploy/resources/`.

Run `scripts/deploy-info telecine` to see current instance limits.

### Adjust concurrency

Cloud Run concurrency (requests per instance) is configured as `maxInstanceRequestConcurrency` in each service's `cloudrun.ts` file.

## Secret Management

Secrets are managed via GCP Secret Manager and referenced in Pulumi. Run `scripts/deploy-info telecine` to see the current list of secret names.

Secret definitions live in `telecine/deploy/resources/secrets.ts`. The postgres password is managed separately in `telecine/deploy/resources/database/`.

### Add a new secret

1. Create the secret in GCP Secret Manager:
```bash
echo -n "secret-value" | gcloud secrets create my-new-secret \
  --data-file=- \
  --project=editframe \
  --replication-policy=automatic
```

2. Reference it in Pulumi by adding to `telecine/deploy/resources/secrets.ts`:
```typescript
export const myNewSecret = secretToken("my-new");
```

3. Bind it to the service that needs it in the service's Cloud Run resource definition (as an environment variable or volume mount).

4. Deploy via push to `main` or `pulumi up`.

### Rotate a secret

1. Add a new version in Secret Manager:
```bash
echo -n "rotated-value" | gcloud secrets versions add <secret-name> \
  --data-file=- \
  --project=editframe
```

2. Cloud Run services reference the `latest` version by default, so a new deployment will pick it up. Force a new deployment by pushing to `main` or running `pulumi up`.

## Service Health Checks

### Check Cloud Run service status

```bash
# List all services
gcloud run services list --region us-central1 --project editframe

# Describe a specific service
gcloud run services describe <service-name> --region us-central1 --project editframe

# View recent logs
gcloud run services logs read <service-name> --region us-central1 --project editframe --limit 50
```

### Check Pulumi stack state

```bash
cd telecine/deploy
pulumi login gs://deployment-state
pulumi stack select telecine-dot-dev
pulumi stack  # shows current state summary
pulumi preview  # shows pending changes
```
