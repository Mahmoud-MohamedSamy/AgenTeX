---
name: retest-r12-progress
description: "Retest round 12 (4 Nov 2026, 17 RFT tickets, CRM then Desk) — where it stands, run folder, blockers"
metadata:
  node_type: memory
  type: project
  originSessionId: ced3d44b-2788-4572-9c5a-70d3d98f8ebd
  modified: 2026-11-04T12:19:02.311Z
---

Round 12 of [[retest-ready-tickets-skill]], started 4 Nov 2026. Run folder: executions/execu_2026-11-04_retest-mahmoudmohamed-r12 (notes-r12.md = results, ledger.md = data to clean, status-r12.html = status report built by scripts/make-status-r12.js).

User's Gate 1: retest all 17 (NDC-2791..2798 ignored), CRM batch then Desk batch; NDC-2764 included (rule limit raised); connect/disconnect CRM⇄Desk allowed; user tests NDC-2781 personally; writing data OK; clean up at the end.

CRM results: 1819 PASS, 2729 PASS, 1948 FAIL (notes vanish after reload for timeline-denied user; tab now hidden), 2773 PASS, 2630 PARTIAL/BLOCKED (adding a CRM profile to a taviportal user was refused by auto mode, user to decide), 2136 timing running. Desk batch (2219, 2754, 2764, 2777, 2778, 2790, 2399, 2643, 2776, 2779) not started; 2754 dev note: items 1–6, 10, 15 to retest, rest moved to NDC-2799.

Part 2 (5 Nov): 20 in RFT; 1819/2219/2777/2778/2779/2790 Done and 2729/2781 Bug moved by others. Gate 1 (5 Nov): carry over 1948 FAIL, 2764 PASS, 2773 PASS, 2136 FAIL; retest 2275, 2630 (user OK'd adding CRM User profile to a taviportal account), 2801, 2803, 2791, 2794, 2796, 2774, 2754, 2800, 2799, 2752, 2137, 2643, 2776, 2399 in r12 folder. Ticket texts in tickets-r12b.md. Desk runner d.sh now ONLY=1 (several sessions crashed the page).

Part 2 results so far (5–6 Nov): 2275 PARTIAL (RR on create never runs: creator becomes owner), 2630 BLOCKED (no Zoho connection; SMTP save validates), 2801 PASS, 2796 PARTIAL, 2803 PASS, 2791 PASS, 2794 FAIL, 2774 PASS; images in screenshots/annotated (user OK'd layout). Then 2754 PARTIAL (share to own dept accepted), 2800 PASS, 2799 PASS. then 2752 PASS, 2137 FAIL (skip_total=true → 500 on all CRM record lists, kanban cards never load), 2643 PASS, 2776 PASS, 2399 PASS. All 20 retested; report.html built 6 Nov (make-report-r12b.js); POSTED 6 Nov (post-r12b.js): 11 Done, 9 Bug (2630 to Bug per user), comments + 20 images attached; RFT for user now empty. CLEANUP DONE 6 Nov for r11+r12 (scripts/cleanup/*.js; ledger.md "Cleanup" section): all zero, bins purged, state files deleted. ROUND CLOSED. Useful endpoints: dept delete needs agents removed first (PATCH dept with name + agent_user_ids []); deleted tickets still block dept/team delete until purged from Desk Recycle Bin; CRM invite cancel = POST /iam/users/invitations/{id}/cancel. Runner: CODE_FILE=t.js sh d.sh / c.sh (ONLY=1); annotate.js/apicard.js now write to r12.

**Why:** long round, staging slow (pages 1–4 min); context may compact.
**How to apply:** read notes-r12.md + ledger.md before continuing; sign-in via scripts/login-r12.js (TAVI Desk Credentials.csv; Edge export is gone); no Plane posts until Gate 2 draft is approved. Profile changes on users are blocked by auto mode, so ask the user.
