"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

const ZOOM = 2.5;
const clamp = (v) => Math.max(0, Math.min(100, v));

/**
 * Full-screen image viewer. Open while `index` is a number.
 *   - arrows / keyboard / swipe to change image, thumbnails to jump
 *   - tap or click to zoom; move the mouse or drag to look around
 *   - × button, Esc, or swipe down to close
 * `onIndexChange` receives a new index or an updater function (a setState works).
 */
export default function Lightbox({ images, index, onIndexChange, onClose }) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const closeRef = useRef(null);
  const stageRef = useRef(null);
  const pointer = useRef(null);
  const count = images?.length || 0;
  const open = index != null && count > 0;

  const go = useCallback(
    (delta) => {
      setZoomed(false);
      onIndexChange((i) => (i + delta + count) % count);
    },
    [count, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    setZoomed(false);
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose, go]);

  if (!open) return null;
  const image = images[index] || images[0];

  // Pointer position inside the stage, as percentages.
  function pointAt(e) {
    const r = stageRef.current.getBoundingClientRect();
    return { x: clamp(((e.clientX - r.left) / r.width) * 100), y: clamp(((e.clientY - r.top) / r.height) * 100) };
  }

  function onPointerDown(e) {
    pointer.current = { startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    const p = pointer.current;
    // Zoomed with a mouse: the zoomed area follows the cursor.
    if (zoomed && e.pointerType === "mouse") {
      setOrigin(pointAt(e));
      if (p) p.moved = p.moved || Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > 8;
      return;
    }
    if (!p) return;
    if (Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > 8) p.moved = true;
    if (zoomed) {
      // Zoomed on touch: drag to pan. Moving the content by d needs the
      // transform origin to move by -d / (scale - 1).
      const r = stageRef.current.getBoundingClientRect();
      const dx = ((e.clientX - p.lastX) / r.width) * 100;
      const dy = ((e.clientY - p.lastY) / r.height) * 100;
      setOrigin((o) => ({ x: clamp(o.x - dx / (ZOOM - 1)), y: clamp(o.y - dy / (ZOOM - 1)) }));
    }
    p.lastX = e.clientX;
    p.lastY = e.clientY;
  }

  function onPointerUp(e) {
    const p = pointer.current;
    pointer.current = null;
    if (!p) return;
    if (!p.moved) {
      // Tap / click toggles zoom at that spot.
      if (zoomed) setZoomed(false);
      else {
        setOrigin(pointAt(e));
        setZoomed(true);
      }
      return;
    }
    if (zoomed) return;
    const dx = e.clientX - p.startX;
    const dy = e.clientY - p.startY;
    if (count > 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) onClose();
  }

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
      <div className="lightbox-top">
        <span className="lightbox-count">
          {index + 1} / {count}
        </span>
        <span className="lightbox-hint">{zoomed ? "Tap to zoom out" : "Tap the image to zoom"}</span>
        <button type="button" className="lightbox-btn" onClick={onClose} ref={closeRef} aria-label="Close">
          ×
        </button>
      </div>

      <div className="lightbox-main">
        {count > 1 && (
          <button type="button" className="lightbox-btn lightbox-prev" onClick={() => go(-1)} aria-label="Previous image">
            ‹
          </button>
        )}
        <div
          className={`lightbox-stage${zoomed ? " zoomed" : ""}`}
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (pointer.current = null)}
        >
          <div
            className="lightbox-zoom"
            style={{
              transform: zoomed ? `scale(${ZOOM})` : "none",
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          >
            <Image key={image.src} src={image.src} alt={image.alt} fill sizes="100vw" quality={90} priority draggable={false} />
          </div>
        </div>
        {count > 1 && (
          <button type="button" className="lightbox-btn lightbox-next" onClick={() => go(1)} aria-label="Next image">
            ›
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="lightbox-thumbs">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={`lightbox-thumb${i === index ? " active" : ""}`}
              onClick={() => {
                setZoomed(false);
                onIndexChange(i);
              }}
              aria-label={`View image ${i + 1}`}
              aria-current={i === index}
            >
              <Image src={img.src} alt="" fill sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}

export function ExpandIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}
