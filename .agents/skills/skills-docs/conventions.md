# Rendering Conventions

The web renderer in `telecine/services/web/app/utils/skills-mdx-components.tsx` detects plain markdown patterns and upgrades them to interactive components. LLMs read the same markdown without these enhancements.

## MDX Syntax Requirements

**Critical: Escape HTML special characters in prose**

MDX parses markdown as JSX, which means HTML special characters like `<`, `>`, and `&` need to be escaped when used in prose (not in code blocks).

### Less-than sign with numbers

When writing comparisons or time measurements, always escape `<` when followed by a digit:

✅ **Correct:**
```markdown
- **Segment serving**: &lt;10ms from cache
- Must complete quickly (&lt;100ms error, &lt;10ms warning)
- Use &lt;10% as accent color
```

❌ **Incorrect (causes MDX parsing error):**
```markdown
- **Segment serving**: <10ms from cache
- Must complete quickly (<100ms error, <10ms warning)
- Use <10% as accent color
```

**Common HTML entities:**
- `&lt;` for `<` (less than)
- `&gt;` for `>` (greater than)
- `&amp;` for `&` (ampersand)

**When escaping is NOT needed:**
- Inside code blocks (` ``` ` fenced code)
- Inside inline code (backticks: `` `<10ms` ``)
- In HTML tags that are intentional JSX (like `<Preview>` components)

## Live Demos

Code blocks with `html live` info string render as interactive previews with filmstrip timeline.

````markdown
```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
```
````

**Requirements:**
- Language must be `html` (not `htm` or `xml`)
- `live` must be in the info string (detected via `data-meta` attribute set by `remarkCodeMeta`)
- Content is injected as raw HTML via `dangerouslySetInnerHTML` inside a `<Preview>` component
- The preview includes `<FitScale>`, `<FocusOverlay>`, and `<Filmstrip>` from `@editframe/react`
- Always include `workbench` on the root timegroup for timeline controls
- Use real asset URLs — `https://assets.editframe.com/` hosts test assets

**Without `live`**: Standard syntax-highlighted code block.

```html
<ef-video src="video.mp4" class="size-full"></ef-video>
```

## Callouts

Blockquotes with bold **Note:** or **Warning:** prefix render as styled callout boxes.

```markdown
> **Note:** Additional context the reader should know.

> **Warning:** Important caveat that could cause problems.
```

- **Note** — blue border and background
- **Warning** — gold border and background
- Detection: `extractText(children).trim()` checks for `Note:` or `Warning:` prefix
- Without a recognized prefix, renders as a standard blockquote

## Attribute Tables

Markdown tables with columns matching `Attribute`, `Type`, and `Description` (case-insensitive) get enhanced PropertyDoc-style rendering with:

- Left blue border accent
- Uppercase tracking headers
- Monospace type column in accent color
- Reduced-opacity default column

```markdown
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| src | string | — | Video source URL |
| volume | number | 1.0 | Audio volume |
```

Tables without those column headers render with standard prose styling.

## Tutorial Steps

In documents with `type: tutorial`, headings matching `### Step N:` get step-indicator styling on the web.

```markdown
### Step 1: Display a Basic Video

Place a video inside a root timegroup...

### Step 2: Trim a Video

Two approaches — choose based on your workflow...
```

## Link Conversion

Relative links matching `references/*.md` are converted to React Router links:

```markdown
[Video Element](references/video.md)
<!-- becomes: <Link to="/skills/{skillName}/video" /> -->
```

External links (`http://`, `https://`) open in a new tab with `rel="noopener noreferrer"`.

Section references use `~` separator in `next_steps`:
```yaml
next_steps: ["video~tutorial"]
# Links to: /skills/{skill}/video~tutorial
```

## API Reference Cards

When a reference file has `api` frontmatter, the `<ApiReference>` component is injected after the H1 heading automatically. This is handled in `getSkillsMDXComponents` by wrapping the `h1` component.

The cards display:
- **Attributes** — for HTML elements (name, type, required badge, default, description)
- **Properties** — for React components (same layout)
- **Methods** — signature, description, return type

Authors don't need to write API documentation in the markdown body — the cards are generated from frontmatter. The markdown body should focus on usage examples and explanations.

## Adding New Conventions

To add a new rendering convention:

1. Add detection logic in `skills-mdx-components.tsx` (pattern matching on props, className, or content)
2. Create a component that renders the enhanced version
3. Add to the component mapping in `getSkillsMDXComponents()`
4. Ensure the pattern degrades gracefully — LLMs and the generation script see raw markdown, so the convention must work as plain markdown too
