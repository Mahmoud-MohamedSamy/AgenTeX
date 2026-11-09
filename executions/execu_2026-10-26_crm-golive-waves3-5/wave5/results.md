# Wave 5 (lane C, parallel part) — results per case, 26 Oct 2026

staging-crm.taviportal.com, owner. Everything changed was done on "QA W5 Module" / "QA W5 No plural" (made for this run) or on QA-named objects. Raw output: `after/*.json`, screenshots `evidence/raw/`, annotated `evidence/annotated/`.

## Tickets
| Ticket (state before) | Result | Facts |
|---|---|---|
| NDC-1693 (Done) | **Pass** | `POST /teamspaces/{CRM}/modules` → 201 in 2.6 s with a Default layout; same name → 409 MODULE_NAME_TAKEN. The screen dialog is NDC-2384 (In Progress, skipped) |
| NDC-1598 (Done) | **Pass** | Field Listing filter: All Layouts / Default / Not on any layout; Default → "No fields on this layout", Not on any layout → 42 fields |
| NDC-1335 (Bug) | **Pass** | Layout builder of QA W5 No plural (no subform): field dragged in, Save → stored (GET layout has it), no Subform error; second save 7.4 s |
| NDC-1193 (Backlog) | **Still fails** | Blank `data: []` → 422 in Leads and both QA modules; **201 in Customers** (Name required). Deleted and purged at once |
| NDC-2536 (Bug) | **Still fails** | (1) /currencies 404, one currency EGP; (2) validation rule on a pick list now accepted (201) but never applied (Blue saved); (3) formula has no SUM ("Unknown function 'sum'") |
| NDC-1603 (Done) | **Pass** | Unique email on QA module: restore of the deleted record while the email is taken → `recyclebin.error.name_conflict` "QA W5 Email is already in use by another record."; record stays deleted. Unique check is case-insensitive |
| NDC-1232 (Done) | **Pass** | Data Types at 1272×866: sticky header (top 186 after scrolling), names on one line, 44 px rows, fade at the right |
| NDC-2130 (Done) | **Pass** | Arabic Leads list: "١٧٣ سجلاً", sort "ترتيب: تاريخ الإنشاء تنازلي" |
| NDC-2131 (Done) | **Pass** | Arabic Transactions board: header layout picker aria-label "التخطيط", "٥٢ سجلاً", "المسار", "الاحتمالية %10" |
| NDC-492 (Backlog) | **Pass** | Section menu Tab Order: tick moves to Top to Bottom, Save enabled; after save + reload still Top to Bottom; layout stores `tab_order: top_to_bottom`. Keyboard order on the record form not checked |
| NDC-1487 (Backlog) | **Pass** | Settings › Storage: "14 MB of 10 GB used", by type, by user with quotas, buckets & S3, storage requests |
| NDC-163 (Backlog) | **Partly** | "Welcome ndc-staging-owner" (no time of day, no first name, no date); views: Classic View + "ndc-staging-owner's Home" only (no My Company View) |
| NDC-2027 (Backlog) | **Partly** | Home has My Tasks, My Meetings Today, "Pipeline by Stage — Connects to reporting in an upcoming update" |
| NDC-2423, 2384, 2383, 1873, 1864, 1863, 1444, 1476 | **Skipped: In Progress** | Not retested, as agreed |

## Feature cases (no ticket)
| Group | Result | Facts |
|---|---|---|
| C01 data types | Pass | 37 types listed; one field of each: 36 × 201 (rollup needs relation_field; subform needs `subfields[{key,label,datatype}]`), pipeline 400 (system-only; message says "not a recognized datatype"). System-only department / team / support_plan are accepted through the API (note) |
| C01 edit / delete | Pass (note) | Rename label en+ar 200; unique on email / phone 200 and a 3rd unique field also 200 (Zoho limit not checked); required pick list 200; field usage list; delete field 204 → gone for good (not in the bin; Zoho not checked) |
| C01 module tabs | **Gap** | Layout Rules, Validation Rules, Record Locking Configuration, Map Dependency Fields, Links, Buttons = "In Development" (Zoho: all working) |
| C01 API-made module | Note | Its Default layout has no fields (not even Name); the ingest API then drops `name` |
| C02 layouts | Pass | Create 201, duplicate name 409, clone 201, set default 200 and back, reassign records `{target_layout_id}` 200 moved 1, record usage; Layout Permissions (Selected Users) on screen → ACL stored (users only; Zoho assigns by profile) |
| C02 layout access API | **Bug W5-B5** | PUT layout accessMode → 200 but nothing changes; POST /layouts/assignments 500; GET 405 |
| C03 layout rules | API only | Created through the API (no screen); effect on the form not checkable |
| C04 validation rules | **Bug W5-B1** | Any condition text accepted (even garbage); 7 active rules on the module, none applied on create (50 > 10 saved) or edit (999 saved) |
| C05 picklist dependency | **Bug W5-B4** | `{}` → 201 with all-zero field ids; real map stored but not checked on save (Red + C accepted; Zoho API behaviour not checked) |
| C07 formula / C08 rollup / auto number | Pass | Formula 1+1 = 2; rollup count 2 and sum 12 on the record; auto number QW5-0001 |
| C09 unique / required / picklist | Pass | Required pick list 422; Purple 422; duplicate email (other case) 422 |
| C10 buttons / links | API only | Button created (labels {en}, actionType Url, placement Detail); link created but its label is stored empty `{}`; no screen |
| C12 teamspaces | **Bug W5-B3** + note | Teamspace + folder created; duplicate folder name → 500 (3 of 3); duplicate teamspace → 409; access mode in the create body ignored (all_users) |
| C13 data types | Pass | Custom data type `{key, label, base_datatype_key}` 201 and in the catalog (400 message names "BaseDatatypeKey") |
| C20 skills | Pass | Category / group / skill; rating test user 1 4 → 200, 101 → 400, own skills → 403 "managed by your supervisor"; removed afterwards |
| C16 / G05 Arabic | Pass | See NDC-2130 / 2131; the language switch is browser-only (no server write) |
| C17 home | Partly | See NDC-163 / 2027 |
| G06 shortcuts | Pass (note) | Ctrl+K palette (go to, create, modules, records, notes), "?" help (Ctrl+K, Ctrl+\, ?). "New Leads / New Customers" uses the plural |
| S02 reports | Pass + **Bug W5-B2** | New report → dataset picker (26 datasets, QA module at once) → related modules (child) → columns → Run → Save (201). Rollup sum column always empty in the report (record = 12), 3 checks over ~40 min; new rows reach the report in seconds |
| S03 dashboards | Pass (gaps) | Dashboard with a KPI (record count 13) saved. Comparator, Anomaly Detector, Target Meter, Funnel = Coming soon |
| I02 API integration | Pass (note) | Client created on screen (secret shown once), token via client_credentials (scope metadata.records.ingest, 3600 s), schema, create 201, other module 403, read 403, stale X-Schema-Version 412. `{}` accepted (required pick list filled from its default) |
| I05 storage, S05 AI, S06 billing | Pass | Pages load (1.3–6.7 s); billing page OK (its unused `/billing/me/summary` answers 500) |
| G01–G03 | Read only | Pages load. Fiscal Year shows "Change history" twice (minor) |
| Module delete | **Bug W5-B6** | Plain DELETE says "retry with ?cascade=true to delete the module along with its data"; with cascade a module that still has records → 409 MODULE_HAS_RECORDS |
