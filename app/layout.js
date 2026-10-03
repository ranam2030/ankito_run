import "./globals.css";
import { SITE } from "./site";
import Analytics from "./components/Analytics";
import WhatsAppButton from "./components/WhatsAppButton";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_BD",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/images/product-1.png", alt: "Ankito handcrafted products" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}
