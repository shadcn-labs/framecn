# Frontmatter Reference

Complete field reference for both file types in the skills documentation system.

## SKILL.md Frontmatter

```yaml
---
name: composition
description: Build video scenes with media, text, timing, transitions, and effects (HTML or React).
license: MIT
metadata:
  author: editframe
  version: "1.0"
---
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | yes | Skill identifier, kebab-case |
| `description` | string | yes | Follow "Do X. Use when Y" pattern |
| `license` | string | no | Preserved in LLM output |
| `metadata.author` | string | no | Preserved in LLM output |
| `metadata.version` | string | no | Quote the value (`"1.0"` not `1.0`) |

## Reference File Frontmatter

Minimal example:

```yaml
---
title: Video Element
description: Video element with source trimming and volume control
type: reference
---
```

Full example:

```yaml
---
title: Video Element
description: Video element with source trimming, volume control, and muting
type: reference
nav:
  parent: "Elements / Media"
  priority: 10
  related: ["audio", "image"]
track: "video-basics"
track_step: 1
track_title: "Understanding Video Elements"
prerequisites: ["getting-started"]
next_steps: ["video~tutorial"]
api:
  attributes:
    - name: src
      type: string
      required: true
      description: URL or path to video source
    - name: volume
      type: number
      default: 1.0
      description: Audio volume (0.0 to 1.0)
  properties:
    - name: sourceIn
      type: string
      description: Absolute start time
  methods:
    - name: play
      signature: "play()"
      description: Start playback
      returns: void
sections:
  - slug: tutorial
    title: Video Tutorial
    heading: Video Tutorial
    type: tutorial
    description: Step-by-step guide to working with the video element
    nav:
      priority: 1
---
```

### Core Fields

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `title` | string | yes | Human-readable display name. Becomes `name` in generated output. |
| `description` | string | yes | Brief description of what this reference covers. |
| `type` | string | yes | Content type. One of: `reference`, `tutorial`, `how-to`, `explanation`. Controls sidebar sorting (tutorials first, references last) and badge display. |

### Navigation Fields

| Field | Type | Purpose |
|-------|------|---------|
| `nav.parent` | string | Tree sidebar path. Use ` / ` delimiter: `"Elements / Media"`. Creates nested tree nodes. |
| `nav.priority` | number | Sort order within parent group. Lower = higher. |
| `nav.related` | string[] | Reference names to show as related content. |
| `topic` | string | Topic-grouped sidebar category (e.g., `video`, `audio`). |
| `order` | number | Sort order within topic group. |

Tree sidebar (`nav.parent`) and topic sidebar (`topic`) are two navigation modes. Current implementation uses tree sidebar on reference-detail pages.

### Learning Path Fields

| Field | Type | Purpose |
|-------|------|---------|
| `track` | string | Learning path identifier. Groups references into ordered sequences. |
| `track_step` | number | Position in the track (1-indexed). |
| `track_title` | string | Display title shown in the learning path progress bar. |
| `prerequisites` | string[] | Reference names that should be read first. |
| `next_steps` | string[] | Reference names suggested after this one. Supports section refs: `"video~tutorial"`. |

### API Metadata

The `api` object drives two outputs: card-based web rendering and prose in generated LLM files.

Use `attributes` for HTML elements (lowercase attribute names), `properties` for React components (camelCase prop names), `methods` for callable functions.

#### api.attributes / api.properties

```yaml
api:
  attributes:
    - name: src
      type: string
      required: true
      default: ""
      description: URL or path to video source
      values: ["url", "blob"]
```

| Subfield | Type | Required | Notes |
|----------|------|----------|-------|
| `name` | string | yes | Attribute/property name |
| `type` | string | yes | Type name (e.g., `string`, `number`, `boolean`, `timestring`) |
| `required` | boolean | no | Defaults to false |
| `default` | any | no | Default value. Omit if no default. |
| `description` | string | yes | One-line description |
| `values` | string[] | no | Enumerated allowed values |

**HTML elements** use `attributes` with lowercase names matching HTML attributes (e.g., `sourcein`, `trimstart`).

**React components** use `properties` with camelCase names matching props (e.g., `sourceIn`, `trimStart`).

#### api.methods

```yaml
api:
  methods:
    - name: play
      signature: "play()"
      description: Start playback
      returns: void
```

| Subfield | Type | Required | Notes |
|----------|------|----------|-------|
| `name` | string | yes | Method name |
| `signature` | string | yes | Full call signature. **Must be quoted** (see YAML Syntax below). |
| `description` | string | yes | What it does |
| `returns` | string | no | Return type |

### YAML Syntax Requirements

**Critical: Quote values containing colons**

YAML treats colons (`:`) as key-value separators. When documenting TypeScript signatures or other values with colons, you **must** wrap them in quotes to prevent parsing errors.

✅ **Correct:**
```yaml
api:
  methods:
    - name: registerElement
      signature: "registerElement(element: HTMLElement, id?: string): string"
      description: Register an element
```

❌ **Incorrect (causes YAML parsing error):**
```yaml
api:
  methods:
    - name: registerElement
      signature: registerElement(element: HTMLElement, id?: string): string
      description: Register an element
```

**When to quote:**
- TypeScript function signatures with parameter types: `"func(param: Type): ReturnType"`
- Object literals with colons: `"{ x: number, y: number }"`
- Union types with pipe: `"HTMLElement | string | null"`
- Any value containing `:` that isn't meant as a YAML key-value separator

**When quoting is optional (but recommended):**
- Simple values without special YAML characters
- Already-quoted strings in examples

This applies to all fields: `signature`, `type`, `detail` in events, and any custom fields.

### Sections

Sections split a single markdown file into multiple web pages. Each section maps to an H2 heading in the body.

```yaml
sections:
  - slug: tutorial
    title: Video Tutorial
    heading: Video Tutorial
    type: tutorial
    description: Step-by-step guide
    nav:
      priority: 1
```

| Subfield | Type | Required | Notes |
|----------|------|----------|-------|
| `slug` | string | yes | URL segment. Page URL: `/skills/{skill}/{ref}~{slug}` |
| `title` | string | yes | Display title in sidebar |
| `heading` | string | yes | **Must exactly match** an H2 heading in the markdown body |
| `type` | string | yes | Content type for this section |
| `description` | string | no | Section description |
| `nav.priority` | number | no | Sort order in sidebar |

**How section extraction works**: The server splits the markdown at H2 boundaries. The root page gets content before the first section heading. Each section page gets content from its heading to the next section heading (or end of file).

**URL pattern**: Root page is `/skills/{skill}/{ref}`, section pages are `/skills/{skill}/{ref}~{slug}`.

## What Gets Stripped in Generation

Fields preserved in `skills/skills-generated/`:
- `title` (renamed to `name`), `description`, `license`, `metadata`

Fields stripped (web-only):
- `type`, `topic`, `order`, `nav`, `track`, `track_step`, `track_title`, `prerequisites`, `next_steps`, `sections`

Fields converted:
- `api` → prose injected after H1 (attributes as bullet list, properties as bullet list, methods as bullet list)
