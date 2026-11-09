# NDC-2392 — CRM ⇄ Desk Integration missing list: recheck 9 Nov 2026

**Tenant: NDC-Staging** (tenant id `a7a7a7a7-0000-0000-0000-000000000004`), staging-desk / staging-crm.taviportal.com, account ndc-staging-owner (Owner), signed in once (own session file). Same tenant as the October run.
**Integration state found:** Connected (since 5 Nov 2026 14:07), not paused, Contacts + Accounts two-way, Contracts off, Calls off, Products off ("Not chosen"); 410 parked failures in the queue. Integrated user: ndc-staging-owner. Nothing was changed: settings dialogs were opened with every write request blocked, then closed.

How checked: live API (owner, GET only), the integration's text file `/locales/en/crm-desk-integration.json`, the current code bundle, and screenshots. Zoho side = October captures in `docs/crm-desk-integration/evidence/originals/zoho/` (read-only).

Numbering = the Plane ticket's order (it differs from the md missing list in docs/).

| # | Item | Zoho | TAVI now (9 Nov) | Verdict | Evidence |
|---|---|---|---|---|---|
| 1 | Products sync (departments, product–customer associations, field mapping) | Pick Desk departments; associations; field mapping | NEW: Products row → Configure: "Sync products from CRM", "CRM module that holds the products", field mapping (Product Name required), "Also sync each contact's and account's products". **No department choice.** `/desk/integrations/crm/products` still 404 (config lives in the main settings) | Partly built | ev-A |
| 2 | Limit sync to chosen CRM list views | "All Accounts ▾ / All Contacts ▾" | NEW: "Sync only records in these CRM views" with view tick boxes (contacts scoped to "All Customers" today); failure reason "Outside the selected CRM views" | Built | shot d03 |
| 3 | Match contacts on secondary email + overwrite warning | Two tick boxes + warning | NEW: "Contact matching: Primary email only / Primary and secondary email", confirm dialog warns the Desk primary email is overwritten | Built | shot d03 |
| 4 | "Delete in Desk only if no associates" | Option on CRM delete | NEW: 4th option "Delete the Desk contact/account only if nothing is linked to it" | Built | shot d04 |
| 5 | Report when the initial sync finishes | Email with added/updated/ignored + reasons | Failure Log → "Skipped" lists each initial run's skipped records with reasons; runs API has requested/created/updated/skipped counts. **No email or bell notice** (owner's last 50 notifications have none for the 5–6 Nov runs) | Partly built | ev-A |
| 6 | CRM Leads considered when matching | Desk contact with a Lead's email not created as CRM contact | Live test: CRM Lead "QA RT 2392 Lead" (email E), then a Desk contact with E → after 45 s the sync created a **new CRM contact** and linked it (synced). Records deleted + purged | Still missing | ev-D |
| 7 | 12-month window stated on screen | "Only records created or modified in the last year…" | No such statement on Overview, Configuration or Connect text | Still missing | ev-A |
| 8 | Integrated user becomes inactive | Prompt to re-point | Integrated user now shown in status API; no inactive handling text; testing needs deactivating the owner | Not checked (shared-state change) | — |
| 9 | All CRM fields in the CRM pane | Every field incl. custom | Pane still uses the fixed `panel.info_fields` list (contacts 8, accounts 6); no screen to change it | Still missing | ev-B |
| 10 | Handshake hides empty columns | Hides empty columns | Customers (0) and Potentials (0) still shown with "No tickets" (owner, All Tickets) | Still missing | ev-B |
| 11 | Ticket filters Escalated / Overdue / High Priority on the CRM card | 7 filters | Still All / Open / On hold / Closed (`tickets.filters.*`) | Still missing | ev-C |
| 12 | Mutual Users list + "Invite users to Desk" | On the CRM integration page | No mutual users / invite text in the integration; Permissions tab = profile access + Ticket Visibility | Still missing | ev-C |
| 13 | CRM users as Light Agents; CRM-only users can comment | Auto Light Agents | "Desk Light Agent" profile exists, but no CRM user holds it; 5 of 11 CRM users have no Desk profile at all. Comment by a CRM-only user not re-tried (needs their sign-in) | Still missing | ev-D |
| 14 | "@CRM Contact Owner" mention | Offered | NEW: typing @crm in a ticket comment offers "Contact owner (CRM) — Whoever owns this contact in CRM" (ticket #2143, linked contact; comment not sent) | Built | shot d13-mention-crm |
| 15 | Act from the CRM notification | Reply / comment / update from the signal | CRM bell has Confirm / Decline / Ok actions only for transfers; Desk ticket signals only open the record | Still missing | ev-C |
| 16 | "CRM Contact Type" condition in SLA / assignment rules | Customer / Potential / Contact / Lead | No such field in the criteria code or text; classification still used only by Handshake | Still missing | ev-D |
| 17 | Default CRM data access (admin-only) + "Restricted Access" name | Only Administrator after connect | All 5 Desk profiles Full Access; "Every profile has full access until you change one"; middle level still "Custom Access" | Still missing | ev-D |
| 18 | Voice of the Customer (Zia) | Enterprise | Out of NDC-1669 scope; nothing found | Still missing (out of scope) | — |
| 19 | Cross-app analytics | Zoho Analytics | Out of NDC-1669 scope; not checked | Not checked (out of scope) | — |

Related bugs NDC-2393..2410: all **Done** in Plane (read only).

**Counts (19):** Built 4 (2, 3, 4, 14) · Partly built 2 (1, 5) · Still missing 11 (6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18) · Not checked 2 (8 needs the integrated user deactivated; 19 out of scope).

**Writes:** item 6 only — CRM lead 69d2ca6a, Desk contact dc8403e7, sync-created CRM contact faa1c662; all deleted by id and purged from the recycle bin by id (see ledger.md). No setting was changed.

**Evidence:** evidence/annotated/ev-A-sync-settings-vs-zoho.png, ev-B-agent-views-vs-zoho.png, ev-C-crm-side-vs-zoho.png, ev-D-access-users-vs-zoho.png; raw screenshots in shots/.
