# Report — Desk Modules, Tabs and Fields (functional run)

| | |
|---|---|
| Spec | `docs/desk-modules-fields/spec-desk-modules-fields.md` (groups A–L, E2E, Z) |
| Target | https://staging-desk.taviportal.com (tenant NDC-Staging) — legacy project, no environment file; login mode **fresh** |
| Accounts (handles) | admin: second admin "Mahmoud TAVI"; agent: the Gmail test account "mahamed1515" (temporarily Desk Agent) |
| Run | sequential, started 2026-10-05 15:05 UTC, ended 2026-10-05 22:58 UTC (≈113 min of execution; the overnight wait between groups is excluded) |
| Browser | headless Chromium via playwright-cli sessions `mfadmin-180501-9c45`, `mfagent-180501-9c45` (both closed) |
| Scope | All runnable groups. Time Entry out of scope. Gaps against Zoho marked **MISSING — retest when built**, never FAIL |

**Interactive report:** [extent-report.html](./extent-report.html)
**Run summary (JSON):** [run-summary.json](./run-summary.json)
**Bug list:** [bugs/bug-list.md](./bugs/bug-list.md)

## Tally

206 rows — **92 PASS · 29 FAIL · 24 MISSING (gaps) · 25 INCONCLUSIVE · 25 NOT RUN · 11 INFO**. No flaky results (nothing passed only on a retry).

## What failed (29) — most important first

**High**
1. **SEC-1 — Cross-app permission leak.** A user with Desk Agent + CRM Admin gets CRM Admin's metadata permissions inside Desk (modules.manage, fields.manage_permissions, capabilities.manage …) and can open Setup → Modules and Fields. The Desk Agent profile alone has only records.access / records.manage.
2. **F9 — Records save without the required record-name field** (POST record with no name → 201), even with the layout given.
3. **I13 — A saved field's data type can be changed** (single line → number, 200).
4. **I14, I16, I18, I20, I25 (+ I17, I22 Medium) — The record API does not validate values**: max length, number range/type, email, phone, `javascript:` URLs, pick-list membership, multi-select limit, dates, and the field regex (the regex is saved in the layout but not enforced). Required custom fields *are* enforced when the field is on the layout (I4 PASS).

**Medium**
5. **B8 — Standard modules offer Delete** (real "Delete module" confirm on Tickets; only the has-records rule stops it), and Set Validation Rules / Map Dependency Fields / Button / Links / Assignment Rules in the row menu do nothing.
6. **D9 — Layout builder → Rename Module crashes the page** ("Cannot read properties of undefined (reading 'trim')"), reproduced on Tickets and on the QA module.
7. **G6 — Set as default returns 500** on an active layout that holds records (2/2, trace ids in the bug list).
8. **D7, G26 — No lost-update protection** on module and layout saves (stale rowVersion accepted; layout rowVersion never increases).
9. **C3, D5 — Blank or duplicate module names accepted** (whitespace name stored as null; rename to "" or to "Tickets").
10. **B5 — A disabled module still accepts records** — already filed as **NDC-1864**.
11. **E2E-1 — A new lookup to Contacts is not registered** in Contacts' related modules, so no related list would appear.

**Low** — B2 ("UN" as last modifier), B7/B10 (CRM wording in Desk), C6 (duplicate module display names), G4 (no duplicate-name warning in the builder; server refuses on save), I11 (label length only client-side), I32/I33 (lookup title/target checks), L7 (English text left in Arabic UI), L9 (2 unnamed buttons).

Annotated evidence (TAVI vs Zoho) for the on-screen failures: `bugs/screenshots/annotated/` (B2, B7, B8, B10, D9, L7). API-only failures carry the request and response in their note.

## Missing — retest when built (24 rows)

Z1 layout rules · Z2 validation rules · Z3 picklist values per layout · Z4 Help Center access per field · Z5 nested / colour picklists · Z6 field encryption · Z7 ticket number format · Z8 admin-set tab bar (confirmed per-user, K7) · Z9 rename any tab · Z10 search fields · Z11 standard fields protected (F3, I45) · Z12 department layouts · Z13 missing standard fields (F4–F6) · Z14 picklist tools · Z15 rounding · Z16 lookup options · Z17 layout Help Center settings · Z18 Ticket Status page · Z19 Agents module. Each row in the table below says what TAVI shows today.

## Coverage gaps (why rows are INCONCLUSIVE / NOT RUN)

- **No clean agent account.** The only lower-profile test account keeps a CRM Admin profile, whose permissions apply in Desk (SEC-1). Removing CRM Admin was blocked by the session's permission guard, so every 🔒 row (A2–A8, H2–H10, G10, I50, E2E-2) is Inconclusive. Please provide a Desk-only Agent / Light Agent account.
- **0 departments** on the tenant — department storage and department layouts (C4, Z12) not testable.
- **Not automated in this pass:** field width, checkbox/default values, option replacement dialog, radio/status, conditional visibility, auto-fill, rollup, quick-create triggers, file/image upload, dependency rules, unique across modules, 512-field limit, two-tab ordering (I3, I7, I9, I19, I21, I23, I24, I27–I29, I36–I38, I43, I44, I46–I49, K10).
- **Outside the allowed writes:** toggling, reordering or renaming standard modules (B6, B9, D2, D3, E2E-3).
- Firefox/WebKit and tablet widths not covered (L12).

## Changes made on the tenant — all reverted

- QA objects only: module "QA MF Assets/Devices" with 30 QA fields, QA layouts, 59 QA records, throwaway modules, one Ticket layout clone, custom data types `qa_mf_code`/`qa_mf_html`, capability `qa_mf_cap`. All deleted; the 60 QA items in the Recycle Bin purged.
- My own (admin) tab arrangement and UI language changed during K and L7 tests — both set back (tabs reset to default; language English, verified after reload).
- Test account "mahamed1515" profiles (approved by you): **a mistake happened** — the first attempt removed Desk Administrator before the Desk Agent add failed (needed an org scope); I fixed it within minutes by adding Desk Agent with the Desk "Manager" scope. At the end Desk Administrator was added back (scope Manager/desk — inferred from the two other Desk administrators, please confirm that was its original scope) and Desk Agent removed. Log: `baseline/changes.txt`.
- Side note found while reverting: `DELETE /iam/users/{id}/profiles/{profileId}` without `scopeId` answers 204 but removes nothing.

**Revert proof:** a fresh snapshot after cleanup was diffed against the baseline taken before group A (`baseline/diff.txt`): modules, every module's fields and layouts, custom data types, all user profiles and the admin tab setting are **the same**.

## Unstable results

None.

## All rows

### A — Access and permissions

| Row | Verdict | Note |
|---|---|---|
| A1 | PASS | CUSTOMIZATION shows Modules and Fields, Data Types, Capabilities, Organize Tabs |
| A2 | INCONCLUSIVE | Agent (Desk Agent + CRM Admin) sees Modules and Fields, Data Types, Capabilities, Organize Tabs and the full module table. Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| A3 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| A4 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| A5 | INFO | agent GET /modules → 200 (9 modules); /fields → 200 (40); /layouts → 200; /fields/datatypes → 200; /field-permissions → 200. Read access is needed to render records; no field is set to Don't Show today, so leakage is checked in H2 with a QA field |
| A6 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| A7 | PASS | agent opens Organize Tabs: true |
| A8 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| A9 | INCONCLUSIVE | no account of another tenant is available (spec §1.1) — tenant isolation not tested |
| A10 | PASS | no token → 401 {"success":false,"data":null,"error":{"code":"TOKEN_MISSING","message":"Authorization token is required."},"meta":null}; forged token → 401 {"success":false,"data":null,"error":{"code":"TOKEN_INVALID","message":"Authorization token is invalid."},"meta":null} |

### B — Module list

| Row | Verdict | Note |
|---|---|---|
| B1 | PASS | rows 9/9; missing headers: none; counter "1–9 of 9" shown |
| B2 | FAIL (Low) | Last Modified avatar shows "UN" on 9 rows; API lastModifiedByName set on 0/9 modules (seeded by system user a7a7a7a7-…0004) |
| B3 | PASS | "tick": [Tickets Ticket UN 06/09/2026 ]; "TICK" finds Tickets: true; Arabic rows: [No records found There is noth]; nonsense rows: [No records found There is noth]; empty-state: "No records found" |
| B4 | PASS | rows-per-page options shown: 10/25/50/100; "Page 1 of 1": true |
| B5 | FAIL (Medium) | Disabled QA module: status=disabled and it leaves the top bar, but POST /modules/{id}/records still creates a record (201, deleted again) and /modules/{id} still opens and works. Same as NDC-1864 (open). Switched back on: status=active. |
| B6 | NOT RUN | toggling a standard module is outside the allowed writes. Read-only: Tickets status switch present=false, disabled=null, label="null". The dependency guard is retested with QA MF Assets in group C |
| B7 | FAIL (Low) | "In Development" badge on both: true; Web Tabs text says "inside the CRM": true |
| B8 | FAIL (Medium) | Row menu on standard modules (Tickets, Calls): Layouts / Rename / Button / Links / Access Control / Workflow Rules / Assignment Rules / Map Dependency Fields / Set Validation Rules / Delete. (1) Set Validation Rules, Map Dependency Fields, Button, Links and Assignment Rules only add ?tab=… to the URL and the page stays on Layouts, because Desk hides those tabs — dead menu items. (2) Delete is offered on standard modu |
| B9 | NOT RUN | reordering changes the order of the standard modules — outside the allowed writes |
| B10 | FAIL (Low) | Setup sidebar shows "Set up your CRM" in Desk: true |

### C — Create / delete custom module

| Row | Verdict | Note |
|---|---|---|
| C1 | PASS | Created through the UI dialog (POST /teamspaces/{ts}/modules {moduleKey, labels, description, pluralForm, singularForm, storageScope}). GET: storageScope=organization, appKey=desk, recordVisibility=public, moduleKey desk_qa_mf_assets. Note: apiName is null for a new custom module (Zoho generates cm_<plural>). |
| C1b | INFO | QA test module now: plural "QA MF Devices", apiName QA_MF_Devices2, description "tab two (stale)" — a new custom module gets apiName null until one is set by hand (Zoho generates cm_<plural>) |
| C2 | PASS | empty submit shows "Enter the plural module name."=true; plural only shows "Enter the singular module name."=true; request sent=false (messages appear one at a time) |
| C3 | FAIL (Medium) | POST module names: whitespace-only "   " → 201 and the module is stored with pluralForm null (a nameless module); one character, 25, 26 and 120 characters all accepted (no length limit; Zoho UI limit is 25); leading/trailing spaces trimmed; Arabic, emoji and zero-width kept; <img onerror> stored as text and NOT rendered as HTML in the list, no alert. Each module deleted again. |
| C4 | INCONCLUSIVE | tenant has 0 departments (GET /desk/departments = []) |
| C5 | PASS | PUT storageScope=department → 409; stored storageScope=organization (must stay organization) |
| C6 | FAIL (Low) | Two modules can have the same display name: "QA MF Devices" created a second time (new key) → 201; only an identical moduleKey is refused (409 "Module key already exists"), e.g. "Tickets" → key tickets → 409. Each created module deleted again. |
| C7 | INFO | create with no profile list → 201; recordVisibility=public (deleted again). Who can open it is not judged (no clean agent account) |
| C8 | PASS | layouts: Default(default); fields: Name*, Created Time, Created By, Modified Time, Modified By, Approval Status |
| C9 | INCONCLUSIVE | no tenant without a teamspace available |
| C10 | PASS | double click on Create made 1 module(s) (all deleted again) |
| C11 | PASS | New module appears in More modules, the Create menu ("Create in another module"), Organize Tabs and has a working records page /modules/{id}; it is not in the visible top bar (it goes to More), which is expected |
| C12 | PASS | DELETE ?cascade=true on a module with 1 record → 409 MODULE_HAS_RECORDS This module still has records. Delete its records before deleting the module. |
| C13 | PASS | After all records are deleted, DELETE /modules/{id}?cascade=true → 204 and the module is gone. Its deleted records stay in the Recycle Bin (known: NDC-1637) — QA items purged at cleanup. |
| C14 | INFO | Team Module opens: "" (cancelled, nothing created) |

### D — Rename a module

| Row | Verdict | Note |
|---|---|---|
| D1 | PASS | GET plural=QA MF Devices, singular=QA MF Device, apiName=null; records page shows new name=true; top bar/More shows it=false |
| D2 | NOT RUN | renaming a standard module is outside the allowed writes |
| D3 | NOT RUN | renaming a standard module is outside the allowed writes; tab label for a renamed custom module is covered in C11/D1 |
| D4 | INFO | PUT apiName QA_MF_Devices2 → 200; stored apiName "QA_MF_Devices2" (was "null"). The warning text exists in the builder's Rename Module modal, which crashes (D9) |
| D5 | FAIL (Medium) | PUT /modules/{id} rename: empty plural → 200 and plural stored as null; plural "Tickets" (another module's name) → 200 stored; 26 chars, Arabic and <img onerror> accepted (shown as text). Name restored to QA MF Devices. |
| D6 | PASS | PUT → 200; stored description="QA MF description <b>x</b>", icon=Package; summary shows description as text=true, html rendered=false |
| D7 | FAIL (Medium) | No lost-update protection on module PUT: two saves with the same rowVersion both return 200 and the second (stale) one silently overwrites the first (description became "tab two (stale)"). Expected 409 for the stale write. |
| D9 | FAIL (Medium) | Layout builder → gear (Layout settings) → Rename Module crashes the page "Cannot read properties of undefined (reading 'trim')" — reproduced on Tickets (2/2) and on the QA module. |

### E — Module detail

| Row | Verdict | Note |
|---|---|---|
| E1 | PASS | tabs: Layouts, Fields, Workflow Rules, Summary; rule tabs shown: none (layout/validation rules are gaps Z1/Z2 → MISSING rows) |
| E2 | PASS | summary matches API for 7/7 values. Created By shows "—" (createdByName empty in API — same cause as B2) |
| E3 | PASS | unknown module id: page crash=false, not-found message=true; API GET → 404 |
| E4 | PASS | tab found by role=true; url /settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d; empty-state or list=true; New Rule buttons=2 |

### F — Fields listing and standard fields

| Row | Verdict | Note |
|---|---|---|
| F1 | PASS | columns 4/4; fields listed 40/40 |
| F2 | PASS | "Not on any layout" (select): 21/21 expected fields shown; on-layout fields wrongly shown: 0 |
| F3 | MISSING | retest when Z11 is built. Today standard fields are marked custom (isCustomField=true): Subject, Status, Contact, Priority, Department |
| F4 | MISSING | Tickets standard fields present 16/18; absent: Category, Sub Category (Z13). Required: Subject=true, Status=true, Department=false |
| F5 | MISSING | contacts: absent [] soft-deleted [Description, Mailing Address] / accounts: absent [Annual Revenue] soft-deleted [Industry, Fax, Description, Address] / products: absent [Department] soft-deleted [] (Z13) |
| F6 | MISSING | calls: Subject=required, Call Status=optional, Start Time=required, Contact Name=optional, Department=optional / events: Subject=required, Start Time=required, Contact Name=optional, Department=optional / tasks: Subject=required, Department=optional / contracts: Contract Name=required, Account=optional, Start Date=optional, Department=absent; Remind field on Tasks: false. Zoho requires Subject, Call Status, Start Tim |
| F7 | INCONCLUSIVE | tenant state recorded, not restored: contacts.Mailing Address (soft_deleted, 2026-09-14); contacts.Description (soft_deleted, 2026-09-14); accounts.Industry (soft_deleted, 2026-09-14); accounts.Fax (soft_deleted, 2026-09-14); accounts.Address (soft_deleted, 2026-09-14); accounts.Description (soft_deleted, 2026-09-14). Confirm with the product owner whether this was intended |
| F8 | PASS | new-ticket form control values: raw keys shown: none; url /modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new |
| F9 | FAIL (High) | The required record-name field is not enforced: POST /modules/{id}/records with no name → 201, both with the field off-layout and with layout_id = the default layout (Name on it). The required custom field on the same layout IS enforced (I4). |
| F10 | PASS | button found=1; after click url=/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d; builder or layout picker shown=true |

### G — Layouts

| Row | Verdict | Note |
|---|---|---|
| G1 | PASS | "Default" badge on the only layout: true; tooltip "New records use this layout unless another one is chosen." present: true |
| G2 | PASS | layouts now: Default[active,default], QA MF L1[active]; save request: /modules/bee9c8af-46b1-4d35-8772-d6594bb5477a/layouts |
| G3 | PASS | clone Ticket "Standard" → 201; fields per view original 18/10/19 vs clone 18/10/19; clone isDefault=false, status=active; clone deleted again → 204 |
| G4 | FAIL (Low) | Layout name in the builder: empty → "Name is required" and the box keeps only 40 characters (OK); typing the name of another existing layout ("Default") gives no "A layout with this name already exists" warning in the builder. The server does refuse it on save: PUT → 409 "A layout named … already exists" (G4b). |
| G4b | PASS | server: PUT layout name "QA MF L1" (already used) → 409 A layout named 'QA MF L1' already exists on this module. Choose a different name; stored name QA MF L1x |
| G5 | PASS | set-default → 200 and isDefault=true; the default layout's status switch is disabled, so it cannot be switched off; layout stays active |
| G6 | FAIL (Medium) | POST /modules/{id}/layouts/{layoutId}/set-default on an active, non-default layout that holds 6 records → 500 "An unexpected error occurred" on 2 of 2 attempts (trace ids 0cb41259-d069-4ef0-8aff-80670c7c5c8e, 6bf735ec-b2c4-4f7c-88b6-5a4dd621adbe); the same call on a layout without records returned 200. Switching a layout with records off correctly opens "Move records before this layout is disabled". |
| G7 | PASS | Default layout row menu has no "Set as default"; API DELETE on the default → 409 "This is the module's default layout and cannot be deleted while it holds that role"; layout kept |
| G8 | PASS | Delete on a layout with 6 records: "Delete …?" confirm, then "Move records before this layout is deleted — Move records to [QA MF L1x]"; after Move records the layout is gone and all 6 records have created_with_layout_id = QA MF L1x |
| G9 | INFO | Not reachable: the only active layout is always the default (the default cannot be switched off), so the default-layout rule (G7) answers first. The message exists in the code. |
| G10 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| G11 | PASS | Create QA MF Device page shows a layout dropdown next to the title with the default layout preselected |
| G12 | INFO | 25 extra layouts were accepted on one module with no limit (Zoho: 20 active layouts per department); all deleted again |
| G13 | PASS | QA MF L1 views: CREATE 1 section(s), QUICK_CREATE 1, DETAIL 1 |
| G14 | PASS | Quick Create: NEW SECTION buttons=1, disabled=true, message on click=false, hint title present=true; sections in canvas=1 |
| G15 | PASS | Preview opened: true; shows view switch Create/Quick Create/Detail View: false |
| G16 | PASS | NEW SECTION adds a section; Section settings → Edit Name opens the "Section Settings" drawer with English/Arabic tabs and Column Layout; saved label {"en":"QA MF Section","ar":"قسم QA MF"}. Minor: the drawer opens on the Arabic tab, not English. |
| G17 | PASS | after Single Column: saved columns 1 (label {"en":"New Section"}) |
| G18 | PASS | Tab Order "Top to Bottom" is saved (tab_order: top_to_bottom). Whether the record form follows it was not checked — NDC-492 says it does not. |
| G19 | PASS | Move Up disabled=false; new section saved at index 0 of 2 |
| G20 | PASS | dialog "Delete this section? All fields inside will be moved to Unused Fields. This cannot be undone. Cancel Yes, Delete"; sections after save: {"en":"Basic Information"} |
| G21 | PASS | section #1: Delete Section disabled, title "Cannot delete: section contains required fields" |
| G22 | PASS | Back with an unsaved section → "You have not saved your changes. Are you sure you want to leave without saving? Stay Here Yes, Leave Page"; Stay Here keeps the builder: true |
| G23 | PASS | Reset dialog "Reset all changes? This will discard all unsaved changes and restore the layout to its last saved st"; sections 3 → 2 after Yes, Reset |
| G24 | PASS | sections 2 → +NEW 3 → Ctrl+Z 2 → Ctrl+Y 3 |
| G25 | PASS | Ctrl+S twice saves once. Note: layout rowVersion stays 1 after saves (never increases) — see G26. |
| G26 | FAIL (Medium) | No lost-update protection on layouts: two PUT /modules/{id}/layouts/{layoutId} with the same rowVersion both return 200 and the second (stale) one overwrites the first; rowVersion never increases on save. |
| G27 | INCONCLUSIVE | session expiry mid-edit cannot be forced from the test side |
| G28 | INFO | No integration banner on the Contacts layout builder (CRM ⇄ Desk integration probably not configured on this tenant); save-time dialog not tried because it needs a field change on a standard module |
| G29 | PASS | module image switch present=true (was aria-checked=true); saved flag: "moduleImageEnabled":false |
| G30 | PASS | Help drawer lists articles: true; keyboard shortcuts listed: false; no-match text: true |

### H — Permissions and visibility

| Row | Verdict | Note |
|---|---|---|
| H1 | PASS | levels shown: Read and Write, Read Only, Don't Show; profiles: Desk Administrator, Desk Agent, Desk Light Agent, Desk Supervisor, Desk Reviewer; system-field lock hint: true; pagination present: true (NDC-1336 says there is none) |
| H2 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| H3 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| H5 | INCONCLUSIVE | Field Properties → PERMISSIONS lets Desk Light Agent have Read and Edit (both ticked by default) — Zoho does not allow Read & Write for Light Agents. Effect on a real Light Agent not tested (no such account). |
| H6 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| H7 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| H8 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| H10 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |

### I — Fields in the Layout Builder

| Row | Verdict | Note |
|---|---|---|
| I1 | PASS | New Fields palette has 32 types (incl. the leftover TestDataType); system-only Department, Team and Pipeline are not offered |
| I2 | PASS | Clicking Single Line adds the field; "Custom Fields Left" 512 → 511; Save creates it (POST /modules/{id}/fields {fields:[{fieldName, labels, datatypeKey, required, unique}]}) |
| I3 | NOT RUN | filling 512 fields was not run in this pass (time); limit is client-side 512 per layout |
| I4 | PASS | Required custom field is enforced when the field is on the record's layout: record without it → 422 RECORD_VALIDATION_FAILED (path qa_req_ro, type required); with it → 201. (Without the field on any layout the API accepts the record — see F9 for the record-name field.) |
| I5 | INCONCLUSIVE | Field Properties → PERMISSIONS of a required field: the Read-only switch is enabled and the hint "A required field can't be read-only — remove Required first." is not shown. After switching it on and saving, read_only was not stored (either the click missed or it is dropped silently) — the save-time guard "Cannot save: … both Required and Read-only" could not be confirmed. |
| I6 | PASS | Unique: second "abc" → 422 RECORD_VALIDATION_FAILED; "ABC" and " abc " also refused (case- and space-insensitive) |
| I7 | NOT RUN | unique across modules needs a second QA module with the same API name — not run in this pass |
| I8 | PASS | Data-type capability flags: lookup, multi-select, address, file, image have can_set_unique=false; builder greys out "Mark as Unique" on a pick list (seen on Priority) |
| I9 | NOT RUN | full/half width toggle not automated |
| I10 | PASS | Field menu of a required field (Calls Subject) shows "Remove from Layout" disabled — "Required fields stay on every layout. Turn off Required first." |
| I11 | FAIL (Low) | Field label limit is client-side only: POST field with a 51-character label → 201 (UI limit 50). EN/AR/FR labels stored correctly; <img onerror> label stored as text. |
| I12 | PASS | API name rules: "1abc", "a-b", Arabic → 400 FIELD_NAME_INVALID; "a b" accepted and normalised to a_b; duplicate "Single_Line" → 409 FIELD_ALREADY_EXISTS |
| I13 | FAIL (High) | A saved field's data type can be changed: PUT /modules/{id}/fields/{fieldId} with datatypeKey single_line → number returns 200 and the field becomes number (Zoho: "the field type cannot be changed"). Existing values are not converted. |
| I14 | FAIL (High) | Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: single line with max_length 10 saves an 11-character value (201). Option bound OK: max_length 20001 → 400 DATATYPE_OPTION_TOO_LARGE. |
| I15 | PASS | multi_line max_length 100000 → 201; 100001 → 400 DATATYPE_OPTION_TOO_LARGE Field 'qa_ml_big': Option 'max_length' exceeds the maximum allowed value. |
| I16 | FAIL (High) | Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: number field with min 0 / max 100 saves 101 and -1; "abc" is stored as a string in a number field; "15,000" stored as 15000. Currency symbol "EGP12" (UI max 4) is not stored at all via the field API. |
| I17 | FAIL (Medium) | Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: date "not a date", 2026-02-29 (not a leap year) and date-time "yesterday" are all saved as plain strings. |
| I18 | FAIL (High) | Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: email "not-an-email", phone "call me" and URL "javascript:alert(1)" are saved (201). The javascript: URL is a stored-XSS risk wherever the URL is rendered as a link. |
| I19 | NOT RUN | checkbox default value not automated |
| I20 | FAIL (High) | Duplicate options refused (400 DATATYPE_OPTION_DUPLICATE); Arabic and html option text kept. Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: pick-list value "Delta" that is not in the list is saved (201). |
| I21 | NOT RUN | option-replacement dialog not automated (value-usage endpoint exists) |
| I22 | FAIL (Medium) | Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: multi-select with max_items 2 saves 3 values. |
| I23 | NOT RUN | radio / status types not automated |
| I24 | NOT RUN | default values not automated |
| I25 | FAIL (High) | Builder: regex box, "Invalid regular expression" for "([" and the tester (✓ matches / ✗ does not match) work, and the regex is saved into the layout ("regex":"^[A-Z]{2}[0-9]{4}$"). Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: "ab12" is saved (201) — the regex is not enforced on the server. |
| I26 | INCONCLUSIVE | regex (a+)+$ with 32×"a"+"b" answered in 119 ms, but regex is not enforced server-side (I25), so catastrophic backtracking was never exercised |
| I27 | NOT RUN | conditional visibility not automated |
| I28 | NOT RUN | not automated |
| I29 | NOT RUN | auto-fill not automated (NDC-1231 open) |
| I30 | PASS | Auto number QA-####-EG, start 7, increment 2: existing records are numbered first, new records continue (QA-0079-EG, QA-0081-EG …); 5 parallel creates all unique |
| I31 | PASS | padding 13 → 400 DATATYPE_OPTION_TOO_LARGE Field 'qa_auto_b1': Option 'padding' exceeds the maximum allowed value.; increment 0 → 400 DATATYPE_OPTION_TOO_SMALL Field 'qa_auto_b2': Option 'increment' is below the minimum allowed value. |
| I32 | FAIL (Low) | Lookup to Contacts → 201, but a second lookup to Contacts with the same related-list title "QA MF Devices" is also accepted (201) — the title is supposed to be unique among lookups pointing at the same module. |
| I33 | FAIL (Low) | Multi-module lookup with target_modules [] is accepted (201); the UI says "Select at least one module". |
| I34 | PASS | formula upper(name) → 201; computed value on save: {"kind":"string","value":"QA MF REC 53440"}; empty expression → 400 DATATYPE_FORMULA_INVALID Field 'qa_fx_empty': Option 'expression' cannot be empty — a formula field needs an expression.; unknown field in expression → 400 DATATYPE_FORMULA_FIELD_UNKNOWN Formula for field 'qa_fx_bad' references 'no_such_field', which is not a field on this module. |
| I35 | PASS | subform with 0 columns → 400 DATATYPE_SUBFORM_NO_SUBFIELDS Field 'qa_sub0': A subform needs at least one subfield before it can be saved — otherwise it saves with nothin; with 1 column → 201 |
| I36 | NOT RUN | rollup needs a second module with a lookup back — not run |
| I37 | NOT RUN | quick-create trigger not automated |
| I38 | NOT RUN | file/image upload not automated |
| I39 | PASS | Address saved as an object (street, city, country) when sent as {kind:object, properties} |
| I40 | PASS | Rich text with <script> and <img onerror> is stored unsanitised (201) but the record page renders it safely: no alert, no script node, no onerror attribute |
| I41 | PASS | remove qa_sl10 from the layout → 200; record value kept=true ({"kind":"string","value":"xxxxxxxxxxx"}); field still exists as unused (layouts []); put back → 200 |
| I42 | PASS | DELETE unused QA field → 204 ; field now gone |
| I43 | NOT RUN | needs a workflow rule using the field |
| I44 | NOT RUN | no telephony integration |
| I45 | MISSING | retest when Z11 is built — seeded standard fields carry isDeletable/canPermanentlyDelete=true (not clicked) |
| I46 | NOT RUN | unused counter not automated |
| I47 | NOT RUN | field dependency rules not automated |
| I48 | NOT RUN | not automated |
| I49 | NOT RUN | not automated |
| I50 | INCONCLUSIVE | Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |

### J — Data Types and Capabilities

| Row | Verdict | Note |
|---|---|---|
| J1 | PASS | data types listed 35/35 (incl. leftover "TestDataType"); "No datatypes match your search" shown |
| J2 | PASS | catalogue flags: pick_list can_set_unique=false, can_create_validation_rule=false; single_line can_set_unique=true, can_create_layout_rule=false. Builder menus seen today match: Priority (pick list) has "Mark as Unique" and "Create Validation Rule" greyed; Calls Subject (single line) has "Mark as Unique" enabled and "Create Layout Rule" greyed |
| J3 | PASS | POST custom data type (shape of existing "test_data_type") → 201 ; listed=true; in the builder palette of QA MF Devices=true |
| J4 | INCONCLUSIVE | A field could not be created from the custom data type through the field API (POST /modules/{id}/fields with datatypeKey "qa_mf_code" → 400), so "delete a data type that is in use" could not be set up. The unused custom type deleted fine (204). Check whether the builder can add a field of a custom type. |
| J5 | PASS | capabilities page loads; text "System entries are protected from deletion" shown=true |
| J6 | PASS | capabilities before: 8 (keys of first: key,label,description,default_value,is_system,linked_datatypes); POST qa_mf_cap → 201 ; listed=true; DELETE a system capability "can_create_layout_rule" → 400; DELETE qa_mf_cap → 204, gone=true |
| J7 | INCONCLUSIVE | Agent: /settings/data-types shows an access-denied state, /settings/capabilities renders the catalogue (inconsistent between the two pages). Confounded: the only test account available keeps its CRM Admin profile (removing it was blocked by the permission guard), and CRM Admin metadata permissions apply inside Desk (see SEC-1). A Desk-only agent account is needed to judge this row. |
| J8 | PASS | html label → 201, rendered as element=false; empty key → 400; duplicate key → 409 |

### K — Organize Tabs and tab bar

| Row | Verdict | Note |
|---|---|---|
| K-agent | INFO | agent top bar text: Skip to content / Headquarters / Tickets / Knowledge Base / Customers / EN / MA / Desk / Headquarters / Team Feeds / Views / Agent Queue / Team Queue / Tags |
| K1 | PASS | selected order as expected: true; unselected empty text: true |
| K2 | PASS | after Hide Social: saved setting {"order": ["tickets", "knowledgeBase", "customers", "analytics", "activities", "chat", "community", "social", "module:contracts", "module:qa_mf_assets"], "hidden": ["social"]}; Social listed under Unselected=true |
| K3 | PASS | "Move Contracts up" saved {"order": ["tickets", "knowledgeBase", "customers", "analytics", "activities", "chat", "module:contracts", "community", "social", "module:qa_mf_assets"], "hidden": ["social"]}; after reload Contracts position vs neighbours [98,88,83] |
| K4 | PASS | Tickets has a hide button=false; "Always shown" lock marker=true |
| K5 | PASS | hid 8 tabs; Selected now: [ Drag-drop to change order Tickets ]; Tickets still selected=true |
| K6 | PASS | after Reset to default: setting {"order": [], "hidden": []}; Social back in Selected=true |
| K7 | PASS | Admin hid Social; the agent's own setting stays {"order":[],"hidden":[]} (resolved_from Default) and Social stays in the agent's bar — the arrangement is per user (setting general.user.desk.nav_tabs, scope User). Zoho lets the admin set it for everyone: gap Z8. |
| K8 | PASS | offline save message shown=true |
| K9 | PASS | reorder buttons have accessible names: Move Tickets up, Move Tickets down |
| K10 | NOT RUN | two-browser-tab tab ordering not automated |
| K11 | PASS | At 1000px the bar overflows into a "More modules" button; the menu opens with a search box and shows "No module matches your search." for nonsense |
| K13 | PASS | Organize Tabs lists Customers (Contacts + Accounts) and Activities (Tasks, Calls, Events) — same grouping as live Zoho (the earlier miss was the narrow window hiding Activities in More) |
| K14 | PASS | No Products tab in the bar; Products is under Setup → General → Products. Live Zoho has no Products tab in the bar either — not a gap |

### L — Security, i18n, a11y, perf, compat

| Row | Verdict | Note |
|---|---|---|
| L1 | PASS | html in field label / pick-list option / module & data-type names rendered as elements: create form 0, records list 0, field listing 0; alert dialogs 0 (earlier: module list C3, data types J8 also escaped) |
| L2 | PASS | labels as string → 400 ; allowed_values object → 400 ; required "yes" → 400 ; unknown datatypeKey → 400 ; fields not an array → 400 ; record data as string → 400 ; malformed JSON → 400; half-created fields: none |
| L3 | PASS | PUT module with appKey/moduleKey/createdBy/moduleType → 200; PUT field with isSystemField/isCustomField → 200; read-only keys changed: none |
| L4 | PASS | create module with appKey crm, moduleType activity → 201; stored appKey=desk, moduleType=module, recordVisibility=public (deleted again) |
| L5 | INFO | CRM module list with x-app-key crm → 403 (0 modules). Same tenant and the account is a Desk admin — whether a Desk-only user may read CRM module metadata depends on SEC-1; cross-tenant not tested (A9) |
| L6 | PASS | GET /audit/events → 400; entries mentioning the QA module: 0; entity/action kinds seen: ; Audit Log page shows QA MF: true |
| L7 | FAIL (Low) | Arabic UI switches to RTL and most labels are translated, but on Setup → Modules and Fields → module page "Create New Layout" and "Design your own layouts to fit your business processes…" stay in English (hard-coded strings). Language set back to English afterwards (verified ltr after reload). |
| L8 | PASS | Arabic content kept end to end: module name "QA MF أصول" (C3), section name "قسم QA MF" (G16), field label "حقل QA" (I11), pick-list option "بيتا" (I20) |
| L9 | FAIL (Low) | Layout builder has 2 visible buttons with no accessible name: the Module Image on/off switch (role=switch, no aria-label) and an icon-only button (svg only). Other controls are named (Field options, Section settings, Layout settings, Back to module, Move X up). |
| L10 | PASS | Tickets layout builder ready (5 loads, ms): 1570, 1576, 2075, 2082, 2109; median 2075 |
| L11 | PASS | QA layout with 34 fields in CREATE: save → 200 in 426 ms; builder opens in 1517 ms (200-field layout not built in this pass) |
| L12 | INCONCLUSIVE | run on headless Chromium only (Edge used for Zoho); Firefox/WebKit, tablet widths not covered |

### Security finding (extra)

| Row | Verdict | Note |
|---|---|---|
| SEC-1 | FAIL (High) | Cross-app permission leak: a user with Desk Agent + CRM Admin gets CRM Admin metadata permissions in Desk. GET /iam/me/permissions (x-app-key desk) returns metadata.modules.manage, metadata.fields.manage_permissions, metadata.capabilities.manage, metadata.views.manage, metadata.integrations.manage, metadata.records.convert … while the Desk Agent profile itself has only metadata.records.access and metadata.records.man |

### E2E journeys

| Row | Verdict | Note |
|---|---|---|
| E2E-1 | FAIL (Medium) | A lookup from QA MF Devices to Contacts (qa_lk, related-list title "QA MF Devices") is created, but GET /modules/{Contacts}/related-modules does not list QA MF Devices (Tickets, Calls, Events… are listed), so the related list would not appear on contacts. Created through the same field API the builder uses; linking a real contact was not done (no contact records; Contacts sync with CRM). |
| E2E-2 | INCONCLUSIVE | needs a Desk-only agent account (see SEC-1) |
| E2E-3 | NOT RUN | renaming a standard module is outside the allowed writes |
| E2E-4 | PASS | field lifecycle covered: add (I2) → values on records → remove to Unused keeps data (I41) → delete permanently (I42); option replacement not automated (I21) |
| E2E-5 | INFO | negative-recovery pieces covered separately: layout name errors (G4), stale saves accepted (D7, G26), delete blocked while records exist then move (C12, G8) |
| E2E-6 | PASS | Arabic UI renders RTL (L7) and Arabic module/section/field names save and display (L8) |

### Z — Gaps (Missing, retest when built)

| Row | Verdict | Note |
|---|---|---|
| Z1 | MISSING | Retest when built. Today: Layout rules — Desk module page shows only Layouts, Fields, Workflow Rules, Summary (E1); the row-menu "Set Validation Rules"/"Map Dependency Fields" items do nothing (B8); builder "Create Layout Rule" exists but greyed for single line. |
| Z2 | MISSING | Retest when built. Today: Validation rules — no tab; row-menu item dead (B8); only per-field regex exists and it is not enforced server-side (I25). |
| Z3 | MISSING | Retest when built. Today: Picklist values per layout — values are stored on the field (datatypeOptions.allowed_values), shared by every layout. |
| Z4 | MISSING | Retest when built. Today: Help Center access per field — Field Properties has GENERAL / VALIDATION / PERMISSIONS / ADVANCED only, no Help Center setting. |
| Z5 | MISSING | Retest when built. Today: Nested and colour-coded picklists — pick-list ADVANCED tab has Options + Quick-create triggers only (screenshot 37). |
| Z6 | MISSING | Retest when built. Today: Field encryption / ePHI — no such property. |
| Z7 | MISSING | Retest when built. Today: Ticket number format — Ticket Number is a read-only single line (not an auto-number field). |
| Z8 | MISSING | Retest when built. Today: Admin-set tab bar — Organize Tabs is per user (K7, setting scope User). |
| Z9 | MISSING | Retest when built. Today: Rename any tab — no Rename Tabs page; module list holds only record modules. |
| Z10 | MISSING | Retest when built. Today: Search Fields — no setting anywhere in Customization. |
| Z11 | MISSING | Retest when built. Today: Standard fields protected — seeded fields marked custom (F3) and flagged deletable. |
| Z12 | MISSING | Retest when built. Today: Department-specific layouts — layouts are per profile only; tenant has 0 departments. |
| Z13 | MISSING | Retest when built. Today: Missing standard fields — Category, Sub Category, Annual Revenue, Products Department, Remind fields absent (F4–F6). |
| Z14 | MISSING | Retest when built. Today: Picklist tools — no bulk add, sort, Replace Values in the field menu (screenshots 36, 37). |
| Z15 | MISSING | Retest when built. Today: Rounding options — currency field ADVANCED has Currency Symbol and Auto-fill only (screenshot 43). |
| Z16 | MISSING | Retest when built. Today: Lookup options — Lookup Module, Display Field, Related List Title, multi-module only (screenshot 38). |
| Z17 | MISSING | Retest when built. Today: Layout Help Center settings — layout list columns Name/Shared To/Last Modified/Status; new layout has no description or Help Center options. |
| Z18 | MISSING | Retest when built. Today: Ticket Status page — statuses are plain options of the Status field (screenshot 40). |
| Z19 | MISSING | Retest when built. Today: Agents module — not in Modules and Fields (9 modules, no Agents). |
