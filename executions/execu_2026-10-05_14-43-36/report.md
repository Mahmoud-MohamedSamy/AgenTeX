# Retest report: Plane "Ready For Test" tickets assigned to Mahmoud Mohamed

| | |
|---|---|
| Source | Plane, project NDC: work items in state **Ready For Test**, assignee **Mahmoud Mohamed** (20 items, read-only; no ticket was changed) |
| Target | TAVI CRM: https://staging-crm.taviportal.com, tenant NDC-Staging |
| Accounts | ndc-staging-owner (Owner), Mahmoud Mohamed (CRM Admin, approver/reviewer), test user 1 (User, submitter), Mahmoud Samy (non-approver), mahmoud.mahamed1515 (delegate) |
| Date | 2026-10-05 |
| Status | 16 of 20 tickets verified; 4 blocked by a concurrent session (see "Blocked") |

## Summary

| Verdict | Count | Tickets |
|---|---|---|
| Fixed | 13 | 1872, 1696, 1672, 1645, 1541, 1515, 1445, 1443, 1438, 1437, 1328, 1228, 1436 (Workflow Rules path) |
| Partially fixed | 2 | 1849, 1652 |
| Epic, partially verified | 1 | 1234 |
| Blocked, not retested | 4 | 1848, 1697, 1585, 1492 |

## Results by ticket

| Ticket | Pri | Title (short) | Verdict |
|---|---|---|---|
| NDC-1872 | High | Delegation shows user ID; delegation comment not shown | **Fixed** |
| NDC-1849 | Urgent | Rejection outcome and Resubmit shown only to the approver | **Partially fixed** |
| NDC-1848 | Urgent | Rejecting a review doesn't return it to the submitter | Blocked |
| NDC-1697 | Urgent | Editing a rejected review record triggers approval and workflows | Blocked |
| NDC-1696 | High | Approval Status offered in the Blueprint "During" picker | **Fixed** |
| NDC-1672 | Medium | Save enabled on a fully locked record | **Fixed** |
| NDC-1652 | High | Approval Status offered in approval rule criteria | **Partially fixed** |
| NDC-1645 | High | Approval Status editable in the layout builder | **Fixed** |
| NDC-1585 | Urgent | Import with an assignment rule leaves the owner empty | Blocked |
| NDC-1541 | High | "Re-evaluate against other processes" option is meaningless | **Fixed** |
| NDC-1515 | High | Create Record action has no layout selector | **Fixed** |
| NDC-1492 | Urgent | Rejecting one field closes the whole review | Blocked |
| NDC-1445 | High | Twelve field types can't be selected for review | **Fixed** |
| NDC-1443 | Urgent | File Upload under review shows raw JSON | **Fixed** |
| NDC-1438 | Low | Field update stores a timestamp in a date-only field | **Fixed** |
| NDC-1437 | High | Workflow field update can overwrite read-only fields | **Fixed** |
| NDC-1436 | High | Address field update erases subfields | **Fixed** (Workflow Rules); Approval Process and Blueprint paths not exercised |
| NDC-1328 | High | Blueprint after-transition Task/Call/Meeting show IDs | **Fixed** |
| NDC-1234 | High | [Epic] Approval Process: re-entry and post-approval edits | Partially verified (see below) |
| NDC-1228 | Medium | Review process reorder not saved | **Fixed** |

---

## Details

### NDC-1872: Fixed
Test user 1 submitted lead "AEX-01 QART-1872 AP" into AEO-01. Mahmoud Mohamed then used Respond → Delegate to mahmoud.mahamed1515 with the comment "test this delegate (QART-1872)". The request was `POST /workflow/approvals/{id}/delegate {"toUserId":…, "comment":…}` and returned 204.
- Timeline (owner view): *Note added: Approval: delegated by Mahmoud Mohamed to mahmoud.mahamed1515: "test this delegate (QART-1872)"*. Both names and the comment are shown.
- Delegate's record view: *Delegated to you by Mahmoud Mohamed: "test this delegate (QART-1872)"*. The delegate becomes the current approver ("Waiting for your response · Respond").
- The delegate's notifications feed (`/notifications?…apps=crm`) contains the comment.

### NDC-1849: Partially fixed
Test user 1 submitted "AEX-01 QART-1849 AP". Mahmoud Mohamed rejected it with "invalid data (QART-1849 retest)" (204).

**Fixed:**
- The submitter's own view of the record now shows the banner *This record was rejected in "AEO-01". Rejected by Mahmoud Mohamed on 05/10/2026 16:03 · as a process admin*.
- The comment shows as *Comment: invalid data (QART-1849 retest)*. The old "Reason" mislabel is fixed.
- The page shows the instruction *Update the record and save it to send it for approval again* and a **Resubmit for approval** button (API: `canResubmit: true`).
- Clicking Resubmit as the submitter called `POST /workflow/approvals/{id}/resubmit` (200), and the record returned to `pending_approval`.
- No "Edit locked fields" link appears for the submitter. That is consistent with AEO-01's rejection lock being "No Fields", so nothing is locked.

**Still failing (expected result 4, Timeline):**
1. The submitter's Timeline is empty. As test user 1, the Timeline tab shows *No activity yet*, and `GET /timeline/records/leads/{id}/feed` returns `200 {"data":[]}`. For the owner, the same feed returns all entries: submitted, rejected, resubmitted, approved, and the field updates. Evidence: `screenshots/NDC-1849-submitter-timeline-empty.png`.
2. The rejection entry doesn't say why. The owner's Timeline shows *Approval: rejected by Mahmoud Mohamed (Process Admin)* without the rejection comment, whereas the delegation entry in NDC-1872 does include its comment.

Not checked: the Audit Log, and a side-by-side comparison with Zoho.

### NDC-1696: Fixed
Blueprint AEO-01 (Leads/Standard), transition WebToReferral, During, "+ Add a field…" offers only Full Name, Email, Phone, Lead Source, Lead Status, Reason, Comment, Complaint Reason and Lead Owner. Approval Status is not offered. On blueprint RVW-008 (FieldPermissions) the picker offers 24 user-fillable fields and excludes Approval Status, Formula, Auto Number, Rollup and Subform. Nothing was saved.

### NDC-1672: Fixed
Mahmoud Samy (not an approver) opened pending record "AEX-01 QART-1872 AP". The header shows *Pending approval: 0/1 · Not an approver for this stage* and the panel shows *Locked while awaiting approval: AEO-01. This record is under approval, so its fields can't be edited until it is approved or rejected.* In Edit mode no record field is editable and the **Save button is disabled**, so no request can be sent.

### NDC-1652: Partially fixed
Approval process "test" (Deals), Rule Criteria:
- **Still failing (expected result 1):** the field dropdown of a criteria row still offers **Approval Status**, directly under the locked system condition "Approval Status is Not Submitted". The old stored criterion "Approval Status is Approved" is also still in the process.
- **Fixed (expected result 3):** saving is now refused with *"Approval Status can't be a condition in an approval process. Every approval rule already requires Approval Status to be Not Submitted, so this condition would only repeat that or stop the process from ever matching a record."* An inert rule can no longer be saved.
- Evidence: `screenshots/NDC-1652-criteria-picker-offers-approval-status.png`, `screenshots/NDC-1652-save-rejected-with-message.png`.

### NDC-1645: Fixed
Approval Status is no longer in the Leads (Standard) layout builder, neither on the layout nor among the 473 unused fields. It is also absent from the disabled layout. The field API returns `isSystemManaged: true` and `read_only: true`, with `canEditProperties`, `canSetPermission`, `canMarkRequired`, `canSetUnique`, `canCreateValidationRule` and `canCreateLayoutRule` all false. Its options are back to exactly not_submitted, pending_approval, approved and rejected; the stray "test" option is gone. The ticket's original module (7794a184…) no longer exists. Not checked: how the field displays next to the tags on the record page.

### NDC-1541: Fixed
The review deactivate dialog now offers only **Reject all held records** and **Release them unreviewed**, with "There is no default: each option has a different outcome…". "Re-evaluate against other processes" no longer appears in the EN or AR text or in the app code. Delete is blocked while a process holds records. The live held-records dialog wasn't opened because no process held records at the time; the verdict is based on the shipped dialog text.

### NDC-1515: Fixed
In workflow rule DataTest, + Action → Create Record → Deals now shows **TARGET LAYOUT** ("— select layout —", options Standard and Test) with the hint *This module has several layouts: choose the one the record is created in.* Modules with a single layout select it automatically and show it (Tasks and Calls show "Standard"). The saved-action page (AEX-01_CreateDeal_Leads) has the same TARGET LAYOUT selector. Nothing was saved.

### NDC-1445: Fixed
RVW-006 "Which fields should be reviewed?" now offers Address, Rich Text, Status, Radio Button, Lookup, Multi-Select Lookup, Image Upload and User, along with the original types. Auto Number is listed but disabled and tagged "Computed", with the explanation *its value is computed by the system (formula, rollup summary, auto number), so there is nothing for a reviewer to decide*. Formula and Rollup fields no longer exist on Leads, and Subform is only on a disabled layout, so those 3 types couldn't be checked.

### NDC-1443: Fixed
I opened the ticket's own 4 review requests (d605aacf, e83c5866, 62a3b6b4, 7dc266b0) on the review page. The File Upload field no longer shows raw JSON for any file type:
- **Leads - 1.xlsx:** "8.8 KB · application/vnd…sheet" and **Download**
- **CRM Settings.PNG:** "157 KB · image/png", an image preview, "Open CRM Settings.PNG" and **Download**
- **Workflow Flowchart.pdf:** "76 KB · application/pdf" and **Download**. The download returns `200 application/pdf`, 77,688 bytes.
- **test text file.txt:** "14 B · text/plain" and **Download**. The download returns `200 text/plain`, 14 bytes.

The original filename and type are kept. A PDF preview isn't shown, but only a download was required; a preview was only suggested.

### NDC-1438: Fixed
- The rule editor's date picker now sends `{"date_3_9":{"kind":"string","stringValue":"2026-09-12"}}`. It used to send `"kind":"timestamp"`.
- The rule stores the string, and a lead that triggers the rule on create or on edit stores `date_3_9 = "2026-09-12"`.
- This matches a lead created through the form (`"2026-09-10"`).

### NDC-1437: Fixed
- The field-update picker (56 fields) no longer offers Auto Number Permission, the read-only Multi Line Permission, or Approval Status.
- Server guard: `POST /workflow/rules` with a field update on `auto_number_4_9` returns **422** *"Field 'auto_number_4_9' is read-only and cannot be changed."*, the same guard the record API applies.
- Leads no longer has a formula field, so the formula part couldn't be checked.

### NDC-1436: Fixed for Workflow Rules
- The rule editor now shows 5 inputs for Address Permission (Street, City, State, Zip Code, Country) and sends subfield keys (`address_4_9.city`, …).
- The rule fired on a lead that already had a full address (12 QART Street / Cairo / Cairo Governorate / 11511 / Egypt). Only City changed (to "Cairo-A" or "Cairo-B"); street, state, zip and country were kept.
- This held both for the editor's exact payload (empty strings for untouched subfields) and for a City-only update, on create and on edit.
- Not exercised: the Approval Process and Blueprint field-update paths. The background run noted that their address editors also show the 5 subfield inputs.

### NDC-1328: Fixed
In Pipeline+Blueprint (Deals), after-transition actions show record names: Task "Leads · MahmoudMohamed", Meeting "NDC-856", Call "813". Newly picked values also show names (Contact "LeadName05"). The ticket's original Contact references point to contacts that have since been deleted (404). They fall back to a short ID and a "Not Found" toast, which is a minor UX note only. Nothing was saved.

### NDC-1228: Fixed
I moved AEX-01 to the top and clicked Save ("Order saved"). The order was still the same after a full reload. The original order was then restored the same way and re-checked.

### NDC-1234 (Epic): Partially verified
Spot checks on record "AEX-01 QART-1849 AP" (AEO-01):

| Story | Result |
|---|---|
| A2: Approval Status read-only to users | ✅ Test user 1 setting `approval_status` returns **422 APPROVAL_LOCKED** |
| A4: status maintained automatically | ✅ not_submitted → pending_approval → rejected → pending_approval (resubmit) → approved |
| C2: field locks enforced | ✅ Editing Phone after approval returns **422 APPROVAL_LOCKED** ("locked by its approval outcome"). AEO-01's upon-approval setting is "No Fields" editable. |
| D1: rejected records stay held and can be resubmitted | ✅ (see NDC-1849) |
| D2: approval events on the Timeline | ⚠️ Written (owner sees them) but **not visible to the submitter**, and the rejection entry omits the reason (see NDC-1849) |
| D3: transparency of state and locks | ✅ Lock banners and "Not an approver for this stage" (see NDC-1672) |
| B1: entry guard | ✅ Shown as a locked system condition; contradictory criteria can't be saved (see NDC-1652) |
| B2: approved record doesn't re-enter on edit | Not testable with AEO-01, because all fields are locked after approval |

---

## Blocked (4 tickets): why they were not retested
NDC-1848, 1697 and 1492 need the tickets' own review process (AEX-01) switched on during the test, along with AEO-01 and a scoped workflow rule. NDC-1585 needs the assignment rule TestImport to be active. During the run, **another Claude session on this machine (agentex-installation-5f), using the owner account, was changing the same objects** and stayed busy for the rest of the run:
- 13:18:35 UTC: AEO-01 was switched **on**. It had been switched off a minute earlier for these tests.
- 13:19:09 UTC: review process AEX-01 was switched **off** with "Reject all held records", which rejected test lead "AEX-01 QART-1492 RP" without a reason.
- TestImport, active at the start of the run, was found **inactive**.
- That session's owner sign-ins also revoked this run's owner sessions (`401 SESSION_REVOKED`), because the account allows 5 sessions at once.

A final attempt to run 1492/1848/1697 in a short window was refused by Claude Code's auto-mode safety check ("Interfere With Workloads") because the other session was active. Retest these 4 once that session is idle. The scripts are ready.

## Side observations (not part of these tickets)
- `PATCH /api/v1/modules/{id}/records/{rid}` with a partial `data` list **erases every field that isn't sent** (for example, the whole address). It behaves like a full replace. The app avoids this by always sending the full record; any API client that sends a partial update loses data.
- The AEO-01 blueprint "During" Tags section shows a raw tag ID.
- The Edit Action page shows a "Not Found" toast when it loads.

## Test data and configuration changes
| Item | State |
|---|---|
| Workflow rules QART-WF / QART-WF-A / QART-WF-B (created for 1436–1438) | Deleted |
| QART leads for 1436–1438 (7) | Deleted |
| Leads "AEX-01 QART-1849 AP", "AEX-01 QART-1872 AP", "AEX-01 QART-1492 RP" | Deleted. Their open approval/review was closed first, because held records can't be deleted (Recycle Bin) |
| Approval process AEO-01 | Originally **inactive**. Left **active**, as the other session set it at 13:18:35. Not switched back while that session is working; switch it off once it is done if it should be inactive |
| Review process AEX-01 | Originally **inactive**. Currently inactive |
| Review process order | Changed for 1228, restored and verified |
| Plane tickets | Not modified |

## Evidence
Screenshots are kept only for failing parts:
- `screenshots/NDC-1652-criteria-picker-offers-approval-status.png`
- `screenshots/NDC-1652-save-rejected-with-message.png`
- `screenshots/NDC-1849-submitter-timeline-empty.png`

Logs:
- `logs/ui-results.jsonl`: settings/UI tickets
- `logs/wf-server.jsonl`, `logs/wf-1436-controls.jsonl`: field-update tickets
