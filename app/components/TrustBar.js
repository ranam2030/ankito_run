// Delivery and payment promises, shown as a strip on the homepage and as a
// compact row under the Order button on product pages.

const ITEMS = [
  {
    id: "delivery",
    title: "All over Bangladesh",
    text: "৳60 in Dhaka, ৳130 outside",
    icon: (
      <>
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </>
    ),
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    text: "Pay when it arrives",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 9.5v5M18 9.5v5" />
      </>
    ),
  },
  {
    id: "ships",
    title: "Ships in 1–2 days",
    text: "Packed with care",
    icon: (
      <>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
      </>
    ),
  },
  {
    id: "support",
    title: "WhatsApp support",
    text: "Ask us anything",
    icon: <path d="M4 5h16v11H9l-5 4V5Z" />,
  },
];

export default function TrustBar({ compact = false }) {
  const items = compact ? ITEMS.filter((i) => i.id !== "support") : ITEMS;
  return (
    <ul className={`trust${compact ? " trust-compact" : ""}`}>
      {items.map((item) => (
        <li key={item.id}>
          <span className="trust-icon" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {item.icon}
            </svg>
          </span>
          <span>
            <strong>{item.title}</strong>
            {!compact && <small>{item.text}</small>}
          </span>
        </li>
      ))}
    </ul>
  );
}
