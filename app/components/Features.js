// Renders the per-product "Why customers love it" section.
// Each product in products.js declares its own `features` array; this
// component just looks each feature's `icon` up in the registry below.

const ICONS = {
  plus: <path d="M12 3v18M3 12h18" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  wave: <path d="M3 12h4l3-9 4 18 3-9h4" />,
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9h5v5a7 7 0 0 1-7 7Z" />
      <path d="M4 20l8-8" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4L12 3Z" />
      <path d="M19 15l.7 1.8L22 18l-2.3.5L19 21l-.7-2.5L16 18l2.3-1L19 15Z" />
    </>
  ),
  recycle: (
    <>
      <path d="M7 19l-3-3 3-3" />
      <path d="M17 5l3 3-3 3" />
      <path d="M4 16h12a4 4 0 0 0 4-4" />
      <path d="M20 8H8a4 4 0 0 0-4 4" />
    </>
  ),
  shield: <path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4Z" />,
  paw: (
    <>
      <circle cx="6.5" cy="10" r="1.7" />
      <circle cx="10" cy="6" r="1.7" />
      <circle cx="14" cy="6" r="1.7" />
      <circle cx="17.5" cy="10" r="1.7" />
      <path d="M12 12c-2.5 0-5 3-5 5.2 0 1.6 1.3 2.3 2.7 2.3 1 0 1.6-.5 2.3-.5s1.3.5 2.3.5c1.4 0 2.7-.7 2.7-2.3C17 15 14.5 12 12 12Z" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 9.4V4M12 20v-5.4M9.4 12H4M20 12h-5.4M10.2 10.2 6.3 6.3M17.7 17.7l-3.9-3.9M13.8 10.2l3.9-3.9M6.3 17.7l3.9-3.9" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="9" width="18" height="11" rx="1" />
      <path d="M3 13h18M12 9v11M8 9c-1.5-1.5-1.5-4 0-5 1.5 0 4 1 4 5M16 9c1.5-1.5 1.5-4 0-5-1.5 0-4 1-4 5" />
    </>
  ),
};

function FeatureIcon({ name }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}

export default function Features({ product }) {
  const features = product?.features || [];
  if (features.length === 0) return null;

  return (
    <section>
      <div className="container">
        <h2>Why customers love it</h2>
        <div className="features">
          {features.map((f) => (
            <div className="feature" key={f.title}>
              <span className="feature-icon"><FeatureIcon name={f.icon} /></span>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}