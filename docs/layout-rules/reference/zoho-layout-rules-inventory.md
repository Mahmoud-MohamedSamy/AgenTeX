# Zoho Layout Rules: feature inventory (CRM and Desk)

Compiled 12 Nov 2026 from public Zoho help pages, Zoho community announcements and Kaizen developer posts, Zoho API docs, and the Zoho comparison page. Nobody signed in to Zoho.
How to read the tags:
- **(doc)**: stated in an official Zoho help, API or pricing page.
- **(community)**: stated in a Zoho-authored community announcement or Kaizen post on help.zoho.com.
- **(mirror)**: comes from a third-party copy of Zoho's API spec (apis.io). The official Desk API page (desk.zoho.com/DeskAPIDocument) is too large to fetch; it is over 10 MB.
- **(inferred)**: my own reasoning, not stated by any source.
- **(not documented)**: no source I found covers it. Check it in a live Zoho org.

Main sources:
- CRM-H1: https://help.zoho.com/portal/en/kb/crm/customize-crm-account/layout-rules/articles/configuring-layouts-rules
- CRM-H2: https://help.zoho.com/portal/en/kb/crm/customize-crm-account/layout-rules/articles/use-cases-28-8-2026
- CRM-C1: https://help.zoho.com/portal/en/community/topic/zoho-crm-layout-rules-nine-new-actions-profile-based-execution-and-interactive-preview
- CRM-K63: https://help.zoho.com/portal/en/community/topic/kaizen-63-layout-rules-in-zoho-crm (Kaizen #63, about Dec 2022)
- CRM-API: https://www.zoho.com/crm/developer/docs/api/v8/insert-records.html
- CRM-LAY: https://www.zoho.com/crm/developer/docs/api/v8/layouts-meta.html
- CRM-CMP: https://www.zoho.com/crm/comparison.html
- DESK-H1: https://help.zoho.com/portal/kb/articles/creating-layout-rules-in-zoho-desk ("Understanding Layouts and Layout Rules")
- DESK-H2: https://help.zoho.com/portal/kb/articles/customizing-help-desk-layouts
- DESK-MOB: https://help.zoho.com/portal/en/community/topic/layout-rules-is-now-supported-in-zoho-desk-mobile-app
- DESK-API: https://apis.io/apis/zoho/zoho-layoutrules-api/ and https://artifacts.apis.io/zoho/openapi/zoho-layoutrules-api-openapi.yml (mirror of the official spec)

---

## Part A: Zoho CRM

### A1. Where it lives, scope and prerequisites
1. Path 1: the module's **more icon (...)** in the sidebar, then **Layout Rules**. (doc) CRM-H1
2. Path 2: **Setup > Customization > Modules and Fields**, then the module, then the layout, then the **Layout Rules** section, then **New Layout Rule**. (doc) CRM-H1
3. Each rule belongs to one **layout** of one module. The limit is counted per layout (10 per layout). (doc) CRM-H1, CRM-CMP
4. Supported modules: any module that has layouts. The examples use Loan Applications (a custom module), Deals (stage, pipeline) and Tasks (closure). No official list says which modules are excluded. (doc for the examples, inferred for "any module") CRM-H1
5. Permission: "Customize Zoho CRM" (Kaizen) or "Manage Customization" / module customization (help). (doc) CRM-H2; (community) CRM-K63
6. Editions: the comparison page lists **Layout rules: Free -, Standard -, Professional -, Enterprise 10/layout, Ultimate 10/layout**. (doc) CRM-CMP. **Conflict:** the Use Cases article says Professional, Enterprise and Ultimate. (doc) CRM-H2. The "nine new actions" post says Enterprise and Ultimate. (community) CRM-C1. Treat it as Enterprise and above, and check whether Professional has it.
7. Page layouts per edition: Enterprise 3 per module, Ultimate 6 per module, Free/Standard/Professional not available. The Activities module is excluded from this count. (doc) CRM-CMP
8. The **Show Subforms** action appears only when the layout contains a subform. (doc) CRM-H1
9. Rules are created only in the web app. The mobile app shows which rules apply but cannot create them. (doc, from a search snippet of the Android help page) https://help.zoho.com/portal/en/kb/crm/crm-mobile/android/customization/articles/customizing-in-zoho-crm-android-app (the page returned 404 when fetched)

### A2. Rule structure
10. Create pop-up fields: **Rule name**, **Description**, **Primary field**, and the **initiating condition** on the primary field. **Next** opens the rule editor with that condition filled in. (doc) CRM-H1
11. Rule editor layout: **parent conditions**, each with **branch conditions**, each with **branch criteria**. Every condition triggers one or more actions through "Trigger an action". (doc) CRM-H1
12. Primary field cannot be: the **Record Owner** field or a **multi-select picklist**. (doc) CRM-H1; (community) CRM-K63
13. Field types that cannot be used in layout rules at all: **Auto Number, Lookup, Multi-Select Lookup, User Lookup, Formula, File Upload, Multi Line**. (doc) CRM-H1; (community) CRM-K63
14. Operators: **is, isn't, contains, doesn't contain, starts with, ends with, is empty, is not empty**. (community) CRM-K63. The help page shows only "is". The operator list for each field type (number, date, boolean) is not documented. (not documented)
15. Up to **5 criteria per condition**, joined with **AND or OR**. The primary field can appear in only **one** criterion, and that criterion can only be joined with **AND**. (community) CRM-K63
16. Limits: **25 parent conditions** per rule, **5 branch conditions** per parent condition, **5 criteria** per branch condition, **40 actions** per branch condition. (doc) CRM-H1
17. A field that is the primary field of one rule **cannot be the primary field of another rule**. It can still appear in another rule's Show Field or Set Mandatory action. (community) CRM-K63
18. The primary field can also be a target of **Show Fields** or **Set Mandatory Fields** in the same rule. Example: the "Vehicle Insurance" rule makes the "Type of Vehicle" primary field mandatory. (doc) CRM-H1
19. There is no explicit **Else / Otherwise** branch. A "show" target stays hidden whenever no condition that shows it is true. (doc) CRM-H1
20. Any-value or wildcard conditions are covered by "is not empty" and "is empty". (community) CRM-K63

### A3. Actions (12 in total today)
Field actions:
21. **Show Fields**: the targets are visible only while the condition is true. (doc) CRM-H1
22. **Set Mandatory Fields**: the targets are required only while the condition is true. (doc) CRM-H1
23. **Show Picklist Values**: limits the options a picklist or multi-select picklist shows. Options not set up in the action always show. (doc) CRM-H1
24. **Set Read Only Fields**: locks the targets while the condition is true. (doc) CRM-H1
25. **Set Field Value**: fills in a value automatically. The user can change it or use **Reset Value**, and the system does not apply it again until the condition changes and matches again. (doc) CRM-H1
26. **Recommend Field Value**: suggests a value in a message. If the user ignores it (Not Accepted or Canceled), an icon stays next to the field. (doc) CRM-H1
27. **Show Message**: shows a contextual message for a field. (doc) CRM-H1

Other actions:
28. **Show Sections**. (doc) CRM-H1
29. **Show Subforms**. (doc) CRM-H1
30. **Show Related Lists**: integration related lists are not supported. (doc) CRM-H1
31. **Show Buttons**: custom buttons only, on the Create/Clone, Edit and Details pages. (doc) CRM-H1
32. **Show Links**. (doc) CRM-H1
33. **Verify Fields**: asks the user to confirm key fields before continuing. The verification order can be set. (doc) CRM-H1
34. There is **no Hide action**. Every "Show" action means hidden unless the condition is true. (doc) CRM-H1. The community reports a "Show or Hide, only one type per field" message, but that is about web form rules, not layout rules (see A8).
35. **Profile-based execution**: each action can be limited to selected profiles. This is supported for Show Fields, Show Picklist Values, Set Read Only, Recommend Value, Show Message, Show Subforms, Show Sections, Show Related Lists, Show Buttons and Show Links. It is **not** listed for Set Mandatory, Set Field Value or Verify Fields. For Show actions, the target appears only for the selected profiles. For Set Read Only, the selected profiles keep the field editable. (doc) CRM-H1; (community) CRM-C1
36. **Interactive Preview**: available after a rule is saved. A left panel lists the conditions. Choosing a condition highlights the fields, sections and subforms that become shown, hidden, read-only or mandatory, and you can switch profiles. (doc) CRM-H1; (community) CRM-C1
37. Values of fields hidden by a rule: whether they are cleared or kept on save is **not documented**. Through the API, values **can be written to hidden fields**, and Get Records returns all layout fields regardless of show rules. (community) CRM-K63
38. A **mandatory field that Set Read-Only locks while empty** is unlocked on save, and the user is asked for a value. (doc) CRM-H1
39. Set Value and Recommend Value calculations for date and date-time fields use the **org time zone** and can be based on other date fields. Currency values are entered in **home currency** and converted at the record's exchange rate. (doc) CRM-H1
40. At most **5 multi-line (small) fields** across Set Value and Recommend Value combined. (doc) CRM-H1. This conflicts with item 13, which bans Multi Line fields in general.

### A4. Execution
41. Runs on the **Create, Edit and View** pages. (doc) CRM-H1
42. Also runs on **Details-page edits**, **Blueprint**, **Pipeline view** (deal stage), **Kanban** (including drag-and-drop), **task closure** (Activities related list, Kanban, Home page, custom views) and **record approval**. (doc) CRM-H1
43. Does **not** run on **Import**, **Web forms** or **Lead Convert**. (doc) CRM-H1; (community) CRM-K63
44. Set Value, Recommend Value and Verify Fields run only when **a user** makes the condition true in the UI. They do not run after a workflow field update or an import. (doc) CRM-H1
45. **API**: only **Set Mandatory Fields** is enforced, and only on Insert, Update or Upsert when the request sends `apply_feature_execution:[{"name":"layout_rules"}]` together with a `Layout` id. Show and hide rules are not enforced. (doc) CRM-API; (community) CRM-K63. Without that key, the "bypass" table in the help page applies: updateRecords does not enforce rule-mandated fields. (doc) CRM-H1
46. Bypass table: **Import** and **Workflow rules** do not enforce rule-mandated fields. **Mass update** leaves out primary fields that drive Set Mandatory. **Macro** does not list primary fields, so they cannot be updated through a macro. (doc) CRM-H1
47. **Blueprint transition form**: only **Set Mandatory Fields** runs there. (doc) CRM-H1
48. Pop-ups:
    - Editing a primary field on the Details page opens a **Review Details** pop-up for Set Mandatory, Set Value and Recommend targets. Verify Fields pop-ups come after it.
    - Changing a deal **Stage** from Details, Blueprint or Pipeline captures rule-mandated fields in a pop-up.
    - **Closing a task** asks for the mandated fields first. (doc) CRM-H1
49. Recommend and Verify pop-ups work **per org**. Once one user accepts, cancels or sees one, other users do not see it again. All Verify Fields appear in one pop-up, and changes made inside it do not trigger Verify Fields again. (doc) CRM-H1
50. Order of execution:
    - When several conditions in a rule set the same field (Set Value, Recommend or Message), the **topmost matching condition wins**.
    - **Set Value always runs last**, and only on fields and picklist values that are visible at that moment.
    - Set Value can update a read-only field. Recommendations are not shown on read-only fields. (doc) CRM-H1
51. Picklist filtering order: first **Map Dependency**, then **Show Picklist Values**. (doc) CRM-H1
52. Set Read-Only works only on pages where layout rules run. **Mass Update, Import, automation, APIs and integrations** can still change the field. In Kanban, if the categorisation field is locked, the card **cannot be moved** to another column. (doc) CRM-H1
53. Order between several rules on one layout, and how conflicts between rules resolve: **not documented**. Item 17 (one primary field per rule) avoids most conflicts. (inferred)
54. Mobile app enforcement of the newer actions, Quick Create, inline list edit and Canvas: **not documented**. A community question about Quick Create has no Zoho answer: https://help.zoho.com/portal/en/community/topic/layout-rules-quick-create
55. Interaction with **field-level permissions**: Set Value can write to permission read-only fields. For Show actions, profile-based execution overlaps with field permissions. Fields the user cannot see stay hidden. (doc for the first point, CRM-H1; inferred for the rest)
56. Interaction with **Validation rules**: no ordering is documented. Validation rules run at save time, in creation order. (doc) https://www.zoho.com/crm/help/customization/validation-rules.html

### A5. Management
57. Limits: **10 rules per layout**, 25 parent conditions, 5 branch conditions per parent, 5 criteria per branch, 40 actions per branch. (doc) CRM-H1, CRM-CMP
58. Rules created by an **extension**: admins can view them and change their status, but **cannot edit or delete** them. (doc) CRM-H1
59. Rule **status** (active or inactive) exists, as the extension note shows. The list page columns, clone, reorder and search are **not documented**.
60. Limits on name and description length: **not documented**.
61. Limits per edition: only Enterprise and Ultimate have a row (10 per layout each). Free, Standard and Professional show "-". (doc) CRM-CMP. See item 6 for the conflict.
62. Map dependency availability by edition is not on the comparison page. Validation rules: Professional 5 per layout, Enterprise 10 per layout (3 when functions are used), Ultimate 25 per layout (5 when functions are used). (doc) CRM-CMP

### A6. Validation and errors during setup
63. The same field cannot be both **Mandatory and Read-Only** for the same condition. (doc) CRM-H1
64. The same field cannot be both **Set Value and Recommend Value** for the same condition. (doc) CRM-H1
65. **Unique** fields cannot be Set Value or Recommend targets, and a field used there cannot later be marked unique. (doc) CRM-H1
66. The primary field cannot be Owner or a multi-select picklist. Banned field types are listed in item 13. (doc) CRM-H1
67. A primary field cannot be reused as another rule's primary field. (community) CRM-K63
68. The primary field can be in only one criterion, joined with AND. (community) CRM-K63
69. The limit counts in item 57 are enforced. The exact error messages are not documented.
70. Deleting a field used in a rule, or removing it from the layout: **not documented** for CRM. Desk blocks it (see B6). (not documented)
71. Show Subforms needs a subform on the layout. Show Buttons needs custom buttons. (doc) CRM-H1

### A7. API
72. No public endpoint to read or write CRM layout rules was found in the v8 API docs. The Layouts metadata API (`GET /settings/layouts`, `GET /settings/layouts/{id}`) does **not** return layout rules. (doc) CRM-LAY
73. Record APIs (Insert, Update, Upsert, v2 and later) accept `apply_feature_execution: [{"name":"layout_rules"}]`, and also `criteria_validation_rule`. Only Set Mandatory is enforced this way. (doc) CRM-API
74. Error when a rule-mandated field is missing: HTTP 400 `MANDATORY_NOT_FOUND`, with `details.layout_rule {name,id}` and `details.api_name`. (doc) CRM-API; (community) CRM-K63
75. If a `Layout` id is sent, the layout's mandatory fields are checked and only that layout's fields are processed. Without one, the **standard layout** is used. (doc) CRM-API; (community) CRM-K63
76. Audit log and webhook entries for layout rule changes: **not documented**. They probably appear under Setup audit log > Customization. (inferred)

### A8. Related features that are NOT layout rules (CRM)
77. **Validation rules**: per layout, run at save, show an error. They are a separate tab, have their own limits, and Blueprint overrides them. Field types they cannot use: multi-select lookup, multi-picklist, formula, auto-number, multi-line. https://www.zoho.com/crm/help/customization/validation-rules.html
78. **Map Dependency Fields**: parent and child option mapping per layout, for picklist, multi-select picklist and radio fields. A multi-select picklist can only be a child. Found at Setup > Modules and Fields > module > Map Dependency Fields. It runs **before** Show Picklist Values. https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/map-dependency-fields
79. **Web form / Form Rules**: conditions on web forms are a separate feature, and layout rules do not run on web forms (item 43). The "Introducing Form Rules" post is about Webforms and the Candidate Application Form, which suggests Zoho Recruit. (community) https://help.zoho.com/portal/en/community/topic/introducing-form-rules-28-1-2025
80. **Blueprint**: transition forms have their own mandatory fields and validations. Inside a transition, only Set Mandatory from layout rules runs (item 47).
81. **Field-level security and profiles**, **page layouts assigned to profiles**: these are separate settings. Layout rules work on top of them.

---

## Part B: Zoho Desk

### B1. Where it lives, scope and prerequisites
1. Path: **Setup**, then **Customization > Layouts and Fields > Layout Rules**, then choose the **module** and, if there is more than one, the **department**. (doc) DESK-H1; (community) DESK-MOB
2. Scope: rules are **department-specific**, so the same field can have different rules in different departments. Each rule belongs to a **layout** (the API create path is `/layouts/{layoutId}/layoutRules`). (doc) DESK-H1, DESK-H2; (mirror) DESK-API
3. Modules: the help page shows Tickets only. The API `module` enum for listing rules is `tickets, contacts, accounts, tasks, calls, events, timeEntry, products`. The description also mentions `contracts`, but the enum does not include it. (mirror) DESK-API. Contracts does not support multiple layouts. (doc) DESK-H2. Custom modules: **not documented**.
4. Permission: **Manage Layouts and Fields** in the profile. Only departments the user belongs to appear in the pickers. (doc) DESK-H1
5. Edition: **Enterprise only**. (community) DESK-MOB. The pricing page does not mention layout rules. https://www.zoho.com/desk/pricing.html
6. Layout facts that affect rules:
    - Each module in each department has a **Standard Layout**. It cannot be deleted or deactivated, but another layout can be made the default.
    - Limits: up to **20 active layouts per department** for Tickets, Activities and Time Entries; 20 per org for Accounts, Contacts and Products; **400 fields per layout**.
    - **Deleting a layout deletes its layout rules** (and its blueprints, workflows, web forms, validation rules, templates and field dependencies). (doc) DESK-H1, DESK-H2

### B2. Rule structure
7. Create form fields: **Name, Description, Primary field, Condition**, then **Next**, then the rule editor. (doc) DESK-H1
8. Primary field cannot be: **Record Owner, multi-select picklist, multi-line**. **Department Name, Description and Resolution** cannot be used in rules at all. (doc) DESK-H1, DESK-H2. **Conflict:** the layouts section says a multi-select picklist can be picked when creating a rule. (doc) DESK-H1
9. Operators: the examples show **"is"**. The help page also lists the regex criteria **Matches Regex, Not Matches Regex and Contains Regex**. A full list for each field type is **not documented**. (doc) DESK-H1, DESK-H2
10. The structure has parent conditions, branch conditions and criteria. The API's `fieldConditions[]` items carry `name`, `pattern` (custom logic such as `(1and2)or3` or `1 and (2 or 3)`), `conditions[] {fieldName, condition, value[]}` and `actions`. This means **AND/OR with a custom criteria pattern** is supported. (mirror) DESK-API
11. Limits: **25 parent conditions** per rule, **5 branch conditions** per parent, **5 criteria** per branch, **25 actions** per branch (CRM allows 40). (doc) DESK-H1, DESK-H2
12. Else branch or "Any value" option: **not documented**.

### B3. Actions (3 only)
13. **Show Fields**, **Show Sections** and **Set Mandatory Fields** are the only actions. (doc) DESK-H1, DESK-H2; (community) DESK-MOB. The API `actions` keys match: `showFields[]`, `showSections[]`, `setMandatoryFields[]`. (mirror) DESK-API
14. There is **no** Show Picklist Values, Read-only, Set Value, Message or Hide action in Desk. Those exist only in CRM. (doc, by omission) DESK-H1
15. Hidden behaviour: fields and sections controlled by a rule stay hidden until the condition is met, even though they are in the layout. (doc) DESK-H1. Whether values in hidden fields are kept or cleared is **not documented**.
16. Making a field mandatory needs **Read and Write** access for every profile that can see the field. This is a layout rule, and probably also applies to rule-mandated fields. (doc for layouts, inferred for rules) DESK-H2

### B4. Execution
17. Runs only when **users create or edit a record manually** (the agent UI). (doc) DESK-H1
18. Does **not** run on **Import**, **Web forms** or the **API**. (doc) DESK-H1, DESK-H2
19. **Help Center**: an **"Apply to Help Center"** checkbox on the rule (API `executeInHelpCentre`) runs the rule on tickets submitted in the Help Center. The primary field must be **visible in the Help Center**. Only **ticket** layouts can be shown in the Help Center ("Display in Help Center"). (doc) DESK-H1, DESK-H2; (mirror) DESK-API
20. **Mobile app**: supported, with Show Fields, Show Sections and Set Mandatory. Rules are created only on desktop, and the app needs **Settings > Refresh Portal Metadata** to pick up changes. (community) DESK-MOB
21. **Mass actions**: a rule's primary field cannot be updated through Mass Actions. (doc) DESK-H1, DESK-H2
22. Blueprint transitions, inline edit, and the order between rules: **not documented**.
23. Conflicts: a field already used in one rule's action **cannot be added to another rule**. Rules therefore do not overlap on targets. (doc) DESK-H1, DESK-H2
24. Interaction with field permissions: see item 16. Interaction with validation rules: they are separate, validation rules run in the order they were created, and Desk validation rules can be overwritten by import, workflow, Blueprint, API and web forms. (doc) https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/creating-validation-rules

### B5. Management
25. **Create** a rule. **Rename** it or edit the description from the More icon. **Activate or deactivate** with a toggle (with a confirm step; the rule then shows as Inactive). **Delete** from More, with a confirm step; deletion is permanent. (doc) DESK-H1
26. Limits:
    - **10 rules per layout**.
    - **50 rules per department**, with at most **20 active** at once.
    - The mobile post says "max 10 per department", which is older wording. (doc) DESK-H1; (community) DESK-MOB
27. Name up to **100** characters. Description up to **65535** characters. Display label up to **200**. (mirror) DESK-API
28. List filters available in the API: `searchString` (up to 100 characters), `activeRules`, `executeInHelpCentre`, `layoutId`, and paging with `from` and `limit` (default 50). This suggests the UI list has **search**, an **active filter** and a **help-center filter**. (mirror) DESK-API; UI use is inferred.
29. `systemGenerated` flag: some rules are created by the system. (mirror) DESK-API
30. Clone, reorder and the list page columns: **not documented**.
31. Limits by edition: **Enterprise only** (item 5). There is no rule row for Free, Standard or Professional.

### B6. Validation and errors during setup
32. Primary field type restrictions are listed in item 8. (doc) DESK-H1
33. A field that is already an action target in another rule is **rejected**. (doc) DESK-H1
34. The rule limits in items 11 and 26 are enforced. (doc) DESK-H1
35. For Help Center rules, the primary field must be visible in the Help Center. (doc) DESK-H1
36. Deleting a field that a **validation rule** uses requires deleting that rule first. The same probably applies to layout rules. (doc for validation rules, inferred for layout rules)
37. The API returns **422** `invalidDataErrorResponse` on bad create or update data. (mirror) DESK-API

### B7. API (Desk v1)
38. `GET /api/v1/layoutRules?departmentId&module[&layoutId&searchString&activeRules&executeInHelpCentre&from&limit]`. Scope `Desk.settings.READ`. (mirror) DESK-API
39. `GET /api/v1/layouts/{layoutId}/layoutRules/{layoutRuleId}`. Scope `Desk.settings.READ`.
40. `POST /api/v1/layouts/{layoutId}/layoutRules`. Required fields: `name, description, fieldName, fieldConditions, layoutId`. Scope `Desk.settings.CREATE`.
41. `PATCH /api/v1/layouts/{layoutId}/layoutRules/{layoutRuleId}`. Scope `Desk.settings.UPDATE`.
42. `DELETE /api/v1/layouts/{layoutId}/layoutRules/{layoutRuleId}`. Scope `Desk.settings.DELETE`.
43. Rule object fields: `id, name, description, fieldName (primary field), fieldConditions[], layoutId, displayLabel, executeInHelpCentre, status (active|deactive), systemGenerated, createdBy, modifiedBy, createdTime, modifiedTime`. (mirror) DESK-API
44. Validation rules have their own endpoints (`.../validationRules`). (mirror) https://apis.io/apis/zoho/ (listed as a separate API)
45. Audit log entries: **not documented**. (inferred: Setup > Audit Log)

### B8. Related features that are NOT layout rules (Desk)
46. **Field Dependencies** (nested picklists): Setup > Layouts and Fields > **Field Dependencies**, per module and department. A parent picklist value limits the child's values. Nested picklists cannot be colour-coded. https://help.zoho.com/portal/en/kb/desk/faqs/customization/articles/faqs-nested-picklist-fields
47. **Validation Rules**: Setup > Layouts and Fields > Validation Rules.
    - Per department, with an alert message.
    - Limits: 50 per department, 10 parent conditions, 5 secondary conditions, 5 criteria.
    - Has its own "Apply to Help Center" option.
    - https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/creating-validation-rules
48. **Layout-level "Mark as required"** and **profile-to-layout assignment** are static layout settings, not rules. (doc) DESK-H2
49. **Help Center ticket form / web forms**: layout rules apply only through "Apply to Help Center". Web forms are excluded. (doc) DESK-H1
50. **Blueprint** has its own transition fields. It is not a layout rule. Blueprint is a Professional feature. https://www.zoho.com/desk/pricing.html

---

## CRM vs Desk: same or different?
Source keys: CRM-H1, CRM-K63, CRM-CMP, CRM-API, CRM-LAY, DESK-H1, DESK-H2, DESK-MOB and DESK-API. The full URLs are listed at the top of this file.

| # | Area | Zoho CRM | Zoho Desk | Verdict | Sources |
|---|---|---|---|---|---|
| 1 | Feature name and concept | "Layout Rules": a primary field and conditions decide what a form shows or requires | Same name and same concept | **Same** | CRM-H1, DESK-H1 |
| 2 | Setup path | Module "..." > Layout Rules, or Setup > Customization > Modules and Fields > module > layout > Layout Rules | Setup > Customization > Layouts and Fields > Layout Rules > module > department | **Different** | CRM-H1, DESK-H1 |
| 3 | Scope | Per **layout** of a module | Per **department + layout**; the same field can have different rules in each department | **Different** | CRM-H1, DESK-H1, DESK-API |
| 4 | Modules | Any module with layouts (examples: custom module, Deals, Tasks) | Tickets, Contacts, Accounts, Tasks, Calls, Events, Time Entry, Products (per the API enum) | **Different** | CRM-H1, DESK-API |
| 5 | Edition | Enterprise and Ultimate (comparison page); the Use Cases page also says Professional | Enterprise only | **Mostly same** (top tiers only); the CRM Professional status is unclear | CRM-CMP, CRM-H2, DESK-MOB |
| 6 | Permission | Customize Zoho CRM / Manage Customization | Manage Layouts and Fields | Different name, same role (admin customization) | CRM-K63, DESK-H1 |
| 7 | Create flow | Name, Description, Primary field, Condition, Next, then the editor with "Trigger an action" | Identical flow | **Same** | CRM-H1, DESK-H1 |
| 8 | Rule structure | Parent conditions > branch conditions > criteria | Same structure, with a custom pattern such as `(1and2)or3` | **Same** | CRM-H1, DESK-H1, DESK-API |
| 9 | Parent, branch and criteria limits | 25 / 5 / 5 | 25 / 5 / 5 | **Same** | CRM-H1, DESK-H1 |
| 10 | Actions per branch | 40 | 25 | **Different** | CRM-H1, DESK-H1 |
| 11 | Rules per layout | 10 | 10, plus 50 per department with at most 20 active | **Same at layout level**; Desk adds department caps | CRM-H1, CRM-CMP, DESK-H1 |
| 12 | Primary field exclusions | Owner, multi-select picklist; Auto Number, Lookup, Multi-Select Lookup, User Lookup, Formula, File Upload and Multi Line are not allowed anywhere | Owner, multi-select picklist, multi-line; Department Name, Description and Resolution are banned from rules | **Overlap** (Owner, multi-select picklist, multi-line) but the full lists differ | CRM-H1, CRM-K63, DESK-H1 |
| 13 | Operators | is, isn't, contains, doesn't contain, starts with, ends with, is empty, is not empty | "is" plus regex (Matches, Not Matches, Contains Regex); the full list is not documented | **Different / partly unknown** | CRM-K63, DESK-H2 |
| 14 | AND/OR | Yes, up to 5 criteria; the primary-field criterion can only be joined with AND | Yes, with a custom pattern | **Same** (both support AND/OR) | CRM-K63, DESK-API |
| 15 | Show Fields, Show Sections, Set Mandatory | Yes | Yes | **Same** (Desk has only these three) | CRM-H1, DESK-H1 |
| 16 | Show Subforms, Picklist Values, Read-Only, Set Value, Recommend Value, Message, Related Lists, Buttons, Links, Verify | Yes (9 newer actions plus Subforms) | No | **CRM only** | CRM-H1, CRM-C1, DESK-H1 |
| 17 | Profile-based execution and Interactive Preview | Yes | No | **CRM only** | CRM-H1, CRM-C1 |
| 18 | Hide action | None; "show" means hidden otherwise | None; same behaviour | **Same** | CRM-H1, DESK-H1 |
| 19 | Target reuse rule | A primary field cannot be another rule's primary field; it can be another rule's target | An **action target** cannot appear in another rule | **Different** | CRM-K63, DESK-H1 |
| 20 | Where rules run | Create, Edit, View, Details edit, Kanban, Pipeline, task close, approval; on a Blueprint transition only Set Mandatory runs | Manual create and edit in the agent UI, the mobile app, and the Help Center when the "Apply to Help Center" box is ticked | **Same core** (manual create and edit); CRM covers more surfaces; the Help Center is Desk only | CRM-H1, DESK-H1, DESK-MOB |
| 21 | Not run on | Import, web forms, Lead Convert; workflow, macro and mass update bypass | Import, web forms, API; primary field cannot be mass-updated | **Same** for import and web forms | CRM-H1, DESK-H1 |
| 22 | Mass update of the primary field | Primary fields that drive Set Mandatory are left out of mass update | Primary field cannot be updated through Mass Actions | **Same idea** | CRM-H1, DESK-H1 |
| 23 | API enforcement on record save | Set Mandatory only, with `apply_feature_execution:[{"name":"layout_rules"}]`; error `MANDATORY_NOT_FOUND` | Not enforced | **Different** | CRM-API, DESK-H1 |
| 24 | API to manage rules | None public; the Layouts API does not return rules | Full CRUD: `GET /layoutRules`, and `GET/POST/PATCH/DELETE /layouts/{id}/layoutRules[/{ruleId}]` | **Different** | CRM-LAY, DESK-API |
| 25 | Mobile | Created on web; the app shows which rules apply; enforcement detail not documented | Supported for all three actions after Refresh Portal Metadata | **Similar**; Desk is better documented | CRM Android help (via search), DESK-MOB |
| 26 | Activate and deactivate | Status exists (extension rules can change status) | Toggle with confirm; rule shows as Inactive | **Same** (both have status) | CRM-H1, DESK-H1 |
| 27 | Extension or system rules | Extension rules can be viewed and their status changed; no edit or delete | `systemGenerated` flag | **Similar** | CRM-H1, DESK-API |
| 28 | Picklist interplay | Map Dependency filters first, then Show Picklist Values | Field Dependencies is a separate feature; no picklist action | **Different** | CRM-H1, Desk nested picklist FAQ |

**In short:** the core is the same. Both use a primary field with nested conditions (25/5/5) and the actions Show Fields, Show Sections and Set Mandatory, both allow 10 rules per layout, both have no Hide action, and neither runs on import or web forms. The differences:
- **Scope:** Desk adds per-department scope and department caps.
- **Actions:** CRM has 9 more actions plus Show Subforms, profile-based execution and preview.
- **API:** CRM enforces Set Mandatory through the record API, while Desk has a CRUD API for the rules themselves.
- **Help Center:** only Desk has the Help Center switch.
- **Reuse:** the reuse restriction works differently (CRM restricts primary fields, Desk restricts targets).
