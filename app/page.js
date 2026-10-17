import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import TrustBar from "./components/TrustBar";
import Faq from "./components/Faq";
import { PRODUCTS, formatBDT } from "./products";
import { SITE, whatsappLink } from "./site";

export const metadata = {
  title: { absolute: `${SITE.name} — ${SITE.tagline}` },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featured = PRODUCTS.find((p) => p.badge === "Best Seller") || PRODUCTS[0];
  const wa = whatsappLink("Hi Ankito! I'd like to know more about your products.");

  return (
    <>
      <Header pickProduct />

      <div className="home-banner">
        <div className="container home-banner-grid">
          <div className="home-banner-text">
            <p className="eyebrow" lang="bn">{SITE.taglineBn}</p>
            <h1 className="home-title">Handcrafted goods, naturally made</h1>
            <p className="home-sub">
              Wooden door bells, coconut bowls and everyday bags made from natural materials.
              Delivery all over Bangladesh. Pay cash on delivery.
            </p>
            <div className="home-banner-actions">
              <a href="#products" className="btn btn-lg">
                Shop now
              </a>
              {wa && (
                <a href={wa} className="btn btn-lg btn-outline" target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="home-banner-media">
            <Image
              src="/images/lifestyle/doorbell/lifestyle-1.png"
              alt="Wooden door bell with brass chime on a front door"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 480px"
            />
            {featured && (
              <Link href={`/products/${featured.slug}`} className="home-banner-chip">
                <span className="home-banner-chip-label">{featured.badge || "Featured"}</span>
                <strong>{featured.shortName}</strong>
                <span>
                  {featured.currencySymbol}
                  {formatBDT(featured.price)}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container trust-wrap">
        <TrustBar />
      </div>

      <section id="products" className="products-section">
        <div className="container">
          <div className="section-head">
            <h2>Our products</h2>
            <p>Pick a product to view details and place an order.</p>
          </div>
          <div className="product-grid">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <Faq />
      <Footer />
    </>
  );
}
