---
name: crm-hierarchy-preference-intake
description: "TAVI CRM Hierarchy Preference (Role/Reporting) vs Zoho intake 21 Oct 2026: no PRD, 19 gaps, API surface, baseline, phase gates, Zoho read-only"
metadata:
  node_type: memory
  type: project
  originSessionId: e3357d19-99e6-48a1-b60f-70dbdeecd85e
  modified: 2026-10-21T16:44:34.023Z
---

Started 21 Oct 2026 (skills new-feature-testing + selenium-test-automation). User wants phase-by-phase review: Phase 1 gap list → review → Phase 2 Plane ticket (ask filing fields) + spec → review → Phase 3 automation + run. User allowed changing TAVI settings if set back afterwards.
- **No PRD in Plane** (searched hierarchy/reporting manager/roles/data sharing). Related Desk: NDC-2300 (share with peers no effect), NDC-2299, NDC-2301.
- Files: `docs/crm-hierarchy-preference/` — `crm-hierarchy-preference-missing-list.md` (19 gaps in 6 groups), `evidence/` 01–04 `*-vs-zoho.png` (configs/ + tools/make-evidence.js), `reference/zoho-docs-inventory.md`, `reference/tavi-baseline-2026-10-21.json`.
- TAVI: setting `general.company.hierarchy.preference` (app general, scope Org) role|reporting; baseline **role, version 2**. API `GET /settings/resolved?app_key=general&key=…&scope_type=Org`, `PUT /settings/values`, `GET /settings/history`, `GET /iam/me/subordinates`, `PATCH /iam/users/{id}/reporting-manager`. Perms `iam.company.hierarchy_preference.manage`, `iam.user.reporting_manager.assign`. Page `/settings/company/hierarchy-preference`; Personal `/settings/personal/reporting-hierarchy` exists only in reporting mode (free-text user ID). "Role" = profile rank (no roles object); org units separate tree. Module `recordVisibility` public|hierarchy (`GET /modules`): Leads=hierarchy, others public.
- Test users with creds in Edge passwords CSV: valafo4080 (profile test, HR, has manager), nameb56175 (User, Sales, has manager).
- Zoho org943261092 is in Role Hierarchy; Reporting-mode screens need the user's OK to switch Zoho and back. Zoho setup URLs: /settings/hierarchy-preference, /settings/roles, /settings/data-sharing/default-org-permissions; pages need ~30 s to load headless.
- **Phase 1 approved 21 Oct 2026. Phase 2 done without Plane (user: "don't publish anything on plane yet"):** spec `spec-crm-hierarchy-preference.md` + `.html` (tools/make-spec-html.js; groups A–L, E2E-1..4, Z1–Z19, 130 rows), local ticket draft `plane-draft/description.html`. Self page saves via `PUT /iam/me/profile {reporting_manager_id}`; preference PUT body `{app_key:"general", key, scope_type:"Org", scope_id:null, value_json:"\"reporting\"", expected_version}`. Phase 3 blocker: no confirmed Supervisor-rank login.
- **Phase 3 run 21 Oct 2026** (feature `crmhierarchy`: HierarchyApiTest, VisibilityTest, HierarchyUiTest; report `executions/execu_2026-10-21_crm-hierarchy-preference/`): 36 cases, 27 pass, 8 fail, 1 skip. Bugs (NOT in Plane, user will review all three phases first): HP-01 role mode superior sees nothing, HP-02 reporting manager sees nothing (mode switch has no visible effect), HP-03 Desk Administrator grants CRM `metadata.records.view_all`, HP-04 history without who, HP-05 own manager via `PUT /iam/me/profile` without permission. "9 vs 16 users" withdrawn (Desk-only users). Setting version now 14; all else restored (diff clean).
- Key trap: view_all (CRM Admin, Owner, "test", Desk Administrator) hides the hierarchy — swap valafo4080 to User/Supervisor/Manager via `POST /iam/users/{id}/profiles {profile_id, scope_id:<org unit>, replace:true}` and back to "test" @HR. Saving Zoho was denied by the permission classifier — keep Zoho read-only.
- Traps: scratchpad tools api.js/shots.js share one rotating refresh token — save it right after every refresh or the next call forces a new login; Git Bash needs MSYS_NO_PATHCONV=1.

- **Expected visibility rule (user, 27 Oct 2026, NDC-2412):** same profile (same or different org unit) can't see each other's records; a higher-ranked profile sees lower-ranked users' records only within the same org unit; never across org units; the tenant owner sees everything. Round 6 result vs this rule: FAIL I3 (Supervisor doesn't see a User in the same org unit), FAIL I4b (Manager in another org unit sees a User) — visibility follows the profile tree tenant-wide. VisibilityTest has I2b/I4b/I7/I8 tagged NDC-2412.

**Why:** Phases 2–3 reuse these ids, paths and the baseline.
**How to apply:** wait for user review between phases; restore preference to role and diff against the baseline after any run. Related: [[zoho-reference-capture]], [[annotate-evidence-vs-zoho]], [[selenium-automation-framework]].

**9 Nov 2026 recheck on NDC-Staging (posted with images):** 0 built, 3 partly (4,15,16 — screen text only; runtime needs mode switch/profile changes, user not asked yet), 16 missing; mode Role v36; comment 5d6e6454. Files executions/execu_2026-11-09_retest-gaplists-high/ndc-2417.
