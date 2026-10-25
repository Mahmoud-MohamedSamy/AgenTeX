# Cleanup ledger — round 3 (25 Oct 2026)

| Item | Where | Status |
|---|---|---|
| 10 tasks QA RT wq t01–t10 | Tasks | deleted |
| Leads views: QA RT 2098 last, qa rt 2098 LAST, 2122 ×6, 2101 ×6, 2106 crit/col, 2120 pick/anyof, long-name view | Leads | deleted |
| QA RT 2098 foreign (test user 2 private) | Leads, as test user 2 | deleted |
| 4 leads QA RT 2101 Q1–Q4 | Leads | deleted |
| Field qa_rt_pick (on layout "test"); qa_rt_temp_num already deleted | Leads fields | deleted |
| 2 deals QA RT 2113 a/b + Kanban view QA RT 2113 kb | Deals | deleted |
| 52 views QA RT ov-01…ov-52 + list prefs | Contacts | deleted |
| List prefs (Leads lastView, Tasks workqueueFilters / sort / widths) | Leads, Tasks | restored to baseline (PUT 200; Leads prefs = baseline, Tasks/Deals/Contacts = {}) |
| Language | user | restored to EN |
| Recycle Bin QA RT items | audit | 90 purged, 0 left |
| Session state files state-rt.json, state-u2.json | scratchpad | deleted; browser session closed |
