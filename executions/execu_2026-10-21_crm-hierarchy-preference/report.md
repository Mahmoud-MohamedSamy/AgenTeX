# CRM Hierarchy Preference — test run 21 Oct 2026

TAVI CRM staging `https://staging-crm.taviportal.com` (tenant NDC-Staging) · reference Zoho CRM org943261092 (read-only)
Spec: `docs/crm-hierarchy-preference/spec-crm-hierarchy-preference.md` · automation feature `automation/.../crmhierarchy`
Plane: **nothing filed** (user: "don't publish anything on plane yet").

## Summary

**Main finding: switching between Role-based and Reporting-based changes nothing users can see.** In both modes a module set to Hierarchy (Leads) shows each user only their own records. A Supervisor or Manager does not see a lower-ranked user's leads, and a reporting manager does not see their direct report's leads. Users who see more only do so because their profile has "view all records".

| Suite | Cases | Pass | Fail | Skipped |
|---|---|---|---|---|
| HierarchyApiTest (API, groups A C D E F G L Z) | 19 | 17 | 2 | 0 |
| VisibilityTest (API, groups I J) | 12 | 6 | 5 | 1 |
| HierarchyUiTest (browser, groups A B C D F G) | 5 | 4 | 1 | 0 |
| **Total** | **36** | **27** | **8** | **1** |

Revert: every suite ended with "restored: no difference from the baseline" (mode `role`, every user's manager / profile / org unit, every module's record visibility). The setting's version went from 2 to 14 (one step per switch) and Change history now has the run's switches; these cannot be removed. No `QA HP` lead is left.

## Bugs (not in Plane)

| ID | Severity | What happens | Expected | Cases | Evidence |
|---|---|---|---|---|---|
| HP-01 | High | **Role mode:** a Supervisor (rank 300) or Manager (rank 500, the parent profile of User) in the same department gets 403 on a User's (rank 100) leads, both owner-set and self-created. Same in another department. | Higher rank sees lower-ranked users' records (tab: "Visibility follows the profile rank hierarchy"; hint: "…lower-ranked users in their department"; Zoho: superior role sees subordinate roles) | I3, I3b, I4 | `screenshots/annotated/HP-01-role-superior-vs-zoho.png` |
| HP-02 | High | **Reporting mode:** nameb56175 reports to valafo4080 (listed in `GET /iam/me/subordinates`), yet valafo4080 gets "Record not found / Permission denied" on nameb56175's lead. Same when valafo4080 is a Supervisor in the same department. | Manager sees the reports' records (preview: "Sara sees Omar (her report)"; Zoho: everyone below in the chain) | J1, J3, J1s | `screenshots/annotated/HP-02-reporting-manager-vs-zoho.png` |
| HP-03 | Medium | The **Desk Administrator** profile (app desk) grants `metadata.records.view_all`, so a CRM Supervisor who also has Desk Administrator sees every CRM lead and the CRM hierarchy never applies to them. | A Desk profile should not change CRM record access | E7d | `screenshots/annotated/HP-03-05-permissions.png` |
| HP-04 | Low | Change history shows old → new value and time, but not **who** changed it (the API has `changed_by`). | Show the user | B5, D2 | `screenshots/annotated/HP-04-change-history-who.png` |
| HP-05 | Medium (security) | nameb56175 has no `iam.personal.reporting_hierarchy` (the Personal page is hidden), but `PUT /iam/me/profile {reporting_manager_id}` returns 200 and **changes their own manager**. The admin route correctly answers 403. | 403, nothing saved | G9 | `screenshots/annotated/HP-03-05-permissions.png` |

Text issue (part of HP-01): the preview says "A Manager sees every User in the tenant", the module hint says "lower-ranked users in their department". In practice neither is true.

## Other results worth knowing

- **Who sees everything:** profiles CRM Admin, Owner, "test" and Desk Administrator have `metadata.records.view_all`. Tests that use these accounts can never show the hierarchy working or failing. The run used valafo4080 temporarily as User / Supervisor / Manager (none have view-all) and set it back to "test".
- **No CRM profile grants `iam.personal.reporting_hierarchy`.** So the Personal → Reporting Hierarchy page is only reachable by the Owner; regular users never see it, even in Reporting mode (A7).
- **A lead created by API without an owner gets its creator as owner**, so "Unassigned records are visible to everyone" could not be tested that way.
- **Withdrawn possible bug:** "Users list shows 9 users but the API returns 16". The 7 extra are Desk-only users. The list and the manager dropdown both show the 9 CRM users (F1/F2 pass).
- **Working as expected:** tab texts and saved mode (A1, B1, B2); Cancel keeps the mode (C1, C7); switch both ways with toast, persisted after reload, Personal page appears only in Reporting mode (C3–C6, G1, G2); a User cannot write the mode (A4: 403 "Permission 'iam.company.hierarchy_preference.manage' is required…") or assign managers (A8); invalid values rejected with 422 (C8); stale or missing `expected_version` rejected with 409 `version_conflict` (C9, D5); loops of 2 and 3 rejected ("Reporting chain would form a cycle.", F5, F6); self as manager 422 "A user cannot report to themselves." (F7); bad ids 400 (F8); self-service bad values rejected (G6, G7); no token 401 everywhere (L1); type confusion 400 (L2); switching keeps managers (C11); peers don't see each other (I2), users don't see up (I5, J2), rank gives nothing in Reporting mode outside the chain (J5).

## Group Z (gaps) — state on 21 Oct 2026

| Item | Result |
|---|---|
| Z1 no-manager option | Still missing in TAVI. **Zoho now captured live** (Reporting picked, not saved): "Allow users who do not have a reporting manager to be managed by: Any user higher up in the hierarchy / CEO and Administrators" |
| Z7 manager must hold a higher role | Still missing: a Supervisor can be given a User (rank 100) as manager (204) |
| Z16 access options | Still missing: only `public` (7) / `hierarchy` (1) in use |
| Z17, Z18, Z19 sharing rules, roles API, any user's subordinates | Still missing: `/iam/roles`, `/iam/hierarchy`, `/iam/sharing-rules`, `/settings/data-sharing`, `/iam/users/{id}/subordinates` all 404 |
| Z2, Z9 (Zoho side) | Docs only: saving Reporting Hierarchy on Zoho was blocked by the session's permission check (shared external org), so Zoho was not changed |
| Z3–Z6, Z8, Z10–Z15 | Not automated in this run (UI checks in the spec) |

## Not covered in this run (spec rows still manual)

- J4 indirect reports: needs a third signed-in user without view-all (skipped, inconclusive).
- Two-tab stale write in the UI (D3, D4), audit log (D6), profile create / rank rules in the UI (E2–E6), E8, personal page saves in the UI (G3–G8, G10), record visibility per module changes (H1–H6), approvals and assignment rules (K1–K7), i18n / a11y / mobile / performance / browsers (L3–L12), E2E journeys. The API cases above cover the server side of C, D, F and G.

## Files

- `facts.txt` — one line per case with the observed values.
- `screenshots/annotated/` — 4 failure images (TAVI vs Zoho); `screenshots/originals/` — raw screens; `evidence-configs/` — how they were built.
- Automation: `automation/src/test/java/qa/features/crmhierarchy/` (HierarchyApiTest, VisibilityTest, HierarchyUiTest), pages and `CrmHierarchyApi` under `src/main/java/qa/features/crmhierarchy/`, `feature-map.md` next to `locators.json`.

Rerun (from `automation/`):

```
./mvnw test -Dtest=HierarchyApiTest -Dheadless=true
./mvnw test -Dtest=VisibilityTest -Dheadless=true
./mvnw test -Dtest=HierarchyUiTest -Dheadless=true -Dbase.url=https://staging-crm.taviportal.com "-Dcredentials.file=../docs/Credentials/Microsoft Edge Passwords.csv" -Dcredentials.host=staging-crm.taviportal.com -Dcredentials.account=ndc-staging-owner@taviportal.com
```

Only one at a time: all three write the tenant-wide mode.
