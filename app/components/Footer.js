import Image from "next/image";
import Link from "next/link";
import { SITE, whatsappLink } from "../site";
import { WhatsAppIcon } from "./WhatsAppButton";

export default function Footer() {
  const year = new Date().getFullYear();
  const wa = whatsappLink();
  const contacts = [
    wa && { label: "Chat on WhatsApp", icon: <WhatsAppIcon size={18} />, href: wa, external: true },
    SITE.phone && { label: `Call ${SITE.phone}`, href: `tel:${SITE.phone}` },
    SITE.messengerUrl && { label: "Messenger", href: SITE.messengerUrl, external: true },
    SITE.email && { label: SITE.email, href: `mailto:${SITE.email}` },
    SITE.facebookUrl && { label: "Facebook", href: SITE.facebookUrl, external: true },
    SITE.instagramUrl && { label: "Instagram", href: SITE.instagramUrl, external: true },
  ].filter(Boolean);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="Ankito home">
            <Image src="/images/logo-wordmark.png" alt="Ankito" width={525} height={299} style={{ height: 40, width: "auto" }} />
          </Link>
          <p className="footer-tagline" lang="bn">{SITE.taglineBn}</p>
          <p>{SITE.description}</p>
        </div>

        {contacts.length > 0 && (
          <div>
            <h3 className="footer-heading">Get in touch</h3>
            <ul className="footer-links" aria-label="Contact us">
              {contacts.map((c) => (
                <li key={c.href}>
                  <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {c.icon}
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="footer-heading">Shop with confidence</h3>
          <ul className="footer-links">
            <li>Delivery all over Bangladesh</li>
            <li>৳60 inside Dhaka · ৳130 outside</li>
            <li>Cash on Delivery</li>
            <li>Ships in 1–2 days</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">© {year} Ankito — All rights reserved.</div>
    </footer>
  );
}
