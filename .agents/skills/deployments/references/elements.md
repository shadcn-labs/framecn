---
name: elements-release
description: npm package release workflow, versioning, and publishing for @editframe packages.
---

# Elements Release

Elements publishes `@editframe` scoped packages to npm. All packages share a single version number.

Run `scripts/deploy-info elements` to see the current package list, version, and release pipeline steps.

## Release Workflow

### Full release (recommended)

```bash
elements/scripts/prepare-release <version>
```

This runs a complete pre-release validation pipeline (typecheck, lint, format, dependency verification, tests, browser tests, build, CLI boot check, export verification) then bumps versions, commits, tags, and pushes.

Run `scripts/deploy-info elements` to see the exact steps `prepare-release` currently executes.

The `version` step at the end of the pipeline handles:
- Writing version to `packages/cli/src/version.ts`
- Running `npm version` across all workspaces
- Updating inter-package dependencies via `scripts/deps.js`
- Committing with message `Bump version to v<version>`
- Creating a git tag `v<version>`
- Pushing the `elements/` subtree to the `elements` remote
- Pushing tags to both `elements` and `telecine` remotes

### Beta prerelease

```bash
elements/scripts/prerelease
```

Bumps all workspaces to the next beta prerelease version (e.g., `1.0.0` -> `1.0.1-beta.0`). This does **not** run validation, build, or push -- it only bumps version numbers locally. You still need to commit, tag, and push manually.

### Manual publish (without prepare-release)

```bash
elements/scripts/publish
```

Publishes all workspaces to npm. Determines the dist-tag from the current git tag:
- Tags containing "beta" -> `npm publish --tag beta`
- All others -> `npm publish --tag latest`

## CI/CD Workflow

Defined in `elements/.github/workflows/release.yaml`. Triggered by pushing **any** git tag.

The workflow builds all packages, runs validation (type check, lint, format, tests -- skipped for beta tags), publishes to npm, and creates a GitHub Release.

## Push Workflow

`elements` is a standalone sibling repo cloned at `~/Editframe/worktrees/<branch>/elements/`. The `version` script handles pushing directly via `git push` and `git push --tag` from within that repo.

**Run `prepare-release` from inside the sibling elements repo** (`worktrees/<branch>/elements/`). The script commits, tags, and pushes to `origin` automatically.

## Re-tagging After Post-version Commits

If commits are made after `prepare-release` (e.g. hotfixes), delete and recreate the tag on the updated commit:

```bash
# From worktrees/<branch>/elements/
git push origin :refs/tags/v<version>
git tag -f v<version> HEAD -m "<version>"
git push origin v<version>
```

Always push the branch commit first, then delete + recreate the tag. Force-pushing a tag without updating the branch first causes CI not to trigger (GitHub deduplicates).

## Monitoring CI Runs

`gh run watch` redraws continuously — avoid it in automated contexts. Use this pattern instead (emits only on status change, blocks until done):

```bash
last=""; while true; do
  cur=$(gh run view <run-id> --repo editframe/elements --json status,conclusion \
    -q '"[\(.status)] \(.conclusion // "pending")"')
  [ "$cur" != "$last" ] && echo "$cur" && last="$cur"
  echo "$cur" | grep -q "completed" && break
  sleep 30
done
```

To check which step failed after a run completes:
```bash
gh run view --job=<job-id> --repo editframe/elements
```

To get the job ID:
```bash
gh run view <run-id> --repo editframe/elements
```

## Known CI-Only Failures

These tests fail in CI but not locally — they must be skipped or marked as CI-incompatible:

- **`ctx.drawElementImage is not a function`** — Chrome's `drawElementImage` canvas API is not available in the headless Chromium used by CI. Tests calling `renderToImageNative` / `captureDomDirectly` with `isNativeCanvasApiAvailable()` must guard with a skip when the API is absent.
- **Visual regression tests** — Snapshots generated locally (macOS) differ from CI (Linux) due to font rendering differences. Snapshots must be generated on Linux or tests must use a tolerance threshold appropriate for cross-platform rendering.
- **Performance assertions** — Tests asserting minimum frame counts or throughput numbers are inherently flaky across machines. Either remove hard numeric assertions or make them very conservative.
