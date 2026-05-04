---
name: elements-new-package
description: Create a new @editframe/* workspace package in the elements monorepo and publish it to npm.
---

# Creating a New Elements Package

Use `scripts/new-package` to scaffold a new `@editframe/*` workspace package. It creates all required files and registers the package in `tsconfig.json` — the single source of truth for path aliases.

## Quick Start

```bash
# From the elements/ directory (or via the runner)
./scripts/new-package <name>
# e.g. ./scripts/new-package captions

# Then install to symlink the workspace package
./scripts/npm install
```

## What the Script Does

Creates `packages/<name>/` with:
- `src/index.ts` — empty export stub
- `package.json` — correct version, ESM exports, `publishConfig.access: "public"`
- `tsconfig.json` — extends root config
- `tsdown.config.ts` — minimal build config

Inserts a path entry into `elements/tsconfig.json`:
```json
"@editframe/<name>": ["./packages/<name>/src/index.ts"]
```

Both vitest configs (`vitest.config.ts`, `vitest.config.browser.ts`) derive their aliases from `tsconfig.json` automatically via `vitest.aliases.ts` — no manual updates needed there.

## Publishing a New Package to npm

CI publishes via OIDC trusted publishing (no stored token). OIDC requires the package to exist on npm before trusted publishing can be configured, so **the first publish is manual**:

```bash
# One-time, run locally while logged in to npm
npm publish --access public --workspace @editframe/<name>
```

After that first publish:
1. Go to npmjs.com → `@editframe/<name>` → Settings → Trusted Publisher
2. Add GitHub Actions: repo `editframe/elements`, workflow `release.yaml`, environment `npm-publish`

All subsequent releases publish automatically via CI.

## Path Alias Registration

`tsconfig.json` is the only file that needs a new entry. The script adds it automatically. Sub-path exports (e.g. `@editframe/foo/node`) must be added manually to `tsconfig.json` if needed — the base alias handles sub-path imports naturally via Vite prefix replacement, so explicit entries are only needed for files that don't follow the `src/<name>.ts` pattern.

## Adding Dependencies on Other Workspace Packages

Add the sibling package to `dependencies` in the new package's `package.json` using the current workspace version (check the root `package.json`). Run `./scripts/npm install` to re-symlink. Run `./scripts/node scripts/deps.js update-dependencies` after a version bump to keep all cross-package pins in sync.
