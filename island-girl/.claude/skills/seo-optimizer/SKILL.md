---
name: seo-optimizer
description: Expert SEO for Allen's GoHighLevel sites. Use for any SEO audit, keyword plan, page copy, meta titles/descriptions, schema, local SEO (Google Business Profile), blog content, or when a page needs to rank or be found by Google or AI search.
---

# SEO Optimizer

Read the business's CLAUDE.md first for brand, offers, location and compliance rules. SEO work is research and drafts only. Never publish, change DNS, or edit live pages without Allen's approval.

## Ground rules (verified Nov 2026)
- Google's May 2026 guidance on AI Overviews and AI Mode: they run on normal Search. Good SEO is the strategy. Do NOT add llms.txt, special "AI schema", content chunking, or chase fake brand mentions.
- Structured data is still used, for rich results and clear entity info. Mark up only what is visible on the page.
- Core Web Vitals (unchanged): LCP 2.5s or less, INP 200ms or less, CLS 0.1 or less, at the 75th percentile of real users.
- Content must be original, specific and useful. No keyword stuffing, no thin or duplicate pages.
- Look up current facts before stating them (Google docs, GHL help center). Label anything unverified.

## Workflow
1. **Goal and page map.** List every page, its one target query, and its one conversion action (book, call, order).
2. **Keyword research.** Use the Semrush connector if connected. Otherwise web search and Google autocomplete. Output: query, intent (learn / compare / buy / local), difficulty guess, target page. One main query per page.
3. **On-page, per page:**
   - Title tag under about 60 characters, query near the front, brand last.
   - Meta description about 150 characters, benefit plus action.
   - One H1 with the query. H2s answer real questions people ask. Short paragraphs.
   - Descriptive URL slug. Image alt text. Internal links to related pages with clear anchor text.
   - Direct answer near the top of the page, then detail. FAQ section only with real questions.
4. **Schema (JSON-LD).** Draft per page type: LocalBusiness or Restaurant (Island Girl), Organization or FinancialService plus FAQPage (PPG), Menu items, Article for blog. Validate in Google's Rich Results Test before Allen pastes it.
5. **Technical check.** Indexable, in sitemap, canonical set, mobile layout, compressed images (WebP, sized), no render-blocking bloat, HTTPS, working 404, no duplicate pages across funnel and site.
6. **Local SEO.** Google Business Profile complete (categories, hours, menu or services, photos, posts, Q&A), NAP identical everywhere (name, address, phone), reviews strategy (ask every happy customer, reply to all), local citations, city and neighborhood landing content that is genuinely useful.
7. **Content plan.** Monthly list: topic, query, page type, outline. Draft in Allen's voice, he approves before anything publishes.
8. **Measure.** Google Search Console (impressions, clicks, queries, indexing), GA4, GBP insights. Report 3 to 5 numbers monthly, labeled actual vs estimated.

## GoHighLevel specifics
- Per page: Settings (gear) > SEO tab for title and description. Also canonical, indexing toggle, and social preview image. Funnel steps need unique titles and descriptions.
- Sitemap is auto-generated at yourdomain.com/sitemap.xml. Submit it in Search Console once.
- Robots.txt is editable under Settings > Domains.
- Schema goes in the page or site Custom Code (head). Use the Custom Code element or header code box as GHL allows. GHL strips CSS variables, so use hex colors if styling anything.
- Changing a page URL or duplicating pages can create duplicates or lose ranking. Warn Allen before any slug change and plan a redirect.
- Funnels are for conversion, the website is for being found. Do not let funnel steps compete with site pages for the same query. Use canonical or noindex where needed.
- Never change DNS or email records. GoDaddy holds the domain and email; GHL hosts the site.

## Compliance (PPG)
- Use "financial education" and "financial profile optimization". Never promise score increases, deletions, timelines or approval. No guarantee language, no "credit repair" claims that conflict with CROA or FCRA.
- Testimonials and results need real substantiation and a disclaimer. Check with the compliance-officer agent before drafting service page copy.
- Homebuyer reimbursement ($650) comes from the realtor partner at closing. State it that way, with conditions.

## Compliance (Island Girl)
- Keep prices, hours and menu identical on the site, Google Business Profile, DoorDash and social. Do not publish allergen or health claims unless Allen confirms them.
- Check the DoorDash agreement before promoting direct ordering in a way that references DoorDash.

## Deliverable format
Audit or plan as a short doc: findings ranked by impact and effort, exact fix per item, owner (Claude drafts, Allen approves or pastes in GHL). Put it in the business folder under the marketing-director's reports folder.
