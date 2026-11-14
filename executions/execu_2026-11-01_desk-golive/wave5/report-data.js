module.exports = {
 title: "Desk Go-Live Wave 5",
 heading: "TAVI Desk go-live: Wave 5, customers, data, insight, customization, integrations",
 meta: "Run on NDC-Staging (Wonder Travel tenant) on 12–13 Nov 2026 (paused overnight, resumed on a new machine) with the owner (ndc-staging-owner@), admin B (mahmoud.mahamed1515@) for the feed/mention check and agent C (fedelav803@) for permission checks. Department Marketing; prefix `QA GL W5`. Covers inventory rows C-01..C-06, I-01..I-04, D-01..D-08, A-11, A-12, X-01..X-06, O-06, G-01..G-06, Q-01..Q-05 and the Group Z still-missing checks. Tenant-wide changes (custom module, tab hide, custom fields, custom action, Home Page) were approved by you and each set back. **Zoho checked live (read-only) on 13 Nov where the trial allowed; all six candidates filed in Plane.**",
 decisions: [
  "**Gate 2 (13 Nov):** you said check Zoho, then file all six. Zoho: W5-17 confirmed (Zoho refuses); E1 Zoho labels the empty value -None- (severity lowered to Low); E7/E4/E2 Setup pages did not load in the Zoho trial, filed as TAVI defects.",
  "**Round-14 leftovers:** #1363–#1366 (QA RT14 2754F …) were still live and caused the dashboard mismatch; deleted and purged in this cleanup as you approved.",
  "**Another session** was testing on the same tenant during the run and signed the owner out twice; I signed in again once each time.",
  "**Next:** Wave 3 (automation, reusing the automation-order session's results), then the C10 Zoho reminder."
 ],
 bugs: [
  {id: "E7", plane: "NDC-3022", sev: "High", title: "NDC-3022 · Disabling a department with ticket transfer leaves the ticket record on the old department", cases: "W5-31", where: "Setup › Departments › disable/delete with transfer; Tickets list; Analytics dashboards",
   steps: ["Create a department and a ticket in it.", "Disable (then delete) the department and choose Customer Support as the transfer target.", "Open Customer Support's ticket list and the Overview dashboard."],
   expected: "The ticket moves to Customer Support everywhere: list, views, reports and dashboards agree.",
   actual: "The Desk ticket says Customer Support (history 'department changed', source desk_api) but the ticket record's **Department** still holds the deleted department. The ticket is **missing from Customer Support's list** (0 found) while dashboards count it (Open Tickets 19 vs 18 in the list/report). Four round-14 tickets (#1363–#1366) were in the same state.",
   request: "POST /desk/departments/{dept}/disable {transfer_to_department_id: Customer Support} → 200\nGET /desk/tickets/{t} → department_id = Customer Support\nGET /modules/{tickets}/records/{t} → department = <deleted dept>\nrecords filter department = Customer Support → total_count 0",
   zoho: "Not checked live: the Zoho trial Setup › Departments page stayed on the loading spinner (13 Nov). The defect stands on its own: TAVI's list, records and dashboards disagree about the same ticket.",
   evidence: "Overview dashboard (19 open); list/report show 18.", images: ["evidence/annotated/w5/W5-E7-vs-zoho.png"]},
  {id: "E4", plane: "NDC-3023", sev: "High", title: "NDC-3023 · New Product cannot be saved from the screen", cases: "W5-60", where: "Setup › Products › New Product",
   steps: ["Open Setup › Products › New Product.", "Enter Product Name and a code (Departments is pre-filled with Sales).", "Save; then replace Sales with Marketing and Save again."],
   expected: "The product is saved for the chosen department(s).",
   actual: "Both saves fail: **'Departments: [\"<id>\"] is not a valid department id'** (422). The form sends departments as a list; the server accepts only a single id (an API call with one id → 201).",
   request: "POST /modules/{products}/records … {field: departments, value: {kind: array, items: [{kind: string, value: <Marketing>}]}} → 422 DEPARTMENT_VALUE_INVALID",
   zoho: "Not checked live: the Zoho trial Setup › Products page stayed on the loading spinner (13 Nov). The defect stands on its own: the screen cannot create any product.", evidence: "Form with the error.", images: ["evidence/annotated/w5/W5-E4-vs-zoho.png"]},
  {id: "E1", plane: "NDC-3025", sev: "Low", title: "NDC-3025 · Mass Update with a field but no value silently clears that field", cases: "W5-44b", where: "Tickets list › select tickets › Update",
   steps: ["Select 2 tickets in a list and click Update.", "Choose a field (Priority) and leave the value as 'Select'.", "Click Update records."],
   expected: "Refused ('choose a value') or a clear confirmation that the field will be emptied.",
   actual: "Accepted: **2 updated**; both tickets' Priority went from High/Low to empty (history 'priority High → null'). No warning.",
   request: "POST /modules/{tickets}/records/mass-update {record_ids:[2], data:[{field: priority, value:{kind: null}}]} → 200 updated 2",
   zoho: "Zoho (live, 13 Nov): the value list shows the empty choice as a labelled, pre-selected option **-None-**, so the agent sees the field will be set to none. TAVI shows the placeholder **Select**, which reads as nothing chosen. Saving in Zoho was not tried (it would change Zoho data).", evidence: "Dialog at the moment of Update.", images: ["evidence/annotated/w5/W5-E1-vs-zoho.png"]},
  {id: "W5-17", plane: "NDC-3024", sev: "Medium", title: "NDC-3024 · Contract end date before start date is accepted", cases: "W5-17", where: "Customers › Contracts",
   steps: ["Create a contract with End date earlier than Start date."], expected: "Refused with a message (events already refuse the same: 'to_time must be on or after from_time').",
   actual: "Saved (201), stored start 2026-12-01, end 2026-11-01, status 'upcoming'; no message.", zoho: "Zoho (live, 13 Nov, Contracts › Add Contract, nothing saved): refused with **Contract Start Date should be less than Contract End Date** (and also **Contract end date cannot be less than current date**).", evidence: "Contract page (start 01/12/2026, UPCOMING); raw API wave5/raw/k1.json, ev17.json.", images: ["evidence/annotated/w5/W5-17-vs-zoho.png"]},
  {id: "E2", plane: "NDC-3026", sev: "Low", title: "NDC-3026 · Contacts export: the Name column is empty", cases: "W5-39", where: "Setup › Data › Export (Contacts, CSV)",
   steps: ["Export Contacts (view 'QA GL W5 view') as CSV."], expected: "Name holds the full name.", actual: "Name is empty on every row; First Name / Last Name are filled.", zoho: "Not checked live: the Zoho trial export page did not load (13 Nov). The defect stands on its own: the column exists but is never filled.", evidence: "wave5/raw/W5-39-desk_contacts-export-….csv", images: ["evidence/annotated/w5/W5-E2-vs-zoho.png"]},
  {id: "E3", plane: "NDC-3027", sev: "Low", title: "NDC-3027 · Audit Log shows internal field names and names tickets by email", cases: "W5-68", where: "Setup › Audit Log",
   steps: ["Delete a ticket that was created by import, restore it, open the Audit Log."], expected: "Entries name the ticket (#3460 and subject) and readable fields.",
   actual: "'cleared Ticket's **EngineDeletedAt**' and 'deleted a Ticket named **qa-gl-w5-c1@example.com**'.", zoho: "Not needed (wording).", evidence: "Audit Log screen.", images: ["evidence/annotated/w5/W5-E3-vs-zoho.png"]}
 ],
 gaps: [
  "Contact portal access: after 'Invite to Help Center' the contact shows no access status or Revoke (W5-08).",
  "No personal time zone / date format on My Profile (W5-71).",
  "Still missing (in NDC-2760): Privacy page (record-level export/erase personal data exists), Languages page, Buttons, Marketplace, Developer space, public API keys page.",
  "Notes: legal hold only blocks automatic deletion (by design, stated on the page); empty CSV import gives no reason; bulk Close from the list is not in the Bulk Actions Log; custom-action placement on tickets not found; system module names stay English in Arabic; Overview dashboard ~3.4 s."
 ],
 tickets: ["**Filed 13 Nov 2026** (Bug, 4 assignees, module Desk, Sprint 16, annotated TAVI-vs-Zoho image on each): NDC-3022 E7 High, NDC-3023 E4 High, NDC-3024 W5-17 Medium, NDC-3025 E1 Low, NDC-3026 E2 Low, NDC-3027 E3 Low.", "Known and still open: NDC-2174 (layout default status), NDC-2635 (activities gaps), NDC-2760 (missing features)."],
 inconclusive: [
  "W5-08 portal revoke not found; W5-10 no parent account (Zoho check); W5-12 sync badges without help; W5-16 contract needs a support plan; W5-21 / W5-55 reused from earlier retests; W5-71 no personal time zone; W5-72 timing; W5-73 agent C can edit/delete products (depends on profile)."
 ],
 shots: [],
 cleanup: [
  "13 Nov ~10:45 Cairo: all QA GL W5 records deleted and purged by exact id (contacts, accounts, contracts, activities, tickets, product, imports), plus view, 2 reports, dashboard, backup, feed post, Help Center account, temp department, 7 fields, custom module, custom action + API source, legal hold. Round-14 leftovers #1363–#1366 removed too.",
  "Diff: zero QA GL W5 records, fields, departments, actions and holds; tab arrangement and Home Page equal the baseline. Left: the DM conversation (no delete)."
 ],
 gapTicket: null
};
