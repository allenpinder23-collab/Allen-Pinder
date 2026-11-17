# ISLAND GIRL HANDOFF — Context from past Claude chats

Companion to CLAUDE.md. Built from past chats and saved notes, Nov 2026. No bank or personal financial data is in this file.

---

## 1. Where the business stands
- Island Girl Bahamian Cuisine is a family catering business in Columbus, OH that sells through its website, catering and events, and DoorDash.
- Plan changed over time: food truck vs ghost kitchen (ghost kitchen chosen Oct 2026), then Nov 2026 the family got a real restaurant space instead. Rent is $700/month. Orders will be placed online or at the counter and picked up there. DoorDash continues but we want less dependence on it.
- Planned hours Mon–Sat 11am–8pm. Sales goal $15,000/month (raised from $10K). Budget under $50K.
- Disagreement still open: mom wants festivals and street parking (needs a truck). Allen prefers catering, delivery apps, and a fixed location. Do not push a truck unless Allen says so.
- Mom does most day-to-day work. Allen is helping with strategy, systems, and analysis.
- Website bahamiancusine.com has the real menu and prices. [confirm which platform it is built on]

## 2. Past work to reuse
### Flyer (June 2026)
- Print-ready vendor table flyer for the "Color of Summer" event. Navy/gold/teal, Playfair Display + Jost, menu on one side, credentials as trust-builders, scannable QR code to bahamiancusine.com, Instagram handle in the bottom band. No prices listed (Allen's preference). Founder title (not "Owner & Chef") per the founder's feedback.
- Technical lesson: HTML rendered with wkhtmltopdf at 1275x1650px (8.5x11 at 150 dpi) with --page-width 1275px --page-height 1650px --disable-smart-shrinking --dpi 150. Inch-based sizes produced two pages.

### Pricing analysis: "Pricing the Plate" (BIA 2200 class project, Nov 2026)
- Business question: which menu items make money after DoorDash's cut, and what should each cost to hit a 35% profit target.
- Findings on the real menu (15 items): every item makes money after DoorDash; 3 of 15 miss 35% (whole red snapper, conch salad small, conch salad large), all seafood; oxtails borderline at about 36%; best sellers are also best earners; dinners are about 85% of sales; jerk chicken sells the most.
- Example economics: jerk chicken dinner sells for $29 and costs about $4.90 with sides and container, keeping about $16.85 (58%) after a 25% DoorDash fee. Small conch salad sells for $20 and costs about $10.10, keeping about $4.90 (25%).
- IMPORTANT: order volumes in the deck are SAMPLE DATA and most plate costs are ESTIMATES. Only jerk chicken's cost (about $4) was confirmed. Treat every deck number as a hypothesis until real DoorDash reports and receipts replace it. Estimated item costs used: curry chicken $4.20, BBQ chicken $3.90, fried shrimp $8.50, curry shrimp $9.00, cracked conch $13.50, oxtails $16.50, whole red snapper $19.50, conch salad small/large $9.50/$15.00, cake slice $0.90, duff (2 slices) $2.00.
- Deck recommendations (written when the plan was ghost kitchen; most still apply and some are now stronger):
  1. Fix the three weak items: buy conch in bulk first, then raise prices where still short (deck suggested about $51 for snapper and about $26 and $39 for conch salads, based on estimated costs; re-check with real costs).
  2. Add a smaller lunch plate (about $16) for 11am–3pm. Costs about $4 to make, keeps about 70% on pickup.
  3. Offer a cake slice with every order (about $6 add-on). Desserts keep the most of any item. One slice on 1 in 10 orders is worth about $1,300/year.
  4. Add drinks (bottled Caribbean sodas or house sorrel at $3 to $4). The menu has none.
  5. Price DoorDash higher than in-store (many restaurants add about 15% to cover the fee). Check the DoorDash agreement first.
  6. Send regulars to direct ordering. DoorDash's own direct ordering tool is reported to charge 0% commission (verify), and website orders pay only card fees. Put the order link/QR on the door, bags, and receipts.
  7. Watch oxtail cost monthly; a 60 cent rise per plate pushes it under target.
- Open data gap: meal-format preference (build-your-plate vs a la carte vs full meals). Two studies (Sharpe & Staelin 2010; Lee, Weaver & Garcia 2016) suggest bundled meals produce larger orders. The real menu sells dinners only, so there is no sales data to compare yet.

### DoorDash facts used
- Commission tiers: 15% Basic, 25% Plus, 30% Premier; pickup orders 6% (source: merchants.doordash.com/en-us/products/pricing; verify current terms).
- Assumed plan: Plus (25%). Confirm from the merchant portal.

## 3. What changes with the restaurant (new priorities)
1. Direct ordering is now the main goal. Needs: online order page, pickup time slots, kitchen order alerts, payment through an established processor, order confirmation texts/emails.
2. Counter and walk-in sales need a simple POS and daily sales log.
3. Separate every sales number by channel so we can see how fast we reduce DoorDash dependence (target to set with Allen).
4. Rent is now a fixed cost: $700/month. Track daily sales against what is needed to cover rent, food, labor, and supplies. Labor and utilities are not yet in the numbers. [ask Allen for them]
5. Lunch plate, drinks, and dessert add-ons become much easier with a counter and online menu.
6. Catering stays as a channel; build a lead-to-quote-to-deposit pipeline.

## 4. Open questions for Allen (answer once, then record in CLAUDE.md)
- Known stack: GHL hosts the website, funnels, and marketing campaigns. GoDaddy hosts the domain and email and processes most catering payments.
- Does the restaurant have a GoDaddy Smart Terminal and the Point of Sale Plus plan? (Needed for GoDaddy's pickup Online Ordering page.)
- Do restaurant counter sales and pickup orders also run through GoDaddy Payments?
- Real plate costs and 12 months of DoorDash item and payout reports (CSV) to replace the sample data.
- Utilities, labor, and licensing/permit status for the new space.
- Exact opening date.

## 5. How Allen wants work done
- Direct and brief. Paste-ready, finished outputs. Targeted fixes, not rebuilds. Tell him when something is financially weak.
- Don't ask questions that can be looked up.

## 6. Files to bring into this folder
Files do not persist between chat sessions. Re-download what still exists from the original chats, or have Claude rebuild.
- Flyer: Island-Girl-Bahamian-Cuisine-Vendor-Flyer.pdf and .png (and the HTML source if available)
- Pricing deck "Pricing the Plate" and the sample_orders.csv
- The pricing analysis Word report
- Any DoorDash exports and receipts you collect (into /03_Sales_Data/ and /07_Finance/)
