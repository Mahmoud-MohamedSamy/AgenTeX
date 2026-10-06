# Retest report: Plane "Ready For Test" tickets assigned to Mahmoud Mohamed

| | |
|---|---|
| Source | Plane, project NDC: work items in state **Ready For Test**, assignee **Mahmoud Mohamed** (20 items, read-only; no ticket was changed) |
| Target | TAVI CRM: https://staging-crm.taviportal.com, tenant NDC-Staging |
| Accounts | ndc-staging-owner (Owner), Mahmoud Mohamed (CRM Admin, approver/reviewer), test user 1 (User, submitter), Mahmoud Samy (non-approver), mahmoud.mahamed1515 (delegate) |
| Date | 2026-10-05 |
| Status | **Complete:** all 20 tickets retested; evidence captured for every ticket |
| Build | A new build was deployed during the run: tests before ~15:30 UTC ran on `index-Cmo9aeQI.js`, and the evidence capture ran on **`index-Bzy9m5yg.js`**. All "Partially fixed" verdicts were re-checked on the new build. |

## Summary

| Verdict | Count | Tickets |
|---|---|---|
| Fixed | 17 | 1872, 1849, 1697, 1696, 1672, 1645, 1585, 1541, 1515, 1492, 1445, 1443, 1438, 1437, 1328, 1228, 1436 (Workflow Rules path) |
| Partially fixed | 2 | 1848, 1652 |
| Epic, partially verified | 1 | 1234 |

**What is still failing (on the new build):**
- **NDC-1848:** the record-level review rejection Timeline entry reads only "Review: rejected — “comment”". It doesn't say who rejected the record, the reason (e.g. Invalid Entry), or which fields. Evidence: `screenshots/annotated/NDC-1848-vs-zoho.png`.
- **NDC-1652:** typing "Approval" in the approval-criteria field picker still offers **Approval Status**, where Zoho shows "No options found". Saving such a rule is refused. Evidence: `screenshots/annotated/NDC-1652-vs-zoho.png`.

## Results by ticket

| Ticket | Pri | Title (short) | Verdict |
|---|---|---|---|
| NDC-1872 | High | Delegation shows user ID; delegation comment not shown | **Fixed** |
| NDC-1849 | Urgent | Rejection outcome and Resubmit shown only to the approver | **Fixed** (on the new build) |
| NDC-1848 | Urgent | Rejecting a review doesn't return it to the submitter | **Partially fixed** |
| NDC-1697 | Urgent | Editing a rejected review record triggers approval and workflows | **Fixed** |
| NDC-1696 | High | Approval Status offered in the Blueprint "During" picker | **Fixed** |
| NDC-1672 | Medium | Save enabled on a fully locked record | **Fixed** |
| NDC-1652 | High | Approval Status offered in approval rule criteria | **Partially fixed** |
| NDC-1645 | High | Approval Status editable in the layout builder | **Fixed** |
| NDC-1585 | Urgent | Import with an assignment rule leaves the owner empty | **Fixed** |
| NDC-1541 | High | "Re-evaluate against other processes" option is meaningless | **Fixed** |
| NDC-1515 | High | Create Record action has no layout selector | **Fixed** |
| NDC-1492 | Urgent | Rejecting one field closes the whole review | **Fixed** |
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

### NDC-1849: Fixed (on the new build)
**Re-check on build `index-Bzy9m5yg`:** test user 1 submitted "AEX-01 QART-EV-1849 AP"; Mahmoud Mohamed rejected it with "invalid data (QART evidence)".
- The submitter's Timeline now lists every entry. Her timeline feed returns entries for all 4 test records, on both the FieldPermissions and Standard layouts.
- The rejection entry now includes the comment: *Approval: rejected by Mahmoud Mohamed (Process Admin): "invalid data (QART evidence)"*.
- The banner and **Resubmit for approval** are still shown to the submitter.
- Evidence: `screenshots/passed/NDC-1849-submitter-sees-rejection-and-resubmit.png`, `NDC-1849-submitter-timeline-visible-new-build.png`, `NDC-1849-timeline-rejection-with-comment-new-build.png`.

**Earlier run on the old build `index-Cmo9aeQI` (superseded):** test user 1 submitted "AEX-01 QART-1849 AP"; Mahmoud Mohamed rejected it with "invalid data (QART-1849 retest)" (204).

**Fixed:**
- The submitter's own view of the record now shows the banner *This record was rejected in "AEO-01". Rejected by Mahmoud Mohamed on 05/10/2026 16:03 · as a process admin*.
- The comment shows as *Comment: invalid data (QART-1849 retest)*. The old "Reason" mislabel is fixed.
- The page shows the instruction *Update the record and save it to send it for approval again* and a **Resubmit for approval** button (API: `canResubmit: true`).
- Clicking Resubmit as the submitter called `POST /workflow/approvals/{id}/resubmit` (200), and the record returned to `pending_approval`.
- No "Edit locked fields" link appears for the submitter. That is consistent with AEO-01's rejection lock being "No Fields", so nothing is locked.

**Old build only, resolved by the new build (expected result 4, Timeline):**
1. The submitter's Timeline was empty: *No activity yet*, and her feed returned `200 {"data":[]}`, while the owner's feed had all entries. Evidence: `screenshots/superseded-old-build/NDC-1849-submitter-timeline-empty-OLD-BUILD.png`.
2. The rejection entry omitted the comment.

Not checked: the Audit Log. No Zoho comparison, because the ticket is fixed and the Zoho org has no rejected approval record.

### NDC-1848: Partially fixed
Review process AEX-01 (Standard layout; Email and Phone reviewed by Mahmoud Mohamed). Test user 1 submitted "AEX-01 QART-1848 RP" with a phone number and no email. Mahmoud Mohamed opened it on the review page and chose **Reject record**.

**Fixed:**
- The dialog *Reject this record?* says *This rejects the remaining 2 fields with the reason below and sends the record back to its owner*. It requires a reason (Invalid Entry selected) and takes an optional comment. The confirm button is now labelled **Reject record**, no longer "Reject field".
- The response is `200`, `status: rejected`, cycle 1, with `ownerUserId` now set to the submitter. It used to be empty.
- The record stays held in the process (`__review_state__ = rejected`) and the submitter can resubmit (`viewerCanResubmit: true`). On a rejected record the submitter sees *This record was rejected. Fix the fields below, then resubmit it for review*, the field, the reason, the reviewer's comment, the reviewer's name and the time, plus a **Resubmit for review** button. These were captured on the parallel NDC-1697 record.
- Clicking **Resubmit for review** as the submitter opened **cycle 2** (`pending_for_re_review`), and cycle 1 is kept in the history. The record then shows *Pending for Review · attempt 2* and *Frozen while under review*.

**Still failing (expected result 5):** the record Timeline only says *Note added: Review: rejected*. It doesn't name who rejected it, the reason (Invalid Entry), or which fields were rejected. By comparison, a single-field rejection does show the details (*Review: field rejected (email): Invalid Entry: "invalid email address"*, see NDC-1697), so only the record-level rejection is missing them.

**Re-check on the new build:** I rejected "AEX-01 QART-EV-1848 RP" with reason Invalid Entry and the comment "phone number does not match (QART evidence)". The entry now includes the comment, *Review: rejected: "phone number does not match (QART evidence)"*, but still no reviewer name, no reason label, and no fields. **Still partially fixed.**

Evidence:
- `screenshots/annotated/NDC-1848-vs-zoho.png`, side by side. The Zoho panel is marked **not checked live**: the reference org's only review process is inactive and has never rejected a record, and producing one would change Zoho.
- `screenshots/failed-raw/NDC-1848-timeline-rejected-without-who-why-fields.png`
- `screenshots/annotated/NDC-1848-timeline-rejected-annotated.png`: annotated copy of the user's screenshot (lead "AEX-01 RP 12", 06/10/2026). It marks two gaps: ① every rejection note is signed "by System" and doesn't name the reviewer; ② one rejection produces 3 separate notes (record rejected, phone, email) instead of **one note listing every rejected field with its reason and comment**. The original is kept in `screenshots/failed-raw/NDC-1848-timeline-rejected-annotated.PNG`.
- Fixed parts: `screenshots/passed/NDC-1848-reject-record-dialog-button-label.png`, `NDC-1848-submitter-sees-rejection-and-resubmit.png`, `NDC-1848-after-resubmit-attempt-2.png`.

**Notes:**
- The header chip next to the record status shows **Not submitted**. That is the Approval Status chip, not the review state; the review state is shown in its own banner. This may be what was misread as the review state in the original report.
- Not confirmed: whether the record appears in the submitter's Leads list view. The list API ignores paging parameters, so this couldn't be checked reliably.

### NDC-1697: Fixed
Setup: review AEX-01 (Email and Phone), approval AEO-01 (active; same "AEX-01" criteria) and a scoped workflow rule `QART-1697` on the same layout (field update on Comment). Test user 1 submitted "AEX-01 QART-1697 RP". The reviewer approved Phone and rejected Email (Invalid Entry, "invalid email address"), so the review ended **rejected**.
- Before the edit, the owner sees the rejection banner with the flagged field, the reason, the comment, the reviewer and the time, and a **Resubmit for review** button.
- The owner then corrected Email and saved **without** resubmitting (200). Afterwards:
  - The review state is still `rejected`, cycle 1, and the banner and **Resubmit for review** are still shown.
  - Approval Status is still `not_submitted`, with no approval instance (`state: none`). AEO-01 did **not** pick the record up.
  - The workflow rule did **not** fire (Comment empty).
  - The Timeline records the email change as an ordinary edit.
- The correct order holds. During cleanup, the records that were resubmitted and then approved in review went straight into AEO-01 approval, which is review → approval as the epic requires.

### NDC-1492: Fixed
Test user 1 submitted "AEX-01 QART-1492b RP" (Email and Phone flagged). The reviewer rejected **Email** only (Invalid Entry): `200`, `status: in_review`, 1 of 2 decided, `completedAt: null`. The review page shows "1 of 2 fields reviewed". Phone still has **Approve / Reject**, and the footer says *At least one field was rejected. Decide the remaining fields to finish, or reject the record now.* Only after Phone was approved did the request become `rejected` with `completedAt` set (2 of 2 decided).

### NDC-1585: Fixed
Assignment rule **TestImport** (Leads; Import/API channels; entry "Full Name contains Lead" → Mahmoud Mohamed; fallback Default user → ndc-staging-owner). It was switched on for the test and back off afterwards, as found. I imported a 2-row CSV through the wizard: Upload → Operation (Add new records) → Map → **Assign owner based on assignment rules: TestImport** → Review (confirmation ticked) → Submit. Import history: *2 added · 0 updated · 0 skipped · 0 errors*.

| Imported lead | Matches the entry? | Owner after import |
|---|---|---|
| QART-1585 Lead match | Yes | **Mahmoud Mohamed** (the rule entry's user) |
| QART-1585 nomatch | No | **ndc-staging-owner** (the rule's Default-user fallback) |

No imported record was left without an owner. Note: the Phone field enforces `^01[0125]\d{8}$` on import (`+2010…` and `10…` were refused as "Invalid format"), but the records API accepted `+2010…` values on create (see side observations).

### NDC-1696: Fixed
Blueprint AEO-01 (Leads/Standard), transition WebToReferral, During, "+ Add a field…" offers only Full Name, Email, Phone, Lead Source, Lead Status, Reason, Comment, Complaint Reason and Lead Owner. Approval Status is not offered. On blueprint RVW-008 (FieldPermissions) the picker offers 24 user-fillable fields and excludes Approval Status, Formula, Auto Number, Rollup and Subform. Nothing was saved.

### NDC-1672: Fixed
Mahmoud Samy (not an approver) opened pending record "AEX-01 QART-1872 AP". The header shows *Pending approval: 0/1 · Not an approver for this stage* and the panel shows *Locked while awaiting approval: AEO-01. This record is under approval, so its fields can't be edited until it is approved or rejected.* In Edit mode no record field is editable and the **Save button is disabled**, so no request can be sent.

### NDC-1652: Partially fixed
Approval process "test" (Deals), Rule Criteria:
- **Still failing (expected result 1):** the field dropdown of a criteria row still offers **Approval Status**, directly under the locked system condition "Approval Status is Not Submitted". The old stored criterion "Approval Status is Approved" is also still in the process.
- **Fixed (expected result 3):** saving is now refused with *"Approval Status can't be a condition in an approval process. Every approval rule already requires Approval Status to be Not Submitted, so this condition would only repeat that or stop the process from ever matching a record."* An inert rule can no longer be saved.
- **Re-check on the new build:** unchanged. Typing "Approval" in a criteria field picker still returns **Approval Status**, and nothing is saved.
- **Zoho (live, read-only):** in approval process "test" (Leads), Edit, the criteria field picker lists 38 fields with no approval-state field. Typing "Approval" shows **"No options found."** I left without saving, and the process was re-checked as unchanged. Zoho Deals was not checked.
- Evidence:
  - `screenshots/annotated/NDC-1652-vs-zoho.png`, side by side
  - `screenshots/failed-raw/NDC-1652-criteria-picker-offers-approval-status-new-build.png`
  - `screenshots/failed-raw/NDC-1652-criteria-picker-offers-approval-status.png` (old build)
  - `screenshots/failed-raw/NDC-1652-save-rejected-with-message.png`
  - `screenshots/zoho/zoho-1652-picker-search.png`, `zoho-1652-picker-open.png`, `zoho-1652-process.png`

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

### NDC-1438: Fixed (retested with screenshots on 2026-10-06, build `index-By9EzhPu`)
Retest evidence: `screenshots/NDC-1438-retest/NDC-1438-retest-evidence.png`, plus `1-rule-editor-date-only-picker.png`, `2-form-record-date-permission.png`, `3-rule-record-date-permission.png`, `results.json` and `results-records.json`.
- The editor's date-only picker sends `{"kind":"string","stringValue":"2026-09-12"}`. The save request was captured and stopped, so no rule was created.
- A scoped rule with that exact payload stores `kind: string, timestampValue: null`.
- Lead QART-1438-FORM (date entered directly) stores `"2026-09-10"`, and lead QART-1438-RULE (date set by the rule) stores `"2026-09-12"`. Both are the same plain-date shape, and the record pages show 10/09/2026 and 12/09/2026.
- The test rule and both leads were deleted afterwards.
- Side note: the editor's date input shows MM/DD (browser format), while record pages show DD/MM.

**First run (2026-10-05):**
- The rule editor's date picker now sends `{"date_3_9":{"kind":"string","stringValue":"2026-09-12"}}`. It used to send `"kind":"timestamp"`.
- The rule stores the string, and a lead that triggers the rule on create or on edit stores `date_3_9 = "2026-09-12"`.
- This matches a lead created through the form (`"2026-09-10"`).

### NDC-1437: Fixed
- The field-update picker (56 fields) no longer offers Auto Number Permission, the read-only Multi Line Permission, or Approval Status.
- Server guard: `POST /workflow/rules` with a field update on `auto_number_4_9` returns **422** *"Field 'auto_number_4_9' is read-only and cannot be changed."*, the same guard the record API applies.
- Leads no longer has a formula field, so the formula part couldn't be checked.

### NDC-1436: Fixed on all three paths (re-verified 2026-10-06 with annotated evidence)
Evidence for the ticket: `screenshots/annotated/NDC-1436-workflow-rule.png`, `NDC-1436-approval-process.png`, `NDC-1436-blueprint.png`. Raw screenshots and `runtime-results.json` are in `screenshots/NDC-1436-evidence/`.

Each test lead started with the address *12 QART Street / Cairo / Cairo Governorate / 11511 / Egypt*, and each automation set **only City**:

| Path | Setup shown | Address after | Result |
|---|---|---|---|
| Workflow Rule | Criteria plus a Field Update with 5 address inputs | 12 QART Street / **Cairo-WF** / Cairo Governorate / 11511 / Egypt | ✓ |
| Approval Process | Criteria plus Stage 1 Update Fields with 5 address inputs ("a blank part keeps the record's current value") | … / **Cairo-AP** / … | ✓ |
| Blueprint | Before = criteria; During = Address required + "is not empty" validation; After = Field update with address inputs, saved as `{"city":"Cairo-BP"}` | … / **Cairo-BP** / … | ✓ |

**Separate defect found (not NDC-1436):** in the blueprint transition's During form, a required Address field is a single text box showing **"[object Object]"** instead of the address parts. Left untouched, it sends the existing address back unchanged, so no data is lost. But the parts can't be edited there, and typing into the box would likely replace the address with plain text.

All `QART-1436-…` test configuration (rule, approval process, blueprint) and the 3 test leads were deleted. The ticket state was not changed.

**First run (2026-10-05), Workflow Rules only:**
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
| D2: approval events on the Timeline | ✅ On the new build: written with names and comments, and visible to the submitter. On the old build they weren't visible to the submitter (see NDC-1849) |
| D3: transparency of state and locks | ✅ Lock banners and "Not an approver for this stage" (see NDC-1672) |
| B1: entry guard | ✅ Shown as a locked system condition; contradictory criteria can't be saved (see NDC-1652) |
| B2: approved record doesn't re-enter on edit | Not testable with AEO-01, because all fields are locked after approval |

---

## Concurrent-session interference (NDC-1848, 1697, 1492, 1585)
NDC-1848, 1697 and 1492 need the tickets' own review process (AEX-01) switched on during the test, along with AEO-01 and a scoped workflow rule. NDC-1585 needs the assignment rule TestImport to be active. During the run, **another Claude session on this machine (agentex-installation-5f), using the owner account, was changing the same objects** and stayed busy for the rest of the run:
- 13:18:35 UTC: AEO-01 was switched **on**. It had been switched off a minute earlier for these tests.
- 13:19:09 UTC: review process AEX-01 was switched **off** with "Reject all held records", which rejected test lead "AEX-01 QART-1492 RP" without a reason.
- TestImport, active at the start of the run, was found **inactive**.
- That session's owner sign-ins also revoked this run's owner sessions (`401 SESSION_REVOKED`), because the account allows 5 sessions at once.

**Resolution:** the 4 were retested later, at 14:55–15:04 UTC, at the user's request. To avoid disturbing the other session:
- Each object was left in the state found at the start of that window. AEX-01 was **ON** (switched on by the other session at 14:41:39), so I didn't toggle it. TestImport was **off**, so I switched it on for the import only and back off afterwards.
- Config actions were done as Mahmoud Mohamed rather than the owner.
- A before/after snapshot of every relevant process and rule showed **no outside changes during the window**, so the results are trustworthy.
- The import history shows the other session also imported an `e2e-1585-import.csv` (13:21 and 17:17 local), so it was retesting the same tickets.

## Side observations (not part of these tickets)
- `PATCH /api/v1/modules/{id}/records/{rid}` with a partial `data` list **erases every field that isn't sent** (for example, the whole address). It behaves like a full replace. The app avoids this by always sending the full record; any API client that sends a partial update loses data.
- The AEO-01 blueprint "During" Tags section shows a raw tag ID.
- The Edit Action page shows a "Not Found" toast when it loads.
- **Inconsistent phone validation:** the Leads Phone field has the pattern `^01[0125]\d{8}$`. Import enforces it ("Invalid format"), but `POST /records` accepted `+201000001849`.
- Records held in a review or approval can't be deleted (`REVIEW_LOCKED` / `APPROVAL_LOCKED`) until the process finishes. That's sensible, but there's no way to discard a test record without approving or rejecting it first.

## Test data and configuration changes
| Item | State |
|---|---|
| Workflow rules QART-WF / QART-WF-A / QART-WF-B (created for 1436–1438) | Deleted |
| QART leads for 1436–1438 (7) | Deleted |
| Leads "AEX-01 QART-1849 AP", "AEX-01 QART-1872 AP", "AEX-01 QART-1492 RP" | Deleted. Their open approval/review was closed first, because held records can't be deleted (Recycle Bin) |
| Leads "AEX-01 QART-1492b RP", "AEX-01 QART-1848 RP", "AEX-01 QART-1697 RP", "QART-1585 Lead match", "QART-1585 nomatch" | Deleted (open reviews and approvals closed first) |
| Workflow rule "QART-1697 tavi retest (delete me)" | Deleted |
| Evidence leads "AEX-01 QART-EV-1849/1872 AP", "AEX-01 QART-EV-1492/1848/1697 RP" | Deleted (open reviews and approvals closed first) |
| Zoho reference org | Read-only. Approval process "test" was opened in Edit and left without saving; re-checked unchanged (inactive, "Lead Source IS Chat") |
| Assignment rule TestImport | Switched on only during the 1585 import; back **off**, as found |
| Approval process AEO-01 | **Inactive** when this run started. Left **active**, as the other session set it at 13:18:35. Switch it off once that session is done if it should be inactive |
| Review process AEX-01 | **Inactive** when this run started. Left **active**, as the other session set it at 14:41:39 (not touched) |
| Review process order | Changed for 1228, restored and verified |
| Plane tickets | Not modified |

## Evidence
Evidence was captured for **every ticket**, at the user's request ("capture everything"). This includes the fixed ones, as an exception to the usual "failed cases only" rule.

| Folder | What's in it |
|---|---|
| `screenshots/annotated/` | Side-by-side **TAVI vs live Zoho** for the 2 failing tickets: `NDC-1652-vs-zoho.png`, `NDC-1848-vs-zoho.png` (numbered boxes plus a Behaviour / Zoho / TAVI / Match table) |
| `screenshots/failed-raw/` | Unannotated TAVI originals for the failing parts (1652, 1848) |
| `screenshots/passed/` | TAVI screenshots of the fixed behaviour (40 images, all fixed tickets) |
| `screenshots/zoho/` | Zoho reference captures (read-only) |
| `screenshots/superseded-old-build/` | NDC-1849 failure on the old build, since fixed |

Fixed-ticket screenshots (`screenshots/passed/`):

| Ticket | Files |
|---|---|
| 1872 | `NDC-1872-timeline-delegated-names-and-comment.png`, `NDC-1872-delegate-sees-comment.png` |
| 1849 | `NDC-1849-submitter-sees-rejection-and-resubmit.png`, `NDC-1849-submitter-timeline-visible-new-build.png`, `NDC-1849-timeline-rejection-with-comment-new-build.png` |
| 1848 (fixed parts) | `NDC-1848-reject-record-dialog-button-label.png`, `NDC-1848-submitter-sees-rejection-and-resubmit.png`, `NDC-1848-after-resubmit-attempt-2.png` |
| 1697 | `NDC-1697-after-edit-still-rejected-resubmit-offered.png`, `NDC-1697-timeline-edit-no-approval-no-workflow.png` |
| 1696 | `NDC-1696-AEO01-during-picker.png`, `NDC-1696-RVW008-during-picker.png` |
| 1672 | `NDC-1672-non-approver-save-disabled-locked-fields.png`, `NDC-1672-not-an-approver-lock-banner.png` |
| 1645 | `NDC-1645-unused-fields.png`, `NDC-1645-approval-status-api-flags.png` (rendered API response), `NDC-1645-record-header-approval-chip.png` |
| 1585 | `NDC-1585-assign-step-testimport-selected.png`, `NDC-1585-import-result-2-added-0-errors.png` (the owners of the imported leads are in `logs/import-1585.log`) |
| 1541 | `NDC-1541-delete-dialog-RVW019.png`, `NDC-1541-deactivate-dialog-strings.png` (a rendered table of the shipped dialog text, not the live dialog) |
| 1515 | `NDC-1515-rule-inline-deals-target-layout.png`, `NDC-1515-rule-inline-layout-options.png`, `NDC-1515-saved-action-target-layout.png` |
| 1492 | `NDC-1492-one-field-rejected-review-still-open.png`, `NDC-1492-remaining-field-still-decidable.png` |
| 1445 | `NDC-1445-picker-new-types-1.png`, `NDC-1445-picker-new-types-2.png`, `NDC-1445-auto-number-disabled-computed.png` |
| 1443 | `NDC-1443-xlsx-…`, `NDC-1443-png-preview-download.png`, `NDC-1443-pdf-…`, `NDC-1443-txt-…` |
| 1438 / 1436 | `NDC-1436-1438-rule-editor-address-subfields-and-date.png` (stored values are in `logs/wf-server.jsonl` and `logs/wf-1436-controls.jsonl`) |
| 1437 | `NDC-1437-field-update-picker-no-read-only-fields.png` |
| 1328 | `NDC-1328-won-task-1.png`, `NDC-1328-lost-meeting-call-1.png`, `NDC-1328-lost-meeting-call-2.png` |
| 1228 | `NDC-1228-review-processes-saved-order.png`, `NDC-1228-reorder-mode.png` |
| 1234 (epic) | Covered by the 1849, 1872, 1672, 1652 and 1697 images |

Logs:
- `logs/ui-results.jsonl`: settings/UI tickets
- `logs/wf-server.jsonl`, `logs/wf-1436-controls.jsonl`: field-update tickets
- `logs/review-flows-1492-1848-1697.json`: review flows, including before/after snapshots of the shared processes
- `logs/import-1585.log`: import wizard run

Zoho comparison: done live for NDC-1652. Not checked live for NDC-1848, because no rejected review exists in the reference org and producing one would change Zoho.
