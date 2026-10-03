import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "../../products";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductGallery from "../../components/ProductGallery";
import HeroDetails from "../../components/HeroDetails";
import Features from "../../components/Features";
import Lifestyle from "../../components/Lifestyle";
import OrderForm from "../../components/OrderForm";
import { SelectionProvider } from "../../components/SelectionContext";
import MobileOrderBar from "../../components/MobileOrderBar";
import { SITE } from "../../site";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const product = getProduct(params.slug);
  if (!product) return { title: "Not found" };
  const description = `${product.subtitle} Cash on Delivery across Bangladesh.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — ${product.currencySymbol}${product.price}`,
      description,
      url: `/products/${product.slug}`,
      images: product.images.map((img) => ({ url: img.src, alt: img.alt })),
    },
  };
}

// schema.org Product data so Google can show price and availability.
function productJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.subtitle,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images.map((img) => new URL(img.src, SITE.url).href),
    offers: {
      "@type": "Offer",
      url: new URL(`/products/${product.slug}`, SITE.url).href,
      price: product.price,
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export default function ProductPage({ params }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <SelectionProvider product={product} fromUrl>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <Header />

      <div className="container">
        <div className="hero">
          <ProductGallery product={product} />
          <HeroDetails product={product} />
        </div>
      </div>

      <Features product={product} />
      <Lifestyle product={product} />
      <OrderForm />
      <Footer />
      <MobileOrderBar />
    </SelectionProvider>
  );
}
