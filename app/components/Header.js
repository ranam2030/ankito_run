import Image from "next/image";
import Link from "next/link";
import OrderNowButton from "./OrderNowButton";

// pickProduct: on pages without an order form (the homepage), "Order Now"
// opens a product picker instead of jumping to #order.
export default function Header({ pickProduct = false }) {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="logo" aria-label="Ankito home">
          <Image
            src="/images/logo-wordmark.png"
            alt="Ankito"
            width={525}
            height={299}
            priority
            style={{ height: 48, width: "auto" }}
          />
        </Link>
        <nav className="nav-links" aria-label="Main">
          <Link href="/#products" className="nav-link">
            Shop
          </Link>
          {pickProduct ? (
            <OrderNowButton />
          ) : (
            <a href="#order" className="cta">
              Order Now
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
