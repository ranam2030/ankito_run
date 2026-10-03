"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatBDT } from "../products";
import SuccessModal from "./SuccessModal";
import { useSelection } from "./SelectionContext";
import { normalizeBDPhone, validateOrder } from "../validation";
import { trackEvent } from "../analytics";

const MAX_QTY = 10;
const FIELD_ORDER = ["name", "phone", "email", "address", "notes"];
// Contact fields remembered on this device for returning customers.
const SAVED_KEY = "ankito:customer";
const SAVED_FIELDS = ["name", "phone", "email", "address"];

function loadSavedCustomer() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || null;
  } catch {
    return null;
  }
}

function saveCustomer(values) {
  try {
    const data = Object.fromEntries(SAVED_FIELDS.map((f) => [f, values[f] || ""]));
    localStorage.setItem(SAVED_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable (private mode etc.) — nothing to remember.
  }
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p className="field-error" id={`${id}-error`} role="alert">
      {message}
    </p>
  );
}

export default function OrderForm() {
  const { product, finalUnitPrice, selectedSummary } = useSelection();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null); // set after a successful order
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);

  // Pre-fill contact details saved from a previous order on this device.
  useEffect(() => {
    const saved = loadSavedCustomer();
    const form = formRef.current;
    if (!saved || !form) return;
    for (const f of SAVED_FIELDS) {
      if (saved[f] && form.elements[f] && !form.elements[f].value) form.elements[f].value = saved[f];
    }
  }, []);

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

  // Validate a single field when the user leaves it (skip untouched empty fields).
  function onFieldBlur(e) {
    const { name, value } = e.target;
    if (!value.trim() && !fieldErrors[name]) return;
    const values = Object.fromEntries(new FormData(e.target.form));
    const message = validateOrder(values)[name];
    setFieldErrors((prev) => ({ ...prev, [name]: message }));
  }

  // Clear a field's error as soon as the user starts correcting it.
  function onFieldInput(e) {
    const { name } = e.target;
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (error) setError("");
  }

  function fieldProps(name) {
    return {
      id: name,
      name,
      onBlur: onFieldBlur,
      onInput: onFieldInput,
      "aria-invalid": fieldErrors[name] ? true : undefined,
      "aria-describedby": fieldErrors[name] ? `${name}-error` : undefined,
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();
    const address = (fd.get("address") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const notes = (fd.get("notes") || "").toString().trim();

    const errors = validateOrder({ name, phone, email, address, notes });
    setFieldErrors(errors);
    const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      setError("Please correct the highlighted fields.");
      form.elements[firstInvalid]?.focus();
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      product: product.fullProductString,
      productSlug: product.slug,
      options: selectedSummary,
      name,
      phone: normalizeBDPhone(phone),
      email,
      address,
      quantity,
      unitPrice: finalUnitPrice,
      total: finalUnitPrice * quantity,
      currency: product.currency,
      notes,
      website: (fd.get("website") || "").toString(), // honeypot, see route.js
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (data.fieldErrors) {
        setFieldErrors(data.fieldErrors);
        setError("Please correct the highlighted fields.");
        return;
      }
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Server returned an error.");
      }
      const total = data.total ?? payload.total;
      if (!data.duplicate) {
        trackEvent("Purchase", "purchase", {
          value: total,
          currency: payload.currency,
          content_ids: [product.slug],
          content_name: product.shortName,
          num_items: quantity,
          order_id: data.orderId,
        });
      }
      saveCustomer({ name, phone, email, address });
      setOrder({
        orderId: data.orderId,
        productName: product.shortName,
        options: selectedSummary.map((s) => s.valueName),
        quantity,
        total: `${sym}${formatBDT(total)}`,
        name,
      });
      setQuantity(1);
      form.elements.notes.value = "";
    } catch (err) {
      setError(
        "Something went wrong: " + err.message + " — please try again or message us on WhatsApp."
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
            <form onSubmit={handleSubmit} noValidate ref={formRef}>
              {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="field">
                <label htmlFor="name">
                  Full Name <span className="req">*</span>
                </label>
                <input type="text" {...fieldProps("name")} required autoComplete="name" />
                <FieldError id="name" message={fieldErrors.name} />
              </div>

              <div className="row-2">
                <div className="field">
                  <label htmlFor="phone">
                    Phone <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    {...fieldProps("phone")}
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                  />
                  <FieldError id="phone" message={fieldErrors.phone} />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    {...fieldProps("email")}
                    autoComplete="email"
                    placeholder="optional"
                  />
                  <FieldError id="email" message={fieldErrors.email} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="address">
                  Delivery Address <span className="req">*</span>
                </label>
                <textarea
                  {...fieldProps("address")}
                  required
                  autoComplete="street-address"
                  placeholder="House/Road, Area, City, District"
                />
                <FieldError id="address" message={fieldErrors.address} />
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
                  {...fieldProps("notes")}
                  placeholder="Any delivery instructions or preferred time"
                />
                <FieldError id="notes" message={fieldErrors.notes} />
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

      <SuccessModal
        order={order}
        onClose={() => {
          setOrder(null);
          router.push("/");
          window.scrollTo({ top: 0 });
        }}
      />
    </section>
  );
}
