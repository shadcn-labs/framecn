<p align="center">
  <img src="./.github/assets/gh.png" alt="framecn banner" />
</p>

<h1 align="center">framecn</h1>

<p align="center">
  Ready-to-use, customizable video components for React, with free open-source components and framecn Pro compositions.<br/>
  Built on <a href="https://editframe.com">Editframe</a>, with free components installable through <a href="https://ui.shadcn.com/">shadcn/ui</a>.
</p>

<p align="center">
  <a href="https://github.com/shadcn-labs/framecn"><img src="https://www.shieldcn.dev/github/stars/shadcn-labs/framecn.svg?variant=secondary&size=xs&theme=zinc" alt="GitHub Stars" /></a>
  <a href="https://github.com/shadcn-labs/framecn/actions"><img src="https://www.shieldcn.dev/github/ci/shadcn-labs/framecn.svg?variant=secondary&size=xs&theme=zinc" alt="CI" /></a>
  <a href="https://discord.com/invite/N6G36KhYK4"><img src="https://www.shieldcn.dev/discord/online-members/N6G36KhYK4.svg?variant=secondary&size=xs&theme=zinc" alt="Discord Members" /></a>
  <a href="https://x.com/shadcnlabs"><img src="https://www.shieldcn.dev/x/follow/shadcnlabs.svg?variant=branded&size=xs&theme=zinc" alt="X Follow" /></a>
</p>

<p align="center">
  <a href="https://framecn.dev/docs">Get Started</a> ·
  <a href="https://framecn.dev/docs/installation">Installation</a> ·
  <a href="https://framecn.dev/components">Components</a> ·
  <a href="https://framecn.dev/pricing">Pricing</a>
</p>

## Features

- 🎬 **Editframe integration** — Build video compositions with HTML, React, and CSS
- 📹 **Cloud rendering** — Export to MP4 via Editframe's render infrastructure
- 📦 **shadcn/ui compatible** — Uses the same registry format and CLI
- 🧩 **Composable** — Build complex videos with simple, declarative components
- ⏱️ **Timeline control** — Precise timing and sequencing of video elements
- 🎬 **Multi-layer composition** — Stack videos, images, text, and effects
- 🤖 **AI-ready** — Perfect for generating videos programmatically

## framecn v2

- App shell: a 16rem left sidebar (Shadcn Labs project switcher, search, Components, Pricing, Docs, and every component listed directly), a 48px page header aligned with the sidebar header, and a site footer (Site, Docs, Company, Legal, Other products).
- Sidebar social links: GitHub stars and Follow on X use standard tooltips under one shared tooltip provider. Tooltip styles honor Base UI's `data-instant` state so switching between adjacent triggers does not replay entry animations.
- `/`: landing page — hero with install command, live showcase, categories, how it works, Node Reveal Pro, FAQ.
- `/components` and `/components/<category>`: gallery with category pills (All, Text, Captions, Carousels, 3D & Globes, Collages, Charts, Scroll Animations, Compositions). The 15 captions are free; everything else, including Node Reveal, is part of the framecn Pro catalog. Cards show a category badge, Pro badge, description, and a copy-prompt button.
- `/components/<category>/<id>`: a shareable detail panel that slides out from the sidebar edge while the card preview morphs into the large preview (and back on close). It has Copy prompt (with Cursor/Claude/ChatGPT/v0/MCP options), Customize (a sheet under the preview), Install, Code (locked behind a Pro unlock dialog for Pro items), and usage docs. Old `/components/<id>` and `/templates/<id>` URLs redirect; `/components/typography/*` redirects to `/components/text/*`, and the removed free typography and transition components (and `/components/transitions`) redirect to `/components`.
- `/docs`: documentation pages; component docs live in the detail panel. Docs and changelog pages share the same contents sidebar. GitHub edit, Shadcn Labs follow, and community links remain available in the desktop sidebar even when a page has no headings.
- Shadcn Labs identity: Geist, warm off-white, a black primary, and bubblegum `#f06292` reserved for brand highlights (Get Pro, Pro badges).

Free caption components remain in the public shadcn registry. Pro source and customization require a signed-in account with active Pro access. Pro previews remain public. Gating new downloads does not revoke the MIT rights of already published copies; browser-rendered previews are not a source-code secrecy boundary.

### framecn Pro sources

Pro components live in the private `shadcn-labs/framecn-pro` repository. `scripts/sync-pro.mjs` (run automatically before `pnpm dev` and `pnpm build`) downloads it with `FRAMECN_PRO_GITHUB_TOKEN` (read from the environment or `.env.local`), copies `registry/bases/editframe/**` into the gitignored `registry/pro/`, and generates `registry/pro/__index__.tsx` for live previews. Without the token it writes an empty index and Pro cards show a locked placeholder. Catalog metadata is committed in `lib/pro-catalog.ts`; regenerate it with `pnpm pro:catalog` when framecn-pro adds or renames components.

## Running the application

Install dependencies with `pnpm install`, copy `.env.example` to `.env.local`, and configure a separate `BETTER_AUTH_SECRET`, the matching `BETTER_AUTH_URL`, and a verified Resend sender or OAuth provider. Create the local database with `pnpm db:migrate:local`, then start with `pnpm dev`; pass `--port 3100` when using the local configuration prepared for this checkout.

### Database

Accounts (Better Auth), purchases, and Pro API keys live in one Drizzle schema, `lib/db/schema.ts`. The app stays on Vercel and reaches **Cloudflare D1** (`framecn`, see `wrangler.jsonc`) over the D1 REST API whenever `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, and `CLOUDFLARE_D1_API_TOKEN` are set. Create the token with only the account permission **D1: Edit**. Without these variables, local development uses a SQLite file at `FRAMECN_DATABASE_PATH` (default `data/framecn.sqlite`); on Vercel the D1 variables are required.

```sh
pnpm db:generate        # schema change → new SQL migration in ./drizzle
pnpm db:migrate:local   # apply ./drizzle to the local SQLite file
pnpm db:migrate:remote  # apply ./drizzle to Cloudflare D1 (wrangler)
```

Migrations never run at request time; apply them before deploying code that needs them. A `data/framecn.sqlite` created by the old auto-migration has an incompatible schema: move it aside and run `pnpm db:migrate:local`.

### Private Pro registry

Pro source downloads and documentation source views read from [`shadcn-labs/framecn-pro`](https://github.com/shadcn-labs/framecn-pro/tree/main/registry) on `main`. The private repository's root `registry.json` selects each component's files under `registry/`; multi-file entries include every listed file.

Set `FRAMECN_PRO_GITHUB_TOKEN` in `.env.local` and your deployment's server secrets. Use a fine-grained GitHub personal access token restricted to `framecn-pro` with **Contents: read-only**, approved by the organization if required. This is separate from the GitHub OAuth client credentials. Never expose it through a `NEXT_PUBLIC_` variable or client-side fetch.

`/api/components/[name]` checks sign-in and active Pro access before contacting GitHub. Private fetches and source responses are uncached; missing configuration returns 503, an unavailable upstream returns 502, and missing registry entries return 404. There is no local-source fallback. Free components still use this repository's public registry; `pnpm registry:build` does not publish private entries. Live previews still use the local preview implementation and are not a source-secrecy boundary.

## Pro billing

Pro costs $179/year, $249 once for lifetime access, or $499 once for a lifetime Team license (up to 10 members sharing a team API key). The first 50 buyers of Annual and of Lifetime get the early-bird price ($149/year, kept on renewal, or $199 once): checkout uses the `*_EARLY` product until 50 unrefunded early-bird purchases exist. Dodo Payments handles hosted checkout, invoices, and the customer portal. Subscription access expires with the paid period; lifetime access does not renew.

Anyone can check out without an account: Dodo collects the email (signed-in buyers have theirs preset). Pro belongs to that email. After paying, `/checkout/return` looks the payment up at Dodo, emails a sign-in code to the purchase email, and signs the buyer in; anyone who later signs in with that email (verified by code or OAuth) has Pro. Sign-up is open: an email code creates an account without a purchase.

```sh
# Create/reuse a separate framecn test brand and the five products (stale ones are archived).
pnpm dodo:setup

# Create/reuse the live catalog without activating live checkout locally.
pnpm dodo:setup --live

# After deploying the handler, register the matching environment's webhook.
pnpm dodo:setup --webhook-url=https://YOUR_HOST/api/webhooks/dodo
pnpm dodo:setup --live --webhook-url=https://YOUR_HOST/api/webhooks/dodo
```

Live credentials and product IDs are stored separately from active test values. For production, map the live values to the canonical `DODO_*` variables documented in `.env.example` and set `DODO_PAYMENTS_ENVIRONMENT=live_mode`. Never commit `.env.local`.

Checkout remains unavailable until a real `DODO_PAYMENTS_WEBHOOK_KEY` is configured. Only signature-verified payment/subscription events grant access, recorded by lowercased purchase email; browser redirects never do. Refunds, disputes, cancellation, expiry, and duplicate event delivery are handled server-side. `FRAMECN_LOCAL_WEBHOOK_KEY` is restricted to local test-mode fixtures and does not enable checkout.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

## Star History

<a href="https://www.star-history.com/?repos=shadcn-labs%2Fframecn&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=shadcn-labs/framecn&type=date&theme=dark&legend=top-left&sealed_token=Y57mSprjn7uT0MjlKlSNyToEuYvZHvGxID6vUI9K_VxHA5vfhAINmbTs6nc_cVFLlt0P6GwGz8OJkwYLgsVqmPh2wBoP7wr2lLtQTaRXwdnm6n5eTclAfnbNtdNBGPmtOM1d0p_Dwp9sLRUxK489V0p-zb3lALJLEqde2MhcXciEPUsY8J-VKi28VfFq" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=shadcn-labs/framecn&type=date&legend=top-left&sealed_token=Y57mSprjn7uT0MjlKlSNyToEuYvZHvGxID6vUI9K_VxHA5vfhAINmbTs6nc_cVFLlt0P6GwGz8OJkwYLgsVqmPh2wBoP7wr2lLtQTaRXwdnm6n5eTclAfnbNtdNBGPmtOM1d0p_Dwp9sLRUxK489V0p-zb3lALJLEqde2MhcXciEPUsY8J-VKi28VfFq" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=shadcn-labs/framecn&type=date&legend=top-left&sealed_token=Y57mSprjn7uT0MjlKlSNyToEuYvZHvGxID6vUI9K_VxHA5vfhAINmbTs6nc_cVFLlt0P6GwGz8OJkwYLgsVqmPh2wBoP7wr2lLtQTaRXwdnm6n5eTclAfnbNtdNBGPmtOM1d0p_Dwp9sLRUxK489V0p-zb3lALJLEqde2MhcXciEPUsY8J-VKi28VfFq" />
 </picture>
</a>
