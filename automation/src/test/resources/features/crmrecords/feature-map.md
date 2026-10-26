# crmrecords — CRM daily record work (go-live Wave 2)

> The memory of this feature. Read it before testing; update it after every run.
> App: TAVI CRM staging-crm.taviportal.com · Reference: Zoho CRM org943261092 (read-only) · Created 2026-10-26
> Plan + manual results: `executions/execu_2026-10-25_crm-golive-wave2/` (plan.md, results.md, report.md, scripts/ = the JS snippets these tests were ported from)

## How to run
| What | Command (from automation/) |
|---|---|
| All API classes, one JVM, one sign-in per user (no volume test) | `./mvnw test -Dsuite=crm-wave2-api` |
| One bug | `./mvnw test -Dtags=W2-B4` / `-Dtags=NDC-2382` |
| 120-record mass delete (creates 120 leads) | `./mvnw test -Dtest=MassActionTest` |
| Owner screens | `./mvnw test -Dtest=RecordScreensUiTest -Dbase.url=https://staging-crm.taviportal.com "-Dcredentials.file=../docs/Credentials/Microsoft Edge Passwords.csv" -Dcredentials.host=staging-crm.taviportal.com -Dcredentials.account=ndc-staging-owner@taviportal.com` (add `-Dtags=perf` only for the list speed) |
| Orphan bin item delete (permanent) | `-Dtest=RecycleBinTest -Dw2.purgeOrphan=true` — ask first |

Accounts: owner (ndc-staging-owner) and test user 1 (nameb56175, built-in User profile @ Sales). ImportTest moves test user 1
to a QA profile for about a minute and back to User / Sales in its cleanup.

## API (all under /api/v1, headers x-tenant-id + x-app-key crm)
- Records: `POST /modules/{id}/records {layout_id, data:[{field, value:{kind, value}}]}` · GET / PATCH / DELETE `/modules/{id}/records/{rid}`. GET answers `data.data[]` = `{field, value:{kind, value}}`.
- Required fields per module: `CrmRecordsApi.required()` (Calls owner field is `call_owner`; Subscriptions need `owner`).
- Recycle bin: `GET /audit/recycle-bin/items?limit=200&cursor=` (newest first, `meta.next_cursor`), `/facets`, `POST /restore {ids}`, `POST /delete {ids}` (50 at a time, as the screen does).
- Timeline: `GET /timeline/records/{moduleKEY}/{rid}/feed` → `data.data[]` with `entry_type`, `field_key`. Path takes the module key (leads), not the id.
- Notes: `POST /modules/{id}/records/{rid}/notes {body, body_html, attachments:[]}`; there is no GET (405).
- Views: `POST /modules/{id}/views {name, kind:list, layout_id, visibility, shared_user_ids, settings:{columns, sort, criteria:{pattern, conditions}}}`, PATCH (row_version), `/clone`, PUT/DELETE `/pin`; records of a view: `GET …/records?view_id=`.
- Tags: `POST /modules/{id}/tags {name, color}`, PATCH, DELETE, `POST /tags/merge {winner_id, loser_ids}`, `POST /records/{rid}/tags {tag_ids}`, `POST /records/tags/bulk {record_ids, tag_ids, mode: append|overwrite}` → job `GET /record-tag-jobs/{job}`.
- Pipelines: `GET /modules/{deals}/pipelines?layout_id=`; Standard layout pipelines "Standard" `5170500c…` and "1" `640e03a4…`. Mass Update `POST /records/mass-update {record_ids, data}`.
- Mass delete: `POST /records/mass-delete {mode:'ids', recordIds}` or `{mode:'all_matching', filters, viewId, q, excludedIds}` → job `/mass-delete-jobs/{id}`.
- Import: upload multipart `POST /modules/{id}/import` → `PUT /import/{sid}/mapping` → `POST /validate` → `POST /execute` → GET status; `POST /import/{sid}/undo`.
- Search: `GET /search?q=&limit=` (needs permission `search.global.access`).
- Workflow rule for the NDC-2302 control: `POST /workflow/rules` (shape in ImportTest), `/activate`, `/deactivate`, DELETE.

## Traps
- Deals: only the literal value "Standard (Standard)" is accepted for `pipeline` today (NDC-2382 / W2-B4); QA deals use it.
- The record list API is per layout: pass `layout_id`, or the totals mix every layout.
- The 129 workflow-rule items left in the bin after Empty Bin are Desk rules (app desk) — not a CRM bug.
- Bin items of deleted modules are `forbidden` to delete or restore (NDC-1797); deleting one is permanent → opt-in flag.
- Mass delete by criteria is not automated on purpose: if the server ignored the criteria it would delete every lead.
- Empty Bin (NDC-1602) is not automated: it empties the whole tenant's bin (the user ran it once, 25 Oct 2026).
- The "leads created" wording (W2-B2) is made by the screen, so it is a UI test.
- Closing a download tab hangs playwright-cli (manual runs only).

## Test inventory
| Class | Tests (case → ticket) | Kind |
|---|---|---|
| RecordLifecycleTest | lifecycle ×15 (RC-01/06/09, RB-03 → NDC-1484, NDC-1832) · blankRecordRefused ×15 (NDC-1193) · normalUserDeletesOnlyOwnLead (RC-14) | API |
| TimelineTest | basicEntries (TL-01, NT-01) · deletionIsLogged (W2-B1) | API |
| CustomViewTest | createRenameClonePin · validation · upperCaseAndRefused (NDC-2122) · sharedViewVisibility (CV-07) | API |
| TagsTest | createRenameMerge · tenTagLimit (W2-B3) · bulkAppendOverwrite | API |
| RecycleBinTest | filters (NDC-1597/1600/1601) · restoreWithTakenUniqueValue (NDC-1603) · orphanItemCanBeDeleted (NDC-1797, opt-in) | API |
| PipelineTest | createWithPipelineId (NDC-2382) · moveDealByEdit (W2-B4, NDC-1312) · moveDealByMassUpdate (W2-B4, NDC-1316) · stageChangeKeepsPipeline (NDC-1302) · pipelineFieldOffersAllPipelines (NDC-1324) | API |
| SearchActivitiesTest | ownerSearch (GS-01/02) · userProfileCanSearch (W2-B6) · recurringTaskCreatesNext (W2-B8) | API |
| ImportTest | importAndUndo (IM-08) · triggerOffRunsNoWorkflow (NDC-2302) · importRespectsFieldPermissions (NDC-1593/1599) | API |
| MassActionTest | massDelete120 (MD-02, NDC-1216, group volume) | API |
| RecordScreensUiTest | pipelinesPageLoads (NDC-2386) · addTaskFromRecord (W2-B7) · timelineWording (W2-B2) · deletedViewIdInUrl (NDC-2098) · leadsListSpeed (NDC-2136, perf) | UI |

Not automated (manual only, see results.md): NDC-1197 actions menu, NDC-2282 kanban toolbar, NDC-2137 kanban speed, NDC-2280 long view name
overlap, NDC-1795 bin refill, NDC-2385 import review filter, NDC-1823 / NDC-2388 conversion, NDC-1819 work queues, Empty Bin, attachments
(upload goes through a file service first), export file content.

## Run history
| Date | Scope | Result |
|---|---|---|
| 2026-10-25/26 | Manual run (browser + JS snippets) | 16 tickets pass, 16 fail, 8 candidates W2-B1..B8 |
| 2026-10-26 | crm-wave2-api run 1–2 | test defects fixed: bin cursor (must be a queryParam), datetimes without fractions, tag value read raw (`{items}`), tag rename is PUT, stage key `stageValue`, profile id `data.profile_id`, views list needs `kind=list`, facets key `deleters` |
| 2026-10-26 | crm-wave2-api run 3 | 54 run: 44 pass, 10 fail — all app bugs, same as manual: NDC-1193 (Customers), W2-B1, NDC-2122, W2-B3, NDC-2382, W2-B4 ×2 (NDC-1312, NDC-1316), NDC-1324, W2-B8, W2-B6; 1 skipped (orphan purge, opt-in; finds the 16 orphan items) |
| 2026-10-26 | RecordScreensUiTest run 1 | not run: browser sign-in did not find the email box within 20 s (the CRM login page has `input[type=email]`, so likely a slow page load); retry pending |
