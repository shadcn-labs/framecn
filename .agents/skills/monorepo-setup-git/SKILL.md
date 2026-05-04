---
name: monorepo-setup-git
description: git, git tags, pushing and pulling to repository. Any version control tasks.
---
# Monorepo Git Configuration

## Repo Layout

`telecine` and `elements` are standalone sibling repos cloned alongside the monorepo:

```
~/Editframe/worktrees/<branch>/
  monorepo/     # primary monorepo checkout
  telecine/     # telecine repo clone
  elements/     # elements repo clone
```

The monorepo has one remote: `skills` → `git@github.com:editframe/skills.git`.

`telecine` and `elements` each have `origin` pointing to their respective GitHub repos.

## Push/Pull Workflows

### Telecine

Work directly in the sibling telecine repo. Push to `origin` from there:

```bash
# From ~/Editframe/worktrees/<branch>/telecine/
git push origin main           # push to telecine main
git push origin <branch>       # push a branch
```

Never push telecine from the monorepo root.

### Elements

Work directly in the sibling elements repo:

```bash
# From ~/Editframe/worktrees/<branch>/elements/
git push origin main
git push origin <branch>
git push origin v<version>     # push a tag to trigger release CI
```

### Skills

Skills are pushed from the monorepo using the provided script:

```bash
# From monorepo/
scripts/push-skills
```

This pushes to the `skills` remote (`git@github.com:editframe/skills.git`).

The `skills-sync` tag tracks the last synced commit:

```bash
git tag -f -a skills-sync HEAD -m "skills synced $(date -I)"
git push skills skills-sync
```

## CI Monitoring

```bash
# Poll telecine deploy until complete
scripts/wait-for-telecine-action

# Poll elements release until complete
scripts/wait-for-elements-action

# Get failed job logs
scripts/gh-logs editframe/telecine
scripts/gh-logs editframe/elements
```

## Telecine Deploy Gate

A push to `telecine/main` triggers CI. The deploy job only runs after `build-runner`, all `docker (*)` matrix jobs, `integration`, `typecheck`, and `playwright` all pass. Pushing directly to `main` is allowed — CI gates the deploy.

Standard flow for a branch:

```bash
# From telecine/
git push origin <branch>
# Open PR on github.com/editframe/telecine, let CI pass, merge
# Then from monorepo/
scripts/wait-for-telecine-action
```
