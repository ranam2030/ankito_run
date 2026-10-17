"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatBDT } from "../products";
import SuccessModal from "./SuccessModal";
import { useSelection } from "./SelectionContext";
import { normalizeBDPhone, validateOrder } from "../validation";
import {
  DISTRICTS,
  ZONE_LABEL,
  deliveryCharge,
  deliveryZone,
  formatFullAddress,
  getDistrict,
  getThana,
} from "../locations";
import { trackEvent } from "../analytics";

const MAX_QTY = 10;
const FIELD_ORDER = ["name", "phone", "email", "district", "thana", "address", "notes"];
// Contact fields remembered on this device for returning customers.
const SAVED_KEY = "ankito:customer";
const TEXT_FIELDS = ["name", "phone", "email", "address"];
const SAVED_FIELDS = [...TEXT_FIELDS, "district", "thana"];

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

// Thana options; Dhaka's are split into the city (inside Dhaka) and outer upazilas.
function ThanaOptions({ district, sym }) {
  if (!district) return null;
  const options = (list) =>
    list.map((t) => (
      <option key={t.name} value={t.name}>
        {t.name} ({t.bn})
      </option>
    ));
  const inside = district.thanas.filter((t) => t.inside);
  if (inside.length === 0) return options(district.thanas);
  const outside = district.thanas.filter((t) => !t.inside);
  return (
    <>
      <optgroup label={`Dhaka City — ${sym}${deliveryCharge(district.name, inside[0].name)} delivery`}>
        {options(inside)}
      </optgroup>
      <optgroup label={`Outside Dhaka City — ${sym}${deliveryCharge(district.name, outside[0].name)} delivery`}>
        {options(outside)}
      </optgroup>
    </>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
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
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  // Live copies of the typed contact fields, for the "Delivering to" preview.
  const [live, setLive] = useState({ name: "", phone: "", address: "" });
  const formRef = useRef(null);

  // Pre-fill contact details saved from a previous order on this device.
  useEffect(() => {
    const saved = loadSavedCustomer();
    const form = formRef.current;
    if (!saved || !form) return;
    const filled = {};
    for (const f of TEXT_FIELDS) {
      if (saved[f] && form.elements[f] && !form.elements[f].value) {
        form.elements[f].value = saved[f];
        filled[f] = saved[f];
      }
    }
    setLive((prev) => ({ ...prev, ...filled }));
    if (getDistrict(saved.district)) {
      setDistrict(saved.district);
      if (getThana(saved.district, saved.thana)) setThana(saved.thana);
    }
  }, []);

  if (!product) return null;
  const sym = product.currencySymbol;
  const subtotal = finalUnitPrice * quantity;
  const zone = deliveryZone(district, thana);
  const shipping = deliveryCharge(district, thana); // null until district/thana decide it
  const total = subtotal + (shipping || 0);
  const districtData = getDistrict(district);
  const fullAddress = formatFullAddress(live.address, district, thana);
  const areaText = `${district} - ${thana}`;
  const showAddressPreview = Boolean(districtData && thana && live.address.trim());
  const previewContact = [live.name.trim(), normalizeBDPhone(live.phone)].filter(Boolean).join(" · ");

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

  function onDistrictChange(e) {
    setDistrict(e.target.value);
    setThana("");
    setFieldErrors((prev) => ({ ...prev, district: undefined, thana: undefined }));
    if (error) setError("");
  }

  function onThanaChange(e) {
    setThana(e.target.value);
    setFieldErrors((prev) => ({ ...prev, thana: undefined }));
    if (error) setError("");
  }

  // Clear a field's error as soon as the user starts correcting it.
  function onFieldInput(e) {
    const { name, value } = e.target;
    if (name in live) setLive((prev) => ({ ...prev, [name]: value }));
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

    const errors = validateOrder({ name, phone, email, district, thana, address, notes });
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
      district,
      thana,
      address,
      quantity,
      unitPrice: finalUnitPrice,
      subtotal,
      deliveryCharge: shipping,
      total,
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
      saveCustomer({ name, phone, email, address, district, thana });
      setOrder({
        orderId: data.orderId,
        productName: product.shortName,
        options: selectedSummary.map((s) => s.valueName),
        quantity,
        total: `${sym}${formatBDT(total)}`,
        name,
        address: formatFullAddress(address, district, thana),
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

              <div className="row-2">
                <div className="field">
                  <label htmlFor="district">
                    District <span className="req">*</span>
                  </label>
                  <select
                    {...fieldProps("district")}
                    value={district}
                    onChange={onDistrictChange}
                    required
                    autoComplete="address-level2"
                  >
                    <option value="">Select district</option>
                    {DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.bn})
                      </option>
                    ))}
                  </select>
                  <FieldError id="district" message={fieldErrors.district} />
                </div>
                <div className="field">
                  <label htmlFor="thana">
                    Thana / Upazila <span className="req">*</span>
                  </label>
                  <select
                    {...fieldProps("thana")}
                    value={thana}
                    onChange={onThanaChange}
                    required
                    disabled={!districtData}
                    autoComplete="address-level3"
                  >
                    <option value="">{districtData ? "Select thana" : "Select district first"}</option>
                    <ThanaOptions district={districtData} sym={sym} />
                  </select>
                  <FieldError id="thana" message={fieldErrors.thana} />
                </div>
              </div>

              {zone && !showAddressPreview && (
                <p className="delivery-hint">
                  Delivery charge ({ZONE_LABEL[zone]}): <strong>{sym}{formatBDT(shipping)}</strong>
                </p>
              )}

              <div className="field">
                <label htmlFor="address">
                  Full Address <span className="req">*</span>
                </label>
                <textarea
                  {...fieldProps("address")}
                  required
                  autoComplete="street-address"
                  placeholder="House no., road, area or village"
                />
                <FieldError id="address" message={fieldErrors.address} />
                {showAddressPreview && (
                  <div className="address-preview" aria-live="polite">
                    <div className="address-preview-head">
                      <PinIcon />
                      Delivering to
                    </div>
                    {previewContact && <div className="address-preview-contact">{previewContact}</div>}
                    <p className="address-preview-text">
                      {fullAddress.slice(0, -areaText.length)}
                      <strong>{areaText}</strong>
                    </p>
                    <div className="address-preview-meta">
                      {ZONE_LABEL[zone]} · Delivery charge {sym}
                      {formatBDT(shipping)} · Please check before confirming
                    </div>
                  </div>
                )}
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
                {submitting
                  ? "Placing order…"
                  : `Confirm Order — ${sym}${formatBDT(total)}${shipping == null ? " + delivery" : ""}`}
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
              <span>
                Delivery
                {zone && <span className="summary-zone"> · {ZONE_LABEL[zone]}</span>}
              </span>
              {shipping == null ? (
                <span className="summary-pending">Select district &amp; thana</span>
              ) : (
                <span>
                  {sym}
                  {formatBDT(shipping)}
                </span>
              )}
            </div>
            <div className="summary-row">
              <span>Total</span>
              <span>
                {sym}
                {formatBDT(total)}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "16px" }}>
              Cash on delivery is available across Bangladesh. Delivery charge is {sym}60 inside
              Dhaka city and {sym}130 outside. Delivery takes 1–3 business days inside Dhaka, 3–5
              days outside.
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
