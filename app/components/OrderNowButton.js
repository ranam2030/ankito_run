"use client";

import { useCallback, useState } from "react";
import ProductPickerModal from "./ProductPickerModal";

export default function OrderNowButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button type="button" className="cta" onClick={() => setOpen(true)}>
        Order Now
      </button>
      <ProductPickerModal open={open} onClose={close} />
    </>
  );
}
