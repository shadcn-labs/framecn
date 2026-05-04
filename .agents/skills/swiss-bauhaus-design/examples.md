# Swissted Design Examples

All examples use the actual `--poster-*` tokens from `landing.css`. No cards. No shadows. Type on ground.

---

## Feature Section on Colored Ground

Type set directly on the section background. Three-column layout divided by rules, not containers.

```tsx
// Red section — primary power claim
<section className="bg-[var(--poster-red)]">
  <div className="max-w-7xl mx-auto px-8 py-20">

    {/* Headline directly on red */}
    <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase text-white leading-[0.9] mb-4">
      Render anywhere.
    </h2>
    <div className="w-full border-t-2 border-white/40 mb-16" />

    {/* Three columns separated by rules, no cards */}
    <div className="grid grid-cols-3">
      <div className="pr-10 border-r-2 border-white/20">
        <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">Browser</p>
        <p className="text-white leading-relaxed">
          Preview instantly. No build step. Live in the browser.
        </p>
      </div>
      <div className="px-10 border-r-2 border-white/20">
        <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">CLI</p>
        <p className="text-white leading-relaxed">
          Render to MP4 locally with a single command.
        </p>
      </div>
      <div className="pl-10">
        <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">Cloud</p>
        <p className="text-white leading-relaxed">
          Parallel rendering at scale. Pay per render.
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## Feature Section on Cream Ground

Light sections use ink-black rules. No cards, no shadows — alignment carries the structure.

```tsx
// Cream section — architecture or explanation
<section className="bg-[var(--paper-cream)] border-t-4 border-[var(--ink-black)]">
  <div className="max-w-7xl mx-auto px-8 py-20">

    <div className="grid grid-cols-12 gap-0">
      {/* Label column */}
      <div className="col-span-3 border-r-2 border-[var(--ink-black)] pr-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--warm-gray)]">
          The primitives
        </p>
      </div>

      {/* Content column — type directly on cream */}
      <div className="col-span-9 pl-10">
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-[var(--ink-black)] leading-[0.9] mb-8">
          The video tags<br />
          <span className="text-[var(--poster-red)]">HTML never shipped.</span>
        </h2>
        <p className="text-lg text-[var(--warm-gray)] leading-relaxed max-w-xl">
          HTML5 gave us video. What it didn't give us was a way to trim,
          sequence clips, add text at timestamps, or export to MP4.
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## Gold Section — Secondary Feature

Gold is the ground. Black type on gold is legible and maintains the poster logic. No inversion to white cards.

```tsx
<section className="bg-[var(--poster-gold)]">
  <div className="max-w-7xl mx-auto px-8 py-20">

    {/* Label in muted black */}
    <p className="text-xs font-bold uppercase tracking-widest text-black/50 mb-6">
      Templated rendering
    </p>

    <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase text-black leading-[0.9] mb-4">
      One template.<br />Infinite videos.
    </h2>
    <div className="w-full border-t-2 border-black/20 mb-12" />

    <p className="text-xl text-black/70 leading-relaxed max-w-2xl">
      A video template is a function. Your data is its argument. Pass
      different data — different name, different stats — and get a different video.
    </p>
  </div>
</section>
```

---

## Dark Section — Code Examples

Dark ground with gold accent. Type on ground. Code block is the one permitted container.

```tsx
<section className="bg-[var(--card-dark-bg)]">
  <div className="max-w-7xl mx-auto px-8 py-20">

    <div className="grid grid-cols-12 gap-0">
      {/* Typographic accent — the { lives on the dark ground */}
      <div className="col-span-1">
        <span className="text-8xl font-black text-[var(--poster-gold)] leading-none select-none">
          {'{'}
        </span>
      </div>

      <div className="col-span-11 pl-8">
        <h2 className="text-5xl font-black tracking-tighter uppercase text-white leading-[0.9] mb-4">
          Just code.
        </h2>
        <p className="text-lg text-[var(--warm-gray)] leading-relaxed mb-12 max-w-lg">
          HTML and CSS are the foundation. Add scripting for animation.
          Use React when you want components.
        </p>

        {/* Code block — the one exception to no-cards */}
        <div className="bg-[#111] border-t-2 border-[var(--poster-gold)]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-4 text-xs text-white/50 font-mono">welcome-video.tsx</span>
          </div>
          <pre className="p-6 font-mono text-sm text-white/90 overflow-x-auto">
            {/* syntax-highlighted code */}
          </pre>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Buttons

Square. No shadow. No border-radius. Primary is always `--poster-red`.

```tsx
{/* Primary CTA */}
<a className="px-8 py-4 bg-[var(--poster-red)] text-white font-bold uppercase tracking-wider hover:bg-[var(--ink-black)] transition-colors">
  Get Early Access
</a>

{/* Secondary — outline only */}
<a className="px-8 py-4 border-2 border-[var(--ink-black)] font-bold uppercase tracking-wider hover:bg-[var(--ink-black)] hover:text-white transition-colors">
  Read the Docs
</a>

{/* On colored grounds — invert */}
<a className="px-8 py-4 bg-white text-[var(--ink-black)] font-bold uppercase tracking-wider hover:bg-[var(--ink-black)] hover:text-white transition-colors">
  Start Building
</a>
```

---

## Section Dividers

The only structural signals needed between sections. Never combined with color change — pick one or the other.

```tsx
{/* Between two light sections */}
<div className="border-t-4 border-[var(--ink-black)]" />

{/* Between light and dark */}
{/* No divider needed — the full-bleed color change is the signal */}

{/* Internal column rule on light */}
<div className="border-r-2 border-[var(--ink-black)]" />

{/* Internal column rule on colored ground */}
<div className="border-r-2 border-white/20" />
```

---

## What Not to Do

```tsx
// WRONG — card on colored background
<section className="bg-[var(--poster-red)]">
  <div className="bg-white rounded-lg shadow-lg p-8">  {/* ← breaks the poster */}
    <h3>Feature</h3>
  </div>
</section>

// RIGHT — type on ground
<section className="bg-[var(--poster-red)]">
  <div className="px-8 py-12">
    <h3 className="font-black uppercase text-white">Feature</h3>
  </div>
</section>

// WRONG — multiple hierarchy signals
<section className="bg-[var(--paper-cream)] border-t border-black/10">
  <p className="text-xs uppercase text-[var(--poster-red)] tracking-widest">Label</p>
  <div className="bg-white shadow-md rounded p-6">  {/* ← three signals at once */}
    <h2>Heading</h2>
  </div>
</section>

// RIGHT — one signal
<section className="border-t-4 border-[var(--ink-black)]">  {/* one signal: the rule */}
  <p className="text-xs font-bold uppercase tracking-widest text-[var(--warm-gray)]">Label</p>
  <h2 className="font-black uppercase">Heading</h2>
</section>
```
