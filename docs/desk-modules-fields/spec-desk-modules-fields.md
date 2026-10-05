# Spec — Desk Modules, Tabs and Fields (Customization)

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging) |
| Feature | Setup → Customization → **Modules and Fields** (module list, module detail, Layout Builder, Fields, Field Permissions), **Data Types**, **Capabilities**, **Organize Tabs**, and the top tab bar |
| Scope | Standard modules Tickets, Contacts, Accounts, Products, Calls, Events, Tasks, Contracts; custom modules; tabs; layouts; fields. **Time Entry is out of scope for now** (user, 5 Oct 2026) |
| Feature tickets | NDC-1249 "Modules and Fields" (test-case holder), NDC-1489 "Modules and Fields Rules" (layout/validation rules, record locking, dependency, links, buttons — plan item, Not Started) |
| Gap ticket already in Plane | NDC-1879 "Customization (modules, fields, layouts): features Zoho Desk has that Desk is missing" — 6 items (Z1–Z6 here). The new gaps in this spec (Z8 onward) are **not filed** — user asked for no Plane changes |
| Missing list | `docs/desk-modules-fields/desk-modules-fields-missing-list.md` |
| Gap evidence | `docs/desk-modules-fields/evidence/NN-<item>-vs-zoho.png` — one annotated TAVI-vs-Zoho image per missing-list item (Z8–Z19), originals in `evidence/originals/` |
| Reference notes | `docs/desk-modules-fields/reference/` — `zoho-desk-live-inventory.md` (live Zoho, every module's fields), `zoho-docs-inventory.md` (help/API/edition facts with sources), `tavi-fields-summary.txt` (TAVI fields per module) |
| Reference product | Zoho Desk — help articles [Creating custom modules](https://help.zoho.com/portal/en/kb/desk/customization/modules/articles/creating-custom-modules), [Standard modules and fields](https://help.zoho.com/portal/en/kb/desk/customization/modules/articles/standard-modules-and-fields-zoho-desk), [Customizing standard modules](https://help.zoho.com/portal/en/kb/desk/customization/modules/articles/customizing-standard-modules-zoho-desk) and the linked layout, field, lookup and API pages; plus the live Zoho Desk org (read-only, 5 Oct 2026) |
| Written | 5 Oct 2026, from bundle `index-Cegqr3UG.js` (module builder chunk `pages-DnrcKUiO.js`, locales `crm-modules`, `crm-layout-builder`, `desk`), live read-only API and UI (owner and second admin account) |
| Status | **Draft for review** |

---

## Feature inventory

### Built in Desk (found 5 Oct 2026)
**Module list** (`/settings/modules-and-fields`)
- Table: Displayed In Tabs As · Module Name · Last Modified · Status (toggle), search, paging 10/25/50/100, reorder ("Module order saved") — B1–B6
- Tabs **Modules**, **Web Tabs** and **Global Sets** — the last two are "In Development" placeholders — B7
- Buttons **Custom Module**, **Team Module**, **Create New Module** — C1–C14
- Row menu: Layouts, Rename, Fields, Button, Links, Access Control, Workflow Rules, Assignment Rules, Map Dependency Fields, Set Validation Rules, Link/Unlink Teamspace, Delete (which items show depends on module type) — B8
- 9 modules seeded: Tickets, Contacts, Accounts, Products, Calls, Events, Tasks, Contracts, Time Entries. No custom module exists on the tenant today

**Create / rename / delete a module**
- Create: plural name, singular name, description, **Module Data Storage** Organization / Department (cannot change later), **Module Permission** by profile (Desk Administrator, Desk Supervisor, Desk Agent, Desk Light Agent, Desk Reviewer) — C1–C10
- Rename: singular, plural, API name (with warning "Changing the API name may break existing integrations…"), icon, description — D1–D8
- Delete: only when the module has no records ("…still has records. Delete its records first…") — C12, C13
- Enable / disable a module; "This module has dependencies and cannot be disabled." — B5, B6
- Record visibility per module: Public Read/Write/Delete · Public Read Only · Private — H6–H8

**Module detail** (`/settings/modules-and-fields/{moduleId}`)
- Desk shows only the tabs **Layouts**, **Fields**, **Workflow Rules**, **Summary**. The client also has Layout Rules, Validation Rules, Record Locking, Map Dependency Fields, Links, Buttons, Module Permission, Tags and Lead Conversion Mapping tabs, but Desk does not show them — E1
- Summary: singular, plural, module key, API name, status, storage, description, created/modified by and at, **Access Control** (All Users / Selected Users) — E2, H9
- Fields: **Field Listing** (Fields, Data Type, Custom Field, Layouts; layout filter All Layouts / one layout / Not on any layout) and **Field Permissions** (Read and Write / Read Only / Don't Show per profile; system fields locked to Read Only) — F1–F6, H1–H5

**Layouts and Layout Builder** (`…/{moduleId}/layouts/{layoutId}`)
- One "Standard" layout per module, marked **Default**; Create New Layout, Clone Layout, Set as default, enable/disable, delete with **Move records to** another layout; default layout cannot be disabled or deleted; layout name ≤ 40 chars and unique — G1–G12
- Three views: **CREATE**, **QUICK CREATE** (one section only), **DETAIL VIEW**; Preview as Create / Quick Create / Detail View — G13–G15
- Sections: add, rename (English / Arabic), 1 or 2 columns, tab order Left to Right / Top to Bottom, move up/down, delete (fields go to Unused Fields; blocked while the section holds a required field) — G16–G21
- New Fields palette (33 types incl. Address, Auto Number, Camera, File Upload, Formula, Image Upload, Location, Long Integer, Lookup, Map, Multi-Select Lookup, Radio Button, Rich Text, Rollup Summary, Status, Subform, User), Unused Fields, "Custom Fields Left: N" (limit 512 per layout in the client) — I1–I3
- Field menu: Mark/Unmark Required, Mark/Remove Unique, Set Permission, Full/Half width, Edit Properties, Create Layout Rule, Create Validation Rule, Capabilities, Remove from Layout — I4–I10
- Field Properties: GENERAL (label EN/AR/FR ≤ 50, API name — fixed after save, description), VALIDATION (Required, Unique incl. across other modules, Regex with tester, Conditional visibility, Required while visible), PERMISSIONS (Read-only, per-profile Read/Edit — saves immediately), ADVANCED (picklist options with replace-on-remove, currency symbol, auto-fill, auto-number, lookup, formula, subform, rollup, quick-create triggers, subscription trigger) — I11–I40
- Remove field: **Move to Unused Fields** or **Delete Permanently**, with a usage check (Workflow rules, Saved actions, Approval processes, Review processes, Telephony) — I41–I46
- Field Dependency (Show / Hide / Require / Make Optional when a field equals any of values) — I47–I50
- Layout Permission (profiles), Rename Module from the builder, module image on/off, integration-contract warning, unsaved-changes dialogs, Reset, Undo/Redo and keyboard shortcuts, Help drawer — G22–G30

**Data Types and Capabilities** (`/settings/data-types`, `/settings/capabilities`)
- Data type catalogue (35 incl. one custom "TestDataType"), add custom data type on a base type, capability flags per data type — J1–J8

**Organize Tabs and the tab bar** (`/settings/organize-tabs`)
- Selected / Unselected modules, drag or Move up/down, Hide/Show, "Always shown" lock, Reset to default, **"Changes apply to you only"** — K1–K10
- Top bar: Tickets, Knowledge Base, Customers, Analytics, Activities, Chat, Community, Social, Contracts, "More modules" with search — K11–K14

### Missing in Desk (Group Z)
- Already in NDC-1879: layout rules (Z1), validation rules (Z2), picklist values per layout (Z3), Help Center access per field (Z4), nested and colour-coded picklists (Z5), field encryption / ePHI (Z6). Ticket number format is NDC-1866 item 16 (Z7)
- New (not filed): see Group Z, Z8 onward, and the missing list

### Not a gap
- Deleting or disabling a custom module (Zoho cannot do either) — Desk extra
- More than one layout on a custom module, auto-number, user field, rich text, subform, rollup, unique across modules — Desk extras
- Import/export of custom module records (Zoho: unsupported) — not required
- Admin default list columns (removed from NDC-1784 as not a gap)

### Not yet confirmed
- Whether renaming a standard module changes the tab bar, breadcrumbs, record pages and Organize Tabs (tab labels come from the `desk` locale — D3)
- Whether a new custom module appears in the tab bar / More modules (no custom module exists; creating one is a test step — C11)
- Whether a field's data type can be changed after save (I12)
- Department accessibility of a custom module: Zoho docs say it can be chosen, but the live New Module form shows "Accessible To" locked to All Departments — not listed as a gap
- "Add to Other Layouts" and "Preview layouts based on profiles" are in Zoho docs but were not seen live (one layout per department in the reference org) — not listed as gaps
- Department-storage modules: the tenant returns **0 departments** for the owner (`GET /desk/departments` → `[]`, HQ shows "Showing all 0 departments") — §1.4

---

## 0 How to run

1. **Order:** §1 preconditions → A → B → K → E → F → H → J (read) → C → D → G → I → J (write) → L → E2E → Z. Take the baseline (§1.3) before A and diff it after the last group.
2. **Serial only:** C, D, G, I, J-write, K-write and every `[serial]` row. Module, layout, field and tab metadata is **tenant-wide** — never run two writers at once, and never edit the seeded standard modules' fields except where a row says so (then restore in the same row).
3. **Parallel allowed:** A, B, E, F, H-read, J-read, L-ui and all API GET rows.
4. **Exclusive:** `[perf]` rows run alone, with nothing else signed in to the account.
5. **`[data]` rows** record: field/type, input (exact bytes for odd input), what the UI showed, what the API stored (GET after save), and pass/fail per row.
6. **Sessions:** the access token is short-lived and rotates; a second sign-in of the same account can revoke the first (seen 5 Oct 2026: `SESSION_REVOKED` / `login?reason=revoked`). One script = one sign-in; sign out at the end; use the second admin account for long UI runs. Report token **lengths** only.
7. **Verdicts:** Pass / Fail / Blocked / Inconclusive. A row blocked by §1.4 is **Inconclusive, not Fail**.

---

## 1 Preconditions

### 1.1 Accounts
| Role | Account (from `docs/Credentials/TAVI DESK Credentials.txt`) | Status |
|---|---|---|
| Tenant owner (admin) | `ndc-staging-owner@taviportal.com` | Works; has `metadata.modules.manage`, `metadata.fields.manage_permissions`, `metadata.module_templates.manage` |
| Second admin | `mahmoud.mohamed1@taviportal.com` | Works (used for the UI captures) |
| Agent / Light Agent / Reviewer profile 🔒 | one of the Gmail accounts in the same file — profile to be confirmed | Needed for A2–A8, H1–H5, H10 |
| User of another tenant | any throwaway tenant | Needed for A9 only |
| Zoho Desk reference | `docs/Credentials/ZOHO DESK Credentials.txt` (CEO), desk.zoho.com, **Edge only**, read-only | Works |

Never print passwords or tokens in evidence.

### 1.2 Test data
- Prefix every created module, layout, section, field, picklist value and record with `QA MF ` (e.g. module `QA MF Assets` / `QA MF Asset`, field `QA MF Serial`).
- Module ids: Tickets `88e8ea44-1658-4df3-9930-d0902b91073d` · Contacts `43004ce2-577f-4eda-b00a-0750fe40c3d4` · Accounts `784400e1-4a2a-42c2-b4f3-7ca56e79828a` · Products `95b45992-5beb-4f23-b619-e3ae0e304933` · Calls `f7e488b5-0232-42fd-811c-1f24356af653` · Events `6fb19115-9356-40f0-b064-840d8f1fad93` · Tasks `d120a6c2-2596-4254-968b-a1bcd3a000bf` · Contracts `0924eb24-e42a-4eab-8efd-e3428f19e882` (Time Entries `6772ffa7-…` out of scope).
- Ticket "Standard" layout `1b55c25d-eb27-4046-afd1-b292398b435b` (default, all users).
- **Write tests on standard modules use a `QA MF` custom field or a `QA MF` cloned layout**, never the seeded fields, unless the row is about protecting a seeded field.
- A working custom module for groups G and I: create `QA MF Assets` in C1 and reuse it; delete it at cleanup (needs zero records).

### 1.3 Baseline (restore point)
Before group A save to `baseline/`:
- `GET /modules` → `modules.json` (ids, labels, `sortOrder`, `status`, `rowVersion`, `recordVisibility`).
- For each in-scope module: `GET /modules/{id}`, `/fields`, `/layouts`, `/layout-rules`, `/validation-rules`, `/dependency-maps`, `/field-permissions`, `/related-modules`, `/links`, `/buttons`.
- `GET /fields/datatypes`, `GET /custom-datatypes`, `GET /teamspaces`.
- The Organize Tabs order of each test user (screenshot + the persisted value).
Revert = delete every `QA MF` object, restore orders, and prove it with the final diff (§Reporting).

### 1.4 Environment blockers
| Blocker | Rows affected | Action |
|---|---|---|
| **0 departments** visible to the owner (`GET /desk/departments` → `[]`) | C4, C5 (Department storage), Z12, Z13-Department | Inconclusive until a department exists — please add one department and assign the test agents |
| No lower-profile account confirmed 🔒 | every 🔒 row | Inconclusive until provided |
| No custom module on the tenant | C11, K12, L8 | Create `QA MF Assets` in C1 |
| No module with a subform or rollup in use | I33–I36 | Create on `QA MF Assets` |
| Seeded standard fields were already soft-deleted on 14 Sep 2026 (Contacts: Mailing Address, Description; Accounts: Industry, Fax, Address, Description) | F7, Z11, Z13 | Record as found; do **not** restore without the product owner's OK (another tester may have done it on purpose) |
| Leftover custom data type `test_data_type` ("TestDataType", 25 Aug 2026) shows in every palette | J4 | Leave it; do not use it in new tests |

### 1.5 Things that cannot be undone cleanly
- **API names are fixed** after a field or module is saved — a `QA MF` name stays in audit and history.
- **Delete Permanently** of a field removes its data; never do it on a seeded field.
- A module with records cannot be deleted — delete `QA MF` records first (and purge them from the Recycle Bin, NDC-1637).
- Module Data Storage cannot be changed after create.
- Auto-number counters do not go back.
- Integration-contract warnings: adding/removing fields on a module used by an integration changes its API schema version — check the banner before any write on Tickets/Contacts/Accounts/Products/Contracts (CRM ⇄ Desk sync uses them).

---

## 2 Surface and contract

### 2.1 Admin API (all under `/api/v1`, header `Authorization: Bearer …`, `x-app-key: desk`)
| Method | Path | Use |
|---|---|---|
| GET/POST | `/modules` | list / create module |
| GET/PATCH/DELETE | `/modules/{id}` | read / rename / delete |
| GET/POST/PATCH/DELETE | `/modules/{id}/fields[/{fid}]` | fields |
| GET | `/modules/{id}/fields/{fid}/usage`, `/value-usage`, `/unique-peers` | delete check, option replacement, unique across modules |
| GET/POST/PATCH/DELETE | `/modules/{id}/layouts[/{lid}]`, `/layouts/accessible`, `/layouts/{lid}/record-usage`, `/layouts/assignments[/{aid}]` | layouts |
| GET/POST/DELETE | `/modules/{id}/layout-rules`, `/validation-rules`, `/dependency-maps`, `/field-permissions` (+`/effective`), `/links`, `/buttons`, `/record-locks` | rules and extras (server routes exist; Desk UI hides most tabs) |
| GET | `/modules/{id}/related-modules` | lookups pointing at the module |
| DELETE | `/modules/{id}/sections/{sid}` | section delete |
| GET | `/fields/datatypes`, `/fields/datatypes/{key}` | catalogue |
| GET/POST/DELETE | `/custom-datatypes[/{key}]` | custom data types |
| GET | `/teamspaces`, `/teamspaces/{id}/modules` | teamspace links |
| Absent (404, 5 Oct 2026) | `/modules/tabs`, `/tabs`, `/web-tabs`, `/global-sets`, `/modules/order`, `/modules/limits`, `/audit-log`, `/related-list-modules` | evidence for Z rows |
| 404 | `/modules/{id}/permissions` | the client calls it; record what the Module Permission modal uses instead |

Responses use `{success, data, error, meta}`; writes carry `rowVersion`.

### 2.2 Field register (limits found in the client — the server must enforce the same)
| Item | Limit / rule (build) | Zoho Desk (docs) |
|---|---|---|
| Module plural / singular name | required; length not limited in the client — find the server limit (C6) | 25 chars in the UI, 50 in the API |
| Module description | optional | 200 (API) |
| Layout name | required, ≤ 40, unique in the module | 150 (API clone) |
| Field label | ≤ 50 per language (EN/AR/FR) | 250 (API `displayLabel`) |
| API name | `^[A-Za-z][A-Za-z0-9_]*$`, fixed after save | generated, fixed |
| Custom fields per layout | 512 (client "Custom Fields Left") | 230 custom fields per module (Enterprise); 400 fields per layout |
| Single line | `max_length` 1–20,000 | 255 default |
| Multi line | `max_length` 1–100,000 | 32,000 |
| Decimal | precision 1–28, scale 0–10 | decimal places + rounding |
| Currency | precision 1–28, scale 0–4, symbol ≤ 4 chars | rounding options |
| Auto number | prefix/suffix, start 0–2,147,483,647, digits 0–12, increment 1–2,147,483,647, 1 per layout | not available |
| Pick list / multi-select / radio / status | `allowed_values` required, optional `max_items` | 500 options for nested |
| Lookup | target module (or several), display field, related list title unique per target | 5 per module (Enterprise) + filters/search/display/autofill |
| Pipeline | system only, 1 per layout | — |
| Department, Team | system only | Department mandatory, cannot be removed |
| Section | 1 or 2 columns; Quick Create = 1 section | sections, columns not documented |

Capability flags per type (from `/fields/datatypes`): e.g. Formula/Rollup/Auto number cannot be Required; Lookup, Multi-select, Address, File, Image cannot be Unique; layout rules not allowed on most basic types. I-rows check that the UI greys out the same options.

### 2.3 Page states and messages (en, verbatim from the locale)
- Create module: "Enter the plural module name." · "Enter the singular module name." · "The storage level cannot be changed after the module is created." · "You need at least one teamspace to create a module." · toast "Module {name} created".
- Delete module: "This permanently deletes the module along with its fields and layouts… A module that still has records can't be deleted…" · "{name} still has records. Delete its records first, then delete the module." · "Failed to delete module".
- Disable: "This module has dependencies and cannot be disabled."
- Layouts: "Layout name cannot exceed 40 characters." · "A layout with this name already exists" · "Name is required" · "This is the default layout and cannot be switched off…" · "…cannot be deleted. Set another layout as the default first." · "Only an active layout can be the default. Enable it first." · "There is no other active layout on this module to move them to. Create one first." · "This permanently deletes the layout and its access settings. This action cannot be undone."
- Builder: "Layout saved successfully." · "Cannot save: {fields} cannot be both Required and Read-only…" · "Cannot save: {label} has no subfields defined…" · "Cannot save: {label} has no rollup configuration…" · "Required fields stay on every layout. Turn off Required first." · "Quick Create supports only 1 section" · "Cannot delete: section contains required fields" · "You have not saved your changes." / "Yes, Leave Page" / "Stay Here" · "Reset all changes?" · "Switching layouts will discard your unsaved changes."
- Fields: "Label must be 50 characters or fewer." · "Must start with a letter and contain only letters, digits, or underscores" · "Invalid regular expression" · "A formula field needs an expression before the layout can be saved." · "A rollup needs its related list, field and function before the layout can be saved." · "Select at least one module — until then the record form can't open a record picker for this field." · "Requires the “Manage field permissions” permission."
- Remove field: "Move to Unused Fields" / "Delete Permanently" · "This field is in use and cannot be deleted:" · "Remove the field from those first (Settings → Automation / Process Management)."
- Organize Tabs: "Choose which modules appear in the top bar… Changes apply to you only." · "Always shown" · "Reset to default" · "Your tab arrangement could not be saved. It stays applied here until you reload." · "Every module is on the bar."
- Placeholders: Web Tabs "Embed external URLs as tabs inside the CRM…" / Global Sets "…share them across modules…" + "In Development".

### 2.4 Data classes
D1 empty · D2 whitespace only · D3 single char · D4 max length · D5 max+1 · D6 leading/trailing spaces · D7 case variants (duplicate check) · D8 Arabic · D9 mixed Arabic/Latin + RTL marks · D10 emoji/astral · D11 HTML/script (`<img src=x onerror=alert(1)>`) · D12 SQL-ish (`' OR 1=1 --`) · D13 path/URL chars (`../`, `%2e`) · D14 zero-width/control chars · D15 numeric edge (0, negative, decimal, 1e9, `15,000`, Arabic-Indic `١٥٠٠٠`) · D16 date edge (29 Feb, DST, 23:59 Cairo vs UTC) · D17 type confusion (number as string, array for scalar, object, null) · D18 unknown key / datatype key · D19 duplicate (same name twice, same API name) · D20 limit+1 items.

---

## Group A — Access and permissions

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| A1 | Admin sees Customization | Owner → Setup | CUSTOMIZATION shows Modules and Fields, Data Types, Capabilities, Organize Tabs | `[func]` |
| A2 | Agent without `metadata.modules.manage` | 🔒 agent opens Setup and `/settings/modules-and-fields` by URL | Menu item hidden; direct URL shows access denied, no module data rendered | `[sec]` 🔒 |
| A3 | API gate for module writes | 🔒 agent token: POST `/modules`, PATCH `/modules/{id}`, DELETE `/modules/{id}` | 403 each; nothing changed (GET diff) | `[sec]` 🔒 |
| A4 | API gate for field/layout writes | 🔒 agent: POST `/modules/{id}/fields`, PATCH a layout | 403; no field/layout created | `[sec]` 🔒 |
| A5 | Read API for agents | 🔒 agent: GET `/modules`, `/modules/{id}/fields` | Allowed only as needed to render records; record whether hidden/Don't-Show fields leak in metadata | `[sec]` 🔒 |
| A6 | Field permissions page needs its own right | 🔒 admin-like profile without `metadata.fields.manage_permissions` opens Field Permissions | Read-only with "Requires the “Manage field permissions” permission." | `[sec]` 🔒 |
| A7 | Organize Tabs for every user | 🔒 agent opens `/settings/organize-tabs` | Allowed (personal); cannot change other users' bars | `[func]` 🔒 |
| A8 | Module hidden by Access Control | Set `QA MF Assets` Access Control = Selected Users (not the agent) → 🔒 agent: tab bar, More modules, direct record URL, API GET records | Not listed; URL and API refused (compare NDC-1864 for disabled modules) | `[sec]` 🔒 `[serial]` |
| A9 | Other tenant | Another tenant's token: GET `/modules/{NDC module id}`, `/fields` | 404/403; nothing returned | `[sec]` |
| A10 | No / expired / revoked token | GET `/modules` with no bearer, an old bearer, a revoked one | 401 (`SESSION_REVOKED` for revoked); no data | `[sec]` |

## Group B — Module list

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| B1 | Renders | Open Modules and Fields | 9 rows (Tickets…Time Entries) with Displayed In Tabs As, Module Name, Last Modified, Status; "1–9 of 9" | `[func]` |
| B2 | Last Modified shows a person | Hover the avatar | Seeded modules show the system user's name, not "UN" (today `createdByName:null` → "UN" — possible bug) | `[ux]` |
| B3 | Search | Search "tick", "TICK", Arabic text, no match | Case-insensitive filter; empty state for no match | `[func]` `[data]` |
| B4 | Paging | Rows per page 10/25/50/100 | Counts and "Page 1 of 1" correct | `[func]` |
| B5 | Disable a module `[serial]` | Toggle `QA MF Assets` off → open its records as admin and agent → toggle on | Disabled module hidden from tabs/create menu and its records cannot be created (NDC-1864 open) | `[func]` |
| B6 | Disable a module with dependencies | Toggle Tickets off | Refused: "This module has dependencies and cannot be disabled."; status unchanged | `[edge]` |
| B7 | Placeholders | Open Web Tabs, Global Sets | "In Development" badge; text should say Desk, not "CRM" (today "inside the CRM" — possible bug) | `[ux]` |
| B8 | Row menu per module | Open the menu on each standard module and on `QA MF Assets` | Record the items; "Lead Conversion Mapping" must not appear in Desk; every item that shows must open a working page | `[func]` |
| B9 | Reorder modules `[serial]` | Change order, reload; check tab bar and Create menu | "Module order saved"; order persists; record whether tab bar follows | `[func]` |
| B10 | Setup wording | Setup Home | Says Desk, not "Set up your CRM" (possible bug) | `[ux]` |

## Group C — Create and delete a custom module `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| C1 | Create (organization) | Create New Module → plural `QA MF Assets`, singular `QA MF Asset`, Organization, profiles Desk Administrator + Desk Agent → Create | "Module QA MF Asset(s) created"; row appears; GET shows `storageScope:"organization"`, `appKey:"desk"`, generated `apiName` | `[func]` |
| C2 | Required names | Leave plural, then singular empty | "Enter the plural module name." / "Enter the singular module name."; no POST | `[neg]` |
| C3 | Name data classes | D2, D3, D4/D5 (find limit), D6, D8, D10, D11, D14 in plural and singular | Trimmed; script stored as text and rendered escaped everywhere (list, tab bar, breadcrumbs); a clear limit message (Zoho: 25) | `[data]` |
| C4 | Department storage | Create `QA MF Dept` with Department | Created with `storageScope:"department"`; records are kept per department | `[func]` (§1.4) |
| C5 | Storage immutable | Rename `QA MF Dept`; try PATCH `storageScope` by API | Not offered in UI; API refuses or ignores | `[edge]` (§1.4) |
| C6 | Duplicate names | Create a second module named `QA MF Assets`, then `qa mf assets`, then `Tickets` | Refused with a clear message (no two tabs with one name) | `[neg]` `[data]` |
| C7 | Module Permission empty | Create with no profile ticked | "Leave empty to keep the default visibility" — record who can open it | `[func]` |
| C8 | Default content | Open the new module's layouts and fields | Standard layout (default) with the record-name field; system fields Created/Modified Time/By, Owner | `[func]` |
| C9 | No teamspace | (if a tenant without a teamspace exists) open Create | Disabled with "You need at least one teamspace to create a module." else Inconclusive | `[edge]` |
| C10 | Double submit | Click Create twice fast | One module only | `[edge]` |
| C11 | New module surfaces | After C1: top bar, More modules, Create menu ("New QA MF Asset"), Organize Tabs, global search, Recycle Bin module filter, Workflow Rules module list, Import/Export | Appears wherever Desk modules appear; record each place | `[func]` |
| C12 | Delete with records | Add one `QA MF` record → Delete module | "… still has records. Delete its records first…"; module kept | `[neg]` |
| C13 | Delete empty module | Delete the record (and purge from Recycle Bin) → Delete module → confirm | Module, fields, layouts gone; tab gone; no orphan records in Recycle Bin (NDC-1637) | `[func]` |
| C14 | Team Module | Click Team Module | Record what it creates; it must not break Desk tabs | `[func]` |

## Group D — Rename a module `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| D1 | Rename custom module | Rename `QA MF Assets` → `QA MF Devices` / `QA MF Device` | Saved; list, tab, breadcrumbs, record pages, "New QA MF Device" use the new names | `[func]` |
| D2 | Rename standard module | Rename Products → `QA MF Items` / `QA MF Item`; check everywhere; rename back | Zoho: shown in all standard pages except custom reports/dashboards. Restore exactly | `[func]` |
| D3 | Tab bar uses the new name | During D2 and a Tickets rename (then restore) | Tab bar, More modules, Organize Tabs and Create menu show the renamed label (today tab names come from the locale — check) | `[func]` |
| D4 | API name change warning | Change API name of `QA MF Devices` | Warning "Changing the API name may break existing integrations and automations."; workflows referencing it still work or are flagged | `[edge]` |
| D5 | Name data classes | D1, D2, D5, D8, D11, D19 (name of another module) | Same rules as C2–C6 | `[data]` |
| D6 | Icon and description | Change icon and description | Shown on tab / summary | `[func]` |
| D7 | Stale write | Tab 1 and tab 2 open Rename on the same module; save tab 1, then tab 2 | Tab 2 gets a conflict (rowVersion) or reloads — no silent overwrite | `[edge]` |
| D8 | Arabic UI | Switch to Arabic, open Rename | Labels translated; RTL layout correct | `[i18n]` |
| D9 | Rename Module from the layout builder | Tickets builder → gear (Layout settings) → Rename Module; Cancel | Rename Module modal opens (singular, plural, API name, icon, description). **Seen 5 Oct 2026: page crashes "Cannot read properties of undefined (reading 'trim')" (2 of 2)** — evidence `evidence/02-rename-any-tab-vs-zoho.png` | `[func]` |

## Group E — Module detail page

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| E1 | Tabs on Desk | Open Tickets detail | Today: Layouts, Fields, Workflow Rules, Summary. Layout Rules / Validation Rules / Map Dependency Fields are Zoho features (Z1, Z2) — record if they appear | `[func]` |
| E2 | Summary values | Summary on each module | Matches `GET /modules/{id}`; dates in tenant time zone; "—" for empty | `[func]` |
| E3 | Direct URL to unknown module | `/settings/modules-and-fields/00000000-…` and a CRM module id | Not-found state, no crash, no CRM data | `[edge]` `[sec]` |
| E4 | Workflow Rules tab | Open on Tickets | "No workflow rules yet" or the list; New Rule opens the rule editor scoped to the module | `[func]` |

## Group F — Fields listing and standard fields

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| F1 | Listing | Fields → Field Listing on Tickets | Every field with label, API name, Data Type, Custom Field mark, Layouts; system fields marked | `[func]` |
| F2 | Layout filter | All Layouts / Standard / Not on any layout | Correct subsets; "No fields on this layout." when empty | `[func]` |
| F3 | Standard vs custom mark | Compare Ticket Subject, Status, Contact, Priority | Zoho standard fields are **not** custom fields. Today they show the Custom Field tick (`isCustomField:true`) — Z11 | `[func]` |
| F4 | Standard field set — Tickets | Compare with Z13 | Live Zoho: Contact Name* (system-mandatory, non-removable), Department (non-removable), Account Name, Email, Phone, Subject*, Description, Status* (Open/On Hold/Escalated/Closed, default Open), Ticket Owner, Product Name, Resolution (edit mode only), Skills, Due Date, Priority (-None-/High/Medium/Low), Channel, Language, Classifications; Unused: Category, Sub Category; plus Ticket Id (Autonumber) and Layout | `[func]` |
| F5 | Standard field set — Contacts, Accounts, Products | Compare with §Z13 | Zoho default fields present and active | `[func]` |
| F6 | Standard field set — Calls, Events, Tasks, Contracts | Compare with §Z13 | Zoho default fields present; required where Zoho requires | `[func]` |
| F7 | Soft-deleted standard fields | Field Listing on Contacts and Accounts | Today Mailing Address, Description (Contacts) and Industry, Fax, Address, Description (Accounts) are soft-deleted — record, see §1.4 | `[func]` |
| F8 | Picklist value labels | Open record forms for Ticket Priority, Channel, Classification, Language | Human labels (High, Email, Question, English) — not stored keys (`low`, `email`, `question`, `english` show in the builder preview today) | `[ux]` |
| F9 | Hidden "Name" field | Tickets/Calls/… "Name" is required but on no layout | Creating a record from UI and API works without it, or the requirement is documented — record | `[edge]` |
| F10 | Create and Edit Fields | Click the button | Opens the layout builder of the chosen layout | `[func]` |

## Group G — Layouts `[serial]` (on `QA MF Assets` and a cloned Ticket layout)

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| G1 | Standard layout is default | Layouts tab | "Default" badge with tooltip "New records use this layout unless another one is chosen." | `[func]` |
| G2 | Create layout | Create New Layout `QA MF L1` | Created, active, not default | `[func]` |
| G3 | Clone layout | Clone Ticket Standard → `QA MF Ticket clone` | Same sections/fields; independent afterwards | `[func]` |
| G4 | Name rules | D1, D5 (41 chars), D19 (existing name), D8, D11 | "Name is required" / "…cannot exceed 40 characters." / "A layout with this name already exists"; Arabic kept; script escaped | `[data]` |
| G5 | Set default | Set `QA MF L1` default, then disable it | Default moves; disabling the default refused | `[func]` |
| G6 | Default from inactive | Disable L1, Set as default | "Only an active layout can be the default. Enable it first." | `[neg]` |
| G7 | Delete default | Delete the default layout | "…cannot be deleted. Set another layout as the default first." | `[neg]` |
| G8 | Delete with records | Create 2 records on L1 → delete L1 | "Move records to" picker; records moved; GET record shows the new layout | `[func]` |
| G9 | Delete the only active layout | Module with one active layout | "There is no other active layout… Create one first." | `[neg]` |
| G10 | Layout permission | Assign L1 to Desk Agent only → 🔒 agent creates a record | Agent can pick only allowed layouts; admin sees all | `[sec]` 🔒 |
| G11 | Layout chooser on create | Two active layouts → New record | User chooses a layout; default preselected | `[func]` |
| G12 | Limit | Create layouts until refused (Zoho: 20 per department) | A clear limit or record "no limit" | `[edge]` |
| G13 | Views | Switch CREATE / QUICK CREATE / DETAIL VIEW | Each keeps its own arrangement; record forms follow it | `[func]` |
| G14 | Quick Create one section | Add a 2nd section in Quick Create | "Quick Create supports only 1 section" | `[neg]` |
| G15 | Preview | Preview as Create / Quick Create / Detail View | Matches the saved form | `[func]` |
| G16 | Add section | NEW SECTION, rename EN + AR | Shown in record form in both languages | `[func]` `[i18n]` |
| G17 | Columns | 1 Column ↔ 2 Columns | Fields re-flow; full-width fields stay full width | `[func]` |
| G18 | Tab order | Left to Right / Top to Bottom | Keyboard Tab moves in that order on the record form (NDC-492 open) | `[a11y]` |
| G19 | Reorder sections | Drag and Move Up/Down | Order saved | `[func]` |
| G20 | Delete section | Section with optional fields → delete | "All fields inside will be moved to Unused Fields." | `[func]` |
| G21 | Delete section with required | Section with a required field | Delete disabled: "Cannot delete: section contains required fields" | `[neg]` |
| G22 | Unsaved changes | Change, click Back / switch layout | "You have not saved your changes." / "Switching layouts will discard…"; Stay keeps changes | `[ux]` |
| G23 | Reset | Change, Reset | "Reset all changes?"; restored to last save | `[func]` |
| G24 | Undo/redo and shortcuts | Ctrl+Z / Ctrl+Y / Ctrl+S / Ctrl+Shift+S | Work as listed in Help | `[ux]` |
| G25 | Double save | Ctrl+S twice fast | One save; rowVersion +1 | `[edge]` |
| G26 | Stale two-tab save | Tab 1 and tab 2 edit the same layout; save both | Second save refused or merged — no lost change | `[edge]` |
| G27 | Session expiry mid-edit | Edit, wait for token expiry/revoke, Save | Clear error; edits not lost silently | `[edge]` |
| G28 | Integration warning | Add a field on Contacts (CRM sync) | Banner and "This change affects integrations" dialog naming the integration | `[func]` |
| G29 | Module image | Turn module image On/Off | Image field in the record header follows | `[func]` |
| G30 | Help drawer | Open Help; search | Articles listed; "No articles match your search." for nonsense | `[ux]` |

## Group I — Fields in the Layout Builder `[serial]` (on `QA MF Assets`)

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| I1 | Palette | List New Fields | 33 types; system-only types (Department, Team, Pipeline) not addable — "system only" title | `[func]` |
| I2 | Add by drag and by click | Add a Single Line both ways | Field placed; counter "Custom Fields Left" −1 | `[func]` |
| I3 | Field limit | Add fields until 0 left | Further adds refused with a message (client limit 512 per layout) | `[edge]` `[perf]` |
| I4 | Required | Mark as Required | Record form requires it; API POST without it → 400/422 | `[func]` |
| I5 | Required + read-only | Set both | Save blocked: "Cannot save: … cannot be both Required and Read-only…" | `[neg]` |
| I6 | Unique | Mark Unique; create two records with the same value (UI and API), also D7 case and D6 spaces | Second refused; record whether "abc" = "ABC" | `[func]` `[data]` |
| I7 | Unique across modules | Same API name on two modules, tick the other module | Value used in one is refused in the other; "Enforced" shown | `[func]` |
| I8 | Unique not offered | Lookup, Multi-select, Address, File, Image | Mark as Unique disabled | `[neg]` |
| I9 | Full/half width | Toggle | Record form follows | `[ux]` |
| I10 | Remove from layout of a required field | Remove a required field | "Required fields stay on every layout. Turn off Required first." | `[neg]` |
| I11 | Label | D1, D4 (50), D5 (51), D8, D10, D11 in EN/AR/FR | "Label must be 50 characters or fewer."; escaped; shown per UI language | `[data]` `[i18n]` |
| I12 | API name rules | `1abc`, `a-b`, `a b`, `ابجد`, duplicate of another field; then change after save | Error "Must start with a letter…"; duplicate refused; locked after save (NDC-1873 open: label change doesn't update a new field's API name) | `[data]` |
| I13 | Type change after save | Try to change a saved field's data type (UI and PATCH `datatypeKey`) | Not allowed (Zoho: "the field type cannot be changed") | `[neg]` |
| I14 | Single Line length | `max_length` 1, 20000, 20001, 0 | Bounds enforced in UI and API; record value of length max+1 refused | `[data]` |
| I15 | Multi Line length | 100000 / 100001 | Same | `[data]` |
| I16 | Number / Long Integer / Decimal / Percent / Currency | D15 values; min/max; precision/scale; currency symbol 4/5 chars | Stored as typed; out-of-range refused; scale rounding consistent UI vs API | `[data]` |
| I17 | Date / Date Time | D16 values | Stored in UTC, shown in tenant time zone | `[data]` |
| I18 | Email / Phone / URL | valid, invalid, D11, `javascript:alert(1)` URL | Invalid refused; URL rendered safe (no `javascript:`) | `[data]` `[sec]` |
| I19 | Checkbox | default on/off | Default applied on create only | `[func]` |
| I20 | Pick list options | Add, reorder, remove; D1, D19 duplicate value, D8, D11 | Duplicates refused; Arabic kept; escaped | `[data]` |
| I21 | Remove a used option | Option used by 2 records → remove → Save | "Replace removed options" dialog with counts; Replace and apply updates the 2 records; Leave empty clears them | `[func]` |
| I22 | Multi-select max items | `max_items` 2, choose 3 | Refused | `[edge]` |
| I23 | Radio / Status | Add options; Status as kanban/pipeline source | Works on record form | `[func]` |
| I24 | Default value | Default for text, pick list, checkbox | Prefilled on create; not applied to existing records | `[func]` |
| I25 | Regex | `^[A-Z]{2}[0-9]{4}$`; tester with match/no match; invalid `([` | "✓ Value matches…" / "✗ Value does not match" / "Invalid regular expression"; record form enforces; API enforces | `[func]` |
| I26 | Regex ReDoS | `(a+)+$` with 30 × "a" + "b" | Server stays responsive (< 2 s) | `[sec]` `[perf]` |
| I27 | Conditional visibility | Show field B when A = "X" (case-insensitive), Required while visible | Shown/hidden live; required only while shown; API create obeys the same rule (record) | `[func]` |
| I28 | No controllers | Layout with one field | "This layout has no other field that could control this one…" | `[edge]` |
| I29 | Auto-fill | From logged-in user (name/email), from another field, from agent setting | Filled only while empty; never overwrites a saved value (NDC-1231 open) | `[func]` |
| I30 | Auto number | Prefix `QA-`, suffix `-EG`, start 7, digits 4, increment 2; add to a module with records | Preview "QA-0007-EG then QA-0009-EG"; existing records numbered; no duplicates under 5 parallel creates | `[func]` `[edge]` |
| I31 | Auto number bounds | digits 13, increment 0, start −1, prefix too long | "Enter a number from … to …" / "Must be N characters or fewer." | `[data]` |
| I32 | Lookup | Lookup to Contacts, display field, related list title `QA MF Assets`; second lookup to Contacts with the same title | Related list appears on Contact; duplicate title refused | `[func]` |
| I33 | Multi-module lookup | "Let users choose the related module…", pick Contacts + Accounts; then none | Record form lets user choose; none → "Select at least one module…" | `[func]` |
| I34 | Formula | `quantity * unit_price`, functions `if`, `concat`, `round(x,2)`, `isblank`; empty expression; unknown field; divide by zero | Computed on save; errors clear; empty → "A formula field needs an expression…" (NDC-1586) | `[func]` `[data]` |
| I35 | Subform | Subform with 0 columns → Save; then 3 columns (Single Line, Number, Pick List) | "Cannot save: … has no subfields defined…"; then rows work on record form (NDC-1335, NDC-1340) | `[func]` |
| I36 | Rollup summary | Count and Sum of a related module via a lookup; module with no lookup back | Values correct; "The selected module has no lookup field pointing at this module…" only when true (NDC-1444) | `[func]` |
| I37 | Quick-create trigger | Option "Escalate" opens a Task quick-create | Pop-up opens when the value changes to that option | `[func]` |
| I38 | File / Image / Camera | Extensions and max size; upload wrong type, too big, SVG with script | Refused with message; SVG not executed | `[func]` `[sec]` |
| I39 | Address / Location / Map | Fill subfields; map renders | Stored as object; shown on detail | `[func]` |
| I40 | Rich text | Paste D11 and a `<script>` | Sanitised on save and render | `[sec]` |
| I41 | Remove field → Unused | Remove `QA MF Serial` → Move to Unused Fields → Save → add back | Data kept and shown again | `[func]` |
| I42 | Delete permanently | Delete an unused `QA MF` field | "…cannot be undone."; field gone from list, views, workflow pickers (NDC-1863: 400 on save) | `[func]` |
| I43 | Delete a used field | Field used in a workflow rule | "This field is in use and cannot be deleted:" with the rule listed | `[neg]` |
| I44 | Telephony usage | Field used by telephony (if any) | Warning + acknowledge checkbox | `[edge]` |
| I45 | Delete a seeded standard field | Try on Ticket Subject, Calls Subject, Product Name (UI menu + DELETE API) — **do not confirm on seeded fields; stop at the dialog / use a cloned layout** | Zoho: standard fields cannot be deleted or moved to Unused. Record which are offered — Z11 | `[sec]` |
| I46 | Unused counter | Remove 3 fields | "Unused Fields 3"; "All fields are in use" when 0 | `[func]` |
| I47 | Field Dependency rule | When Pick list = A → Show B, Require C | Record form follows; Save Rules persists | `[func]` |
| I48 | Dependency edit/delete | Edit and delete a rule | List updates; empty state text | `[func]` |
| I49 | Circular dependency | A shows B, B hides A | Refused or harmless; no infinite loop | `[edge]` |
| I50 | Per-profile permissions | PERMISSIONS tab: agent Read only / no Read | Saves immediately ("…not part of Apply"); new unsaved field shows "Save the layout first…"; enforced on UI, API and import (NDC-1337, NDC-1593, NDC-1599) | `[sec]` 🔒 |

## Group H — Permissions and visibility

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| H1 | Field Permissions page | Fields → Field Permissions on Tickets | Profiles × fields grid with Read and Write / Read Only / Don't Show; system fields locked "System field — locked to Read Only"; pagination 25/50/100 (NDC-1336) | `[func]` |
| H2 | Don't Show | Hide `QA MF Serial` from Desk Agent | 🔒 agent: not on form, list columns, filters, export, API record body | `[sec]` 🔒 |
| H3 | Read Only | Read Only for agent | Visible, not editable in UI; API PATCH refused | `[sec]` 🔒 |
| H4 | Required vs Don't Show | Required field set to Don't Show for a profile | Refused (Zoho: mandatory fields can't be Read Only or Don't Show) | `[neg]` |
| H5 | Light Agent | Read and Write for Desk Light Agent | Record result (Zoho: Light Agent cannot get Read & Write) | `[func]` |
| H6 | Record visibility Public | Set Public Read/Write/Delete on `QA MF Assets` | All users see and edit all records | `[func]` 🔒 |
| H7 | Public Read Only | Switch | Users edit only own and subordinates' | `[func]` 🔒 |
| H8 | Private | Switch | Users see own and subordinates'; unassigned visible to all | `[func]` 🔒 |
| H9 | Access Control | Summary → Selected Users / profiles / org units; empty selection | "Select at least one user, profile, permission, or org unit — or switch back to All Users." | `[func]` |
| H10 | Module Permission at create | Profiles ticked at C1 | Only those profiles see the tab | `[sec]` 🔒 |

## Group J — Data Types and Capabilities

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| J1 | Catalogue | Open Data Types | 35 types incl. TestDataType; search "No datatypes match your search" | `[func]` |
| J2 | Capability flags | Open a type, view flags | Match `/fields/datatypes` capabilities; builder menu greys out the same actions | `[func]` |
| J3 | Add custom data type `[serial]` | `QA MF Code` on Single Line | "Inherits validation + UI hints"; appears in palette of every module | `[func]` |
| J4 | Delete custom data type in use | Use J3 type on a field, then delete the type | Refused or the field keeps working — record | `[edge]` |
| J5 | Capabilities page | Open | "The system catalog seeds 8 capabilities…"; system entries cannot be deleted | `[func]` |
| J6 | Add / delete capability `[serial]` | `QA MF cap` | Created; delete asks to confirm | `[func]` |
| J7 | Access | 🔒 agent opens both pages by URL | Access denied | `[sec]` 🔒 |
| J8 | Data classes | D1, D11, D19 in names | Validation and escaping | `[data]` |

## Group K — Organize Tabs and the tab bar

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| K1 | Renders | Open Organize Tabs | Selected: Tickets, Knowledge Base, Customers, Analytics, Activities, Chat, Community, Social, Contracts; Unselected empty "Every module is on the bar." | `[func]` |
| K2 | Hide a tab `[serial]` | Hide Social | Moves to Unselected; gone from the bar after save; reachable by URL? record | `[func]` |
| K3 | Reorder | Drag and Move up/down | Bar order follows; persists after reload and sign-out | `[func]` |
| K4 | Locked tab | Try to hide an "Always shown" module | Not allowed | `[neg]` |
| K5 | Hide everything | Hide all but the locked one | At least one module stays (Zoho: "At least one module must be selected") | `[edge]` |
| K6 | Reset | Reset to default | Default order back | `[func]` |
| K7 | Per user | User A hides Social; user B signs in 🔒 | B's bar unchanged — **Desk: per user; Zoho: organisation-wide, set by admin (Z8)** | `[func]` 🔒 |
| K8 | Save failure | Block the save request (offline) | "Your tab arrangement could not be saved. It stays applied here until you reload." | `[edge]` |
| K9 | Keyboard | Reorder with keyboard only | Move up/down buttons have names "Move {name} up"; focus visible | `[a11y]` |
| K10 | Two tabs | Change order in two browser tabs | Last write wins without errors; record | `[edge]` |
| K11 | More modules | Narrow window; open "More modules"; search | Overflow list; "No module matches your search." | `[func]` |
| K12 | Custom module tab | After C1 | `QA MF Assets` appears in the bar or More and in Organize Tabs | `[func]` |
| K13 | Grouped tabs | Customers and Activities | Customers = Contacts + Accounts; Activities = Tasks, Calls, Events — same grouping as live Zoho (bar order there: Tickets, Knowledge Base, Contracts, Customers, Analytics, Activities, Community, Social, Chat, IM) | `[func]` |
| K14 | Products tab | Look for Products in the bar/More | Live Zoho has no Products tab in the bar either (Products is under Setup → Organization, and can be renamed in Rename Tabs); Desk: Setup → General → Products — not a gap | `[func]` |

## Group L — Security, i18n/RTL, accessibility, performance, compatibility

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| L1 | Stored XSS in names | D11 in module name, layout name, section name, field label, picklist option, description, related list title, help text | Rendered as text in setup, tab bar, forms, list, kanban, export, emails, audit log | `[sec]` |
| L2 | Type confusion | POST/PATCH with `labels` as string, `allowed_values` as object, `required:"yes"`, unknown `datatypeKey` (D17, D18) | 400/422 with a clear error; nothing half-saved | `[sec]` |
| L3 | Read-only keys | PATCH `isSystemField`, `isCustomField`, `appKey`, `moduleKey`, `createdBy`, `rowVersion` | Ignored or refused | `[sec]` |
| L4 | Mass assignment on modules | POST module with `appKey:"crm"`, another `teamspaceId` | Refused; module stays in Desk | `[sec]` |
| L5 | IDOR | Use ids of CRM modules / another tenant in `/modules/{id}/fields` | 403/404 | `[sec]` |
| L6 | Audit log | After C1, D1, G2, I2, I42 | Each change logged with who/when/what (Zoho Enterprise logs custom modules) | `[func]` |
| L7 | Arabic UI | Switch language; open every page | All strings translated, RTL mirrored, drag-and-drop works in RTL | `[i18n]` |
| L8 | Arabic content | Arabic module, section, field, option names | Saved and shown correctly; sort and search work | `[i18n]` |
| L9 | Keyboard and screen reader | Builder: add field, move section, open menus | Every control reachable; aria labels (e.g. "Actions for {name}") present | `[a11y]` |
| L10 | Load time | Open the builder of the largest layout (Tickets) 5× | Median < 3 s; no long tasks > 1 s | `[perf]` |
| L11 | Big layout | `QA MF Assets` with 200 fields | Builder usable; save < 5 s | `[perf]` |
| L12 | Browsers | Chromium, Edge, Firefox, Safari/WebKit; 1366×768 and 1920×1080; tablet width | Builder and tabs usable; drag works | `[compat]` |

---

## E2E journeys

| ID | Journey | Steps (chained) | Expected |
|---|---|---|---|
| E2E-1 | Admin builds a custom module | C1 → add Single Line (unique), Pick list, Lookup to Contacts, Auto number → set permissions → create 3 records → open a Contact and see the related list | Works end to end; related list shows the 3 records |
| E2E-2 | Tailor the ticket form | Clone Ticket layout → add section + `QA MF` fields → field dependency → assign to Desk Agent → 🔒 agent creates a ticket with that layout | Agent sees only that layout's form; rules applied |
| E2E-3 | Rename and reorganise | Rename Products → tab bar, Organize Tabs, Create menu, records → rename back | Names consistent everywhere; restored |
| E2E-4 | Field lifecycle | Add field → fill on records → remove to Unused → add back (data kept) → change options with replacement → delete permanently | Each step as specified; no orphan values; audit entries |
| E2E-5 | Negative recovery | Save with Required+Read-only conflict → fix → stale second tab save → reload → delete a used field (blocked) → remove usage → delete | Every failure has a clear message; final state consistent |
| E2E-6 | Arabic admin | Arabic UI: create module, section and field with Arabic labels; agent in Arabic creates a record | Works in RTL; labels in Arabic |

---

## Group Z — Gaps (run to confirm they are still missing or now built)

Z1–Z6 are in NDC-1879 (items 1–6). Z7 is NDC-1866 item 16. **Z8–Z19 are new** (missing list items 1–12) and are not filed in Plane (user asked for no Plane changes). "Live" = seen in the Zoho Desk org on 5 Oct 2026 (Enterprise trial, read-only); "Docs" = Zoho help/API only. Every Z row is expected to fail until the function is built.

| ID | Gap | How to test | Expected (Zoho) |
|---|---|---|---|
| Z1 | Layout rules (NDC-1879 item 1) | Look for a Layout Rules tab / builder "Create Layout Rule"; create a rule that shows a field and makes another mandatory | Live: Layouts and Fields → Layout Rules, "Create Rule" per module and department. Docs: Show Fields / Show Sections / Set Mandatory Fields; 10 per layout, 50 per department, 25 conditions; manual create/edit only |
| Z2 | Validation rules (NDC-1879 item 2) | Validation Rules tab; rule across two fields with an alert message | Live: Validation Rules page with "Create Rule". Docs: own alert message, run in creation order; bypassed by import, workflow, API |
| Z3 | Picklist values per layout (NDC-1879 item 3) | Two layouts, different Priority values | Each layout has its own values (live: the Tickets "Sales" layout differs from the default one) |
| Z4 | Help Center access per field (NDC-1879 item 4) | Field properties | Live: "Hide from Help Center" toggle and "Editable for End Users ▾" in Edit Properties; help-center icon on each ticket field |
| Z5 | Nested and colour-coded picklists (NDC-1879 item 5) | Pick list properties and palette | Live: "Nested picklist" toggle (6 levels, `::`); palette has Colored Picklist and Colored Multiselect |
| Z6 | Field encryption / ePHI (NDC-1879 item 6) | Field properties | Live: "Encrypted Fields 10" in Custom Fields Left. Docs: encrypt a custom field; ePHI label |
| Z7 | Ticket number format (NDC-1866 item 16) | Ticket Number field | Live: "Ticket Id" is an Autonumber field. Desk: read-only Single Line |
| Z8 | Tab bar set by the admin for everyone (item 1) | K7 | Live: Setup → Modules and Tabs → **Organize Tabs** (Selected / Unselected Modules, drag to reorder). Docs: a hidden module "won't appear regardless of user profile"; at least one module must stay. Desk: Organize Tabs is personal ("Changes apply to you only") |
| Z9 | Rename any tab (item 2) | Look for a Rename Tabs page; try to rename Knowledge Base, Customers, Activities, Analytics | Live: **Rename Tabs** with 19 display names — Tickets, Knowledge Base, Contracts, Accounts, Contacts, Products, Reports, Dashboards, Activities, Time Entry, Community, Social, Chat, Calls, Tasks, Events, IM, Analytics, Customers. Desk can rename only record modules, from the module list |
| Z10 | Search fields per module (item 3) | Look for a "Search Fields" setting | Live: Layouts and Fields → **Search Fields** → All Fields / Specific Fields (27 ticket fields listed). Docs: up to 10 per module (6 for Contracts, Products, Activities) |
| Z11 | Standard fields are protected (item 4) | F3, I10, I45 (stop at the dialog on seeded fields) | Live: core fields carry "Non-removable standard field" (Tickets Subject, Status, Contact Name, Email, Description, Due Date, Priority, Channel, Ticket Owner; Calls/Events/Tasks Subject; Product Name; Contract Name, Account Name, Start Date); system-mandatory fields cannot be un-required; other standard fields can only go to **Unused Fields**, never be deleted; no standard field is marked custom. Desk: seeded fields are marked custom; Calls/Events/Tasks Subject, Product Name and Contract Name are deletable; Ticket Subject and Status can be made optional (then removed) and Contact, Department, Email, Description, Due Date, Priority, Channel, Ticket Owner, Resolution can be removed from the ticket layout (API flags `canMarkRequired` / `canRemoveFromLayout`) |
| Z12 | Department-specific layouts and the Department field (item 5) | G2 with a department (§1.4: needs a department) | Live: Tickets, Tasks, Calls, Events, Contracts have one layout **per department** (department picker on Layouts); Department is non-removable on all of them and mandatory on Tasks, Calls, Events and Contracts; Products has a mandatory multi-select Department. Desk: layouts are per profile only; Department is optional and not on the Tasks/Calls/Events layouts |
| Z13 | Missing or different standard fields (item 6) | F4–F6 | Live: Tickets **Category** and **Sub Category** (with a Category → Sub Category dependency). Accounts **Annual Revenue** (Currency), Industry, Fax, Street, City, State, Code, Description. Contacts Street, City, State, Zip, Country, Description. Products Department, **Manufacturer** (Pick List), Unit Price. Tasks **Remind At**; Calls/Events **Remind me**. Calls: Contact Name and Call Status mandatory. Events: Contact Name mandatory. Contracts: **Account Name**, **Start Date** and **Support Plan** mandatory, plus SLA Name. Zoho keeps several of these in Unused Fields by default; the gap is that Desk does not have them as standard fields, or has them soft-deleted |
| Z14 | Picklist tools (item 7) | Pick list ADVANCED tab and field menu | Live: Pick List Values editor with import, clear, **sort** and expand icons and "**Add Values in Bulk**"; **Replace Values** in the field menu. Docs: Replace Values updates existing records at any time; export values as CSV. Desk: add/reorder/remove one by one; replacement offered only when removing a used option |
| Z15 | Rounding options (item 8) — Docs | Decimal / Currency properties | Normal / Round off / Round down / Round up, and decimal places |
| Z16 | Lookup options (item 9) — Docs | Lookup ADVANCED tab | Filter lookup records (5 criteria); search by up to 6 fields; up to 6 display fields in the pop-up; sort; auto-fill up to 5 layout fields from the chosen record |
| Z17 | Layout Help Center settings (item 10) | Create New Layout form and Layouts list | Live: the Tickets Layouts list has a **Display in Help Center** column. Docs: Add Layout has Display Name in Help Center, Description, "Display in Help Center" and "Allow non-department agents" |
| Z18 | Ticket Status page (item 11) | Look for a status setup page | Live: Layouts and Fields → **Ticket Status** per department: Add Status, Status Type (Open / On Hold / Closed), Fall-back to default; "Pause the SLA clock with the new On Hold State". Desk: Status is a field with a value list only. Check first whether a Tickets or SLA gap item already covers it |
| Z19 | Agents as a customisable module (item 12) | Look for Agents in Modules and Fields | Live: Agents is a module with its own layout (2 sections), 15 field types and 240 custom fields left. Desk: no Agents module. Check NDC-1878 (Agents gaps) first |

---

## Traceability

There is no PRD with numbered requirements for this feature in Plane (NDC-1249 holds test cases; NDC-1489 is a plan row). Traceability is to the Zoho capability areas and existing defects.

| Area | Scenarios | Related Plane items |
|---|---|---|
| Module list, enable/disable, order | B1–B10 | NDC-1864 |
| Create / delete custom module | C1–C14, A3 | NDC-1693, NDC-1630, NDC-1637 |
| Rename module (singular/plural, API name) | D1–D8, E2E-3 | — |
| Module detail and rules tabs | E1–E4, Z1, Z2 | NDC-1489, NDC-1879 |
| Fields listing, standard fields, search fields, status, agents | F1–F10, Z10, Z11, Z13, Z18, Z19 | NDC-1339, NDC-1338, NDC-1598 |
| Layouts | G1–G30, Z3, Z12, Z17 | NDC-1588, NDC-492 |
| Field types and properties | I1–I50, Z4–Z7, Z14–Z16 | NDC-1873, NDC-1863, NDC-1586, NDC-1444, NDC-1335, NDC-1340, NDC-1231, NDC-1230 |
| Field permissions, record visibility, access control | H1–H10, A5, A6, A8, I50 | NDC-1337, NDC-1336, NDC-1593, NDC-1599, NDC-1835 |
| Data types and capabilities | J1–J8 | NDC-1445 |
| Tabs | K1–K14, Z8, Z9 | — |
| Security | A1–A10, L1–L5 | — |
| i18n, a11y, perf, compat | L6–L12, D8 | — |

Every scenario maps to at least one area; every Z row maps to a missing-list item.

---

## Reporting

- Folder: `executions/<run>/` with `report.md`, API request/response (redacted) and screenshots.
- Evidence rule (user, 4 Oct 2026): **screenshots only for failed rows**, each annotated side by side against live Zoho Desk (TAVI left, Zoho right, table "Behaviour | Zoho | TAVI | Match"). Passed rows get a verdict and one line of text.
- Redaction: never write tokens, cookies or passwords — write `Bearer <len=1263>`. Mask other users' emails.
- Each Fail: steps, expected, actual, evidence, and the existing NDC item it matches (see Traceability) before suggesting anything new — run the false-positive checklist (permission, layout scope, cached SPA, stale/revoked token, another tester's change).
- Coverage gaps restated at the end: 🔒 rows and Department-storage rows are Inconclusive while §1.4 blockers stand.
- Revert proof: after cleanup repeat every §1.3 GET and diff against the baseline. Only expected differences allowed (Recycle Bin entries if not purged, auto-number counters), listed by id.
