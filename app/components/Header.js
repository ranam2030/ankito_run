import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="container nav">
        <a href="/" className="logo" aria-label="Ankito home">
          <Image
            src="/images/logo.jpg"
            alt="Ankito"
            width={140}
            height={44}
            priority
            style={{ height: 44, width: "auto" }}
          />
        </a>
        <a href="#order" className="cta">
          Order Now
        </a>
      </div>
    </header>
  );
}
