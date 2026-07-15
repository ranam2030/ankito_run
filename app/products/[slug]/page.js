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

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const product = getProduct(params.slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.name} — ${product.brand}`,
    description: product.subtitle,
  };
}

export default function ProductPage({ params }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <SelectionProvider product={product}>
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
    </SelectionProvider>
  );
}
