import "./globals.css";

export const metadata = {
  title: "Wooden Magnetic Door Bell — Ankito",
  description:
    "Handcrafted wooden door bell with brass chime. Soothing natural sound — no batteries, no wires. Cash on Delivery across Bangladesh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
