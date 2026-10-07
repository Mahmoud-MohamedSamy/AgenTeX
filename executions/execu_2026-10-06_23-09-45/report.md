# Report — Desk Modules and Fields, run 2 (open rows)

| | |
|---|---|
| Spec | `docs/desk-modules-fields/spec-desk-modules-fields.md` (206 rows) |
| Run | `executions/execu_2026-10-06_23-09-45`, 6 Oct 23:09 → 7 Oct 2026 |
| Target | https://staging-desk.taviportal.com (NDC-Staging), legacy project, login mode fresh |
| Mode | parallel groups, one session per account (owner, second admin, agent, third admin for L12) |
| Scope | rows left open by run 1 (NOT RUN / INCONCLUSIVE) + D8 and K12 (no result in run 1) |

## Result of this run — 55 rows

| PASS | FAIL | MISSING | INCONCLUSIVE | NOT RUN | INFO |
|---|---|---|---|---|---|
| 26 | 10 | 3 | 8 | 6 | 2 |

## Whole spec after runs 1 + 2 — 206 rows

| PASS | FAIL | MISSING | INCONCLUSIVE | NOT RUN | INFO |
|---|---|---|---|---|---|
| 117 | 38 | 26 | 9 | 6 | 10 |

Still open: NOT RUN 6 (standard-module writes, telephony) and INCONCLUSIVE 9 (A9, C9, F7, G27, H5 need access; I26 waits for MF-09; I28, I43, J4 explained below).

## Bugs found in this run — 17

See [bugs/bug-list.md](bugs/bug-list.md). Critical 1 (MF-02), High 7, Medium 4, Low 5.

## Rows

| Row | Verdict | Title | Note | Bug |
|---|---|---|---|---|
| A2 | PASS | Desk Agent cannot open Modules and Fields | Agent (Desk Agent only): /settings/modules-and-fields shows "You don't have permission to view this page"; module table not rendered. |  |
| A3 | PASS | Agent cannot create, edit or delete modules (API) | POST module → 403; PUT QA MF Open → 403; DELETE QA MF Closed → 403. |  |
| A4 | PASS | Agent cannot change fields, layouts or field permissions (API) | POST field → 403; PUT layout → 403; POST field-permission → 403. |  |
| A5 | INFO | What the agent can read | GET /modules → 200 (QA modules listed); GET fields → 200 and hides the Don't-Show field; GET field-permissions → 200; GET /fields/datatypes → 403. |  |
| A6 | PASS | Field Permissions tab not reachable for the agent | Covered by A2: the agent cannot reach the module pages. |  |
| A8 | PASS | Module hidden by Access Control (Selected Users) | Access Control = Selected Users (owner only): PUT /modules/{id}/acl + access-mode "selected". Agent: module not listed, GET records → 403, page shows an access message. |  |
| G10 | PASS | Layout permission is enforced | L-Admin limited to the owner (UI), L-Agent to the Desk Agent profile (API, because the picker offers no Desk profiles — MF-11). Agent sees [Default, QA MF L-Agent]; GET L-Admin → 403; create with L-Agent → 201; with L-Admin → 403. | MF-11 |
| H2 | PASS | Don't Show field hidden from the agent | Value "TOP-SECRET-123" absent from the API record JSON and from the record page. |  |
| H3 | PASS | Read Only field cannot be changed by the agent | PATCH of the read-only field → 422; value unchanged. |  |
| H4 | FAIL | A required field can be set to "Don't Show" | Field Permissions → Desk Agent → Name (required) = Don't Show is accepted (POST field-permissions "hidden"). Every agent create then fails: 422 "One or more fields in the payload are not writable for your profile." | MF-10 |
| H6 | PASS | Record visibility Public Read/Write/Delete | Agent sees 2/2 owner records, GET 200, PATCH 200, DELETE 204, own create 201. |  |
| H7 | PASS | Record visibility Public Read Only | Agent sees 2/2 owner records, GET 200, PATCH 403, DELETE 403, own create 201. |  |
| H8 | PASS | Record visibility Private | Agent sees 0/2 owner records, GET/PATCH/DELETE 403, own create 201. |  |
| H9 | PASS | Access Control with nobody selected | Selected Users with no principal → "Select at least one user, profile, permission, or org unit — or switch back to All Users." |  |
| H10 | FAIL | Profiles chosen in the Create Module dialog are not applied | Create module with Module Permission = Desk Administrator only: the dialog sends PUT /modules/{id}/permissions → 404, no error shown. Agent lists the module, GET records 200, POST record 201. | MF-02 |
| I50 | INFO | Per-profile field permissions store | POST /modules/{id}/field-permissions {fieldId, profileId, permission}; enforcement checked in H2/H3. |  |
| J7 | PASS | Agent cannot manage data types or capabilities | Pages not rendered; POST custom data type → 403; POST capability → 403. |  |
| C4 | FAIL | Department storage has no effect on records | QA MF DeptMod (storageScope "department"): records created with no department, with x-department-id and with department_id all → 201; records carry no department; the list is the same for every user and department (agent in QA MF Dept sees all 4). | MF-35 |
| Z12 | MISSING | Layouts per department and the Department field | Still missing (retest when built): no department picker on Tickets layouts; Department optional and not on Tasks/Calls/Events layouts; none on Contracts/Products. |  |
| I3 | FAIL | Field limit 512 per layout | UI: "Maximum of 512 fields per layout reached." (pass). API: 550 custom fields created and all 550 placed on one layout → 200 (limit not enforced on the server). | MF-41 |
| I5 | PASS | Required + read-only | Builder: with Required on (VALIDATION), the Read-only switch on PERMISSIONS is disabled. Note: the layout API accepts required + read_only on the same field (MF-43). | MF-43 |
| I7 | PASS | Unique across modules | qa_uq shared by QA MF Types and QA MF Open: duplicate in same module → 422 "already in use by another record"; same value in the other module → 422 "already in use by a record in QA MF Types"; and back again. |  |
| I9 | PASS | Full / half width | No per-field width; sections switch between Column and Double Column, which the record form follows. |  |
| I19 | MISSING | Checkbox default on/off | The builder has no default-value setting; a defaultValue placed in the layout is ignored by the form and the API. Checkbox true/false values save correctly. Retest when default values are built. |  |
| I21 | PASS | Remove a used option | Removing Beta (used by 2 records) → "Replace removed options … 2 records use 'Beta'" with Leave empty / Alpha / Gamma; Replace and apply → both records now Alpha. |  |
| I23 | FAIL | Radio / Status values | Radio R2 and Status Doing save correctly and the list shows status chips, but radio "R9" and status "Nope" (not in the list) are also accepted (201) and shown. | MF-37 |
| I24 | MISSING | Default value | No default-value setting in the field builder (GENERAL/VALIDATION/PERMISSIONS/ADVANCED); defaultValue in the layout is ignored on create (form and API). Retest when built. |  |
| I27 | FAIL | Conditional visibility | Rule: show "QA MF dep" (required) when ctrl equals "x". On the form with ctrl = Z the field is shown and required ("This field is required"); the rule is not applied. | MF-34 |
| I28 | INCONCLUSIVE | No controllers message | On a layout with only Name, Conditional visibility offers Created By / Modified By / Created Time / Modified Time as controlling fields, so the "no other field" message cannot appear. |  |
| I29 | PASS | Auto-fill | Builder ADVANCED → Fill from "The logged-in user": form pre-fills "ndc-staging-owner"; a typed value is never overwritten. Note: "Another field on this form" lists only system fields (MF-44). | MF-44 |
| I36 | PASS | Rollup summary | Count and Sum of QA MF Types via lookup qa_lk: parent shows count 2, sum 12. Note: a rollup over a lookup that does not point at the module is also accepted (MF-42). | MF-42 |
| I37 | PASS | Quick-create trigger | Builder ADVANCED quick-create trigger Escalate → Tasks; choosing Escalate opens "New Task". Note: the dialog shows a raw "{{module}}" placeholder (MF-45). | MF-45 |
| I38 | FAIL | File / Image upload restrictions | PDF-only file field (max 1 MB) accepts .txt and .png on the form with no message; a 2.2 MB file gives no message; the record API accepts a text/plain file object (201). SVG script did not run. | MF-36 |
| I43 | INCONCLUSIVE | Delete a field used in a workflow rule | Workflow rule wizard reached (name → trigger "Record Action"), but no rule was completed, so the in-use check was not exercised. |  |
| I46 | PASS | Unused counter | Removing 3 fields → "Unused Fields 3"; restoring removes the counter. |  |
| I47 | FAIL | Field Dependency rules | Rules SHOW qa_b and REQUIRE qa_c when ctrl = Z are stored (2 rules) and listed in the Field Dependency panel, but the form does not apply them (qa_c not required) and the API accepts Z without qa_c. | MF-33 |
| I48 | FAIL | Edit / delete dependency rules | Panel lists the 2 rules with Edit and Delete; deleting both shows "No dependency rules yet", but after Save Rules + Save both rules are still stored. | MF-38 |
| I49 | PASS | Circular dependency | Rules a=On shows bb and bb=On hides a are accepted without warning, but harmless: the form stays responsive, no loop. |  |
| J4 | INCONCLUSIVE | Delete a custom data type in use | A new custom type appears in GET /fields/datatypes but creating a field with it → 400 DATATYPE_KEY_UNKNOWN (MF-39), so "in use" could not be set up. | MF-39 |
| K10 | PASS | Organize Tabs in two browser tabs | Moves from two tabs on the same account: the stale tab gets two 409s but its change is saved; last write wins; no error shown. |  |
| L12 | PASS | Browsers | Firefox and WebKit at 1366×768, 1920×1080, 820×1180: module list, builder palette and canvas, tab bar shown, no horizontal scroll. Drag not confirmed (Playwright drag timed out). |  |
| E2E-2 | FAIL | Tailor the form with a layout and dependency rules | Layout QA MF L-Agent (Desk Agent) with a new section and SHOW/REQUIRE rules: agent picks it, section shown, but serial is visible before Hardware and the record saves with serial empty ("Record saved successfully"); API also 201. | MF-33 |
| D8 | PASS | Arabic UI — Rename | Arabic: page is right-to-left, row menu translated, Rename dialog fully Arabic (اسم الوحدة، الاسم الجمع، الاسم المفرد). Language set back to English. |  |
| K12 | PASS | Custom module tab | New module "QA MF Tab" appears in the "More" menu and in Organize Tabs. |  |
| B6 | NOT RUN | Disable a module with dependencies | Would change a standard module (not allowed). |  |
| B9 | NOT RUN | Reorder modules | Changes the tenant-wide module order (standard modules). |  |
| D2 | NOT RUN | Rename standard module | Would rename a standard module (not allowed). |  |
| D3 | NOT RUN | Tab bar uses the new name | Depends on D2. |  |
| E2E-3 | NOT RUN | Rename and reorganise | Would rename standard modules. |  |
| I44 | NOT RUN | Telephony usage | No telephony configured. |  |
| A9 | INCONCLUSIVE | Other tenant | No second tenant available. |  |
| C9 | INCONCLUSIVE | No teamspace | Cannot remove the tenant teamspace safely. |  |
| F7 | INCONCLUSIVE | Soft-deleted standard fields | Needs confirmation whether the 14 Sep soft-deletes were intended. |  |
| G27 | INCONCLUSIVE | Session expiry mid-edit | Needs a controllable session lifetime. |  |
| H5 | INCONCLUSIVE | Light Agent | No Light Agent account available. |  |

## Tenant changes and cleanup

See [baseline/changes.txt](baseline/changes.txt) and [baseline/diff.txt](baseline/diff.txt) (all sections "same" after cleanup).
- mahmoud.mohamed1 lowered Desk Administrator → Desk Agent for the run, restored to Desk Administrator (now scoped to the Desk org unit; the API requires a scope).
- QA modules (Open, Closed, DeptMod, Types, Limit with 550 fields, Deps, Tab), their records and layouts deleted; QA custom data types deleted; QA MF Dept emptied and deleted.
- **Recycle Bin:** the QA items could not be purged — every "Delete forever" on a Desk item fails (MF-46). They expire after 60 days.
- Second admin's tab order: same standard order; stale QA module keys remain in its saved list.
- One refresh token was written into a log during the run; it was redacted and auth calls were excluded from all captures.

## Notes
- Both admin sessions were signed out by the server once mid-run (all calls 401); both groups were re-run after signing in again.
- One group was stopped by Claude Code for low memory; it was resumed with one browser at a time.
- The missing list said "default value" is built; it is not (I19, I24 → MISSING). The missing list is corrected.

**Interactive report:** [extent-report.html](./extent-report.html)
**Run summary (JSON):** [run-summary.json](./run-summary.json)
