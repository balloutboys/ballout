# Ebook funnel: GoHighLevel code

These pages are rebuilt from the "Ebook website with Stripe integration" Claude Design artifacts. They're plain HTML, CSS and JS with no build step.

| File | GHL page |
|---|---|
| `sales-page.html` | Sales page, with countdown, Stripe checkout, waitlist form and FAQ |
| `thank-you-page.html` | Page buyers land on after paying in Stripe |
| `ebook-cover.jpg` | Cover image for the sales page (upload to GHL Media) |

## Setup
1. **Upload the cover.** In GHL go to Media Library, upload `ebook-cover.jpg` and copy its URL. In `sales-page.html`, replace `COVER_IMAGE_URL` with that URL.
2. **Sales page.** In Sites > Funnels (or Websites), add a step. Add a full-width section with 0 padding top and bottom and 0 margins. Add one row and one column, then drop in a **Code (Custom JS/HTML)** element. Paste the whole file and save.
3. **Thank-you page.** Add a second step and repeat step 2 with `thank-you-page.html`. Set the section background to `#1d2d3d`. Replace `SALES_PAGE_URL` with the sales page URL.
4. **Stripe redirect.** In the Stripe Dashboard, open Payment Links and choose your $29.99 link. Under *After payment*, pick *Don't show confirmation page* and enter the thank-you page URL.
5. Preview on desktop and mobile, then publish.

## Things you can edit
- At the bottom of `sales-page.html` you can change `STRIPE_URL` (the checkout link, used by both "Checkout with Stripe" buttons) and `DROP_DATE` (the countdown target).
- The waitlist uses your existing GHL form `NOQoT7c8flLRRBk2bUkt`. To use a different form, swap the ID in the `<iframe>`.
- All styles are scoped under `.bob` / `.bobty`, so they won't break the rest of your GHL site.
