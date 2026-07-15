# Ankito Store — Next.js

A single-product landing page for the **Wooden Magnetic Door Bell**. Orders are submitted to a Google Sheet through a Google Apps Script web app via a server-side API route.

## Stack

- Next.js 14 (App Router, JavaScript)
- React 18
- `next/image` for optimised product photos
- Server route `/api/orders` proxies to Google Apps Script (URL stays on the server)

## Project layout

```
ankito-nextjs/
├── app/
│   ├── api/orders/route.js     ← server proxy → Apps Script
│   ├── components/
│   │   ├── Header.js
│   │   ├── ProductGallery.js   (client)
│   │   ├── HeroDetails.js
│   │   ├── Features.js
│   │   ├── Lifestyle.js
│   │   ├── OrderForm.js        (client)
│   │   ├── SuccessModal.js     (client)
│   │   └── Footer.js
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   └── product.js              ← single source of truth for product data
├── public/images/              ← put product-1.png, product-2.jpg, product-3.webp here
├── .env.local.example
├── jsconfig.json
├── next.config.js
└── package.json
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Add product images.** Drop these three files into `public/images/`:

   - `product-1.png`
   - `product-2.jpg`
   - `product-3.webp`

   If you want different filenames or extensions, edit `app/product.js` — that's the single place all components read from.

3. **Configure the Apps Script URL.**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and set `APPS_SCRIPT_URL` to your deployed Google Apps Script web app URL. The same Apps Script code from the original HTML version still works unchanged.

4. **Run in development**

   ```bash
   npm run dev
   ```

   Open <http://localhost:3000>.

5. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Deploying

- **Vercel** (easiest): `vercel`. Add `APPS_SCRIPT_URL` in Project Settings → Environment Variables.
- **Netlify**, **Cloudflare Pages**, **Render**: any host that supports Next.js will work. Set the same env var in the host's dashboard.

## Editing prices, copy, or images

Almost everything you'll want to tweak lives in **`app/product.js`**:

```js
export const PRODUCT = {
  name: "...",
  price: 499,
  oldPrice: 690,
  images: [...],
  ...
};
```

Change a value there, save, and every component updates.

## How orders flow

1. User submits the form in `OrderForm.js`.
2. Browser POSTs JSON to `/api/orders`.
3. `app/api/orders/route.js` validates, stamps a server timestamp, and forwards to the Apps Script URL from env.
4. Apps Script appends a row to your Google Sheet and returns `{ ok: true }`.
5. The form shows the success modal.

If Apps Script returns an error, the form shows a real error message instead of the silent failure you'd get with the no-cors approach.
