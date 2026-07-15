export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div>© {year} Ankito — All rights reserved.</div>
      <div style={{ marginTop: "6px" }}>
        Need help? Call <a href="tel:+8801XXXXXXXXX">+880 1XXX-XXXXXX</a>
      </div>
    </footer>
  );
}
