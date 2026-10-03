"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PRODUCTS, formatBDT } from "../products";
import OptionPicker from "./OptionPicker";
import { SelectionProvider, useSelection } from "./SelectionContext";
import { trackEvent } from "../analytics";

// Confirm button lives inside the SelectionProvider so it can read the
// chosen options and carry them to the product page's order form.
function ConfirmOrder({ onDone }) {
  const router = useRouter();
  const { product, selections, finalUnitPrice } = useSelection();

  function confirm() {
    const params = new URLSearchParams(selections).toString();
    trackEvent("InitiateCheckout", "begin_checkout", {
      value: finalUnitPrice,
      currency: product.currency,
      content_ids: [product.slug],
    });
    onDone();
    router.push(`/products/${product.slug}${params ? `?${params}` : ""}#order`);
  }

  return (
    <button type="button" className="btn full" onClick={confirm}>
      Confirm Order — {product.currencySymbol}
      {formatBDT(finalUnitPrice)}
    </button>
  );
}

export default function ProductPickerModal({ open, onClose }) {
  const [slug, setSlug] = useState(null);
  const dialogRef = useRef(null);
  const product = PRODUCTS.find((p) => p.slug === slug) || null;

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal picker-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3 id="picker-title">Select a product</h3>
        <p>Choose what you&rsquo;d like to order. You&rsquo;ll add delivery details next.</p>

        <div className="picker-list" role="radiogroup" aria-label="Products">
          {PRODUCTS.map((p) => {
            const selected = p.slug === slug;
            const cover = p.images?.[0];
            return (
              <button
                key={p.slug}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`picker-item${selected ? " selected" : ""}`}
                onClick={() => setSlug(p.slug)}
              >
                <span className="picker-thumb">
                  {cover && <Image src={cover.src} alt="" fill sizes="64px" />}
                </span>
                <span className="picker-info">
                  <span className="picker-name">{p.shortName}</span>
                  <span className="picker-price">
                    {p.currencySymbol}
                    {formatBDT(p.price)}
                    {p.oldPrice && (
                      <s>
                        {p.currencySymbol}
                        {formatBDT(p.oldPrice)}
                      </s>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {product ? (
          <SelectionProvider key={product.slug} product={product}>
            <div className="picker-options">
              {(product.options || []).map((opt) => (
                <OptionPicker key={opt.id} option={opt} />
              ))}
            </div>
            <ConfirmOrder onDone={onClose} />
          </SelectionProvider>
        ) : (
          <button type="button" className="btn full" disabled>
            Select a product to continue
          </button>
        )}
      </div>
    </div>
  );
}
