# Myanmar Native Gems

A curated online gallery of fine cut gemstones, live at
**[burmagems.github.io](https://burmagems.github.io)**.

The site is a static React SPA. Gemstone inventory lives in a Google Sheet
and is fetched by the browser at runtime, so editing the Sheet updates the
site without a rebuild. Editorial content (Our Story, gemstone guides) lives
in Markdown files and is bundled at build time.

## Tech stack

- React 19 + TypeScript (strict) + Vite
- React Router (HashRouter, static-host friendly)
- TanStack Query (fetching, caching, retries)
- PapaParse (CSV parsing)
- Tailwind CSS v4
- react-markdown + remark-gfm (editorial content)
- GitHub Actions + GitHub Pages (build and hosting)

## Local development

```bash
git clone https://github.com/BurmaGems/burmagems.github.io.git
cd burmagems.github.io
npm install
cp env.example .env.local
npm run dev
```

Without `.env.local` the dev server uses a small mock inventory and logs a
notice; production never shows mock data.

Scripts:

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript project check |

## Gemstone inventory (Google Sheet)

Inventory comes from this Google Sheet, published as CSV:

```
https://docs.google.com/spreadsheets/d/15ecCh3G3JogHYwb_rLZlWEFrB3Z3fOH1G5-b7GlFEhQ/gviz/tq?tqx=out:csv&gid=0
```

The URL is configured through `VITE_GEMS_SHEET_URL` (see `env.example`
locally, and the `Build` step of `.github/workflows/deploy.yml` in CI; a
repository variable named `VITE_GEMS_SHEET_URL` overrides the default).

### Columns

| Column | Meaning | Notes |
| --- | --- | --- |
| `Item No` | Stable gem identifier | Required; rows without it are skipped. Drives the `/#/gem/<no>` URL |
| `Gem Type` | Ruby, Sapphire, Spinel, ... | Free text; collection filters derive from it |
| `Carat (ct)` | Carat weight | `1.25` or `1.25ct` both work |
| `Price (Kyat)` | Price in Kyat | `4,800,000` or `4800000` both work |
| `Is Sold (Y/N)` | Sold flag | `Y`/`Yes`/`TRUE` = sold. `N`/`No`/`FALSE`/blank = available. Anything else is treated as sold |
| `Certificate Link` | Optional lab report URL | Shown as "View certificate" on the detail page when present |
| `Image 1 Link` | Main photo URL | Google Drive share links are converted automatically (see below) |
| `Image 2 Link` | Second photo URL | Shown on hover and on the detail page |

Header matching is forgiving: spellings like `image1_link`,
`Certificate_Link`, `No`, or `Image URL 1` all work. Column order does not
matter.

### Editing workflow

1. Edit the Sheet (add a row, change a price, flip `Is Sold` to `Y`).
2. That is all. The site fetches the CSV at runtime; visitors see the change
   on their next visit (data is cached for about 5 minutes in an open tab).
   No commit and no deployment is needed.

### Photo links from Google Drive

Paste the normal Drive share link (`https://drive.google.com/file/d/...`)
into the image columns; the site converts it to a direct image URL
automatically. Two requirements:

- The file must be shared as **"Anyone with the link can view"**.
- It must be an image file (JPG/PNG/WebP).

If an image is missing or fails to load, the site shows a quiet placeholder
instead of a broken image.

### The Sheet is public

Publishing the Sheet makes its contents readable by anyone, and everything
prefixed with `VITE_` ships inside the public JavaScript bundle. Keep the
Sheet limited to catalog data. Never put in it:

- customer names, contacts, or order history
- supplier names or cost prices
- credentials, tokens, or API keys
- any private business information

## Editorial content (Markdown)

Static content lives in `src/content/`:

```
src/content/pages/our-story.md        -> /#/about
src/content/education/*.md            -> /#/education/<slug>
```

### Editing or adding an article

1. Edit an existing `.md` file, or add a new one under
   `src/content/education/`.
2. Set the frontmatter fields:

   ```md
   ---
   title: Understanding Ruby
   description: One-sentence summary shown on cards and in the page header.
   slug: ruby
   order: 1
   published: true
   template: guide
   ---
   ```

   `title` is required. `slug` defaults to the filename. `order` controls
   listing order. Set `published: false` to hide a page. Optional:
   `heroImage`, `eyebrow`, `template` (`editorial` | `guide` | `simple`).

3. Commit and push to `main`. GitHub Actions rebuilds and redeploys the
   site. Unlike inventory edits, content changes require this deploy.

The education index page, the homepage "Learn" section, and the footer all
generate themselves from the frontmatter; new articles appear automatically.

## Deployment (GitHub Pages)

One-time repository setup:

```
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

After that, every push to `main` runs `.github/workflows/deploy.yml`
(lint, typecheck, build, deploy) and publishes to
`https://burmagems.github.io`.

The Vite config uses `base: "/"` because this is the account root site.
Routing uses `HashRouter` (`/#/gems`, `/#/gem/12`) so deep links work on
static hosting; if the site later moves to a host with SPA fallbacks
(Cloudflare Pages, Vercel), swap `HashRouter` for `BrowserRouter` in
`src/App.tsx`.

## Project structure

```
src/
  components/
    common/     Button, Container, LoadingSkeleton, ErrorState
    content/    MarkdownPage, MarkdownContent, EditorialHero, ArticleCard
    gems/       GemCard, GemGrid, GemImage, GemFilters, GemGallery
    home/       Hero, GemstoneCategories, FeaturedGems, ValuePropositions,
                EducationPreview, InquiryCTA
    layout/     Header, MobileNavigation, Footer, SiteLayout
  config/       site.ts, gemstones.ts, navigation.ts
  content/      pages/*.md, education/*.md
  data/         mockGems.ts (dev-only fallback)
  hooks/        useGems.ts
  lib/          googleSheets.ts, markdown.ts, currency.ts, inquiry.ts, utils.ts
  pages/        one component per route
  types/        gem.ts, content.ts
public/images/  placeholder artwork (replace with real photography)
```

## Before real launch (TODOs)

- Replace the placeholder artwork for the four gemstone tiles in
  `public/images/gems/` with real photography (the hero and Our Story
  already use real photos).
- Add an `og:image` (1200x630) and reference it in `index.html`.
- Optionally connect the inquiry form to a real backend (Formspree, Google
  Apps Script, or a custom API) by implementing `submitInquiry()` in
  `src/lib/inquiry.ts`; until then the form hands off to the visitor's
  email app and says so honestly.
