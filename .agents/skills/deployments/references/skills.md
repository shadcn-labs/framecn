---
name: skills-deployment
description: Skills documentation generation, publishing, and versioning.
---

# Skills Deployment

## Architecture

Skills are public-facing documentation for `@editframe` packages. Source files live in `skills/skills/` with rich frontmatter (nav, track, sections, api metadata). A generation script strips this to LLM-essential frontmatter and publishes to the `editframe/skills` GitHub repo.

There is no CI workflow -- `scripts/push-skills` is the deployment. It force-pushes generated content to the skills remote.

## Source vs Generated

- **Source** (`skills/skills/`): Rich frontmatter for human documentation browser. Committed to monorepo.
- **Generated** (`skills/skills-generated/`): Clean frontmatter for LLM consumption. Gitignored build artifact.

## Deployment

```bash
# Generate and push to skills remote
scripts/push-skills

# Push to a specific branch
scripts/push-skills --branch feature-branch
```

The script:
1. Cleans the build directory
2. Runs `npx tsx scripts/generate-skills.ts` to generate LLM-optimized files
3. Initializes a fresh git repo in the build directory
4. Force-pushes to the `skills` remote `main`
5. Cleans up the build directory

## Versioning

Tag the skills remote with the same version as elements releases:

```bash
git fetch skills main
git push skills $(git rev-parse skills/main):refs/tags/v<version>
```

## Key Files

- `skills/skills/` -- Source files (edit these)
- `skills/skills-generated/` -- Build output (gitignored)
- `skills/BUILD.md` -- Build process documentation
- `scripts/push-skills` -- Generation and push script
- `scripts/generate-skills.ts` -- Generation logic
