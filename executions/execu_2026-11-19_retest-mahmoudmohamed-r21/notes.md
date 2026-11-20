# Retest r21 — MahmoudMohamed — 19 Nov 2026

| Ticket | Verdict | Notes |
|---|---|---|
| NDC-3105 | PASS | Fresh rules: all-fail run "Failed", mixed run "Partly failed", Create Record action Failed 422 with full reason; Outcome "Failed only" (?outcome=failed) lists both, kept after Back. INFO: run table 1010px in 974px box (Next/Completed cut, dev will fix separately); Create Record Target shows module id; API execution outcome still "Fired" (UI derives). |
| NDC-3117 | PASS | CES2 runs QA end on #5117 (Low, condition medium): 422 BLUEPRINT_CRITERIA_NOT_MET; control admin #4869 403 NOT_OWNER; stale screen dialog message; after reload not offered. CES2 signed in once (expired overnight). |
| NDC-3118 | PASS | #5118 Open ✓ · On Hold · Closed; new #5526 Open→On Hold→Closed path correct; reopen restarts cycle (INFO). Blueprint QA RT20 BS 3056 flow activated then deactivated. |
| NDC-3115 | PASS | 4 rounds × 3 tickets (#5529–5531): round 1 background (owner blank at 1s, set later); all 6 owner changes one line "by workflow rule QA RT21 W2 3115 rapid", source workflow, no duplicates. |
| NDC-3119 | PASS | Setup › Automation › Execution History (highlighted); row menu + open rule "…" menu → ?ruleId= filtered list; Back keeps filter. INFO: open rule editor shows "The requested resource was not found." (looks up ${contact_id} placeholder of Create Record as record id). |
| NDC-3116 | PASS | User screenshot + own checks: Add/Edit Skill list view-only agents "(view only)" disabled with hint; API create / skill agents / Agent Skills all 400 view_only, outsider not_in_department, full agent 200/201; stale Add Skill (CES1 made view-only for seconds, restored) shows "Customer Experience Specialists 1 has view-only access to Customer Support, so they can't have its skills."; Agent Skills lists only full agents. Not checked: Arabic, macro/RR/SLA/blueprint pickers. Skill "QA RT21 SK 3116 ok" created (owner + CES2 hold it) — cleanup. |
