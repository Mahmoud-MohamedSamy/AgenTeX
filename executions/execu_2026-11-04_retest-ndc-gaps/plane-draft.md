# Plane draft — retest of NDC-2791..2798 (4 Nov 2026) — NOT POSTED

Environment for every comment: staging-desk.taviportal.com, NDC-Staging (Wonder Travel), Edge; accounts: owner + agent (QA team member). Method: manual browser + API. NDC's Zoho was not reopened; the Zoho side is the 3 Nov capture.
Evidence folder: executions/execu_2026-11-04_retest-ndc-gaps/screenshots/annotated/

| Ticket | Verdict | Proposed action | Image |
|---|---|---|---|
| NDC-2791 | FAIL (worse: now blocks saving) | → Bug + comment | NDC-2791-retest-FAIL.png |
| NDC-2792 | DECISION (fixed 200/department, not per tenant) | your call: Done, or Bug asking for per-tenant setting | NDC-2792-retest-DECISION.png |
| NDC-2793 | PASS | → Done + comment | NDC-2793-retest-PASS.png |
| NDC-2794 | FAIL | → Bug + comment | NDC-2794-retest-FAIL.png |
| NDC-2795 | PASS | → Done + comment | NDC-2795-retest-PASS.png |
| NDC-2796 | PARTIAL | → Bug + comment | NDC-2796-retest-PARTIAL.png |
| NDC-2797 | PASS | → Done + comment | NDC-2797-retest-PASS.png |
| NDC-2798 | PASS | → Done + comment | NDC-2798-retest-PASS.png |

---

## NDC-2791 — Retest FAIL
Note: this ticket was put in Ready For Test by mistake when it was filed (3 Nov); it had no fix comment. Retested anyway.
Checked:
- QA NDC Client Complaints (never edited) still shows QA NDC Agent id as required, in the layout editor and on the create form.
- Fresh repro: marked QA NDC TKT number required on the QA NDC FLY-WT Refund layout only → the field became required for the whole module (field config required = true).
Still failing — and worse than on 3 Nov:
- A Client Complaints ticket without TKT number is now refused: 422 "QA NDC TKT number is required." (3 Nov: it saved).
- A Customer Support ticket on the Standard layout, which does not contain the field, is refused: 422 "QA NDC Agent id is required." So marking a field required on one layout blocks ticket creation in every department. On NDC-Staging this blocked all ticket creation until QA cleared the flags (4 Nov ~11:00).
Expected: required applies only to the layout where it is marked.
Evidence: NDC-2791-retest-FAIL.png

## NDC-2792 — Retest: decision needed
Checked:
- Rules 51, 52, 53 created in the Tickets module (201); list shows All 53; New Rule enabled; page says "Up to 200 rules per department · most used: QA NDC Financial approval (22)".
- GET /workflow/rules/limits?moduleId=… → maxRulesPerDepartment 200, tenantSpecific false, plus usage per department.
Result: the 50-per-module cap is gone and NDC's need (max 24 in one department) is covered. The limit is a fixed 200 per department, not removed and not configurable per tenant through the control plane, which is what the ticket asked for.
Evidence: NDC-2792-retest-DECISION.png

## NDC-2793 — Retest PASS
Checked:
- Field Changed trigger now has "Also run when a record is created"; ticking it saves alsoOnCreate = true and survives reload.
- Rule watching Priority with the option on: new ticket → action ran; subject edit → did not run; priority change → ran again.
- Control with the option off: no run on create.
- QA NDC Close Ticket: watched fields take a few seconds to show in the editor (they briefly show "— pick a field —"); stored values are correct.
Evidence: NDC-2793-retest-PASS.png

## NDC-2794 — Retest FAIL
Checked:
- Owner Assignment → Teams now has "Also assign an agent of this team"; saved as ownerTargetKind TeamWithAgent with the agent id.
- Picking an agent who is not in the team is refused: "Team with agent: the agent is not a member of the team." (The picker still lists every agent, not only team members.)
Still failing:
- Rule fired on ticket #929 (QA NDC Quality Assurance, team QA NDC Quality assurance, agent mahmoud.mahamed1515): the ticket got owner = the agent but team = empty. Expected (and the editor's own text): "The ticket keeps the team and goes to this agent."
Evidence: NDC-2794-retest-FAIL.png

## NDC-2795 — Retest PASS
Checked:
- Renamed a Quality Assurance rule to "QA NDC GDS B2B", the name of a Financial approval rule → saved; both show in the list with their departments.
- Same name inside the same department → 409 "Rule names must be unique per department."
Evidence: NDC-2795-retest-PASS.png

## NDC-2796 — Retest PARTIAL
Works:
- QA NDC ADM and QA NDC Accounting both assigned to department QA NDC Accounting; ADM ticked as the department default (defaultDepartmentIds saved).
- Tickets keep their layout (ADM ticket shows IATA Source, ADM Number, Airline Code, ADM Reason); a ticket created by API without a layout gets the default (ADM).
- Ticket ⋮ → Change Layout works and keeps the values.
Still failing:
- Create Ticket: picking department QA NDC Accounting leaves the layout on "Standard"; the default (ADM) is not pre-selected.
- The layout picker on the create form and in Change Layout lists all 11 layouts, not only the department's (Accounting, ADM). An Accounting ticket could be switched to the FLY-WT Refund layout, which is not assigned to that department.
Expected (NDC's Zoho): the department's default layout is pre-selected and only that department's layouts are offered.
Evidence: NDC-2796-retest-PARTIAL.png

## NDC-2797 — Retest PASS
Checked:
- Setup → Modules → Ticket Status → "Statuses by department and layout": QA NDC Manual Invoice / layout QA NDC Manual Invoice set to 5 statuses (Open, On Hold, Escalated, Closed, QA NDC Pending), default Open.
- Ticket status menu and create form offer only those 5.
- Outside status refused on create and on edit (422 "… is not one of this layout's statuses: …").
- Other departments unaffected (Client Complaints accepts "QA NDC Approved E-Top-Up Manager").
Not compared: what happens to the status when a ticket is moved onto the layout (fall-back to default) — kept open to check against NDC's Zoho later.
Evidence: NDC-2797-retest-PASS.png

## NDC-2798 — Retest PASS
Checked:
- Team Notifications now include "Editing a comment" and "Deleting a comment" (QA NDC Quality Assurance).
- Rule off: editing a comment gave the team member no notification.
- Rule on: team member got "A comment was edited on ticket #936" and "A comment was deleted on ticket #936" (in-app).
Evidence: NDC-2798-retest-PASS.png

---

## Cleanup plan (once, after posting)
- Workflow rules: delete the 3 QA RT rules (now named "QA RT 2793 create or priority", "QA RT 2794 team and agent", "QA NDC GDS B2B" [Quality Assurance]).
- Tickets: delete the QA RT tickets (#926–#937 range: "QA RT 2791 …", "QA RT 2793 …", "QA RT 2794 …", "QA RT 2796 …", "QA RT 2797 …", "QA RT 2798 …") and purge them from the Recycle Bin.
- QA NDC setup (decide): keep ADM assigned to QA NDC Accounting as default (matches NDC) — or restore it unassigned; keep the Manual Invoice 5-status list — or restore "all statuses"; QA team notifications: keep "Editing a comment" on (matches NDC), switch "Deleting a comment" back off.
- Already restored during the round: QA NDC Agent id and QA NDC TKT number are no longer required; QA NDC ADM layout switched back on (an accidental toggle on 3 Nov).
- Close the browser session and delete the saved sign-in state file.
