import { PRODUCTS } from "./products";
import { SITE } from "./site";

export default function sitemap() {
  const now = new Date();
  return [
    { url: new URL("/", SITE.url).href, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...PRODUCTS.map((p) => ({
      url: new URL(`/products/${p.slug}`, SITE.url).href,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
