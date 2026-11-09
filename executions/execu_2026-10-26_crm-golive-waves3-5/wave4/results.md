# Wave 4 — email, channels and reminders — case results (26 Oct 2026)

Lane B of the parallel Gate 1 plan. staging-crm.taviportal.com, owner + test user 1; public pages opened in a browser that was not signed in.
Zoho CRM org943261092 read-only. Nothing to Plane. No ticket of this wave was In Progress (checked first), so all were tested.

| Case | Result | Facts |
|---|---|---|
| M01 connections list | Pass | Settings › Email: Zoho Mail taviportal.com (Active), Zoho Mail anyware.software (Active), platform no-reply SMTP (system, all tenants). Nothing changed |
| M01 Gmail / M365 / Transactional (NDC-1141) | **Still fails** | Gmail and Microsoft 365 "OAuth unavailable"; Gmail click: "Google (Gmail) is not configured on this server. Ask your platform administrator to set the OAuth client credentials…"; Transactional "coming soon" (no fields). Zoho offers Zoho Mail, Gmail, Yahoo, Office 365, Outlook, Other |
| M02 compose from a record | Pass | Send Email on a QA lead: recipient from the lead, default template "Introduction" filled with lead and sender names, company signature added automatically, 39 templates in the list |
| M02 send (one test email to mahmoud.mmohamedsamy@gmail.com) | **Fail — W4-B1 + blocker** | Toast "Sent"; email status **failed**: "No Zoho account found for sender 'ndc-staging-owner@taviportal.com' … set the 'zoid' org id on the connection". Connection health "ok", sendability can_send=true. Record Mails tab "No emails yet"; timeline "EmailSent". Delivery: not received (failed) |
| M02 drafts / scheduled | Pass | Draft saved (POST /mail/drafts 200), listed in Drafts, edited (PUT 200), deleted (204, then 404); scheduled draft for 29 Oct listed under Scheduled, deleted |
| M02 spell check | Minor | `POST /proofing/check` 503 "The proofing service is temporarily unavailable" while composing |
| C14 email templates | Pass + **W4-B6** + gaps | Create (POST 201) with access level, preview with sample data, favourite, edit, delete; template works in compose. {{company_name}} is accepted and renders blank ("at .") with no warning (W4-B6). Only 5 placeholders, no record fields, no folders / module link / stats (gaps vs Zoho) |
| C14 signature | Info | One company signature with placeholders, required/optional; no personal signatures (Zoho has personal ones) |
| M06 web form build (NDC-1488) | Pass | 5-step builder (Setup, Build, Settings, Publish, Analytics); Leads / Standard layout; fields, CAPTCHA (Turnstile), owner = a user, duplicates, UTM capture, acknowledgement, consent, styling. Up to 5 forms per module. Default layout offered first is "FieldPermissions" (a test layout), not Standard (minor) |
| M06 hosted link (NDC-1488) | **Still fails** | `/embed/feedback/f/{key}` → nginx 404 (curl + fresh browser); same for the QR code and "Test your form". iframe address `/embed/feedback/index.html?key=…&mode=frame` → 200 |
| M06 submission | Pass | Visitor (iframe, no CAPTCHA on the QA form): thank-you message; lead created with name, phone, email mmohamed@anyware.software, company; owner = chosen user; source web_form; listed under submissions; Analytics: 2 visits, 1 submission, 50% conversion |
| M06 validation / CAPTCHA | Pass | Empty required fields and bad email refused with clear messages; with CAPTCHA on "Complete the CAPTCHA before sending."; acknowledgement email requires CAPTCHA (422 CAPTCHA_REQUIRED, sensible) — so acknowledgement delivery not checked |
| M04 SMS (NDC-1482) | Screens pass, sending blocked | All 9 tabs open; QA SMS template with {{first_name}} saved as draft (variables detected) and archived; 0 credits, no sender IDs → nothing sendable (plan: no sending / buying) |
| M05 telephony (NDC-1493…1498, 1944, 1949) | **Blocked** | No integration on staging (status off, 0 calls). Webhook URL only shown after creating one, which turns telephony on tenant-wide → not done. Call Logs page opens; its 4 totals stay "…" instead of 0 (minor) |
| M07 portals | Pass + **W4-B2** | Portal created (Leads, Standard, Full Name view, Phone edit), switched on (PATCH 200) and off; portal link → nginx 404 on and off |
| M09 notifications | **W4-B3** + **W4-B5** | From ~09:50 to at least 10:49 UTC, list, unread-count and preferences answer 500 for owner and test user 1 (other APIs 200). Before that, the preferences page showed raw keys for many signals (W4-B5) |
| M10 activity reminders (NDC-1333) | Pass (layout) / delivery inconclusive | Settings page: one content scroll area (NDC-1333 stays fixed). Two QA tasks with a 5-minute reminder (one by API, one by "+ Task"): no reminder seen — notifications were down, so inconclusive. "+ Task" sends due_date without a time zone ("2026-10-26T13:06"); API tasks store "…Z" (note) |
| M11 calendar | Pass + gap | Month / week views show the QA tasks at the right local times (12:57 PM, 1:06 PM Cairo); items are not draggable (no drag-to-reschedule, Zoho has it) |
| Environment | Note | One "You don't have access to CRM" page for the owner (gone after reload) and one 502 Bad Gateway page (gone on retry) |

Automation: feature `crmchannels` in automation-w4 (suite crm-wave4): 8 tests, 4 pass, 4 fail = NDC-1488, W4-B2, W4-B3, W4-B6.
