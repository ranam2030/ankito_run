import Image from "next/image";

export default function Lifestyle({ product }) {
  const images = product?.lifestyleImages?.length
    ? product.lifestyleImages
    : product?.images || [];

  if (!images.length) return null;

  return (
    <section>
      <div className="container">
        <h2>See it in your space</h2>
        <div className="lifestyle">
          {images.map((img) => (
            <div className="img-wrap" key={img.src}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 800px) 100vw, 360px"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
