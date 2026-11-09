# crmsetup — CRM setup and integrations (go-live Wave 5, lane C)

> The memory of this feature. Read it before testing; update it after every run.
> App: TAVI CRM staging-crm.taviportal.com · Reference: Zoho CRM org943261092 (read-only) · Created 2026-10-26
> Plan + results: `executions/execu_2026-10-26_crm-golive-waves3-5/plan.html` (lane C) and `wave5/` (results.md, report.md, scripts/ = the JS snippets these tests came from)

## How to run
| What | Command (from automation/) |
|---|---|
| API class (one JVM, one owner sign-in) | `./mvnw test -Dsuite=crm-wave5` |
| One bug | `./mvnw test -Dtags=W5-B1` / `-Dtags=NDC-1193` |
| Round 2 as CRM Admin A (no owner) | `./mvnw test -Dsuite=crm-wave5-r2 -Dcrm.apiUser=mmohamed@anyware.software "-Dcrm.qaPrefix=QA R2W5 "` (screens: add `-Dcredentials.account=mmohamed@anyware.software`; the org picker chooses `-Dauth.org`, default Wonder Travel) |
| Screens (owner) | `./mvnw test -Dtest=SetupScreensUiTest -Dbase.url=https://staging-crm.taviportal.com "-Dcredentials.file=../docs/Credentials/Microsoft Edge Passwords.csv" -Dcredentials.host=staging-crm.taviportal.com -Dcredentials.account=ndc-staging-owner@taviportal.com` |

Every class creates its own module ("QA W5 Auto …" / "QA W5 UI …") in the CRM Teamspace and removes it afterwards with
`CrmSetupApi.deleteModule`: delete records → purge them from the bin → `DELETE /modules/{id}?cascade=true`. Never add
fields, layouts or rules to a live module (other suites depend on Leads / Transactions staying the same).

## API (all under /api/v1, headers x-tenant-id + x-app-key crm)
- Module: `POST /teamspaces/{teamspace}/modules {moduleKey, labels.en, pluralForm, singularForm, description}`; delete `DELETE /modules/{id}?cascade=true` (409 MODULE_HAS_RECORDS while records exist, even with cascade).
- Fields: `POST /modules/{id}/fields {fields:[{fieldName, labels.en, datatypeKey, required, unique, datatypeOptions}]}`; `PATCH /fields/{fid}/labels`, `/constraints {unique|required}`; `GET /fields/{fid}/usage`, `/unique-peers`; `DELETE /fields/{fid}` (gone for good, not in the bin).
- datatypeOptions that are required: pick_list / multi_select / radio_button / status `allowed_values`; formula `expression` (+ `return_kind`); lookup `target_module_id`; rollup `target_module_id`, `relation_field` (lookup on the child pointing back), `target_field`, `aggregation`; subform `subfields:[{key, label, datatype}]`. `pipeline`, `department`, `team`, `support_plan` are system types.
- Multi-select record value: `{kind:'array', items:[{kind:'string', value}]}`.
- Layouts: `POST /modules/{m}/layouts {name, views, assignedProfiles, accessMode, status}`, `/clone {name}`, `/set-default`, `/reassign-records {target_layout_id}` (snake case), `GET /record-usage`. Access: the screen uses `PUT /layouts/{id}/acl {rows:[{principal_kind:user, principal_id, access_level}]}` + `PATCH /layouts/{id}/access-mode {access_mode}`.
- Rules (no screen yet): validation `{name, condition: "<text>", errorMessage:{en}}`; layout rule `{name, triggerField, layoutId, conditions:[{field, operator, value}], actions:[{type, targetField}]}`; dependency `{controllingFieldId, dependentFieldId, valueMap}`; button `{name, labels.en, actionType: Url, actionTarget, placement: Detail}`; link `{name, labels.en, url}`.
- Teamspaces: `POST /teamspaces {name}` (accessMode in the body is ignored → all_users); folders `POST /teamspaces/{t}/folders {name}`; delete with `?cascade=true`.
- Custom data type: `POST /custom-datatypes {key, label, base_datatype_key}` (the 400 message names "BaseDatatypeKey", but the key is snake case); `DELETE /custom-datatypes/{key}`.
- Skills: `POST /iam/skills/categories {name}`, `/groups {skill_category_id, name}`, `POST /iam/skills {skill_group_id, name}`, rate `POST /iam/skills/users/{user} {skill_id, score 0-100}` (not on yourself: 403), `DELETE /iam/skills/categories/{id}?confirm=true`.
- API integration: `POST /iam/integrations/clients {name, allowed_modules}`, `PUT /integrations/{client}/module-config`, `POST /iam/integrations/clients/{client}/rotate-secret`; token `POST /iam/integrations/token` (form, client_credentials); `GET /ingress/modules/{key}/schema`, `POST /ingress/modules/{key}/records` (flat JSON, Idempotency-Key, optional X-Schema-Version → 412 when stale).
- Reports: `POST /reporting/reports {name, folder_id, query_spec:{ir_version:14, dimensions:[{dataset_id, field_key}], …, base_dataset_id}, viz_spec}`; run `POST /reporting/reports/{id}/query {}` (answers a double envelope data.data).

## Traps
- A module created through the API gets a Default layout with no fields; the ingest API then drops `name` (field not on the layout).
- The language switch (EN/AR in the header) is browser-only (localStorage `anyware_language`) — safe to use for Arabic checks.
- Report / dashboard / schedule DELETE needs `?expected_revision=<revision>` (400 without it, 28 Oct 2026).
- CRM Admin lacks skills:manage, billing:view, ai:agent:manage, messaging:manage: those parts skip or are read-only as CRM Admin.
- Bin items of a deleted module can never be removed (NDC-1797): always purge the module's records from the bin before deleting it.
- Zoho layout editor opens with a product tour; dismissing it saves a preference — don't.

## Test inventory
| Class | Tests (case → ticket) |
|---|---|
| SetupApiTest | moduleCreateAndDuplicate (NDC-1693) · everyDatatype · recordRules (C06–C09, NDC-1603) · validationRuleApplied (W5-B1, NDC-2536) · emptyDependencyRefused (W5-B4) · layouts (C02) · layoutAssignmentsApi (W5-B5) · duplicateFolderName (W5-B3) · datatypeAndSkills (C13, C20) · blankCustomerRefused (NDC-1193) |
| R2W5SetupTest | dependencyEnforcedOnSave (NDC-2649) · layoutAccessModeStored (NDC-2650) · disabledModuleBlocked (NDC-1864) · rollupInReport (NDC-2647) · sumFormulaAndPickRule (NDC-2536) · webhookInternalAddressRefused (NDC-2537) · scheduleEndBeforeStartRefused · ingestAppliesRules (R2W5-C1) |
| SetupScreensUiTest | fieldListingLayoutFilter (NDC-1598) · moduleTabsBuilt (gap: 6 tabs "In Development") · dataTypesStickyHeader (NDC-1232) |

Not automated (manual, see wave5/results.md): layout builder save (NDC-1335) and Tab Order (NDC-492), Arabic list/board (NDC-2130/2131),
home page (NDC-163/2027), storage (NDC-1487), reports/dashboards and the rollup-in-report bug (W5-B2), API integration ingest.

## Run history
| Date | Scope | Result |
|---|---|---|
| 2026-10-26 | Manual run (lane C) | 13 tickets retested: 9 pass, 2 still fail (NDC-1193, NDC-2536), 2 partly (NDC-163, NDC-2027); 8 skipped In Progress; candidates W5-B1..B6 |
| 2026-10-26 | crm-wave5 run 1–2 | test defects fixed: bin page shape (list or {items}), module/teamspace delete need cascade + records purged first, auto-number sequence |
| 2026-10-26 | crm-wave5 run 3 | 10 tests: 5 pass, 5 fail = W5-B1, W5-B3, W5-B4, W5-B5, NDC-1193 (all real) |
| 2026-10-26 | SetupScreensUiTest run 1 | 3 tests: 2 pass (NDC-1598, NDC-1232), 1 fail = gap (6 tabs "In Development") |
| 2026-10-28 | Round 2 (build index-De3hTVb3.js, CRM Admin A) crm-wave5-r2 + R2W5SetupTest + screens | API 19 tests (final runs 2+3): 16 pass, 2 fail (NDC-1193, R2W5-C1 ingest skips rules), 1 skip (skills: CRM Admin has no skills:manage); screens 3: 2 pass, 1 gap (4 tabs In Development). Traps: report delete needs ?expected_revision=N; reporting answers double envelope data.data; a pick list can have only one parent map; validation rule condition is a criteria object |
