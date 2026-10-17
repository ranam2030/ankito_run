import { PRODUCTS } from "../products";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ product }) {
  const others = PRODUCTS.filter((p) => p.slug !== product?.slug).slice(0, 3);
  if (others.length === 0) return null;

  return (
    <section className="related-section">
      <div className="container">
        <h2>You may also like</h2>
        <div className="product-grid">
          {others.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
