// Server-side proxy that forwards order data to the Google Apps Script web app.
// The Apps Script URL stays on the server (in APPS_SCRIPT_URL env var) and is
// never exposed to the browser. This also lets us return a real success/error
// JSON response instead of relying on no-cors mode.

import { normalizeBDPhone, validateOrder } from "../../validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  // Stamp timestamp on the server too — trust this over client clock.
  const enriched = {
    ...payload,
    phone: normalizeBDPhone(payload.phone),
    timestamp: new Date().toISOString(),
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
    return Response.json({ ok: true });
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
