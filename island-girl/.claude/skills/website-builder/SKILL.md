---
name: website-builder
description: Expert website design and build for Allen's GoHighLevel sites. Use for new pages, funnels, site revamps, landing pages, custom HTML sections, mobile layout, speed, forms, booking and ordering flows, or any request to design or fix a website.
---

# Website Builder

Read the business's CLAUDE.md first for brand colors, offers, tone and compliance rules. Claude drafts and prepares; Allen approves before anything goes live. Never change DNS or email records. Never publish without approval.

## Process
1. **Brief.** Goal of the page, who it is for, the one action visitors should take (book a call, order pickup, request catering), and what proof exists. If the answer is in CLAUDE.md or HANDOFF.md, use it instead of asking.
2. **Structure first.** Sitemap and section order before any design. Every page: clear headline, one primary button, proof, FAQ or objections, repeat the button, footer with contact details.
3. **Design.** Follow the `frontend-design` skill for distinctive, non-template visual choices. Stay inside the brand: Island Girl navy, gold and teal; PPG brand per its CLAUDE.md. Mobile first, because most visitors are on phones. Large tap targets, readable text (16px or more), strong contrast.
4. **Build as a preview.** Make the page as a single self-contained HTML file Allen can open and approve. Then prepare the GHL version.
5. **Test.** Check at phone, tablet and desktop widths. Check forms and buttons go where intended. Run a speed check and the `seo-optimizer` checklist before handoff.
6. **Handoff.** Give Allen exact steps to place it in GHL (which element, which page, what to paste), plus a rollback note (what the page looked like before).

## GoHighLevel build rules (hard constraints)
- GHL strips CSS variables. Use hex colors and inline styles.
- The Custom Code / HTML element takes body-only HTML. No html, head or body tags. Do not use the Tracking Code box for page content.
- Prefer native GHL elements for forms, calendars, buttons and payment so submissions flow into the CRM, pipelines and automations. Use custom HTML only for layout and visuals.
- Keep every form tied to the right workflow (tags, pipeline stage, follow-up). Name the workflow in the handoff.
- Embed the GHL calendar for booking. Embed GHL forms, never homemade forms that bypass the CRM.
- Websites hold the main pages; funnels hold single-purpose conversion paths. Avoid duplicating the same content in both.
- Do not change existing URL slugs on live pages without a redirect plan.
- Test in the real published page, not just the editor preview.

## Speed
- Compress images (WebP, sized to display). Lazy-load below the fold. Avoid heavy sliders, autoplay video and many web fonts (two at most).
- Targets: LCP 2.5s or less, INP 200ms or less, CLS 0.1 or less. Reserve image space to prevent layout shift.

## Accessibility and trust
- Alt text on images, labeled form fields, keyboard focusable buttons, color contrast that passes.
- Real contact details, privacy policy and terms linked in the footer. Real photos beat stock.

## Business-specific
**PPG:** Use "financial education" and "financial profile optimization". No promises of score changes, deletions or timelines. Disclaimers where results are mentioned. Run copy past the compliance-officer agent. Primary conversion is the $150 strategy session booking. The homebuyer reimbursement comes from the realtor partner at closing.

**Island Girl:** Primary conversions are pickup orders and catering requests. Menu, prices and hours must match Google Business Profile, DoorDash and social. Check GoDaddy Payments Online Ordering before building ordering, because catering payments already run through GoDaddy. Phone-friendly pages first: many visitors will be on mobile.

## Deliverables
HTML preview file, a short build sheet (sections, copy, where each GHL element goes), SEO fields (title, description, slug, schema), and a pre-launch checklist. Save under the business's website folder (PPG: /03_Website_Funnels, Island Girl: /06_Marketing_Web).
