---
name: retest-r15-progress
description: "Retest round 15 (10–11 Nov 2026) CLOSED: 16 Done, 8 Bug + 2823 reopened to Bug after Zoho check; all TAVI + Zoho QA data cleaned"
metadata:
  node_type: memory
  type: project
  originSessionId: 7bdc8a4e-b909-47ac-8ab1-e5eb1984afb7
  modified: 2026-11-11T11:46:36.448Z
---

Round 15 of [[retest-ready-tickets-skill]], 10 Nov 2026. Folder executions/execu_2026-11-10_retest-mahmoudmohamed-r15: notes.md (results table = source of truth), notes-crm.md (CRM lane), ledger.md + ledger-crm.md (all QA RT15 data), out/ (ids, backups), scripts/ (api.js APP=crm|desk, ui.js, login-r12.js by label, annotate.js, specs/).
Gate 1: user approved all 24, NDC-Staging, owner, data writes OK.
Desk/own results: 2729 FAIL (CRM fixed; Desk blueprint Field update "Value" + Create task Department/Team plain text — user's own 5 Nov images showed Desk), 2806 PARTIAL (replace blocked by view use, Used In no reports), 2205 PASS, 2204 PASS + observation (role pool), 2830 PASS, 2828 PASS, 2825 PASS (new test SlaRuntimeTest.resetOnPriorityUpdate tag NDC-2825), 2815 PASS, 2816 PASS (failure simulated), 2810 PARTIAL (CRM-side delete still failure, B04), 2809 PASS + API not scoped, 2808 PASS, 2802 PASS, 2796 PASS, 2794 FAIL, 2827 PASS, 2826 PASS, 2823 DECISION (select all = loaded rows only), 2831 PASS.
Restored already: Standard layout (twice, from out/2815-standard-layout-backup.json), Phone label, ADM layout depts. Rules deactivated (2204, 2794); 2205 rules + SLA policies 2825/2826 still active (subject-scoped).
User 10 Nov: format OK; NDC-2823 = PASS (loaded rows OK). All 24 images built (emails masked; annotate.js MASK kind). scripts/r15.js builds report.html + plane-draft.html/json + attach-map.json; `node r15.js <csv> --post` posts. Gate 2 draft opened. 11 Nov: user approved PASSES only → 16 posted (comment+Done+image, all OK). 8 fail/partial (2729, 2806, 2807, 2630, 2810, 2794, 2136, 2137) NOT posted: user asked for Zoho comparison first (I had not compared) + 2823 "matches Zoho" claim unverified (posted already; reopen if Zoho selects whole view). User approved Zoho writes (delete after). Zoho sessions scratchpad state-zd.json (Desk: hmohammed@ + CSV row1 pw, headed) / state-zc.json (CRM org943261092 row1). Two lanes running → notes-zoho.md, notes-zoho-crm.md, ledger-zoho*.md, *-vs-zoho.png. Then: redo draft for 8, Gate 2, post, cleanup TAVI+Zoho.
Zoho results 11 Nov: Desk lane done + Zoho data purged: 2823 Zoho has "Select all tickets in this view" → recommend reopen to Bug (my posted PASS was wrong); 2729 Zoho starts "-None-", no Status/Team/Dept/Skills in FU, Create task Agents/Teams picker → FAIL stays, reword expectation; 2794 Zoho keeps team+agent → FAIL stays. CRM lane BLOCKED: org943261092 Enterprise trial expired (needs user: extend / free edition / other org); nothing created. Waiting user.
11 Nov later: 2823 reopened → Bug (correction comment + zoho image). Zoho CRM via hmohammed@ org944965048 (state-zc2.json reused Desk SSO). CRM compare done: 2806 PARTIAL (only replace-in-use; reports point dropped), 2807 Zoho background job, 2630 Zoho blocks compose, 2729 CRM matches Zoho, 2136 Zoho 7.5 s median (TAVI p95 worse → FAIL), 2137 FAIL, 2810 not compared. Zoho CRM + Desk QA data all deleted (views via DELETE custom_views?ids=). Draft plane-draft-fails.html (scripts/r15-fails.js, --post) opened; waiting approval. Then TAVI cleanup from ledgers + delete state files. 4 new RFT tickets appeared after Gate 1 (2805, 2635, 2030, 1988) — not in round.
**Why:** resume after compaction. **How to apply:** wait for CRM fork + format OK → make remaining images → report.html + plane-draft → Gate 2 → post via Plane key → cleanup from both ledgers.

**CLOSED 11 Nov 2026:** 8 fail/partial posted (comment+Bug+vs-Zoho images). Cleanup done TAVI Desk+CRM (bins: 23 + 360 QA RT15 purged) and Zoho; sessions deleted. Remind user: delete Plane token + CSV. SlaRuntimeTest.java change (NDC-2825 test) uncommitted.
