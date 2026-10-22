# CRM ⇄ Desk Integration: Zoho parity matrix (all 153 Zoho items)

Every item of `reference/zoho-docs-inventory.md` (Zoho help docs, API docs, community) compared with TAVI on staging, 18–21 Oct 2026.

**Verdicts:**
- **Implemented**: TAVI does it, verified.
- **Implemented differently**: same outcome, another way.
- **Missing**: Zoho does it, TAVI doesn't. Numbered gaps are in the missing list.
- **Bug**: TAVI has it but it misbehaves. CD-nn items are in the bug report.
- **N/A**: Zoho-only matter (editions, Zoho One, OAuth between separate products, API credits).
- **Not testable here**: needs something staging lacks. The reason is given.
- **Pending**: none left. Two shared-state checks ran on 21 Oct with the user's OK.

Evidence keys:
- R1/R2/R3 = Run 1/2/3 (`executions/execu_2026-10-20_crm-desk-integration/report.md`).
- P = parity checks of 21 Oct (`ParityApiTest`, `ParityUiTest`).
- L = TAVI's own UI text (locale `crm-desk-integration`).
- B = front-end code.

## 1 Setup and enablement

| # | Zoho | TAVI | Verdict | Evidence |
|---|---|---|---|---|
| 1 | Entry point in Desk settings | Desk → Settings → CRM ⇄ Desk Integration | Implemented | R1 A1 |
| 2 | Paid plan, Desk admin, CRM admin to authorise | One tenant; admin-only settings (desk:integration:view/manage) | Implemented differently | R1 A3, R2 A4 |
| 3 | Path 1A: pick the CRM company, Authorize | Single Connect button (first-party) | N/A | — |
| 4 | Path 1B: request access from another CRM admin | Same tenant, no request flow needed | N/A | — |
| 5 | Entry point in CRM settings | CRM → Settings → CRM ⇄ Desk Integration | Implemented | R1 A1 |
| 6 | CRM-side 3-step wizard (portal, sync, users & permissions) | Same content as tabs, no wizard. Products (gap 1) and mutual users (gap 7) missing | Implemented differently | R1 A1, C1 |
| 7 | Create a Desk portal from CRM | Desk always exists in the tenant | N/A | — |
| 8 | Use another user's portal (ZSC key) | — | N/A | — |
| 9 | CRM profile permission "Zoho Desk Integration" | CRM users need `desk:integration:view`; a CRM-only user gets 403 "Missing required permission" | Implemented | P crmOnlyUserLimits |
| 10 | Paid CRM edition only | — | N/A | — |
| 11 | Paid Desk edition (Handshake in Standard) | — | N/A | — |
| 12 | One portal per CRM org | One Desk per tenant | N/A | — |
| 13 | Accounts module and Contacts > Account Name required | Health check (`metadata_reachable`, `catalog_ready`, `deal_support_fields_present`) on the Overview | Implemented differently | R1 B1 |
| 14 | Disabled integrating user → API key disabled, re-enable | No handling or message for an inactive integrated user (no UI text) | Missing (gap 15) | L, not testable without deactivating the owner |
| 15 | Integrating admin leaves → prompt to re-point the integration | Same as 14 | Missing (gap 15) | L |
| 16 | Changing portal removes ticket links | One tenant | N/A | — |
| 17 | Completion email after setup with added / updated / ignored counts and reasons | No email seen and no in-app notice | Missing (gap 10), also bug CD-07 | R3 B11 |
| 18 | Org scope; products by department | Org-wide contacts and accounts; products missing | Implemented (products = gap 1) | — |

## 2 Sync configuration

| # | Zoho | TAVI | Verdict | Evidence |
|---|---|---|---|---|
| 19 | Accounts, Contacts, Products sync with custom fields | Contacts and Accounts, custom fields mappable | Implemented; Products missing (gap 1) | R2 G1–G4, P G13 |
| 20 | Leads, Deals, Notes, Activities not synced as records; shown live | Same. Deals also become Desk contracts (TAVI extra) | Implemented | R2 I3, D1 |
| 21 | Custom modules can't sync | Same | Implemented (same limit) | — |
| 22 | Two-way default; CRM → Desk one-way; no Desk → CRM one-way | Same choices | Implemented | P oneWay |
| 23 | Products direction | — | Missing (gap 1) | Z1 |
| 24 | Switching one-way → two-way affects only later changes | Same: the one-way Desk edit was not pushed after switching back | Implemented | P oneWay |
| 25 | Limit to CRM list views | — | Missing (gap 2) | Z2 |
| 26 | Product department scope | — | Missing (gap 1) | Z1 |
| 27 | Product customer associations | — | Missing (gap 1) | Z1 |
| 28 | Match on primary or secondary email | Primary only | Missing (gap 3) | Z3 |
| 29 | Secondary-email overwrite warning | — | Missing (gap 3) | Z3 |
| 30 | Duplicates: contacts by email, accounts by name, products by name | Contacts by email (case ignored); accounts by name | Implemented | R2 G7, G8; P G10 |
| 31 | Contacts without email sync | Yes | Implemented | R2 G11 |
| 32 | Field mapping, editable later, custom fields | Yes, per-field direction (TAVI extra) | Implemented | R1 C2–C4, P G13 |
| 33 | Type mismatch causes failures | Blocked at configuration ("datatype_incompatible") | Implemented (better) | P C7 |
| 34 | Mandatory field missing → failure | The Desk contact is created **without** its required Last name; no failure | Bug CD-11 | P G18 |
| 35 | Mapping changes not retroactive | Same | Implemented | P G13 |
| 36 | Initial bulk import | Initial customer and contract runs | Implemented | R3 B9 |
| 37 | Only last 12 months imported; stated on screen | Not stated; behaviour can't be tested (no records older than 12 months) | Missing statement (gap 18); behaviour not testable | — |
| 38 | Event-driven, near-instant | About 5 s | Implemented | R2 G20 |
| 39 | Pause / Resume | Yes, with reason; queue drains on resume | Implemented | R2 B3–B6, R3 |
| 40 | CRM delete: always / if no associates / never | Delete / keep and flag / keep and unlink; no "if no associates" | Implemented; one option missing (gap 4) | R2 E2–E5 |
| 41 | Desk delete: always / never | Same | Implemented | R2 E6, E7 |
| 42 | Associates definition | (part of gap 4) | Missing (gap 4) | Z4 |
| 43 | Preferences per module | Yes | Implemented | R1 E1 |
| 44 | FAQ's simplified delete rule | Configurable instead | N/A (Zoho doc conflict) | — |
| 45 | Attachments and product tickets not synced | Attachments not synced | Implemented (same) | — |
| 46 | Sync History 7 days with added / updated / **failed** | 7 days, added and updated only | Bug CD-06 | R1 H3 |
| 47 | Failure Log per record with Try Again | Retry, Retry all, Discard. A fixed record syncs on Retry | Implemented | P H11, R2 H13 |
| 48 | Readable failure reasons | Raw record IDs | Bug CD-03 | R2 G19 |
| 49 | A Desk contact isn't created in CRM when the person is a CRM Lead (community) | TAVI creates a second CRM **contact** for the lead's email | Missing (gap 11) | P leadHandling |
| 50 | Map a Lead Source for Desk-created contacts | Any field can be mapped | Implemented | — |

## 3 Desk-side surfaces

| # | Zoho | TAVI | Verdict | Evidence |
|---|---|---|---|---|
| 51 | CRM info on the ticket | CRM pane: Info, Potentials, Notes, Activities | Implemented | R1 I1, I2 |
| 52 | Panel navigation, View in CRM | Open in CRM, Update from CRM, account pane | Implemented | R2 I11, P I13 |
| 53 | Info, Potentials, Notes, Activities (calls, events, tasks) | Same (calls, meetings, tasks) | Implemented | R1 I2, R2 I3 |
| 54 | Matching by sender email | Yes; unlinked → "Not linked to a CRM record" | Implemented | R1 I7 |
| 55 | CRM info on the Desk contact and account pages | Contact: pane. Account: "CRM Account Info" rail | Implemented | P I14, I13 |
| 56 | "Contacts Mapped / Unmapped with CRM" views | System views `crm-mapped` / `crm-unmapped` | Implemented | B |
| 57 | Account mapped / unmapped views | Same views on accounts (the module has the CRM link field) | Implemented | B |
| 58 | CRM info tab in the mobile app | — | Not testable here (no mobile build) | — |
| 59 | Handshake columns; empty ones hidden; email **or phone** | Columns present; email works; **phone match not used**; empty columns are **shown** ("No tickets in this Queue") | Bug CD-12 (phone); gap 19 (empty columns) | R1 K1, K2; P K4, P Z-59 |
| 60 | Handshake removed when the integration is deleted | Hidden when disconnected; still offered while paused | Implemented; bug CD-02 (paused) | R3 K10 |
| 61 | CRM users auto-added to Desk as Light Agents | CRM-only users have no Desk profile | Missing (gap 12) | P (`/iam/me`) |
| 62 | @CRM Contact Owner mention | No such entry among mentionable users | Missing (gap 13) | P M7 |
| 63 | Light Agent capabilities | Desk Light Agent profile exists (NDC-1981) | Implemented (separate feature) | — |
| 64 | Hide CRM data per profile ("Visible") | No access per module | Implemented | R2 J4 |
| 65 | Accounts / Contacts per profile | Yes | Implemented | R2 J9 |
| 66 | Full / Restricted per section and activity type | Yes; named "Custom Access"; default Full for everyone | Implemented; naming and default = gap 9 | R2 J3–J8 |
| 67 | 12 permission flags in the API | `panel.profile_access` in the settings API | Implemented | R2 J3 |
| 68 | No native lead / deal / task from Desk | Same | N/A (same as Zoho) | — |
| 69 | CRM contact created via Desk contact | Yes | Implemented | R2 G2 |
| 70 | Ticket for a lead creates a Desk contact | Yes; Handshake shows Contacts/Leads | Implemented (see 49) | P K7 |
| 71 | Notes / activities view-only in Desk | Notes can be added to CRM (notes-target) | Implemented (TAVI extra) | R2 J8 |
| 72 | Only deal names in Desk | Stage, amount, closing date, link to ticket | Implemented (TAVI extra) | R2 I3 |
| 73 | "CRM Contact Type" in SLA and assignment criteria | — | Missing (gap 8) | Z8 |

## 4 CRM-side surfaces

| # | Zoho | TAVI | Verdict | Evidence |
|---|---|---|---|---|
| 74 | Related list on Accounts, Contacts, Deals; enable on others | CRM Related Lists setting | Implemented | R1 E10 |
| 75 | Only modules with an email field are eligible | Unsupported modules show "No ticket link" | Implemented differently | R1 E10 |
| 76 | Custom module related list | No custom modules on staging | N/A | — |
| 77 | Leads, Contacts, Deals, Accounts, Products, Vendors, Cases | TAVI CRM has no Products, Vendors or Cases modules | N/A (no such modules) | missing list note |
| 78 | Auto-linking by sender email; Refresh | Yes; Refresh button | Implemented | R1 L1, L |
| 79 | Ticket visibility: integrated user's departments or the user's own | Both; enforced (user in no Desk department sees none) | Implemented | P J12 |
| 80 | "No ticket found" when not in the department | Same behaviour | Implemented | P J12 |
| 81 | Filters Overdue, Closed, Escalated, High priority | All / Open / On hold / Closed | Missing (gap 6) | Z6 |
| 82 | New ticket from CRM | Desk ticket form, prefilled; lands on the linked contact | Implemented | P L5 |
| 83 | "+ New" missing when the contact has no email | New ticket stays enabled (the contact syncs without email, so Desk can take the ticket) | Implemented differently | P Z-83 |
| 84 | Reply / comment / forward from CRM | CRM → Desk ticket workspace (reply, reply all, forward, comment) | Implemented | P, B |
| 85 | Update ticket fields from CRM | Update field: status, priority, owner, due date | Implemented | P L12 |
| 86 | Close / delete from CRM | Yes | Implemented | P L12 |
| 87 | CRM-only users view and comment only | View: yes. Create, close, edit: refused (403). **Comment also refused** | Implemented; comment differs (part of gap 12) | P crmOnlyUserLimits |
| 88 | Link / unlink tickets to deals | Yes | Implemented | R2 I15 |
| 89 | Statistics on the record | Yes | Implemented | R1 L2, R2 L2 |
| 90 | Happiness in CRM | Statistics + rating signal | Implemented | R1 M1 |
| 91 | Signals for Desk events; reply / comment / update from the signal | Bell entries arrive (ticket created, mention); only open the record, no actions | Implemented; acting from the notification missing (gap 14) | P M2, M6, Z-91 |
| 92 | Desk tab in CRM | "Desk" in the CRM menu | Implemented | P Z-92 |
| 93 | Intermittent missing module | — | N/A | — |
| 94 | Invite CRM users to Desk; mutual users | — | Missing (gap 7) | Z7 |
| 95 | Licence use per role | — | N/A | — |
| 96 | CRM dashboard component (not in Zoho) | — | N/A | — |
| 97 | CRM Zia Voice of the Customer from Desk tickets | — | Missing (gap 16; Enterprise-only AI feature, not in NDC-1669) | — |
| 98 | Unified client portal (not in Zoho) | — | N/A | — |

## 5 Automation

| # | Zoho | TAVI | Verdict | Evidence |
|---|---|---|---|---|
| 99–102 | Deluge custom functions and zoho.desk / zoho.crm tasks | Platform automation, not part of this integration | N/A (out of scope) | — |
| 103–104 | CRM workflow → Desk ticket via custom function | Same | N/A (out of scope) | — |
| 105 | Assignment by CRM contact owner (not in Zoho) | — | N/A | — |
| 106 | CRM Contact Type in SLA / round robin | — | Missing (gap 8) | Z8 |
| 107–110 | CRM fields in workflow criteria, blueprint, webhooks, Zia routing (not in Zoho) | — | N/A | — |

## 6 Reporting

| # | Zoho | TAVI | Verdict | Evidence |
|---|---|---|---|---|
| 111 | In-CRM ticket statistics | Yes | Implemented | R1 L2 |
| 112–114 | Zoho Analytics joins CRM and Desk tables | Separate Analytics product | Missing (gap 17; separate product, not in NDC-1669) | — |
| 115 | Native Desk reports with CRM fields (not in Zoho) | — | N/A | — |

## 7 Deactivate, delete, reconfigure

| # | Zoho | TAVI | Verdict | Evidence |
|---|---|---|---|---|
| 116 | Pause | Yes | Implemented | R2, R3 |
| 117 | Delete from Desk: sync stops, CRM info gone, Handshake gone; admins only | Disconnect: sync stops, pane gone, Handshake hidden; admin only | Implemented | R3 B8, R2 A4 |
| 118 | Deactivate from CRM | Pause / Disconnect on the CRM page too | Implemented | P Z-118 |
| 119 | CRM side after deactivation: related lists removed, deal-ticket links deleted, Desk tab removed | While disconnected: Desk Tickets card hidden on the CRM record, "Desk" gone from the CRM menu, workspace says "Desk is not available" | Implemented | P Z-119 (21 Oct, user-approved disconnect) |
| 120 | Synced records stay | Links and records kept | Implemented | R3 B8, B14 |
| 121 | Trial expiry pauses sync | — | N/A | — |
| 122 | Re-integration through support | Reconnect without duplicates | Implemented differently | R3 B14 |
| 123 | Zoho One delete vs deactivate | — | N/A | — |

## 8 API

| # | Zoho | TAVI | Verdict | Evidence |
|---|---|---|---|---|
| 124 | Contact's CRM link and type in the API | `crm_record_id`, `crm_sync_status`; type via `/tickets/classify` | Implemented differently | R1 K2 |
| 125 | Account's CRM link | Same | Implemented | — |
| 126 | Link can't be set via API (Zoho) | `POST /links` (TAVI extra) | Implemented (extra) | R2 I8 |
| 127 | Customer happiness on contacts / accounts | In the statistics | Implemented | — |
| 128 | Profile permission API | Settings API | Implemented | R2 J3 |
| 129 | Criteria-field APIs with CRM Contact Type | — | Missing (gap 8) | Z8 |
| 130 | API credit limits | — | N/A | — |
| 131 | No integration config API in Zoho | Full settings API (TAVI extra) | Implemented (extra) | — |
| 132–133 | Deluge / CRM function budgets | — | N/A | — |

## 9 Limits and FAQs (repeats of the above)

| # | Item | Verdict |
|---|---|---|
| 134 | One portal per org | N/A |
| 135 | 12-month initial window | see 37 |
| 136 | History kept 7 days | Implemented |
| 137 | Ticket shows in CRM only on email match; phone for Handshake | Implemented; phone = bug CD-12 |
| 138 | Department visibility | Implemented (79) |
| 139 | No-email contacts sync, "+ New" hidden | see 31, 83 |
| 140 | Mass updates sync | Implemented (R2 G12) |
| 141 | Secondary email overwrites primary | Missing (gap 3) |
| 142 | Mappings not retroactive | Implemented (35) |
| 143 | Deactivation deletes deal-ticket links | Implemented differently: TAVI keeps the link through disconnect + reconnect, as its Disconnect dialog says ("Existing links … are kept"). Not a gap |
| 144 | Custom modules can't sync | Implemented (same) |
| 145 | Ticket to lead / task not native | N/A |
| 146 | Related list can't be renamed or filtered by department | N/A |
| 147 | Integrating admin dependency | Missing (gap 15) |
| 148 | Doc inconsistency | N/A |

## 10 Zoho One admin guide

| # | Item | Verdict |
|---|---|---|
| 149–153 | Zoho One admin panel, pending actions, deactivate vs delete, doc link, API credits | N/A |

## Totals
All 153 items have a verdict, counted from the tables above:

| Verdict | Items |
|---|---|
| Implemented (incl. "differently", TAVI extras, same limit as Zoho) | 79 |
| Missing (gaps 1–19; gap 19 sits on row 59, counted as Bug) | 25 |
| Bug | 4 rows (CD-03, CD-06, CD-11, CD-12; CD-02 and CD-07 sit on rows also counted above) |
| N/A (Zoho-only) | 42 |
| Repeats ("see …") | 2 |
| Not testable here | 1 (58 mobile; also the behaviour part of 37) |
| Pending | 0 — the two shared-state checks ran on 21 Oct with the user's OK |

## New gaps from this pass (added to the missing list as 10–18)
10. No report when the initial sync finishes (Zoho emails added / updated / ignored counts and reasons).
11. A Desk contact whose email belongs to a CRM Lead is created as a new CRM contact (Zoho: not created). Source: Zoho community.
12. CRM users aren't added to Desk as Light Agents. CRM-only users can't comment on tickets (Zoho: they can).
13. No "@CRM Contact Owner" mention.
14. Desk notifications in the CRM bell only open the record; Zoho Signals let you reply, comment or update from the notification.
15. No handling when the integrated user becomes inactive (Zoho prompts to re-point the integration).
16. CRM Zia Voice of the Customer from Desk tickets (Enterprise AI feature; not in NDC-1669).
17. Cross-app analytics joining CRM and Desk data (Zoho Analytics; separate product; not in NDC-1669).
18. The 12-month window of the first sync isn't stated on the screen (Zoho states it).
19. Empty Handshake columns are shown ("No tickets in this Queue"); Zoho hides empty columns.
