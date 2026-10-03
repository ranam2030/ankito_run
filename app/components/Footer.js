import { SITE, whatsappLink } from "../site";
import { WhatsAppIcon } from "./WhatsAppButton";

export default function Footer() {
  const year = new Date().getFullYear();
  const wa = whatsappLink();
  const contacts = [
    SITE.phone && { label: `Call ${SITE.phone}`, href: `tel:${SITE.phone}` },
    wa && { label: "Chat on WhatsApp", icon: <WhatsAppIcon size={24} />, href: wa, external: true },
    SITE.messengerUrl && { label: "Messenger", href: SITE.messengerUrl, external: true },
    SITE.email && { label: SITE.email, href: `mailto:${SITE.email}` },
    SITE.facebookUrl && { label: "Facebook", href: SITE.facebookUrl, external: true },
    SITE.instagramUrl && { label: "Instagram", href: SITE.instagramUrl, external: true },
  ].filter(Boolean);

  return (
    <footer>
      {contacts.length > 0 && (
        <nav className="footer-links" aria-label="Contact us">
          {contacts.map((c) => (
            <a
              key={c.href}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...(c.icon ? { "aria-label": c.label, title: c.label, className: "footer-icon" } : {})}
            >
              {c.icon || c.label}
            </a>
          ))}
        </nav>
      )}
      <div>© {year} Ankito — All rights reserved.</div>
    </footer>
  );
}
