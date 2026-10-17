"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Lightbox, { ExpandIcon } from "./Lightbox";

export default function Lifestyle({ product }) {
  const [viewerIndex, setViewerIndex] = useState(null);
  const closeViewer = useCallback(() => setViewerIndex(null), []);
  const images = product?.lifestyleImages?.length
    ? product.lifestyleImages
    : product?.images || [];

  if (!images.length) return null;

  return (
    <section>
      <div className="container">
        <h2>See it in your space</h2>
        <div className="lifestyle">
          {images.map((img, i) => (
            <button
              type="button"
              className="img-wrap"
              key={img.src}
              onClick={() => setViewerIndex(i)}
              aria-label={`View full size: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 800px) 100vw, 360px"
                loading="lazy"
              />
              <span className="expand-icon" aria-hidden="true">
                <ExpandIcon size={15} />
              </span>
            </button>
          ))}
        </div>
      </div>
      <Lightbox images={images} index={viewerIndex} onIndexChange={setViewerIndex} onClose={closeViewer} />
    </section>
  );
}
