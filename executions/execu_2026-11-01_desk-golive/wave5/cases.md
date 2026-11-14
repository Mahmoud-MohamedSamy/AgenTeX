# Wave 5 — Customers, data, insight, customization, integrations: test cases on NDC-Staging (TAVI Desk go-live, written 13 Nov 2026)

Rows C-01..C-06, I-01..I-04, D-01..D-08, X-01..X-03, X-05, X-06, G-01..G-03, G-06, Q-01, Q-02, Q-04, Q-05, O-06, A-11, A-12, U-14 (34) + Group Z check of I-05, X-04, G-04, G-05. Host https://staging-desk.taviportal.com, tenant **NDC-Staging ("Wonder Travel")**. Reference: Zoho Desk Enterprise (reference/zoho-desk-inventory.md) and the live Zoho test org techsolutionsegypt (read only) for failures.

**Accounts (one sign-in each):** A owner; **B** mahmoud.mahamed1515@gmail.com (Desk Admin, Marketing); **C** fedelav803@meinvr.com (Desk Agent, Customer Support only) for permission cases.
**Test data:** prefix `QA GL W5 `, department **Marketing**. Created ids → `wave5/after/created.jsonl`. No email to customers (contacts use @example.com addresses).
**Live state read 13 Nov (probe `wave5/raw/probe*.json`):** Contacts ~105+, Accounts 5, Contracts 6, Products 21, Activities 527; Analytics now loads (Overview dashboard with live numbers, Reports "My Reports (0)", Advanced Analytics "In Development") — the inventory said I-02/I-03 were stuck; Settings hub has Import, Export, Data Backup, Migration, Sandboxes, Bulk Actions Log, Data Retention, Data Archive, Audit Log, Recycle Bin, Modules and Fields, Data Types, Capabilities, Organize Tabs, Home Page, Signals, Collaboration Tools, Custom Actions, CRM ⇄ Desk Integration, Email Providers. **Not in the hub:** Languages, Privacy, Buttons, Developer space (APIs, webhooks, API keys), Marketplace, integration-config page.
**Overlap with other sessions (reused, light regression only):** Layout Rules + Validation Rules (12 Nov, X-03), Desk modules/fields runs (X-01/X-02, NDC-2174), CRM ⇄ Desk integration (NDC-2392..2410, G-01), Activities (NDC-2635..2644, C-05), Recycle Bin (T-21 in Wave 2). Those cases are marked *(regression)* and check that the known state still holds.
**Shared owner account:** the automation-order session uses the same owner; if my session is signed out I sign in once more and note it.
**Hazards:** no Migration run (would pull another help desk's data); no Data Retention / Archive rule saved (tenant-wide deletion); Sandbox create only if you OK it (NDC-2514: never finishes); CRM integration settings not changed.
**Before / after:** baseline GET of modules, fields, layouts, tabs, views, dashboards, reports, import/export history, products, contracts → `wave5/baseline/`; end with `after/diff` + cleanup.
Lens: UI · API · NEG · PERM · I18N · SEC · PERF · SET (tenant-wide setting changed for a short window, then set back).

| Id | Row | Screen / API | Steps | Expected (TAVI spec + Zoho behaviour) | Lens |
|---|---|---|---|---|---|
| W5-01 | C-01 | Contacts list | Open Customers › Contacts; switch views, sort, search "QA" | List, counts and search work; columns sortable | UI |
| W5-02 | C-01 | Create contact | New Contact "QA GL W5 Contact 1" (email qa-gl-w5-c1@example.com, phone, account) | Saved; opens the contact page | UI+API |
| W5-03 | C-01 | Contact validation | Save with no last name; bad email "abc@"; 300-char name | Clear messages; nothing saved | NEG |
| W5-04 | C-01 | Edit + delete contact | Edit phone; delete; restore from Recycle Bin | Edit saved; delete → bin → restore works | UI |
| W5-05 | C-01 | Find duplicates + merge | Create "QA GL W5 Dup" twice (same email); Find duplicates; merge | Pair found; merge keeps one record, tickets move to it | UI |
| W5-06 | C-01 | Arabic contact | Contact with Arabic name and Arabic notes | Saved intact; RTL on screen and in search | I18N |
| W5-07 | C-01 | Contact views | Create view "QA GL W5 view" (filter name contains QA GL W5), share to me only; delete | View works, private, deletable | UI |
| W5-08 | C-01 | Portal access | On a contact, look for Help Center access (invite / revoke) | Zoho: invite to portal from contact; TAVI: record what exists | UI |
| W5-09 | C-02 | Create account | New Account "QA GL W5 Account" with website, phone; add Contact 1 to it | Saved; contact listed under the account | UI |
| W5-10 | C-02 | Account hierarchy | Set parent account (another QA GL W5 account) | Parent/child shown on both | UI |
| W5-11 | C-02 | Account duplicates | Find duplicates on Accounts | Works like contacts | UI |
| W5-12 | C-02 | Account sync status | Read the "Synced / Unlinked / Needs attention" badges | Each badge explained (tooltip / help) | UI |
| W5-13 | C-03 | Customer 360 | Open Contact 1 after creating a ticket for them | Tickets, happiness, activities, timeline on the contact page | UI |
| W5-14 | C-03 | Account 360 | Open the account | Contacts, tickets of all its contacts | UI |
| W5-15 | C-04 | Contracts list | Open Contracts (6) | List loads; statuses shown | UI |
| W5-16 | C-04 | Create contract | Contract "QA GL W5 Contract" for QA GL W5 Account, support plan, start/end dates | Saved; shown on the account and on its tickets | UI+API |
| W5-17 | C-04 | Contract validity | End date before start date; expired contract | Refused / marked expired | NEG |
| W5-18 | C-05 | Activities list *(regression)* | Open Activities (527): All / Tasks / Calls / Events, sort | Lists and counts load | UI |
| W5-19 | C-05 | Task | Create task "QA GL W5 task" on a ticket, due today, reminder; complete it | Saved, reminder set, completed state shown | UI |
| W5-20 | C-05 | Call + event | Log a call and an event "QA GL W5" | Saved under the ticket and in Activities | UI |
| W5-21 | C-05 | Known activity bugs *(regression)* | Re-check NDC-2635..2642 symptoms quickly | Record still open / fixed | UI |
| W5-22 | C-06 | Calendar | Month / Week / Day, All Users; the QA GL W5 task and event appear | Items on the right day; switching works | UI |
| W5-23 | I-01 | Headquarters | Open /hq: department switch, components, refresh | Numbers load; department filter works | UI |
| W5-24 | I-01 | HQ add component | Add Component (one widget), then remove it | Added and removed; layout kept per user | UI |
| W5-25 | I-02 | Reports page | Open Analytics › Reports; folders; Add Report | Builder opens | UI |
| W5-26 | I-02 | Custom report | Report "QA GL W5 report": Tickets by status, Marketing, this month; run | Rows match ticket counts in a view | UI+API |
| W5-27 | I-02 | Report export + schedule | Export the report (CSV/PDF); look for Schedule | File downloads; schedule exists or not (Zoho: scheduled reports) | UI |
| W5-28 | I-02 | Report permissions | C opens the report URL | Refused or read-only per sharing | PERM |
| W5-29 | I-03 | Dashboards | Open each dashboard group (My / Starred / Popular / Time based / Module) | Each loads with data or a clear empty state | UI |
| W5-30 | I-03 | Custom dashboard | Create "QA GL W5 dashboard" with 2 widgets; star it; delete | Saved, starred, deleted | UI |
| W5-31 | I-03 | Dashboard numbers | Compare Overview "Open tickets" for Customer Support with a ticket view count | Same number (allowing the lag note) | API |
| W5-32 | I-04 | Team feeds | Post "QA GL W5 feed" in Marketing feed; mention B; DM B | Posted; B sees it and the mention | UI |
| W5-33 | G-06 | Advanced Analytics | Open Analytics › Advanced Analytics | "In Development" (record; G-06 stays Partly) | UI |
| W5-34 | D-01 | Import page | Open Import: modules, ZIP option, history | Page and history load | UI |
| W5-35 | D-01 | Import contacts CSV | Import 3 contacts "QA GL W5 Imp 1..3" (CSV with an Arabic name and one bad email) | Mapping step, 2 imported + 1 error row shown | UI |
| W5-36 | D-01 | Import undo | Undo the import from history | The 2 contacts removed; history shows undone | UI |
| W5-37 | D-01 | Import bad file | Upload a .txt and an empty CSV | Clear refusal | NEG |
| W5-38 | D-01 | Import tickets | Import 2 tickets "QA GL W5 Imp T" into Marketing | Created with the mapped fields | UI |
| W5-39 | D-02 | Export | Export Contacts filtered to QA GL W5 (CSV) | File has the QA rows; history keeps it (7 days) | UI |
| W5-40 | D-02 | Export permissions | C opens Export | Refused | PERM |
| W5-41 | D-03 | Data backup | Open Backup; run a backup now if allowed (password) | ZIP produced or queued; logs show it | UI |
| W5-42 | D-04 | Migration | Open Migration, read sources and existing runs (no new run) | Page loads; sources listed | UI |
| W5-43 | D-05 | Sandboxes | Open Sandboxes; read state (create only with your OK) | Still ERROR / never finishes (NDC-2514)? record | UI |
| W5-44 | D-06 | Bulk actions log | Do a bulk status change on 2 QA GL W5 tickets; open the log | Entry with count and who | UI |
| W5-44b | D-06 | Mass update with no value *(found during the run)* | Add a field in Mass Update and leave the value empty | Refused, or asks to confirm clearing | NEG |
| W5-45 | D-07 | Recycle Bin *(regression)* | Delete a QA GL W5 contact; restore; delete forever (exact match) | Works; NDC-2248/2516/2517 symptoms noted | UI |
| W5-46 | D-08 | Data archive | Read archive rule and "find an archived ticket" (no new rule) | Page loads; search works | UI |
| W5-47 | A-12 | Data retention | Read Closed tickets / Finished activities / Contacts settings and legal hold (no change) | Settings shown with clear wording | UI |
| W5-48 | A-12 | Legal hold | Put a QA GL W5 ticket on legal hold, try to delete it, release hold | Delete blocked while on hold | UI |
| W5-49 | A-11 | Privacy | Look for data subject requests, read receipts, attachment controls | Missing (NDC-2760) — confirm | UI |
| W5-50 | X-01 | Modules and Fields | Open Modules and Fields; list modules | All 10 modules shown | UI |
| W5-51 | X-01 | Custom module | Create custom module "QA GL W5 Module", add a record, delete the module | Created, usable, deleted | SET |
| W5-52 | X-01 | Organize tabs | Hide Contracts tab, check the top bar, show it again | Tab hidden then back | SET |
| W5-53 | X-02 | Custom field | Contacts: add field "QA GL W5 field" (picklist 3 values); use it; delete it | Field appears on the layout; delete works | SET |
| W5-54 | X-02 | Field types sweep | Add one field each: number, date, URL, email, multi-select, checkbox (QA GL W5 …); save a contact with bad values; delete fields | Each validates; deleted after | SET+NEG |
| W5-55 | X-02 | Per-department layout *(regression)* | Read Marketing vs Customer Support ticket layout (NDC-2174) | Default status / fields per department as filed | UI |
| W5-56 | X-03 | Layout + validation rules *(regression)* | Re-check 2 failing items from the 12 Nov runs | Still failing / fixed | UI |
| W5-57 | X-03 | Dependent picklists | Look for field dependency setup on Tickets | Exists / missing (Zoho: field dependency) | UI |
| W5-58 | X-05 | Languages | Look for a Languages setup page (agent UI + portal content) | Missing (EN/AR switch only) — confirm | UI |
| W5-59 | X-06 | Data types + capabilities | Open both pages | Load and explain themselves (TAVI-only) | UI |
| W5-60 | O-06 | Products | Create product "QA GL W5 Product" for Marketing; link to a ticket; delete | Saved, linkable, deleted | UI |
| W5-61 | G-01 | CRM ⇄ Desk *(regression)* | Read the integration page (no change); open a synced account | Page loads; known items NDC-2392..2410 noted | UI |
| W5-62 | G-02 | Collaboration tools | Read available integrations (no install) | Slack / Teams listed with clear connect steps | UI |
| W5-63 | G-03 | Integration config | Old hub link /settings/integration-config; Custom Actions page | Redirect noted; Custom Actions loads | UI |
| W5-64 | G-03 | Custom action | Create custom action "QA GL W5 action" (URL to example.com), check where it shows, delete | Saved, appears where described, deleted | UI |
| W5-65 | U-14 | Webhooks + API keys | Look for outgoing webhooks list and public API key page | Webhook action only; no key page (NDC-2009) — confirm | UI |
| W5-66 | — | Signals | Open Settings › Signals | Loads; record what it does | UI |
| W5-67 | — | Home Page | Open Settings › Home Page; change default home for me, set back | Saved and restored | UI |
| W5-68 | — | Audit log | Open Audit Log; filter by my QA GL W5 actions | My changes listed with who/when/what | UI |
| W5-69 | Q-01 | Arabic sweep | Switch to Arabic; open Contacts, Accounts, Contracts, Activities, Calendar, Analytics, Import, Modules and Fields | RTL, no English leftovers or raw keys | I18N |
| W5-70 | Q-02 | Accessibility | Find accessibility settings (font size, contrast, motion); change one, set back | Applied at once | UI |
| W5-71 | Q-04 | My profile | Open My profile: time zone, date format, signature | Saved; reflected in ticket times | UI |
| W5-72 | Q-05 | Performance | Time Contacts list, a contact page, Analytics overview, Activities (3 loads each) | Under 3 s each (record) | PERF |
| W5-73 | C-01 | Agent C on customers | C opens Contacts / Accounts / Contracts / Products | Allowed per profile; record | PERM |
| W5-74 | X-01 | Agent C on customization | C opens Modules and Fields, Import, Export, Backup | Refused | PERM |
| W5-75 | C-01 | API: other tenant | GET a contact id that is not in this tenant | 404, no data | SEC |
| W5-76 | C-01 | XSS in names | Contact name `QA GL W5 <img src=x onerror=alert(1)>` | Shown as text everywhere (list, page, search, export) | SEC |
| W5-77 | Z | Still missing? | Look for Radar / mobile app (I-05), custom Buttons (X-04), Marketplace / Jira / Zapier (G-04), Developer space (G-05) | Confirm missing (NDC-2760 list) | UI |
| W5-78 | all | Cleanup + diff | Delete all QA GL W5 data (purge exact match), set back every setting, GET diff vs baseline | Zero QA GL W5 left; settings equal to baseline | API |

## What I need from you
- **OK for short tenant-wide changes, each set back at once:** custom module (W5-51), tab hide (W5-52), custom fields (W5-53/54), custom action (W5-64), legal hold on one QA ticket (W5-48).
- **Sandbox (W5-43):** create one sandbox to see if it ever finishes? Default: read only.
- **Backup (W5-41):** run one backup now? Default: yes (it reads data, changes nothing).
- Nothing needs your mailbox in this wave.
