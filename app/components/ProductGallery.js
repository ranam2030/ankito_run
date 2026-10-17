"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useSelection } from "./SelectionContext";
import Lightbox, { ExpandIcon } from "./Lightbox";

export default function ProductGallery({ product }) {
  const { selections } = useSelection();
  // A selected option value with its own images (e.g. a color) overrides the
  // product's default gallery.
  const override = (product?.options || [])
    .map((opt) => opt.values?.find((v) => v.id === selections[opt.id]))
    .find((v) => v?.images?.length);
  const images = override?.images || product?.images || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(null); // full-size viewer, null = closed
  const closeViewer = useCallback(() => setViewerIndex(null), []);

  // Show the first image of the new set whenever the selection swaps it.
  useEffect(() => {
    setActiveIndex(0);
  }, [override]);

  // Keep the gallery on whichever image was last viewed full size.
  useEffect(() => {
    if (viewerIndex != null) setActiveIndex(viewerIndex);
  }, [viewerIndex]);

  if (images.length === 0) return null;
  const active = images[activeIndex] || images[0];

  function selectImage(i) {
    if (i === activeIndex) return;
    setFading(true);
    setTimeout(() => {
      setActiveIndex(i);
      setFading(false);
    }, 120);
  }

  return (
    <div className="gallery">
      <div className="gallery-main">
        <button
          type="button"
          className="next-image-wrap gallery-open"
          style={{ opacity: fading ? 0 : 1 }}
          onClick={() => setViewerIndex(activeIndex)}
          aria-label="View full size image"
        >
          <Image
            src={active.src}
            alt={active.alt}
            fill
            sizes="(max-width: 800px) 100vw, 540px"
            priority
          />
        </button>
        <span className="expand-chip" aria-hidden="true">
          <ExpandIcon size={14} />
          Full size
        </span>
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={`gallery-thumb${i === activeIndex ? " active" : ""}`}
              onClick={() => selectImage(i)}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 800px) 33vw, 180px"
              />
            </button>
          ))}
        </div>
      )}

      <Lightbox images={images} index={viewerIndex} onIndexChange={setViewerIndex} onClose={closeViewer} />
    </div>
  );
}
