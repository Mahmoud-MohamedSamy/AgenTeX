# CRM Hierarchy Preference — feature map

> The memory of this feature. Read it before testing; update it after every run.
> App: TAVI CRM staging-crm.taviportal.com · Reference product: Zoho CRM org943261092 · Created 2026-10-21
> Spec: `docs/crm-hierarchy-preference/spec-crm-hierarchy-preference.md` · Missing list (Z1–Z19) next to it · Run reports in `executions/execu_<date>_crm-hierarchy-preference/`

## Where it lives
| What | Path / id |
|---|---|
| Tab | `/settings/company/hierarchy-preference` (Company Settings → Hierarchy Preference) |
| Personal page | `/settings/personal/reporting-hierarchy` — only in Reporting mode, and only for users with `iam.personal.reporting_hierarchy` (no CRM profile has it; the Owner sees it) |
| Users | `/settings/general/users` → click a row → modal with the "Reporting manager" native select |
| Lead detail | `/modules/{moduleId}/records/{recordId}` (hidden lead: "Record not found" + toast "Permission denied.") |
| Setting | `general.company.hierarchy.preference`, app_key `general`, scope Org, `value_json` `"role"` / `"reporting"`, versioned |
| Test module | Leads `841043e1-…` (recordVisibility = hierarchy), layout Standard `bf971461-…` |

## Pages and page objects
| Page object | Covers | Key elements |
|---|---|---|
| `HierarchyPreferencePage` | tab, cards, confirm dialog, history text | `card` (role=radio, `aria-checked`), `dialog`, `dialogButton` (Switch mode / Cancel) |
| `UsersPage` | Users list, user modal | `userRow` (display name), `managerSelect` (first option "No manager (clear)") |
| `PersonalHierarchyPage` | personal page / redirect | `heading`, `managerInput` (placeholder "Paste a user ID, or leave empty for no manager") |

## Flows (step by step, as the UI really behaves)
1. Click the other card → "Switch hierarchy mode?" → Switch mode → toast "Hierarchy preference updated", card checked, a history row is added, version +1. Cancel/Esc → nothing saved. Clicking the active card does nothing.
2. In Role mode the personal URL redirects to `/settings`; in Reporting mode it shows "Reporting Hierarchy" (Owner).
3. The user modal's select lists the CRM users of the Users list (9) minus self; `GET /iam/users` returns 16 (7 Desk-only users).

## API
| Method | Path | Used for |
|---|---|---|
| GET | `/settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org` | mode + version (User profile: 403) |
| PUT | `/settings/values` `{app_key, key, scope_type:"Org", scope_id:null, value_json:"\"reporting\"", expected_version}` | switch; stale/missing version → 409 `version_conflict`; bad value → 422; non-manager → 403 |
| GET | `/settings/history?…&limit=10` | `items[]` changed_at, changed_by, old_value, new_value |
| PATCH | `/iam/users/{id}/reporting-manager` `{reporting_manager_id}` | admin set/clear; self 422 "A user cannot report to themselves."; loop 422 `cycle_detected`; bad id 400 |
| PUT | `/iam/me/profile` `{reporting_manager_id}` | self-service (HP-05: works without the permission) |
| GET | `/iam/me/subordinates` | direct reports (`data[].user_id`) |
| POST | `/iam/users/{id}/profiles` `{profile_id, scope_id:<org unit>, replace:true}` | swap a test user's profile (scope_id required) |
| GET | `/iam/me/permissions`, `/iam/profiles/{id}/permissions` | check `metadata.records.view_all` |
| GET | `/iam/users?limit=100` | `data` is a plain array: reportingManagerId, profileNames, orgUnitId, displayName |

## Traps and workarounds
- **`metadata.records.view_all` hides the hierarchy.** Profiles CRM Admin, Owner, "test" and Desk Administrator have it → valafo4080 ("test") and mahmoud.mmohamedsamy (Supervisor + Desk Administrator) see every lead. VisibilityTest swaps valafo4080 to User / Supervisor / Manager (no view-all) and restores "test" @HR.
- A lead created by API without `owner` gets the creator as owner (no "unassigned" leads by API).
- `GET /iam/users`: `data` is an array; GPath `data.items` gives a list of nulls.
- Owner token lives 5 min: long waits in scripts need a re-sign-in before restore (a probe left the tenant in Reporting mode for ~3 min on 21 Oct).
- Saving Zoho's Hierarchy Preference was blocked by the session permission check (shared org) — Zoho stays read-only; clicking "Reporting Hierarchy" without Save shows the no-manager option (zoho/… evidence).
- Run the three classes one at a time: all write the tenant-wide mode. Each restores and diffs in @AfterClass.

## Test inventory
| Case | Test method | Groups (bugs) | Last result |
|---|---|---|---|
| A4 | HierarchyApiTest.userCannotWriteMode | api, regression | Pass |
| A5 | userReadsMode | api | Pass (403) |
| A7 | personalPermissionHolders | api | Pass (record) |
| A8 | userCannotAssignManager | api, regression | Pass |
| C8 | invalidValuesRejected | api, regression | Pass (422) |
| C9, D5 | versionGuard | api, regression | Pass (409) |
| D1, D2 | historyRows | api | Pass |
| E1, E7 | profileRanks | api | Pass |
| E7d | deskProfileGrantsCrmViewAll | api, HP-BUG-03 | **Fail** |
| F3, F4 | setAndClearManager | api, regression | Pass |
| F5, F6 | loopsRejected | api, regression | Pass |
| F7, F8 | badManagerIds | api, regression | Pass |
| F9, Z7 | lowerRankAsManager | api, gap-check | Pass (gap open) |
| G9 | userCannotSetOwnManager | api, regression | **Fail** (HP-05) |
| G6, G7 | selfServiceBadValues | api, regression | Pass |
| L1 | noToken | api, regression | Pass |
| L2 | typeConfusion | api, regression | Pass |
| Z17–Z19 | apiGaps | api, gap-check | Pass (still 404) |
| Z16 | visibilityOptions | api, gap-check | Pass (gap open) |
| I1, I5 | VisibilityTest.roleOwnAndNotUp | visibility, regression | Pass |
| I2 | rolePeers | visibility, regression | Pass |
| I3 | roleSuperiorSameDepartment | visibility, HP-BUG-01 | **Fail** |
| I3b | roleManagerProfileSameDepartment | visibility, HP-BUG-01 | **Fail** |
| I4 | roleSuperiorOtherDepartment | visibility, HP-BUG-01 | **Fail** |
| I6 | roleIgnoresChain | visibility, regression | Pass |
| J1, J3 | reportingManagerSeesReport | visibility, HP-BUG-02 | **Fail** |
| J1s | reportingSupervisorManager | visibility, HP-BUG-02 | **Fail** |
| J2 | reportingReportNotUp | visibility, regression | Pass |
| J5 | reportingNotInChain | visibility, regression | Pass |
| J8, C11 | switchBackKeepsManagers | visibility, regression | Pass |
| J4 | reportingIndirect | visibility | Skipped (needs a 3rd user without view-all) |
| A1, A2, B1, B2, B4 | HierarchyUiTest.tabRenders | ui, smoke | Pass |
| B5, D2 | historyShowsWho | ui, HP-BUG-04 | **Fail** |
| C1, C7 | cancelKeepsMode | ui, smoke | Pass |
| C3–C6, G1, G2, D1 | switchBothWays | ui, smoke | Pass |
| F1, F2, Z7 | managerSelectOptions | ui, regression | Pass |

## Open bugs covered
| Bug | Test | Status at last run |
|---|---|---|
| HP-BUG-01 = NDC-2412 Role mode: higher rank sees nothing | I3, I3b, I4 | Open (21 Oct 2026) |
| HP-BUG-02 = NDC-2413 Reporting mode: manager sees nothing | J1/J3, J1s | Open |
| HP-BUG-03 = NDC-2414 Desk Administrator grants CRM view_all | E7d | Open |
| HP-BUG-04 = NDC-2415 History without "who" | B5/D2 | Open |
| HP-BUG-05 = NDC-2416 own manager without permission via /iam/me/profile | G9 | Open |

Filed 22 Oct 2026 (Bug state, CRM module, Sprint 12); gap list NDC-2417. Rerun one bug: `./mvnw test -Dtags=HP-BUG-01` (API classes need no browser flags).

## Run history
| Date | Scope | Passed | Failed | Healed | Notes |
|---|---|---|---|---|---|
| 2026-10-21 | HierarchyApiTest, VisibilityTest, HierarchyUiTest | 27 | 8 | 0 | 1 skipped (J4). Revert diff clean after each class; version 2 → 14. Report `executions/execu_2026-10-21_crm-hierarchy-preference/` |
