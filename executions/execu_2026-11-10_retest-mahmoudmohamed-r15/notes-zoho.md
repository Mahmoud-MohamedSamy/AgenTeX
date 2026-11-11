# Zoho Desk comparison — round 15 (11 Nov 2026)
Zoho Desk techsolutionsegypt (Enterprise trial), dept Tech, signed in once (saved session state-zd.json), headed Edge. Objects created and deleted: see ledger-zoho.md.

## NDC-2823 — Select all (posted 11 Nov as PASS "matching Zoho" — that claim is WRONG)
- Zoho seen: view of 57 tickets (list loads 50 at a time). Header Select All → "50" selected (loaded page) AND the bar shows a link **"Select all tickets in this view"**. Clicking it → "57 · All tickets selected · Clear selection", with bulk Assign To / Update / Close / Delete / Move / Revoke Blueprint / Update Resolution. Scrolling to 57/57 without the link keeps the count at 50.
- TAVI (10 Nov): "50 of 433 selected — scroll to load the rest of this view", no way to select the whole view; selecting all needs scrolling every page.
- Match: first click SAME; whole-view selection DIFFERS.
- Recommended verdict: **FAIL** (reopen → Bug, with a correcting comment): TAVI needs a "Select all N tickets in this view" option like Zoho.
- Evidence: screenshots/annotated/NDC-2823-zoho-check.png; raw zoho-2823-selectall-50.png, zoho-2823-select-view2.png, zoho-2823-after-scroll.png.

## NDC-2729 — Desk blueprint After actions
- Zoho seen (temporary blueprint opened in the editor, never saved, discarded): Field update — field list has no Status, Team, Department or Skills ("Stat"/"Team"/"Depart"/"Skill" → no results; Classifications found); pick list value (Priority) starts at "-None-" then High/Medium/Low. Create task — no Department/Team fields; "Assign to" is a picker with Agents and Teams tabs (plus "Assign Ticket Owner as Task Owner"); Status starts at "Not Started" (first option).
- TAVI: Field update offers Status/Skills/Department/Team with value "Value"; Create task has free-text Department* and Team.
- Match: DIFFERS on all three. Note: the ticket's expectation "first real option" is not Zoho's behaviour for Field update — Zoho starts at "-None-"; TAVI's "Value" is the same idea with a misleading label. The Create task Department/Team free text clearly differs from Zoho's picker.
- Recommended verdict: **FAIL stays** (Desk part). Suggest the comment says: show "-None-" (not "Value"), don't offer Status/Team/Department/Skills in a blueprint Field update (Zoho doesn't), and use an Agents/Teams picker in Create task instead of free text.
- Evidence: screenshots/annotated/NDC-2729-retest-FAIL-vs-zoho.png; raw zoho-2729-fu-priority-open.png, zoho-2729-fu-no-status.png, zoho-2729-fu-no-team.png, zoho-2729-task-assign.png, zoho-2729-task-status.png, zoho-2729-task-new.png, zoho-2729-fu-new.png.

## NDC-2794 — rule assigns team + agent of that team
- Zoho seen: Direct Assignment rule "QA RT15 2794 team and agent" (Ticket Create, Subject starts with QA RT15 2794) → Assign Ticket to › Teams › test › Fathy Mehanna ("Assign to an agent in a team"). Ticket #169 created by API → owner Fathy Mehanna AND team test (at create and 15 s later); History: one TicketUpdated by actor "QA RT15 2794 team and agent" (DirectAssignment) setting Case Owner and Team.
- TAVI: owner set, then "Team was updated: QA RT15 2794 team → blank"; ticket ends with no team.
- Match: rule option SAME; result DIFFERS.
- Recommended verdict: **FAIL stays** (Zoho confirms the ticket's expectation).
- Evidence: screenshots/annotated/NDC-2794-retest-FAIL-vs-zoho.png; raw zoho-2794-team-agents.png, zoho-2794-rule-saved.png, zoho-2794-ticket.png, zoho-2794-teams-tab.png, zoho-2794-assign-picker.png.

## Cleanup (11 Nov)
53 tickets + contact moved to trash (204) and purged (POST /api/v1/recycleBin/delete on the contact removed its tickets too); rule deleted in UI; blueprint never saved. Bin left with 3 older non-QA items (QA BP …, 1 Nov) — not touched.
