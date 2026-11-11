# Zoho CRM objects created — round 15 (org943261092)

- 2026-11-11: nothing created. Global set create by API refused (400 FEATURE_NOT_SUPPORTED "feature not available in this edition").

## org944965048 (hmohammed@ Enterprise trial), 11 Nov 2026
- 2026-11-11T09:19:32.147Z global set "QA RT15 GS Colors" 7687862000000750002
- 2026-11-11T09:19:34.654Z Leads field "QA RT15 GS Color" 7687862000000750010
- 2026-11-11T09:20:33.576Z Lead "QA RT15 2806 green lead" 7687862000000750022
- 2026-11-11T09:21:31.029Z Leads custom view "QA RT15 2806 Green view" 7687862000000750026
- 2026-11-11T09:48:20.417Z Leads "QA RT15 2807 0001–0200" 200 records (API), ids in out/zoho-2807.json
- 2026-11-11T09:48:21.204Z Leads custom view "QA RT15 2807 view" 7687862000000750565
- 2026-11-11 STATUS: all objects above in org944965048 are still live (lane stopped by low memory before cleanup).
- 2026-11-11T11:21:48.262Z CLEANUP view 7687862000000750026 → 400
- 2026-11-11T11:21:48.703Z CLEANUP view 7687862000000750565 → 400
- 2026-11-11T11:21:52.161Z CLEANUP leads deleted 201/201
- 2026-11-11T11:21:53.283Z CLEANUP field 7687862000000750010 → 400
- 2026-11-11T11:21:54.205Z CLEANUP global set 7687862000000750002 → 202
- 2026-11-11T11:21:58.300Z CLEANUP recycle bin purge of my items: 200 ids
- 2026-11-11 CLEANUP STATUS (org944965048):
  - DONE: 201 leads deleted (200 × QA RT15 2807 + QA RT15 2806 green lead); 200 of them purged from Recycle Bin (only my ids / "QA RT15" names). Global set "QA RT15 GS Colors" delete returned 202 SCHEDULED (job 7687862000000750862) — still listed right after; verify it is gone.
  - OPEN: view "QA RT15 2807 view" 7687862000000750565 and view "QA RT15 2806 Green view" 7687862000000750026 — API DELETE not supported (400 INVALID_REQUEST_METHOD); UI delete run was stopped by the low-memory reaper (state unknown, likely not deleted).
  - OPEN: Leads field "QA RT15 GS Color" 7687862000000750010 — delete refused 400 "The custom field has already used in other places" (used by the 2806 view); delete after the view.
  - OPEN: 1 Recycle Bin item probably left (QA RT15 2806 green lead, beyond page 1 of 200) — purge with DELETE /crm/v8/settings/recycle_bin?ids=7687862000000750022.
  - Untouched (not mine): global sets "QA GS1111 Tier", "QA GS1111 <b>x</b>".
  - To finish: scripts/zc/v1.js (UI delete of both views, one browser), then node run.js with a step: DELETE /crm/v8/settings/fields/7687862000000750010?module=Leads, GET global_picklists (QA RT15 GS Colors gone?), DELETE /crm/v8/settings/recycle_bin?ids=7687862000000750022.
- 2026-11-11 FINAL (main session): views 7687862000000750565 + 7687862000000750026 deleted via DELETE /crm/v8/settings/custom_views?ids=<id>&module=Leads (200); field 7687862000000750010 deleted (200); bin item QA RT15 2807 0099 purged (200); 2806 lead already purged. Verify: views 0, fields 0, global sets 0, leads search 204 (none), bin QA RT15 0. org944965048 CLEAN.
