import Image from "next/image";
import Link from "next/link";
import OrderNowButton from "./OrderNowButton";

// pickProduct: on pages without an order form (the homepage), "Order Now"
// opens a product picker instead of jumping to #order.
export default function Header({ pickProduct = false }) {
  return (
    <header>
      <div className="container nav">
        <Link href="/" className="logo" aria-label="Ankito home">
          <Image
            src="/images/logo.jpg"
            alt="Ankito"
            width={140}
            height={44}
            priority
            style={{ height: 44, width: "auto" }}
          />
        </Link>
        {pickProduct ? (
          <OrderNowButton />
        ) : (
          <a href="#order" className="cta">
            Order Now
          </a>
        )}
      </div>
    </header>
  );
}
