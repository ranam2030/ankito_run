"use client";

import { createContext, useContext, useMemo, useState } from "react";

const SelectionContext = createContext(null);

/**
 * Wraps a single product page so its options can be selected and read by
 * any descendant. Each option's first value is the default selection.
 *
 *   <SelectionProvider product={product}>
 *     <HeroDetails product={product} />
 *     <OrderForm />
 *   </SelectionProvider>
 */
export function SelectionProvider({ product, children }) {
  const initial = {};
  for (const opt of product?.options || []) {
    initial[opt.id] = opt.values?.[0]?.id;
  }

  const [selections, setSelections] = useState(initial);

  function setSelection(optionId, valueId) {
    setSelections((s) => ({ ...s, [optionId]: valueId }));
  }

  const value = useMemo(() => {
    function getOption(id) {
      return product?.options?.find((o) => o.id === id) || null;
    }
    function getValue(optionId) {
      const opt = getOption(optionId);
      if (!opt) return null;
      return opt.values?.find((v) => v.id === selections[optionId]) || null;
    }

    // Sum of priceAdjusts on the currently-selected values.
    let priceAdjust = 0;
    const selectedSummary = [];
    for (const opt of product?.options || []) {
      const v = opt.values?.find((x) => x.id === selections[opt.id]);
      if (v?.priceAdjust) priceAdjust += v.priceAdjust;
      if (v) {
        selectedSummary.push({
          optionId: opt.id,
          optionLabel: opt.label,
          valueId: v.id,
          valueName: v.name,
          hex: v.hex || null,
        });
      }
    }

    const finalUnitPrice = (product?.price || 0) + priceAdjust;

    return {
      product,
      selections,
      setSelection,
      getOption,
      getValue,
      priceAdjust,
      finalUnitPrice,
      selectedSummary,
    };
  }, [product, selections]);

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error("useSelection must be used inside <SelectionProvider>");
  }
  return ctx;
}
