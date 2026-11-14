/**
 * BallOutBoys Athletics: every link, price and media file on the site lives here.
 * Edit this file to update the website. Empty strings ("") hide or fall back gracefully.
 */

export const site = {
  name: "BallOutBoys Athletics",
  coach: "Coach Ned",
  legalName: "Ball Out Boys, LLC",
  coachPhoto: "/media/merch/multicolor-tee-bw.jpg",
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
    ebookPrice: "$29.99",
    // Stripe Payment Link > After payment > "Don't show confirmation page" > redirect to this page:
    ebookThankYou: "https://www.balloutboysathletics.com/ebook/thank-you",
    skoolClassroom: "https://www.skool.com/the-rotational-force-blueprint-4992/classroom/623a61f2",
    skoolApp: "https://apps.apple.com/app/id6447270545",
    lessonsBooking: "https://balloutboys.as.me",
    // Athlete advising call (ebook bonus: 3-day free trial). Replace with your own booking link.
    advisingCall: "https://calendly.com/balloutboysathletics/strategy-call",
    merchStore: "https://balloutboysmerch.com",
    // Your Google Business reviews link (shows a "Read on Google" button). Leave "" to hide.
    googleReviews: "https://share.google/WstQeSODwrDuPo35r",
    // Where the summer program "Reserve a spot" buttons go.
    summerSignup: "https://calendly.com/balloutboysathletics/summer-pogram",
  },

  /**
   * Background highlight reel for the home page hero (like the example video).
   * Drop .mp4 files in /public/media/highlights/ and list them here, e.g.
   *   "/media/highlights/hitting-1.mp4"
   * Keep each clip short (5-10s), muted, under ~8 MB. They crossfade in order.
   */
  /** What plays behind the home headline: "photos" (bright, rotating heroPhotos) or "videos" (heroHighlights). */
  heroMode: "photos" as "photos" | "videos",

  heroHighlights: [
    "/media/highlights/night-at-bat.mp4",
    "/media/highlights/game-at-bat.mp4",
    "/media/highlights/base-hit.mp4",
    "/media/highlights/night-game-pitch.mp4",
    "/media/highlights/day-game-at-bat.mp4",
    "/media/highlights/day-at-bat-2.mp4",
  ] as string[],

  /**
   * Athlete photos. Drop images in /public/media/athletes/ and list them here.
   * They show in the home page gallery and the About page.
   */
  athletePhotos: [
    { src: "/media/athletes/power-swing.jpg" },
    { src: "/media/athletes/night-swing.jpg" },
    { src: "/media/athletes/softball.jpg" },
    { src: "/media/athletes/captured-by-jss.jpg", caption: "Photo: Jayleigh's Sideline Shots" },
    { src: "/media/athletes/college-portrait.jpg" },
    { src: "/media/athletes/pop-up-catch.jpg" },
    { src: "/media/athletes/dugout.jpg" },
    { src: "/media/athletes/pride-ready.jpg" },
    { src: "/media/athletes/second-base.jpg" },
    { src: "/media/athletes/diving-stop.jpg" },
    { src: "/media/athletes/walk-up.jpg" },
    { src: "/media/athletes/infield-throw.jpg" },
    { src: "/media/athletes/youth-fielding.jpg" },
    { src: "/media/athletes/slide-second.jpg" },
    { src: "/media/athletes/ready-third-base.jpg" },
    { src: "/media/athletes/at-bat.jpg" },
    { src: "/media/athletes/infield-ready.jpg" },
  ] as { src: string; name?: string; caption?: string }[],

  /** Photos that rotate behind the home page headline until heroHighlights videos are added. */
  heroPhotos: [
    "/media/athletes/power-swing.jpg",
  ],

  /** Vertical (phone) clips. They show as tall tiles in the Highlights section only. */
  portraitClips: ["/media/highlights/cage-swing.mp4"] as string[],

  /** Merch lookbook photos (merch page + home merch card). */
  merchPhotos: [
    { src: "/media/merch/athletics-tee-portrait.jpg", alt: "BallOutBoys Athletics black tee" },
    { src: "/media/merch/five-star-hoodie.jpg", alt: "BallOutBoys 5-Star zip hoodie" },
    { src: "/media/merch/the-champ-tee.jpg", alt: "The Champ youth tee, back print" },
    { src: "/media/merch/train-develop-compete-tee.jpg", alt: "Train Develop Compete tee, back print" },
    { src: "/media/merch/globe-performance-tee.jpg", alt: "BallOutBoys globe performance tee and shorts" },
    { src: "/media/merch/multicolor-hoodie.jpg", alt: "BallOutBoys multicolor hoodie" },
    { src: "/media/merch/multicolor-tee.jpg", alt: "BallOutBoys multicolor tee" },
    { src: "/media/merch/black-tee.jpg", alt: "BallOutBoys black globe tee" },
    { src: "/media/merch/globe-tee-back.jpg", alt: "BallOutBoys youth tee, back print" },
    { src: "/media/merch/youth-long-sleeve.jpg", alt: "BallOutBoys youth long sleeve" },
    { src: "/media/merch/stick-talk-tee.jpg", alt: "Stick Talk youth tee" },
    { src: "/media/merch/gods-favorite-tee.jpg", alt: "God's Favorite tee" },
    { src: "/media/merch/multicolor-tee-bw.jpg", alt: "BallOutBoys multicolor tee" },
  ],

  /** Team results with photos (home + about pages). */
  wins: [
    { src: "/media/athletes/team-champions.jpg", title: "42 Classic Champions", detail: "2025 · Training Legends" },
    { src: "/media/athletes/team-finalist.jpg", title: "Perfect Game Sunday Series", detail: "Finalist" },
  ],

  /** Sponsor logos shown on the home page. bg = tile color behind the logo. */
  partners: [
    { name: "Midnight Vending LLC", src: "/media/partners/midnight-vending.png", bg: "#000000" },
    { name: "ECS Agency", src: "/media/partners/ecs-agency.jpg", bg: "#fbfaf6" },
    { name: "The Rack", src: "/media/partners/the-rack.png", bg: "#ffffff" },
    { name: "Jayleigh's Sideline Shots", src: "/media/partners/jayleighs-sideline-shots.png", bg: "#000000" },
  ] as { name: string; src: string; bg: string; url?: string }[],

  /**
   * Video testimonials. Paste YouTube links (unlisted is fine). type "parent" also shows on the Summer page.
   * e.g. { url: "https://youtu.be/XXXX", label: "Jake, 15U", type: "athlete" }
   */
  testimonials: [] as { url: string; label: string; type: "athlete" | "parent" }[],

  /** Join popup (shows once a week per visitor). */
  popup: { image: "/media/merch/five-star-hoodie.jpg" },

  /** Founder Member grand-opening offer. Hides automatically after the deadline (end of that day, ET). */
  founders: {
    spots: 30,
    deadlineLabel: "Nov 30",
    deadline: "2026-11-30T23:59:59-05:00",
    testDay: "First week of December",
    guarantee: "+5 MPH",
    guaranteeText: "exit velo in your first 30 days",
    perks: [
      "4 one-hour small-group sessions a week",
      "Strength, speed & hitting in groups of 5–8",
      "Retest every 4 weeks: watch your numbers move",
      "Baseball & softball · ages 13+ · in person or online",
    ],
    fineprint: "Founder pricing requires a 6- or 12-month commitment; month-to-month is not eligible. *30-Day Exit Velo Guarantee: eligibility terms apply.",
  },

  /**
   * VSL (video sales letter) videos. Use a YouTube / Vimeo link or an mp4 path
   * in /public/media/. Empty shows a "video coming soon" frame.
   */
  vsl: {
    // In-season VSL: plays at the top of the Membership page.
    membership: "",
    summer: "https://youtu.be/l7GpSgUfe7E",
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
    price: "Book your free call",
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
    blurb: "Only 30 spots. Founder pricing plus the +5 MPH exit velo guarantee in your first 30 days.*",
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
