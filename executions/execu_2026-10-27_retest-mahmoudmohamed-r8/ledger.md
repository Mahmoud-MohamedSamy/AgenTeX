# Test data ledger — retest round 8 (27–28 Oct 2026) — cleanup pending (after the Plane updates)

| Ticket | Kind | Id | Name / change | Cleanup |
|---|---|---|---|---|
| 2649/2647/2294 | module | 064aa360 | qa_rt_r8 "QA RT r8" (fields qa_colour, qa_child, qa_rollup; records; dependency map b08d3e8a) | pending (cascade) |
| 2647/2294 | module | b690647a | qa_rt_r8c "QA RT r8 child" (lookup qa_parent, qa_amount; records 5, 7, connected 9261a22c) | pending (cascade) |
| 1797 | module | b97a713b | qa_rt_r8o "QA RT r8 orphan" (no records left) | pending (cascade) |
| 2294 | workflow rules | b28e7bfb, a568dbf5 | QA RT r8 sched FU, QA RT r8 actions | pending |
| 2294 | call | cd52350c | QA RT r8 call | pending |
| 2419 | assignment rule | 54dbfced | QA RT r8 AR api | pending |
| 2419 | leads | bba3bc66, 3b0b6ece, 677aaeb6, cc2bb773, 8c430ec9 | QA RT r8 AR api 1 / control 1 / u1 default / u1 on SG / default 2 | pending |
| 2620/2630 | lead | e8e8c1dd | QA RT r8 attach (email set to the QA Gmail) | pending |
| 2630 | lead | — | "QA W4 Send …" (ChannelsApiTest cleanup timed out) | pending |
| 2621/1312/1316/1324/2626 | deal | a60da2df | QA RT r8 deal (back on Standard / qualification) | pending |
| 1335 | layout | 78288b9b | Leads "New Layout" | pending |
| 2650 | layout | 6bf87122 | QA RT r8 layout | deleted 27 Oct (204) |
| 2634 | portal | e9b9b750 | QA RT r8 Portal (switched off) | pending |
| 2294 | review / approval processes | — | QA RT r8 review / appr probes | deleted at once (204) |
| — | layouts | 14 | leftover "QA AEO Layout …" (Deals SB/SC/SE/SF, Leads SA/SB/SB 310080/SC/SD/SE/SF 522360, Tasks SC/SE/SF) set back to access all_users (were pinned by my helper change) | to delete (automation leftovers) |
| 2629 | setting | — | Activity Reminders: clicked and undone, nothing saved | none |
| 2633 | UI language | — | switched to Arabic and back | restored |
| — | sessions | rt, u1 | browser sessions + sign-in state files | close / delete at the end |

## Cleanup 1 Nov 2026 (done)
- Inventory (read-only, NDC-Staging CRM, CRM Admin) → delete by exact ids (cleanup-ids.json).
- Deleted: workflow rules b28e7bfb + a568dbf5 (deactivated first), assignment rule 54dbfced, 6 QA RT r8 leads, deal a60da2df, Leads layout 78288b9b "New Layout".
- Already gone before cleanup: QA modules 064aa360 / b690647a / b97a713b, portal e9b9b750, call cd52350c, the "QA W4 Send" lead, the 14 "QA AEO Layout SA–SF" layouts.
- Left alone (not in this ledger): 7 "QA AEO Layout SG / SH / V7…" layouts (Leads 5, Deals 1, Tasks 1).
- Verify: 0 leads, deals, rules, assignment rules, modules, portals, calls.
