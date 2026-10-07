# Bug list — Desk Modules and Fields, run 2 (execu_2026-10-06_23-09-45)

Target: staging-desk.taviportal.com (NDC-Staging), 6–7 Oct 2026. Accounts: owner, second admin (mahmoud.mmohamedsamy), agent (mahmoud.mohamed1 lowered to Desk Agent for the run, restored after), a third admin for L12. **17 bugs** (IDs continue the consolidated list in docs/desk-modules-fields/desk-modules-fields-bug-report.md). Missing features are not bugs — see NDC-2174.

Evidence rule: annotated TAVI vs Zoho image where a screen exists; API-only bugs carry the request/response in the text.

| ID | Bug | Severity | Priority | Spec row |
|---|---|---|---|---|
| MF-02 | Profiles chosen in the Create Module dialog are not applied | Critical | Urgent | H10 |
| MF-10 | A required field can be set to "Don't Show" | High | High | H4 |
| MF-11 | Access Control picker lists CRM users and profiles instead of Desk ones | High | High | G10, H9 |
| MF-33 | Field dependency rules (SHOW / REQUIRE) are saved but not applied | High | High | I47, E2E-2 |
| MF-34 | Conditional visibility is not applied on the record form | High | High | I27 |
| MF-35 | Department storage has no effect on records | High | High | C4 |
| MF-36 | File and image upload restrictions are not enforced | High | High | I38 |
| MF-37 | Radio and Status fields accept values that are not in their list | High | High | I23 |
| MF-38 | Deleted dependency rules come back after Save | Medium | Medium | I48 |
| MF-39 | Custom data types are listed but cannot be used to create a field (API) | Medium | Medium | J4 |
| MF-40 | Record API stores values for fields that do not exist | Medium | Medium | I7 (setup) |
| MF-46 | Recycle Bin "Delete forever" fails for every Desk item with no message | Medium | Medium | cleanup |
| MF-41 | The 512-fields-per-layout limit is not enforced by the API | Low | Low | I3 |
| MF-42 | Rollup summary accepts a relation that does not point at the module | Low | Low | I36 |
| MF-43 | Layout API accepts Required + Read-only on the same field | Low | Low | I5 |
| MF-44 | Auto-fill "Another field on this form" offers only system fields | Low | Low | I29 |
| MF-45 | Quick-create trigger dialog shows a raw "{{module}}" placeholder | Low | Low | I37 |

## MF-02 — Profiles chosen in the Create Module dialog are not applied
**Severity:** Critical · **Priority:** Urgent · **Spec row:** H10

- **Actual:** The dialog sends PUT /modules/{id}/permissions → 404 with no error; a module meant for Desk Administrator only is listed, readable and writable by Desk Agents.
- **Evidence:** `bugs/screenshots/annotated/H10-vs-zoho.png`

## MF-10 — A required field can be set to "Don't Show"
**Severity:** High · **Priority:** High · **Spec row:** H4

- **Actual:** Required Name set to Don't Show for Desk Agent is saved; agents then get 422 "not writable for your profile" on every create.
- **Evidence:** `bugs/screenshots/annotated/H4-vs-zoho.png`

## MF-11 — Access Control picker lists CRM users and profiles instead of Desk ones
**Severity:** High · **Priority:** High · **Spec row:** G10, H9

- **Actual:** Picker loads /iam/users?app_key=crm; Profiles shows CRM Admin, Manager, Supervisor, test, User; Desk agent not found. Layouts/modules cannot be limited to Desk profiles from the UI.
- **Evidence:** `bugs/screenshots/annotated/MF-11-picker-vs-zoho.png`

## MF-33 — Field dependency rules (SHOW / REQUIRE) are saved but not applied
**Severity:** High · **Priority:** High · **Spec row:** I47, E2E-2

- **Actual:** Rules are stored and listed, but the form ignores them (hidden field shown, required field not required) and the record API accepts records that break them.
- **Evidence:** `bugs/screenshots/annotated/I47-E2E-2-vs-zoho.png`

## MF-34 — Conditional visibility is not applied on the record form
**Severity:** High · **Priority:** High · **Spec row:** I27

- **Actual:** A field set to show only when ctrl = "x" is shown and required when ctrl = Z.
- **Evidence:** `bugs/screenshots/annotated/I27-vs-zoho.png`

## MF-35 — Department storage has no effect on records
**Severity:** High · **Priority:** High · **Spec row:** C4

- **Actual:** Department-storage modules store records without a department; every user sees every record; department header/body ignored.
- **Evidence:** `bugs/screenshots/annotated/C4-vs-zoho.png`

## MF-36 — File and image upload restrictions are not enforced
**Severity:** High · **Priority:** High · **Spec row:** I38

- **Actual:** PDF-only 1 MB field accepts .txt, .png and a 2.2 MB file with no message; the record API accepts any file object.
- **Evidence:** API / run log (no screen)

## MF-37 — Radio and Status fields accept values that are not in their list
**Severity:** High · **Priority:** High · **Spec row:** I23

- **Actual:** Radio "R9" and status "Nope" saved (201) and shown as a status chip. Same family as MF-08.
- **Evidence:** `bugs/screenshots/annotated/I23-vs-zoho.png`

## MF-38 — Deleted dependency rules come back after Save
**Severity:** Medium · **Priority:** Medium · **Spec row:** I48

- **Actual:** Deleting all rules shows "No dependency rules yet", but after Save Rules + Save the 2 rules are still stored.
- **Evidence:** API / run log (no screen)

## MF-39 — Custom data types are listed but cannot be used to create a field (API)
**Severity:** Medium · **Priority:** Medium · **Spec row:** J4

- **Actual:** New custom type appears in GET /fields/datatypes; POST field with that key → 400 DATATYPE_KEY_UNKNOWN.
- **Evidence:** API / run log (no screen)

## MF-40 — Record API stores values for fields that do not exist
**Severity:** Medium · **Priority:** Medium · **Spec row:** I7 (setup)

- **Actual:** Records created with qa_* keys before the fields existed returned 201 and kept the values; when the field was later created as unique, those hidden values counted as duplicates (422).
- **Evidence:** API / run log (no screen)

## MF-46 — Recycle Bin "Delete forever" fails for every Desk item with no message
**Severity:** Medium · **Priority:** Medium · **Spec row:** cleanup

- **Actual:** UI and API: POST /audit/recycle-bin/delete → 200 with failed[] reason "recyclebin.error.unsupported_app"; the page shows no error and the item stays. Desk items can only expire after 60 days.
- **Evidence:** API / run log (no screen)

## MF-41 — The 512-fields-per-layout limit is not enforced by the API
**Severity:** Low · **Priority:** Low · **Spec row:** I3

- **Actual:** UI says "Maximum of 512 fields per layout reached", but PUT layout with 550 fields → 200.
- **Evidence:** API / run log (no screen)

## MF-42 — Rollup summary accepts a relation that does not point at the module
**Severity:** Low · **Priority:** Low · **Spec row:** I36

- **Actual:** Rollup on QA MF DeptMod over QA MF Types.qa_lk (which points at QA MF Open) → 201; rollups were also accepted before the lookup field existed.
- **Evidence:** API / run log (no screen)

## MF-43 — Layout API accepts Required + Read-only on the same field
**Severity:** Low · **Priority:** Low · **Spec row:** I5

- **Actual:** The builder blocks it, but PUT layout with required:true and read_only:true → 200.
- **Evidence:** API / run log (no screen)

## MF-44 — Auto-fill "Another field on this form" offers only system fields
**Severity:** Low · **Priority:** Low · **Spec row:** I29

- **Actual:** Options: Name, Created By, Modified By, Created Time, Modified Time — custom fields on the form are not offered.
- **Evidence:** API / run log (no screen)

## MF-45 — Quick-create trigger dialog shows a raw "{{module}}" placeholder
**Severity:** Low · **Priority:** Low · **Spec row:** I37

- **Actual:** "This {{module}} is created only after you save the record…"
- **Evidence:** API / run log (no screen)
