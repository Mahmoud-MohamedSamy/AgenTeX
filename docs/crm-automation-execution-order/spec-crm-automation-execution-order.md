# Spec: CRM Automation Execution Order (go-live functional test)

| | |
|---|---|
| App | TAVI CRM, `https://staging-crm.taviportal.com` (build `index-DWsxCNuD.js`, 18 Oct 2026) |
| Reference | Zoho CRM, org943261092 (full edition, read-only) + `reference/zoho-docs-inventory.md` |
| Order under test | **1 Assignment Rules → 2 Review Process → 3 Workflow Rules + Actions → 4 Approval Process → 5 Blueprint** |
| Modules | Leads, Deals, Tasks |
| Focus | Functional: positive, negative and edge cases. Each process alone, each handoff, the full chain, every entry point |
| Plan | `plan-automation-execution-order.md` (rules R1–R15, stages S0–S6) |
| Gaps | `crm-automation-missing-list.md`, items 1–9 → Group Z |
| Status | **Draft for your review. Nothing is run until you confirm.** |

Tags: `[pos]` positive · `[neg]` negative · `[edge]` edge · `[api]` checked through the API too · `[serial]` changes shared config, so run alone · 👤O admin (`ndc-staging-owner`) · 👤U QA Owner (`nameb56175@airhemp.com`, standard User profile) · 👤A QA Approver (`mmohamed@anyware.software`, Manager, org **Anyware**).

---

## 0 How to run

1. **Stage order** (plan §3): S0 → A, B, C, D, E (each process alone, in the go-live order) → F (handoffs) → G (full chain) → H (conversion and cross-module) → I (after the fact) → J (Tasks) → K (regression) → E2E → Z (gaps). A later group starts only if the groups before it have no blocking bug.
2. **Serial within a module.** Rules are per module, so one session per module (Leads / Deals / Tasks) can run at the same time. H (conversion) and anything tenant-wide run alone, in one session.
3. **Every QA rule is created inactive, then activated only for its case, then deactivated.** At most one QA process per type is active per module at a time, unless the case says otherwise.
4. **Asynchronous checks** (scheduled actions, blueprint SLA, automatic transitions) use a control: something that must happen to the same record. If the control never appears, the case is **Inconclusive**, never Pass.
5. **Every case records:** record id, which processes ran and in what order (Timeline + `GET /workflow/executions?recordId=` + review/approval history), and the owner, approval status, review status and blueprint state after each step.
6. **Evidence:** screenshots for **failed** cases only, annotated against Zoho (TAVI left, Zoho right). Passed cases get a one-line note.
7. **Automation:** every case is written as a Selenium/TestNG test in `automation/` (feature `crmautomationorder`, case ids as `@CaseId`), so retests are one command.

## 1 Preconditions

### 1.1 Accounts
| Role | Account | Used for |
|---|---|---|
| Admin 👤O | `ndc-staging-owner@taviportal.com` | Creating QA rules and processes; admin takeover |
| QA Owner 👤U | `nameb56175@airhemp.com` (standard User) | Creating, owning, editing and resubmitting records; the "submitter" |
| QA Approver 👤A | `mmohamed@anyware.software` (Manager, org **Anyware**) | Reviewer, approver, delegate; the "submitter's manager" |

- Credentials come from `docs/Credentials/Microsoft Edge Passwords.csv`. The file has **no header row**. Never print it or filter its cells.
- **S0 check:** 👤A must be 👤U's manager (reporting line), or the "submitter's manager" cases are Inconclusive. 👤U must have no approval or review permission.
- Sign in once per session. **Never retry sign-ins in a loop.** On 429 or "session revoked", stop and tell the user.

### 1.2 Baseline and tenant state (S0)
- Save `GET` of `/workflow/assignment-rules`, `/workflow/review-processes`, `/workflow/approval-processes`, `/workflow/rules`, `/workflow/actions` and `/modules/{id}/blueprints` (Leads, Deals, Tasks). The 18 Oct copy is `reference/tavi-baseline-2026-10-18.json`.
- **Teammates' rules that are active today:**

  | Process | Rules | Fires when |
  |---|---|---|
  | Assignment | AEX-01 | Import, Full Name contains "AEX-01" |
  | Approval | **AP** | Create & Edit, **Full Name contains "AP"** |
  | Workflow on Leads | AEX-01, temp, RP, ZZSWEEP-WF, ZZSWEEP-FU, "test last activity" | — |
  | Workflow on Tasks | ActionsOnTaskCompletionFromWorkqueue | — |
  | Blueprint | RVW-008 (Leads, FieldPermissions layout) | — |

  Before testing, read the criteria of each one. If any of them would fire on a "QA AEO" record, **stop and tell the user**. We don't deactivate teammates' rules ourselves.
- **Never put "AP" or "AEX" in a QA record name**, because of approval "AP" and assignment/workflow "AEX-01".

### 1.3 Test data
- Prefix **`QA AEO `**. Leads: Full Name `QA AEO <case>`. Deals: Deal Name `QA AEO <case>`. Tasks: Subject `QA AEO <case>`.
- **Guard condition on every QA rule:** Full Name / Deal Name / Subject **starts with "QA AEO"**, so QA rules never fire on real or teammates' records.
- Picklist values used by the cases: Lead Status, Lead Source, Deal Stage, Task Status / Priority (use existing values; never add picklist values on the Standard layout).
- Any layout or field change needs a separate QA layout, as on Desk (user rule, 14 Oct 2026), and only with the user's OK.

### 1.4 Cleanup
- At the end of each group, delete the QA records and QA rules/processes/blueprints it created. A blueprint that still governs records cannot have its picklist edited, so delete its records first.
- Final `GET` diff against the S0 baseline must show only teammates' changes.
- **Cannot be undone:** review history and approval history on deleted records. Keep the record ids in the run report.

### 1.5 Known blockers
- Staging sessions end every 10–15 minutes. Long cases must re-check that they're signed in before reading results.
- The shared admin account may be signed in elsewhere, and a new sign-in ends the other sessions.
- No email inbox for 👤U and 👤A is available, so email notifications are checked through the send log or Timeline only. If neither shows them: **Inconclusive**.

## 2 Surface and contract

### 2.1 Admin pages
| Process | Page | API |
|---|---|---|
| Assignment Rules | `/settings/automation/assignment-rules` | `/workflow/assignment-rules[/{id}]` |
| Review Process | `/settings/process-management/review-processes` | `/workflow/review-processes[/{id}][/active]`, `/reorder`, `/reviewable-field-types`, `/workflow/review-rejection-reasons` |
| Workflow Rules | `/settings/automation/workflow-rules`, `/settings/automation/actions` | `/workflow/rules[/{id}]`, `/activate`, `/deactivate`, `/execute`, `/evaluate`, `/reorder`; `/workflow/actions`; `/workflow/executions` |
| Approval Process | `/settings/process-management/approval-processes` | `/workflow/approval-processes[/{id}][/active]`, `/reorder` |
| Blueprint | `/settings/blueprints[/{moduleId}/{id}]` | `/modules/{m}/blueprints[/{id}]`, `/publish`, `/draft`, `/versions`, `/mass-include`, `/mass-exclude`, `/sort` |

### 2.2 Runtime
| What | API |
|---|---|
| Review queue and actions | `/workflow/reviews/queue`, `/me`, `/{req}`, `/{req}/fields/{f}/approve|reject`, `/{req}/approve|reject|resubmit|delegate|release-claim`, `/records/{m}/{r}/history` |
| Approval queue and actions | `/workflow/approvals/queue`, `/me`, `/{inst}/approve|reject|delegate|resubmit`, `/{inst}/takeover/approve|reject`, `/records/{m}/{r}`, `/records/{m}/{r}/status-reset` |
| Blueprint on a record | `/modules/{m}/records/{r}/blueprint-state`, `/modules/{m}/records/{r}/blueprint-transitions/{t}` |
| Execution log | `/workflow/executions` (workflow + assignment: `ruleId`, `assignmentRuleId`, `triggerKind`, `outcome`, `evaluatedAt`) |
| Entry points | UI create/edit, list inline edit, `POST /modules/{m}/records/mass-update`, import `/modules/{m}/import/*` (`trigger_automation`, `assignment_rule_id`), API create/update, Lead conversion, web forms `/web-forms` |

### 2.3 Expected order (from Zoho, see plan §1)
On create: **[pre-save checks] → Assignment → Review → Workflow → Approval → Blueprint**.
- Review holds the record: no workflow, approval or blueprint while it's pending or rejected.
- Approval holds the record: no blueprint while it's pending or rejected.
- Assignment runs only on create, and only for Web form, API and Import.
- Review runs only on create in Zoho. TAVI lets you pick channels: **record what TAVI does on edit**, and treat "review on edit" as TAVI behaviour, not a Zoho bug.

---

## A Assignment Rules alone (S1.1)
Active: one QA assignment rule only.

| ID | Case | Expected | Tags |
|---|---|---|---|
| A-01 | Leads rule "QA AEO AR" (Import + API, Category → 👤U). Create a lead via **API** with the rule | Owner = 👤U; `executions` row with `assignmentRuleId` | [pos][api] |
| A-02 | Same rule; **import** 1 lead choosing the rule | Owner = 👤U | [pos] |
| A-03 | Same rule; create the lead **manually in the UI** | Rule does **not** run; owner = creator (Zoho: no AR for manual create) | [neg] |
| A-04 | Channel = Import only; create via API | Rule does not run | [neg][api] |
| A-05 | Two entries: Entry 1 (Lead Source = Web) → 👤A, Entry 2 (All) → 👤U. Lead Source = Web | 👤A (first match wins) | [pos] |
| A-06 | Same; Lead Source = Phone | 👤U (falls to entry 2) | [pos] |
| A-07 | Entry 1 matches nothing; fallback = Default user 👤A | 👤A | [edge] |
| A-08 | Fallback = Leave unassigned; nothing matches | Owner = the importer/API user (record not ownerless); write down the exact value | [edge] |
| A-09 | Category with 👤U and 👤A (round robin); 4 records | Alternates U, A, U, A | [pos] |
| A-10 | Availability "Online status" on; 👤U signed out | 👤U skipped; next or fallback (Zoho: up to 5 min delay) | [edge] |
| A-11 | Follow-up task on entry | Task created for the new owner, linked to the lead | [pos] |
| A-12 | Rule inactive; API create naming it | Not applied; clear error or ignored, written down | [neg][api] |
| A-13 | Import "update existing only" with the rule | Rule does not change owners (Zoho: not offered for update) | [neg] |
| A-14 | Deals: rule on Deals via API | Same as A-01 on Deals | [pos] |
| A-15 | Tasks: rule on Tasks via API | Same as A-01 on Tasks | [pos] |
| A-16 | Edit an assigned lead so it matches another entry | Owner unchanged (AR runs on create only) | [neg] |
| A-17 | Deactivated target user in Category | Skipped → fallback (Zoho: default owner) | [edge][serial] (needs user OK) |

## B Review Process alone (S1.2)
Active: one QA review process (Leads, standard layout, fields Email + Phone, reviewer 👤A, Others → 👤O).

| ID | Case | Expected | Tags |
|---|---|---|---|
| B-01 | 👤U creates `QA AEO B01` via a ticked channel (Manual) | Status "Pending for Review"; record frozen; **hidden from list view** (Zoho); 👤A sees it in My Reviews | [pos] |
| B-02 | Channel not ticked (Manual off); 👤U creates in the UI | Not held | [neg] |
| B-03 | Entry criteria false | Not held | [neg] |
| B-04 | 👤A approves both fields | Record released, visible in the list, review history = approved | [pos] |
| B-05 | 👤A rejects Email (reason "Invalid Entry"), approves Phone | Record rejected as a whole; 👤U sees the rejection banner with field + reason + **Resubmit** (NDC-1848, NDC-1492) | [pos] |
| B-06 | 👤U edits the rejected field, then **Resubmit** | Back to Pending; attempt 2; 👤A sees it again | [pos] |
| B-07 | 👤U edits while **pending** | Edit blocked ("Frozen while under review") | [neg] |
| B-08 | 👤U edits a **rejected** record and saves **without** resubmitting | Still rejected; review not ended (NDC-1697) | [neg] |
| B-09 | Reject without a reason | Blocked; a reason is required | [neg] |
| B-10 | Rule 1 criteria → reviewer 👤A; record fits no rule | Goes to **Others** (👤O) | [edge] |
| B-11 | 👤U (no review permission) opens the review queue/record | Cannot act (UI + API 403) | [neg][api] |
| B-12 | 👤A **delegates** to 👤O | 👤O can act; history shows the delegation (TAVI extra) | [pos] |
| B-13 | SLA escalation 1 minute → 👤O | After about 1 minute 👤O is notified (control: notification row) | [edge] |
| B-14 | Deactivate the process while B-xx records are held: "Reject all" | Each held record → rejected, 👤U asked to resubmit | [pos][serial] |
| B-15 | Same with "Release unreviewed" | Records released, flagged unreviewed | [pos][serial] |
| B-16 | Delete a process holding records | Blocked: "holding N record(s). Deactivate it first" | [neg] |
| B-17 | Workflow rule creates a lead (Automation channel ticked) | Created lead is held | [pos] |
| B-18 | Import (Excel channel ticked) | Imported lead held | [pos] |
| B-19 | API create (API channel ticked) | Held; check that a "legacy API caller" bypass matches the warning text | [pos][api] |
| B-20 | **Edit** an approved-review lead so it matches the criteria again | Write down whether it re-enters review (Zoho: create only) | [edge] |
| B-21 | Deals: same as B-01 on Deals | Held | [pos] |
| B-22 | Reorder two review processes | Saved order is used: first match wins (NDC-1228) | [edge] |

## C Workflow Rules + Actions alone (S1.3)
Active: one QA workflow rule at a time.

| ID | Case | Expected | Tags |
|---|---|---|---|
| C-01 | On Create, Field Update Lead Status = Contacted | Set once on create | [pos] |
| C-02 | On Edit, same action; create the lead | Does **not** fire on create (NDC-2205 pattern) | [neg] |
| C-03 | On Edit; edit any field | Fires | [pos] |
| C-04 | Create or Edit, Recurring; create + 2 edits | Fires 3 times | [pos] |
| C-05 | Create or Edit, **One time** | Fires once even if it still matches later | [edge] |
| C-06 | Field Changed (Lead Source) | Fires only when Lead Source changes, not when other fields change | [pos][neg] |
| C-07 | Delete trigger with Webhook action | Fires on delete; field update actions not allowed on Delete (validation) | [pos][neg] |
| C-08 | Date-Time: 2 minutes after a date field | Fires at the time (control: field update marker) | [edge] |
| C-09 | Criteria false | Does not fire; execution outcome "criteria not matched" | [neg] |
| C-10 | Each action type once: Owner Assignment → 👤A, Email, Task, Create Record (Deal), Add Tags, Remove Tags, Webhook | Each one runs; Timeline + executions show each dispatch | [pos] |
| C-11 | Scheduled action 2 minutes; record stops matching before then | Cancelled (UI text promises this) | [edge] |
| C-12 | Rule A field update makes rule B match (same module) | B fires after A (Zoho: chaining allowed) | [edge] |
| C-13 | Rule updates its own trigger field (loop) | Stops (Zoho: self-loop stops after 2 runs; A→B→A after 3) | [edge] |
| C-14 | Limits: actions per rule, conditions per rule, rules per module (`caps.*`); add a 2nd Field Update to one rule | Limit message at the cap; write down whether one action per type is enforced | [edge] |
| C-15 | Deactivate a rule with pending scheduled actions | Write down whether pending actions run or are dropped (Zoho: admin chooses) | [edge] |
| C-16 | Mass update 3 leads from the list | Workflow fires for each (Zoho: yes) | [pos] |
| C-17 | Inline edit in the list | Fires as an edit | [pos] |
| C-18 | Deals and Tasks: one On Create rule each | Fires | [pos] |
| C-19 | Reorder two rules with conflicting field updates | Order follows the list | [edge] |

## D Approval Process alone (S1.4)
Active: one QA approval process (Leads, Create & Edit, criteria guard, Level 1 = submitter's manager 👤A).

| ID | Case | Expected | Tags |
|---|---|---|---|
| D-01 | 👤U creates a matching lead | Chip "Pending approval"; record locked for 👤U; 👤A sees it in My Approvals | [pos] |
| D-02 | 👤A approves | Approved; final actions run (field update marker) | [pos] |
| D-03 | 👤A rejects with a comment | Rejected; 👤U sees "rejected by …, comment" and **Resubmit** (NDC-1849) | [pos] |
| D-04 | 👤U resubmits after editing | Pending again; same rule first (Zoho) | [pos] |
| D-05 | Resubmit when no process matches any more | "No active approval process matched — the record was released" | [edge] |
| D-06 | 👤U tries to approve their own record | Blocked: "You can't approve a record you submitted" | [neg] |
| D-07 | 👤U edits a pending record (record modification = No fields) | Blocked | [neg] |
| D-08 | Record modification "Specific fields" while pending | Only those fields editable | [pos] |
| D-09 | Approved record edited again (Create & Edit) | **Does not** re-enter (Approval Status guard, US-B2) | [neg] |
| D-10 | "Reset approval status if changed" field edited by a permitted user | Sends it back for approval (US-B3) | [edge] |
| D-11 | Two levels (👤A then 👤O) | Level 1 then Level 2; "Level 1 of 2" bar | [pos] |
| D-12 | 👤A delegates to 👤O | 👤O can act; "Delegated to you by…" (NDC-1872: names, not ids) | [pos] |
| D-13 | Process admin 👤O takes over | Decision recorded as admin override | [pos] |
| D-14 | Execute On = Create only; edit a record into the criteria | Not submitted | [neg] |
| D-15 | Execute On = Edit only; create a matching record | Not submitted | [neg] |
| D-16 | Deactivate the process with pending records | Pending stays approvable; new matches not submitted (Zoho) | [edge][serial] |
| D-17 | Delete the process with pending records | "Records currently in this process are unaffected": write down the lock state | [edge][serial] |
| D-18 | Approval Status not editable by normal users; editable with "Can Edit Record Approval Status" | US-A2/A3 | [pos][neg] |
| D-19 | Deals: matching deal | Same as D-01 on Deals | [pos] |
| D-20 | Tasks: matching task | Same as D-01 on Tasks (Zoho: approval on Tasks exists, seen live) | [pos] |
| D-21 | Convert / Delete a pending lead | Blocked (Zoho: Convert and Delete disabled while pending) | [neg] |

## E Blueprint alone (S1.5)
Active: one QA blueprint per module (Leads: Lead Status; Deals: Stage; Tasks: Status), 3 states, transitions with During and After actions.

| ID | Case | Expected | Tags |
|---|---|---|---|
| E-01 | Create a matching lead | Blueprint strip shows the start state; state field locked ("Governed by blueprint") | [pos] |
| E-02 | Entry criteria false | Not governed | [neg] |
| E-03 | Run a transition with required During fields empty | Blocked | [neg] |
| E-04 | Run it with fields filled | State moves; After actions run (field update, task, email) | [pos] |
| E-05 | Transition owner = 👤A; 👤U opens the record | 👤U doesn't see the transition button | [neg] |
| E-06 | Edit the state field directly | Blocked (only workflow may override, Zoho) | [neg] |
| E-07 | Workflow field update on the state field | Allowed (Zoho: workflow can override blueprint); write down the resulting state | [edge] |
| E-08 | Automatic transition after 2 minutes | Fires (control: After field update) | [edge] |
| E-09 | SLA 1 minute on a state | Escalation actions fire | [edge] |
| E-10 | Common transition from any state | Available from every state | [pos] |
| E-11 | Parallel transition | Record must finish every branch before moving | [edge] |
| E-12 | Draft edit of a published blueprint | Records follow the published version until Publish | [edge] |
| E-13 | Mass exclude one record | Leaves the blueprint; its field becomes editable. **Deferred (20 Oct 2026): mass include / exclude has no TAVI CRM screen yet; run when it is implemented.** | [pos] |
| E-14 | Deals blueprint on Stage with a pipeline | Asks which pipeline (NDC-1326) | [pos] |
| E-15 | Tasks blueprint on Status | Works on Tasks (Zoho: blueprint on Tasks, seen live) | [pos] |
| E-16 | After-transition Task/Call/Meeting | Contact Name / Related To show names, not ids (NDC-1328) | [pos] |
| E-17 | Field update writes an address | Subfields kept (NDC-1436) | [pos] |
| E-18 | Two blueprints match the same record | Only the first in the list runs (Zoho) | [edge] |

---

## F Handoffs: two processes at a time (S2)
Each case activates exactly the two QA processes named. "Marker" means a QA workflow field update that writes `Description = "WF <case>"`, so we can see whether workflow ran.

| ID | Pair | Case | Expected | Tags |
|---|---|---|---|---|
| F-01 | AR → RP | API create matching both | Owner set **before** review; the reviewer/"record owner" reviewer is the **assigned** owner | [pos][api] |
| F-02 | AR → WF | API create; WF criteria "Owner = 👤A" | WF sees the assigned owner → fires | [pos] |
| F-03 | AR → AP | API create; approver = Record Owner | Approver = assigned owner, not the API user | [pos] |
| F-04 | AR → BP | API create; BP transition owner = record owner | Assigned owner can run the transition | [pos] |
| F-05 | RP → WF | Create matching both | **No marker while review is pending** | [pos] |
| F-06 | RP → WF | Review approved | Marker appears **once**, after review approval | [pos] |
| F-07 | RP → WF | Review rejected, then 👤U edits without resubmitting | **No marker** (NDC-1697) | [neg] |
| F-08 | RP → WF | Rejected → resubmit → approved | Marker once, after the final approval | [pos] |
| F-09 | RP → AP | Create matching both | Not "Pending approval" while review is pending | [pos] |
| F-10 | RP → AP | Review approved | Then "Pending approval" | [pos] |
| F-11 | RP → AP | Review rejected; 👤U edits to match AP | **Still not in approval** (NDC-1697) | [neg] |
| F-12 | RP → BP | Create matching both | Not governed by blueprint while in review (NDC-1211) | [pos] |
| F-13 | RP → BP | Review approved | Then governed | [pos] |
| F-14 | WF → AP | WF field update makes the record match AP (AP criteria = Lead Status Qualified; WF sets Qualified) | Same save: record goes to approval with the updated value | [pos] |
| F-15 | WF → AP | WF field update makes the record **stop** matching AP | Not submitted | [neg] |
| F-16 | WF → BP | WF sets a field that BP entry needs | Governed after WF | [pos] |
| F-17 | AP → BP | Create matching both | **Not governed while pending approval** (NDC-909) | [pos] |
| F-18 | AP → BP | Approved | Then governed | [pos] |
| F-19 | AP → BP | Rejected | Never governed while rejected (Zoho) | [neg] |
| F-20 | BP → AP | Record already in a blueprint; edit so it matches an Edit approval process | Write down: Zoho says approval does not start on a blueprint record (community) | [edge] |
| F-21 | WF → RP | WF "Create Record" makes a lead; review channel "Automation" ticked | New lead held for review | [pos] |
| F-22 | Skip | AR + AP (no review, no WF) | AP runs right after AR, no stall | [pos] |
| F-23 | Skip | RP + BP (no WF, no AP) | BP right after review approval | [pos] |
| F-24 | Skip | WF + BP only | BP right after WF | [pos] |

## G Full chain, all five active, by entry point (S3)
All five QA processes active on the module. Expected each time: **AR → RP (hold) → [approve review] → WF (marker) → AP (hold) → [approve] → BP (governed)**, each step once, Timeline in this order.

| ID | Module | Entry point | Notes | Tags |
|---|---|---|---|---|
| G-01 | Leads | UI create by 👤U | AR does **not** run (manual); rest in order | [pos] |
| G-02 | Leads | API create with the assignment rule | All five in order | [pos][api] |
| G-03 | Leads | Excel import, rule chosen, "Trigger workflow rules" **on** | All five? Write down which run (see Z1) | [pos] |
| G-04 | Leads | Excel import, "Trigger workflow rules" **off** | Write down: Zoho runs nothing; TAVI review "Excel import" channel may still hold | [edge] |
| G-05 | Leads | Import **update existing** | No AR (Zoho); write down which processes run on update | [edge] |
| G-06 | Leads | Clone of a released record | Treated as create (AR no) | [pos] |
| G-07 | Leads | Mass update into the WF/AP criteria | WF → AP → BP in order for each record (no AR, no RP) | [pos] |
| G-08 | Leads | Web form submission | AR (if the form uses the rule) → RP (web form channel) → … | [pos] |
| G-09 | Leads | Record created by a WF Create Record action | RP if Automation is ticked, then the chain | [edge] |
| G-10 | Leads | Record created by a BP After "Create record" | Same as G-09 | [edge] |
| G-11 | Deals | UI create | RP → WF → AP → BP | [pos] |
| G-12 | Deals | API create with the rule | All five | [pos][api] |
| G-13 | Deals | Import | As G-03 | [pos] |
| G-14 | Tasks | UI create | WF → AP → BP (RP on Tasks: TAVI extra, test with and without) | [pos] |
| G-15 | Tasks | API create with the rule | AR → … | [pos][api] |
| G-16 | Any | Timeline of G-02 | Lists each process with time, in order (Zoho: "The Timeline will display the order each process was executed") | [pos] |
| G-17 | Any | Same save fires 2 workflow rules + 1 approval | Order WF1, WF2 (list order) → AP; each once | [edge] |
| G-18 | Any | API create with an empty `trigger` list (if TAVI supports it) | Write down what's skipped (Zoho: `[]` skips WF, AP, BP) | [edge][api] |

## H Lead conversion and cross-module (run alone)
| ID | Case | Expected | Tags |
|---|---|---|---|
| H-01 | Convert a released lead (no holds) to a Deal; Deals has all five QA processes | Write down which Deal processes run (Zoho: undocumented; AR does not run, owner = convert dialog) | [edge] |
| H-02 | Convert a lead **pending review** | Blocked | [neg] |
| H-03 | Convert a lead **pending approval** | Blocked (Zoho: Convert disabled) | [neg] |
| H-04 | Convert a lead **in a blueprint** | Allowed only by a Convert transition, if any; write down | [edge] |
| H-05 | Converted lead has pending scheduled WF actions | Dropped (Zoho) | [edge] |
| H-06 | WF on Leads creates a Task; Tasks has WF + AP | Task runs its own chain | [pos] |
| H-07 | Mass convert | Same as H-01 for each lead | [edge] |

## I After the fact (S4)
| ID | Case | Expected | Tags |
|---|---|---|---|
| I-01 | Edit while review is pending | Blocked; no WF/AP | [neg] |
| I-02 | Edit while approval is pending (no fields editable) | Blocked; no BP | [neg] |
| I-03 | Deactivate the review process while a record waits; Release unreviewed | Record continues to WF → AP → BP in order | [edge][serial] |
| I-04 | Deactivate the approval process while pending | Stays pending (Zoho); BP still waits | [edge][serial] |
| I-05 | Deactivate the blueprint while a record is in it | Write down the state field lock after | [edge][serial] |
| I-06 | Delete the QA workflow rule between review approval and the WF step | No crash; chain continues to AP | [edge] |
| I-07 | Two users save the same held record (two tabs) | Second save gets a conflict message, not a silent overwrite | [edge] |
| I-08 | Approval status reset (admin) on an approved record in a blueprint | Write down: re-entry vs blueprint (F-20) | [edge] |
| I-09 | Delete a record pending review, then restore it from the Recycle Bin | Write down which holds come back | [edge] |
| I-10 | Re-run AR by workflow "Owner Assignment" on edit | Owner changes; no review re-entry | [pos] |

## J Tasks module specifics
| ID | Case | Expected | Tags |
|---|---|---|---|
| J-01 | Each process can be created on Tasks | All five offer Tasks (seen 18 Oct) | [pos] |
| J-02 | Review on Tasks (TAVI extra) | Works as on Leads; mark as TAVI extra, not a Zoho behaviour | [edge] |
| J-03 | Task created from a Lead/Deal "Assign Task" (approval level option) | That task runs the Tasks chain | [edge] |
| J-04 | Workqueue task completion triggers the teammate rule "ActionsOnTaskCompletionFromWorkqueue" | Not affected by QA rules (guard) | [neg] |

## K Regression of earlier order and process bugs (S5)
| ID | Bug | Check |
|---|---|---|
| K-01 | NDC-1211 | Blueprint does not take an imported lead that is in review |
| K-02 | NDC-1697 | Editing a rejected-review record does not release it into approval or workflow |
| K-03 | NDC-909 | Blueprint waits for approval (Deals) |
| K-04 | NDC-1848 / NDC-1849 | Rejected review / approval goes back to the submitter with Resubmit |
| K-05 | NDC-1492 / NDC-2066 | Field-level rejection ends the review correctly; the Timeline names the reviewer in one note |
| K-06 | NDC-1228 | Review process reorder is saved |
| K-07 | NDC-1541 | "Re-evaluate against other processes" |
| K-08 | NDC-1445 / NDC-1443 | Field types reviewable; File Upload under review renders as a file |
| K-09 | NDC-1645 / 1646 / 1652 | Approval Status field locked in the layout; editable only with the permission; not offered in criteria |
| K-10 | NDC-1672 | Save disabled when no field is editable |
| K-11 | NDC-1872 | Delegation shows user names and keeps the comment |
| K-12 | NDC-1326 / 1328 / 1436 | Blueprint pipeline prompt; names not ids; address field update |
| K-13 | US-A1…D3 (NDC-1235…1247) | Each story's acceptance, in Ready For Test under epic NDC-1234 |

## E2E journeys
| ID | Journey | Steps |
|---|---|---|
| E2E-1 | Web lead, happy path | Web form → AR to 👤U → review by 👤A approved → WF sets status + creates a follow-up task → AP by 👤A approved → BP runs to the final state → convert to Deal → Deal chain |
| E2E-2 | Imported lead, review rejection and recovery | Import with the rule → review rejects Email → 👤U fixes it and resubmits → approved → WF → AP → BP |
| E2E-3 | Approval rejection and recovery | API lead → review OK → WF → AP rejected → 👤U edits and resubmits → approved → BP |
| E2E-4 | Deal pipeline | UI deal → review → WF field update qualifies it for AP → approved → Stage blueprint to Closed Won |
| E2E-5 | Task approval | WF on Leads creates a task → Tasks AP → BP on Status |
| E2E-6 | Negative recovery | Admin deactivates the review process mid-flight (Release unreviewed) → records continue in order with no duplicates |

## U Setup screens and record page (UI layer, added 21 Oct 2026)
Selenium, browser = Owner; automated in `automation/.../crmautomationorder/UiSmokeTest.java` (groups crm-ui, smoke). Every process is named "QA AEO UI …" and restricted to names starting with that prefix; whatever a case creates is deleted on screen, with an API safety net.
| ID | Case | Expected | Tags |
|---|---|---|---|
| UI-01 | Assignment rule created on screen (Leads, Web Form only, one entry "Name starts with …" → a user) | Saved, listed, reopens with its name, Delete removes it | [pos] |
| UI-02 | Review process created on screen on a dedicated layout (one field, one reviewer) | Saved, listed, reopens, Delete removes it. Saving without a field shows "Pick at least one field to review." | [pos] |
| UI-03 | Workflow rule created on screen (On Create, condition, inline Field Update) | "Save & Activate" lists it Active; Deactivate from the list makes it Inactive; reopens; Delete removes it | [pos] |
| UI-04 | Approval process created on screen (criteria, level-1 approver, process admin) | Saved, listed, reopens, Delete removes it | [pos] |
| UI-05 | Blueprint designed on screen (two states, named transition) and saved as draft | No open issues once the transition is named; draft listed, reopens, Delete removes it | [pos] |
| UI-06 | Record page while review, approval and blueprint all apply to a lead | In review: review panel, "Frozen while under review", no approval, no transition. After review: "Pending approval", no transition. After approval: blueprint panel with current state and transition | [pos] |
| K-10 (UI) | Lead pending approval opened by a user who is not the approver (NDC-1672) | "Locked while awaiting approval", no editable field, Save disabled | [neg] |

## Z Gaps from the missing list
| ID | Item | How to test | Expected (Zoho) |
|---|---|---|---|
| Z1 | 1 | Import with "Trigger workflow rules" on, with AP and BP active | Zoho: approval and blueprint also run. Write down what TAVI does |
| Z2 | 2 | Import wizard → Manual Record Approval | Zoho: imported records wait in Approve Leads. TAVI: "Coming soon" |
| Z3 | 3 | Workflow WHEN → Score / Notes | Zoho: Record Score, Record Notes triggers |
| Z4 | 4 | Workflow Add action → Meeting, Call, Function, Create Connected Record | Offered in Zoho |
| Z5 | 5 | Workflow Owner Assignment → "Assignment Rules"; online only; email; transfer related | Offered in Zoho |
| Z6 | 6 | Review actions → Functions | Zoho: Add Function |
| Z7 | 7 | Approval level, Role → Anyone / Everyone; Everyone → sequential/parallel | Offered in Zoho |
| Z8 | 8 | Approval Call Functions runs | Zoho runs the function. TAVI: no-op |
| Z9 | 9 | Blueprint After → Convert, Custom actions, Tags, Create record | Offered in Zoho |

## Traceability: order rules → cases
| Rule (plan §1) | Cases |
|---|---|
| R1 order on create | G-01…G-18, E2E-1 |
| R2 assignment first | F-01…F-04, G-02 |
| R3 review holds | B-01, B-07, F-05, F-09, F-12, I-01 |
| R4 review rejected stays held | B-05, B-08, F-07, F-11, K-02 |
| R5 review approved → WF once → AP → BP | B-04, F-06, F-08, F-10, F-13 |
| R6 WF before AP | F-14, F-15, G-17 |
| R7 approval holds BP | D-01, F-17, F-18, I-02, K-03 |
| R8 approval rejected, no BP | D-03, F-19, E2E-3 |
| R9 BP last; no re-entry | D-09, D-10, E-06, E-07, F-20, I-08 |
| R10 edit behaviour | A-16, B-20, C-02, C-03, D-14, D-15, G-07 |
| R11 skipped stages | F-22, F-23, F-24 |
| R12 every entry point | G-01…G-10, G-13, G-15 |
| R13 Timeline / log order | G-16 |
| R14 lead conversion | H-01…H-05, H-07 |
| R15 Tasks | A-15, C-18, D-20, E-15, G-14, G-15, J-01…J-04 |

## Reporting
- `executions/execu_<date>_crm-automation-order/report.md` (one row per case: verdict, record id, observed order) and `bug-report.html`.
- Failed cases: annotated TAVI-vs-Zoho image. Passed cases: a one-line note.
- Tokens: report lengths only, never values.
- Revert proof: final `GET` diff against the S0 baseline.
- Nothing is filed in Plane until the user says so.
