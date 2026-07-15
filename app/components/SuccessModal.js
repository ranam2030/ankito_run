"use client";

export default function SuccessModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="check">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3>Order placed!</h3>
        <p>We received your order. Our team will call you shortly to confirm delivery details.</p>
        <button type="button" className="btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
