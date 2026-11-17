# Margea Travel

Master Prompt for Lovable — Margea Direct Bookings Website
Project: Build a bilingual (ES/EN) website for Margea — a Riviera Maya/Cancún travel & property management brand — that supports direct tour bookings and direct lodging bookings with online payments, automated confirmations, and owner/admin dashboards.
1) Brand & Goals
Brand: Margea (travel agency + vacation rental management in Cancún/Riviera Maya).
Tone: professional, trustworthy, concierge-level service; short, clear copy.
Objectives:
Let guests book tours/activities directly.
Let guests book stays (Margea-managed properties) directly with real-time availability and payment.
Capture leads from owners and travelers.
Rank for local intent SEO (Cancún, Playa del Carmen, Tulum, Riviera Maya).
2) Architecture / Pages
Home: hero (search bar for “Where to?” + dates + guests), featured tours, featured stays, trust badges, reviews, WhatsApp CTA.
Stays (collection): filter by location, bedroom count, price, amenities; map view; cards with thumbnail, price/night, rating; pagination.
Stay Detail: photo gallery, description, amenities, dynamic calendar, seasonal pricing (High: Dec–Mar; Medium: Oct–Nov & Apr–Jun; Low: Jul–Sep), fees & taxes, live availability, “Book Now” with checkout.
Tours & Activities (collection): filter by category (e.g., Chichén Itzá, cenotes, catamaran, whale shark seasonal, Xcaret, theme parks, private driver, airport transfer).
Tour Detail: photos, itinerary, duration, inclusions/exclusions, pickup notes, availability calendar, per-person pricing tiers, upsells (photo package, private guide), “Book Now.”
Airport Transfers: simple booking flow (one-way/round-trip, pax, date/time, hotel).
About / Why Margea: brand story, team, licenses, safety, response times.
Owner Portal / List Your Property: lead form for property owners; explain 15% low-season / 20% high-season commission structure and monthly owner reports (Gamma presentations).
Reviews: carousel + embedded Google/Tripadvisor proof.
Blog / Guides: SEO posts (best beaches, cenotes, safety tips, dining).
Contact: WhatsApp deep link, phone, email, form with reason selector.
Legal: Terms & Conditions, Privacy Policy, Cookie Policy, Cancellation & Refund Policy.
3) Booking & Payments (must-have)
Payments: Stripe (USD & MXN), Apple Pay/Google Pay; issue invoices/receipts automatically.
Currencies: user-selectable USD/MXN; store default = MXN; show tax breakdown.
Checkout: guest info, dates, headcount, add-ons, coupon code, deposit vs pay-in-full, e-signature for terms and cancellation.
Emails: confirmation, pre-arrival instructions, balance reminders, review request.
Abandoned Checkout: capture email/phone and send reminder.
Discounts: coupon engine (code, %/fixed, date windows, min nights, tour bundle).
Security Holds: configurable damage deposit/hold for stays.
4) Lodging Engine Requirements
Calendar & Availability: iCal import/export to sync with Airbnb/VRBO; avoid double bookings.
Rates: seasonal (per above), weekend/weekday multipliers, min/max nights, length-of-stay discounts, cleaning fee separate line item passed through to owner.
Fees & Taxes: Mexico lodging taxes; service fee; transparent line items.
Content blocks: house rules, check-in/out times, cancellation policy presets (Flexible/Moderate/Strict).
Owner Payout Logic (admin only): net payout report by booking (gross – fees – cleaning).
5) Tours Engine Requirements
Inventory: fixed capacity per time slot, black-out dates, lead time rules.
Pricing: adult/child tiers, private vs shared, dynamic date pricing, upsells (transport, photo pkg).
Vendors: assign bookings to vendor partners; vendor confirmation email with guest manifest; vendor portal (read-only) optional.
Vouchers: generate QR/PNR code; PDF e-ticket sent via email + WhatsApp link.
6) CMS & Admin
CMS: Collections for Stays, Tours, Reviews, Blog, FAQs. Each with SEO fields (title, meta description, OG).
Admin Dashboard: bookings list (stays/tours), payments status, refunds, coupons, payout reports, calendar view by property, export CSV.
User Accounts: guests can log in to view bookings, download vouchers, change dates (policy-gated).
Owner Leads: save to CMS + email notification; Zapier webhook ready.
7) Integrations
Analytics: GA4, Meta Pixel, conversion events for “purchase,” “begin checkout,” “search,” “view content.”
Comms: WhatsApp click-to-chat; transactional email via SendGrid/Stripe.
Maps: Map with property/tour markers; distance to POIs.
Schema Markup: LodgingBusiness, TouristAttraction, Product, FAQPage, LocalBusiness with NAP for Cancún.
Speed: Optimize images, lazy-load, Core Web Vitals ≥ 90.
8) UX/UI & Components
Design: clean, modern, mobile-first; sticky booking CTA on detail pages; trust badges; review stars; ribbons for “New/Popular/Last-minute.”
Navigation: clear ES/EN language toggle; currency toggle; mega-menu for Stays/Tours.
Search: global search with date picker and location/guests filters.
Forms: anti-spam, inline validation, reCAPTCHA.
9) Content to Pre-Seed (use placeholders I can replace)
Featured Stays (3): Oceanfront 2BR in Cancún Hotel Zone; 3BR Condo Playa del Carmen; Jungle Loft Tulum.
Featured Tours (6): Chichén Itzá + Cenote + Valladolid; Catamaran to Isla Mujeres; Xcaret Day Pass; Tulum & Cobá Ruins; Whale Shark (seasonal); Private Airport Transfer.
Copy cues:
ES: “Reserva directo con Margea y ahorra en comisiones. Atención 24/7, confirmación inmediata.”
EN: “Book direct with Margea and skip platform fees. 24/7 concierge. Instant confirmation.”
10) SEO & Performance
Technical SEO: clean URL slugs (/stays/cancun-oceanfront-2br), XML sitemap, robots.txt, canonical tags.
On-page: H1/H2 structure, internal links, FAQ accordions on stay/tour pages.
Blog templates with suggested topic list and sidebar CTAs.
11) Compliance & Policies
Cookie banner + preferences.
Privacy, Terms, Refund/Cancellation (tour vs lodging), Safety.
Accessibility: WCAG 2.1 AA basics (alt text, keyboard nav, contrast).
12) Acceptance Criteria
I can:
Create/edit stays and tours in CMS and they appear instantly.
Sync calendars via iCal.
Run a full test booking flow (stay + tour) with Stripe test keys in USD and MXN.
Receive confirmation emails and downloadable voucher/receipt.
See bookings and payouts in the dashboard and export CSV.
Toggle site language ES/EN and currency USD/MXN site-wide.
Pass Lighthouse ≥ 90 on Performance/SEO/Best Practices on mobile.
Deliverables: Complete responsive site with CMS, booking engines for stays and tours, Stripe integration, GA4/Pixel events, ES/EN content scaffolding, and seed data as specified.
Optional follow-up (paste after first build to refine)
“Import these iCal links into each property calendar: [paste iCal URLs].”
“Create coupon codes: DIRECT10 (10% stays, min 3 nights), BUNDLE5 (5% if tour + stay in cart).”
“Add WhatsApp CTAs to confirmation pages with deep link: wa.me/[number].”
“Preload 10 blog drafts using these titles and meta descriptions: [list].”

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://margea-direct-book.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3304ad54-4643-4d16-a593-d4ceb6bb8cb5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
