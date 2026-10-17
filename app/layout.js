import { DM_Sans, DM_Serif_Display, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { SITE } from "./site";
import Analytics from "./components/Analytics";
import WhatsAppButton from "./components/WhatsAppButton";

// Serif headings to match the brand artwork, a clean sans for body text, and
// a Bangla font so the ৳ sign and Bangla copy render properly everywhere.
const serif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-serif", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const bangla = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

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
    <html lang="en" className={`${serif.variable} ${sans.variable} ${bangla.variable}`}>
      <body>
        {children}
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}
