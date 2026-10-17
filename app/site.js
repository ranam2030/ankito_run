// Site-wide settings. Contact details and tracking IDs come from
// NEXT_PUBLIC_* env vars (see .env.local.example); anything left empty is
// simply not rendered, so the site works before they are filled in.

const env = (v) => (v || "").trim();

export const SITE = {
  name: "Ankito",
  tagline: "Handcrafted goods, naturally made",
  taglineBn: "প্রকৃতির সাথে, প্রতিদিন",
  description:
    "Handcrafted wooden door bells, coconut bowls and more — naturally made. Delivery and Cash on Delivery across Bangladesh.",
  url: env(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000",

  phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE), // e.g. 01712345678
  // Only used inside wa.me links; never displayed on the page.
  whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) || "8801796704503",
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  facebookUrl: env(process.env.NEXT_PUBLIC_FACEBOOK_URL),
  instagramUrl: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  messengerUrl: env(process.env.NEXT_PUBLIC_MESSENGER_URL), // e.g. https://m.me/yourpage

  // Restricted to their known character sets since they are inlined into scripts.
  fbPixelId: (env(process.env.NEXT_PUBLIC_FB_PIXEL_ID) || "2431461353802429").replace(/\D/g, ""),
  gaId: env(process.env.NEXT_PUBLIC_GA_ID).replace(/[^A-Za-z0-9-]/g, ""), // e.g. G-XXXXXXXXXX
};

// Shown on the homepage and every product page. Keep answers in line with the
// delivery and payment terms shown in the order form.
export const FAQ = [
  {
    q: "How do I place an order?",
    a: "Choose your product and options, then fill in the order form with your name, phone number, district, thana and address. We call you to confirm before dispatch. You can also order by messaging us on WhatsApp.",
  },
  {
    q: "How do I pay?",
    a: "Cash on Delivery — pay in cash when your order arrives.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders ship within 1–2 days. Delivery takes 1–3 business days inside Dhaka and 3–5 days outside Dhaka.",
  },
  {
    q: "How much is the delivery charge?",
    a: "৳60 inside Dhaka city and ৳130 everywhere else, including Savar, Keraniganj, Dhamrai, Dohar and Nawabganj. The charge is added automatically when you choose your district and thana.",
  },
];

// wa.me needs digits only, in international format (880...).
export function whatsappLink(text = "") {
  if (!SITE.whatsapp) return null;
  let digits = SITE.whatsapp.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "88" + digits;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
