"use client";

import { useState } from "react";
import { formatBDT } from "../products";
import SuccessModal from "./SuccessModal";
import { useSelection } from "./SelectionContext";

const MAX_QTY = 10;

export default function OrderForm() {
  const { product, finalUnitPrice, selectedSummary } = useSelection();

  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!product) return null;
  const total = finalUnitPrice * quantity;
  const sym = product.currencySymbol;

  function changeQty(delta) {
    setQuantity((q) => Math.max(1, Math.min(MAX_QTY, q + delta)));
  }

  function onQtyInput(e) {
    let v = parseInt(e.target.value, 10);
    if (isNaN(v) || v < 1) v = 1;
    if (v > MAX_QTY) v = MAX_QTY;
    setQuantity(v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();
    const address = (fd.get("address") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const notes = (fd.get("notes") || "").toString().trim();

    if (!name || !phone || !address) {
      setError("Please fill in name, phone and address.");
      return;
    }
    if (!/^[0-9+\-\s]{7,}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      product: product.fullProductString,
      productSlug: product.slug,
      options: selectedSummary,
      name,
      phone,
      email,
      address,
      quantity,
      unitPrice: finalUnitPrice,
      total: finalUnitPrice * quantity,
      currency: product.currency,
      notes,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Server returned an error.");
      }
      e.target.reset();
      setQuantity(1);
      setSuccess(true);
    } catch (err) {
      setError(
        "Something went wrong: " + err.message + " — please try again or call us directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="order">
      <div className="container">
        <h2>Place your order</h2>
        <p style={{ color: "var(--muted)", marginTop: "-12px", marginBottom: "32px" }}>
          Fill in the form below. We will call to confirm before dispatch. Pay cash on delivery.
        </p>

        <div className="order-grid">
          <div className="form-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">
                  Full Name <span className="req">*</span>
                </label>
                <input type="text" id="name" name="name" required autoComplete="name" />
              </div>

              <div className="row-2">
                <div className="field">
                  <label htmlFor="phone">
                    Phone <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder="optional"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="address">
                  Delivery Address <span className="req">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  autoComplete="street-address"
                  placeholder="House/Road, Area, City, District"
                />
              </div>

              <div className="field">
                <label>Quantity</label>
                <div className="qty-control">
                  <button
                    type="button"
                    onClick={() => changeQty(-1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={onQtyInput}
                    min="1"
                    max={MAX_QTY}
                  />
                  <button
                    type="button"
                    onClick={() => changeQty(1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="field">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Any delivery instructions or preferred time"
                />
              </div>

              <button type="submit" className="btn full" disabled={submitting}>
                {submitting ? "Placing order…" : `Confirm Order — ${sym}${formatBDT(total)}`}
              </button>

              {error && <div className="form-msg error">{error}</div>}
            </form>
          </div>

          <div className="summary">
            <h3>Order summary</h3>
            <div className="summary-row">
              <span>
                {product.shortName} × {quantity}
              </span>
              <span>
                {sym}
                {formatBDT(finalUnitPrice * quantity)}
              </span>
            </div>

            {selectedSummary.map((s) => (
              <div className="summary-row" key={s.optionId}>
                <span>{s.optionLabel}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {s.hex && (
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: s.hex,
                        border: "1px solid var(--line)",
                      }}
                    />
                  )}
                  {s.valueName}
                </span>
              </div>
            ))}

            <div className="summary-row">
              <span>Delivery</span>
              <span style={{ color: "var(--success)" }}>FREE</span>
            </div>
            <div className="summary-row">
              <span>Total</span>
              <span>
                {sym}
                {formatBDT(total)}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "16px" }}>
              Cash on delivery is available across Bangladesh. Delivery takes 1–3 business days
              inside Dhaka, 3–5 days outside.
            </p>
          </div>
        </div>
      </div>

      <SuccessModal open={success} onClose={() => setSuccess(false)} />
    </section>
  );
}
