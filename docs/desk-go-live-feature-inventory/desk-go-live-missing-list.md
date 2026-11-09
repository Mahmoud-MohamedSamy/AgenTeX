# TAVI Desk go-live: features Zoho Desk has that Desk is missing (draft, 1 Nov 2026)

Source: `desk-go-live-feature-inventory.md` (131 features). Reference: Zoho Desk Enterprise help centre (`reference/zoho-desk-inventory.md`, ids in brackets) and the live Zoho Desk trial (techsolutionsegypt). This draft feeds the ONE Plane gap ticket. It is filed only after the user approves it and gives the Plane fields at the Wave 1 review. Items marked *confirm in Wave n* move from "Could not be checked" to "Missing" only once that wave proves it.

## Not covered by any Plane item yet (to be numbered in the ticket)

**Organisation and access**
1. Gamescope: points, levels and badges for agents (ZH-88). No settings page in Desk.
2. Privacy settings: data subject requests (export or erase a contact's data on request) and per-department attachment controls (allowed file types and size) (ZE). Desk has Data Retention and legal hold only.
3. Read receipts per department: delivered/read marks on outgoing replies, a per-recipient read panel, and an on/off switch in Privacy settings (ZR-58..60). NDC-2636 lists read receipts as a reply gap; this item adds the department setting.
4. Business hours: a time block that runs past midnight (overnight shift). Desk refuses it; two blocks in one day already work (Wave 1, 1 Nov). Zoho allows overnight blocks (product update 2026). Check NDC-2266 first.

**Tickets**
5. Image annotator on attachments: crop, blur, arrows and text before adding the image (Zoho product update). Desk uploads files as they are.
6. Custom buttons on the ticket page: open a URL with field placeholders or run a custom function, with per-profile visibility, a list and an on/off switch (ZT-172..175).

**Automation**
7. Supervisor rules: time-based checks that act on tickets that are, for example, unanswered for X hours. Zoho runs them on a schedule, with criteria and actions (ZU). NDC-1973 covers auto-close only.

**Channels**
8. Phone channel: telephony setup with call routing, call logging into tickets and click-to-call (ZN). Desk has a small telephony strip on the ticket (4 strings) but no Phone channel setup.

**Customization**
9. Languages setup for Desk content: which languages the help center and customer emails use, with a default language (ZH-22, ZL). Desk switches the agent UI between EN and AR only.

## Already filed in Plane (listed in the ticket, not numbered)
- Business hours and SLA gaps → NDC-2266 (SLA and Escalation gaps), NDC-1952.
- Agent sign-in security (SSO, 2FA, allowed IPs) → NDC-1977.
- Multi-brand and custom domain → NDC-1992.
- Server-side reply drafts → NDC-2644. KB suggestions, read receipts on replies → NDC-2636.
- Ticket translation and AI help (summary, reply suggestion) → NDC-2005, NDC-2004, NDC-2003, NDC-2006.
- Recycle Bin "Delete forever" for Desk items → NDC-2248 (+ NDC-2516, NDC-2517).
- Round-robin preferences → NDC-2275. Skills → NDC-2752.
- Auto-close / time-based rules → NDC-1973. Schedules / custom scripts → NDC-1989.
- Public API keys and webhooks, developer space → NDC-2009.
- Web form embed and extras → NDC-2751, NDC-2732, NDC-1488, NDC-1993.
- Chat, Social and IM channels → NDC-2000, NDC-1667 (Omnichannel; "In Development" in Desk).
- Guided conversations → NDC-1994. ASAP help widget → NDC-1995. Help Center SSO → NDC-2264.
- Layout rules, validation rules, dependent picklists → NDC-2535, NDC-1988 (+ bugs NDC-2230, NDC-2231).
- Marketplace and third-party integrations → NDC-2013.
- Advanced analytics → NDC-2364, NDC-2068. Headquarters → NDC-2346.
- Agent mobile app → NDC-1998. Personal time zone and date format → NDC-1970.
- Sandbox create never finishes → NDC-2514 (bug).

## Could not be checked yet (filled in by the waves)
- Clone ticket: no clone text found in the ticket screens. *Wave 2.*
- KB translations and article versions. *Wave 4.*
- Reports and dashboards: the Analytics tab stays on "Loading your departments…", and /reports and /dashboards open Headquarters. *Wave 5.*
- The "API Integration" settings link (/settings/integration-config) opens Headquarters. *Wave 5.*
- Performance of ticket list and detail under load. *Wave 5, run exclusively.*

## Not gaps
- Zia Agents: TAVI has a built-in AI Agent profile (Omnichannel).
- TAVI-only: data retention and legal hold, data archive, review before sending, data types and capabilities catalogue, custom actions.
