# Zoho CRM — Global Sets (Global Picklists): documented inventory

Compiled 11 Nov 2026 from public Zoho help docs, the community announcements Zoho staff wrote, and the CRM API v8 docs. No login was used.
Key: **[inferred]** = not read in a doc, my inference. **[not documented]** = searched, no Zoho statement found.

Short source keys used below:
- WG-new = https://help.zoho.com/portal/en/kb/crm-nextgen/customize-crm-account/customizing-fields/articles/nextgen-working-with-global-sets
- WG-classic = https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/working-with-global-sets
- WG-v2 = https://help.zoho.com/portal/en/kb/crm-v2/customize-crm-account/customizing-fields/articles/crm-v2-working-with-global-sets
- OV-new = https://help.zoho.com/portal/en/kb/crm-nextgen/customize-crm-account/customizing-fields/articles/nextgen-overview-of-global-sets
- OV-v2 = https://help.zoho.com/portal/en/kb/crm-v2-1/customize-crm-account/customizing-fields/articles/crm-v2-overview-of-global-sets
- ANN = https://help.zoho.com/portal/en/community/topic/introducing-global-sets-for-easy-management-of-similar-picklists-in-crm (Zoho announcement, with update notes Sep 2024 and Dec 2025)
- ANN-EA = https://help.zoho.com/portal/en/community/topic/introducing-global-sets-for-easy-management-of-similar-picklists-in-crm-public-early-access-2023 (2023 early-access post)
- KZ161 = https://help.zoho.com/portal/en/community/topic/global-sets-using-zoho-crm-apis (Kaizen #161)
- API pages: https://www.zoho.com/crm/developer/docs/api/v8/… (full URL given on each line)

---

## 1. Where it lives, list page, row actions
- Setup path: Setup > Customization > Modules and Fields > **Global Sets** tab. Users need the right profile permission. — WG-new
- List page has a **Search** box (search by global set name) and a **Create Global Set** button. — WG-new
- List page columns: global set name, **modules that use the set**, **created by**, **created time**, **last modified by**, **last modified time**. — WG-new
- Hovering over a row shows the set's **description**. — WG-new
- Row actions (ellipsis "..." on hover): **Edit**, **Clone**, **Replace Values**, **Delete**. — WG-new
- Sorting of list columns: [not documented].
- No "used in" count column is documented; the API has `include=associated_fields_count` and `used_in_modules`. — https://www.zoho.com/crm/developer/docs/api/v8/get-global-picklist.html

## 2. Create a global set (from scratch)
- **Global Set Name**: used to pick the set in Pick List Properties and shown on the Global Sets tab. — WG-new
- API: `display_label` is mandatory, **unique**, **max 50 characters**, no emoji, not null. — https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html
- **API name**: no UI field in the help doc [not documented in UI]. API response has a system-made `api_name` (and `actual_label`). — https://www.zoho.com/crm/developer/docs/api/v8/get-global-picklist.html
- **Description**: optional; API max **1000 characters**. — WG-new; https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html
- **Global Set Values** editor: plus (+) icon adds a value under the hovered one; minus (−) removes it (moves it to Unused Values); click a value to rename it; replace icon; a **maximize** icon for the values box. — WG-new
- Gear menu on values: **Add Predefined Choices**, **Add Bulk Options**, **View/Add Unused Values**. — WG-new
- Bulk add: "Add Bulk Options" exists; one-per-line format is [inferred] (same as the local picklist bulk dialog), not stated on the global sets page. — WG-new
- Max values: **1000 used + 500 unused** per set. — OV-new; ANN; https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html
- Value length: `display_value` **max 120 characters**; **emoji, special characters and empty values are not allowed**. — https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html
- `reference_value`: optional unique reference, max 120 characters, no emoji/special characters, defaults to `display_value`. `actual_value` is set by the system from `display_value` and cannot be sent. — https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html
- Duplicates: duplicate `display_value` in a set (or duplicate set name) → `DUPLICATE_DATA` (400). — https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html
- Case sensitivity of duplicates: [not documented].
- Ordering: values shown **in entry order** or **alphabetically** (option on the form; API `pick_list_values_sorted_lexically`, default false). — WG-new; https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html
- API ordering per value: `sequence_number` (defaults to input order). — https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html
- Drag-and-drop reorder in the UI: [not documented].
- Colour coding: check **Enable Color Options**, default colours are given to every value, each can be changed. — WG-new
  - CONTRADICTION: the same help page's notes still say "Global set values cannot be color coded for now." — WG-new; WG-v2
  - Zoho's announcement update (Dec 2025) says colour coding of global set values is now available, like regular picklists. — ANN
  - Create/Update API pages do not document a colour field for global sets; field metadata has `colour_code` per value and `enable_colour_code` per field. — https://www.zoho.com/crm/developer/docs/api/v8/field-meta.html
- "Use first value as default": not an option of the global set itself [not documented]; default value is a field-level setting in Pick List Properties [inferred].
- Validation messages (UI wording): [not documented]. API error messages: see section 11.
- One global set per Create API call. — https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html
- Values may be created directly as `type: "unused"` via API. — https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html

## 3. Three creation paths
- **From scratch**: Global Sets tab > Create Global Set. — WG-new
- **Convert a local picklist** (from field properties): Modules and Fields > module > layout > picklist Settings > **Edit Properties** > gear icon > **Convert to Global Set** > enter set name > Save > Done > Save layout. After that, values are managed from Global Sets. — WG-new
  - Not available in **Sandbox**. — WG-new; WG-v2
- **Clone**: row ellipsis > **Clone**. Copies description, values and sort order; name is auto-set to **`X_Cloned`**; edit and Save. — WG-new
  - Whether clone copies unused values or colours: [not documented].

## 4. Edit a global set
- Row ellipsis > **Edit** opens "Edit Global Set": change description, add, remove (to unused), delete, rename, replace values, change sort order, Save. — WG-new
- Name editable in UI: [not documented]; API update accepts `display_label`. — https://www.zoho.com/crm/developer/docs/api/v8/update-global-picklist.html
- **Rename** a value: updates the value in **existing records** and other places (workflow rules, criteria, reports, etc.). — WG-new; OV-v2
- **Replace** a value (icon in editor, or row ellipsis > **Replace Values**): new value replaces old in existing records and other places; old value goes to **Unused Values**. — WG-new
  - Replace API says replacement covers **Records, Criteria, Workflow Actions, Field Dependency**; runs as a **scheduled job** when the set is linked to a record field. — https://www.zoho.com/crm/developer/docs/api/v8/replace-global-picklist-options.html
  - **"-None-" cannot be replaced**; old and new must differ; target must be an existing option of the same set. — https://www.zoho.com/crm/developer/docs/api/v8/replace-global-picklist-options.html
  - Replace is **blocked** if the option is tied to **Blueprint** or **ABM mapping** (`NOT_ALLOWED`). — https://www.zoho.com/crm/developer/docs/api/v8/replace-global-picklist-options.html
  - Effect on custom views, reports filters, blueprints explicitly: help says "workflow rules, criteria, reports, etc."; views and blueprints by name [not documented].
- **Remove** a value: moves it to **Unused Values**. Removing (deleting) a value only removes it from associated picklists; it **stays in existing records** and other CRM places. — WG-new
- **Delete permanently**: only from Unused Values (gear > View/Add Unused Values). — WG-new; WG-v2
- **Move unused back to used**: via View/Add Unused Values (UI); API `type: "used"`. — WG-new; https://www.zoho.com/crm/developer/docs/api/v8/update-global-picklist.html
- Limits when the set is associated with **more than 15 fields**: cannot replace values, cannot delete values, cannot delete the set, and only **50 values per request** can be moved from unused to used (also applies to newly added values). — WG-new; WG-v2
- API update rules: only **one option deleted per call**; cannot delete an option used by **field updates, record creation, Workflow, Blueprint, ABM mapping, Process Flow**; cannot move to unused an option used by **record creation, Workflow, ABM mapping, Process Flow**; no updates while the set is scheduled for deletion. — https://www.zoho.com/crm/developer/docs/api/v8/update-global-picklist.html
- After a picklist is associated with a global set, the field-level **Replace Values** option is removed from that picklist's settings. — WG-new

## 5. Delete a global set
- Row ellipsis > **Delete**; confirmation lists **associated picklists**; Delete; then OK in "Delete Global Set". — WG-new
- Associated picklists **become local picklists** (keep values). — WG-new; https://help.zoho.com/portal/fr/kb/crm-v2/personnalisation-du-compte-crm/personnalisation-des-champs/articles/utilisation-des-ensembles-globaux
- Precondition: **cannot delete** if associated with more than 15 fields. — WG-new
- API delete is **asynchronous**: returns `SCHEDULED` with `job_id`; set cannot be updated/replaced while scheduled (`NOT_ALLOWED`). — https://www.zoho.com/crm/developer/docs/api/v8/delete-global-picklist.html
- Deleting a set with zero associations: allowed [inferred].

## 6. Associating fields
- Only the **whole set** can be linked to a picklist, not a subset. — OV-v2; OV-new
- Per-layout value subsets: not possible (whole set only) [inferred from above].
- **New picklist**: Layout editor > drag Pick List from New Fields > Pick List Properties > **Global Set** radio > choose set > Done > Save layout. — WG-new
- **Existing local picklist**: Edit Properties > Global Set radio > choose set.
  - If every local value exists in the set → **auto mapped**. — WG-new
  - Otherwise popup **"Associate <Picklist Name> with Global Set"** for **manual mapping**. Mapping is **mandatory** for values used in field updates, workflow rules, criteria, etc.; the **"View associated places"** link lists them; to skip mapping, first remove the value from every place listed. — WG-new
  - **Tracking history is preserved** when an existing picklist is associated. — WG-new
- **Unlink** (global → local): Edit Properties > **Local** radio > Convert (confirm) > Done > Save. — WG-new
- Switch directly from one global set to another: allowed in production [inferred: sandbox note implies it]; **not allowed in Sandbox** (no local→global, global→local, set→set; association fixed at creation). — WG-new
- **Multi-select picklists cannot** be associated (new or existing). — WG-new; ANN
- Field types: only single-select **Pick List** (`data_type: "picklist"`). — https://www.zoho.com/crm/developer/docs/api/v8/create-custom-field.html
- System picklists that **cannot** use a global set: Leads (Lead Status, Salutation); Contacts (Salutation); Deals (Stage); Tasks (Status, Priority); Calls (Outgoing Call Status, Call Type); Quotes (Stage, Carrier); Purchase Orders / Sales Orders / Invoices (Status, Carrier); Vendors (GL Account); Cases (Status); Solutions (Status); Appointments (Appointment Status); Services (Service Status). — WG-new
- Standard picklists such as Lead Source / Industry are not in that list, so they can be linked [inferred]; the field-meta sample shows `Lead_Source` with a `global_picklist` object. — https://www.zoho.com/crm/developer/docs/api/v8/field-meta.html
- Subform picklists: [not documented].

## 7. Where a global set (or global-set field) is used
- "Used in" in UI: list column **modules**, delete confirmation lists **associated picklists**, mapping popup has **View associated places**. — WG-new
- API "Field associations": per field → module, field api_name, **layouts** (name, id, status). — https://www.zoho.com/crm/developer/docs/api/v8/global-picklist-field-association.html
- API "Features association" per value: groups by `type` (samples: `field_update`, `task`) with details of type `Workflow`, `Orchestration` (with transition). Supported modules listed: Leads, Contacts, Accounts, Campaigns, Cases, Invoices, Deals, Price Books, Products, Purchase Orders, Quotes, Sales Orders, Solutions, Vendors, Calls, Tasks, Events, Users, DealHistory, QuotedItems, OrderedItems, PurchaseItems, InvoicedItems, Visits, Services, Appointments, custom modules. — https://www.zoho.com/crm/developer/docs/api/v8/global-picklist-associations.html
- Existing records: rename/replace update records; deleting a value leaves it in records. — WG-new
- Custom views / filters: covered only as "criteria" [not documented by name].
- Workflow criteria & field update actions: updated on rename/replace; mapping mandatory; values used in workflows/field updates cannot be deleted or moved to unused via API. — WG-new; https://www.zoho.com/crm/developer/docs/api/v8/update-global-picklist.html
- Blueprints: option tied to Blueprint cannot be deleted or replaced (API). — https://www.zoho.com/crm/developer/docs/api/v8/update-global-picklist.html; https://www.zoho.com/crm/developer/docs/api/v8/replace-global-picklist-options.html
- Process Flow / Orchestration, record creation actions, task actions, ABM mapping: block delete / move-to-unused (API). — https://www.zoho.com/crm/developer/docs/api/v8/update-global-picklist.html; https://www.zoho.com/crm/developer/docs/api/v8/global-picklist-associations.html
- Field dependency: replaced values are updated in **Field Dependency**. — https://www.zoho.com/crm/developer/docs/api/v8/replace-global-picklist-options.html; KZ161
  - Whether a global-set field can be parent/child: Map Dependency doc does not mention global sets; any single picklist can be parent or child [inferred]. — https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/map-dependency-fields
- Reports & dashboards: "reports" updated on rename/replace. — WG-new; OV-v2. Dashboards: [not documented].
- Assignment rules, validation rules, layout rules, scoring rules, approval processes: [not documented] (likely covered by "criteria" [inferred]).
- Import/export mapping, web forms, mass update, Kanban view, subforms, Canvas, Wizards, portals: [not documented].
- Translation: CRM translation covers picklist values in general (`PicklistValues.<Module>.<Field>.<Value>` keys); global sets are not mentioned. — https://help.zoho.com/portal/en/kb/crm-v2-1/customize-crm-account/translations/articles/crm-v2-translations
- Sandbox: supported with limits (no Convert to Global Set; no change of association; association fixed at creation). — WG-new; WG-v2
- API field metadata: picklist field has `global_picklist` object (`api_name`, `id`) or `null` for local. — https://www.zoho.com/crm/developer/docs/api/v8/field-meta.html

## 8. Limits and editions
- Current table (nextgen overview): — OV-new
  - Professional: 5 sets/org, 5 global picklists per module, 30 associations per set, 1000 used, 500 unused.
  - Enterprise: 30 sets/org, 15 per module, 30 associations per set, 1000 used, 500 unused.
  - Ultimate: 50 sets/org, 15 per module, 30 associations per set, 1000 used, 500 unused.
- Older/classic overview says **Enterprise and Ultimate only** (same 30/50, 15, 30, 1000, 500). Professional row appears only in the nextgen page. — OV-v2; ANN
- Sep 2024 increase (gradual roll-out per data centre). — ANN
- Old 2023 limits (outdated): 10 (Enterprise) / 25 (Ultimate) sets, 15 picklists per set, 1000 values, 7 per module. — ANN-EA
- "More than 15 fields" thresholds for replace/delete/unused moves (see section 4). — WG-new
- Developer edition limits page and CRM for Everyone limits page have no global sets row. — https://www.zoho.com/crm/developer/docs/edition-limits.html
- Free / Standard: not listed as having the feature [inferred from tables].

## 9. Permissions
- Profile permission **Modules Customization** is needed. — OV-v2; OV-new
- API OAuth scopes: `ZohoCRM.settings.global_picklist.READ / CREATE / UPDATE / DELETE / ALL`. — https://www.zoho.com/crm/developer/docs/api/v8/get-global-picklist.html

## 10. Audit log
- Logged events: global set **created**, **updated**, **deleted**; option **renamed** (old → new), **replaced** (old → new), **removed**, **deleted**. Each names the user and the set, e.g. "Y added a Global Set named X", "Y deleted an Option Z in the X Global Set". — WG-new; WG-v2
- Association/unlinking of fields to sets in audit log: [not documented].

## 11. API (v8; introduced in v6 per KZ161)
- Index of endpoints: https://www.zoho.com/crm/developer/docs/api/v8/api-references.html
- **GET** `/crm/v8/settings/global_picklists` and `/settings/global_picklists/{id}`; params `include` = `used_in_modules`, `pick_list_values`, `associated_fields_count`; `include_inner_details` = `used_in_modules.plural_label`. Response: `id, api_name, display_label, actual_label, description, customizable, presence, pick_list_values_sorted_lexically, created_time/by, modified_time/by, used_in_modules, pick_list_values[id, display_value, actual_value, reference_value, sequence_number, type]`. **204** when none exist or invalid ID. — https://www.zoho.com/crm/developer/docs/api/v8/get-global-picklist.html
- **POST** `/settings/global_picklists` (one set per call); body `display_label`*, `description`, `pick_list_values_sorted_lexically`, `pick_list_values`*[`display_value`*, `sequence_number`, `reference_value`, `type`]. Success `SUCCESS` "global picklist added successfully". — https://www.zoho.com/crm/developer/docs/api/v8/create-global-picklists.html
- **PATCH** `/settings/global_picklists/{id}`; add (no id), rename (id + display_value), reorder (sequence_number), unused/used (`type`), delete (`"_delete": null`, one per call). — https://www.zoho.com/crm/developer/docs/api/v8/update-global-picklist.html
- **DELETE** `/settings/global_picklists/{id}` (or `ids` param) → `SCHEDULED` + `job_id`. — https://www.zoho.com/crm/developer/docs/api/v8/delete-global-picklist.html
- **POST** `/settings/global_picklists/{id}/actions/replace_picklist_values` body `replace_picklist_values[{old_value{id|display_value}, new_value{id|display_value}}]` → `SCHEDULED` + `job_id`. (Doc URL template omits "global_picklists/"; sample includes it.) — https://www.zoho.com/crm/developer/docs/api/v8/replace-global-picklist-options.html
- **GET** `/settings/global_picklists/{id}/actions/replaced_values` → `replaced_values[display_value, reference_value]`; 204 if no job. — https://www.zoho.com/crm/developer/docs/api/v8/gpl-replace-status.html
- **GET** `/settings/global_picklists/{id}/actions/pick_list_values_associations?picklist_value_id=` (mandatory) — https://www.zoho.com/crm/developer/docs/api/v8/global-picklist-associations.html
- **GET** `/settings/global_picklists/{id}/actions/associations` (page, per_page max 200, include_inner_details) — https://www.zoho.com/crm/developer/docs/api/v8/global-picklist-field-association.html
- Create field linked to a set: POST `/settings/fields?module=X` with `data_type: "picklist"` and `global_picklist: {"id": ...}`; cannot send both `pick_list_values` and `global_picklist`. — https://www.zoho.com/crm/developer/docs/api/v8/create-custom-field.html; KZ161
- Error codes:
  - `INVALID_DATA` 400 (emoji/null label, over length, bad id, replacing -None-, empty display_value) — create/update/replace/delete pages above
  - `MANDATORY_NOT_FOUND` 400 — create/update
  - `LIMIT_EXCEEDED` 400 (1000 used / 500 unused / edition set count) — create/update/replace
  - `DUPLICATE_DATA` 400 (label or value) — create/update
  - `NOT_ALLOWED` 400 (deletion in progress; Blueprint/ABM-tied option; delete limit) — update/replace/delete/associations
  - `AMBIGUITY_DURING_PROCESSING` 400 (id and display_value do not match; or both picklist values and global set given on field create) — replace; create-custom-field
  - `EXPECTED_FIELD_MISSING` 400 (replace without id/display_value); `EXPECTED_DEPENDENT_FIELD_MISSING` 400 (field create without global_picklist or values); `REQUIRED_PARAM_MISSING` 400 (picklist_value_id)
  - `INVALID_REQUEST_METHOD` 400; `UNABLE_TO_PARSE_DATA_TYPE` 401 (replace); `OAUTH_SCOPE_MISMATCH` 401; `AUTHENTICATION_FAILURE` 401; `INVALID_URL_PATTERN` 404; `INTERNAL_ERROR` 500
- API v2/v3: no global picklist endpoints [inferred: Zoho says the APIs were introduced in v6]. — KZ161
