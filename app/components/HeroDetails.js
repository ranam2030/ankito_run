import { formatBDT, isSoldOut } from "../products";
import OptionPicker from "./OptionPicker";
import TrustBar from "./TrustBar";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function HeroDetails({ product }) {
  if (!product) return null;
  const sym = product.currencySymbol;
  const save = (product.oldPrice || 0) - product.price;
  const soldOut = isSoldOut(product);

  return (
    <div className="hero-details">
      {product.badge && <span className="badge">{product.badge}</span>}
      <h1>{product.name}</h1>
      <p className="subtitle">{product.subtitle}</p>

      <div className="price-row">
        <div className="price">{sym}{formatBDT(product.price)}</div>
        {product.oldPrice && (
          <>
            <div className="price-old">{sym}{formatBDT(product.oldPrice)}</div>
            {save > 0 && <div className="save">Save {sym}{formatBDT(save)}</div>}
          </>
        )}
      </div>
      {soldOut ? (
        <div className="stock stock-out">
          <span className="dot" />
          Out of stock — currently unavailable
        </div>
      ) : (
        <div className="stock">
          <span className="dot" />
          In stock — ships in 1–2 days
        </div>
      )}

      {(product.options || []).map((opt) => (
        <OptionPicker key={opt.id} option={opt} />
      ))}

      {soldOut ? (
        <button type="button" className="btn btn-lg" disabled>
          Out of stock
        </button>
      ) : (
        <a href="#order" className="btn btn-lg">
          Order Now — Cash on Delivery
        </a>
      )}
      <TrustBar compact />

      {product.perks?.length > 0 && (
        <ul className="perks">
          {product.perks.map((perk) => (
            <li key={perk}>
              <CheckIcon /> {perk}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
