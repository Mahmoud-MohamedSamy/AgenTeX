# TAVI Desk: missing and partly built features vs Zoho Desk

2 Nov 2026 · 36 features (16 missing, 20 partly built) out of 131 in the go-live inventory. Includes the Wave 1 findings.

## Organisation

- **O-03 Business hours (24x7 / custom, several sets, multi-block days)** (Partly, P0) — Zoho: Several business-hours sets, several time blocks in one day, and blocks that run past midnight. TAVI: Sets and two blocks per day work. A block past midnight is refused: "slots cannot cross midnight" (Wave 1, W1-10). Plane: NDC-1952, NDC-2266.
- **O-07 Gamescope (agent gamification)** (Missing, P2) — Zoho: Gamescope: points, levels and badges that reward agents for their work. TAVI: No Gamescope page or API. Plane: NDC-2760.
- **O-08 Multi-brand / custom portal domain** (Partly, P2) — Zoho: Several brands, each with its own help center, and a custom portal domain. TAVI: One help center on a staging-crm path. Multi-brand and custom domain are being built (NDC-1992). Plane: NDC-1992.

## Access

- **A-08 Agent sign-in security: SSO/SAML, 2FA, allowed IPs, session policy** (Missing, P1) — Zoho: Agent sign-in security: SAML single sign-on, two-factor sign-in, allowed IP ranges, password policy. TAVI: No such page in Desk settings (Wave 1, W1-54). Filed as NDC-1977. Plane: NDC-1977, NDC-2760.
- **A-11 Privacy: data subject requests, read receipts, attachment controls** (Missing, P1) — Zoho: Privacy settings: data subject requests (export or erase a person's data) and attachment rules per department (file types, size). TAVI: Only Data Retention and legal hold. No data-subject-request flow, no attachment controls. Plane: NDC-2760.

## Tickets

- **T-08 Reply drafts saved on the server** (Partly, P1) — Zoho: Reply drafts saved on the server, so they follow the agent to another browser or device. TAVI: Drafts are kept only in the current browser (NDC-2644). Plane: NDC-2644.
- **T-11 KB article suggestions in composer** (Partly, P1) — Zoho: Knowledge-base articles suggested while the agent writes a reply, insertable in one click. TAVI: Suggestions panel exists but showed "could not be loaded" on 26 Oct. Re-check in Wave 2 (NDC-2636). Plane: NDC-2636.
- **T-21 Delete / restore (Recycle Bin)** (Partly, P0) — Zoho: Deleted tickets go to the Recycle Bin, where they can be restored or deleted forever. TAVI: Delete and restore work. "Delete forever" fails for Desk items with no message (NDC-2248); Empty Bin and names have bugs (NDC-2516, NDC-2517). Plane: NDC-2248, NDC-2516, NDC-2517.
- **T-24 Attachments (upload, preview, size limits, annotator)** (Partly, P0) — Zoho: Attachments with size limits, preview, and an image annotator (crop, blur, arrows, text) before adding an image. TAVI: Upload and preview work. No image annotator. A blueprint transition with a file fails (NDC-2753). Plane: NDC-2753.
- **T-38 AI on ticket: summary, sentiment, reply suggestion** (Partly, P2) — Zoho: AI on the ticket: summary, customer sentiment, reply suggestions, writing help. TAVI: An AI panel exists on the ticket (69 strings); which parts really work is checked in Wave 2. Backlog NDC-2004. Plane: NDC-2004, NDC-2005.
- **T-39 Ticket translation** (Missing, P2) — Zoho: Translate a ticket thread and the reply into the agent's or customer's language. TAVI: No translate action on the ticket (NDC-2005). Plane: NDC-2005, NDC-2760.
- **T-41 Telephony panel on ticket (click to call)** (Partly, P2) — Zoho: Click-to-call from the ticket with calls logged on the ticket, through a phone integration. TAVI: A small call strip only (4 strings); no phone setup behind it. Plane: NDC-2008.
- **T-42 Read receipts for replies** (Missing, P2) — Zoho: Read receipts: delivered and read marks per recipient on outgoing replies. TAVI: Not available. Listed in the reply gaps NDC-2636. Plane: NDC-2636, NDC-2760.

## Automation

- **U-02 Round-robin preferences (thresholds, online-only, backlog)** (Partly, P0) — Zoho: Round-robin preferences: per-agent ticket limits, only online agents, a backlog queue when everyone is full. TAVI: Partly built; the agreed requirements are NDC-2275. Plane: NDC-2275.
- **U-03 Skills and skill-based routing** (Partly, P1) — Zoho: Skills on agents and tickets, with tickets routed to agents who have the skill. TAVI: Skills tab and skill actions exist; 9 gaps filed in NDC-2752 (per-department skills, active/inactive, limits…). Plane: NDC-2752.
- **U-10 Supervisor rules (time-based checks on ticket age)** (Missing, P1) — Zoho: Supervisor rules: rules that run on a schedule and act on tickets that match (for example, unanswered for 8 hours). TAVI: No supervisor rules page or API. Plane: NDC-1973, NDC-2760.
- **U-11 Schedules (run custom function on a schedule)** (Missing, P2) — Zoho: Schedules: run a custom function at set times. TAVI: No schedules page (NDC-1989). Plane: NDC-1989, NDC-2760.
- **U-14 Webhooks (outgoing) and public API keys** (Partly, P1) — Zoho: Outgoing webhooks and public API keys for other systems. TAVI: Webhook exists as a workflow action only. No API key or webhook list page (NDC-2009). Plane: NDC-2009.
- **U-16 Auto-close / time-based ticket rules** (Partly, P1) — Zoho: Automatic closing and other rules based on how long a ticket has been in a state. TAVI: Only inside blueprints (state time limit) and archiving. No general auto-close (NDC-1973). Plane: NDC-1973.

## Channels

- **N-05 Web forms + feedback widget (embed code, hosted link)** (Partly, P0) — Zoho: Web forms and a feedback widget a website can embed (script, iframe or hosted link). TAVI: Forms are built, but the embedded form does not load (NDC-2751, NDC-2732, NDC-1488). Extras such as position and languages are in NDC-1993. Plane: NDC-2751, NDC-2732, NDC-1488, NDC-1993.
- **N-13 Phone / telephony channel** (Missing, P2) — Zoho: Phone channel: telephony setup, call routing, IVR, and calls turned into tickets. TAVI: No Phone channel in settings. Plane: NDC-2760.
- **N-14 Instant messaging (WhatsApp/Telegram/LINE)** (Missing, P2) — Zoho: Instant messaging channels (WhatsApp, Telegram, LINE and others) answered as tickets. TAVI: Not in Desk; only in Omnichannel (NDC-2000). Plane: NDC-2000, NDC-2760.
- **N-15 Guided conversations** (Missing, P2) — Zoho: Guided conversations: step-by-step self-service flows for customers. TAVI: Not built (NDC-1994). Plane: NDC-1994, NDC-2760.
- **N-16 ASAP help widget / mobile SDK** (Missing, P2) — Zoho: ASAP: a help widget and mobile SDK that put the help center inside a website or app. TAVI: Not built (NDC-1995). Plane: NDC-1995, NDC-2760.
- **N-17 Help Center SSO (SAML / OIDC / social sign-in)** (Missing, P2) — Zoho: Help center sign-in with SAML, OpenID Connect or social accounts. TAVI: Not built (NDC-2264). Plane: NDC-2264, NDC-2760.

## Insight

- **I-05 Radar mobile app / agent mobile app** (Missing, P2) — Zoho: Mobile apps for agents (Desk) and managers (Radar). TAVI: No mobile app (NDC-1998). Plane: NDC-1998.

## Data

- **D-05 Sandbox** (Partly, P2) — Zoho: Sandbox: a copy of the setup to try changes safely before going live. TAVI: Sandboxes page exists, but creating one never finishes (NDC-2514); the page showed an error on 1 Nov. Plane: NDC-2514.
- **D-07 Recycle Bin (restore, delete forever, empty)** (Partly, P0) — Zoho: Recycle Bin for all deleted records, with restore, delete forever and empty. TAVI: Restore works. Delete forever fails for Desk items (NDC-2248); Empty Bin deletes everything after one confirmation (NDC-2517). Plane: NDC-2248, NDC-2516, NDC-2517.

## Customization

- **X-03 Layout rules, validation rules, dependent picklists** (Partly, P0) — Zoho: Layout rules, validation rules and dependent picklists on ticket forms. TAVI: They can be saved but are not applied on the form (NDC-2230, NDC-2231); rules page in backlog (NDC-2535, NDC-1988). Plane: NDC-2230, NDC-2231, NDC-2535, NDC-1988.
- **X-04 Buttons (custom buttons on ticket)** (Missing, P2) — Zoho: Custom buttons on the ticket page that open a link with field values or run a function, shown by profile. TAVI: No buttons setup. Plane: NDC-2760.
- **X-05 Languages (portal + agent UI, RTL)** (Partly, P1) — Zoho: Languages setup: which languages the help center and customer emails use, with a default language. TAVI: Agent screens switch between English and Arabic only; no Languages setup. Arabic text bugs in NDC-2488, NDC-2487. Plane: NDC-2488, NDC-2487.

## Integrations

- **G-03 API integration config page** (Partly, P2) — Zoho: A developer page for API connections and settings. TAVI: The "API Integration" settings link opens Headquarters instead of a page (re-check in Wave 5).
- **G-04 Marketplace / extensions, Jira, Shopify, Zapier** (Missing, P2) — Zoho: Marketplace extensions and ready integrations (Jira, Shopify, Zapier and more). TAVI: Not built (NDC-2013). Plane: NDC-2013.
- **G-05 Developer space: APIs page, connections, functions, webhooks list** (Missing, P1) — Zoho: Developer space: API overview, connections, custom functions and a webhooks list. TAVI: No developer space menu (NDC-2009). Plane: NDC-2009, NDC-2760.
- **G-06 Analytics app (Tavi Analytics for Desk)** (Partly, P1) — Zoho: Analytics for Desk: standard and custom reports, dashboards, scheduled reports. TAVI: Analytics tab stays on "Loading your departments…"; reports and dashboards open Headquarters (NDC-2364, NDC-2068). Re-check in Wave 5. Plane: NDC-2068, NDC-2364.

## Cross-cutting

- **Q-04 My profile, signatures, personal time zone/date format** (Partly, P1) — Zoho: Personal settings for each agent: time zone, date and time format, signatures. TAVI: Signatures exist. No personal time zone or date format (Wave 1, W1-05; NDC-1970). Plane: NDC-1970.

