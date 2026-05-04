---
name: swiss-bauhaus-design
description: Apply Swissted-style design to Editframe landing pages and docs. Use when redesigning sections, adding new sections, or auditing the design. Enforces the print-first composition model, the --poster-* token roles, and the completion standard.
---

# Swissted Design System

The Editframe landing page is modeled on **Swissted** — Mike Joyce's project reimagining punk/indie concert posters in the Swiss International Style. This is the specific reference. Not generic Swiss/Bauhaus, not De Stijl.

Swissted characteristics:
- Saturated primary colors as full-bleed grounds (not muted, not "sophisticated")
- Heavy all-caps type set directly on color — no cards, no containers
- Hard geometric rules as structural dividers
- Three to four compositional elements per section, no more

## Quality and Completion

Design quality is felt before it is named. A developer lands on the page and either thinks "these people know what they're doing" or they feel an unease they can't name. That gap — between trust and almost-trust — is where the system runs out of care.

**A system feels complete when:**
- Every token has a declared role
- Every role is actually used
- Color choices are motivated, not arbitrary
- A new agent reading the CSS understands what to use and why

**A system feels abandoned when:**
- Tokens are defined but unused
- Colors appear because they were available
- Rules are implied but never written

When something feels wrong, don't patch the symptom. Trace the failure back to where care ran out and repair the system there.

## Token System

Defined in `telecine/services/web/app/styles/landing.css`.

```css
/* PRIMARY — brand moment, hero CTA, primary feature section BG */
--poster-red: #E53935;

/* SECONDARY — emphasis on dark backgrounds, template/data section BG */
/* Never as text on light backgrounds — contrast fails WCAG AA (~2.3:1) */
--poster-gold: #FFB300;

/* TECHNICAL — focus rings, code syntax, architecture diagrams */
/* Not for section backgrounds or CTAs */
--poster-blue: #1565C0;

/* AI/AGENT — PromptToTool section only. Do not use elsewhere. */
--poster-green: #2E7D32;

/* STRUCTURE */
--ink-black: #1a1a1a;
--paper-cream: #FAF8F5;
--warm-gray: #6B6B6B;
--card-dark-bg: #1a1a1a;
```

`--poster-pink` is defined in the CSS but removed from use. Dead tokens make the palette appear larger and less deliberate than it is.

**Gold on light backgrounds:** `--poster-gold` (#FFB300) fails WCAG AA on cream or white. For gold text on light: use `#B45309` (~4.5:1 against white).

## Section Architecture

Each section has a declared ground color and a thematic rationale. The choice is motivated — not arbitrary.

| Section | Ground | Primary accent | Rationale |
|---|---|---|---|
| Hero | `--paper-cream` | `--poster-red` | Brand moment, the first impression |
| CodeExamples | `--card-dark-bg` | `--poster-gold` | Craft/code — gold reads on darkness |
| TemplatedRendering | `--poster-gold` | black | Data drives the template — gold is the content |
| RenderAnywhere | `--poster-red` | white | The primary power claim |
| Architecture | `--paper-cream` | `--poster-blue` / gold | Technical diagrams |
| GettingStarted | white | `--poster-red` | Action — red motivates |
| PromptToTool | `--poster-green` | white / gold | AI/agent — green is reserved here |

Narrative order: cream → dark → gold → red → cream → white → green. New sections must fit this sequence and declare their thematic rationale in a comment.

## Typography

```css
/* Headlines — the Swissted voice */
font-weight: 900;           /* font-black */
letter-spacing: -0.05em;    /* tracking-tighter */
text-transform: uppercase;
line-height: 0.9;

/* Section labels — visually distinct from headlines */
font-size: 0.75rem;         /* text-xs */
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.12em;     /* tracking-widest */
color: var(--warm-gray);

/* Body */
font-weight: 400;
color: var(--warm-gray);
line-height: 1.625;         /* leading-relaxed */
```

All-caps headlines are the aesthetic voice, not a label treatment. Do not soften them to mixed case. The power comes from commitment.

## Type on Ground

The ground is the section background. Type sits directly on it.

```
WRONG:  section-bg → white card → shadow → content
RIGHT:  section-bg → content
```

Grid column alignment organizes elements. Rules separate them. Nothing else.

**Structural dividers on light sections:**
```html
<div class="border-t-4 border-[var(--ink-black)]" />     <!-- section break -->
<div class="border-r-2 border-[var(--ink-black)]" />     <!-- column divider -->
```

**On colored sections (red, gold, green):**
```html
<div class="border-t-2 border-white/40" />               <!-- white rule -->
<div class="border-r-2 border-black/20" />               <!-- dark rule -->
```

The full-bleed color change already signals a new section. No additional signal — no label, no shadow, no card — is needed or appropriate.

## Digital Affordances to Eliminate

These are web UI conventions that break the print feel:

| Element | Why it's wrong | What to do instead |
|---|---|---|
| `box-shadow` (any) | Print is flat. Shadows simulate UI depth that doesn't exist in print. | None. Color contrast carries weight. |
| `border-radius` > 0 | Rounded corners signal interactive UI element. Print boxes are square. | `rounded-none` or omit entirely |
| Cards on colored backgrounds | A white card on red is a web component, not a poster composition. | Type directly on the section ground |
| Subtle borders `rgba(0,0,0,0.12)` | Whisper borders are a digital UI convention. | Full-weight rules (2–4px, full opacity) or none at all |
| Multiple hierarchy signals | Color + shadow + label + card = four signals for one transition | Pick one. The color is enough. |
| Hover states on non-interactive elements | Trains the eye to expect interaction everywhere | Restrict visual hover feedback to actual interactive elements |

## Buttons

No rounded corners. No soft shadow. Square geometry, clear intent.

```html
<!-- Primary CTA — always poster-red -->
<a class="px-8 py-4 bg-[var(--poster-red)] text-white font-bold uppercase tracking-wider hover:bg-[var(--ink-black)]">
  Get Early Access
</a>

<!-- Secondary / outline -->
<a class="px-8 py-4 border-2 border-[var(--ink-black)] font-bold uppercase tracking-wider hover:bg-[var(--ink-black)] hover:text-white">
  Read the Docs
</a>
```

Primary CTAs are always `--poster-red`. No section should introduce a different CTA background color.

## Code Blocks

The one exception to "no cards" — code needs a container to function as code. Use the established pattern:

```html
<div class="bg-[var(--card-dark-bg)]">
  <div class="flex items-center gap-2 px-4 py-3 border-b border-white/10">
    <div class="w-3 h-3 rounded-full bg-[#ff5f57]" />
    <div class="w-3 h-3 rounded-full bg-[#febc2e]" />
    <div class="w-3 h-3 rounded-full bg-[#28c840]" />
    <span class="ml-4 text-xs text-white/50 font-mono">filename.tsx</span>
  </div>
  <pre class="p-6 font-mono text-sm text-white/90">...</pre>
</div>
```

Syntax highlighting: keywords → `--poster-red`, JSX tags → `--poster-blue`, strings/values → `--poster-gold`.

## Completion Check

Before finishing any design work:

- [ ] Every token used has a declared role (cross-reference the table above)
- [ ] Every section's color choice is motivated and commented
- [ ] No `box-shadow` on non-code-block elements
- [ ] No `border-radius` on section containers or feature items
- [ ] Content sits on the ground, not inside a card
- [ ] One structural signal per section transition (the color change is it)
- [ ] All primary CTAs use `bg-[var(--poster-red)]`
- [ ] Gold text on light backgrounds uses `#B45309`, not `--poster-gold`
- [ ] A new agent reading this section's code would understand every color choice without asking
