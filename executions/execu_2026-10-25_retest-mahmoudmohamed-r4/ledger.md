# Cleanup ledger — round 4 (25–26 Oct 2026)

| Item | Where | Status |
|---|---|---|
| Deals "QA RT 1302 move" ×2 (ebfc151f, 5712b381) | CRM Deals | deleted (in bin) |
| Field qa_rt_fp (44241857) + its hidden permission for profile "test" | CRM Leads | deleted |
| Field qa_rt_ro (d65bacbf) + read-only permission | CRM Leads | deleted |
| Field qa_rt_uniq (1ef504b5) | CRM Leads | deleted |
| Leads: QA RT 1337 u2 plain, QA RT 1231 fill, QA RT 1554 comma/semi, QA RT 1603 A | CRM Leads | deleted (in bin) |
| Tags qart1–qart4 (from the 1554 import) + import history entries | CRM | left — import history is an audit trail |
| Layout "Standard Layout" dff47b4e (created by the early save) | CRM Leads | deleted |
| Layout "test": Module Image switched off → switch back on | CRM Leads | restored |
| Modules qa_rt_module_1693 (ef70c152), qa_rt_module_1693_b (c56f2e10) | CRM | deleted |
| Teamspace "QA RT TS empty" (a1a9bba3) — QA RT TS already deleted | CRM | deleted |
| Sidebar teamspace switched back to CRM Teamspace | CRM (user) | done |
| Contacts/Tasks/Deals list prefs (crash fix) | CRM | done — {lastView:list, pageSize:25, hiddenKeys:[], visibleKeys:[]} |
| Desk module "QA RT Agents Only" (01727195, with qa_rt_cdt, qa_rt_file, qa_rt_img) | Desk | deleted (cascade, 204; GET → 404) |
| Custom datatype qa_rt_dt4 | Desk | deleted (204; gone from /fields/datatypes) |
| CRM contacts QA RT 2403 (14318a6e), QA RT 2404 Phone (860c468b) | CRM | deleted (in bin) |
| Desk contacts f0de6428, c5f64eca, 0c7e7a90; tickets #469 fd913c6d, #470 6fbde867; link f2e7a3dd | Desk | deleted (all 204, verified gone) |
| Integration config (pause, mappings, delete pref, profile_access) | Desk | done — diffed identical to integration-baseline.json; not paused |
| Desk language | Desk (user) | done — English |
| CRM Recycle Bin: 222 QA RT items (200 "1602 fill", 10 "1795 bulk", 1603 B, deleted records above) | CRM bin | purged by the NDC-1602 Empty Bin retest (26 Oct, user asked): 264 of 281 removed; 16 left are old owner items the server refuses (forbidden) — not ours |
| Desk Recycle Bin (records deleted above) | Desk bin | not purged — same restriction |
| Integration Disconnect + Connect (NDC-2399, 26 Oct) | Desk | done — config diffed identical to integration-before-2399.json (only import timestamps changed); connected, not paused |
| Session state files (state-rt/u1/u2/dk/dk2/agent/dkc.json); sessions rt, u2, dk | scratchpad | deleted / closed (again after the 26 Oct retests) |
