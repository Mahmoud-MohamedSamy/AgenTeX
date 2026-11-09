# Round 2 · Wave 5: setup, reports, integrations (28 Oct 2026)

Build index-De3hTVb3.js on staging-crm.taviportal.com (NDC-Staging, "Wonder Travel"). The front end changed to **index-clkSeMPm.js** during the run (seen 09:30 UTC), and NDC-2647 was re-checked on the new build. Account: **CRM Admin A** only. The owner was not used.

Sign-ins: one per run, with no HTTP 429.
- The runner (`scripts/runner.js`) signed in once through the login page. It kept the browser and token in memory only, and also served the API calls.
- Each of 4 Java runs signed in once (`auto-run1/2/3.log`, `auto-ui1.log`).
- Zoho org943261092 was signed in once, in Edge, and used read-only. Nothing was clicked that saves.

Nothing was sent to Plane; only read-only lookups were made. All changes were made on QA R2W5 modules and objects, which were deleted at the end (`after/diff.md`).

Evidence: `evidence/annotated/` has 37 images: one per retested ticket or ticket group, plus one per new candidate or gap. They use the approved layout: TAVI on the left, Zoho on the right, and the same box number on both sides. Raw screenshots are in `evidence/raw/`, and API cards and specs are in `scripts/cards`, `scripts/specs` and `scripts/make-evidence.js`.

## Counts
- **Tickets retested: 40.**
  - 35 pass (7 Ready For Test, 26 Done regression, NDC-1487 Backlog, NDC-2537 Bug).
  - 4 partly (NDC-2536, NDC-2704, NDC-163, NDC-2027).
  - 1 still fails (NDC-1193).
- Not retested: NDC-1229 and NDC-1834 (reasons below). NDC-492 and NDC-1476 were skipped because they are In Progress.
- **New candidates: 3.**
  - R2W5-C1 (Medium–High): the ingest API skips validation rules and field dependencies.
  - R2W5-C2 (Medium): a dashboard chart click does nothing, so there is no drill-down.
  - R2W5-C3 (Low): some setup pages stay in English in the Arabic UI.
- Also 1 gap image and 1 observation image.
- **Automation (automation-r2w5):**
  - API: 19 tests in the final runs. 16 pass. 2 fail, both real: NDC-1193 and R2W5-C1. 1 is skipped because CRM Admin has no `skills:manage`.
  - Screens: 3 tests. 2 pass. 1 fails on the gap: 4 module tabs still "In Development".

## Results per feature

### C01 Modules and fields
| Case | Result | Ticket | Note |
|---|---|---|---|
| Create a module through the API, then use the same name | Pass | NDC-1693 | 201, then 409 MODULE_NAME_TAKEN (Java, 2 runs) |
| Create module dialog on screen | Pass | NDC-2384 | Plural, singular and key fill in from the display name; Create gives 201 |
| Disable a module | Pass | NDC-1864 | It leaves the side menu. A direct link shows "… is disabled". API create and list give 403 MODULE_DISABLED |
| Every user data type as a field | Pass | — | 26 types tried, all 201 (Java) |
| New field: API name follows the label | Pass | NDC-1873 | "Lookup" becomes lookup_contacts_r2w5; the field is read-only |
| Delete a field permanently, then save the layout | Pass | NDC-1863 | DELETE 204, PUT layout 200, "Layout saved successfully" |
| Rollup Summary offers the lookup that points back | Pass | NDC-1444 | Related module QA R2W5 Child offers relation "QA Parent", field QA Amount, Sum/Avg/Min/Max/Count |
| Formula "Insert a field" | Pass | NDC-1586 | Lists every field of the module; sum() is now in the function list |
| Conditional visibility: controlling field list | Pass | NDC-1230 | Lists the layout's fields, not the field being edited |
| Auto-fill "Another field on this form" | Pass | NDC-1231 | The choice stays and a source-field picker appears |
| Field Listing layout filter | Pass | NDC-1598 | All Layouts / Default / Not on any layout (Java screen test) |
| Disabled module offered as a lookup target | Note | — | "QA R2W5 Dialog" (disabled) was in the Lookup module list |
| Lead Conversion Mapping field picker for a new module | Not run | NDC-1229 | It would mean switching a QA module on as a conversion target in **Leads** settings, which is a live module. New modules are no longer switched on by default |
| Record page title for modules after the first 25 | Not run | NDC-1834 | The tenant has 18–21 modules; reproducing it would need more than 25 |

### C02 Layouts
| Case | Result | Ticket | Note |
|---|---|---|---|
| Builder: drag 8 fields, save | Pass | NDC-1335 | Saved in 3.6 s with PUT 200, no Subform error |
| Builder: new Rollup Summary, save | Pass | NDC-2383 | Saved in 3.7 s (POST field 201, PUT 200); still there after reload |
| Builder: regex, Unique and Required kept after save | Pass | NDC-2423 | After reload: regex_pattern stored, e-mail unique + required. Records: "hello" refused (pattern), duplicate and missing e-mail refused |
| Create, duplicate name, clone, set default and back, reassign, usage | Pass | — | Java; the duplicate gives 409 |
| Default layout marked; Set as default in the row menu; default toggle locked | Pass | NDC-1588 | — |
| Disabled layout leaves the accessible list | Pass | NDC-140 | `/layouts/accessible` returns only Default |
| Access mode set through the API is stored; assignments endpoint | Pass | NDC-2650 | PUT stores "selected" + profiles. GET assignments 200, POST 201. Note: `PATCH …/access-mode` now gives 404 |
| Regex error text | Note | — | It names the API name ("Field 'qa_text' does not match …"); required and unique messages use the label |

### C03 Layout rules
| Case | Result | Ticket | Note |
|---|---|---|---|
| Layout rule through the API | Pass (API only) | NDC-1489 | 201. The tab is still "In Development", so the effect on the form can't be seen (gap) |

### C04 Validation rules
| Case | Result | Ticket | Note |
|---|---|---|---|
| New Rule on screen; create with 50 refused, message under the field | Pass | NDC-2646 | Criteria built from field, operator and value |
| API create 50 and edit 3 → 999 refused; text condition refused | Pass | NDC-2646 | 422 VALIDATION_RULE_FAILED / VALIDATION_RULE_INVALID (Java, 2 runs) |
| Rule on a pick list | Pass | NDC-2536 (2) | Blue refused with 422 |
| Rule through the ingest API | **Fail** | R2W5-C1 | 201 "valid", value 50 stored |

### C05 Dependencies
| Case | Result | Ticket | Note |
|---|---|---|---|
| Empty map `{}` refused | Pass | NDC-2649 | 422 DEPENDENCY_MAP_INVALID |
| Map made on screen (Red allows A, B); Red + C refused on create and edit; Green + C allowed | Pass | NDC-2649 | Message: "'C' is not allowed in 'QA Sub pick' when 'QA Pick' is 'Red'. Allowed: A, B." |
| Child list on the form after the parent is picked | Gap (minor) | — | It still offers A, B and C, and refuses only on Save. Zoho filters the list (documented behaviour, not checked live) |
| Dependency through the ingest API | **Fail** | R2W5-C1 | 201 "valid" |

### C07 Formulas · C08 Rollups · C09 Unique fields
| Case | Result | Ticket | Note |
|---|---|---|---|
| Formula 1+1 = 2; auto number; rollup 5 + 7 = 12 | Pass | — | Java + hand check |
| SUM in formulas | Pass | NDC-2536 (3) | sum(qa_num, 5) with 4 gives 9 |
| Unique e-mail is case-insensitive; restore of a record whose value is taken is refused | Pass | NDC-1603 | name_conflict "QA Email is already in use by another record." |
| Required pick list, value outside the list | Pass | — | 422 / 422 |

### C10 Buttons and links
| Case | Result | Ticket | Note |
|---|---|---|---|
| Button and link through the API | Pass (API) | NDC-1489 | 201. Sending `labels` (as on 26 Oct) stores an empty label `{}`; `label` works |
| Shown on the record page | **Gap** | NDC-1489 | Not shown. The record's Actions menu lists only the NDC custom actions. The Buttons and Links tabs are "In Development" |

### C11 Pipelines (read only)
| Case | Result | Ticket | Note |
|---|---|---|---|
| /settings/pipelines on a direct link and after reload | Pass | NDC-2386 | 6.4 s / 5.3 s, board shown; slower than the 2 s target |

### C12 Teamspaces
| Case | Result | Ticket | Note |
|---|---|---|---|
| Same folder name twice | Pass | NDC-2648 | 409 FOLDER_ALREADY_EXISTS with a readable message |
| Teamspace without modules | Pass | NDC-1694 | Save is disabled on screen with the reason; API 400 TEAMSPACE_MODULES_REQUIRED |
| Icon and admin pickers | Pass | NDC-1678 | Icon: colour or initials (no image upload); admin user picker opens |
| Drag a module into a folder; remove icon on modules in folders; side menu shows saved state only | Pass | NDC-1691 / 1698 / 1692 | — |
| Rename a folder, save, reload | Pass | NDC-1695 | "QA F1 renamed" is kept |
| Admin field shows the stored admin | Pass | NDC-1700 | QA teamspace shows its creator; CRM Teamspace shows "—", not the viewer |
| Delete icon on the edit page | Pass | NDC-1689 | "Can't delete … still contains 1 module. Delete or move it …" |
| Add Modules list | Observation | R2W5-OBS-1 | Shows module keys (contacts, deals, daily_move…) instead of names; the module row shows the key too |

### C13 Data types
| Case | Result | Ticket | Note |
|---|---|---|---|
| Custom data type joins the catalog | Pass | — | Java |
| Sticky header, compact columns | Pass | NDC-1232 | Java screen test: sticky, header top 186 px after scrolling |

### C16 Translations (Arabic, browser-only switch)
| Case | Result | Ticket | Note |
|---|---|---|---|
| Leads list count and sort label | Pass | NDC-2130 | "١٬١٦٨ سجلاً", "ترتيب: تاريخ الإنشاء تنازلي" |
| Transactions layout picker name | Pass | NDC-2131 | aria-label "التخطيط" |
| Wave 5 setup screens in Arabic | **Fail** | R2W5-C3 | Data Types (title, description, headers, categories), the API Integration description, the Storage categories and the setup menu items "Pipelines", "Web Forms", "Google Sheet" stay in English. On Home, task status and priority values ("Not Started", "low") and the meeting headers "From / To" are in English |

### C17 Home page components
| Case | Result | Ticket | Note |
|---|---|---|---|
| My Tasks / My Meetings headers | **Partly** | NDC-2704 (Bug) | Raw keys (subject, due_date, from_time …) and "No open tasks" show for 2–5 s, then labels and tasks appear (2 of 3 loads) |
| Greeting, views | Partly | NDC-163 (Backlog) | "Welcome Mahmoud Mohamed": no time of day or date. Views: Classic View and the personal home only |
| Pipeline component | Partly | NDC-2027 (Backlog) | "Connects to reporting in an upcoming update" |

### C20 Skills
| Case | Result | Ticket | Note |
|---|---|---|---|
| Category / group / skill / rating | **Blocked** | — | CRM Admin has no `skills:manage` (403). The Skills page shows "Couldn't load the skills overview." (observation: unlike Billing, it doesn't say "no permission"). Personal Skills loads |

### S02 Reports
| Case | Result | Ticket | Note |
|---|---|---|---|
| Tabular report on screen (dataset → child module → columns → Run → Save) | Pass | — | 29 datasets offered, QA module included |
| Rollup values in reports | Pass | NDC-2647 | 12 in tabular, summary, matrix and joined reports, in CSV export and via Java. Re-checked on the new build ~09:40 UTC: still 12. **Plane: another session moved it to Bug at 07:36 UTC because of a reporting 503 since ~19:00 UTC on 27 Oct. Reporting answered 200 throughout this run** |
| Summary (row group + record count + sum) | Pass | — | Sub-totals and grand total correct |
| Matrix (row × column group) | Pass | — | Pivot view correct |
| Joined report (2 reports, same module) | Pass | — | Saved and viewed. The name comes from the input at the top of the builder |
| Export: Formatted/Detailed × Excel/PDF/CSV/HTML | Pass | — | CSV downloaded (job 202 → artifact 200) with the values |
| E-mail a report | Pass (sent) | — | To mmohamed@anyware.software, `sent: true`; delivery not checked |
| Scheduled report (5-step wizard), send-me-a-test, run-now (API) | Pass | — | Created 201. Test and run-now sent to mmohamed@anyware.software. "Run now" is no longer on screen (API only) |
| Schedule ending before it starts; bad e-mail | Pass | — | 400 "end_at must be after the start date"; 400 for the bad e-mail (Java) |
| Click a value in a matrix or chart | **Fail** | R2W5-C2 | Nothing happens (see S03) |
| Report time zone | Blocked | — | `/reporting/report-time-zone` gives 403 REPORTING_APP_ACCESS_DENIED for CRM Admin, although it has every reporting:* permission (observation) |
| Report view load | Note | — | Saved report opened in 9.2 s |

### S03 Dashboards
| Case | Result | Ticket | Note |
|---|---|---|---|
| New dashboard, Quick Report chart (QA Pick × Sum of QA Rollup), save | Pass | — | The Green bar shows 12 |
| Dashboard filter (QA Pick) | Pass | — | Green: 2 rows → 1 row. The chosen value is not kept after save (minor) |
| Drill-down: click a bar | **Fail** | R2W5-C2 | No popup and no request, in view and edit mode. The widget menu's "Open underlying report" opens the dashboard editor |
| Removed features | Gap | — | Visibility sharing only (Only Me / All Users / Custom). No public link, export, e-mail or schedule (removed in this build, as the change map said) |
| Components | Gap | — | Chart, KPI. Comparator, Anomaly Detector, Target Meter and Funnel are "Coming soon"; Zoho lists ten components |
| New AI agents per view | **Blocked** | — | CRM Admin has no `ai:agent:manage` (GET /agents 403). The new "AI Agent" profile (rank 10) exists |

### S05 AI · S06 Billing · I05 Storage · G01–G03
| Case | Result | Ticket | Note |
|---|---|---|---|
| AI Features, AI Health, AI Credits pages | Pass (read) | — | AI Credits handles the billing 403 with a clear text. AI Health lists 25 stuck items (AI features off) |
| Billing | Pass (read) | — | "You don't have permission to view this page" for CRM Admin |
| Storage: usage, buckets, requests | Pass | NDC-1487 | "14 MB of 10 GB used", per type and per user |
| Company details, business hours (read) | Pass | — | Company Details now shows a **Currencies** card with "Add currency" (NDC-2536 item 1; adding is tenant-wide, not tried) |
| Fiscal year (read) | Note | — | Two "Change history" cards: one lists July → January (owner, 27 Oct 11:39), the other says "No changes recorded yet" |

### I02 API clients · I03 Webhooks
| Case | Result | Ticket | Note |
|---|---|---|---|
| Create a client on screen; the secret is shown once; token; schema; ingest create; other module 403; stale schema 412 | Pass | — | The secret was used in memory only. The client was deleted at once |
| Ingest applies validation rules and dependencies | **Fail** | R2W5-C1 | See the candidate below |
| Ingest drops `name`; `{}` accepted as "incomplete" | Note | — | `dropped_fields: [name]` although Name is on the layout; `{}` gives 201 "incomplete" (required Name and Email missing) |
| Internal webhook addresses refused at save (workflow, review) | Pass | NDC-2537 | 169.254.169.254, 10.0.0.5 and localhost give 400; the review process webhookUrl gives 400 |
| Name that resolves to 169.254.x at run time | Pass | NDC-2537 | Dispatch Cancelled "[custom-actions-egress-blocked]". The blueprint webhook was not checked |
| SMS/messaging webhooks (`/messaging/webhooks`) | Blocked | — | 403 `messaging:manage` for CRM Admin |

## Candidate bugs (re-verified from scratch; not in Plane)

**R2W5-C1 (Medium–High): records sent through the ingest API skip validation rules and field dependencies.** Seen twice: by hand on QA R2W5 Module, and by Java `R2W5SetupTest#ingestAppliesRules` on a fresh module with a fresh rule and map.
1. On a test module, add a number field and an active validation rule "refuse when number > 10". Add pick lists Parent (Red, Green, Blue) and Child (A, B, C), and a dependency map: Red allows A and B.
2. Settings › API Integration › Create integration for that module; get a token (`POST /api/v1/iam/integrations/token`, client_credentials).
3. `POST /api/v1/ingress/modules/{key}/records {"number": 50}` gives **201, compliance_state "valid"**, and the record holds 50. A normal create gives 422.
4. `POST …/records {"parent": "Red", "child": "C"}` gives **201 "valid"**. A normal create gives 422 DEPENDENCY_VALUE_NOT_ALLOWED.

Expected: the same rules as a normal create (refused, or at least marked incomplete). Zoho: not checked live. Image: `R2W5-C1-ingest-bypass-vs-zoho.png`.

**R2W5-C2 (Medium): clicking a dashboard chart (or a report matrix value) does nothing, so there is no drill-down.** Seen 3 times (builder, view mode, matrix cell).
1. Dashboards › New dashboard › Add component › Chart › Quick Report on any module; group by a pick list; save.
2. Open the dashboard and click a bar: nothing opens and no request is sent.
3. On a matrix report, clicking a value only offers sort/filter on right-click.

The report Share dialog still lists "Drill Down" as a permission. Zoho: the drill-down click was not tried live, because a product tour covers the dashboard and dismissing it saves a preference. Image: `R2W5-C2-dashboard-drilldown-vs-zoho.png`.

**R2W5-C3 (Low): parts of the setup screens stay in English in the Arabic UI.** Seen twice (sweep and screenshot).
1. Switch the header language to AR.
2. Open Settings › Data Types: the title, description, column headers and categories are English. API Integration has an English description. Storage categories are English. The setup menu shows "Pipelines", "Web Forms" and "Google Sheet" in English. Home task status and priority values are in English.

Image: `R2W5-C3-arabic-setup-vs-zoho.png`.

**Observation R2W5-OBS-1 (Low):** the teamspace "Add Modules" dialog and its module rows show module keys instead of names. Image: `R2W5-GAP-teamspace-keys-vs-zoho.png`.

**Separated as test defects (not app bugs):**
- SetupApiTest skills half: CRM Admin has no permission, so it now skips.
- R2W5SetupTest:
  - a field can have only one parent map (map reused);
  - the datasets list has a double envelope;
  - a report needs a non-empty query;
  - report DELETE needs `?expected_revision`.
- Integration dialog: Playwright clicked the outer "Allowed modules" label, which ticked "Transactions". This is not an app bug.
- Ad-hoc `POST /reporting/query` gave 400 with the body used. The saved-report query works.

## Tickets that still pass (Plane state at the end)
- **Moved to Done by another session during the run (they pass here too):** NDC-1335, 1694, 2646, 2648, 2649, 2650.
- **Done, still passes:** NDC-1693, 1598, 1603, 1232, 2130, 2131, 2423, 2384, 2383, 1873, 1864, 1863, 1444, 2386, 1230, 1231, 1586, 1588, 140, 1678, 1689, 1691, 1692, 1695, 1698, 1700.
- **Bug, now passes:** NDC-2537 (blueprint webhook not checked).
- **Backlog, now passes:** NDC-1487.
- **Bug, passes here:** NDC-2647. Another session moved it from Ready For Test to Bug at 07:36 UTC because of a reporting 503. In this run it passed at 07:40, 08:50 and ~09:40 UTC, the last on the new build.

## Tickets that still fail or are only partly fixed (Plane state at the end)
- NDC-1193 (**Bug**): still fails. Customers accepts a blank record with 201.
- NDC-2536 (**Bug**): partly. The pick-list validation rule and SUM in formulas now work. The second currency is now offered ("Add currency") but was not tried (tenant-wide).
- NDC-2704 (**Bug**): partly. Raw keys still show for 2–5 s on Home.
- NDC-163 and NDC-2027 (**Backlog**): partly (greeting, views, pipeline component).
- Gap tickets NDC-1489 and NDC-1485 (**Backlog**): 4 tabs are still "In Development", and buttons and links don't render.

## Gaps compared with Zoho
1. Module tabs Layout Rules, Record Locking Configuration, Links and Buttons are "In Development" (Validation Rules and Map Dependency are now built). Buttons and links made by API don't show on the record (`R2W5-GAP-buttons-links-vs-zoho.png`).
2. Dashboards have no drill-down, export, e-mail, schedule or public link. 4 of the components are "Coming soon"; Zoho's dashboard lists ten (Comparator, Cohort, Zone, Funnel, Target Meter, Anomaly Detector, Quadrant …).
3. The dependent pick list is not filtered on the form (refused only at Save).
4. A teamspace icon can't be an uploaded image (colour or initials only).
5. Home has no My Company View, no time-of-day greeting or date, and no pipeline component.
6. Arabic: see R2W5-C3.
7. AI agents per custom view can't be managed by the CRM Admin profile (no `ai:agent:manage`). Skills, billing and messaging webhooks are also closed to CRM Admin (Zoho's Administrator profile has them). Whether this is intended needs a product answer.

Not checked live in Zoho (it would need a save or dismissing a tour): the drill-down click, dashboard menus, Arabic UI, how the API treats validation rules and dependencies, restoring with a taken unique value, and a duplicate folder name.

## Blockers
- CRM Admin A lacks `skills:manage`, `billing:view`, `ai:agent:manage` and `messaging:manage`, and gets a REPORTING_APP_ACCESS_DENIED 403 on report time zone. So C20 writes, S06 beyond the permission page, the new AI agents and SMS webhooks were not tested. The owner account was not allowed.
- NDC-1229 would need a change to Leads conversion settings (live module). NDC-1834 needs more than 25 modules.
- Multi-currency, company, business hours and fiscal year edits are tenant-wide (Phase 4).

## Changed on staging during the run by someone outside this lane
1. **New front-end build** index-clkSeMPm.js replaced index-De3hTVb3.js (seen 09:30 UTC; it was not checked at the start, so the exact time is unknown).
2. **Company time zone reset Africa/Cairo → UTC** (`time_zone_version` 1 → 0, `updated_at` unchanged). Probably the deployment. Business hours still read Africa/Cairo.
3. **About 11,700 test leads** ("Name N", "testN@test.com", owner Mahmoud Mohamed) were created at 08:23 UTC **by the CRM Admin A account**, but not by this lane. Leads now total 11,856, and the Leads list takes 14–56 s to show records.
4. **Plane**: another session commented on and moved NDC-1335, 1694, 2646, 2648, 2649 and 2650 to Done, and NDC-2647 to Bug, at 07:36–07:38 UTC.
5. Modules "QA RT r8 / child / orphan" exist (another session); they were not touched.

## E-mails
All to mmohamed@anyware.software: one report e-mail (CSV), one schedule "send me a test", and one schedule run-now through the API. Delivery was not checked (no mailbox access).

## Cleanup
Deleted:
- 3 hand-check QA modules (with records purged from the bin first) and every Java-made QA module;
- the QA teamspace;
- 4 reports, 1 joined report, 1 dashboard and 1 schedule;
- validation rules, dependency maps, buttons, links and the layout rule;
- the API client;
- the webhook test rules;
- the blank Customers records (404, not in the bin).

The recycle bin holds no QA R2W5 item. The snapshot diff is identical except the company time zone, which another party changed (`after/diff.md`). One Allure attachment in automation-r2w5/target held the one-time client secret of a client that is already deleted; it was removed. The language switch is back to EN.

## Files changed in automation-r2w5 (for the merge into automation/)
- CHANGED `src/main/java/qa/features/crmsetup/CrmSetupApi.java`: `owner()` honours `-Dcrm.apiUser` / `-Dcrm.adminAs` (runs as CRM Admin A).
- CHANGED `src/main/java/qa/features/crmsetup/CrmSetupFeature.java`: QA prefix from `-Dcrm.qaPrefix` (default "QA W5 ").
- CHANGED `src/test/java/qa/features/crmsetup/SetupApiTest.java`: the skills half of `datatypeAndSkills` skips on 403 `skills:manage`.
- NEW `src/test/java/qa/features/crmsetup/R2W5SetupTest.java`: 8 tests (NDC-2649, 2650, 1864, 2647, 2536, 2537, schedule end-before-start, R2W5-C1).
- NEW `src/test/resources/suites/crm-wave5-r2.xml`.
- CHANGED `src/test/resources/features/crmsetup/feature-map.md`: round 2 command, traps, run history.
- Trap for the merge: `R2W5SetupTest#ingestAppliesRules` creates an API client through `CrmUser.req()`, so Allure stores the one-time secret in an attachment. The client is deleted in cleanup, but clear `target/allure-results` after a run.
