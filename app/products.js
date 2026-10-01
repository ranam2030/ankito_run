// Single source of truth for all products and their options.
//
// Each product has:
//   slug              — used in /products/[slug] URL and as a stable key
//   options[]         — variant groups; each has type "swatch" or "choice"
//   options[].values  — the choices in that group; first value is the default
//   value.priceAdjust — optional, +/- BDT applied to unit price when picked
//
// To add a new product, append to PRODUCTS. To add a new variant group on
// any product, append to its options[]. UI updates automatically.

export const PRODUCTS = [
  {
    slug: "wooden-door-bell",
    brand: "Ankito",
    name: "Wooden Magnetic Door Bell — Brass Chime",
    shortName: "Wooden Door Bell",
    fullProductString: "Wooden Magnetic Door Bell — Brass Chime (Ankito)",
    subtitle:
      "Handcrafted from solid wood with a polished brass bell. Mount it on any door — every time the door swings, it produces a clear, soothing ring. No batteries, no wires.",
    badge: "Best Seller",
    price: 299,
    oldPrice: 399,
    currency: "BDT",
    currencySymbol: "৳",

    images: [
      { src: "/images/product-1.png",  alt: "Front view of wooden magnetic door bell" },
      { src: "/images/product-2.jpg",  alt: "Features overview infographic" },
      { src: "/images/product-3.webp", alt: "Door bell on a wooden surface" },
    ],
    lifestyleImages: [
      { src: "/images/lifestyle/doorbell/lifestyle-1.png", alt: "Mounted on a front door" },
      { src: "/images/lifestyle/doorbell/lifestyle-2.jpg", alt: "On a garden gate" },
      { src: "/images/lifestyle/doorbell/lifestyle-3.jpg", alt: "At a café entrance" },
    ],

    perks: [
      "Solid wood + brass",
      "No batteries needed",
      "Soothing natural tone",
      "Easy wall mount",
    ],
    features: [
      {
        icon: "plus",
        title: "Magnetic stick",
        description: "A magnet on the door frame nudges the brass ball as the door moves, producing a clean, melodic ring.",
      },
      {
        icon: "clock",
        title: "Long lasting",
        description: "No electronics to fail and no batteries to replace. Built from solid wood and polished brass.",
      },
      {
        icon: "wave",
        title: "Calming sound",
        description: "Gentle, soothing chime — far nicer than a buzzer. Perfect for homes, cafés and shop entrances.",
      },
    ],

    options: [
      {
        id: "color",
        label: "Color",
        type: "swatch",
        values: [
          { id: "natural", name: "Natural Beech", hex: "#d2a96e" },
          { id: "walnut",  name: "Dark Walnut",  hex: "#5a3825" },
        ],
      },
    ],
  },

  {
    slug: "cocobowl",
    brand: "CocoBowl",
    name: "CocoBowl — Coconut Bowl",
    shortName: "Coconut Bowl",
    fullProductString: "CocoBowl Coconut Bowl",
    subtitle:
      "Handcrafted from real, sustainably-sourced coconut shells. Lightweight, durable, naturally beautiful — perfect for smoothie bowls, salads, snacks, or as a decor piece. Live naturally.",
    badge: "New",
    price: 299,
    oldPrice: 399,
    currency: "BDT",
    currencySymbol: "৳",

    images: [
      { src: "/images/cocobowl1.jpg", alt: "CocoBowl coconut bowl with wooden spoon" },
      { src: "/images/cocobowl2.png", alt: "CocoBowl lifestyle shot among palm leaves" },
    ],
    lifestyleImages: [
      { src: "/images/lifestyle/cocobowl/coco1.webp", alt: "Coconut bowl with wooden spoon, top angle" },
      { src: "/images/lifestyle/cocobowl/coco2.jpg", alt: "Bowl on rustic wooden surface, palm leaves behind" },
      { src: "/images/lifestyle/cocobowl/coco3.jpg", alt: "Bowl on rustic wooden surface, palm leaves behind" },
    ],

    perks: [
      "100% real coconut shell",
      "Hand-polished interior",
      "Lightweight & durable",
      "Eco-friendly & sustainable",
    ],
    features: [
      {
        icon: "leaf",
        title: "100% natural",
        description: "Carved from real, sustainably-sourced coconut shells — every bowl is one of a kind.",
      },
      {
        icon: "sparkle",
        title: "Hand-polished interior",
        description: "Smoothed and polished by hand to a soft natural finish that's safe for food and easy to clean.",
      },
      {
        icon: "recycle",
        title: "Eco-friendly",
        description: "Plastic-free, biodegradable, and built to last for years. A small choice that lives lightly on the planet.",
      },
    ],

    options: [
      {
        id: "spoon",
        label: "Include spoon",
        type: "choice",
        values: [
          { id: "with",    name: "With Spoon",    priceAdjust: 50 },
          { id: "without", name: "Without Spoon", priceAdjust: 0 },
        ],
      },
    ],
  },
];

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export const formatBDT = (n) => Number(n).toLocaleString("en-IN");
