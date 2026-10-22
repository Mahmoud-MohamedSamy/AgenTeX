# Desk tickets — Ready For Test retest source (21 Oct 2026)

Pulled read-only from Plane project efce4d84-5876-4015-b472-2efca7ad73f3 on 2026-10-21.

## NDC-2220 — Modules and Fields | Profiles chosen in the Create Module dialog are not applied

- uuid: 982c0bb5-01f3-4514-a010-15bc162f30de

**Steps**
1. Setup → Modules and Fields → Create New Module.
2. Name "QA MF Closed", Module Permission: tick only Desk Administrator → Create.
3. Sign in as a Desk Agent.
4. Open the "+" create menu and the module page; create a record.

**Expected**
- The agent does not see the module and cannot read or create its records.
- If saving the permission fails, the dialog shows an error.

**Actual (old)**
- No error shown. Agent sees the module (sidebar and "+" menu), lists its records and creates a record. Access Control on the module still shows "All Users".
- `PUT /api/v1/modules/{module_id}/permissions` body `{"profileIds":["44444444-4444-4444-4444-444444444401"]}` → 404 `{"success":false,"error":{"code":"NOT_FOUND","message":"The requested resource was not found."}}`.
- As the agent afterwards: `GET /modules/{module_id}/records` → 200; `POST /modules/{module_id}/records` → 201.
- Severity Critical; spec row H10 (docs/desk-modules-fields/spec-desk-modules-fields.md), run 2; bug report MF-02.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026. Tenant owner creates the module; Desk Agent account mahmoud.mohamed1 (profile lowered for the test) checks access. Profile id Desk Administrator = 44444444-4444-4444-4444-444444444401.

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:07: "Retest on staging, 2026-10-21: FIXED. PUT /modules/{id}/permissions {"profileIds":[…]} → 200 (was 404); GET returns the profile, and the module ACL is access_mode "selected" with that profile."

## NDC-2218 — Tickets | Ticket Owner filter lists CRM users alongside Desk agents

- uuid: be0ec661-bc3f-4746-820c-a2e310f8dbe2

**Steps**
1. In Desk, open Tickets › All Tickets and click the Filter icon.
2. Expand Ticket Owner and scroll through the list of names.
3. Open Desk Settings › User Management › Agents and compare the two lists.

**Expected**
- The Ticket Owner filter lists only Desk agents, the 10 shown on the Agents page.
- Agents who exist in Desk are the only users that can be listed within the Desk application.

**Actual (old)**
- Filter also lists ZZ Sweep Tavi Delegate, ZZ Sweep Tavi Probe, test user 1 and test user 2 — all CRM-only users, none a Desk agent.
- "Test User 1" (Desk agent) and "test user 1" (CRM user) appear one under the other — easy to pick the wrong one.

**Environment**
- Anyware Desk staging — staging-desk.taviportal.com/views/all; compared against Desk Settings › Agents and CRM (staging-crm.taviportal.com) Settings › Users. Microsoft Edge, Windows. Reporter Moaz Adly, captured 12 Oct 2026. Attachment Tickets-owner-filter-lists-crm-users.png.

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:10: "Retest on staging, 2026-10-21: FIXED. Deployed Ticket Owner filter calls the users directory with app_key=desk (client-engine d9eba2236). GET /iam/users/directory?app_key=desk → 4 Desk users (vs 20 unscoped incl. CRM test users)."

## NDC-2221 — Modules and Fields | Records can be saved without the required Name field

- uuid: 3c192118-26b6-4a2d-8e79-1a13b31c8bd4

**Steps**
1. Use a custom module whose default layout has the required Name field.
2. Send `POST /api/v1/modules/{module_id}/records` body `{"data":[],"layout_id":"{default_layout_id}"}` (no "name" value).

**Expected**
- 400/422 — Name is required (as for other required fields, see I4).

**Actual (old)**
- 201 Created; record has no name (also 201 without layout_id).
- Severity High; spec row F9, run 1; bug report MF-03. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:04: "Retest on staging (API), 2026-10-21: FIXED. Create without Name (with or without layout_id) → 422 RECORD_VALIDATION_FAILED "Name is required."; PATCH name "" / null → 422."

## NDC-2223 — Modules and Fields | Record API ignores single-line max length

- uuid: e3eb50f0-1058-4fb7-8c03-2d9a749c2ea0

**Steps**
1. Create single-line field qa_sl10 with max_length 10 and place it on the default layout.
2. Send `POST /api/v1/modules/{module_id}/records` body `{"data":[{"field":"name","value":{"kind":"string","value":"QA MF len"}},{"field":"qa_sl10","value":{"kind":"string","value":"ABCDEFGHIJK"}}],"layout_id":"{default_layout_id}"}` (11 characters).

**Expected**
- 400/422 — value too long.

**Actual (old)**
- 201 Created; the 11-character value is stored.
- Severity High; spec row I14, run 1; bug report MF-05. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:04: "Retest on staging (API), 2026-10-21: FIXED. Single-line max 10: 11 chars → 422 TEXT_TOO_LONG on create and PATCH; 10 chars → 201."

## NDC-2224 — Modules and Fields | Record API ignores number min/max and accepts text in number fields

- uuid: 723d4065-92fd-4f56-9f26-5d08bac1ecdc

**Steps**
1. Create number field qa_num with min 0, max 100 on the default layout.
2. Send records with 101, -1, "abc" and "15,000": `POST /api/v1/modules/{module_id}/records` body `{"data":[{"field":"name","value":{"kind":"string","value":"QA MF num"}},{"field":"qa_num","value":{"kind":"number","value":101}}],"layout_id":"{default_layout_id}"}` (same with -1 and `{"kind":"string","value":"abc"}`).

**Expected**
- 101, -1 and "abc" refused.

**Actual (old)**
- All 201 Created. "abc" stored as a string in the number field; "15,000" becomes 15000.
- Also: currency symbol "EGP12" (UI max 4) is silently not stored.
- Severity High; spec row I16, run 1; bug report MF-06. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:04: "Retest on staging (API), 2026-10-21: FIXED. Number min 0 / max 100: 101 → 422, -1 → 422, text "abc" → 422 "Expected number value", "15,000" → 422; 50 → 201. PATCH refused too."

## NDC-2225 — Modules and Fields | Record API accepts invalid email, phone and javascript: URLs

- uuid: cb1959bb-561c-412f-b74b-dae832b15947

**Steps**
1. Create email, phone and URL fields (qa_email, qa_phone, qa_url) on the default layout.
2. Send `POST /api/v1/modules/{module_id}/records` body `{"data":[{"field":"name","value":{"kind":"string","value":"QA MF fmt"}},{"field":"qa_email","value":{"kind":"string","value":"not-an-email"}},{"field":"qa_phone","value":{"kind":"string","value":"call me"}},{"field":"qa_url","value":{"kind":"string","value":"javascript:alert(1)"}}],"layout_id":"{default_layout_id}"}`.

**Expected**
- 400/422 for each invalid value; javascript: URLs always refused.

**Actual (old)**
- 201 Created; all three values stored (javascript: URL = stored-XSS risk where URLs become links).
- Severity High; spec row I18, run 1; bug report MF-07. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:05: "Retest on staging (API), 2026-10-21: FIXED. "not-an-email" → 422 "Email value is invalid"; "call me" → 422 "Phone value is invalid"; "javascript:alert(1)" → 422 "URL value must be an absolute HTTP or HTTPS URL". Same on PATCH; valid values → 201."

## NDC-2226 — Modules and Fields | Record API accepts pick-list values that are not in the list

- uuid: 49ec0317-b98c-4524-9b61-04b6e52df892

**Steps**
1. Create pick list qa_pl with options Alpha, Beta, Gamma on the default layout.
2. Send `POST /api/v1/modules/{module_id}/records` body `{"data":[{"field":"name","value":{"kind":"string","value":"QA MF pl"}},{"field":"qa_pl","value":{"kind":"string","value":"Delta"}}],"layout_id":"{default_layout_id}"}`.

**Expected**
- 400/422 — not one of the options.

**Actual (old)**
- 201 Created; "Delta" stored.
- Severity High; spec row I20, run 1; bug report MF-08. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:05: "Retest on staging (API), 2026-10-21: FIXED. Pick list Alpha/Beta/Gamma: "Delta" → 422 PICKLIST_VALUE_INVALID on create and PATCH; "Beta" → 201."

## NDC-2227 — Modules and Fields | Field regex is saved but not enforced

- uuid: 2145cf59-76ec-42fd-b574-cbd0e22a4ebe

**Steps**
1. Builder → field qa_rx → Edit Properties → VALIDATION → Regex `^[A-Z]{2}[0-9]{4}$` → Apply → Save.
2. Send `POST /api/v1/modules/{module_id}/records` body `{"data":[{"field":"name","value":{"kind":"string","value":"QA MF rx"}},{"field":"qa_rx","value":{"kind":"string","value":"ab12"}}],"layout_id":"{default_layout_id}"}`.

**Expected**
- 400/422 — value does not match the pattern.

**Actual (old)**
- 201 Created; "ab12" stored. Layout stores `"regex":"^[A-Z]{2}[0-9]{4}$"`; the builder's tester works.
- Severity High; spec row I25, run 1; bug report MF-09. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:05: "Retest on staging (API), 2026-10-21: FIXED. Regex ^[A-Z]{2}[0-9]{4}$: "ab12" → 422 "does not match the required pattern" on create and PATCH; "AB1234" → 201."

## NDC-2228 — Modules and Fields | A required field can be set to "Don't Show"

- uuid: 059b40f8-9674-452e-b862-844837006312

**Steps**
1. Module → Fields → Field Permissions → profile Desk Agent.
2. Set Name (required) to "Don't Show" → Save. API: `POST /api/v1/modules/{module_id}/field-permissions` body `{"fieldId":"{name_field_id}","profileId":"44444444-4444-4444-4444-444444444402","permission":"hidden"}`.
3. As a Desk Agent, create a record (form or API): `POST /api/v1/modules/{module_id}/records` body `{"data":[{"field":"name","value":{"kind":"string","value":"QA MF agent rec"}}]}`.

**Expected**
- "Don't Show" disabled for required fields, or Save refused with a message.

**Actual (old)**
- Saved ("3 field permissions updated"); field-permissions → 200/201.
- Every agent create then fails with 422 "One or more fields in the payload are not writable for your profile."
- Severity High; spec row H4, run 2; bug report MF-10.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 6–7 Oct 2026; tenant owner; Desk Agent account mahmoud.mohamed1 (profile lowered for the test). Desk Agent profile id 44444444-4444-4444-4444-444444444402.

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED. Setting required field "name" to hidden for Desk Agent → 422 FIELD_REQUIRED_HIDDEN_CONFLICT; nothing saved."

## NDC-2229 — Modules and Fields | Access Control picker lists CRM users and profiles instead of Desk ones

- uuid: a3db0128-5927-422f-8c61-c88f7469a79c

**Steps**
1. Open a layout → Layout settings → Layout Permissions (or a module → Access Control).
2. Choose Selected Users → Select principals.
3. Switch the kind to Profiles; then search Users for a Desk agent.

**Expected**
- Desk profiles (Desk Administrator, Supervisor, Agent, Light Agent, Reviewer) and Desk agents.

**Actual (old)**
- Profiles: CRM Admin, Manager, Supervisor, test, User. Desk agent mahmoud.mohamed1@taviportal.com not found.
- Picker sends `GET /api/v1/iam/users?app_key=crm` (also `GET /iam/profiles`, `/iam/org-units`) → 200, CRM users only.
- Note: a limit set through the API with the Desk Agent profile id is enforced correctly (G10 passed).
- Severity High; spec rows G10, H9, run 2; bug report MF-11. Same root cause as NDC-2204, NDC-1915.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 6–7 Oct 2026; tenant owner.

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED. Deployed picker loads profiles / org units / users with the host app key (desk); no 'crm' call left. /iam/profiles?app_key=desk returns only Desk profiles (Administrator, Agent, Light Agent, Reviewer, Supervisor)."

## NDC-2234 — Modules and Fields | Radio and Status fields accept values that are not in their list

- uuid: 67d5c47a-eb92-44e6-93c9-311863a3bf9e

**Steps**
1. Create radio qa_rb (R1, R2) and status qa_st (New, Doing, Done) on the default layout.
2. Send `POST /api/v1/modules/{module_id}/records` body `{"data":[{"field":"name","value":{"kind":"string","value":"QA MF radio bad"}},{"field":"qa_rb","value":{"kind":"string","value":"R9"}},{"field":"qa_st","value":{"kind":"string","value":"Nope"}}],"layout_id":"{default_layout_id}"}`.
3. Open the module's record list.

**Expected**
- 400/422 — not one of the values.

**Actual (old)**
- 201 Created; "R9" and "Nope" stored; "Nope" shown as a status chip on the list. Same family as MF-08.
- Severity High; spec row I23, run 2; bug report MF-37.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 6–7 Oct 2026; tenant owner.

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:05: "Retest on staging (API), 2026-10-21: FIXED. Radio "R9" → 422 PICKLIST_VALUE_INVALID; Status "Nope" → 422 PICKLIST_VALUE_INVALID; both refused on PATCH too; valid values → 201."

## NDC-2236 — Modules and Fields | A module can be created with a blank name

- uuid: f15502f4-5498-4a27-b536-bac2b52a2485

**Steps**
1. Send `POST /api/v1/teamspaces/{teamspace_id}/modules` body `{"moduleKey":"qa_mf_blank","labels":{"en":"   "},"pluralForm":"   ","singularForm":"   ","storageScope":"organization"}`.
2. Repeat with a 120-character name.

**Expected**
- 400 — name required; max length enforced (Zoho UI limit 25).

**Actual (old)**
- 201 Created; module stored with "pluralForm": null. 120 characters accepted.
- Severity Medium; spec row C3, run 1; bug report MF-14. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED. Create module with blank name "   " → 400 MODULE_NAME_REQUIRED; 120-char name → 400 MODULE_NAME_TOO_LONG; valid → 201."

## NDC-2237 — Modules and Fields | Rename accepts an empty name or another module's name

- uuid: c0856958-edf5-4e98-8bdd-3aafba6227a3

**Steps**
1. Send `PUT /api/v1/modules/{module_id}` body `{"pluralForm":"","singularForm":"QA MF Device","description":null,"rowVersion":{n}}` (empty plural).
2. Send it again with pluralForm "Tickets".

**Expected**
- Both refused.

**Actual (old)**
- Both 200 OK; plural stored as null, then as "Tickets".
- Severity Medium; spec row D5, run 1; bug report MF-15. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED. Rename with empty name → 400 MODULE_NAME_REQUIRED; rename to "Tickets" (existing) → 409 MODULE_NAME_TAKEN."

## NDC-2239 — Modules and Fields | Layout builder → Rename Module crashes the page

- uuid: e16c375a-691f-47d2-8be6-b363aa15a85c

**Steps**
1. Open any layout in the builder (e.g. Tickets → Default).
2. Gear (Layout settings) → Rename Module.

**Expected**
- The rename dialog opens.

**Actual (old)**
- "Something went wrong — Cannot read properties of undefined (reading 'trim')". Reproduced on Tickets 2/2 and on a QA module.
- Severity Medium; spec row D9, run 1; bug report MF-17. Annotated TAVI-vs-Zoho image attached.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED (verified in deployed bundle). The Rename Module dialog now seeds plural/singular/api name from the module name and key when they are empty, so the undefined.trim() crash is gone (client-engine d9eba2236, present in deployed pages chunk). Please confirm in the UI."

## NDC-2240 — Modules and Fields | Set as default on a layout that holds records returns 500

- uuid: 310f758c-859e-4ec2-a757-e36b1aacbd35

**Steps**
1. On a QA module, create a second active layout and save 6 records with it.
2. Send `POST /api/v1/modules/{module_id}/layouts/{layout_id}/set-default`.

**Expected**
- 200; the layout becomes the default.

**Actual (old)**
- 500 "An unexpected error occurred" on 2 of 2 attempts — trace ids 0cb41259-d069-4ef0-8aff-80670c7c5c8e, 6bf735ec-b2c4-4f7c-88b6-5a4dd621adbe. Same call on a layout without records → 200.
- Severity Medium; spec row G6, run 1; bug report MF-18. Related NDC-1588. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED. Layout holding 6 records → POST …/set-default → 200 isDefault:true; switching back and forth again → 200. No 500."

## NDC-2242 — Modules and Fields | Record API accepts invalid dates

- uuid: c8eef918-a201-4e80-8061-a38868320430

**Steps**
1. Create date qa_date and date-time qa_dt on the default layout.
2. Send records with "not a date", "2026-02-29" and "yesterday": `POST /api/v1/modules/{module_id}/records` body `{"data":[{"field":"name","value":{"kind":"string","value":"QA MF date"}},{"field":"qa_date","value":{"kind":"string","value":"2026-02-29"}},{"field":"qa_dt","value":{"kind":"string","value":"yesterday"}}],"layout_id":"{default_layout_id}"}`.

**Expected**
- 400/422.

**Actual (old)**
- 201 Created; all stored as plain strings.
- Severity Medium; spec row I17, run 1; bug report MF-20. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:05: "Retest on staging (API), 2026-10-21: FIXED. Date "not a date" / "2026-02-29" / "yesterday" → 422 DATE_INVALID; date-time equivalents → 422 DATETIME_INVALID; PATCH refused too; valid values → 201."

## NDC-2243 — Modules and Fields | Record API ignores multi-select max items

- uuid: 331505f8-fd4c-41ed-9ae1-84e357a30095

**Steps**
1. Create multi-select qa_ms (A, B, C) with max_items 2 on the default layout.
2. Send `POST /api/v1/modules/{module_id}/records` body `{"data":[{"field":"name","value":{"kind":"string","value":"QA MF ms"}},{"field":"qa_ms","value":{"kind":"array","items":[{"kind":"string","value":"A"},{"kind":"string","value":"B"},{"kind":"string","value":"C"}]}}],"layout_id":"{default_layout_id}"}`.

**Expected**
- 400/422.

**Actual (old)**
- 201 Created; 3 values stored.
- Severity Medium; spec row I22, run 1; bug report MF-21. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:05: "Retest on staging (API), 2026-10-21: FIXED. Multi-select max_items 2: [A,B,C] → 422 "more than 2 selected items" on create and PATCH; [A,B] → 201."

## NDC-2244 — Modules and Fields | A new lookup to Contacts is not registered as a related module

- uuid: cf23b24f-db5b-4a1b-ad7f-150a72a5f95d

**Steps**
1. Add lookup qa_lk from QA MF Devices to Contacts (related-list title "QA MF Devices").
2. Send `GET /api/v1/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/related-modules` (Contacts module id).

**Expected**
- QA MF Devices is listed.

**Actual (old)**
- 200 — QA MF Devices missing from the list (Tickets, Calls, Events … are listed).
- Severity Medium; spec row E2E-1, run 1; bug report MF-22. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator). Contacts module id 43004ce2-577f-4eda-b00a-0750fe40c3d4.

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED. New lookup from a QA module to Desk Contacts → GET /modules/{contacts}/related-modules lists the QA module with its lookup fields."

## NDC-2245 — Modules and Fields | Deleted dependency rules come back after Save

- uuid: 5f233b5b-8cde-4ec5-8f45-4a52430a0075

**Steps**
1. Layout with 2 Field Dependency rules → Layout settings → Field Dependency.
2. Delete both rules ("No dependency rules yet" appears) → Save Rules → Save.
3. Read the layout: `GET /api/v1/modules/{module_id}/layouts/{layout_id}`.

**Expected**
- No rules stored.

**Actual (old)**
- 200 — "dependencies" still has 2 rules.
- Severity Medium; spec row I48, run 2; bug report MF-38. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 6–7 Oct 2026; second admin (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED. PUT layout {"dependencies":[]} → 200 and a fresh GET shows dependencies []. The deployed builder save now always sends the dependencies list (client-engine 967e694bf)."

## NDC-2246 — Modules and Fields | Custom data types are listed but cannot be used to create a field (API)

- uuid: da48cfe4-52d7-4307-9ad4-b53e8ac47451

**Steps**
1. Create a custom data type: `POST /api/v1/custom-datatypes` body `{"key":"qa_mf_dt2","label":"QA MF dt2","base_datatype_key":"single_line","icon":"type"}`.
2. Check `GET /api/v1/fields/datatypes` — qa_mf_dt2 is listed.
3. Create a field with it: `POST /api/v1/modules/{module_id}/fields` body `{"fields":[{"fieldName":"qa_cdt2","labels":{"en":"QA MF cdt2"},"datatypeKey":"qa_mf_dt2","required":false,"unique":false,"uniquePeerModuleIds":[]}]}`.

**Expected**
- Field created with the custom type.

**Actual (old)**
- 1) 201. 2) 400 `{"code":"DATATYPE_KEY_UNKNOWN","message":"Field 'qa_cdt2': Datatype key 'qa_mf_dt2' is not a recognized datatype. Call GET /api/v1/fields/datatypes …"}`.
- Also blocks spec row J4 (delete a type in use).
- Severity Medium; spec row J4, run 2; bug report MF-39. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 6–7 Oct 2026; second admin (Desk Administrator).

**Comments**
- None.

## NDC-2249 — Modules and Fields | Arabic UI leaves "Create New Layout" and the layouts description in English

- uuid: 09342bb6-1402-4317-ada4-efd876ce0615

**Steps**
1. Switch the UI to العربية.
2. Setup → Modules and Fields → open a module → Layouts.

**Expected**
- All text in Arabic.

**Actual (old)**
- "Create New Layout" and "Design your own layouts to fit your business processes…" stay in English.
- Severity Low; spec row L7, run 1; bug report MF-23. Annotated TAVI-vs-Zoho image attached.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- None.

## NDC-2250 — Modules and Fields | Module list shows "UN" as last modifier of every seeded module

- uuid: b32c95c3-9569-4976-abd9-df8611470a39

**Steps**
1. Setup → Modules and Fields → look at Last Modified. API: `GET /api/v1/modules`.

**Expected**
- A real name (or "System").

**Actual (old)**
- "UN" on all 9 seeded modules; `GET /api/v1/modules` → 200 with "lastModifiedByName": "" on all 9 seeded modules (created by system user a7a7a7a7-…0004).
- Severity Low; spec row B2, run 1; bug report MF-24. Annotated image attached.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED. GET /modules → seeded Desk modules now have lastModifiedByName "System"; the list renders "System" instead of "UN" for an empty name."

## NDC-2252 — Modules and Fields | Setup sidebar says "Set up your CRM"

- uuid: e3793154-15f4-48de-a805-1a25208891f7

**Steps**
1. Open Setup in Desk.

**Expected**
- Desk wording.

**Actual (old)**
- Sidebar button "Set up your CRM".
- Severity Low; spec row B10, run 1; bug report MF-26. Annotated image attached.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- None.

## NDC-2253 — Modules and Fields | Two modules can share the same display name

- uuid: 36213223-fac3-45ac-9ab4-f0055440521b

**Steps**
1. Create "QA MF Devices".
2. Create another module named "QA MF Devices" with a different key: `POST /api/v1/teamspaces/{teamspace_id}/modules` body `{"moduleKey":"qa_mf_devices2","labels":{"en":"QA MF Devices"},"pluralForm":"QA MF Devices","singularForm":"QA MF Device","storageScope":"organization"}`.

**Expected**
- Refused — name already used.

**Actual (old)**
- 201 Created. Only an identical moduleKey gives 409 "Module key already exists".
- Severity Low; spec row C6, run 1; bug report MF-27. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- None.

## NDC-2254 — Modules and Fields | Layout builder does not warn about a duplicate layout name

- uuid: e8b14280-bf43-4f2b-ac47-b1fbb86deedd

**Steps**
1. Builder → rename a layout to "Default" (already used).
2. Save. API: `PUT /api/v1/modules/{module_id}/layouts/{layout_id}` body `{…,"name":"Default"}`.

**Expected**
- Inline warning "A layout with this name already exists".

**Actual (old)**
- No warning while typing; on Save the server refuses: 409 "A layout named 'Default' already exists on this module. Choose a different name".
- Severity Low; spec row G4, run 1; bug report MF-28.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- None.

## NDC-2255 — Modules and Fields | Field label length (50) not enforced by the API

- uuid: e7dc0c23-3a90-47b4-9723-e00a603c1495

**Steps**
1. Send `POST /api/v1/modules/{module_id}/fields` body `{"fields":[{"fieldName":"qa_long","labels":{"en":"{51 characters}"},"datatypeKey":"single_line","required":false,"unique":false,"uniquePeerModuleIds":[]}]}` with a 51-character label.

**Expected**
- 400 — label too long.

**Actual (old)**
- 201 Created. (50-char limit only checked in the builder.)
- Severity Low; spec row I11, run 1; bug report MF-29. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- None.

## NDC-2256 — Modules and Fields | Two lookups to the same module can use the same related-list title

- uuid: c9fc5bc6-9507-4eb0-b66c-af1b8f0c9843

**Steps**
1. Create a lookup to Contacts with related-list title "QA MF Devices".
2. Create a second lookup to Contacts with the same title: `POST /api/v1/modules/{module_id}/fields` body `{"fields":[{"fieldName":"qa_lk2","labels":{"en":"QA MF lk2"},"datatypeKey":"lookup","datatypeOptions":{"target_module_id":"43004ce2-577f-4eda-b00a-0750fe40c3d4","display_field":"first_name","related_module":"QA MF Devices"}}]}`.

**Expected**
- Second one refused.

**Actual (old)**
- 201 Created.
- Severity Low; spec row I32, run 1; bug report MF-30. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator). Contacts module id 43004ce2-577f-4eda-b00a-0750fe40c3d4.

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED. Two lookups to Contacts with the same related_list_title → first 201, second 409 RELATED_LIST_TITLE_NOT_UNIQUE. Note: the title key is related_list_title (what the builder sends); the payload in this report put it under related_module, which is a different property."

## NDC-2257 — Modules and Fields | A multi-module lookup can be saved with no modules

- uuid: fea6ae62-df6c-4637-9eb9-253db289ba63

**Steps**
1. Send `POST /api/v1/modules/{module_id}/fields` body `{"fields":[{"fieldName":"qa_mlk","labels":{"en":"QA MF mlk"},"datatypeKey":"lookup","datatypeOptions":{"target_modules":[]}}]}`.

**Expected**
- 400 (the UI says "Select at least one module").

**Actual (old)**
- 201 Created.
- Severity Low; spec row I33, run 1; bug report MF-31. API only.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:08: "Retest on staging, 2026-10-21: FIXED. Multi-module lookup with target_modules [] → 400 LOOKUP_TARGET_MODULES_REQUIRED; the deployed builder also blocks the save with a toast."

## NDC-2258 — Modules and Fields | Two layout-builder buttons have no accessible name

- uuid: fbf8ef83-c3b1-4d9b-8f55-4bb375bcfb92

**Steps**
1. Open the layout builder.
2. Inspect the Module Image switch and the icon-only button next to it.

**Expected**
- Both have an aria-label.

**Actual (old)**
- The switch (role=switch) and the svg-only button have no accessible name.
- Severity Low; spec row L9, run 1; bug report MF-32. No screenshot (found via accessibility tree).

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:09: "Retest on staging, 2026-10-21: FIXED (verified in deployed bundle). Module Image switch has aria-label "Show the {module} image on the record"; field menu, chevron and gear buttons have titles from the deployed crm-layout-builder locale (client-engine d9eba2236). Please confirm with an accessibility check."

## NDC-2259 — Modules and Fields | The 512-fields-per-layout limit is not enforced by the API

- uuid: bc52c392-44a7-427f-a861-e27d7bad5b89

**Steps**
1. Create 550 custom fields on a QA module: `POST /api/v1/modules/{module_id}/fields` (11 × 50 fields).
2. Send `PUT /api/v1/modules/{module_id}/layouts/{layout_id}` with all 550 fields in the sections.
3. Open the builder and click a palette item.

**Expected**
- API refuses more than 512 fields per layout.

**Actual (old)**
- Fields 201 ×11; layout PUT 200 OK with 550 fields; the builder then shows "Maximum of 512 fields per layout reached."
- Severity Low; spec row I3, run 2; bug report MF-41. Annotated image attached.

**Environment**
- staging-desk.taviportal.com (tenant NDC-Staging), headless Chromium, 6–7 Oct 2026; tenant owner.

**Comments**
- None.
