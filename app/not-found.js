import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import { PRODUCTS } from "./products";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Header pickProduct />

      <div className="container">
        <section className="home-hero">
          <h1 className="home-title">Sorry, we couldn&rsquo;t find that page</h1>
          <p className="home-sub">It may have moved. Here&rsquo;s what we have in store:</p>
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
