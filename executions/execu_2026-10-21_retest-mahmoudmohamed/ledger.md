# Cleanup ledger (retest round 21 Oct 2026, staging-crm, account mahmoud.mahamed1515)
| Ticket | Kind | Id | Name | Action at cleanup |
|---|---|---|---|---|
| 1302 | Deal | 8e8227b2-a494-47e3-a368-4e2880e49c39 | QA RT 1302 deal | delete + purge |
| 1302 | Deal | 2f41b135-71ad-42ad-be80-1674a0d50169 | QA RT 1302 api no stage | delete + purge |
| 1302 | Deal | 12ac3f8d-6a5e-4051-8f37-ceaaec7af2cf | QA RT 1302 test-layout (Test layout) | delete + purge |
| 1302 | Deal (existing, not ours) | d65aa935-f6cc-4bc5-87b2-c48a80b722c9 | "test" on Test-Pipeline copy: stage test-01→test-02→test-01 | already restored |
| 1308 | Stage probability (Standard pipeline) | qualification | 10/Pipeline → 15/Best Case → 10/Pipeline | already restored |
| 1295 | Deals Stage field value + pipeline "1" stage | qa_rt_1295 | created from pipeline "1", removed from Stage field (pruned from pipeline) | verify gone at cleanup |
| 1302/1312/1324/1316 | Deal | 12ac3f8d… | stage set to value_proposition for 1312 | deleted with the deal |
| 1323 | Deals (import) | 221c25cd…, 67a30863…, e4710c22… | QA RT 1323 open / won / no stage (on pipeline "1") | delete + purge |
| 1325 | Pipeline | 57aeb866-ba75-49d4-962b-fc9140d073ad | QA RT 1325 pipeline | deleted during the test (transfer) |
| 1325 | Deals (import) | 3 × QA RT 1325 … (now on Standard) | open / closed won / closed lost | delete + purge |
| 1323/1325 | Import history | 2 Deals imports (QA-RT-1323-deals.xlsx, QA-RT-1325-deals.xlsx) | | leave (history) or undo if needed |
| 1590/1592/1589/1587 | Leads (import, FieldPermissions) | 5 × QA RT imp … | undone → Recycle Bin; QA RT imp p50 (2e3666fe…) restored = live | delete p50 + purge all 5 |
| 1517 | Leads (CSV import) | 99d4122c…, d8f1167e… | QA RT csv 1 / QA RT csv 2, quoted | delete + purge |
| 1314 | Deals 8e8227b2…, 2f41b135… | next_step = "QA RT 1314 control" | | deleted with the deals |
| 1311 | Deal QA RT 1325 open | stage closed_lost, reason no_budget | | deleted with the deal |
| 1332 | Task / Call / Meeting | 21d3c64f… / 39ca766a… / e883e897… | QA RT 1332 task / call / meeting (+9 reminder notifications) | delete + purge |
| 1422 | Login session | test user 1 (nameb56175) signed in with an iPhone Safari UA, 11:20 UTC | | sign-in state file deleted at cleanup |
| — | State files | scratchpad state-rt / state-phone / state-owner / state-u* | hold session tokens | delete at cleanup |
| 1588 | Leads default layout | Standard → Test Layout 1 → Standard (twice) | | restored (Standard is default) |
| 1588 | Leads layout "Test Layout 1" | status toggle clicked by mistake → "Move records before disable" dialog → Cancel | | unchanged (still active) |
| 1444 | Leads field (Rollup Summary) on layout FieldPermissions | 6a570979-3f17-4a8f-bd34-46679c06097d | QA RT rollup (Deals › Connected To › Amount › Sum) | remove from layout + delete field |
| 1229 | Custom module | e51b6c77-bbf2-4a71-876c-78b99ec8d128 | QA RT partners (+ field qa_rt_note); auto-added as lead-conversion target | deleted 21 Oct (204); verify conversion targets |
| Desk | Module (staging-desk) | c0394292-52a2-446d-a326-06733fe289ba | QA RT MF (fields, 2 layouts, ~25 records, field permissions, lookups to Contacts) | delete module (cascade) + purge |
| Desk | Module | d08b353d-3634-4290-8785-fc6b6ecec00f | QA RT xxxx… (26 chars) + 550 fields | delete module (cascade) |
| Desk | Module | 9ef906c2-bdbd-4765-a600-3c724801cc71 | QA RT Closed (permission Desk Agent) + 1 record | delete module |
| Desk | Module | 2a423888-d7d4-4cc8-b35b-7aeb8daf91c0 | QA RT Closed UI (permission Desk Administrator) | delete module |
| Desk | Custom data type | qa_rt_dt | QA RT dt | delete |
| Desk | UI language (mahmoud.mahamed1515) | EN → AR → EN | | restored |
| Investigation | Deals | ff180cca… + 4 × "QA RT pipe a–d" | audit probe + pipeline probes (Standard) | delete + purge |
| Investigation | Leads layout | f01e6c73-e8c3-4cf9-a109-ff99a2a57b11 | QA RT layout (copy of FieldPermissions) + fields "Single Line …" and QA RT rollup2 | delete layout + fields |
| Investigation | Leads import draft | QA-RT-inv.csv (not submitted) | browser draft only | nothing on server |

## Cleanup result (21 Oct 2026, after the Plane updates)
- CRM: 20 QA RT records deleted (14 deals, 3 leads, task, call, meeting) + 24 bin items purged (incl. the 5 undone import leads); QA RT layout and 3 test fields deleted; teamspace QA RT 1172 deleted (as owner); QA RT 1325 pipeline was deleted during the test; qa_rt_1295 stage gone; Standard stage probability 10/Pipeline; Leads default layout Standard; module QA RT partners deleted earlier.
- Desk: modules QA RT MF (22 records), QA RT xxxx (550 fields), QA RT Closed (1 record), QA RT Closed UI deleted; custom data type qa_rt_dt deleted; UI language back to English.
- Not purged: 23 Desk bin items (records of the deleted QA RT modules) — POST /audit/recycle-bin/delete → recyclebin.error.forbidden, also as owner; they expire 20 Dec 2026.
- Left as history: import history rows (Deals ×2, Leads ×2) and today's Login History rows.
- Browser sessions closed; all saved sign-in state files deleted.
