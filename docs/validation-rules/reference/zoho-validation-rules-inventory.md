# Zoho Validation Rules — feature inventory (CRM + Desk)

Compiled 12 Nov 2026 from public Zoho help, community announcements and API docs only (no sign-in). Every item cites a source. **(inferred)** = my reading, not stated by Zoho. **(community)** = Zoho community forum post, not a KB article; treat as weaker evidence. Where Zoho's own pages conflict, both versions are given.

Main sources (short names used below):

- **[CRM-KB]** Working with Validation Rules (CRM) — https://help.zoho.com/portal/en/kb/crm-v2/customize-crm-account/validation-rules/articles/crm-v2-create-validation-rules (same content at https://help.zoho.com/portal/kb/articles/create-validation-rules, which https://www.zoho.com/crm/help/customization/validation-rules.html redirects to)
- **[CRM-NG]** NextGen UI version — https://help.zoho.com/portal/en/kb/crm-nextgen/customize-crm-account/validation-rules/articles/nextgen-create-validation-rules
- **[CRM-FN]** Validation rules using functions — https://help.zoho.com/portal/en/kb/crm-v2/customize-crm-account/validation-rules/articles/crm-v2-create-validation-rules-using-functions
- **[CRM-EXC]** Validation Rule – Exceptions — https://help.zoho.com/portal/kb/articles/exceptions
- **[CRM-FAQ]** FAQs: Validation Rules — https://help.zoho.com/portal/en/kb/crm-v2/faqs/automation/validation-rules/articles/crm-v2-exist-faqs-validation-rules (also https://help.zoho.com/portal/en/kb/crm/faqs/automation/validation-rules/articles/faqs-validation-rules)
- **[CRM-NEW]** Announcement "Introducing new options for more flexible validation rules in CRM" — https://help.zoho.com/portal/en/community/topic/introducing-new-options-for-more-flexible-validation-rules-in-crm
- **[CRM-ED]** Feature availability & limits — https://www.zoho.com/crm/help/feature-availability.html
- **[CRM-API-INS]** / **[CRM-API-UPD]** / **[CRM-API-UPS]** — https://www.zoho.com/crm/developer/docs/api/v8/insert-records.html , …/update-records.html , …/upsert-records.html
- **[DESK-KB]** Creating Validation Rules (Desk) — https://help.zoho.com/portal/en/kb/desk/for-administrators/customization/articles/creating-validation-rules
- **[DESK-FAQ]** FAQs: Validation Rules (Desk) — https://help.zoho.com/portal/en/kb/desk/faqs/customization/articles/faqs-validation-rules-desk
- **[DESK-ANN]** Announcement "Introducing validation rules" (Desk) — https://help.zoho.com/portal/en/community/topic/introducing-validation-rules
- **[DESK-API]** Desk API reference, section "ValidationRules" — https://desk.zoho.com/DeskAPIDocument#ValidationRules

---

## Part A — Zoho CRM

### A1. Location and permission

- **CRM-1** Menu path: Setup > Customization > Modules and Fields > select the module > **Validation Rules** tab > **Create New Validation Rule**. [CRM-KB]
- **CRM-2** NextGen UI also lets you open it from the sidebar: hover over the module > more (…) icon > **Validation Rules**. [CRM-NG]
- **CRM-3** Permission: profile permission **"Module Customization"** (NextGen page spells it "Modules Customization"). [CRM-KB], [CRM-NG]
- **CRM-4** Team-module admins can create rules for their own team modules. [CRM-NG]
- **CRM-5** Rules cannot be created from the mobile app, but they run there (see CRM-40). [CRM-FN]

### A2. Rule types

- **CRM-6** Two validation types chosen in the Create pop-up: **"Based on Criteria"** (visual criteria builder) and **"Using function"** (Deluge function). [CRM-KB], [CRM-FN]
- **CRM-7** Criteria-based: primary field + primary condition(s) + optional secondary conditions, each with its own error/alert message. [CRM-KB]
- **CRM-8** Function-based: the function receives the record and returns status/message; used for logic the builder can't express or for checks against outside systems (bank, logistics DB, etc.). [CRM-FN]
- **CRM-9** An existing criteria-based rule can be converted to a function-based rule by writing a function. [CRM-FN]
- **CRM-10** Functions for validation are created at Setup > Developer Hub > Functions > + New Function with **Category = "Validation Rule"**; functions from the Functions tab can be associated with a rule, or you can "Write your own" from the rule. [CRM-FN]

### A3. Rule structure (criteria-based)

- **CRM-11** Create pop-up fields: **Layout**, **Field** (the primary field), **Validation type**, **Validate on**; then Next opens the Validation Rule Editor. No separate rule-name field is described. [CRM-KB]
- **CRM-12** Rules are **layout-specific**: the same field can have different rules on different layouts. [CRM-KB], [CRM-NG]
- **CRM-13** Primary conditions are evaluated against the primary field value; "Add another option" adds another primary condition (another value range) with its own messages. [CRM-KB]
- **CRM-14** Secondary conditions: via More > Edit > "Choose based on specific conditions"; they narrow when a primary condition applies, based on other fields (e.g., Region). More criteria added with **+**. [CRM-KB], [CRM-FAQ]
- **CRM-15** One customizable error/alert message per secondary condition. No documented maximum message length. [CRM-NG]
- **CRM-16** **"Execute rule on"** drop-down: "When criteria is met" (condition describes the unwanted value) or the reverse (condition describes the desired value and the alert fires when it is not met). Zoho does not name the second option on the page. [CRM-KB]
- **CRM-17** **"Validate on"**: *Save only* (all rules for the layout run on Save) or *Field verify and save* (a Verify button next to the field runs that field's rule; it runs again on save). Field verify is **not available on Canvas Form View** pages. [CRM-KB], [CRM-NEW]
- **CRM-18** **Validation preference** (per condition, Save-only criteria rules only): *Stop with error* (blocks save; old default) or *Allow by alert* (warning + user confirms, then saves). Rolled out in phases; announcement says released to all DCs 26 Sep 2024. [CRM-KB], [CRM-NEW]
- **CRM-19** **Error location** (per condition, only with Stop with error): *On primary field* (next to the field; old default) or *Top of page* (consolidated at top). Both can be mixed in one rule. [CRM-KB], [CRM-NEW]
- **CRM-20** Function-based rules are not compatible with validation preference or error location. [CRM-NG]
- **CRM-21** Operators: Zoho does not publish a per-type list for CRM. Examples given in docs: "Not between 0 and 15", "> 15%", "less than 15%", character count (exactly 10 digits), starts with (+91), ends with, contains, is empty. [CRM-NG], [CRM-FAQ], blog https://help.zoho.com/portal/en/community/topic/keep-your-crm-data-accurate-with-validation-rules
- **CRM-22** Conditions can be reordered ("Can I reorder conditions? Yes"). [CRM-FAQ]
- **CRM-23** AND/OR pattern between secondary criteria is not stated in the CRM docs. Not documented — check live.
- **CRM-24** Unsupported field types: multi-select lookup, multi-select picklist, multi-user, formula, auto-number, image upload, **multi-line**. Images can instead be checked with Zia Vision. [CRM-KB], [CRM-NG]
- **CRM-25** Lookup fields are supported (added with the 2024 options). [CRM-NEW]
- **CRM-26** Conflict: the FAQ still says "custom-created fields cannot be validated … as of now". The current KB examples use custom fields (Discount, Reference_Number), so this FAQ line is probably out of date **(inferred)**. [CRM-FAQ] vs [CRM-FN]
- **CRM-27** A rule does **not** run if the field is read-only for any user profile. [CRM-FAQ]
- **CRM-28** Community report: for "All Records" a field supports only one condition, and a field already used in one rule cannot get a second rule; CRM has no regex comparator (unlike Desk). **(community)** https://help.zoho.com/portal/en/community/topic/crm-validation-rules-support-only-single-condition

### A4. Limits

- **CRM-29** Per rule: up to **10 primary conditions**, **5 secondary conditions per primary**, **5 criteria per secondary**. [CRM-KB], [CRM-NG]
- **CRM-30** Edition limits (per **layout**): Free – not available; Standard – not available; **Professional 5/layout**; **Enterprise 10/layout (functions: 3/layout)**; **Ultimate 25/layout (functions: 5/layout)**. [CRM-ED]
- **CRM-31** The function KB states Enterprise 3 and Ultimate 5 function-based rules (does not say "per layout"). [CRM-FN]
- **CRM-32** The older trial-edition page words the limits as "5 rules per module / 10 rules per module / 25 rules per layout" (page last updated Feb 2022) — conflicting unit. https://www.zoho.com/crm/help/feature-availability-trial.html
- **CRM-33** CRM Plus: validation rules per layout raised from 10 to 25 (2020). **(community)** https://help.zoho.com/portal/en/community/topic/introducing-increased-feature-limits-for-your-crm-in-zoho-crm-plus-7-5-2020
- **CRM-34** The 2024 options (Field verify, Allow by alert, Error location, lookup support) are **Professional and above**. [CRM-NEW]
- **CRM-35** Message length limit: not documented for CRM.

### A5. When rules run

- **CRM-36** Documented "applies to" list: web **Create**, **Quick create**, **Edit**, **Quick edit (Ajax / inline)**, **Convert (single and mass)**, **Kanban view**, **Copy customization**, **Sandbox**. [CRM-KB], [CRM-NG]
- **CRM-37** "Validation rules are effective when a record is created manually." [CRM-EXC]
- **CRM-38** API: rules run **only if** the request body contains `"apply_feature_execution": [{"name": "criteria_validation_rule"}]` on Insert / Update / Upsert Records. Without it they are not applied **(inferred from wording)**. With it, "the system evaluates all applicable rules". [CRM-API-INS], [CRM-API-UPD], [CRM-API-UPS]
- **CRM-39** The API `trigger` parameter (`workflow`, `approval`, `blueprint`, `pathfinder`, `orchestration`, or `[]`) controls automation only and has nothing to do with validation rules. [CRM-API-INS]
- **CRM-40** Mobile app: validation runs in the Zoho CRM mobile app (stated on the function KB). [CRM-FN]
- **CRM-41** Web forms: records that meet rule criteria are **submitted for manual record approval** rather than rejected. [CRM-KB], [CRM-NG]
- **CRM-42** Field verify and save: works for both criteria and function rules, except on Canvas Form View. [CRM-NEW]
- **CRM-43** Bypassed / overridden (field update wins over the rule; CRM accepts the value): **Import** (new and overwrite), **Workflow** field updates, **Approval process** (approve/reject), **Blueprint** After-Transition field updates, **API** updates (old docs say "updateRecords"), **Webform**. [CRM-EXC], [CRM-KB]
- **CRM-44** **Mass update**: primary fields used in a rule are **not available** in Mass Update. [CRM-EXC]
- **CRM-45** Secondary fields: workflows, mass update, APIs and import accept secondary-field values regardless of the rule. [CRM-EXC]
- **CRM-46** Blueprint conflict: if a Blueprint transition validation and a validation rule target the same field with different conditions, Blueprint wins while the record is in the process; the rule applies again after it exits. [CRM-EXC], [CRM-KB]
- **CRM-47** Not documented either way: merge, clone (record), wizard, client script, subform rows, Blueprint during-transition form. Check live.

### A6. Behaviour on failure

- **CRM-48** Stop with error: save is blocked until the value is fixed. [CRM-KB]
- **CRM-49** Allow by alert: warning shown; user confirms and the record saves. [CRM-KB]
- **CRM-50** All primary conditions are checked when a rule runs, so **several error messages can appear at once**; each Save click runs all layout rules and shows errors across the form. [CRM-KB], [CRM-NEW]
- **CRM-51** Error shown next to the primary field or at the top of the page, per condition setting. With Field verify and save, the error is shown next to the primary field. [CRM-KB]
- **CRM-52** API: several failing rules return **`MULTIPLE_OR_MULTI_ERRORS`** (HTTP 400). No sample payload for a single-rule failure is published. [CRM-API-INS]
- **CRM-53** Function failure causes listed: logic error in code, "Execution timed out"; anything other than the expected return is treated as an error. [CRM-FN]
- **CRM-54** Order of evaluation across rules is not documented. The automation-order FAQ (Assignment > Review > Scoring > Workflow > Approval > Blueprint > Scoring > CommandCenter) does not include validation rules. [CRM-FAQ]

### A7. Rule management

- **CRM-55** Edit: click the rule in the Validation Rules tab, change it, Save. [CRM-KB]
- **CRM-56** Deactivate: toggle **Status** > **Deactivate now**. [CRM-KB]
- **CRM-57** Delete: hover > **Trash** icon > **Yes, Delete**. [CRM-KB]
- **CRM-58** Deleting a field used in a rule: the rule must be deleted first. https://help.zoho.com/portal/en/kb/crm/troubleshooting/articles/troubleshooting-module-customization (search snippet; also [CRM-KB] summary)
- **CRM-59** Rules are carried by **Copy customization** and **Sandbox**. [CRM-KB]
- **CRM-60** Clone, reorder of rules, list columns, search, audit-log entries: not documented.

### A8. Function validation

- **CRM-61** Input: `crmAPIRequest.toMap().get("record")` gives the record map; values arrive in **API format**, keyed by field API name (e.g. `entityMap.get("Reference_Number")`). [CRM-FN]
- **CRM-62** Return: a map with `status` = `"error"` + `message` = alert text on failure, or `status` = `"success"` on pass; sample returns `response.toString()`. [CRM-FN]
- **CRM-63** Any other return value is treated as an error. Zoho advises empty-value checks. [CRM-FN]
- **CRM-64** Only the field types supported by criteria rules can be chosen for function rules. [CRM-FN]
- **CRM-65** Validate on: Save only, or Field verify and save. [CRM-FN]
- **CRM-66** Timeout value: not published (only "Execution timed out" as a failure cause). [CRM-FN]
- **CRM-67** Note: the KB sample's regex branch is inverted (it errors when the value matches). Do not copy it as a test oracle. [CRM-FN]

### A9. API for rule metadata

- **CRM-68** No public CRM API to list/create/update/delete validation rules was found in the v8 docs (searched the v8 docs and the Insert/Update/Upsert pages). Only the runtime switch `criteria_validation_rule` exists. [CRM-API-INS] **(absence = not found, not "Zoho says none")**

### A10. What Zoho CRM does NOT do (do not file as gaps)

- **CRM-69** No validation on multi-select lookup, multi-select picklist, multi-user, formula, auto-number, image upload, multi-line fields. [CRM-KB]
- **CRM-70** No rules on Free/Standard editions. [CRM-ED]
- **CRM-71** Not enforced against import, workflow/approval/blueprint field updates, webform (goes to approval), or API without `criteria_validation_rule`. [CRM-EXC], [CRM-API-INS]
- **CRM-72** No mass update of primary fields. [CRM-EXC]
- **CRM-73** No creating rules from mobile. [CRM-FN]
- **CRM-74** No Allow-by-alert / error location for function rules or for Field-verify rules. [CRM-NG]
- **CRM-75** No regex comparator in CRM criteria rules **(community)** — CRM-28.

---

## Part B — Zoho Desk

### B1. Location and permission

- **DESK-1** Menu path: Setup > Customization > **Layouts and Fields** > **Validation Rules**; pick the **module** and, if several, the **department** at the top. [DESK-KB]
- **DESK-2** Permission conflict: the current KB says "users with the **Support Administrative** permission"; earlier text/search snippet says profile permission **"Manage Layouts and Fields"**. Check live. [DESK-KB]
- **DESK-3** Edition: the 2018-era announcement says **Enterprise only** (beta). The current pricing page does not list the feature. [DESK-ANN], https://www.zoho.com/desk/pricing.html

### B2. Rule types

- **DESK-4** One type only: criteria-based rule on a primary field with optional secondary conditions. No function-based validation documented. [DESK-KB], [DESK-FAQ]

### B3. Rule structure

- **DESK-5** Rules are **department-specific** and **layout-specific**: same field can have different rules per department/layout. [DESK-KB], [DESK-FAQ]
- **DESK-6** Create flow: Create Rule > choose **layout** and **field** (primary field) > Add Option (primary condition) > Next > alert message > optional secondary conditions (Edit / + icons) > optional **Add another option** > optional **Apply to Help Center** > Save. [DESK-FAQ], [DESK-KB]
- **DESK-7** API shape adds `name` and `description` for the rule (UI help does not describe a name field). [DESK-API]
- **DESK-8** **Only one rule per primary field** ("Can I create more than one rule for the same primary field? No"). [DESK-FAQ]
- **DESK-9** A rule validates one primary field but can depend on other fields' values. [DESK-FAQ]
- **DESK-10** Condition kinds described in help: must be filled, must not contain an expression, min/max length, starts/ends with, not empty. [DESK-KB]
- **DESK-11** Regex comparators: **Matches Regex**, **Not Matches Regex**, **Contains Regex**, with a regex gallery (e.g. "Numbers Only") and a **Custom Pattern** box. Regex is supported **only in the primary condition**. [DESK-FAQ]
- **DESK-12** Operators per type (API): text/picklist/lookup — is, isn't, starts with, contains, doesn't contain, ends with, is empty, is not empty; date — is, isn't, is after, is before, is empty, is not empty; dateTime — date set + between, not between; integer/currency — =, <>, <, <=, >, >=, is empty, is not empty; boolean — is. Status field also has "is OPEN" / "is CLOSED". [DESK-API]
- **DESK-13** Predefined value tokens: `${EMPTY}`, `${NOTEMPTY}`, `${OPEN}`, `${CLOSED}`, `${CURRENTTIME}` (dateTime), `${CUSTOM}`. [DESK-API]
- **DESK-14** Conflict: FAQ says relative dates (current date) are **not supported**; API lists `${CURRENTTIME}` for dateTime. Check live. [DESK-FAQ] vs [DESK-API]
- **DESK-15** Lookup conditions take the related record's **display name**, not ID. [DESK-API]
- **DESK-16** Criteria pattern (API): each `fieldConditions[]` branch has a `pattern` such as `(1 and 2)` or `(1 and (2 or 3))`; condition 1 must be the primary field and must be **ANDed at the root**; root OR like `(1 or 2)` is invalid — use separate branches. [DESK-API]
- **DESK-17** Each branch has its own alert (`actions.alert`); one alert per secondary condition. [DESK-API], [DESK-FAQ]
- **DESK-18** Alert message max **150 characters**. [DESK-FAQ]
- **DESK-19** Criteria value max **1,000 characters** (free-text values). [DESK-FAQ]
- **DESK-20** Apply to Help Center checkbox = API `executeInHelpCentre`. Primary field must be visible in the Help Center for it to work. [DESK-KB], [DESK-API]

### B4. Limits

- **DESK-21** **50 rules per department**; **10 parent (primary) conditions per rule**; **5 secondary conditions per parent**; **5 criteria per secondary**. [DESK-KB], [DESK-FAQ]
- **DESK-22** API list page size 1–50 (default 50). [DESK-API]
- **DESK-23** Per-edition counts: not published. [DESK-ANN]

### B5. When rules run

- **DESK-24** Agent interface forms ("agent portals"); form can be submitted only after all criteria are met. [DESK-ANN]
- **DESK-25** Help Center ticket submission only when **Apply to Help Center** is ticked. [DESK-KB], [DESK-FAQ]
- **DESK-26** Overridden (later update wins over the rule): **Import** (new or overwrite), **Workflow rules**, **Blueprint** After-Transition, **APIs**, **Web forms**. [DESK-KB]
- **DESK-27** **Mass update not allowed** for primary fields (rules are layout-specific; one mass update can span layouts). [DESK-KB], [DESK-FAQ]
- **DESK-28** Community report: on edit, Desk validates **all** rule fields, including untouched ones (unlike CRM), so old records that break a new rule block unrelated edits. **(community)** https://help.zoho.com/portal/ja/community/topic/validation-rules-trigger-on-untouched-fields
- **DESK-29** Modules covered by the API: tickets, contacts, accounts, tasks, timeEntry, contracts, products, calls, events, and custom modules. [DESK-API]
- **DESK-30** Not documented: inline edit in list/detail, email/social/chat channels, mobile apps, Blueprint during-transition, merge, clone, ticket split. Check live.

### B6. Behaviour on failure

- **DESK-31** Alert message shown; record not saved until fixed. [DESK-KB], [DESK-ANN]
- **DESK-32** Rules run **in the order they were created**. [DESK-KB]
- **DESK-33** Where the message appears (near field vs popup), and single vs multiple errors: not documented.
- **DESK-34** For a plain "required" check, Zoho tells you to use **Mark as required** instead of a rule. [DESK-KB]

### B7. Rule management

- **DESK-35** Deactivate: toggle OFF > **Deactivate**; shows as **Inactive**; can be reactivated. [DESK-KB]
- **DESK-36** Delete: hover > Delete icon > **Yes, Delete**; permanent; criteria and alert removed. [DESK-KB], [DESK-FAQ]
- **DESK-37** Filter list by layout via **All Layouts** drop-down. [DESK-FAQ]
- **DESK-38** Removing a primary field from a layout: system prompts to disassociate rules; confirming **disables** the rule; field moves to unused fields. [DESK-FAQ]
- **DESK-39** Deleting a field used in a rule: delete the rule first. [DESK-KB]
- **DESK-40** Custom field criteria references API includes `ValidationRules` as a feature type (shows where a field is used). [DESK-API]
- **DESK-41** Sandbox changesets include "Validation Rules" as an entity type. [DESK-API]
- **DESK-42** Edit, clone, reorder, audit log: not documented in help.

### B8. API (Desk)

- **DESK-43** `GET /api/v1/validationRules` — params `departmentId`, `layoutId`, `module`, `activeLayouts`, `activeRules`, `from`, `limit` (1–50), `searchString`, `executeInHelpCentre`, `include` (creator, modifier). Scope `Desk.layouts.READ`. [DESK-API]
- **DESK-44** `GET /api/v1/layouts/{layout_id}/validationRules/{validationRule_id}` — scope `Desk.layouts.READ`. [DESK-API]
- **DESK-45** `POST /api/v1/layouts/{layout_id}/validationRules` — required `fieldName` (≤255), `fieldConditions`; optional `displayLabel` (≤250), `status` (`active`/`deactive`), `executeInHelpCentre`, `name`, `description`. Scope `Desk.layouts.CREATE`. [DESK-API]
- **DESK-46** `PATCH /api/v1/layouts/{layout_id}/validationRules/{validationRule_id}` — scope `Desk.layouts.UPDATE`. [DESK-API]
- **DESK-47** `DELETE /api/v1/layouts/{layout_id}/validationRules/{validationRule_id}` — returns 200; scope `Desk.layouts.DELETE`. [DESK-API]
- **DESK-48** `GET /api/v1/layouts/{layout_id}/validationRules/criteriaFields?category=primary|secondary` — fields, allowed operators and tokens. [DESK-API]
- **DESK-49** Response object: `id`, `name`, `description`, `fieldName`, `displayLabel`, `layoutId`, `status`, `executeInHelpCentre`, `systemGenerated`, `fieldConditions[{name, pattern, conditions[{fieldName, condition, value[], displayValue[], displayLabel}], actions{alert}}]`, `createdBy`, `createdTime`, `modifiedBy`, `modifiedTime`. [DESK-API]
- **DESK-50** Note a third-party mirror lists scope `Desk.settings.READ`; the official doc says `Desk.layouts.*`. Use the official one. https://developers.qodex.ai/zoho-desk/zoho-desk-api/validationrules/get-layout-validation-rules-for-department-or-layout

### B9. What Zoho Desk does NOT do

- **DESK-51** No second rule on the same primary field. [DESK-FAQ]
- **DESK-52** No regex in secondary conditions. [DESK-FAQ]
- **DESK-53** No relative dates (per FAQ; see DESK-14). [DESK-FAQ]
- **DESK-54** No mass update of primary fields. [DESK-FAQ]
- **DESK-55** No enforcement against import, workflow, Blueprint after-transition, API updates, web forms. [DESK-KB]
- **DESK-56** No function-based validation and no "allow by alert" option documented **(inferred from absence)**.

---

## Differences between Zoho CRM and Zoho Desk

1. Scope: CRM = per layout; Desk = per department **and** layout.
2. Types: CRM has criteria + Deluge function rules; Desk has criteria only.
3. Regex: Desk has Matches / Not Matches / Contains Regex (primary only); CRM has none (community).
4. Soft rules: CRM has Allow by alert + error location + Field verify; Desk has none documented.
5. Help Center: Desk has "Apply to Help Center"; CRM webform records meeting criteria go to approval.
6. Limits: CRM 5/10/25 per layout by edition (Professional+); Desk 50 per department (Enterprise per 2018 note). Condition limits are the same (10 / 5 / 5).
7. Message length: Desk 150 chars; CRM undocumented.
8. One rule per field: stated for Desk; CRM only per community post.
9. API: CRM has only a runtime switch (`criteria_validation_rule`); Desk has full CRUD + criteria-fields API but nothing documented on runtime enforcement over the ticket API (listed as overridden).
10. Field types: CRM excludes multi-line, multi-select, formula, auto-number, image, multi-user; Desk API lists text, date, dateTime, boolean, lookup, integer, currency.
11. Untouched fields: Desk reportedly re-validates all rule fields on edit; CRM reportedly only changed ones (community).
12. Order: Desk = creation order; CRM = not documented.

## Open questions the docs do not answer (check live)

1. CRM: exact operator list per field type, and AND/OR logic between secondary criteria.
2. CRM: is it really one rule per field per layout? Can a field be in two rules?
3. CRM: alert message max length; does the FAQ "custom fields cannot be validated" still hold?
4. CRM: order of evaluation across several rules; are all rules' errors shown together or first only?
5. CRM: does validation run on record clone, merge, wizards, Blueprint during-transition form, subform fields, mobile Quick Create?
6. CRM: exact API error JSON for a single failing rule with `criteria_validation_rule` (code, `details`, field name).
7. CRM: function timeout in seconds; is `failure` accepted besides `error`?
8. CRM: audit log entries for create/edit/delete/toggle of a rule; can rules be cloned or reordered?
9. CRM: what happens to a rule when a picklist option used in it is renamed/removed?
10. Desk: actual permission name (Support Administrative vs Manage Layouts and Fields) and current edition availability.
11. Desk: error display — inline near field or popup; one error or all at once?
12. Desk: inline edit in ticket list / detail, email-to-ticket, chat/social channels, mobile app, Blueprint during-transition — enforced or not?
13. Desk: is `${CURRENTTIME}` usable in the UI even though the FAQ says no relative dates?
14. Desk: can a rule be edited in place, cloned, reordered? Does the list show rule name/status/creator?
15. Desk: does the ticket API (POST/PATCH tickets) reject values that fail a rule, or does it always override as the KB says?
16. Desk: what happens to a rule when its picklist value or secondary field is deleted?
17. Both: behaviour when the primary field is hidden by a layout rule or not on the form.
