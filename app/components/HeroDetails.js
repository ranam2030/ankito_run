import { formatBDT } from "../products";
import OptionPicker from "./OptionPicker";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function HeroDetails({ product }) {
  if (!product) return null;
  const sym = product.currencySymbol;
  const save = (product.oldPrice || 0) - product.price;

  return (
    <div>
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
      <div className="stock">
        <span className="dot" />
        In stock — ships in 1–2 days
      </div>

      {(product.options || []).map((opt) => (
        <OptionPicker key={opt.id} option={opt} />
      ))}

      <a href="#order" className="btn">
        Order Now — Cash on Delivery
      </a>

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
