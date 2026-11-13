# BallOutBoys Athletics website

Everything in one place: memberships, summer program, 1-on-1 lessons, ebook, merch, Ghosthop, About, Privacy, Terms and a link-in-bio page.
Next.js (App Router), deployed on Vercel. No database, no monthly tools beyond what you already pay for.

## Pages
| URL | What it is |
|---|---|
| `/` | Home: highlight-reel hero, programs, memberships, ebook, Skool, merch, Ghosthop |
| `/membership` | VSL landing page for memberships (Beturr cards + buy buttons) |
| `/summer` | VSL landing page for the summer program |
| `/lessons` | 1-on-1 lessons with the Acuity booking calendar embedded (payments via Stripe in Acuity) |
| `/merch` | Merch: Shopify Buy Button collection on the page, or category cards linking to balloutboysmerch.com |
| `/ebook` | Ebook sales page (Stripe checkout); `/ebook/thank-you` is the post-purchase page |
| `/ghosthop` | Coming 2027 teaser |
| `/about`, `/privacy`, `/terms` | About us and legal |
| `/links` | Link-in-bio page with every link (use it in your Instagram/TikTok bio) |

## Editing the site
**Almost everything is in one file: `src/site.config.ts`.** Links, contact email, socials, VSL videos, summer dates/price, Shopify and Acuity settings.

### Add highlight videos (home page background)
1. Put short muted `.mp4` clips (5-10 s, under ~8 MB each) in `public/media/highlights/`.
2. List them in `heroHighlights` in `site.config.ts`, e.g. `"/media/highlights/hitting-1.mp4"`. They crossfade in order.

### Add athlete photos
Put images in `public/media/athletes/` and list them in `athletePhotos` with an optional name and caption (e.g. school or commitment). They show on Home, About, Membership and Summer, and become the hero background if no videos are set.

### Add the VSL videos
Set `vsl.membership` and `vsl.summer` to a YouTube/Vimeo link (unlisted is fine) or an mp4 path.

### Ghosthop waitlist
The form on `/ghosthop` adds people to Shopify > Customers as email subscribers tagged `ghosthop-waitlist`. When it drops, send a campaign from Shopify > Marketing > Shopify Email to customers with that tag.

### Merch on the page (Shopify + Tapstitch)
Tapstitch syncs products to Shopify, so the site just reads from Shopify. In Shopify admin: Sales channels > Buy Button > Create a Buy Button > Collection. From the generated code copy `domain`, `storefrontAccessToken` and the collection `id` into `shopify` in `site.config.ts`. Products then show with Add to cart and Shopify checkout right on `/merch`.

### Lessons payments (Acuity + Stripe)
In Acuity: Business Settings > Payment Settings > connect Stripe and require payment at booking. Optional: set `acuity.ownerId` (from Acuity's embed code) to use the official embed URL.

## Local dev
```bash
npm install
npm run dev
```

## Deploy
Vercel auto-deploys pushes. Point `balloutboysathletics.com` at the Vercel project under Project > Settings > Domains.
