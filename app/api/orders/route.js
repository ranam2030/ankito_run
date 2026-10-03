// Server-side proxy that forwards order data to the Google Apps Script web app.
// The Apps Script URL stays on the server (in APPS_SCRIPT_URL env var) and is
// never exposed to the browser. This also lets us return a real success/error
// JSON response instead of relying on no-cors mode.

import { normalizeBDPhone, validateOrder } from "../../validation";
import { getProduct } from "../../products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In-memory spam guards. They live per server instance, which is enough to
// stop double submits and casual flooding; they reset on restart/redeploy.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_PER_IP = 5;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const recentByIp = new Map(); // ip -> [timestamps]
const recentOrders = new Map(); // phone|product|options -> { orderId, at }

function prune(now) {
  for (const [ip, times] of recentByIp) {
    const kept = times.filter((t) => now - t < RATE_WINDOW_MS);
    if (kept.length) recentByIp.set(ip, kept);
    else recentByIp.delete(ip);
  }
  for (const [key, o] of recentOrders) {
    if (now - o.at >= DUPLICATE_WINDOW_MS) recentOrders.delete(key);
  }
}

function clientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Short reference customers can quote on the phone, e.g. ANK-250314-7KQ2.
function makeOrderId(now) {
  const d = new Date(now);
  const ymd = [d.getUTCFullYear() % 100, d.getUTCMonth() + 1, d.getUTCDate()]
    .map((n) => String(n).padStart(2, "0"))
    .join("");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  let rand = "";
  for (let i = 0; i < 4; i++) rand += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `ANK-${ymd}-${rand}`;
}

// Rebuild options and prices from the catalogue so a tampered request
// can't change what the customer is charged.
function priceOrder(product, requestedOptions, quantity) {
  const requested = {};
  for (const o of Array.isArray(requestedOptions) ? requestedOptions : []) {
    if (o && o.optionId) requested[o.optionId] = o.valueId;
  }
  let unitPrice = product.price;
  const options = [];
  for (const opt of product.options || []) {
    const v =
      opt.values.find((x) => x.id === requested[opt.id]) || opt.values[0];
    unitPrice += v.priceAdjust || 0;
    options.push({ optionId: opt.id, optionLabel: opt.label, valueId: v.id, valueName: v.name });
  }
  return { unitPrice, total: unitPrice * quantity, options };
}

export async function POST(request) {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    return Response.json(
      { ok: false, error: "APPS_SCRIPT_URL is not configured on the server." },
      { status: 500 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const fieldErrors = validateOrder(payload);
  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      { ok: false, error: "Invalid order details.", fieldErrors },
      { status: 400 }
    );
  }
  const quantity = Number(payload.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return Response.json({ ok: false, error: "Invalid quantity." }, { status: 400 });
  }
  const product = getProduct(payload.productSlug);
  if (!product) {
    return Response.json({ ok: false, error: "Unknown product." }, { status: 400 });
  }

  // Honeypot: the "website" field is hidden from people, so only bots fill it.
  // Pretend success so they don't retry.
  if (payload.website) {
    return Response.json({ ok: true, orderId: makeOrderId(Date.now()) });
  }

  const now = Date.now();
  prune(now);
  const phone = normalizeBDPhone(payload.phone);
  const priced = priceOrder(product, payload.options, quantity);

  // Same order resubmitted (double tap, refresh): return the original order.
  const dupKey = [phone, product.slug, priced.options.map((o) => o.valueId).join(","), quantity].join("|");
  const dup = recentOrders.get(dupKey);
  if (dup) {
    return Response.json({ ok: true, orderId: dup.orderId, duplicate: true });
  }

  const ip = clientIp(request);
  const hits = recentByIp.get(ip) || [];
  if (hits.length >= RATE_MAX_PER_IP) {
    return Response.json(
      { ok: false, error: "Too many orders in a short time. Please wait a few minutes or contact us on WhatsApp." },
      { status: 429 }
    );
  }

  const orderId = makeOrderId(now);
  const { website, ...clean } = payload;
  const enriched = {
    ...clean,
    orderId,
    product: product.fullProductString,
    productSlug: product.slug,
    options: priced.options,
    phone,
    quantity,
    unitPrice: priced.unitPrice,
    total: priced.total,
    currency: product.currency,
    // Stamp timestamp on the server too — trust this over client clock.
    timestamp: new Date(now).toISOString(),
  };

  try {
    const upstream = await fetch(url, {
      method: "POST",
      // text/plain avoids the CORS preflight that Apps Script web apps reject.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(enriched),
      // Apps Script can be slow on cold start.
      cache: "no-store",
    });

    const text = await upstream.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      // Apps Script returned non-JSON — treat as success if HTTP was OK.
      data = { ok: upstream.ok, raw: text };
    }

    if (!upstream.ok || data.ok === false) {
      return Response.json(
        { ok: false, error: data.error || `Upstream HTTP ${upstream.status}` },
        { status: 502 }
      );
    }
    // Count only orders that actually reached the sheet.
    recentByIp.set(ip, [...hits, now]);
    recentOrders.set(dupKey, { orderId, at: now });
    return Response.json({ ok: true, orderId, total: priced.total });
  } catch (err) {
    return Response.json(
      { ok: false, error: err?.message || String(err) },
      { status: 502 }
    );
  }
}

export async function GET() {
  return Response.json({ ok: true, message: "Orders endpoint. POST to submit an order." });
}
