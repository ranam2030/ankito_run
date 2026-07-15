"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ product }) {
  const images = product?.images || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

  if (images.length === 0) return null;
  const active = images[activeIndex];

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
        <div className="next-image-wrap" style={{ opacity: fading ? 0 : 1 }}>
          <Image
            src={active.src}
            alt={active.alt}
            fill
            sizes="(max-width: 800px) 100vw, 540px"
            priority
          />
        </div>
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
    </div>
  );
}
