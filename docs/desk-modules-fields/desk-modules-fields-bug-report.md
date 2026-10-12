# Bug report — Desk Modules, Tabs and Fields

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging) |
| Spec | `docs/desk-modules-fields/spec-desk-modules-fields.md` (206 rows) |
| Runs | Run 1 `executions/execu_2026-10-05_18-05-01` (5–6 Oct 2026) · Run 2 `executions/execu_2026-10-06_23-09-45` (6–7 Oct 2026) |
| Total | **45 bugs** — 29 from run 1, 16 from run 2 |
| Plane | Filed 12 Oct 2026 as **NDC-2219 … NDC-2262** (label Modules & Fields, module Desk, state Bug); MF-13 is the existing NDC-1864. Evidence files in `bug-evidence/` are named after their ticket. |

Missing features compared with Zoho Desk are **not** in this report — they are in **NDC-2174**.

**Severity** = how bad the effect is. **Priority** = suggested fix order.
**Evidence:** UI bugs have an annotated image (TAVI vs Zoho, numbered boxes and an expected-vs-actual table). API bugs have no image; the request and response are written out. Image files are in `docs/desk-modules-fields/bug-evidence/`, named `<ticket>-annotated.png` and `<ticket>-screenshot.png`.
Placeholders: `{module_id}`, `{layout_id}`, `{field_id}` … are the ids of the QA objects used in the run.

## Summary

| Severity | Count | | Priority | Count |
|---|---|---|---|---|
| Critical | 2 | | Urgent | 2 |
| High | 14 | | High | 15 |
| Medium | 15 | | Medium | 15 |
| Low | 14 | | Low | 13 |

| # | Bug | Severity | Priority | Spec row | Run |
|---|---|---|---|---|---|
| MF-01 | A CRM Admin profile gives module and field administration inside Desk | Critical | Urgent | SEC-1 | 1 |
| MF-02 | Profiles chosen in the Create Module dialog are not applied | Critical | Urgent | H10 | 2 |
| MF-03 | Records can be saved without the required Name field | High | High | F9 | 1 |
| MF-04 | A saved field's data type can be changed | High | High | I13 | 1 |
| MF-05 | Record API ignores single-line max length | High | High | I14 | 1 |
| MF-06 | Record API ignores number min/max and accepts text in number fields | High | High | I16 | 1 |
| MF-07 | Record API accepts invalid email, phone and javascript: URLs | High | High | I18 | 1 |
| MF-08 | Record API accepts pick-list values that are not in the list | High | High | I20 | 1 |
| MF-09 | Field regex is saved but not enforced | High | High | I25 | 1 |
| MF-10 | A required field can be set to "Don't Show" | High | High | H4 | 2 |
| MF-11 | Access Control picker lists CRM users and profiles instead of Desk ones | High | High | G10, H9 | 2 |
| MF-33 | Field dependency rules (SHOW / REQUIRE) are saved but not applied | High | High | I47, E2E-2 | 2 |
| MF-34 | Conditional visibility is not applied on the record form | High | High | I27 | 2 |
| MF-35 | Department storage has no effect on records | High | High | C4 | 2 |
| MF-36 | File and image upload restrictions are not enforced | High | High | I38 | 2 |
| MF-37 | Radio and Status fields accept values that are not in their list | High | High | I23 | 2 |
| MF-12 | Standard modules offer Delete, and five row-menu items do nothing | Medium | High | B8 | 1 |
| MF-13 | A disabled module still accepts records | Medium | Medium | B5 | 1 |
| MF-14 | A module can be created with a blank name | Medium | Medium | C3 | 1 |
| MF-15 | Rename accepts an empty name or another module's name | Medium | Medium | D5 | 1 |
| MF-16 | Module save has no lost-update protection | Medium | Medium | D7 | 1 |
| MF-17 | Layout builder → Rename Module crashes the page | Medium | Medium | D9 | 1 |
| MF-18 | Set as default on a layout that holds records returns 500 | Medium | Medium | G6 | 1 |
| MF-19 | Layout save has no lost-update protection | Medium | Medium | G26 | 1 |
| MF-20 | Record API accepts invalid dates | Medium | Medium | I17 | 1 |
| MF-21 | Record API ignores multi-select max items | Medium | Medium | I22 | 1 |
| MF-22 | A new lookup to Contacts is not registered as a related module | Medium | Medium | E2E-1 | 1 |
| MF-38 | Deleted dependency rules come back after Save | Medium | Medium | I48 | 2 |
| MF-39 | Custom data types are listed but cannot be used to create a field (API) | Medium | Medium | J4 | 2 |
| MF-40 | Record API stores values for fields that do not exist | Medium | Medium | I7 (setup) | 2 |
| MF-46 | Recycle Bin "Delete forever" fails for every Desk item with no message | Medium | Medium | cleanup | 2 |
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
| MF-41 | The 512-fields-per-layout limit is not enforced by the API | Low | Low | I3 | 2 |
| MF-42 | Rollup summary accepts a relation that does not point at the module | Low | Low | I36 | 2 |
| MF-43 | Layout API accepts Required + Read-only on the same field | Low | Low | I5 | 2 |
| MF-45 | Quick-create trigger dialog shows a raw "{{module}}" placeholder | Low | Low | I37 | 2 |

---

## Critical

### MF-01 — A CRM Admin profile gives module and field administration inside Desk
**Plane:** NDC-2219 · **Severity:** Critical · **Priority:** Urgent · **Spec row:** SEC-1 · **Run 1**

**Summary:** A user who has the Desk Agent profile in Desk and the CRM Admin profile in CRM gets CRM Admin's metadata permissions inside Desk, so an agent can open and change Setup → Modules and Fields.

**Steps to reproduce:**

1. Give a user the Desk Agent profile (Desk) and the CRM Admin profile (CRM).
2. Sign in to Desk as that user.
3. Open Setup → Modules and Fields.
4. Call GET /api/v1/iam/me/permissions with header x-app-key: desk.

**Expected result:** Only Desk Agent permissions apply in Desk (metadata.records.access, metadata.records.manage). Modules and Fields says "You don't have permission to view this page".

**Actual result:** The page opens with the full module table and "Create New Module". The permissions response contains CRM Admin's metadata permissions.

**Request:**

```
GET /api/v1/iam/me/permissions  (x-app-key: desk)
```

**Response:**

```
200 — includes metadata.modules.manage, metadata.fields.manage_permissions, metadata.capabilities.manage, metadata.views.manage, metadata.integrations.manage, metadata.records.convert. GET /api/v1/iam/profiles/{desk_agent_id}/effective lists only metadata.records.access and metadata.records.manage.
```

**Evidence:** `bug-evidence/NDC-2219-annotated.png`, `bug-evidence/NDC-2219-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); Gmail test user with Desk Agent + CRM Admin.

### MF-02 — Profiles chosen in the Create Module dialog are not applied
**Plane:** NDC-2220 · **Severity:** Critical · **Priority:** Urgent · **Spec row:** H10 · **Run 2**

**Summary:** When a module is created with "Module Permission" limited to some profiles, the limit is silently lost: the request that saves it returns 404 and the module stays open to everyone.

**Steps to reproduce:**

1. Setup → Modules and Fields → Create New Module.
2. Name "QA MF Closed", Module Permission: tick only Desk Administrator → Create.
3. Sign in as a Desk Agent.
4. Open the "+" create menu and the module page; create a record.

**Expected result:** The agent does not see the module and cannot read or create its records. If saving the permission fails, the dialog shows an error.

**Actual result:** No error is shown. The agent sees the module (sidebar and "+" menu), lists its records and creates a record. Access Control on the module still shows "All Users".

**Request:**

```
PUT /api/v1/modules/{module_id}/permissions
{"profileIds":["44444444-4444-4444-4444-444444444401"]}
```

**Response:**

```
404 {"success":false,"error":{"code":"NOT_FOUND","message":"The requested resource was not found."}}. As the agent afterwards: GET /modules/{module_id}/records → 200; POST /modules/{module_id}/records → 201.
```

**Evidence:** `bug-evidence/NDC-2220-annotated.png`, `bug-evidence/NDC-2220-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); tenant owner creates the module; Desk Agent account (mahmoud.mohamed1, profile lowered for the test) checks access.

---

## High

### MF-03 — Records can be saved without the required Name field
**Plane:** NDC-2221 · **Severity:** High · **Priority:** High · **Spec row:** F9 · **Run 1**

**Summary:** The record API accepts a record with no Name although Name is required on the layout.

**Steps to reproduce:**

1. Use a custom module whose default layout has the required Name field.
2. Send the request below with no "name" value.

**Expected result:** 400/422 — Name is required (as for other required fields, see I4).

**Actual result:** 201 Created; the record has no name.

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[],"layout_id":"{default_layout_id}"}
```

**Response:**

```
201 Created (also 201 without layout_id).
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-04 — A saved field's data type can be changed
**Plane:** NDC-2222 · **Severity:** High · **Priority:** High · **Spec row:** I13 · **Run 1**

**Summary:** An existing field can be switched to another data type through the API; existing values are left unconverted.

**Steps to reproduce:**

1. Create a single-line field and save a record with text in it.
2. Send the request below to change its type to number.
3. Read the field and the record.

**Expected result:** Refused (Zoho: "the field type cannot be changed").

**Actual result:** 200; the field is now a number field and the old text value stays as text.

**Request:**

```
PUT /api/v1/modules/{module_id}/fields/{field_id}
{"fieldName":"qa_sl","labels":{"en":"QA MF sl"},"datatypeKey":"number","required":false,"unique":false,"uniquePeerModuleIds":[]}
```

**Response:**

```
200 OK — datatypeKey "number".
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-05 — Record API ignores single-line max length
**Plane:** NDC-2223 · **Severity:** High · **Priority:** High · **Spec row:** I14 · **Run 1**

**Summary:** A single-line field with max_length 10 accepts a longer value through the record API.

**Steps to reproduce:**

1. Create single-line field qa_sl10 with max_length 10 and place it on the default layout.
2. Send the request below with 11 characters.

**Expected result:** 400/422 — value too long.

**Actual result:** 201; the 11-character value is stored.

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF len"}},{"field":"qa_sl10","value":{"kind":"string","value":"ABCDEFGHIJK"}}],"layout_id":"{default_layout_id}"}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-06 — Record API ignores number min/max and accepts text in number fields
**Plane:** NDC-2224 · **Severity:** High · **Priority:** High · **Spec row:** I16 · **Run 1**

**Summary:** Number fields accept values outside min/max and even text.

**Steps to reproduce:**

1. Create number field qa_num with min 0, max 100 on the default layout.
2. Send records with 101, -1, "abc" and "15,000".

**Expected result:** 101, -1 and "abc" refused.

**Actual result:** All 201. "abc" is stored as a string in the number field; "15,000" becomes 15000. (Also: currency symbol "EGP12", UI max 4, is silently not stored.)

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF num"}},{"field":"qa_num","value":{"kind":"number","value":101}}],"layout_id":"{default_layout_id}"}
(same with -1 and {"kind":"string","value":"abc"})
```

**Response:**

```
201 Created for each.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-07 — Record API accepts invalid email, phone and javascript: URLs
**Plane:** NDC-2225 · **Severity:** High · **Priority:** High · **Spec row:** I18 · **Run 1**

**Summary:** Email, phone and URL fields accept invalid values; a javascript: URL is a stored-XSS risk wherever URLs become links.

**Steps to reproduce:**

1. Create email, phone and URL fields on the default layout.
2. Send a record with the values below.

**Expected result:** 400/422 for each invalid value; javascript: URLs always refused.

**Actual result:** 201; all three values stored.

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF fmt"}},{"field":"qa_email","value":{"kind":"string","value":"not-an-email"}},{"field":"qa_phone","value":{"kind":"string","value":"call me"}},{"field":"qa_url","value":{"kind":"string","value":"javascript:alert(1)"}}],"layout_id":"{default_layout_id}"}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-08 — Record API accepts pick-list values that are not in the list
**Plane:** NDC-2226 · **Severity:** High · **Priority:** High · **Spec row:** I20 · **Run 1**

**Summary:** A pick list with options Alpha/Beta/Gamma accepts any other value.

**Steps to reproduce:**

1. Create pick list qa_pl with options Alpha, Beta, Gamma on the default layout.
2. Send a record with "Delta".

**Expected result:** 400/422 — not one of the options.

**Actual result:** 201; "Delta" stored.

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF pl"}},{"field":"qa_pl","value":{"kind":"string","value":"Delta"}}],"layout_id":"{default_layout_id}"}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-09 — Field regex is saved but not enforced
**Plane:** NDC-2227 · **Severity:** High · **Priority:** High · **Spec row:** I25 · **Run 1**

**Summary:** A regex set in the builder is saved on the layout but the server does not check it.

**Steps to reproduce:**

1. Builder → field qa_rx → Edit Properties → VALIDATION → Regex ^[A-Z]{2}[0-9]{4}$ → Apply → Save.
2. Send a record with "ab12".

**Expected result:** 400/422 — value does not match the pattern.

**Actual result:** 201; "ab12" stored. (The layout stores "regex":"^[A-Z]{2}[0-9]{4}$"; the builder's tester works.)

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF rx"}},{"field":"qa_rx","value":{"kind":"string","value":"ab12"}}],"layout_id":"{default_layout_id}"}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-10 — A required field can be set to "Don't Show"
**Plane:** NDC-2228 · **Severity:** High · **Priority:** High · **Spec row:** H4 · **Run 2**

**Summary:** Field Permissions lets an admin hide a required field from a profile; that profile can then no longer create any record.

**Steps to reproduce:**

1. Module → Fields → Field Permissions → profile Desk Agent.
2. Set Name (required) to "Don't Show" → Save.
3. As a Desk Agent, create a record (form or API).

**Expected result:** "Don't Show" disabled for required fields, or Save refused with a message.

**Actual result:** Saved ("3 field permissions updated"). Every agent create then fails with 422 "One or more fields in the payload are not writable for your profile."

**Request:**

```
POST /api/v1/modules/{module_id}/field-permissions
{"fieldId":"{name_field_id}","profileId":"44444444-4444-4444-4444-444444444402","permission":"hidden"}
then as the agent: POST /api/v1/modules/{module_id}/records {"data":[{"field":"name","value":{"kind":"string","value":"QA MF agent rec"}}]}
```

**Response:**

```
field-permissions → 200/201. Agent record → 422 "One or more fields in the payload are not writable for your profile."
```

**Evidence:** `bug-evidence/NDC-2228-annotated.png`, `bug-evidence/NDC-2228-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); tenant owner; Desk Agent account (mahmoud.mohamed1, profile lowered for the test).

### MF-11 — Access Control picker lists CRM users and profiles instead of Desk ones
**Plane:** NDC-2229 · **Severity:** High · **Priority:** High · **Spec row:** G10, H9 · **Run 2**

**Summary:** The "Select principals" picker used by module Access Control and Layout Permissions loads CRM users and profiles, so a layout or module cannot be limited to a Desk profile or a Desk agent.

**Steps to reproduce:**

1. Open a layout → Layout settings → Layout Permissions (or a module → Access Control).
2. Choose Selected Users → Select principals.
3. Switch the kind to Profiles; then search Users for a Desk agent.

**Expected result:** Desk profiles (Desk Administrator, Supervisor, Agent, Light Agent, Reviewer) and Desk agents.

**Actual result:** Profiles: CRM Admin, Manager, Supervisor, test, User. The Desk agent mahmoud.mohamed1@taviportal.com is not found.

**Request:**

```
GET /api/v1/iam/users?app_key=crm  (sent by the picker; also GET /iam/profiles, /iam/org-units)
```

**Response:**

```
200 — CRM users only. Note: a limit set through the API with the Desk Agent profile id is enforced correctly (G10 passed).
```

**Evidence:** `bug-evidence/NDC-2229-annotated.png`, `bug-evidence/NDC-2229-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); tenant owner.

### MF-33 — Field dependency rules (SHOW / REQUIRE) are saved but not applied
**Plane:** NDC-2230 · **Severity:** High · **Priority:** High · **Spec row:** I47, E2E-2 · **Run 2**

**Summary:** Field Dependency rules are stored and listed, but neither the record form nor the record API applies them.

**Steps to reproduce:**

1. Layout QA MF L-Agent: add rules "When QA MF e2e_kind = Hardware → Show QA MF e2e_serial" and "→ Require QA MF e2e_serial".
2. As a Desk Agent: "+" → QA MF Open1 → choose layout QA MF L-Agent.
3. Look at QA MF e2e_serial before choosing a kind; choose Hardware; leave serial empty; Save.

**Expected result:** Serial hidden until Hardware is chosen; then required; Save blocked. The API refuses the same record.

**Actual result:** Serial is visible before Hardware; the record saves with serial empty ("Record saved successfully"); the API returns 201. Same on module QA MF Deps (SHOW qa_b / REQUIRE qa_c when ctrl = Z).

**Request:**

```
PUT /api/v1/modules/{module_id}/layouts/{layout_id}  (…"dependencies":[{"id":"{uuid}","parentFieldId":"{kind_id}","parentValues":["Hardware"],"action":"SHOW","childFieldIds":["{serial_id}"]},{"id":"{uuid}","parentFieldId":"{kind_id}","parentValues":["Hardware"],"action":"REQUIRE","childFieldIds":["{serial_id}"]}])
then as the agent: POST /api/v1/modules/{module_id}/records {"data":[{"field":"name","value":{"kind":"string","value":"QA MF E2E hw no serial"}},{"field":"qa_e2e_kind","value":{"kind":"string","value":"Hardware"}}],"layout_id":"{layout_id}"}
```

**Response:**

```
Layout PUT → 200 (2 rules stored). Record → 201 Created.
```

**Evidence:** `bug-evidence/NDC-2230-annotated.png`, `bug-evidence/NDC-2230-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); tenant owner sets the rules; Desk Agent account (mahmoud.mohamed1, profile lowered for the test) creates the record.

### MF-34 — Conditional visibility is not applied on the record form
**Plane:** NDC-2231 · **Severity:** High · **Priority:** High · **Spec row:** I27 · **Run 2**

**Summary:** A field set to show only when another field has a given value is always shown, and its Required flag applies even while it should be hidden.

**Steps to reproduce:**

1. Field "QA MF dep" (required) → Edit Properties → VALIDATION → Conditional visibility: show when QA MF ctrl equals "x" → Apply → Save.
2. "+" → create a record, set QA MF ctrl = Z, fill Name and Save.

**Expected result:** QA MF dep hidden and not required while ctrl ≠ x.

**Actual result:** QA MF dep is shown and Save says "This field is required" with ctrl = Z.

**Request:**

```
Layout field config stored: "visibilityRule":{"dependsOn":"qa_ctrl","anyNonEmpty":false,"equalsAny":["x"]}
```

**Response:**

```
—
```

**Evidence:** `bug-evidence/NDC-2231-annotated.png`, `bug-evidence/NDC-2231-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); second admin (Desk Administrator).

### MF-35 — Department storage has no effect on records
**Plane:** NDC-2232 · **Severity:** High · **Priority:** High · **Spec row:** C4 · **Run 2**

**Summary:** A module created with Module Data Storage = Department stores records without a department, and every user sees every record.

**Steps to reproduce:**

1. Create New Module "QA MF DeptMod" with Module Data Storage = Department.
2. Create records: plain, with header x-department-id, and with department_id in the body.
3. List the records as an agent who belongs only to "QA MF Dept", and as an admin.

**Expected result:** Each record belongs to a department; users see only their departments' records.

**Actual result:** All creates return 201; records carry no department field; the agent and the admin see the same 4 records; the list is the same with or without a department header.

**Request:**

```
POST /api/v1/teamspaces/{teamspace_id}/modules {"moduleKey":"qa_mf_deptmod","labels":{"en":"QA MF DeptMod"},"pluralForm":"QA MF DeptMod","singularForm":"QA MF DeptMod1","storageScope":"department"}
POST /api/v1/modules/{module_id}/records {"data":[{"field":"name","value":{"kind":"string","value":"QA MF dept rec hdr"}}]}  (header x-department-id: {department_id})
POST /api/v1/modules/{module_id}/records {"data":[…],"department_id":"{department_id}"}
```

**Response:**

```
Module 201 (storageScope "department"). Records 201 ×3, no department in the stored record. GET records → same 3–4 records for every user and header.
```

**Evidence:** `bug-evidence/NDC-2232-annotated.png`, `bug-evidence/NDC-2232-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); second admin; Desk Agent account (mahmoud.mohamed1, profile lowered for the test).

### MF-36 — File and image upload restrictions are not enforced
**Plane:** NDC-2233 · **Severity:** High · **Priority:** High · **Spec row:** I38 · **Run 2**

**Summary:** A File Upload field limited to PDF and 1 MB accepts other file types and larger files, on the form and through the API, with no message.

**Steps to reproduce:**

1. Create File Upload field "QA MF file" with allowed extensions [pdf], max 1 MB, and Image Upload "QA MF img" with [png], 1 MB.
2. On the create form upload qa-mf.txt, qa-mf.png and a 2.2 MB PDF to QA MF file.
3. Send the API request below.

**Expected result:** Wrong type and too-large files refused with a message; the API refuses them too.

**Actual result:** The form takes the .txt and .png with no message and shows no message for the 2.2 MB file; the API returns 201. (An SVG with a script did not run.)

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF upload api"}},{"field":"qa_file","value":{"kind":"object","properties":{"url":{"kind":"string","value":"x"},"mime":{"kind":"string","value":"text/plain"},"name":{"kind":"string","value":"qa-mf.txt"},"size":{"kind":"number","value":22}}}}],"layout_id":"{default_layout_id}"}
Field options: {"allowed_extensions":["pdf"],"max_size_mb":1}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); second admin (Desk Administrator).

### MF-37 — Radio and Status fields accept values that are not in their list
**Plane:** NDC-2234 · **Severity:** High · **Priority:** High · **Spec row:** I23 · **Run 2**

**Summary:** Radio button and Status fields accept any value through the record API, and the list then shows it as a status.

**Steps to reproduce:**

1. Create radio qa_rb (R1, R2) and status qa_st (New, Doing, Done) on the default layout.
2. Send the request below.
3. Open the module's record list.

**Expected result:** 400/422 — not one of the values.

**Actual result:** 201; "R9" and "Nope" stored; "Nope" shown as a status chip on the list. Same family as MF-08.

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF radio bad"}},{"field":"qa_rb","value":{"kind":"string","value":"R9"}},{"field":"qa_st","value":{"kind":"string","value":"Nope"}}],"layout_id":"{default_layout_id}"}
```

**Response:**

```
201 Created.
```

**Evidence:** `bug-evidence/NDC-2234-annotated.png`, `bug-evidence/NDC-2234-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); tenant owner.

---

## Medium

### MF-12 — Standard modules offer Delete, and five row-menu items do nothing
**Plane:** NDC-2235 · **Severity:** Medium · **Priority:** High · **Spec row:** B8 · **Run 1**

**Summary:** The row menu on standard modules offers Delete (stopped only when the module has records), and five items only change the URL.

**Steps to reproduce:**

1. Setup → Modules and Fields → row menu (⋯) on Tickets or Calls.
2. Click Set Validation Rules, Map Dependency Fields, Button, Links, Assignment Rules.
3. Click Delete (cancel at the confirmation).

**Expected result:** No Delete on standard modules; every item opens its page.

**Actual result:** The five items only add ?tab=… and stay on Layouts. Delete opens a real 'Delete "Tickets"? … Delete module' confirmation; an empty standard module could be deleted.

**Evidence:** `bug-evidence/NDC-2235-annotated.png`, `bug-evidence/NDC-2235-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-13 — A disabled module still accepts records
**Plane:** NDC-1864 · **Severity:** Medium · **Priority:** Medium · **Spec row:** B5 · **Run 1** · **Existing ticket: NDC-1864 (do not refile)**

**Summary:** After a module is switched off it leaves the tab bar, but its page and the record API still work.

**Steps to reproduce:**

1. Switch a QA module off in Modules and Fields.
2. Open /modules/{module_id}; send the request below.

**Expected result:** Page blocked; record refused.

**Actual result:** Page opens and works; the record is created.

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF while disabled"}}]}
```

**Response:**

```
201 Created (module status "disabled").
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-14 — A module can be created with a blank name
**Plane:** NDC-2236 · **Severity:** Medium · **Priority:** Medium · **Spec row:** C3 · **Run 1**

**Summary:** The module API accepts a name made only of spaces and has no length limit.

**Steps to reproduce:**

1. Send the request below.
2. Repeat with a 120-character name.

**Expected result:** 400 — name required; max length enforced (Zoho UI limit 25).

**Actual result:** 201; module stored with pluralForm null. 120 characters accepted.

**Request:**

```
POST /api/v1/teamspaces/{teamspace_id}/modules
{"moduleKey":"qa_mf_blank","labels":{"en":"   "},"pluralForm":"   ","singularForm":"   ","storageScope":"organization"}
```

**Response:**

```
201 Created — "pluralForm": null.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-15 — Rename accepts an empty name or another module's name
**Plane:** NDC-2237 · **Severity:** Medium · **Priority:** Medium · **Spec row:** D5 · **Run 1**

**Summary:** A module can be renamed to an empty name or to the name of another module.

**Steps to reproduce:**

1. Send the request below with an empty plural.
2. Send it again with pluralForm "Tickets".

**Expected result:** Both refused.

**Actual result:** Both 200; plural stored as null, then as "Tickets".

**Request:**

```
PUT /api/v1/modules/{module_id}
{"pluralForm":"","singularForm":"QA MF Device","description":null,"rowVersion":{n}}
```

**Response:**

```
200 OK (pluralForm null); with "Tickets" → 200 OK.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-16 — Module save has no lost-update protection
**Plane:** NDC-2238 · **Severity:** Medium · **Priority:** Medium · **Spec row:** D7 · **Run 1**

**Summary:** Two saves of a module with the same rowVersion both succeed; the stale one silently overwrites the other.

**Steps to reproduce:**

1. GET /api/v1/modules/{module_id} and note rowVersion.
2. Send PUT with description "tab one" and that rowVersion.
3. Send PUT with description "tab two (stale)" and the same rowVersion.

**Expected result:** Second PUT → 409 Conflict.

**Actual result:** Both 200; description is "tab two (stale)".

**Request:**

```
PUT /api/v1/modules/{module_id}
{"pluralForm":"QA MF Devices","singularForm":"QA MF Device","description":"tab two (stale)","rowVersion":{same_n}}
```

**Response:**

```
200 OK (twice).
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-17 — Layout builder → Rename Module crashes the page
**Plane:** NDC-2239 · **Severity:** Medium · **Priority:** Medium · **Spec row:** D9 · **Run 1**

**Summary:** Opening Rename Module from the layout builder's gear menu crashes the page.

**Steps to reproduce:**

1. Open any layout in the builder (e.g. Tickets → Default).
2. Gear (Layout settings) → Rename Module.

**Expected result:** The rename dialog opens.

**Actual result:** "Something went wrong — Cannot read properties of undefined (reading 'trim')". Reproduced on Tickets 2/2 and on a QA module.

**Evidence:** `bug-evidence/NDC-2239-annotated.png`, `bug-evidence/NDC-2239-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-18 — Set as default on a layout that holds records returns 500
**Plane:** NDC-2240 · **Severity:** Medium · **Priority:** Medium · **Spec row:** G6 · **Run 1**

**Summary:** Making a layout the default fails with a server error when that layout already has records.

**Steps to reproduce:**

1. On a QA module, create a second active layout and save 6 records with it.
2. Send the request below.

**Expected result:** 200; the layout becomes the default.

**Actual result:** 500 on 2 of 2 attempts. The same call on a layout without records returns 200.

**Request:**

```
POST /api/v1/modules/{module_id}/layouts/{layout_id}/set-default
```

**Response:**

```
500 "An unexpected error occurred" — trace ids 0cb41259-d069-4ef0-8aff-80670c7c5c8e, 6bf735ec-b2c4-4f7c-88b6-5a4dd621adbe.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-19 — Layout save has no lost-update protection
**Plane:** NDC-2241 · **Severity:** Medium · **Priority:** Medium · **Spec row:** G26 · **Run 1**

**Summary:** Two layout saves with the same rowVersion both succeed and rowVersion never increases.

**Steps to reproduce:**

1. GET a layout and note rowVersion.
2. Send two PUTs with different names and the same rowVersion.

**Expected result:** Second PUT → 409.

**Actual result:** Both 200; the second overwrites the first; rowVersion stays the same.

**Request:**

```
PUT /api/v1/modules/{module_id}/layouts/{layout_id}
{…full layout…,"name":"QA MF L2 stale","rowVersion":{same_n}}
```

**Response:**

```
200 OK (twice).
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-20 — Record API accepts invalid dates
**Plane:** NDC-2242 · **Severity:** Medium · **Priority:** Medium · **Spec row:** I17 · **Run 1**

**Summary:** Date and date-time fields accept any text.

**Steps to reproduce:**

1. Create date qa_date and date-time qa_dt on the default layout.
2. Send records with "not a date", "2026-02-29" and "yesterday".

**Expected result:** 400/422.

**Actual result:** 201; all stored as plain strings.

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF date"}},{"field":"qa_date","value":{"kind":"string","value":"2026-02-29"}},{"field":"qa_dt","value":{"kind":"string","value":"yesterday"}}],"layout_id":"{default_layout_id}"}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-21 — Record API ignores multi-select max items
**Plane:** NDC-2243 · **Severity:** Medium · **Priority:** Medium · **Spec row:** I22 · **Run 1**

**Summary:** A multi-select with max_items 2 accepts 3 values.

**Steps to reproduce:**

1. Create multi-select qa_ms (A, B, C) with max_items 2 on the default layout.
2. Send the request below.

**Expected result:** 400/422.

**Actual result:** 201; 3 values stored.

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF ms"}},{"field":"qa_ms","value":{"kind":"array","items":[{"kind":"string","value":"A"},{"kind":"string","value":"B"},{"kind":"string","value":"C"}]}}],"layout_id":"{default_layout_id}"}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-22 — A new lookup to Contacts is not registered as a related module
**Plane:** NDC-2244 · **Severity:** Medium · **Priority:** Medium · **Spec row:** E2E-1 · **Run 1**

**Summary:** After a custom module gets a lookup to Contacts, Contacts does not list it as a related module, so the related list will not appear on contacts.

**Steps to reproduce:**

1. Add lookup qa_lk from QA MF Devices to Contacts (related-list title "QA MF Devices").
2. Send the request below.

**Expected result:** QA MF Devices is listed.

**Actual result:** Not listed (Tickets, Calls, Events … are).

**Request:**

```
GET /api/v1/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/related-modules
```

**Response:**

```
200 — QA MF Devices missing from the list.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-38 — Deleted dependency rules come back after Save
**Plane:** NDC-2245 · **Severity:** Medium · **Priority:** Medium · **Spec row:** I48 · **Run 2**

**Summary:** Deleting Field Dependency rules in the builder looks successful, but the rules are still stored after saving.

**Steps to reproduce:**

1. Layout with 2 Field Dependency rules → Layout settings → Field Dependency.
2. Delete both rules ("No dependency rules yet" appears) → Save Rules → Save.
3. Read the layout.

**Expected result:** No rules stored.

**Actual result:** GET layout still returns both rules.

**Request:**

```
GET /api/v1/modules/{module_id}/layouts/{layout_id}
```

**Response:**

```
200 — "dependencies" still has 2 rules.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); second admin (Desk Administrator).

### MF-39 — Custom data types are listed but cannot be used to create a field (API)
**Plane:** NDC-2246 · **Severity:** Medium · **Priority:** Medium · **Spec row:** J4 · **Run 2**

**Summary:** A new custom data type appears in the datatype catalogue, but creating a field with it is refused.

**Steps to reproduce:**

1. Create a custom data type (request 1).
2. Check GET /api/v1/fields/datatypes — qa_mf_dt2 is listed.
3. Create a field with it (request 2).

**Expected result:** Field created with the custom type.

**Actual result:** 400 DATATYPE_KEY_UNKNOWN. This also blocks spec row J4 (delete a type in use).

**Request:**

```
1) POST /api/v1/custom-datatypes {"key":"qa_mf_dt2","label":"QA MF dt2","base_datatype_key":"single_line","icon":"type"}
2) POST /api/v1/modules/{module_id}/fields {"fields":[{"fieldName":"qa_cdt2","labels":{"en":"QA MF cdt2"},"datatypeKey":"qa_mf_dt2","required":false,"unique":false,"uniquePeerModuleIds":[]}]}
```

**Response:**

```
1) 201. 2) 400 {"code":"DATATYPE_KEY_UNKNOWN","message":"Field 'qa_cdt2': Datatype key 'qa_mf_dt2' is not a recognized datatype. Call GET /api/v1/fields/datatypes …"}
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); second admin (Desk Administrator).

### MF-40 — Record API stores values for fields that do not exist
**Plane:** NDC-2247 · **Severity:** Medium · **Priority:** Medium · **Spec row:** I7 (setup) · **Run 2**

**Summary:** The record API accepts and keeps values for field names that do not exist on the module; they later collide with real fields.

**Steps to reproduce:**

1. On a module without field qa_uq, send the request below.
2. Later create qa_uq as a unique field.
3. Create a new record with qa_uq = "QA-UQ-1".

**Expected result:** Unknown field refused (400).

**Actual result:** First record 201 and the value is kept; after qa_uq is created, the new record is refused as a duplicate (422 "already in use").

**Request:**

```
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF uq 1"}},{"field":"qa_uq","value":{"kind":"string","value":"QA-UQ-1"}}],"layout_id":"{default_layout_id}"}
```

**Response:**

```
201 Created; later 422 RECORD_FIELD_INVALID "QA MF uq is already in use by another record."
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); tenant owner.

### MF-46 — Recycle Bin "Delete forever" fails for every Desk item with no message
**Plane:** NDC-2248 · **Severity:** Medium · **Priority:** Medium · **Spec row:** cleanup · **Run 2**

**Summary:** Permanently deleting a Desk item from the Recycle Bin fails, but the page shows no error.

**Steps to reproduce:**

1. Setup → Data → Recycle Bin.
2. Row ⋮ → Delete forever on any Desk item (e.g. a deleted department or record).

**Expected result:** Item permanently deleted, or an error message.

**Actual result:** No message; the item stays. Desk items can only expire after 60 days.

**Request:**

```
POST /api/v1/audit/recycle-bin/delete
{"ids":["607b8057-8e25-4ba8-bfcc-86a320facd4f"]}
```

**Response:**

```
200 {"success":true,"data":{"succeeded":[],"failed":[{"id":"607b8057-…","reason_key":"recyclebin.error.unsupported_app","detail":null}],"skipped":[]}}
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); second admin (Desk Administrator).

---

## Low

### MF-23 — Arabic UI leaves "Create New Layout" and the layouts description in English
**Plane:** NDC-2249 · **Severity:** Low · **Priority:** Medium · **Spec row:** L7 · **Run 1**

**Summary:** Two strings on a module's Layouts tab are not translated.

**Steps to reproduce:**

1. Switch the UI to العربية.
2. Setup → Modules and Fields → open a module → Layouts.

**Expected result:** All text in Arabic.

**Actual result:** "Create New Layout" and "Design your own layouts to fit your business processes…" stay in English.

**Evidence:** `bug-evidence/NDC-2249-annotated.png`, `bug-evidence/NDC-2249-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-24 — Module list shows "UN" as last modifier of every seeded module
**Plane:** NDC-2250 · **Severity:** Low · **Priority:** Low · **Spec row:** B2 · **Run 1**

**Summary:** The Last Modified avatar shows "UN" because seeded modules have no modifier name.

**Steps to reproduce:**

1. Setup → Modules and Fields → look at Last Modified.

**Expected result:** A real name (or "System").

**Actual result:** "UN" on all 9 seeded modules; GET /modules returns empty lastModifiedByName.

**Request:**

```
GET /api/v1/modules
```

**Response:**

```
200 — "lastModifiedByName": "" on all 9 seeded modules (created by system user a7a7a7a7-…0004).
```

**Evidence:** `bug-evidence/NDC-2250-annotated.png`, `bug-evidence/NDC-2250-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-25 — Web Tabs placeholder says "inside the CRM"
**Plane:** NDC-2251 · **Severity:** Low · **Priority:** Low · **Spec row:** B7 · **Run 1**

**Summary:** Desk shows CRM wording on the Web Tabs placeholder.

**Steps to reproduce:**

1. Setup → Modules and Fields → Web Tabs.

**Expected result:** Desk wording.

**Actual result:** Text says "inside the CRM".

**Evidence:** `bug-evidence/NDC-2251-annotated.png`, `bug-evidence/NDC-2251-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-26 — Setup sidebar says "Set up your CRM"
**Plane:** NDC-2252 · **Severity:** Low · **Priority:** Low · **Spec row:** B10 · **Run 1**

**Summary:** Desk Setup shows CRM wording.

**Steps to reproduce:**

1. Open Setup in Desk.

**Expected result:** Desk wording.

**Actual result:** Sidebar button "Set up your CRM".

**Evidence:** `bug-evidence/NDC-2252-annotated.png`, `bug-evidence/NDC-2252-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-27 — Two modules can share the same display name
**Plane:** NDC-2253 · **Severity:** Low · **Priority:** Low · **Spec row:** C6 · **Run 1**

**Summary:** A second module can use an existing display name; only an identical module key is refused.

**Steps to reproduce:**

1. Create "QA MF Devices".
2. Create another module named "QA MF Devices" with a different key.

**Expected result:** Refused — name already used.

**Actual result:** 201. Only an identical moduleKey gives 409 "Module key already exists".

**Request:**

```
POST /api/v1/teamspaces/{teamspace_id}/modules
{"moduleKey":"qa_mf_devices2","labels":{"en":"QA MF Devices"},"pluralForm":"QA MF Devices","singularForm":"QA MF Device","storageScope":"organization"}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-28 — Layout builder does not warn about a duplicate layout name
**Plane:** NDC-2254 · **Severity:** Low · **Priority:** Low · **Spec row:** G4 · **Run 1**

**Summary:** The builder lets you type an existing layout name; the error appears only when saving.

**Steps to reproduce:**

1. Builder → rename a layout to "Default" (already used).
2. Save.

**Expected result:** Inline warning "A layout with this name already exists".

**Actual result:** No warning while typing; on Save the server refuses (409).

**Request:**

```
PUT /api/v1/modules/{module_id}/layouts/{layout_id} {…,"name":"Default"}
```

**Response:**

```
409 "A layout named 'Default' already exists on this module. Choose a different name".
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-29 — Field label length (50) not enforced by the API
**Plane:** NDC-2255 · **Severity:** Low · **Priority:** Low · **Spec row:** I11 · **Run 1**

**Summary:** The 50-character label limit is only checked in the builder.

**Steps to reproduce:**

1. Send the request below with a 51-character label.

**Expected result:** 400 — label too long.

**Actual result:** 201.

**Request:**

```
POST /api/v1/modules/{module_id}/fields
{"fields":[{"fieldName":"qa_long","labels":{"en":"{51 characters}"},"datatypeKey":"single_line","required":false,"unique":false,"uniquePeerModuleIds":[]}]}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-30 — Two lookups to the same module can use the same related-list title
**Plane:** NDC-2256 · **Severity:** Low · **Priority:** Low · **Spec row:** I32 · **Run 1**

**Summary:** Related-list titles are not unique among lookups to the same module.

**Steps to reproduce:**

1. Create a lookup to Contacts with related-list title "QA MF Devices".
2. Create a second lookup to Contacts with the same title.

**Expected result:** Second one refused.

**Actual result:** 201.

**Request:**

```
POST /api/v1/modules/{module_id}/fields
{"fields":[{"fieldName":"qa_lk2","labels":{"en":"QA MF lk2"},"datatypeKey":"lookup","datatypeOptions":{"target_module_id":"43004ce2-577f-4eda-b00a-0750fe40c3d4","display_field":"first_name","related_module":"QA MF Devices"}}]}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-31 — A multi-module lookup can be saved with no modules
**Plane:** NDC-2257 · **Severity:** Low · **Priority:** Low · **Spec row:** I33 · **Run 1**

**Summary:** The API accepts a multi-module lookup with an empty module list.

**Steps to reproduce:**

1. Send the request below.

**Expected result:** 400 (the UI says "Select at least one module").

**Actual result:** 201.

**Request:**

```
POST /api/v1/modules/{module_id}/fields
{"fields":[{"fieldName":"qa_mlk","labels":{"en":"QA MF mlk"},"datatypeKey":"lookup","datatypeOptions":{"target_modules":[]}}]}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-32 — Two layout-builder buttons have no accessible name
**Plane:** NDC-2258 · **Severity:** Low · **Priority:** Low · **Spec row:** L9 · **Run 1**

**Summary:** Screen readers cannot name two builder controls.

**Steps to reproduce:**

1. Open the layout builder.
2. Inspect the Module Image switch and the icon-only button next to it.

**Expected result:** Both have an aria-label.

**Actual result:** The switch (role=switch) and the svg-only button have no accessible name.

**Evidence:** No screenshot — follow the steps above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026 (run 1); admin account (Desk Administrator).

### MF-41 — The 512-fields-per-layout limit is not enforced by the API
**Plane:** NDC-2259 · **Severity:** Low · **Priority:** Low · **Spec row:** I3 · **Run 2**

**Summary:** The builder stops at 512 fields per layout, but the API saves a layout with more.

**Steps to reproduce:**

1. Create 550 custom fields on a QA module.
2. Send the layout PUT below with all 550 fields.
3. Open the builder and click a palette item.

**Expected result:** API refuses more than 512 fields per layout.

**Actual result:** API 200 with 550 fields on the layout; the builder then shows "Maximum of 512 fields per layout reached."

**Request:**

```
POST /api/v1/modules/{module_id}/fields (11 × 50 fields)
PUT /api/v1/modules/{module_id}/layouts/{layout_id} {…550 fields in the sections…}
```

**Response:**

```
Fields 201 ×11; layout 200 OK.
```

**Evidence:** `bug-evidence/NDC-2259-annotated.png`, `bug-evidence/NDC-2259-screenshot.png`

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); tenant owner.

### MF-42 — Rollup summary accepts a relation that does not point at the module
**Plane:** NDC-2260 · **Severity:** Low · **Priority:** Low · **Spec row:** I36 · **Run 2**

**Summary:** A rollup can be created over a lookup that does not point at the module (or does not exist yet).

**Steps to reproduce:**

1. Send the request below on QA MF DeptMod (qa_lk on QA MF Types points at QA MF Open, not DeptMod).

**Expected result:** Refused ("The selected module has no lookup field pointing at this module").

**Actual result:** 201. Rollups were also accepted while the lookup field did not exist.

**Request:**

```
POST /api/v1/modules/{deptmod_id}/fields
{"fields":[{"fieldName":"qa_bad_rollup","labels":{"en":"QA MF bad_rollup"},"datatypeKey":"rollup_summary","datatypeOptions":{"target_module_id":"{types_id}","relation_field":"qa_lk","target_field":"qa_num","aggregation":"count"}}]}
```

**Response:**

```
201 Created.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); tenant owner.

### MF-43 — Layout API accepts Required + Read-only on the same field
**Plane:** NDC-2261 · **Severity:** Low · **Priority:** Low · **Spec row:** I5 · **Run 2**

**Summary:** The builder blocks Required + Read-only together, but the layout API accepts it.

**Steps to reproduce:**

1. Send a layout PUT where one field entry has config required:true and read_only:true.

**Expected result:** 400 — cannot be both.

**Actual result:** 200.

**Request:**

```
PUT /api/v1/modules/{module_id}/layouts/{layout_id} {…{"fieldName":"qa_req","config":{"required":true,"read_only":true}}…}
```

**Response:**

```
200 OK.
```

**Evidence:** API only — see the request and response above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); second admin (Desk Administrator).

### MF-45 — Quick-create trigger dialog shows a raw "{{module}}" placeholder
**Plane:** NDC-2262 · **Severity:** Low · **Priority:** Low · **Spec row:** I37 · **Run 2**

**Summary:** The quick-create pop-up shows an untranslated placeholder.

**Steps to reproduce:**

1. Pick list with quick-create trigger "Escalate → Tasks".
2. On the create form choose Escalate.

**Expected result:** "This Task is created only after you save the record…"

**Actual result:** "This {{module}} is created only after you save the record…"

**Evidence:** No screenshot — follow the steps above.

**Environment:** staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026 (run 2); second admin (Desk Administrator).

---

## Notes
- MF-05 to MF-09, MF-20, MF-21, MF-37 and MF-40 share one cause: the record API does not validate values against the field settings. They can be fixed and retested together.
- MF-33 and MF-34 share one cause: layout rules (dependencies and conditional visibility) are stored, but neither the form nor the record API applies them.
- MF-01 and MF-11 both come from Desk reading CRM data (permissions and the user/profile directory).
- Not bugs: default values for fields (I19, I24) are not built yet — recorded as MISSING (missing list item 13).
- Removed after re-check (7 Oct 2026): the earlier MF-44 ("auto-fill offers only system fields") was a test-setup artefact — on the Tickets layout the picker lists all fields.
- QA items left in the Recycle Bin by the runs cannot be purged because of MF-46; they expire after 60 days.
