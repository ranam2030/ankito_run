// Fire a conversion event to Facebook Pixel and GA4, whichever are loaded.
// fbEvent uses Pixel standard event names (Purchase, InitiateCheckout, ...);
// gaEvent uses GA4 recommended names (purchase, begin_checkout, ...).
export function trackEvent(fbEvent, gaEvent, params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", fbEvent, params);
    window.gtag?.("event", gaEvent, params);
  } catch {
    // Tracking must never break the store.
  }
}
