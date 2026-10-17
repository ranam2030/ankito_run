import { formatBDT } from "../products";

// "Product details" table: the product's own `details` rows, its option
// choices, then the shop-wide delivery and payment terms.
export default function ProductDetails({ product }) {
  if (!product) return null;
  const sym = product.currencySymbol;

  const rows = [
    ...(product.details || []),
    ...(product.options || []).map((opt) => ({
      label: opt.label,
      value: opt.values
        .map((v) => (v.priceAdjust ? `${v.name} (+${sym}${formatBDT(v.priceAdjust)})` : v.name))
        .join(", "),
    })),
    { label: "Delivery", value: "৳60 inside Dhaka city · ৳130 outside Dhaka · 1–3 days in Dhaka, 3–5 days outside" },
    { label: "Payment", value: "Cash on Delivery" },
  ];

  return (
    <section className="details-section">
      <div className="container container-narrow">
        <h2>Product details</h2>
        <dl className="details">
          {rows.map((r) => (
            <div className="details-row" key={r.label}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
