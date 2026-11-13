/**
 * BallOutBoys Athletics: every link, price and media file on the site lives here.
 * Edit this file to update the website. Empty strings ("") hide or fall back gracefully.
 */

export const site = {
  name: "BallOutBoys Athletics",
  shortName: "BallOutBoys",
  tagline: "Baseball & softball player development",
  location: "Metro Atlanta, GA",
  motto: "Ball out at all times. You never know who's watching.",

  // Contact shown in the footer, Privacy Policy and Terms. Leave "" to hide.
  contactEmail: "",
  contactPhone: "",

  social: {
    instagram: "",
    tiktok: "",
    youtube: "",
  },

  links: {
    newClientSignup: "https://beturrapp.com/join/balloutboys-athletics",
    clientSignIn: "https://beturrapp.com",
    onlineStore: "https://www.balloutboysathletics.com",
    skool: "https://www.skool.com/the-rotational-force-blueprint-4992/about",
    ebookCheckout: "https://buy.stripe.com/8x25kD8lUds60O1aze3VC05",
    lessonsBooking: "https://balloutboys.as.me",
    merchStore: "https://balloutboysmerch.com",
    // Where the summer program "Reserve a spot" buttons go.
    summerSignup: "https://beturrapp.com/join/balloutboys-athletics",
    // Ghosthop waitlist (a form link, e.g. Google Form / Typeform). Falls back to Skool.
    ghosthopWaitlist: "",
  },

  /**
   * Background highlight reel for the home page hero (like the example video).
   * Drop .mp4 files in /public/media/highlights/ and list them here, e.g.
   *   "/media/highlights/hitting-1.mp4"
   * Keep each clip short (5-10s), muted, under ~8 MB. They crossfade in order.
   */
  heroHighlights: [] as string[],

  /**
   * Athlete photos. Drop images in /public/media/athletes/ and list them here.
   * They show in the home page gallery and the About page.
   */
  athletePhotos: [] as { src: string; name?: string; caption?: string }[],

  /**
   * VSL (video sales letter) videos. Use a YouTube / Vimeo link or an mp4 path
   * in /public/media/. Empty shows a "video coming soon" frame.
   */
  vsl: {
    membership: "",
    summer: "",
  },

  /** Acuity: Stripe is connected inside Acuity (Business Settings > Payment Settings). */
  acuity: {
    // Optional: your Acuity owner ID from the embed code ("schedule.php?owner=XXXXX").
    // When set, the booking calendar embeds directly on the Lessons page.
    ownerId: "",
  },

  /**
   * Shopify Buy Button: shows your merch with "Add to cart" right on the Merch page.
   * Shopify admin > Sales channels > Buy Button > create a Collection button.
   * Copy domain, storefrontAccessToken and the collection id from the generated code.
   */
  shopify: {
    domain: "", // e.g. "balloutboysmerch.myshopify.com"
    storefrontAccessToken: "",
    collectionId: "",
  },

  stats: [
    { value: "HS", label: "to college pipeline" },
    { value: "1-on-1", label: "private lessons" },
    { value: "Pro", label: "level training habits" },
    { value: "ATL", label: "metro Atlanta based" },
  ],

  summer: {
    year: "2027",
    dates: "Dates announced soon",
    ages: "Ages 8-18 · baseball & softball",
    location: "Metro Atlanta",
    price: "",
    spots: "Limited spots",
  },
};

export type Membership = {
  id: string;
  name: string;
  blurb: string;
  featured?: boolean;
};

const joinBase = "https://beturrapp.com/join/balloutboys-athletics?package=";
export const embedUrl = (id: string) => `https://beturrapp.com/embed/package/${id}`;
export const joinUrl = (id: string) => `${joinBase}${id}`;

export const memberships: Membership[] = [
  {
    id: "238d6eaf-c852-449f-a2e7-7b07bb802330",
    name: "12 Month Membership",
    blurb: "A full year of development. Best value for athletes chasing the next level.",
    featured: true,
  },
  {
    id: "3f166ce2-636a-4e37-8ffb-94182d6e921f",
    name: "6 Month Membership",
    blurb: "A full season block: offseason build plus in-season maintenance.",
  },
  {
    id: "6649c11e-40e5-4466-a785-b867d02a48bd",
    name: "Founders Member Program",
    blurb: "Founding-member pricing and perks for the first athletes in.",
  },
  {
    id: "aeea575c-c913-42a7-b0fb-b27e37a637e3",
    name: "Walk-On Membership",
    blurb: "Get started without the long commitment. Earn your spot.",
  },
];

export const nav = [
  { href: "/membership", label: "Membership" },
  { href: "/summer", label: "Summer Program" },
  { href: "/lessons", label: "1-on-1 Lessons" },
  { href: "/ebook", label: "Ebook" },
  { href: "/merch", label: "Merch" },
  { href: "/about", label: "About" },
];
