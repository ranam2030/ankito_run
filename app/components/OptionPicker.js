"use client";

import { useSelection } from "./SelectionContext";

/**
 * Generic option picker. Looks at option.type and renders either:
 *   - "swatch" → coloured circle + name (e.g. wood color)
 *   - "choice" → labelled pill button (e.g. With Spoon / Without Spoon)
 *
 * Reads + writes the selection through SelectionContext.
 */
export default function OptionPicker({ option }) {
  const { selections, setSelection } = useSelection();
  if (!option || !option.values?.length) return null;

  const selectedId = selections[option.id];
  const selectedValue = option.values.find((v) => v.id === selectedId);

  return (
    <div className="option-picker">
      <div className="option-picker-label">
        {option.label}: <strong>{selectedValue?.name}</strong>
      </div>
      <div
        className={`option-pills option-pills-${option.type || "choice"}`}
        role="radiogroup"
        aria-label={`Choose ${option.label.toLowerCase()}`}
      >
        {option.values.map((v) => {
          const selected = v.id === selectedId;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={v.name}
              title={v.name}
              className={`option-pill${selected ? " selected" : ""}`}
              onClick={() => setSelection(option.id, v.id)}
            >
              {option.type === "swatch" && (
                <span
                  className="option-swatch-dot"
                  style={{ background: v.hex }}
                  aria-hidden="true"
                />
              )}
              <span className="option-pill-name">{v.name}</span>
              {v.priceAdjust ? (
                <span className="option-pill-adjust">
                  {v.priceAdjust > 0 ? "+" : ""}
                  {v.priceAdjust}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
