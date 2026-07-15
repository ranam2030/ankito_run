export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div>© {year} Ankito — All rights reserved.</div>
    </footer>
  );
}
