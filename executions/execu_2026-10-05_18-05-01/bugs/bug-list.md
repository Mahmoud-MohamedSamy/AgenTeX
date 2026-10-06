# Bug list — Desk Modules, Tabs and Fields (run execu_2026-10-05_18-05-01)

Target: staging-desk.taviportal.com (NDC-Staging), admin "Mahmoud TAVI" (second admin), headless Chromium, 5–6 Oct 2026. 29 failed rows. Gaps against Zoho are **not** bugs — they are the MISSING rows in report.md (retest when built).

Evidence rule (user, 4 Oct 2026): screenshots only for failed rows, annotated against Zoho where a screen exists; API-only failures carry the request/response in the note.

## 1. Records can be saved without the required record-name field — High

- **Scenario:** F9
- **Expected vs actual:** The required record-name field is not enforced: POST /modules/{id}/records with no name → 201, both with the field off-layout and with layout_id = the default layout (Name on it). The required custom field on the same layout IS enforced (I4).
- **Evidence:** API request/response in the note (no screen)

## 2. A saved field's data type can be changed — High

- **Scenario:** I13
- **Expected vs actual:** A saved field's data type can be changed: PUT /modules/{id}/fields/{fieldId} with datatypeKey single_line → number returns 200 and the field becomes number (Zoho: "the field type cannot be changed"). Existing values are not converted.
- **Evidence:** API request/response in the note (no screen)

## 3. Record API ignores single-line max length — High

- **Scenario:** I14
- **Expected vs actual:** Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: single line with max_length 10 saves an 11-character value (201). Option bound OK: max_length 20001 → 400 DATATYPE_OPTION_TOO_LARGE.
- **Evidence:** API request/response in the note (no screen)

## 4. Record API ignores number min/max and accepts text in number fields — High

- **Scenario:** I16
- **Expected vs actual:** Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: number field with min 0 / max 100 saves 101 and -1; "abc" is stored as a string in a number field; "15,000" stored as 15000. Currency symbol "EGP12" (UI max 4) is not stored at all via the field API.
- **Evidence:** API request/response in the note (no screen)

## 5. Record API accepts invalid email, phone and javascript: URLs — High

- **Scenario:** I18
- **Expected vs actual:** Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: email "not-an-email", phone "call me" and URL "javascript:alert(1)" are saved (201). The javascript: URL is a stored-XSS risk wherever the URL is rendered as a link.
- **Evidence:** API request/response in the note (no screen)

## 6. Record API accepts pick-list values that are not in the list — High

- **Scenario:** I20
- **Expected vs actual:** Duplicate options refused (400 DATATYPE_OPTION_DUPLICATE); Arabic and html option text kept. Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: pick-list value "Delta" that is not in the list is saved (201).
- **Evidence:** API request/response in the note (no screen)

## 7. Field regex is saved but not enforced on save — High

- **Scenario:** I25
- **Expected vs actual:** Builder: regex box, "Invalid regular expression" for "([" and the tester (✓ matches / ✗ does not match) work, and the regex is saved into the layout ("regex":"^[A-Z]{2}[0-9]{4}$"). Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: "ab12" is saved (201) — the regex is not enforced on the server.
- **Evidence:** API request/response in the note (no screen)

## 8. A CRM Admin profile gives module/field administration inside Desk (cross-app permission leak) — High

- **Scenario:** SEC-1
- **Expected vs actual:** Cross-app permission leak: a user with Desk Agent + CRM Admin gets CRM Admin metadata permissions in Desk. GET /iam/me/permissions (x-app-key desk) returns metadata.modules.manage, metadata.fields.manage_permissions, metadata.capabilities.manage, metadata.views.manage, metadata.integrations.manage, metadata.records.convert … while the Desk Agent profile itself has only metadata.records.access and metadata.records.manage (GET /iam/profiles/{id}/effective). Result: the agent can open and use Setup → Modules and Fields in Desk. Confirm whether metadata permissions are meant to be platform-wide.
- **Evidence:** `browser-sessions/mfadmin-180501-9c45/screenshots/A2-agent-modules-and-fields.png`

## 9. A disabled module still accepts records (NDC-1864) — Medium

- **Scenario:** B5
- **Expected vs actual:** Disabled QA module: status=disabled and it leaves the top bar, but POST /modules/{id}/records still creates a record (201, deleted again) and /modules/{id} still opens and works. Same as NDC-1864 (open). Switched back on: status=active.
- **Evidence:** API request/response in the note (no screen)
- **Existing ticket:** NDC-1864 (do not refile)

## 10. Standard modules offer Delete, and five row-menu items do nothing — Medium

- **Scenario:** B8
- **Expected vs actual:** Row menu on standard modules (Tickets, Calls): Layouts | Rename | Button | Links | Access Control | Workflow Rules | Assignment Rules | Map Dependency Fields | Set Validation Rules | Delete. (1) Set Validation Rules, Map Dependency Fields, Button, Links and Assignment Rules only add ?tab=… to the URL and the page stays on Layouts, because Desk hides those tabs — dead menu items. (2) Delete is offered on standard modules and opens a real 'Delete "Tickets"? … Delete module' confirmation; only the has-records rule stops it (Zoho never allows deleting a standard module). Cancelled with Escape; Tickets still active, rowVersion 1. 'Lead Conversion Mapping' correctly not shown.
- **Evidence:** `bugs/screenshots/annotated/B8-vs-zoho.png`, `browser-sessions/mfadmin-180501-9c45/screenshots/B8-Delete.png`

## 11. A module can be created with a blank (whitespace) name — Medium

- **Scenario:** C3
- **Expected vs actual:** POST module names: whitespace-only "   " → 201 and the module is stored with pluralForm null (a nameless module); one character, 25, 26 and 120 characters all accepted (no length limit; Zoho UI limit is 25); leading/trailing spaces trimmed; Arabic, emoji and zero-width kept; <img onerror> stored as text and NOT rendered as HTML in the list, no alert. Each module deleted again.
- **Evidence:** API request/response in the note (no screen)

## 12. Rename accepts an empty name or another module's name — Medium

- **Scenario:** D5
- **Expected vs actual:** PUT /modules/{id} rename: empty plural → 200 and plural stored as null; plural "Tickets" (another module's name) → 200 stored; 26 chars, Arabic and <img onerror> accepted (shown as text). Name restored to QA MF Devices.
- **Evidence:** API request/response in the note (no screen)

## 13. Module save has no lost-update protection (stale rowVersion accepted) — Medium

- **Scenario:** D7
- **Expected vs actual:** No lost-update protection on module PUT: two saves with the same rowVersion both return 200 and the second (stale) one silently overwrites the first (description became "tab two (stale)"). Expected 409 for the stale write.
- **Evidence:** API request/response in the note (no screen)

## 14. Layout builder → Rename Module crashes the page — Medium

- **Scenario:** D9
- **Expected vs actual:** Layout builder → gear (Layout settings) → Rename Module crashes the page "Cannot read properties of undefined (reading 'trim')" — reproduced on Tickets (2/2) and on the QA module.
- **Evidence:** `bugs/screenshots/annotated/D9-vs-zoho.png`, `browser-sessions/mfadmin-180501-9c45/screenshots/D9-rename-module-builder.png`

## 15. Set as default on a layout that holds records returns 500 — Medium

- **Scenario:** G6
- **Expected vs actual:** POST /modules/{id}/layouts/{layoutId}/set-default on an active, non-default layout that holds 6 records → 500 "An unexpected error occurred" on 2 of 2 attempts (trace ids 0cb41259-d069-4ef0-8aff-80670c7c5c8e, 6bf735ec-b2c4-4f7c-88b6-5a4dd621adbe); the same call on a layout without records returned 200. Switching a layout with records off correctly opens "Move records before this layout is disabled".
- **Evidence:** API request/response in the note (no screen)

## 16. Layout save has no lost-update protection; rowVersion never increases — Medium

- **Scenario:** G26
- **Expected vs actual:** No lost-update protection on layouts: two PUT /modules/{id}/layouts/{layoutId} with the same rowVersion both return 200 and the second (stale) one overwrites the first; rowVersion never increases on save.
- **Evidence:** API request/response in the note (no screen)

## 17. Record API accepts invalid dates — Medium

- **Scenario:** I17
- **Expected vs actual:** Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: date "not a date", 2026-02-29 (not a leap year) and date-time "yesterday" are all saved as plain strings.
- **Evidence:** API request/response in the note (no screen)

## 18. Record API ignores multi-select max items — Medium

- **Scenario:** I22
- **Expected vs actual:** Record API (POST /modules/{id}/records with layout_id = default layout, field placed on that layout) accepts the bad value: multi-select with max_items 2 saves 3 values.
- **Evidence:** API request/response in the note (no screen)

## 19. A new lookup to Contacts is not registered as a related module of Contacts — Medium

- **Scenario:** E2E-1
- **Expected vs actual:** A lookup from QA MF Devices to Contacts (qa_lk, related-list title "QA MF Devices") is created, but GET /modules/{Contacts}/related-modules does not list QA MF Devices (Tickets, Calls, Events… are listed), so the related list would not appear on contacts. Created through the same field API the builder uses; linking a real contact was not done (no contact records; Contacts sync with CRM).
- **Evidence:** API request/response in the note (no screen)

## 20. Module list shows "UN" as last modifier of every seeded module — Low

- **Scenario:** B2
- **Expected vs actual:** Last Modified avatar shows "UN" on 9 rows; API lastModifiedByName set on 0/9 modules (seeded by system user a7a7a7a7-…0004)
- **Evidence:** `bugs/screenshots/annotated/B2-vs-zoho.png`, `browser-sessions/mfadmin-180501-9c45/screenshots/B2-last-modified-UN.png`

## 21. Desk Web Tabs placeholder says "inside the CRM" — Low

- **Scenario:** B7
- **Expected vs actual:** "In Development" badge on both: true; Web Tabs text says "inside the CRM": true
- **Evidence:** `bugs/screenshots/annotated/B7-vs-zoho.png`, `browser-sessions/mfadmin-180501-9c45/screenshots/B7-web-tabs-says-CRM.png`

## 22. Desk Setup sidebar says "Set up your CRM" — Low

- **Scenario:** B10
- **Expected vs actual:** Setup sidebar shows "Set up your CRM" in Desk: true
- **Evidence:** `bugs/screenshots/annotated/B10-vs-zoho.png`, `browser-sessions/mfadmin-180501-9c45/screenshots/B10-setup-your-crm.png`

## 23. Two modules can share the same display name — Low

- **Scenario:** C6
- **Expected vs actual:** Two modules can have the same display name: "QA MF Devices" created a second time (new key) → 201; only an identical moduleKey is refused (409 "Module key already exists"), e.g. "Tickets" → key tickets → 409. Each created module deleted again.
- **Evidence:** API request/response in the note (no screen)

## 24. Layout builder does not warn about a duplicate layout name before saving — Low

- **Scenario:** G4
- **Expected vs actual:** Layout name in the builder: empty → "Name is required" and the box keeps only 40 characters (OK); typing the name of another existing layout ("Default") gives no "A layout with this name already exists" warning in the builder. The server does refuse it on save: PUT → 409 "A layout named … already exists" (G4b).
- **Evidence:** API request/response in the note (no screen)

## 25. Field label length (50) not enforced by the API — Low

- **Scenario:** I11
- **Expected vs actual:** Field label limit is client-side only: POST field with a 51-character label → 201 (UI limit 50). EN/AR/FR labels stored correctly; <img onerror> label stored as text.
- **Evidence:** API request/response in the note (no screen)

## 26. Two lookups to the same module can use the same related-list title — Low

- **Scenario:** I32
- **Expected vs actual:** Lookup to Contacts → 201, but a second lookup to Contacts with the same related-list title "QA MF Devices" is also accepted (201) — the title is supposed to be unique among lookups pointing at the same module.
- **Evidence:** API request/response in the note (no screen)

## 27. A multi-module lookup can be saved with no modules — Low

- **Scenario:** I33
- **Expected vs actual:** Multi-module lookup with target_modules [] is accepted (201); the UI says "Select at least one module".
- **Evidence:** API request/response in the note (no screen)

## 28. Arabic UI leaves "Create New Layout" and the layouts description in English — Low

- **Scenario:** L7
- **Expected vs actual:** Arabic UI switches to RTL and most labels are translated, but on Setup → Modules and Fields → module page "Create New Layout" and "Design your own layouts to fit your business processes…" stay in English (hard-coded strings). Language set back to English afterwards (verified ltr after reload).
- **Evidence:** `bugs/screenshots/annotated/L7-vs-zoho.png`, `browser-sessions/mfadmin-180501-9c45/screenshots/L7-arabic-module-page.png`

## 29. Two layout-builder buttons have no accessible name — Low

- **Scenario:** L9
- **Expected vs actual:** Layout builder has 2 visible buttons with no accessible name: the Module Image on/off switch (role=switch, no aria-label) and an icon-only button (svg only). Other controls are named (Field options, Section settings, Layout settings, Back to module, Move X up).
- **Evidence:** API request/response in the note (no screen)

