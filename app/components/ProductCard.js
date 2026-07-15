import Link from "next/link";
import Image from "next/image";
import { formatBDT } from "../products";

export default function ProductCard({ product }) {
  if (!product) return null;
  const cover = product.images?.[0];
  const sym = product.currencySymbol;
  const save = (product.oldPrice || 0) - product.price;

  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-card-image">
        {cover && (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(max-width: 800px) 100vw, 540px"
          />
        )}
        {product.badge && <span className="product-card-badge">{product.badge}</span>}
      </div>
      <div className="product-card-body">
        <div className="product-card-brand">{product.brand}</div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="price-row">
          <div className="price">{sym}{formatBDT(product.price)}</div>
          {product.oldPrice && (
            <>
              <div className="price-old">{sym}{formatBDT(product.oldPrice)}</div>
              {save > 0 && <div className="save">Save {sym}{formatBDT(save)}</div>}
            </>
          )}
        </div>
        <span className="btn product-card-cta">View product</span>
      </div>
    </Link>
  );
}
