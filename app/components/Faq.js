import { FAQ } from "../site";

export default function Faq() {
  if (!FAQ.length) return null;
  return (
    <section className="faq-section">
      <div className="container container-narrow">
        <h2>Frequently asked questions</h2>
        <div className="faq">
          {FAQ.map((item, i) => (
            <details key={item.q} open={i === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
