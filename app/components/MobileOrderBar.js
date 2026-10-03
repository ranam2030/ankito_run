"use client";

import { useEffect, useState } from "react";
import { formatBDT } from "../products";
import { useSelection } from "./SelectionContext";

// Sticky "Order Now" bar on phones; hides once the order form is on screen.
export default function MobileOrderBar() {
  const { product, finalUnitPrice } = useSelection();
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("order");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting));
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (!product) return null;

  return (
    <div className={`mobile-order-bar${formVisible ? " hidden" : ""}`} aria-hidden={formVisible}>
      <div>
        <div className="mobile-order-price">
          {product.currencySymbol}
          {formatBDT(finalUnitPrice)}
        </div>
        <div className="mobile-order-note">Free delivery · Cash on Delivery</div>
      </div>
      <a href="#order" className="btn" tabIndex={formVisible ? -1 : 0}>
        Order Now
      </a>
    </div>
  );
}
