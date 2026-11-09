# Retest 9 Nov 2026 — Backlog: NDC-2702, NDC-2174

## Ledger
- 2026-11-09T08:42:52 NDC-2702 renamed AI Agent -> "AI Agent QA r2702" (204)
- 2026-11-09T08:42:52 NDC-2702 revert name to "AI Agent" (204)

## Results (9 Nov 2026, NDC-Staging, admin mahmoud.mahamed1515, Edge headless + API)
- NDC-2702 FAIL (still): PATCH /iam/profiles/1f415aab… {name:"AI Agent QA r2702"} → 204; reverted to "AI Agent" → 204; profile still isSystem=false, rank 10, appKey crm. Screen not opened.
- NDC-2174 all open items now present on screen (settings only; nothing saved, no write requests seen):
  - 10 per department: Ticket Status › "Statuses by department and layout" → Department + Layout pickers, "Use the organization's statuses (all of them)" / "Use only the statuses picked below"; API layouts carry ticketStatuses (null on all 11 today). Screens 2174-10-ticket-status.png, 2174-10c-by-dept-layout.png
  - 6 pick list (Language, ADVANCED): Add values in bulk / Sort A–Z / Replace values / Clear all / Add. 2174-picklist-advanced.png
  - 7 rounding (QA NDC Amount currency, QA NDC GL Amount decimal): ROUNDING Normal / Round off / Round down / Round up. 2174-currency-advanced.png, 2174-decimal-advanced.png
  - 8 lookup (Contact): filter criteria, search by up to 6 fields, show in pop-up up to 6, sort by, fill fields from chosen record up to 5. 2174-lookup-advanced.png
  - 12 default value (QA NDC Agency code single line): DEFAULT VALUE "No default". 2174-singleline-advanced.png
  - Not checked: that the settings take effect on records (would need saving on the QA NDC reference layouts).
  - Observation: ADVANCED tab says "No advanced configuration available for <field>" above options that are there (decimal, number, single line).
- 2026-11-09T09:33:14 department "QA RT9 2174 Dept" 01b0f723-119d-42c5-8ada-d6fdb40265d9
- 2026-11-09T09:33:21 layout "QA RT9 2174 Layout" a539323e-9252-4967-a1b6-bb3e69f7c300
- 2026-11-09T09:38:45 NDC-2174 layout QA RT9 2174 Layout ticket statuses narrowed via UI (Open, Escalated, Closed; default Escalated)
- 2026-11-09T09:39:11 ticket "QA RT9 2174 C Open" d1ed608e-7418-47f7-9d9e-7cb7dedaef6e
- 2026-11-09T09:40:22 ticket "QA RT9 2174 D screen" 16204a9e-1a17-4e8a-95b7-d016679ccd6c
- 2026-11-09T10:31:10 field qa_rt9_round 912743d8-a64d-4370-8efd-4f93cc92533a
- 2026-11-09T10:31:10 field qa_rt9_default 3d6185ce-3595-4f94-b56c-dfecc5b14300
- 2026-11-09T10:31:59 layout QA RT9 2174 Layout: added fields qa_rt9_round, qa_rt9_default
- 2026-11-09T10:46:05 NDC-2174 throwaway layout saved via UI with qa_rt9_round Round off + qa_rt9_default default "QA RT9 default text"
- 2026-11-09T10:47:40 layout save also sent PATCH email field labels {en:Email}; audit shows label unchanged (only RowVersion 8->9, UpdatedBy)
- 2026-11-09T10:47:52 ticket "QA RT9 2174 E round up" c778d4f7-2d00-4cfa-b3e7-75596b71baac
- 2026-11-09T10:47:53 ticket "QA RT9 2174 F round down" 940ebcaf-35b4-4a8c-b110-f0123addea76
- 2026-11-09T10:47:54 ticket "QA RT9 2174 G given default" 27f5d18a-3bbc-4ad7-b3d9-e33f67811ab8
- 2026-11-09T10:50:33 field qa_rt9_pick 90c35a4b-0d4e-4f46-901c-da50006fb060
- 2026-11-09T10:50:33 field qa_rt9_contact 4e0e47e4-8e3f-4756-b034-7f044bcaffb8
- 2026-11-09T10:51:00 layout: added qa_rt9_pick, qa_rt9_contact
- 2026-11-09T11:01:35 NDC-2174 throwaway layout saved: qa_rt9_pick bulk+sorted, qa_rt9_contact filter email contains qa.webform
- 2026-11-09T11:12:38 ticket "QA RT9 2174 H lookup ok" c4ad8cbb-95cc-4af2-8b9d-843916ff6be2
- 2026-11-09T11:12:41 ticket "QA RT9 2174 I lookup outside filter" 6a81e909-ba87-4ab3-90a2-9eb3dbdb646f

## Functional check on throwaway department + layout (9 Nov, after user said "use a throwaway department and layout")
Throwaway: dept QA RT9 2174 Dept 01b0f723…, layout QA RT9 2174 Layout a539323e… (copy of QA NDC Accounting views, dept-only), fields qa_rt9_round / qa_rt9_default / qa_rt9_pick / qa_rt9_contact, tickets in out/ids.json.
- 10 statuses per dept/layout: UI saved PUT …/layouts/{id}/ticket-statuses {statuses:[Open,Escalated,Closed],defaultStatus:Escalated,fallbackToDefault:false} 200.
  - API create with On Hold → 422 "'On Hold' is not one of this layout's statuses: Open, Escalated, Closed."; PATCH Open→On Hold 422, →QA NDC Pending 422, →Closed 200. PASS
  - Ticket screen Status dropdown: Open / Escalated / Closed only. New-ticket form (dept picks the layout automatically): Open / Escalated / Closed only. PASS
  - Default status NOT applied: new-ticket form Status shows "Select" (not Escalated); API create without status → 422 "Status is required." FAIL (minor)
  - fallbackToDefault (ticket moved onto the layout) not tested.
- 7 rounding: UI Round off saved as datatypeOptions {rounding_option:round_off, rounding_precision:2}; 12.345→12.35, 7.3449→7.34, PATCH 1.005→1.01. PASS
- 12 default value: UI saved {default_value:"QA RT9 default text"}; API create without the field → default stored; with a value → value kept; new-ticket form prefilled. PASS
- 6 pick list: Add values in bulk (paste gamma/alpha/beta/zeta → "3 new values. 1 already in the list and skipped."), Sort A–Z → alpha,beta,gamma,zeta; saved; form shows that order; API 'omega' → 422 PICKLIST_VALUE_INVALID. PASS (predefined lists Countries/Languages/Months/Days and file import offered, not used)
- 8 lookup filter: UI criterion email contains qa.webform saved as lookup_filter; picker on form requests filters=… and lists only the 5 qa.webform contacts (1–5 of 5). PASS on screen. Observation: API accepts a contact outside the filter (201).
- Side effect seen on both layout saves: PATCH email field labels {en:Email} — label already Email (audit: only RowVersion/UpdatedBy changed).
CLEANUP pending user approval.
- 2026-11-09T11:27:08 CLEANUP tickets deleted 7 of 7
- 2026-11-09T11:27:09 CLEANUP layout QA RT9 2174 Layout: 204
- 2026-11-09T11:27:11 CLEANUP fields qa_rt9_*: {"fDec":204,"fDef":204,"fPick":204,"fLk":204}
- 2026-11-09T11:27:12 CLEANUP department QA RT9 2174 Dept: agents 200, delete 422
- 2026-11-09T11:27:48 CLEANUP recycle bin: purged 7 own items by record id; left 0
- 2026-11-09T11:27:49 CLEANUP department QA RT9 2174 Dept delete: 200
- 2026-11-09T11:35:39 plane-draft.html + plane-draft.json written (2174 PARTIAL, 2702 FAIL); not posted
- 2026-11-09T12:02:48 POSTED NDC-2174: comment 122ff5ef + attachment 2925783e (NDC-2174-retest-PARTIAL.png, 611 KB); state left Backlog. NDC-2702 not posted (user moved it to Cancelled).

## 9 Nov — Ticket Skills tab gap (user screenshots)
- Plane search "Skills": NDC-2821, 2805, 2752 (Done), 1978; none covers a Skills tab on the ticket page.
- Staging check (Anyware tenant, ticket #955 45d760e1…, read-only): side rail = Ticket Properties + AI assist; Skills only a field under Case Information. NDC-tenant ticket 6d6dfe26… gave 403 for this account (other tenant), so the user's screenshot is used for it.
- Built evidence/annotated/ticket-skills-tab-vs-zoho.png, skills-draft.html, skills-draft.json. NOT posted.
- POSTED 9 Nov 15:29 (user: "publish, bug, medium, ..."): NDC-2827 d2399195-5f52-4568-b816-cbf528c8b1e3, state Bug, medium, assignees MahmoudMohamed/Hegazy/mfathy/eahmed, labels Assignment Rules + Tickets, module Desk, cycle Sprint 15, relates to NDC-2752 + NDC-2805, attachment 5e7cd2c7 (ticket-skills-tab-vs-zoho.png, 332 KB). All read back.
