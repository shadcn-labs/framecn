---
name: skills-docs
description: Maintain and author Editframe's skills-as-docs system. Covers file structure, frontmatter schemas, rendering conventions (html live demos, callouts, API metadata), the generation pipeline, and build/push workflow. Use when creating or editing skill files, reference documentation, frontmatter, html live blocks, API metadata, or working on the skills web renderer.
---

# Skills Documentation System

Single source of truth for both human-readable web docs and LLM agent consumption.

## Architecture

```
skills/skills/{skill-name}/
  SKILL.md                    # Overview + quick start (LLM entry point)
  references/
    {name}.md                 # Reference, tutorial, how-to, or explanation
```

Two build targets from one source:
- **Web docs**: Telecine reads `skills/skills/` directly, renders with MDX + convention-based component mapping
- **LLM skills**: `generate-skills.ts` strips human-only metadata, converts API metadata to prose, outputs to `skills/skills-generated/` (gitignored build artifact)

## Authoring Workflow

1. **Edit** source files in `skills/skills/`
2. **Preview** on web — telecine reads source directly, no build step needed
3. **Generate** LLM files: `npx tsx scripts/generate-skills.ts`
4. **Push** to skills remote: `./scripts/push-skills [--branch name]`

Steps 3-4 only needed when publishing to the LLM-consumable repository. During development, web preview validates changes immediately.

**Never edit `skills/skills-generated/`** — overwritten on every build.

## Frontmatter Quick Reference

### SKILL.md files

| Field | Required | Survives generation |
|-------|----------|-------------------|
| `name` | yes | yes |
| `description` | yes | yes |
| `license` | no | yes |
| `metadata` (`author`, `version`) | no | yes |

### Reference files

| Field | Required | Survives generation | Purpose |
|-------|----------|-------------------|---------|
| `title` | yes | yes (as `name`) | Display name |
| `description` | yes | yes | Brief description |
| `type` | yes | no | `reference` \| `tutorial` \| `how-to` \| `explanation` |
| `nav` | no | no | Tree sidebar: `parent`, `priority`, `related` |
| `topic` | no | no | Topic-grouped sidebar category |
| `order` | no | no | Sort order within topic group |
| `track` | no | no | Learning path identifier |
| `track_step` | no | no | Position in learning path |
| `track_title` | no | no | Display title for track nav |
| `prerequisites` | no | no | Required reading references |
| `next_steps` | no | no | Suggested next references |
| `api` | no | converted to prose | Structured API metadata |
| `sections` | no | no | Split into multiple web pages |

For complete field documentation, see [frontmatter.md](frontmatter.md).

## Critical Constraints

### YAML Parser Limitations

The generation script uses a **hand-rolled YAML parser** (`scripts/generate-skills.ts`) that supports only:

- Top-level scalar fields (`key: value`)
- One level of object nesting (`key:\n  subkey: value`)
- Arrays of objects at 4-space indent (`    - name: value`)
- Object properties at 6+ space indent within array items

**Not supported** (silently produces wrong output):
- Multi-line strings (`|` or `>` block scalars)
- Flow sequences inline (`[a, b, c]`)
- YAML comments
- Nesting deeper than 3 levels
- Quoted keys

**Always test generation locally** after frontmatter changes:
```bash
npx tsx scripts/generate-skills.ts
# Inspect skills/skills-generated/ to verify output
```

### Sections-Heading Coupling

The `sections` frontmatter references markdown H2 headings via the `heading` field. The match must be exact. If you rename an H2, update the corresponding `sections[].heading`.

```yaml
sections:
  - slug: tutorial
    heading: Video Tutorial    # Must match "## Video Tutorial" in body
```

### Nav Parent Paths

`nav.parent` uses ` / `-delimited paths (with spaces around slash) to build the sidebar tree:

```yaml
nav:
  parent: "Elements / Media"   # Creates: Elements > Media > this page
```

Misspelling a parent path creates a silently orphaned node. Check existing references for established paths before inventing new ones.

## Rendering Conventions

The web renderer detects markdown patterns and upgrades them to interactive components. See [conventions.md](conventions.md) for authoring details.

| Pattern | Web rendering | LLM output |
|---------|--------------|------------|
| `` ```html live `` | Interactive preview + filmstrip | Plain code block |
| `` ```mermaid `` | Rendered Mermaid diagram | Plain code block |
| `> **Note:** ...` | Blue callout box | Standard blockquote |
| `> **Warning:** ...` | Gold callout box | Standard blockquote |
| Attribute/Type/Description table | Enhanced PropertyDoc styling | Standard table |
| `### Step N:` in tutorials | Step-indicator styling | Standard heading |
| `[references/X.md](references/X.md)` | React Router link | Relative link |
| `api` frontmatter | Card-based ApiReference after H1 | Prose list after H1 |

## Generation Transform

What `generate-skills.ts` does to each source file:

- `title` → becomes `name` in output frontmatter
- `description`, `license`, `metadata` → preserved
- `nav`, `track`, `track_*`, `prerequisites`, `next_steps`, `type`, `topic`, `order`, `sections` → **stripped**
- `api` → **converted to prose** and injected after H1:

```markdown
## Attributes
- **src** (string) (required) - URL or path to video source
- **volume** (number, default: 1.0) - Audio volume

## Properties
- **sourceIn** (string) - Absolute start time

## Methods
- **play()** - Start playback
  - Returns: void

## Functions
- **createRender(client, payload)** - Create a new render job
  - Returns: CreateRenderResult
```

Markdown body is preserved unchanged.

### API Metadata Types

The `api` frontmatter supports four sub-keys for different API surface types:

- **`attributes`**: HTML element attributes (e.g., `<ef-video src="...">`)
  - Use for: Custom elements, web components
  - Fields: `name`, `type`, `required`, `default`, `description`, `values`

- **`properties`**: React component props (e.g., `<Preview className="...">`)
  - Use for: React components, TypeScript interfaces
  - Fields: `name`, `type`, `required`, `default`, `description`, `values`

- **`methods`**: Instance methods on objects or elements (e.g., `element.play()`)
  - Use for: Methods that exist on instances, DOM APIs
  - Fields: `name`, `signature`, `description`, `returns`

- **`functions`**: Standalone exported functions (e.g., `createRender(client, payload)`)
  - Use for: SDK functions, utility functions, top-level exports
  - Fields: `name`, `signature`, `description`, `returns`

All four types render as card grids on the web and convert to indented prose lists for LLM consumption.

## Key File Locations

### Skills content
- `skills/skills/` — source files (edit these)
- `skills/skills-generated/` — build artifacts (never edit, gitignored)
- `skills/BUILD.md` — build process documentation

### Build pipeline
- `scripts/generate-skills.ts` — generation script
- `scripts/push-skills` — generate + push to skills remote

### Web renderer (telecine)
- `telecine/services/web/app/utils/skills.server.ts` — loading, nav building, section extraction
- `telecine/services/web/app/utils/skills-mdx-components.tsx` — convention-based MDX components
- `telecine/services/web/app/routes/skills/reference-detail.tsx` — reference page
- `telecine/services/web/app/routes/skills/skill-detail.tsx` — skill overview page + sidebar tree
- `telecine/services/web/app/components/skills/ApiReference.tsx` — API reference cards
- `telecine/services/web/app/components/skills/OnThisPage.tsx` — auto-generated TOC from H2/H3

### Legacy docs (content migration source)
- `telecine/services/web/app/content/docs/` — MDX files to draw content from
- `telecine/services/web/app/components/docs/` — legacy components (Demonstration, PropertyDoc)

## When Modifying the Renderer

The convention-based rendering lives in `skills-mdx-components.tsx`:
- `SkillsPreBlock` — detects `html live` via `data-meta` attribute (set by `remarkCodeMeta` plugin)
- `LiveDemo` — renders raw HTML inside Preview/FitScale/FocusOverlay/Filmstrip from `@editframe/react`
- `SkillsTable` — detects Attribute/Type/Description column headers for enhanced styling
- `SkillsBlockquote` — detects Note/Warning prefixes for callout boxes
- `getSkillsMDXComponents(skillName, api?)` — returns the full component mapping; when `api` is provided, wraps H1 to inject ApiReference

Both `skill-detail.tsx` and `reference-detail.tsx` use the shared component mapping.

Navigation is built in `skills.server.ts`:
- `getSkillNavTree()` — builds tree from `nav.parent` paths
- `getSkillNav()` — builds topic groups from `topic` field
- Type ordering: tutorial → how-to → explanation → reference

## Content Guidelines

### Length Targets

| Type | Target | Focus |
|------|--------|-------|
| `reference` | 60-100 lines | Attributes, basic usage, common patterns |
| `tutorial` | ~90 lines | Step-by-step with `html live` demos, minimal intro |
| `how-to` | 20-40 lines | Single task, actions only, no rationale |
| `explanation` | 60-80 lines | Conceptual deep-dive, no code/config |

### Writing Principles

**One mode per document.** Each file fits one `type`. If content belongs in another mode, link to it instead of including it. Tutorials don't explain architecture. References don't include rationale. How-tos don't teach concepts.

**Don't repeat across files.** If a concept is explained in one reference, link to it from others. If a sentence shares meaning with another sentence in the same document, remove one.

**Neutral, technical language.** Describe platform constraints and outcomes, not prescriptive commands or comparative critiques:
- "Native playback requires full file download" not "You must download the entire file"
- "Direct file playback presents these constraints" not "Traditional workflows are slow"
- Qualify absolutes: "typically within seconds" not "immediately"

**Effects over implementation.** Explain what the user sees, not internal machinery. "The player is reactive and incremental" not "The backend segments the file."

**Show, don't describe.** Use `html live` blocks to demonstrate. Every tutorial step and how-to solution should have a working demo. Reference files show basic usage, not just attribute lists.

**Real assets.** Use URLs from `https://assets.editframe.com/` for demos (e.g., `bars-n-tone.mp4`).
