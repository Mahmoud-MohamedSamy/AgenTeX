# Retest round — Ready For Test, MahmoudMohamed (NDC) — 18 Oct 2026

- Environment: https://staging-crm.taviportal.com, tenant NDC-Staging, Edge (playwright-cli), accounts ndc-staging-owner (CRM Admin), test user 1 (User profile, no review permission). Credentials from `docs/Credentials/Microsoft Edge Passwords.csv` (never printed).
- Scope approved: all 15 tickets (incl. epic NDC-1234); this pass = #1–7. **Plane not updated** — nothing moves until the user reviews this report.
- NDC-1819 and NDC-2096 were retested twice (second pass on the user's request) with identical results.
- Method: no tagged automation exists for any ticket → manual browser + API (scripts in `scripts/`).
- Evidence: `screenshots/raw/` (originals), `screenshots/annotated/` (one per ticket, pass or fail).

## Results (CRM)

| # | Ticket | Priority | Feature | Verdict | Proposed Plane action |
|---|---|---|---|---|---|
| 1 | NDC-1819 | Urgent | Work Queue | ⚠️ PARTIAL — 4 pass, 5 partial, 4 missing (2 passes) | → Bug + comment (or split into child tickets) |
| 2 | NDC-2095 | High | Custom Views | ✅ PASS — after setting the company time zone to Africa/Cairo | → Done + comment |
| 3 | NDC-2096 | High | Custom Views | ✅ Not a bug — developer's claim verified (2 passes) | → Done + comment (not a bug) |
| 4 | NDC-2097 | High | Custom Views | ✅ PASS | → Done + comment |
| 5 | NDC-1787 | High | Work Queue | ✅ PASS for queues (My Jobs excluded by the developer) | → Done + comment |
| 6 | NDC-1788 | High | Work Queue | ⚠️ PARTIAL — Priority values still raw tokens; 3 Tasks fields missing | → Bug + comment |
| 7 | NDC-1821 | High | Work Queue | ✅ PASS | → Done + comment |

## Detail

### NDC-1819 — Workqueue Missings (13 items listed in the description)
| # | Item | Now | Result |
|---|---|---|---|
| 1 | Filter panel design like Zoho | Criteria-row bar (field / operator / value), not Zoho's side panel | Missing |
| 2 | Categories: System Defined / By Fields / Related Modules | "Filter By Fields" + "System Fields" (Approval Status, Created At, Last Activity, Owner, Review Status, Source, Tags). No Locked/Touched/Untouched, no related modules | Missing |
| 3 | Options per field type | Date: 27 date operators; text: contains/starts with…; lookup: equals/empty; tags: contains any/all/none | Pass |
| 4 | Search in filter panel + clear (×) | Search fields box present; no × appears after typing | Partial |
| 5 | Alphabet filter Leads/Contacts | Not present on Leads queues | Missing |
| 6 | Alphabet + normal filters together | Not testable (5 missing) | Missing |
| 7 | Column header menu Asc/Desc/Pin/Hide | Sort ascending / Sort descending / Hide column — no Pin | Partial |
| 8 | Table settings + drag-resize + Reset Column Size | Manage Columns, Reset Column Size, 10–200 per page, Wrap/Clip Text; Phone 140→256 px by drag; Reset disabled until resized, then restores 140 | Pass |
| 9 | Manage Columns search / clear / pin | Search + "Clear search" present; no pin | Partial |
| 10 | Row actions on the left + Add Note, no redundant Mark as Completed | ⋮ and Add Note on the left (Leads); Tasks ⋮ menu still lists "Mark as completed" next to the left checkbox | Partial |
| 11 | My Open Activities date options | All open, Today & Overdue, Due today, Tomorrow, Overdue, Next 7 days, This week, Next week, This month, Next month, On a specific date | Pass |
| 12 | Manage Queue Category View staged until Save | Dialog regroups when toggled; side panel unchanged until Save; Cancel discards; Save applies (restored to Grouped) | Pass |
| 13 | Create Queue + per module, skipping step 1 | "Create a queue on Leads" opens Create Queue with Module = Leads preselected, but still on step 1 (layout must be picked) | Partial |

Second pass (18 Oct): same results for every item (column menu, table settings, resize 142→257→142, Manage Columns, filter search, alphabet, date options, Tasks row menu, Arrange queues, Create Queue).

Note: the developer's comment (14 Oct) listed items 3–11 as not done; items 3, 8, 11 and parts of 4, 7, 9, 10 have shipped since.

### NDC-2095 — today/yesterday/tomorrow use UTC day
Developer: not a code defect; Org setting `general.company.locale.timezone` is still UTC; set it to Africa/Cairo and retest.
Verified 18 Oct: Org value `"UTC"` (resolved_from Default, version 0); the owner's User time zone is `Africa/Cairo`.
- With the user's OK: Settings → Company Settings → Locale Information → Time zone = (UTC+03:00) Africa/Cairo → Save (PUT /iam/tenant/company-profile 200; Org value now "Africa/Cairo", version 1). **Kept on Cairo** (user's instruction).
- Data: QA RT tz L1 17 Oct 23:50, L2 18 Oct 00:10, L3 18 Oct 23:50, L4 19 Oct 00:10 (+03:00), field Date Time.
- Today → L2 + L3; Yesterday → L1; Tomorrow → L4 — identical in the view grid (`QA RT tz-day`), `GET records?view_id=` and `filters=[date_time today|yesterday|tomorrow]`. L2 (17 Oct 21:10 UTC) counts as Today, so the boundary is Cairo midnight. **PASS.**
- Note: a grid read taken while the page was still loading showed "0 records"; after load it shows 2 records (screenshot).

### NDC-2096 — review_status filter by a user without review permission
- UI gate: test user 1 is not offered Review Status (field search "Review" → no option); owner is (System Fields → Review Status).
- API: test user 1 POST view `QA RT review-gate` with review_status equals approved → 201, matches 6 leads; records filter also accepted (6).
- Developer's claim verified: the same record payload returned to test user 1 already contains `__review_state__ = "approved"` (identical to the owner's), so the filter exposes nothing new; pending/rejected/not_submitted/in_review → 0 records visible.
- Second pass (18 Oct, fresh login): unchanged — filter 6 = the 6 leads whose own payload shows `__review_state__ = approved` (of 28 visible); UI still offers no Review Status.
- Verdict: not a confidentiality issue as described. Optional hardening (API mirrors the UI gate) offered by the developer as a separate task.

### NDC-2097 — hidden-field criterion value exposed
- Setup: owner view `QA RT k7` (Everyone) with Company equals "test"; Company is hidden from test user 1; test user 1 owns lead "Test Workqueue" (Company = test).
- Test user 1: GET view → `{"field":"company","value":null,"operator":"equals"}` — value withheld. Editor shows the banner "Some fields in this view's criteria are deleted or hidden from you: company" and an empty row; no value anywhere. Save is blocked client-side ("Complete this row…"), owner's stored criteria unchanged (`company = "test"`).
- Still by design (developer noted): the grid returns "Test Workqueue", so the value can be inferred from results — product call.
- Observation: first load of the editor hung on "Loading fields…" > 15 s; the reload worked.

### NDC-1787 — filter only on My Open Activities
- Funnel present on saved queue (My Leads), criteria queue (EveryLeadWithNoAnswerStatus) and All Leads.
- Filter Lead Status = No Answer on My Leads: 45 → 1; request keeps the queue scope first: `filters=[{owner equals $me},{lead_status equals No Answer}]`.
- My Jobs (Blueprint / Approvals / Reviews): no filter — excluded by the developer, needs its own design.

### NDC-1788 — filter offers only Status and Priority
- Tasks filter now lists 12 layout fields + 7 system fields, with field search and type-driven operators.
- Still failing: Priority values shown as raw tokens `low, normal, high, highest` (grid shows Low/Normal/High/Highest). Field metadata stores `allowed_values: [low, normal, high, highest]` with no labels; Status (status type) shows proper labels.
- Missing fields: Created By, Modified At, Modified By (present on Tasks, absent from the filter).
- Priority field name no longer appears inside its own value list — fixed.

### NDC-1821 — Work Queue delete not in Recycle Bin
- Work Queue → My Leads row ⋮ → Delete "QA RT del-list 1821" → 204; Leads list → Delete Selected "QA RT del-wq 1821" → 204 (bulk).
- Both appear in Recycle Bin (`GET /audit/recycle-bin/items`, and the UI) as CRM / Leads, Expires in 60 days.

## Other observations (not filed)
- Work Queue → My Open Activities "All open" Tasks list shows tasks with Status = Completed.
- Queue badge counts differ from "Total Records" (test 46 vs 0, EveryLeadWithNoAnswerStatus 5 vs 1) — may be loading timing; not investigated.
- The server signed sessions out four times during the run (re-login once each time); one sign-in timed out at 90 s while the site was slow.
- Create Queue dialog: toast "The server took too long to respond. Please try again." seen once.
- NDC-2097: first editor load hung on "Loading fields…" > 15 s; reload worked.

## Cleanup ledger (run once at the end of the round)
| What | Id | Action |
|---|---|---|
| Lead "QA RT del-list 1821" | 154f23c9-5f77-46fa-a02f-da9aa5c5687a | purge from Recycle Bin |
| Lead "QA RT del-wq 1821" | ad0d3273-e254-4814-9598-10feacb4296e | purge from Recycle Bin |
| View "QA RT review-gate" (owner test user 1) | 4495c2fb-f02e-4003-9437-a2b0010a0849 | delete (+ purge) |
| View "QA RT k7" (owner ndc-staging-owner) | 8dceae79-4e80-459c-801b-5291dd0714f0 | delete (+ purge) |
| Work Queue → My Leads ad-hoc filter (Full Name contains …) | — | Clear filters |
| Work Queue → Tasks filter (was "Priority equals highest" before the run) | — | restore |
| Arrange queues mode | — | already restored to "Grouped by module" |
| Leads queue column width (Phone) | — | already reset |
| Leads "QA RT tz L1–L4" | af53a145…, 51cd9fcc…, 22d598d7…, 9a20399e… | delete + purge |
| View "QA RT tz-day" (owner) | caa66e4f-9c0b-4b1a-9f6e-ba96ac8fac5a | delete (+ purge) |
| Org time zone | general.company.locale.timezone | **keep Africa/Cairo** (was UTC/Default) |

## Evidence (annotated, one per ticket)
- screenshots/annotated/NDC-1819-retest-PARTIAL.png
- screenshots/annotated/NDC-2095-retest-PASS.png
- screenshots/annotated/NDC-2096-retest-NOT-A-BUG.png
- screenshots/annotated/NDC-2097-retest-PASS.png
- screenshots/annotated/NDC-1787-retest-PASS.png
- screenshots/annotated/NDC-1788-retest-PARTIAL.png
- screenshots/annotated/NDC-1821-retest-PASS.png
- Specs (regenerate with `node scripts/annotate.js scripts/specs/<ticket>.json`): scripts/specs/

> **Superseded:** the full report for all 15 tickets is `report.html` (18 Oct 2026, end of day). This file covers #1–7 only.
