import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import { PRODUCTS } from "./products";

export default function HomePage() {
  return (
    <>
      <Header />

      <div className="container">
        <section className="home-hero">
          <h1 className="home-title">Handcrafted goods, naturally made</h1>
          <p className="home-sub">Pick a product to view details and place an order.</p>
        </section>

        <div className="product-grid">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
