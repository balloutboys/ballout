/**
 * BallOutBoys Athletics: every link, price and media file on the site lives here.
 * Edit this file to update the website. Empty strings ("") hide or fall back gracefully.
 */

export const site = {
  name: "BallOutBoys Athletics",
  coach: "Coach Ned",
  shortName: "BallOutBoys",
  tagline: "Baseball & softball player development",
  location: "Metro Atlanta, GA",
  motto: "Ball out at all times. You never know who's watching.",

  // Contact shown in the footer, Privacy Policy and Terms. Leave "" to hide.
  contactEmail: "info@balloutboysathletics.com",
  contactPhone: "",

  social: {
    instagram: "https://www.instagram.com/trainwithneddy/",
    tiktok: "https://www.tiktok.com/@trainwithneddy6",
    youtube: "https://www.youtube.com/@BalloutboysAthletics",
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
    summerSignup: "https://calendly.com/balloutboysathletics/summer-pogram",
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
    membership: "https://youtu.be/l7GpSgUfe7E",
    summer: "",
    // In-season VSL: shows as a second video on the Membership page once set.
    inSeason: "",
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
    domain: "vzvsbk-hu.myshopify.com",
    // Public Buy Button token (safe to publish; it can only read products and create carts).
    storefrontAccessToken: "5efa64e4de5c5d3cab08c5123e2abfe5",
    // Public storefront where the Ghosthop waitlist form signs people up for emails.
    storefrontUrl: "https://balloutboysmerch.com",
    collections: [
      { id: "453813764347", title: "Sport Performance", image: "https://cdn.shopify.com/s/files/1/0771/9750/8859/collections/5STARPhotoroom_20251029_125158.png?v=1776139048" },
      { id: "453813862651", title: "Streetwear", image: "https://cdn.shopify.com/s/files/1/0771/9750/8859/collections/Photoroom_20251029_133703.jpg?v=1776139208" },
      { id: "453814223099", title: "Ball Out Girls", image: "https://cdn.shopify.com/s/files/1/0771/9750/8859/collections/Photoroom_20251029_121043.jpg?v=1776140406" },
      { id: "453813993723", title: "Kids Sports Gear & Fashion", image: "https://cdn.shopify.com/s/files/1/0771/9750/8859/collections/Photoroom_20251030_195559.jpg?v=1776139898" },
    ],
  },

  stats: [
    { value: "100+", label: "Athletes trained" },
    { value: "15+", label: "College commits" },
    { value: "5+", label: "Years coaching" },
    { value: "ATL", label: "Metro Atlanta based" },
  ],

  summer: {
    year: "2027",
    dates: "June 1 – July 31",
    ages: "Ages 13+ · baseball & softball",
    location: "Metro Atlanta",
    price: "TBA",
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
