# Kushwaha Sangh — Website

A Vite + React site for the Sangh: committee, welfare programs (girls' hostel,
health assistance, achievers' wall), membership, donations, gallery, news and
contact — all in English.

## Run it locally

```bash
npm install
npm run dev       # dev server, usually http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## What's real vs. placeholder

Everything works and looks finished, but a lot of the *content* is a
placeholder you need to swap out before this goes live:

- **`src/data/content.js`** — the single file holding almost all editable
  text: org name/address/phone, committee names, stats, news items,
  achievers, transparency figures, donation details. Start here.
- **Photos** — every photo spot (committee, hostel, gallery) is a labelled
  dashed-border placeholder box, not a real image. Drop real photos in
  `src/assets/` and swap them in once the Sangh shares them.
- **Forms** (health assistance request, membership application, contact
  enquiry) are fully working *in the browser* — validation and a success
  state — but nothing is actually saved or emailed anywhere yet. To make
  them real, wire each `onSubmit` to either:
  - Supabase (database + optional auth), or
  - a simple email-forwarding service (e.g. Formspree, Resend).
- **Donations** currently show a UPI ID and bank details only. A card/UPI
  checkout via Razorpay or Cashfree can be added once the Sangh completes
  KYC (PAN + current account in the org's name).
- **Admin panel** was intentionally left out of this pass — it needs real
  authentication and a database, not just frontend pages, so it's worth
  doing as its own follow-up (Supabase Auth is a natural fit given the
  stack already in use on other projects).

## Deploying

Push this to a GitHub repo and import it into Vercel — it's a standard
Vite app, so no special build settings are needed. Free tier covers this
comfortably; only the domain (~₹800–1,500/year) needs to be bought
separately.

**Note on the GitHub token shared earlier:** treat it as compromised since
it was pasted in chat — revoke it from GitHub → Settings → Developer
settings → Personal access tokens, and generate a fresh one (short expiry,
scoped to just this repo) if you want it pushed for you, or push it
yourself from your machine.

## Design notes

Palette: deep maroon `#6E1423`, saffron `#E8821C`, antique gold `#C0973B`,
warm cream `#FBF1DD`. Type: Eczar (headings), Hind (body) — both ship with
Devanagari support already, so a Hindi version later is mostly a
translation exercise, not a font change. The recurring bordered "plaque"
card (used for stats, committee members and achievers) is the signature
element — a nod to registry ledgers and felicitation plaques.
