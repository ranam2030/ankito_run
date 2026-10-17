// Single source of truth for all products and their options.
//
// Each product has:
//   slug              — used in /products/[slug] URL and as a stable key
//   options[]         — variant groups; each has type "swatch" or "choice"
//   options[].values  — the choices in that group; first value is the default
//   value.priceAdjust — optional, +/- BDT applied to unit price when picked
//   value.images      — optional, replaces the gallery images while picked
//   details[]         — "Product details" rows: { label, value } (e.g. Size, Material)
//   reviews[]         — real customer reviews: { name, location?, rating? (1–5), text };
//                       the reviews section stays hidden until one is added
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
    price: 349,
    oldPrice: 399,
    currency: "BDT",
    currencySymbol: "৳",

    images: [
      { src: "/images/product-cover.png", alt: "Wooden door bell with brass chime — features and uses" },
      { src: "/images/product-1.png",  alt: "Front view of wooden magnetic door bell" },
      { src: "/images/product-2.jpg",  alt: "Features overview infographic" },
      { src: "/images/product-3.webp", alt: "Door bell on a wooden surface" },
    ],
    lifestyleImages: [
      { src: "/images/lifestyle/doorbell/lifestyle-1.png", alt: "Mounted on a front door" },
      { src: "/images/lifestyle/doorbell/lifestyle-2.jpg", alt: "On a garden gate" },
      { src: "/images/lifestyle/doorbell/lifestyle-3.jpg", alt: "At a café entrance" },
    ],

    details: [
      { label: "Material", value: "Solid wood with a polished brass bell" },
      { label: "Power", value: "None needed — no batteries, no wires" },
      { label: "Mounting", value: "Mounts on any door or wall" },
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
          {
            id: "natural",
            name: "Natural Beech",
            hex: "#d2a96e",
            images: [
              { src: "/images/product-natural-beech.jpg", alt: "Natural beech door bell mounted on a stone wall" },
              { src: "/images/product-1.png",  alt: "Front view of wooden magnetic door bell" },
              { src: "/images/product-2.jpg",  alt: "Features overview infographic" },
              { src: "/images/product-3.webp", alt: "Door bell on a wooden surface" },
            ],
          },
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

    details: [
      { label: "Material", value: "Real, sustainably-sourced coconut shell" },
      { label: "Finish", value: "Hand-polished interior, food-safe" },
      { label: "Good for", value: "Smoothie bowls, salads, snacks or decor" },
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

  {
    slug: "straw-bag",
    brand: "Ankito",
    name: "Cotton-Rope Commuter Straw Bag",
    shortName: "Straw Tote Bag",
    fullProductString: "Cotton-Rope Commuter Straw Bag (Ankito)",
    subtitle:
      "Woven from cotton rope and natural straw with sturdy leather-look shoulder straps. Light enough to carry all day and roomy enough for work, travel or a trip to the market.",
    badge: "New",
    price: 1290,
    currency: "BDT",
    currencySymbol: "৳",

    images: [
      { src: "/images/straw-bag-1.png",  alt: "Cotton-rope straw tote bag with brown shoulder straps" },
      { src: "/images/straw-bag-2.webp", alt: "Two straw tote bags on a table by the window" },
    ],

    details: [
      { label: "Material", value: "Cotton rope and straw weave" },
      { label: "Straps", value: "Leather-look shoulder straps" },
      { label: "Good for", value: "Work, travel and daily use" },
    ],

    perks: [
      "Cotton rope & straw weave",
      "Lightweight, all-day carry",
      "Sturdy shoulder straps",
      "Roomy for work & travel",
    ],
    features: [
      {
        icon: "leaf",
        title: "Eco friendly",
        description: "Woven from cotton rope and natural straw — a natural alternative to plastic and synthetic bags.",
      },
      {
        icon: "shield",
        title: "Durable",
        description: "Tight weave and stitched shoulder straps built to carry your everyday load, day after day.",
      },
      {
        icon: "bag",
        title: "Spacious",
        description: "Room for a laptop sleeve, water bottle, groceries and more — perfect for work, travel and daily use.",
      },
    ],

    options: [
      {
        id: "color",
        label: "Color",
        type: "swatch",
        values: [
          { id: "khaki", name: "Khaki", hex: "#b08d57" },
        ],
      },
    ],
  },

  {
    slug: "canvas-tote-bag",
    brand: "Ankito",
    name: "Canvas Printed Tote Bag",
    shortName: "Canvas Tote Bag",
    fullProductString: "Canvas Printed Tote Bag (Ankito)",
    subtitle:
      "A roomy everyday tote in thick canvas, printed with a playful row of cats. Sturdy woven handles, light to carry and big enough for books, a water bottle and all your daily essentials.",
    badge: "New",
    price: 890,
    oldPrice: 999,
    currency: "BDT",
    currencySymbol: "৳",

    images: [
      { src: "/images/canvas-tote-cover.jpg",   alt: "Brown canvas tote bag with cat print on a wooden table" },
      { src: "/images/canvas-tote-cream-1.jpg", alt: "Cream white canvas tote bag with cat print on a bench" },
      { src: "/images/canvas-tote-brown-1.jpg", alt: "Close-up of the brown tote's cat print and handles" },
      { src: "/images/canvas-tote-brown-2.jpg", alt: "Brown canvas tote hanging on a clothes rack" },
      { src: "/images/canvas-tote-cream-2.jpg", alt: "Cream white canvas tote carried on the shoulder" },
    ],
    lifestyleImages: [
      { src: "/images/canvas-tote-cream-2.jpg", alt: "Cream white tote carried on the shoulder" },
      { src: "/images/canvas-tote-brown-2.jpg", alt: "Brown tote hanging beside a denim jacket" },
      { src: "/images/canvas-tote-brown-1.jpg", alt: "Brown tote on a shelf at home" },
    ],

    details: [
      { label: "Material", value: "Thick canvas" },
      { label: "Handles", value: "Woven, stitched handles" },
      { label: "Print", value: "Playful row of cats on the front" },
    ],

    perks: [
      "Thick, durable canvas",
      "Unique cat print",
      "Reusable & eco-friendly",
      "Roomy for daily essentials",
    ],
    features: [
      {
        icon: "shield",
        title: "Durable canvas",
        description: "Thick canvas with reinforced, stitched handles — made to carry books, groceries and a laptop day after day.",
      },
      {
        icon: "recycle",
        title: "Reusable & eco-friendly",
        description: "One sturdy bag in place of countless plastic ones. Good for you, better for the planet.",
      },
      {
        icon: "paw",
        title: "Unique cat design",
        description: "A playful row of cats printed across the front — a simple, stylish bag that stands out from the crowd.",
      },
    ],

    options: [
      {
        id: "color",
        label: "Color",
        type: "swatch",
        values: [
          {
            id: "brown",
            name: "Brown",
            hex: "#8b6a3e",
            images: [
              { src: "/images/canvas-tote-cover.jpg",   alt: "Brown canvas tote bag with cat print on a wooden table" },
              { src: "/images/canvas-tote-brown-1.jpg", alt: "Close-up of the brown tote's cat print and handles" },
              { src: "/images/canvas-tote-brown-2.jpg", alt: "Brown canvas tote hanging on a clothes rack" },
            ],
          },
          {
            id: "cream",
            name: "Cream White",
            hex: "#ece4d4",
            images: [
              { src: "/images/canvas-tote-cream-1.jpg", alt: "Cream white canvas tote bag with cat print on a bench" },
              { src: "/images/canvas-tote-cream-2.jpg", alt: "Cream white canvas tote carried on the shoulder" },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "boho-straw-tote",
    brand: "Ankito",
    name: "Boho Woven Crochet Straw Shoulder Tote Bag",
    shortName: "Boho Straw Tote",
    fullProductString: "Boho Woven Crochet Straw Shoulder Tote Bag (Ankito)",
    subtitle:
      "A relaxed boho tote in crochet-woven straw with wide braided shoulder straps and a wooden bead tassel. Roomy, light and easy to carry — for work, shopping or travel.",
    badge: "New",
    price: 1449,
    currency: "BDT",
    currencySymbol: "৳",

    images: [
      { src: "/images/boho-tote-green-1.jpg",    alt: "Emerald green crochet straw tote bag on a stone plinth" },
      { src: "/images/boho-tote-offwhite-1.jpg", alt: "Off-white crochet straw tote bag on a wooden table" },
      { src: "/images/boho-tote-green-2.webp",   alt: "Emerald green straw tote bag on a white chair" },
      { src: "/images/boho-tote-offwhite-2.jpg", alt: "Off-white straw tote bag carried on the shoulder" },
    ],
    lifestyleImages: [
      { src: "/images/boho-tote-offwhite-2.jpg", alt: "Off-white straw tote carried on the shoulder" },
      { src: "/images/boho-tote-green-2.webp",   alt: "Emerald green straw tote on a chair" },
      { src: "/images/boho-tote-green-1.jpg",    alt: "Emerald green straw tote with wooden bead tassel" },
    ],

    details: [
      { label: "Size", value: "Top width 45 cm · Bottom width 36 cm · Height 40 cm" },
      { label: "Material", value: "Crochet-woven straw with a fabric-lined interior" },
      { label: "Straps", value: "Wide braided shoulder straps" },
      { label: "Charm", value: "Wooden bead and tassel" },
    ],

    perks: [
      "Crochet-woven straw",
      "Wide braided shoulder straps",
      "Roomy 45 × 40 cm",
      "Wooden bead tassel charm",
    ],
    features: [
      {
        icon: "bag",
        title: "Spacious & versatile",
        description: "45 cm wide and 40 cm tall — room for a tablet, water bottle and all your everyday essentials. Great for work, shopping and travel.",
      },
      {
        icon: "shield",
        title: "Light & sturdy",
        description: "A tight crochet weave and wide braided straps hold their shape while staying light on your shoulder.",
      },
      {
        icon: "sparkle",
        title: "Boho details",
        description: "A wooden bead and tassel charm adds a relaxed, handmade touch to any outfit.",
      },
    ],

    options: [
      {
        id: "color",
        label: "Color",
        type: "swatch",
        values: [
          {
            id: "emerald-green",
            name: "Emerald Green",
            hex: "#6f7f50",
            images: [
              { src: "/images/boho-tote-green-1.jpg",  alt: "Emerald green crochet straw tote bag on a stone plinth" },
              { src: "/images/boho-tote-green-2.webp", alt: "Emerald green straw tote bag on a white chair" },
            ],
          },
          {
            id: "off-white",
            name: "Off-White",
            hex: "#ece2c6",
            images: [
              { src: "/images/boho-tote-offwhite-1.jpg", alt: "Off-white crochet straw tote bag on a wooden table" },
              { src: "/images/boho-tote-offwhite-2.jpg", alt: "Off-white straw tote bag carried on the shoulder" },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "boho-sunflower-tote",
    brand: "Ankito",
    name: "Boho Sunflower Cotton Rope Woven Tote Bag",
    shortName: "Boho Sunflower Tote",
    fullProductString: "Boho Sunflower Cotton Rope Woven Tote Bag (Ankito)",
    subtitle:
      "A sweet boho tote woven from cotton rope, finished with a lace bow and a daisy flower accent. Light and roomy enough for your daily essentials — perfect for shopping, outings and travel.",
    badge: "New",
    price: 890,
    oldPrice: 990,
    currency: "BDT",
    currencySymbol: "৳",

    images: [
      { src: "/images/sunflower-tote-beige-1.png",  alt: "Beige cotton rope tote with lace bow and daisy, shown from four angles" },
      { src: "/images/sunflower-tote-brown-1.png",  alt: "Brown woven tote with lace bow and daisy flower accent" },
      { src: "/images/sunflower-tote-beige-2.webp", alt: "Beige woven tote carried on the shoulder with tulips inside" },
      { src: "/images/sunflower-tote-brown-2.webp", alt: "Brown woven tote with lace bow carried on the shoulder" },
    ],
    lifestyleImages: [
      { src: "/images/sunflower-tote-beige-2.webp", alt: "Beige tote carried on the shoulder with tulips inside" },
      { src: "/images/sunflower-tote-brown-2.webp", alt: "Brown tote with lace bow carried on the shoulder" },
      { src: "/images/sunflower-tote-beige-1.png",  alt: "Beige tote from the front, side and back" },
    ],

    details: [
      { label: "Size", value: "Top width 35 cm · Bottom width 28 cm · Height 26 cm (without handles) · Depth 10 cm" },
      { label: "Material", value: "Woven cotton rope" },
      { label: "Handles", value: "Rounded rope top handles" },
      { label: "Decoration", value: "Lace bow and daisy flower accent" },
    ],

    perks: [
      "Woven cotton rope",
      "Lace bow & daisy accent",
      "35 × 26 cm, 10 cm deep",
      "Comfortable rope handles",
    ],
    features: [
      {
        icon: "leaf",
        title: "Natural woven look",
        description: "Woven from cotton rope in soft natural tones — light, breathable and easy to carry every day.",
      },
      {
        icon: "flower",
        title: "Lace bow & daisy",
        description: "A lace bow and a daisy flower accent give this tote a sweet, feminine boho charm.",
      },
      {
        icon: "bag",
        title: "Just the right size",
        description: "35 cm wide, 26 cm tall and 10 cm deep — fits your phone, wallet, makeup and a water bottle for everyday outings.",
      },
    ],

    options: [
      {
        id: "color",
        label: "Color",
        type: "swatch",
        values: [
          {
            id: "beige",
            name: "Beige Lace Daisy",
            hex: "#efe3c2",
            images: [
              { src: "/images/sunflower-tote-beige-1.png",  alt: "Beige cotton rope tote with lace bow and daisy, shown from four angles" },
              { src: "/images/sunflower-tote-beige-2.webp", alt: "Beige woven tote carried on the shoulder with tulips inside" },
            ],
          },
          {
            id: "brown",
            name: "Brown Lace Daisy",
            hex: "#b27a45",
            images: [
              { src: "/images/sunflower-tote-brown-1.png",  alt: "Brown woven tote with lace bow and daisy flower accent" },
              { src: "/images/sunflower-tote-brown-2.webp", alt: "Brown woven tote with lace bow carried on the shoulder" },
            ],
          },
        ],
      },
    ],
  },
];

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export const formatBDT = (n) => Number(n).toLocaleString("en-IN");
