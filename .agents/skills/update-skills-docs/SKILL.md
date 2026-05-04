---
name: update-skills-docs
description: Sync skills documentation to match recent source changes. On load, immediately finds commits newer than the skills-sync tag, identifies doc-relevant changes, and implements updates.
---

# Update Skills Docs

On load: immediately run the analysis below. No preamble.

## Step 1: Find the sync point

```bash
git rev-parse skills-sync
```

If the tag does not exist, create it at the last commit that touched `skills/skills/`:

```bash
BOOTSTRAP=$(git log --oneline -- skills/skills/ | head -1 | awk '{print $1}')
git tag -a skills-sync $BOOTSTRAP -m "skills synced $(date -I)"
git push skills skills-sync
```

## Step 2: Check if already synced

```bash
git log skills-sync..HEAD --oneline
```

If this produces no output, the tag is already at HEAD. Report "Skills docs are up to date." and stop — do not proceed.

## Step 3: Get doc-relevant commits

```bash
git log skills-sync..HEAD --name-only --oneline
```

Filter the changed files to doc-relevant paths only. Ignore all others.

### Doc-relevant path prefixes

| Path prefix | Skill |
|---|---|
| `elements/packages/api/src/resources/` | `editframe-api` |
| `elements/packages/cli/src/commands/` | `editframe-cli` |
| `elements/packages/vite-plugin/src/index.ts` | `vite-plugin` |
| `elements/packages/elements/src/elements/` | `composition` |
| `elements/packages/elements/src/gui/` | `editor-gui` |
| `elements/packages/react/src/gui/` | `editor-gui` |
| `elements/packages/react/src/hooks/` | `composition` |

### Exclusion patterns (skip these files entirely)

- `*.browsertest.ts`, `*.test.ts`
- Any path under `src/preview/`, `src/transcoding/`, `src/canvas/`, `src/profiling/`
- Commit subjects matching `^Bump version`
- Lock files, snapshot files, formatter-only commits (subject starts with `style:` or `format:`)

## Step 4: Read the diffs

For each matched file in a relevant commit:

```bash
git show <hash> -- <file>
```

Look specifically for:
- New `@property` or `@attribute` decorators added to elements
- Removed properties/attributes
- Changed default values
- New exported functions, hooks, or types
- Changed function signatures or event detail shapes
- New or removed API endpoint paths in the vite plugin
- New fields on API payload types (`z.object(...)` in resources files)

## Step 5: Read the corresponding skill doc

Match the changed file to a skill using the table above, then find the relevant reference file in `skills/skills/<skill>/references/`. Read it with the Read tool.

## Step 6: Identify discrepancies

For each matched commit + skill doc pair, identify:
1. Facts in the doc that are now wrong (stale endpoint paths, removed attributes, changed event shapes)
2. New API surface not documented (new attributes, new fields, new hooks)
3. Behavior changes that contradict existing doc prose

Present a numbered list of specific changes before implementing if there are more than 3 items. For 1-3 items, implement immediately.

## Step 7: Implement updates

Edit the skill doc files directly. Keep changes minimal and factual — update the specific attribute, endpoint, type, or behavior description. Do not restructure docs.

## Step 8: Advance the tag

After all updates are complete:

```bash
git tag -f -a skills-sync HEAD -m "skills synced $(date -I)"
git push skills skills-sync
```

Then sync internal skills to agent directories and push skills docs:

```bash
npm run skills:sync
./scripts/push-skills
```

Then commit:

```bash
git add .skills/ skills/skills/ .claude/skills/ .cursor/skills/ .opencode/skills/
git commit -m "sync skills docs to HEAD"
```

## Bootstrap note

The `skills-sync` tag lives in the monorepo and is pushed to the `skills` remote. The monorepo has no `origin` remote — use `git push skills skills-sync` not `git push origin skills-sync`.
