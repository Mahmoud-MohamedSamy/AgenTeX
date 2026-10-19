# CRM Automation Execution Order: go-live test plan (draft for review)

| | |
|---|---|
| App | TAVI CRM, `https://crm.taviportal.com` (tenant NDC-Staging) |
| Reference | Zoho CRM, org940103646 (read-only, Edge only) |
| Order under test | **1 Assignment Rules → 2 Review Process → 3 Workflow Rules + Actions → 4 Approval Process → 5 Blueprint** |
| Plane | NDC-1255 "Automation Execution Order" (empty holder under NDC-1248 "Test Cases - CRM") |
| Written | 18 Oct 2026, v2 with your answers (§7). Draft only. Nothing has been changed on TAVI or Zoho. |
| Modules | **Leads, Deals, Tasks** |
| Entry points | **All**: UI create, UI edit (detail page, inline edit, list view), clone, Excel import (new and update), API create and update, lead conversion (Lead → Deal), web forms, mass update, records created by a workflow "Create Record" action, and blueprint transitions. An entry point the build doesn't have is listed in the missing list, not tested. |

---

## 1. What "correct order" means (the rules we will test)

We test each rule below for every way a record can enter the CRM. Rules marked *(confirm)* come from the Zoho order you gave and from memory. In phase 2 I will check them against the Zoho help pages and live in Zoho before the spec relies on them.

| # | Rule | Already reported |
|---|---|---|
| R1 | When a record is created, the processes run in this order only: Assignment → Review → Workflow → Approval → Blueprint. | NDC-1211 (Done) |
| R2 | **Assignment** runs first, so the processes after it see the new owner. For example, a workflow condition on Owner or an approver set to "record owner" uses the assigned owner, not the creator. | — |
| R3 | **Review holds the record.** While a review is pending, no workflow, approval or blueprint runs, and the record is frozen. | NDC-1211 (Done) |
| R4 | **Review rejected.** The record stays with the owner until it is resubmitted. Editing a field doesn't release it, and it doesn't trigger workflow or approval. | NDC-1697 (Done), NDC-1848 (Done) |
| R5 | **Review approved.** Only then do workflow rules run (once, not twice), followed by approval and blueprint. | — |
| R6 | **Workflow before approval.** A workflow field update can make the record match an approval process in the same save. Approval then sees the updated value. *(confirm)* | — |
| R7 | **Approval holds the record.** While approval is pending, the blueprint doesn't take control. The blueprint starts only after the record is approved. | NDC-909 (Done, Deals) |
| R8 | **Approval rejected.** The blueprint never starts, and the record can be resubmitted. | US-D1 (NDC-1245, Backlog) |
| R9 | **Blueprint last.** Once the blueprint owns the record, a transition's field updates follow the rules for edits. Re-entry into approval is blocked by the Approval Status guard. *(confirm)* | US-B1/B2/B3 (NDC-1239..1241) |
| R10 | **On edit,** assignment and review don't run again unless their trigger includes edit. Workflow "on edit / field changed" rules run, then approval, in order. *(confirm)* | — |
| R11 | **Skipped stages.** If a stage has no matching rule, the next stage runs straight away. There are no stalls or duplicate runs, for any combination of active processes. | — |
| R12 | **Every entry point in the header follows the same order** (create and edit paths). | NDC-1211 (import path) |
| R14 | **Lead conversion:** the order runs on the Deal created by conversion. Rules on the Lead don't leak onto the Deal. A Lead still held by review or approval can't be converted. *(confirm)* | — |
| R15 | **Tasks:** only the processes Zoho supports on Tasks are tested there. Phase 2 checks this; for example, Zoho may not offer review, approval or blueprint on Tasks. A process Zoho doesn't support on Tasks isn't a gap. Tasks created by a workflow action on a Lead or Deal run their own Task rules. | — |
| R13 | The Timeline and the executions log show the stages in the order they ran. | US-D2 (NDC-1246) |

## 2. Phases (you review after phase 1 and after phase 2)

| Phase | What I do | Output | Changes the tenant? |
|---|---|---|---|
| **1. Plan** (this file) | Read Plane, earlier specs and memory, then write this plan. | this file | No |
| **2a. Spec** | Write a functional spec covering positive, negative and edge cases: each process alone, then each handoff, then the full chain, for every entry point. | `spec-crm-automation-execution-order.md` | No |
| **2b. Missing list** (runs in parallel with 2a) | For each of the five processes, compare TAVI with Zoho (settings, triggers, actions, holds, order). Each gap gets annotated evidence, TAVI on the left and live Zoho on the right. | `crm-automation-missing-list.md` + `evidence/` | No (Zoho is read-only) |
| **Review 2** | You review the spec and the missing list. | your comments | — |
| **3. Testing** | Run the spec in the stage order in §3. Automate everything in the Selenium framework (`automation/`) so retests are one command. | run report, bug report (HTML), annotated evidence for **failed cases only** | Yes: QA rules and records only, cleaned up afterwards |
| **4. Close** | Your go-live verdict input. File bugs and the missing list in Plane only after you OK it. | Plane items | Plane only, after your OK |

## 3. Test execution order for go-live (stages)

Stages follow the automation order. Stage N starts only when the stage before it has no blocking bug, because a later process can't be judged while an earlier one is broken.

| Stage | Scope | Why at this point |
|---|---|---|
| **S0 Setup** | Accounts, baseline JSON of every existing rule and process, map teammates' active rules, and pick the QA module. Create a CRM login feature in `automation/`, which today only has Desk. | Everything depends on it |
| **S1 Each process alone** | S1.1 Assignment Rules → S1.2 Review Process → S1.3 Workflow Rules + Actions → S1.4 Approval Process → S1.5 Blueprint. Cover the main settings, triggers and criteria, positive and negative, with only that process active. | Proves each piece before chaining |
| **S2 Handoffs (pairs)** | AR→RP, RP→WF, WF→AP, AP→BP, plus skip pairs (AR→WF, RP→AP, WF→BP, AR→BP). Check the hold, the release and that each stage runs once. | Most order bugs sit at a handoff |
| **S3 Full chain** | All five active on one record. Run it for each entry point on Leads, then Deals, then Tasks (only the processes Tasks supports), then lead conversion. Include the happy path and every rejection branch. | The real go-live journeys |
| **S4 After the fact** | Edit while held (review pending or rejected, approval pending or rejected), resubmit, recall, delegate, deactivate a process mid-flight, delete a rule while records are held, and two users saving the same record. | Where NDC-1697-type bugs live |
| **S5 Regression** | Retest every Done order, review, approval and blueprint bug, about 25 items including NDC-1211, NDC-1697, NDC-909, NDC-1848, NDC-1492, NDC-1228, NDC-1326 and NDC-1328. Check the open US-A..D stories under epic NDC-1234 (Ready For Test). | Proves nothing came back |
| **S6 Sign-off** | Go-live summary: pass or fail per rule R1–R13, open bugs by severity, gaps and blockers. | Your decision |

## 4. Parallel agents and sessions (I'll ask before starting any of them)

| When | Agents | Split | Why it is safe |
|---|---|---|---|
| Phase 2 | 1 research agent (Zoho CRM docs) | Help pages for all five processes and the order-of-execution page | Read-only web research |
| Phase 2 | Me | TAVI build map (bundle and API), then live Zoho captures | Done one after the other, not in parallel with TAVI captures (your earlier rule) |
| Phase 3 | Up to 3 test sessions | **One module per session: Leads / Deals / Tasks**, serial inside a module. Lead conversion and the cross-module cases (Lead → Deal, workflow-created Tasks) run last, in one session. | Rules are per module, so sessions don't trigger each other's rules. The account limit is 5 sessions. |

Shared settings (anything tenant-wide) are always changed by one session only, and I ask you first.

## 5. Test data and safety rules

- Every QA record and rule is named `QA AEO …`. Every QA rule has a guard condition, *Name/Subject starts with "QA AEO "*, so it never fires on real or teammates' records.
- I don't touch teammates' rules, and I don't change shared settings or layouts without your OK. Any layout or field change goes on a separate QA layout.
- Zoho CRM stays read-only.
- Evidence: screenshots for **failed cases only**, each annotated side by side against Zoho. Passed cases get a text note.
- Cleanup: delete QA rules and records at the end, then prove it with a final GET compared against the S0 baseline.

## 6. Blockers and risks I already know about

1. **A second, lower-profile account is critical.** Review and approval need a submitter, a reviewer or approver and a record owner who are different users. The custom-views spec recorded that `CRM_USER_ALT1` stays stuck on "Signing in…". Without a working second user, R4, R5, R7 and R8 can only be run owner-to-owner, which is partly inconclusive.
2. The owner account has a 5-session limit and a 5-minute token. Teammates use the same account, so there will be sign-outs.
3. Teammates may have active rules or processes on Leads and Deals that fire on our records. The S0 baseline will show this.
4. Asynchronous stages (scheduled workflow actions, blueprint SLA) need a control marker so that "didn't happen" isn't reported as a pass.

## 7. Your answers (18 Oct 2026)

1. **Modules:** Leads, Deals and Tasks.
2. **Entry points:** all of them (see the header).
3. **Extra users:** still open. See the note below.
4. **Obstacles and conflicts:** I stop and tell you, and you resolve them. I don't work around a conflict on my own.
5. **Gates:** plan → your OK → spec and missing list with evidence → your OK → testing. I don't move to the next phase without your confirmation. **Nothing goes to Plane unless you tell me.**

### Note on Q3: why extra users are needed

Review and approval are four-eyes processes. The person who saves the record must not be the person who reviews or approves it. Many cases can't be tested properly with one account:

| Case | Needs |
|---|---|
| Reviewer rejects → owner sees the rejection, fixes and resubmits (R4) | owner ≠ reviewer |
| Approver approves or rejects → the submitter sees the result, and the record is locked for the submitter but not for the approver (R7, R8) | submitter ≠ approver |
| Assignment gives the record to user X → review or approval routes to "record owner" or "owner's manager" (R2) | at least 2 users to assign between |
| Field locks and the "Can Edit Record Approval Status" and "Can Edit Fields Locked By Approval Process" permissions (US-A3, US-C3) | one user with the permission, one without |
| Delegation | approver + delegate |

**What I need:** two extra CRM users on NDC-Staging (in addition to ndc-staging-owner) that can sign in:
- **User A, "QA Owner":** a normal profile such as Standard, for owning, submitting and resubmitting records.
- **User B, "QA Approver":** for reviewing, approving and delegating. A Manager role above User A is ideal, so "owner's manager" routing can be tested.

Put their credentials in a file under `docs/Credentials/` (gitignored), and I'll read it without printing anything. If they can't be created, I'll run those cases owner-to-owner and mark them **Inconclusive**, not Pass.
