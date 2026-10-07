# Bug report — Desk Modules, Tabs and Fields

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging) |
| Spec | `docs/desk-modules-fields/spec-desk-modules-fields.md` (206 rows) |
| Runs | Run 1 `executions/execu_2026-10-05_18-05-01` (5–6 Oct 2026) · Run 2 `executions/execu_2026-10-06_23-09-45` (6–7 Oct 2026, in progress) |
| Accounts | Owner, second admin, and `mahmoud.mohamed1` lowered to Desk Agent for run 2 (to be restored at cleanup) |
| Total | **32 bugs** — 29 from run 1, 3 from run 2 |

Missing features compared with Zoho Desk are **not** in this report. They are filed in **NDC-2174**.

**Severity** = how bad the effect is (Critical · High · Medium · Low).
**Priority** = suggested fix order (Urgent · High · Medium · Low).

## Summary

| Severity | Count | | Priority | Count |
|---|---|---|---|---|
| Critical | 2 | | Urgent | 2 |
| High | 9 | | High | 10 |
| Medium | 11 | | Medium | 11 |
| Low | 10 | | Low | 9 |

| # | Bug | Severity | Priority | Spec row | Run |
|---|---|---|---|---|---|
| MF-01 | A CRM Admin profile gives module and field administration inside Desk | Critical | Urgent | SEC-1 | 1 |
| MF-02 | Profiles chosen in the Create Module dialog are not applied | Critical | Urgent | H10 | 2 |
| MF-03 | Records can be saved without the required Name field | High | High | F9 | 1 |
| MF-04 | A saved field's data type can be changed | High | High | I13 | 1 |
| MF-05 | Record API ignores single-line max length | High | High | I14 | 1 |
| MF-06 | Record API ignores number min/max and accepts text in number fields | High | High | I16 | 1 |
| MF-07 | Record API accepts invalid email, phone and `javascript:` URLs | High | High | I18 | 1 |
| MF-08 | Record API accepts pick-list values that are not in the list | High | High | I20 | 1 |
| MF-09 | Field regex is saved but not enforced | High | High | I25 | 1 |
| MF-10 | A required field can be set to "Don't Show", which blocks record creation | High | High | H4 | 2 |
| MF-11 | Access Control picker lists CRM users and profiles instead of Desk ones | High | High | G10 / H9 | 2 |
| MF-12 | Standard modules offer Delete, and five row-menu items do nothing | Medium | High | B8 | 1 |
| MF-13 | A disabled module still accepts records (NDC-1864) | Medium | Medium | B5 | 1 |
| MF-14 | A module can be created with a blank name | Medium | Medium | C3 | 1 |
| MF-15 | Rename accepts an empty name or another module's name | Medium | Medium | D5 | 1 |
| MF-16 | Module save has no lost-update protection | Medium | Medium | D7 | 1 |
| MF-17 | Layout builder → Rename Module crashes the page | Medium | Medium | D9 | 1 |
| MF-18 | Set as default on a layout that holds records returns 500 | Medium | Medium | G6 | 1 |
| MF-19 | Layout save has no lost-update protection | Medium | Medium | G26 | 1 |
| MF-20 | Record API accepts invalid dates | Medium | Medium | I17 | 1 |
| MF-21 | Record API ignores multi-select max items | Medium | Medium | I22 | 1 |
| MF-22 | A new lookup to Contacts is not registered as a related module | Medium | Medium | E2E-1 | 1 |
| MF-23 | Arabic UI leaves "Create New Layout" and the layouts description in English | Low | Medium | L7 | 1 |
| MF-24 | Module list shows "UN" as last modifier of every seeded module | Low | Low | B2 | 1 |
| MF-25 | Web Tabs placeholder says "inside the CRM" | Low | Low | B7 | 1 |
| MF-26 | Setup sidebar says "Set up your CRM" | Low | Low | B10 | 1 |
| MF-27 | Two modules can share the same display name | Low | Low | C6 | 1 |
| MF-28 | Layout builder does not warn about a duplicate layout name | Low | Low | G4 | 1 |
| MF-29 | Field label length (50) not enforced by the API | Low | Low | I11 | 1 |
| MF-30 | Two lookups to the same module can use the same related-list title | Low | Low | I32 | 1 |
| MF-31 | A multi-module lookup can be saved with no modules | Low | Low | I33 | 1 |
| MF-32 | Two layout-builder buttons have no accessible name | Low | Low | L9 | 1 |

Evidence paths below are relative to the run folder named in each bug. API-only bugs carry the request and response in the text.

---

## Critical

### MF-01 — A CRM Admin profile gives module and field administration inside Desk
**Severity:** Critical · **Priority:** Urgent · **Spec row:** SEC-1 · **Run 1**

- **Steps:** Give a user Desk Agent plus CRM Admin. Sign in to Desk. Call `GET /iam/me/permissions` with `x-app-key: desk`. Open Setup → Modules and Fields.
- **Expected:** Only the Desk Agent permissions apply in Desk (`metadata.records.access`, `metadata.records.manage`). Modules and Fields is refused.
- **Actual:** Desk returns CRM Admin's metadata permissions (`metadata.modules.manage`, `metadata.fields.manage_permissions`, `metadata.capabilities.manage`, `metadata.views.manage`, `metadata.integrations.manage`, …). The agent can open and use Modules and Fields in Desk.
- **Evidence:** `browser-sessions/mfadmin-180501-9c45/screenshots/A2-agent-modules-and-fields.png`

### MF-02 — Profiles chosen in the Create Module dialog are not applied
**Severity:** Critical · **Priority:** Urgent · **Spec row:** H10 · **Run 2**

- **Steps:** Setup → Modules and Fields → Create New Module "QA MF Closed". Under Module Permission tick only Desk Administrator. Create. Sign in as a Desk Agent.
- **Expected:** The agent does not see the module and cannot read or create its records.
- **Actual:** The dialog sends `PUT /modules/{id}/permissions {"profileIds":[Desk Administrator]}`, and that endpoint returns **404** (re-sent by the owner: 404 NOT_FOUND). The UI shows no error. The agent sees the module in the list and in the "+" create menu, `GET` records → 200, and `POST` record → **201** (record created).
- **Evidence:** `browser-sessions/mfagent-230945-b20f/screenshots/H10-agent-closed-module.png`, `browser-sessions/mfowner-230945-b20f/screenshots/H10-owner-access-control.png` (Access Control still shows "All Users"); writes in `browser-sessions/mfowner-230945-b20f/logs/s1.json`

---

## High

### MF-03 — Records can be saved without the required Name field
**Severity:** High · **Priority:** High · **Spec row:** F9 · **Run 1**

- **Steps:** `POST /modules/{id}/records` with no `name`, with and without `layout_id` = default layout.
- **Expected:** 400, Name is required.
- **Actual:** 201 in both cases. A required custom field on the same layout is enforced (I4), so only Name is skipped.

### MF-04 — A saved field's data type can be changed
**Severity:** High · **Priority:** High · **Spec row:** I13 · **Run 1**

- **Steps:** `PUT /modules/{id}/fields/{fieldId}` changing `datatypeKey` from `single_line` to `number`.
- **Expected:** Refused (Zoho: "the field type cannot be changed").
- **Actual:** 200. The field becomes a number field and existing text values are left unconverted.

### MF-05 — Record API ignores single-line max length
**Severity:** High · **Priority:** High · **Spec row:** I14 · **Run 1**

- **Steps:** Single-line field with `max_length` 10, placed on the default layout. `POST` a record with 11 characters.
- **Expected:** 400.
- **Actual:** 201, saved.

### MF-06 — Record API ignores number min/max and accepts text in number fields
**Severity:** High · **Priority:** High · **Spec row:** I16 · **Run 1**

- **Steps:** Number field min 0 / max 100 on the layout. `POST` records with 101, -1, "abc" and "15,000".
- **Expected:** 101, -1 and "abc" refused.
- **Actual:** All saved. "abc" is stored as a string in a number field. A currency symbol "EGP12" (UI max 4) is silently not stored.

### MF-07 — Record API accepts invalid email, phone and `javascript:` URLs
**Severity:** High · **Priority:** High · **Spec row:** I18 · **Run 1**

- **Steps:** `POST` a record with email "not-an-email", phone "call me", URL "javascript:alert(1)".
- **Expected:** 400 for each.
- **Actual:** 201, all saved. The `javascript:` URL is a stored-XSS risk wherever URL values are shown as links.

### MF-08 — Record API accepts pick-list values that are not in the list
**Severity:** High · **Priority:** High · **Spec row:** I20 · **Run 1**

- **Steps:** Pick list with options Alpha/Beta/Gamma. `POST` a record with "Delta".
- **Expected:** 400.
- **Actual:** 201, saved.

### MF-09 — Field regex is saved but not enforced
**Severity:** High · **Priority:** High · **Spec row:** I25 · **Run 1**

- **Steps:** Set regex `^[A-Z]{2}[0-9]{4}$` in the builder (saved into the layout). `POST` a record with "ab12".
- **Expected:** 400.
- **Actual:** 201, saved. The builder's regex tester works; only the server ignores it.

### MF-10 — A required field can be set to "Don't Show", which blocks record creation
**Severity:** High · **Priority:** High · **Spec row:** H4 · **Run 2**

- **Steps:** QA MF Open → Fields → Field Permissions → profile Desk Agent → set **Name** (required) to "Don't Show" → Save. As a Desk Agent, create a record.
- **Expected:** "Don't Show" disabled for required fields, or a save-time warning (Zoho does not allow hiding a mandatory field).
- **Actual:** The radio is enabled and the save succeeds (`POST /field-permissions {"permission":"hidden"}` for `name`). Every agent create then fails: 422 "One or more fields in the payload are not writable for your profile."
- **Evidence:** `browser-sessions/mfowner-230945-b20f/screenshots/S3-field-permissions-agent.png`; logs `s3.json`, `browser-sessions/mfagent-230945-b20f/logs/t1.json`

### MF-11 — Access Control picker lists CRM users and profiles instead of Desk ones
**Severity:** High · **Priority:** High · **Spec rows:** G10, H9 · **Run 2**

- **Steps:** Open a layout (or a module) → Layout Permissions / Access Control → Selected Users → "Select principals". Switch the kind to Profiles, then search Users for a Desk agent.
- **Expected:** Desk profiles (Desk Administrator, Desk Supervisor, Desk Agent, Desk Light Agent, Desk Reviewer) and Desk users.
- **Actual:** Profiles shows only CRM Admin, Manager, Supervisor, test, User. The Desk agent `mahmoud.mohamed1@taviportal.com` cannot be found. The picker loads `GET /iam/users?app_key=crm`. A layout or module therefore cannot be limited to a Desk profile or Desk user from the UI. (Limits set through the API with the Desk Agent profile are enforced correctly — G10 passed.)
- **Evidence:** `browser-sessions/mfowner-230945-b20f/screenshots/G10-picker-L-Admin.png`, `browser-sessions/mfowner-230945-b20f/screenshots/A8-selected-users.png`; log `o-g10g.json`

---

## Medium

### MF-12 — Standard modules offer Delete, and five row-menu items do nothing
**Severity:** Medium · **Priority:** High · **Spec row:** B8 · **Run 1**

- **Steps:** Modules list → row menu on Tickets or Calls.
- **Expected:** No Delete on standard modules; every menu item opens its page.
- **Actual:** Delete opens a real 'Delete "Tickets"?' confirmation; only the has-records rule stops it, so an empty standard module could be deleted. Set Validation Rules, Map Dependency Fields, Button, Links and Assignment Rules only add `?tab=…` to the URL and stay on Layouts.
- **Evidence:** `bugs/screenshots/annotated/B8-vs-zoho.png`, `browser-sessions/mfadmin-180501-9c45/screenshots/B8-Delete.png`

### MF-13 — A disabled module still accepts records
**Severity:** Medium · **Priority:** Medium · **Spec row:** B5 · **Run 1** · **Existing ticket: NDC-1864 (do not refile)**

- **Steps:** Disable a QA module. `POST` a record; open `/modules/{id}`.
- **Expected:** Refused; page blocked.
- **Actual:** 201 and the page still works.

### MF-14 — A module can be created with a blank name
**Severity:** Medium · **Priority:** Medium · **Spec row:** C3 · **Run 1**

- **Steps:** `POST` module with plural name "   ".
- **Expected:** 400.
- **Actual:** 201; module stored with `pluralForm: null`. No length limit either (120 characters accepted; Zoho limit 25).

### MF-15 — Rename accepts an empty name or another module's name
**Severity:** Medium · **Priority:** Medium · **Spec row:** D5 · **Run 1**

- **Steps:** `PUT /modules/{id}` with empty plural, then with plural "Tickets".
- **Expected:** Both refused.
- **Actual:** Both 200; plural stored as null, then as "Tickets".

### MF-16 — Module save has no lost-update protection
**Severity:** Medium · **Priority:** Medium · **Spec row:** D7 · **Run 1**

- **Steps:** Two `PUT /modules/{id}` with the same `rowVersion`.
- **Expected:** Second one 409.
- **Actual:** Both 200; the stale one silently overwrites the first.

### MF-17 — Layout builder → Rename Module crashes the page
**Severity:** Medium · **Priority:** Medium · **Spec row:** D9 · **Run 1**

- **Steps:** Open any layout in the builder → gear → Rename Module.
- **Expected:** Rename dialog.
- **Actual:** "Something went wrong — Cannot read properties of undefined (reading 'trim')". Reproduced on Tickets (2/2) and on a QA module.
- **Evidence:** `bugs/screenshots/annotated/D9-vs-zoho.png`, `browser-sessions/mfadmin-180501-9c45/screenshots/D9-rename-module-builder.png`

### MF-18 — Set as default on a layout that holds records returns 500
**Severity:** Medium · **Priority:** Medium · **Spec row:** G6 · **Run 1**

- **Steps:** `POST /modules/{id}/layouts/{layoutId}/set-default` on an active non-default layout with 6 records.
- **Expected:** 200.
- **Actual:** 500 "An unexpected error occurred", 2 of 2 (trace ids `0cb41259-d069-4ef0-8aff-80670c7c5c8e`, `6bf735ec-b2c4-4f7c-88b6-5a4dd621adbe`). A layout without records works.

### MF-19 — Layout save has no lost-update protection
**Severity:** Medium · **Priority:** Medium · **Spec row:** G26 · **Run 1**

- **Steps:** Two `PUT` layout saves with the same `rowVersion`.
- **Expected:** Second one 409.
- **Actual:** Both 200; `rowVersion` never increases.

### MF-20 — Record API accepts invalid dates
**Severity:** Medium · **Priority:** Medium · **Spec row:** I17 · **Run 1**

- **Steps:** `POST` records with date "not a date", 2026-02-29, date-time "yesterday".
- **Expected:** 400.
- **Actual:** All saved as plain strings.

### MF-21 — Record API ignores multi-select max items
**Severity:** Medium · **Priority:** Medium · **Spec row:** I22 · **Run 1**

- **Steps:** Multi-select with `max_items` 2; `POST` 3 values.
- **Expected:** 400.
- **Actual:** 201, 3 values saved.

### MF-22 — A new lookup to Contacts is not registered as a related module
**Severity:** Medium · **Priority:** Medium · **Spec row:** E2E-1 · **Run 1**

- **Steps:** Add a lookup from a QA module to Contacts. `GET /modules/{Contacts}/related-modules`.
- **Expected:** The QA module is listed, so its related list shows on contacts.
- **Actual:** Not listed (Tickets, Calls, Events are).

---

## Low

### MF-23 — Arabic UI leaves "Create New Layout" and the layouts description in English
**Severity:** Low · **Priority:** Medium · **Spec row:** L7 · **Run 1**
- Switch to Arabic → module page → Layouts. "Create New Layout" and "Design your own layouts…" stay in English (hard-coded).
- **Evidence:** `bugs/screenshots/annotated/L7-vs-zoho.png`

### MF-24 — Module list shows "UN" as last modifier of every seeded module
**Severity:** Low · **Priority:** Low · **Spec row:** B2 · **Run 1**
- `lastModifiedByName` is empty on all 9 seeded modules, so the avatar shows "UN".
- **Evidence:** `bugs/screenshots/annotated/B2-vs-zoho.png`

### MF-25 — Web Tabs placeholder says "inside the CRM"
**Severity:** Low · **Priority:** Low · **Spec row:** B7 · **Run 1**
- **Evidence:** `bugs/screenshots/annotated/B7-vs-zoho.png`

### MF-26 — Setup sidebar says "Set up your CRM"
**Severity:** Low · **Priority:** Low · **Spec row:** B10 · **Run 1**
- **Evidence:** `bugs/screenshots/annotated/B10-vs-zoho.png`

### MF-27 — Two modules can share the same display name
**Severity:** Low · **Priority:** Low · **Spec row:** C6 · **Run 1**
- A second "QA MF Devices" (new key) → 201. Only an identical `moduleKey` is refused (409).

### MF-28 — Layout builder does not warn about a duplicate layout name
**Severity:** Low · **Priority:** Low · **Spec row:** G4 · **Run 1**
- Typing "Default" as a new layout name shows no warning; the server refuses it on save (409).

### MF-29 — Field label length (50) not enforced by the API
**Severity:** Low · **Priority:** Low · **Spec row:** I11 · **Run 1**
- `POST` field with a 51-character label → 201.

### MF-30 — Two lookups to the same module can use the same related-list title
**Severity:** Low · **Priority:** Low · **Spec row:** I32 · **Run 1**
- Second lookup to Contacts with the same title → 201.

### MF-31 — A multi-module lookup can be saved with no modules
**Severity:** Low · **Priority:** Low · **Spec row:** I33 · **Run 1**
- `target_modules: []` → 201; the UI says "Select at least one module".

### MF-32 — Two layout-builder buttons have no accessible name
**Severity:** Low · **Priority:** Low · **Spec row:** L9 · **Run 1**
- The Module Image switch (`role=switch`, no `aria-label`) and one icon-only button.

---

## Notes
- MF-05 to MF-09, MF-20 and MF-21 share one cause: the record API does not validate values against the field settings. They can be fixed and retested together.
- MF-01 and MF-11 both come from Desk reading CRM data (permissions and the user/profile directory).
- Run 2 is not finished: 25 spec rows are still to run, so more bugs may be added. The tenant still has QA modules, a QA department and the lowered agent profile; these are cleaned up at the end of run 2.
- Nothing is filed in Plane for these bugs yet.
