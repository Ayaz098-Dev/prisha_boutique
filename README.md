
# Prisha Boutique — React + Tailwind CSS

A responsive boutique storefront concept built with React, Vite and Tailwind CSS.

## Included
- Responsive luxury-inspired layout
- Product cards with price, product features, quantity controls and add-to-bag
- Category filters, search and price sorting
- Product quick-view with size selection
- Shopping bag drawer with quantity editing and removal
- WhatsApp order enquiry link populated from the cart
- Click-to-call and Google Maps directions
- Accessible button labels, lazy-loaded images and reduced-motion support

## Run locally
Requires Node.js 18 or later.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Before publishing
1. Replace demo product names, descriptions, prices, sizes and image URLs with the boutique's real inventory and licensed product photography.
2. Confirm stock and delivery policy. The current checkout is a WhatsApp enquiry flow; it does not take online payments or reserve stock.
3. Add real social media links, store hours, return policy and privacy policy.
4. Test WhatsApp, phone, maps, mobile layout and all product photos on the final hosting domain.

## Structure
```text
prisha-boutique/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx
    ├── data/
    │   └── products.js
    ├── main.jsx
    └── styles.css
```
