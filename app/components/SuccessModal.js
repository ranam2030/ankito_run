"use client";

import { useEffect, useRef } from "react";
import { whatsappLink } from "../site";

function confirmMessage(order) {
  const item = [order.productName, ...order.options].join(" — ");
  return [
    `Hi Ankito! I just placed an order.`,
    order.orderId && `Order no: ${order.orderId}`,
    `Item: ${item} × ${order.quantity}`,
    `Total: ${order.total}`,
    `Name: ${order.name}`,
    `Please confirm my order.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function SuccessModal({ order, onClose }) {
  const okRef = useRef(null);
  const open = Boolean(order);

  useEffect(() => {
    if (!open) return;
    okRef.current?.focus();
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const wa = whatsappLink(confirmMessage(order));

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div className="modal">
        <div className="check">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 id="success-title">Order placed!</h3>
        {order.orderId && (
          <div className="order-id">
            Order no: <strong>{order.orderId}</strong>
          </div>
        )}
        <p>We received your order. Our team will call you shortly to confirm delivery details.</p>
        {wa && (
          <a href={wa} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
            Confirm instantly on WhatsApp
          </a>
        )}
        <button type="button" className="btn btn-outline" onClick={onClose} ref={okRef}>
          OK
        </button>
      </div>
    </div>
  );
}
