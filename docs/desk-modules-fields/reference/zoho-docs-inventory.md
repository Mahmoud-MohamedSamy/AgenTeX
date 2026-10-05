# Zoho Desk: Modules, Module Tabs and Fields Customisation (docs inventory)

Compiled 2026-10-05 from Zoho's official help, API docs and pricing pages (read-only research, no login).
Anything not stated verbatim by a source is marked **(inferred)**. The Time Entry module is out of scope apart from the single line in section 1.

Key sources (short ids used below):
- [CM] Creating Custom Modules: https://help.zoho.com/portal/en/kb/desk/customization/modules/articles/creating-custom-modules
- [SMF] Standard Modules and Fields: https://help.zoho.com/portal/en/kb/desk/customization/modules/articles/standard-modules-and-fields-zoho-desk
- [CSM] Customizing Standard Modules: https://help.zoho.com/portal/en/kb/desk/customization/modules/articles/customizing-standard-modules-zoho-desk
- [TABS] Organizing and renaming modules: https://help.zoho.com/portal/en/kb/desk/customization/modules/articles/customizing-help-desk-tabs
- [FAQCM] FAQs, Custom modules: https://help.zoho.com/portal/en/kb/desk/faqs/customization/articles/faqs-custom-modules
- [CF] Working with Custom Fields: https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/working-with-custom-fields (same content as /adding-custom-fields)
- [MF] Managing Fields (field permissions, dependencies, fields list, search fields): https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/managing-help-desk-fields (also /working-with-fields-in-zoho-desk)
- [LU] Custom Lookup Fields: https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/creating-custom-lookup-fields-in-zoho-desk
- [ENC] Encrypting Custom Fields: https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/encrypting-custom-help-desk-fields
- [NP] Nested picklists: https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/creating-nested-picklist-fields-new-ui
- [LAY] Layouts and Layout Rules: https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/adding-custom-page-layouts (also /customizing-help-desk-layouts)
- [VR] Validation Rules: https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/creating-validation-rules
- [FP] Field permissions (supportlab mirror): https://supportlab.zoho.com/portal/zohocorp/en/kb/desk/customization/layouts-and-fields/articles/setting-up-fields-permissions
- [PROF] Manage Profiles: https://help.zoho.com/portal/en/kb/desk/user-management-and-security/roles-and-profiles/articles/managing-user-profiles
- [DS] Data Sharing Rules: https://help.zoho.com/portal/en/kb/desk/for-administrators/user-access-and-security/articles/setting-up-data-sharing-rules
- [WF] Workflow rules: https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/workflow-automations
- [IOS] Custom Module in Zoho Desk iOS: https://help.zoho.com/portal/en/kb/desk/mobile-apps/ios/custom-module/articles/custom-module-in-zoho-desk-ios
- [API] Zoho Desk API docs: https://desk.zoho.com/DeskAPIDocument (sections Modules, OrganizationFields, Fields, Records, DependencyMappings, Layouts, LayoutRules, ValidationRules, Data Sharing Rules, Profiles, Search, Views, API Credits)
- [PRICE] Current edition comparison: https://www.zoho.com/desk/pricing-comparison.html (geo-served in Arabic here; values translated; columns are Free / Express / Standard / Professional / Enterprise)
- [PDF2019] Plan comparison PDF dated 8 May 2019 (old, 4 editions): https://www.zoho.com.cn/sites/default/files/desk/zoho-plan-comparison-gbp.pdf
- [FORM] Formula fields community announcement (Jan 2025): https://help.zoho.com/portal/en/community/topic/calculate-service-cost-ticket-age-and-other-metrics-using-formula-fields-31-1-2025
- [COLOR] Colour-coded picklists announcement (~Oct 2024): https://help.zoho.com/portal/en/community/topic/use-color-coding-for-picklist-field-values-to-enhance-visual-representation
- [AUD] Audit log announcement (~2025): https://help.zoho.com/portal/en/community/topic/audit-log-detailed-view-and-export-for-better-tracking
- [INS7] "Seventh Insight - Organize your data using Modules" (Zoho community, Jun 2025): https://help.zoho.com/portal/en-gb/community/topic/seventh-insight-organize-your-data-using%c2%a0modules-4-6-2025

---

## 1. Standard modules

### 1.0 Module list and counts
- [SMF] lists **9 standard modules**: Tickets, Accounts, Contacts, Products, Tasks, Calls, Events, Contracts, Time Entry. It compares modules to "folders in the computer".
- [CSM] / [TABS] say there are "**eight** modules". The tab list also contains Knowledge Base, Activities (groups Tasks, Events, Calls), Analytics (groups Reports, Dashboards), Community, Social, Chat, IM.
- [API] `GET /api/v1/organizationModules` example returns these record modules (apiName / nameField / isDeptSpecific / hasRecycleBin):
  - accounts / accountName / org-level / RB yes
  - contacts / lastName / org-level / RB yes
  - tasks / subject / dept / RB yes
  - tickets / subject / dept / RB yes
  - contracts / contractName / dept / RB yes
  - products / productName / org-level / RB yes
  - timeEntry / requestChargeType / dept / RB yes
  - agents / lastName / org-level / **RB no**
  - events / subject / dept / RB yes
  - calls / subject / dept / RB yes
  - custom example: cm_doctors / name / dept / RB yes
- [API] `GET /api/v1/myAccessibleModules` lists the tab-level modules with `isEnabled`, displayLabel, singularLabel and pluralLabel:
  - Contracts, Time Entry, Department(s), Agents, Topics (apiKey `category`)
  - Tickets (the example shows a renamed plural, "Ticketss"), Reports, Dashboards
  - Knowledge Base (apiKey `kbCategory`, singular "Article", plural "Articles")
  - Contacts, Products, Accounts, Community, Social, Chat
  - Activities, Calls, Tasks, Events, IM
- Edition availability of modules [PRICE]:
  - Tasks: Standard and above.
  - Events and Calls: Professional and above.
  - Contracts & Support plans: Enterprise only.
  - Product-based ticket tracking: Standard and above.
  - Department-specific products: Professional and above.
- Time Entry: a standard module that exists (fields Agent, Ticket Charge Type, Executed Time, Hours/Minutes/Seconds Spent, costs). **Skipped as out of scope.**

### 1.1 Where standard modules sit (department-specific or organisation-wide)
- Layouts for **Accounts, Contacts, Products are organisation-wide**. Tickets layouts (and Activities) are department-specific [CF][LU][LAY].
- API `isDeptSpecific`: tickets, tasks, calls, events, contracts and timeEntry are department-specific. accounts, contacts, products and agents are organisation-level [API].

### 1.2 Default (system) fields per module ([SMF] unless noted; * = mandatory per [SMF])

**Tickets** (purpose: customer support requests)
| Field | Type | Max | Mandatory |
|---|---|---|---|
| Department | Pick List (API: LookUp to departments, onDelete CASCADE, isBasic) | – | No in [SMF]; API isMandatory=true in layout |
| Account Name | Lookup (accounts, onDelete SET_NULL) | – | No |
| Contact Name | Lookup (contacts, onDelete CASCADE) | – | No in [SMF]; **API isMandatory=true, isBasic=true** |
| Ticket Owner (apiName assigneeId) | Pick List / LookUp to agents, related list "Tickets Owned" | – | No |
| Status | Pick List | – | Yes* |
| Subject | Text box | 255 | Yes* |
| Product Name (productId) | Lookup (products, SET_NULL) | – | No |
| Category | Pick List | – | No |
| Sub Category | Pick List | – | No |
| Classification | Pick List (default values -None-/Question/Problem/Feature/Others per API example) | – | No |
| Due Date | Date/Time | – | No |
| Email | Email | API maxLength 120 | No |
| Description | Text Area | 32,000 chars ([SMF]); API maxLength 65535 / 1,000,000 in layout examples | No |
| Channel (API label "Mode" in layout example) | Pick List (Phone/Email/Web/Twitter/Facebook/Chat/Forums/Feedback Widget) | – | No |
| Phone | Text box | 30 ([SMF]); API 120 | No |
| Priority | Pick List (-None-/High/Medium/Low) | – | No |
| Resolution | Text Area | 32,000 | No |

- Other system ticket fields seen in the API: Language (picklist), Skills (entitySkills lookup), Is Overdue (Boolean), Is Escalated (Boolean) [API Get Layout / Get fields examples].
- Default ticket layout sections: **"Ticket Information"** and **"Additional Information"** [API Get Layout example].
- The API example shows Ticket Owner relabelled "Case Owner", so field labels follow module renaming **(inferred)**.

**Accounts**: Account Name* (Text, 100) · Account Owner (Lookup) · Email · Description (Text Area, 32,000) · Industry (Pick List) · Annual Revenue (Numeric, 10 digits) · Website (URL, 30) · Phone (30) · Fax (30) · Street (250) · City (30) · State (30) · Country (30) · Code (30).

**Contacts**: Contact Owner (Lookup) · First Name (40) · Last Name* (200) · Account Name (Lookup) · Title (50) · Phone (50) · Mobile (50) · Email (100) · Secondary Email (100) · Twitter (100) · Facebook (100) · Type (Pick List) · Street (250) · City (30) · State (30) · Zip (30) · Country (30) · Description (250). Record name field = lastName [API].

**Products**: Department* (Pick List) · Product Name* (50) · Product Code (40) · Product Category (Pick List) · Product Owner (Pick List) · Description (Text Area, 32,000) · Manufacturer (Pick List) · Unit Price (Currency).

**Tasks**: Department* · Task Owner (Lookup) · Subject* (50) · Due Date (Date/Time) · Ticket (Lookup) · Status (Pick List) · Priority (Pick List) · Category (Pick List) · Remind At (Check box) · Description (Text Area, 32,000).

**Calls**: Department* · Call Owner (Pick List) · Subject* (50) · Direction (Select: Inbound/Outbound) · Ticket (Lookup) · Call Status* (Select) · Start Time* (Date/Time, defaults to now) · Duration* (Numeric) · Priority · Contact Name* (Lookup) · Remind me (Check box) · Description (32,000).

**Events**: Department* · Event Owner (Pick List) · Subject* (50) · Category (Pick List) · Start Time* · Duration* · Ticket (Lookup) · Status · Priority · Contact Name* (Lookup) · Remind me (Check box) · Description (32,000).

**Contracts**: Department* · SLA Name* (Pick List) · Contract Owner · Contract Name* (Text) · Contract Number · Product Name (Lookup) · Contract Start Date* (Date) · Contract End Date (Date) · Description (32,000).

### 1.3 What can be done to standard fields
- Standard fields can be displayed or hidden. Changes apply organisation-wide [MF].
- "Mandatory system-defined fields like Departments and Contact Name cannot be edited or deleted" [MF].
- "Default standard fields cannot be moved to the Unused Fields section" [CF].
- "Certain mandatory and read-only fields cannot be removed" from a layout [LAY].
- API `isBasic` = field cannot be removed from the layout. Examples: Department, Contact Name, Subject, Status, Email, Description, Due Date, Priority, Channel, Resolution, Ticket Owner. Removable examples: Account Name, Phone, Product Name, Classification, Category, Sub Category, Language, Skills [API].
- A standard field can be made required in a layout ("Mark as required"). This needs Read & Write permission for all profiles that can access the field [LAY].
- Renaming standard field labels:
  - The help pages do not say this explicitly. The API `displayLabel` is editable via PATCH /fields **(inferred: label rename allowed)**.
  - Translation of default field names is supported via Multilingual (section 10).
- Picklist values on standard picklists (Priority, Category, Status and so on) are layout-level. Status picklist values and mandatory flags are "set at the layout level, not the department or organization level" [LAY].
- Standard-module record name fields (nameField) are fixed [API].
- Not documented anywhere (treat as not possible):
  - Renaming or changing the type of a system field's API name.
  - Deleting a standard field.

### 1.4 What can be customised per standard module (summary)
- Rename the module (singular and plural) [TABS].
- Show/hide and reorder the module tab [TABS].
- Layouts: multiple layouts per department/module on Enterprise, except Contracts [LAY].
- Custom fields (section 4).
- Lookups: only from Tickets, Contacts, Accounts (and custom modules) [LU].
- Field permissions, field dependencies, search fields [MF].
- Layout rules and validation rules [LAY][VR].
- Custom views (Express and above) [PRICE].
- Data sharing level [DS].

---

## 2. Module tabs (tab bar)
- Setup path: **Setup > Customization > Modules and Tabs** [TABS][CSM].
- **Organize Modules** page:
  - Drag modules between the **"Unselected Modules"** and **"Selected Modules"** lists.
  - Drag within Selected to reorder.
  - "Changes save automatically" (no Save button).
- Hidden modules "won't appear regardless of user profile" [TABS].
- Constraint: "**At least one module must be selected**" [TABS].
- Grouped tabs:
  - **Activities** groups Tasks, Events, Calls.
  - **Analytics** groups Reports and Dashboards [TABS].
- **Rename Modules**:
  - Setup > Customization > Modules and Tabs > "Rename Modules" sub-menu > hover a module > Edit icon > enter **singular and plural** > Save [TABS].
  - Example: "Knowledge Base" to "FAQ".
  - Scope: reflected in "all the standard pages of the user interface **except for custom reports and dashboards**" [CSM].
- **Modules List** tab: lists modules and opens direct editing (custom modules) [CM].
- Custom module tab label = plural name in the top navigation. Singular name is used for individual records [CM].
- Permission: "Only users with administrator privileges" / Manage Modules [CSM][PROF].
- Customize Tabs ("rename, hide and reorder tabs at the top of the Zoho Desk interface") is available in **all editions incl. Free** [PRICE].
- Per-department availability:
  - Custom modules have a **department accessibility** setting (default: all departments) [CM].
  - Standard tab visibility is organisation-wide (hidden for everyone) [TABS].
- Per-profile tab access:
  - Driven by module permissions in profiles (View/Create/Update/Delete) [PROF].
  - Custom modules also take profileIds at creation [API].
  - `GET /api/v1/myAccessibleModules` returns `isEnabled` per module for the current profile [API].
- "More" overflow: not documented for the web tab bar.
  - Mobile (iOS): custom modules are reached via the **More** icon and carry a special icon. After creating a module on the web, the user must run Settings > **Refresh Portal Metadata** on mobile [IOS].
- Tab reorder and rename are per organisation, not per user. No user-level personal tab order is documented **(inferred)**.

---

## 3. Custom modules

### 3.1 Creation
- Path: **Setup > Customization > Modules and Tabs > New Custom Module** [CM]. The FAQ says Setup > Customization > Modules [FAQCM].
- Form inputs [CM][FAQCM]:
  - **Module name, plural and singular** (UI max **25 characters** [CM]; API max 50 chars [API]).
  - **Description** (API max 200).
  - **Department accessibility** (default: all departments).
  - **Module data storage type**:
    - **Department level**: separate datasets per department, separate standard layout per department.
    - **Organization level**: records common to all departments, one standard layout.
  - **Module permissions** (profiles).
- Buttons: **Save** or **Save and Go to Layouts** [CM].
- API: `POST /api/v1/organizationModules`
  - Body: singularLabel*, pluralLabel*, description, departmentIds, profileIds, isDeptSpecific.
  - If isDeptSpecific is omitted, the module is organisation-level.
  - Scope `Desk.modules.CREATE` [API].
- API name is generated as `cm_<plural lowercase>`, e.g. `cm_doctors`.
- Record name field (`nameField`) is auto-created as `name` ("A unique primary field is assigned when the module is created") [API].
- No icon or colour input is documented. Mobile shows a generic custom-module icon [IOS] **(inferred: no icon picker)**.
- Default fields:
  - Department-level storage: **Department, Layout, <module name> (record name), record Owner**.
  - Organisation-level storage: the same without Department [CM].
- Record attributes: name, layout, owner, cf{}, department, id, isPresence, created/modified by/time [API].
- Permission needed: "**Module Customization**" [CM] / "**Manage Modules**" [FAQCM][PROF]. On mobile it is called "Manage Customization" [IOS].

### 3.2 Limits and edition
- **Enterprise only; 10 custom modules** [PRICE].
- Fields per custom module:
  - `GET /api/v1/customFieldCount` supports custom modules [API].
  - Per-type caps are presumably the same as standard Enterprise (230 total) **(inferred)**.
- Custom lookup fields: Enterprise 5 per module & layout [PRICE]. Community users report "only 10 lookups" (unofficial).
- **Single layout**:
  - "It is not possible to add a new layout to these custom modules."
  - "The standard layout provided cannot be removed or deactivated" [FAQCM][CM].

### 3.3 What a custom module gets automatically
- A tab in the top navigation (plural name) [CM].
- **List view** with two system views: **"All records"** and **"My records"**. Select Columns lets users choose list columns [CM][FAQCM].
- Custom views with filter criteria and visibility **Only Me / All Agents / Specific Agents** [FAQCM]. Views API supports "custom module" [API].
- Detail view with a **History** tab: date/time, user, **IP address**, action (add/update), previous vs updated values [CM].
- "+ Add <module>" button; Edit/Delete from the record **More** icon with confirmation [CM].
- **Recycle Bin**: hasRecycleBin=true. Deleted records are restorable for **60 days** [API].
- Followers: the follow/unfollow API takes moduleAPIName **(inferred: may apply to custom modules)**.

### 3.4 Relationships
- Lookups to standard or other custom modules auto-create a **subtab** on the related record. Example: Tour Packages to Tickets creates a "Related Tickets" subtab [CM].
- Subtab actions:
  - Associate tickets.
  - View linked items.
  - Create new linked records.
  - Disassociate.
  - Private-extension widgets [CM].
- Widget locations: custom module detail subtab and detail page [CM links].

### 3.5 Permissions and sharing
- Module permissions per profile restrict create/view/modify [CM].
- **Data sharing** applies to custom modules. Private = agent sees own and subordinates' records [FAQCM][INS7].
- API key `cm_*` in dataSharingRules [API].

### 3.6 Edit, rename, delete
- Edit and rename:
  - Via the Modules List.
  - API `PUT /api/v1/organizationModules/{id}`: singularLabel*, pluralLabel*, description, departmentIds*, profileIds* [API].
- "**Cannot be deleted or deactivated**" once created [CM][FAQCM].
- Storage type (department vs org) **cannot be changed** after creation [CM][FAQCM].
- No delete-module API exists [API].

### 3.7 Platform integration
| Area | Supported? | Source |
|---|---|---|
| Workflow rules | Yes: Alerts, Custom Functions, **Update Record** (Update Record is custom-module only, Enterprise) | [WF] |
| Blueprints | Not documented. Blueprint cloning is reportedly limited to standard modules | community, **inferred no** |
| Reports | Via Zoho Analytics Advanced Connector; custom reports referenced | [FAQCM][CM] |
| Search | Custom module search API `GET /api/v1/{moduleApiName}/search` (field1..field10, created/modified time ranges) | [API] |
| API | Full CRUD (section 8) | [API] |
| Help Center | Only **ticket** layouts can be shown in the Help Center | [LAY], **inferred no** for custom modules |
| Import/export | "**Import/export functionality for custom modules is unsupported**" | [FAQCM] |
| CRM sync | Not possible | [FAQCM] |
| Audit log | Custom modules tracked | [AUD] |
| Mobile (iOS) | View modules and records, associate/dissociate, related subtabs; creation only on the web | [IOS] |
| Mobile (Android) | Add/edit/delete custom module records (community digest) | unofficial |

---

## 4. Fields

### 4.1 Custom field types
- UI names [CF]:
  - Single Line, Multi-Line, Picklist, Multi-Select Picklist, Email, Phone, URL.
  - Integer, Decimal, Percentage, Currency, Date, Date/Time, Checkbox.
  - **Lookup** [LU], **Nested Picklist** (picklist option) [NP], **Formula** [FORM][PRICE].
- API `type` values:
  - Text, Number, Percent, Decimal, Currency, Date, Date Time, Email, Phone, PickList, Website, Textarea, Checkbox, Multiselect, Boolean, LargeText, LookUp.
  - Formula: `returnType` DECIMAL / CURRENCY / STRING / DATE / DATETIME / BOOLEAN.
  - MultiLookup via `junctionModule` [API].
- Not present: Auto-number. "User lookup" is only the standard Owner lookup to agents [API]. Neither is documented.

### 4.2 Field count limits
- Enterprise per-type caps [CF] and [API customFieldCount example]:

| Bucket (API type) | Field types | Tickets/Contacts/Accounts/Products/Activities | Contracts & Time Entry |
|---|---|---|---|
| Varchar | Single Line, Picklist, Email, Phone, URL | 100 | 20 |
| Text | Multi-Line, Multi-Select | 30 | 5 |
| Integer | Integer | 20 | 5 |
| Double | Decimal, Percent, Currency | 20 | 5 |
| Date | Date | 20 | 5 |
| DateTime | Date/Time | 20 | 5 |
| Boolean | Checkbox | 20 | 5 |
| Encrypted (DESK_SEARCHABLE_CTEXT_OEK) | Text, Website, Email, Number, Phone, Percent, Decimal | 10 | – |
| Formula | Formula | 10 | – |
| **Total** | | **230** (`totalAvailableCount`) | |

- Totals per module by edition [PRICE] (old PDF identical except Express did not exist):

| Edition | Fields per module |
|---|---|
| Free | none |
| Express | 10 |
| Standard | 50 |
| Professional | 150 |
| Enterprise | 230 |

  - Contacts & Accounts follow the same numbers.
  - Products: Standard 50, Professional 150, Enterprise 230 (none on Express).
- Fields per layout (standard + custom): **400** [LAY].
- Formula fields: Professional 5 per module, Enterprise 10 per module [PRICE]. Early Access when announced in Jan 2025 [FORM].
- Custom lookups: Professional 3, Enterprise 5 per module & layout [PRICE].
- Colour-coded picklists: Professional 5, Enterprise 10 per module [PRICE].
- Encrypted fields: Enterprise only, max 10 per module [ENC].
- Nested picklist [NP][CF]:
  - Up to **6 levels**, separated by `::`.
  - Max **500 options** per field.
  - Max **5 nested picklists per layout**.
  - Professional and Enterprise only.
- Unused (removed) fields still count against the limit [CF].

### 4.3 Field properties
- Label: API `displayLabel` max 250 chars.
- Mandatory ("Mark as required"):
  - Only when Read & Write permission is given to all profiles.
  - The label shows in red [CF][LAY].
- Tooltip:
  - Info icon or static text (API `toolTipType` icon / placeHolder; toolTip max 200 chars).
  - The hover info icon is limited to Picklist, Multi-Select, Checkbox, Date, Date/Time [CF].
- Default value:
  - Picklist: "Set as Default" link.
  - Checkbox: defaultValue (API applies it to Checkbox and PickList) [CF][API].
- Character length adjustable for Currency, Text, Integer, Decimal, Phone, URL [CF]. API maxLength applies to Text/Number/Decimal/Currency.
  - Observed defaults: custom Text 118 or 255 and system 120/255/300; Textarea 65535 or 1,000,000 [API] **(inferred defaults)**.
- Decimal/Currency:
  - `decimalPlaces`.
  - Currency `roundingPrecision`.
  - Rounding options Normal / Round Off / Round Down / Round Up (API roundOff / roundDown / roundUp) [CF][API].
- Picklist:
  - `subType` Plain or **ColorCoded**.
  - `sortBy` alphabetical or userDefined.
  - `allowedValues`; values are layout-specific [API][LAY].
- Bulk picklist values:
  - From Predefined Choices (days, months, continents, countries).
  - Manual Entry (duplicates removed automatically).
  - Import from CSV [CF].
- Picklist value export: `GET /layouts/{id}/fields/{id}/value?fileType=CSV` [API].
- Picklist fields are organisation-wide objects, but values are department-specific. A picklist created in Dept A appears in Dept B's Unused Fields [CF].
- Replace Values vs Rename [CF][API]:
  - **Replace Values** updates all records and changes their modified time. API `POST /layouts/{id}/replaceValues`, 500 credits.
  - Rename, add or delete of values is **not** propagated to existing records.
- Encryption:
  - Enterprise; custom fields only; org-wide.
  - Types: single line, integer, email, phone, percent, decimal, date, picklist, currency, URL.
  - Encrypted fields cannot be used:
    - In report columns/criteria/grouping.
    - In automation conditions.
    - In Advanced Filters, Search by Criteria or Sort.
  - Predictive search needs whole-word matches.
  - Background processing with an email notification [ENC].
- Mark as ePHI: auto-enables encryption (can be disabled); shows an ePHI label in the agent UI and the Help Center [CF].
- Help Center access per field: **Editable for End Users / Read-Only for End Users / Hide from Help Center** [CF].
- Unique and read-only-property: not documented as field properties. Read-only is achieved via field permissions **(inferred)**.
- Other API attributes:
  - isEncryptedField, isIndexed, isComputed, isBasic, isPresence, isSortable.
  - sourceType (SYSTEM / USERDEFINED / EXTENSION).
  - i18NLabel, showToHelpCenter, isTrackLastActivityTime [API].

### 4.4 Field type change, remove, restore, delete
- "Custom fields can be renamed but **the field type cannot be changed**" [CF].
- Remove field (moves it to **Unused Fields**):
  - Done via settings icon > Remove Field, or drag to Unused, then Save Layout.
  - The data is kept; restoring by dragging back restores the data [CF].
  - Removed **picklist** fields have their values reset on reuse [CF].
- Permanent delete:
  - From Unused Fields > Delete icon > "Yes. Delete Now".
  - **Irreversible.** Data is lost and the field is removed from reports, automations, custom views and so on [CF].
  - Blocked if the field is:
    - Used in other layouts or departments.
    - Referenced by a **layout rule or validation rule** (the rule must be deleted first) [CF][VR].
- API delete: `DELETE /api/v1/fields/{id}`, **500 credits**.
- Criteria references API lists where a field is used: DirectAssignment, RoundRobin, WorkFlow, SLA, Supervise, BluePrint, CustomView, Report, GameTrophy, GameBadge, LayoutRules, ValidationRules [API].
- **Add to Other Layouts** (settings icon): the field lands in the same section, else the first section [CF].

### 4.5 Field dependencies
- Setup > Customization > Layout and Fields > **Fields Dependencies** > select Module + Department > Add New Dependency > Parent and Child fields > Next > map values > Save Field Dependency [MF].
- Picklist fields only.
- Edition: Standard and above [PRICE].
- Configured per layout: API `/api/v1/dependencyMappings` with layoutId, parentId, childId, mappings [API].

### 4.6 Fields List and search fields
- Fields List: Setup > Customization > Layout and Fields > **Fields List**.
  - Columns: Field Name, Data Type, API Name; links to the layouts using each field.
  - Custom fields carry an icon. A search box is available [MF].
- **Search Fields**: Setup > Layout and Fields > Search Fields > module > "Specific Fields".
  - Max **10 fields per module**; **6** for Contracts, Products, Calls, Events, Tasks.
  - Organisation-level setting [MF].

### 4.7 Modules that support custom fields
- Contracts, Time Entry, **Agents**, Tickets, Contacts, Accounts, Products, Calls, Tasks, Events [MF], plus custom modules [API].
- [MF] describes custom fields as "department-specific".

---

## 5. Layouts
- Path: **Setup > Customization > Layouts and Fields** > module + department > **Add Layout** / Edit [LAY].
- Permission: **Manage Layouts and Fields** [LAY][PROF].
- Modules with layouts: Tickets, Tasks, Accounts, Contacts, Activities, Products, Time Entries.
  - **Contracts does not support multiple layouts.**
  - Custom modules: single standard layout [LAY][FAQCM].
- Limits:
  - **20 active layouts** per department (Tickets/Activities/Time Entry) or per org-wide module (Accounts/Contacts/Products) [LAY].
  - **Multiple layouts are Enterprise only (20/department)** [PRICE].
  - Department-specific layout: Professional and above [PRICE].
  - Fields per layout: 400 [LAY].
- **Standard Layout**:
  - The default; cannot be deactivated or deleted.
  - Assigned to all profiles; its permissions cannot be modified.
  - Can be renamed, customised and cloned [LAY].
- Add Layout inputs:
  - Name, **Display Name in Help Center**, Description.
  - **Layout Permissions** (profiles).
  - "Allow non-department agents", "Display in Help Center".
  - Then **Save and Configure** [LAY].
- Agents can create records only in layouts assigned to their profile [LAY].
- Editor:
  - Drag/drop between the layout and **Unused Fields**; reorder.
  - "+Add Section" from the Add Field tray; rename sections.
  - Delete a section only after removing its read-only/mandatory fields.
  - Gear icon per field: Mark as required, Edit Properties, Remove Field, Replace Values, Add to Other Layouts.
  - Buttons: Save / Save and Close / Save Layout [LAY][CF].
- Section columns (1 or 2) are not documented **(inferred)**.
- API: sections have id, name, isCustomSection, i18NLabel, fields [API].
- Preview: "Preview layouts based on profiles" under field permissions [MF].
- Clone:
  - Within a department or to another department, same module only [LAY].
  - API `POST /layouts/{id}/clone` with layoutName (150), layoutDisplayName (150), layoutDesc (500), isDefaultLayout, departmentId [API].
- Deactivate/activate:
  - API `/deactivate` requires transferToLayoutId; `/activate` [API].
- Delete:
  - A default layout cannot be deleted; set another as default first.
  - Transfer profiles to another layout. Records move to the new layout and ticket status resets to that layout's default status.
  - **Associated automations are deleted**: blueprint, layout rules, workflows, webforms, validation rules, ticket templates, field dependencies.
  - UI: More > Delete Layout > choose layout > "Transfer and Delete Now" [LAY].
  - API DELETE needs transferToLayoutId; 500 credits.
- Default layout: `isDefaultLayout` flag [API].
- Help Center: only **ticket** layouts can be shown to end users [LAY].
- Mobile: layout rules are supported in the Zoho Desk mobile app (community announcement). No separate mobile layout editor is documented **(inferred)**.

### 5.1 Layout rules (Enterprise only, 50/department [PRICE])
- Path: Setup > Layouts and Fields > **Layout Rules** > module + department > Create Rule > name, description, **primary field** + condition > Next > **Trigger an action** > optional "**Apply to Help Center**" > Save [LAY].
- Actions:
  - **Show Fields**
  - **Show Sections**
  - **Set Mandatory Fields**
- Limits [LAY]:
  - 10 rules per layout.
  - 50 per department, max 20 active.
  - 25 parent conditions per rule.
  - 5 branch conditions per parent.
  - 5 criteria per branch.
  - 25 actions per branch.
- Restrictions:
  - Primary field cannot be the Record Owner, Multi-line, Department Name, Description or Resolution.
  - The primary field can't be mass-updated and must be visible in the Help Center for Help Center validation.
  - A field used in an action cannot be used in another rule.
  - Rules apply only on manual create/edit, not import, webforms or API.
  - Regex operators (Matches / Not Matches / Contains Regex) are supported (Regex itself is Enterprise only [PRICE]). Multi-select picklists are usable in conditions [LAY].
- Manage: Rename (More > Rename), Deactivate (toggle OFF > Deactivate), Delete (permanent) [LAY].
- API operators:
  - Text, picklist, lookup: is, isn't, starts with, contains, doesn't contain, ends with, is empty, is not empty.
  - Date: is, isn't, is after, is before, empty checks.
  - DateTime: adds between and not between.
  - Integer/currency: =, <>, <, >, <=, >=, empty checks.
  - Boolean: is.
  - Tokens: ${EMPTY}, ${NOTEMPTY}, ${CURRENTTIME}, ${OPEN}, ${CLOSED}, ${CUSTOM}.
  - Pattern root must AND criterion 1 [API].

### 5.2 Validation rules (Enterprise only, 50/department [PRICE][VR])
- Path: Setup > Layouts and Fields > **Validation Rules** > module + department > Create Rule > primary condition > Next > alert message > secondary conditions > "Add another option" > "Apply to Help Center" > Save [VR].
- Limits:
  - 10 parent conditions per rule.
  - 5 secondary conditions per parent.
  - 5 criteria each.
  - Rules run in creation order [VR].
- Applied on manual create/edit and in the Help Center (if enabled).
- Bypassed by Import, Workflow, Blueprint, API and web form field updates [VR].
- Deactivate (shows "Inactive") or delete (permanent) [VR].
- API supports custom modules [API].

---

## 6. Related lists and lookups
- Custom lookups can be created **only in Contacts, Accounts, Tickets** (plus custom modules) [LU][FAQCM].
- Lookup creation:
  - Steps: Layout editor > drag **Lookup** > field name > **Related module** > **subtab name** in the related module (e.g. "Associated Tickets") > Mark as Required > Show Tooltip [LU].
  - Advanced options:
    - Filter lookup records: up to **5 criteria**.
    - "Lookup records can be searched by": up to **6 fields**.
    - Sort by created time, name or modified time.
    - **Display fields** in the lookup pop-up: up to **6**.
    - **Autofill layout fields** from the related record: up to **5** prefill mappings [LU].
- Relationship is one-to-many. A subtab (related list) is auto-created on the parent. Mandatory lookups cannot be disassociated from the subtab [LU].
- Edit: gear > Edit Properties. Disable (Remove Field, keeps data) and delete (permanent) work like other fields [LU].
- API lookup object:
  - module.apiName, nameField, field.
  - **relatedListLabel** (required), relatedListLabelInRelatedModule.
  - junctionModule (MultiLookup).
  - onDelete CASCADE or SET_NULL for system lookups [API].
- Standard relations:
  - Ticket to Account/Contact/Product/Department/Agent.
  - Task/Call/Event to Ticket and Contact.
  - Contract to Product/SLA [SMF][API].
- Lookup to Accounts makes a custom module a related list on Account [community].

---

## 7. Permissions
- Profiles: Setup > User Management > Profiles [PROF].
- Default non-editable profiles: Support Administrator, Agent, Light Agent. Sample editable profiles: Newbie Agent, Supervisor, Support Manager [PROF].
- Profiles per edition: Free/Express default only; Standard 5, Professional 25, Enterprise 50. Roles: Standard 5, Professional 25, Enterprise 250 [PRICE].
- Module permissions:
  - View, Create, Update, Delete, Update/Delete All Records; Manage KB / Admin Access for KB.
  - Custom-view permissions [PROF].
  - API profile JSON per module: view, create, edit, delete, import, export. Tickets have more keys [API].
- Administrative permissions relevant to customisation:
  - **Manage Modules** ("for managing the various modules such as Tickets, Contacts, and Accounts").
  - **Manage Layouts and Fields**.
  - Import Records, Export Records [PROF].
  - API setup keys: `tabsAndFields`, `layouts`, `recycleBin`, `sandbox`, `permission` [API].
- Field permissions [MF][FP]:
  - Setup > Customization > Layout and Fields > **Fields Permissions** > Module + Profile.
  - Levels: **Read and Write / Read Only / Don't Show**.
  - Light Agent can't have Read & Write. System-mandated and time-based fields are read-only only.
  - Mandatory fields can't be Read Only or Don't Show.
  - **Professional and Enterprise only** (Field-Level Access Control, Professional and above [PRICE]).
  - API: `GET` and `PATCH /api/v1/organizationFields/{id}/permissions`.
- Data sharing [DS]:
  - Setup > User Management > Data Sharing > Edit.
  - Levels: Private / Public Read-only / Public Read/Write/Delete. **Default Private.**
  - Applies to custom modules.
  - Enterprise only ("Data sharing" row [PRICE]).
- Layout permissions: profiles are assigned per layout [LAY].

---

## 8. API (base https://desk.zoho.com/api/v1, header orgId)

### Modules
| Method | Path | Notes |
|---|---|---|
| POST | /organizationModules | Desk.modules.CREATE, 1 credit |
| PUT | /organizationModules/{id} | |
| GET | /organizationModules/{id} | |
| GET | /organizationModules | 3 credits |
| GET | /myAccessibleModules | |
| GET | /modules | deprecated |

### Fields (`/fields`; `/organizationFields` is deprecated)
- POST `/fields?module=`: displayLabel* (250), type*, maxLength, decimalPlaces, roundingPrecision, roundingOption, defaultValue, toolTip, toolTipType, returnType, lookup{...}, isEncryptedField.
- PATCH `/fields/{id}`.
- GET `/fields/{id}`.
- GET `/fields?module=&apiNames=&associatedDepartments=&filter=`.
- DELETE `/fields/{id}` (500 credits).
- GET `/customFieldCount?module=` (50 credits).
- GET/PATCH `/organizationFields/{id}/permissions`.
- GET `/organizationFields/{id}/criteriaReferences?featureType=`.

### Custom module records (scopes Desk.custommodule.*)
| Method | Path | Notes |
|---|---|---|
| POST | /{moduleApiName} | name* plus layout, department (required if dept-specific), owner, cf{} |
| PATCH | /{moduleApiName}/{id} | |
| GET | /{moduleApiName}/{id} | |
| GET | /{moduleApiName} | viewId, from, limit 1–50, sortBy createdTime/modifiedTime (prefix "-" for descending), fields (max 30, no multi-line) |
| GET | /{moduleApiName}/count?viewId= | 50 credits |
| POST | /{moduleApiName}/moveToTrash | recordIds; 6 credits/record |
| POST | /{moduleApiName}/updateMany | ids max 50, fieldName, fieldValue |
| DELETE | /{moduleApiName}/{id} | Recycle Bin for 60 days if supported |
| GET | /{moduleApiName}/search | field1..field10 |

### Layouts
- GET `/layouts?module=&departmentId=&status=active|inactive|all&from&limit(100)`.
- GET `/layouts/{id}`.
- POST `/layouts` (isDefaultLayout*, sections*, module*).
- PATCH `/layouts/{id}`.
- DELETE `/layouts/{id}` (transferToLayoutId*).
- POST `/layouts/{id}/clone`, `/deactivate`, `/activate`.
- GET/PATCH `/layouts/{id}/profiles`.
- GET `/layouts/standardLayoutFormat?module=`.
- GET `/myForm`.
- POST `/layouts/{id}/replaceValues`.
- PATCH `/layouts/{id}/fields/{fid}`: isMandatory, defaultValue, allowedValues, sortBy, expression (formula, max 1500), lookup sortField/searchFields/selectFields/preFillFields/filter, isNested.
- POST `.../unassociate` (remove from layout).
- POST `.../cloneFieldsInLayout`.

### Rules, dependencies, sharing
- Layout rules: GET/POST/PATCH/DELETE `/layouts/{id}/layoutRules[/{rid}]`; GET `/layoutRules`; GET `/layouts/{id}/layoutRules/criteriaFields?category=primary|secondary`.
- Validation rules: same shape under `/validationRules`.
- Dependency mappings: `/dependencyMappings`, `/availableDependencyMappings?layoutId=`.
- Data sharing: GET/PATCH `/dataSharingRules`, keys per module plus `cm_*`.

### Credits and concurrency
| Edition | Daily credits (base + per user) | Concurrency |
|---|---|---|
| Free | 5,000 | 5 |
| Express | 25,000 + 100/user | 10 |
| Standard | 50,000 + 250/user | 10 |
| Professional | 75,000 + 500/user | 15 |
| Enterprise | 100,000 + 1,000/user | 25 |

- Max 50 records per request.

---

## 9. Edition availability (current [PRICE]: Free / Express / Standard / Professional / Enterprise)
| Feature | Free | Express | Standard | Professional | Enterprise |
|---|---|---|---|---|---|
| Customize tabs (rename/hide/reorder) | Y | Y | Y | Y | Y |
| Customize form fields | Y | Y | Y | Y | Y |
| Custom views | – | Y | Y | Y | Y |
| Custom fields per module | – | 10 | 50 | 150 | 230 |
| Custom ticket status | – | Y | Y | Y | Y |
| Field dependencies | – | – | Y | Y | Y |
| Formula fields | – | – | – | 5/module | 10/module |
| Department-specific layout | – | – | – | Y | Y |
| Multilingual (field names, picklist values) | – | – | – | Y | Y |
| Custom lookup fields | – | – | – | 3/module & layout | 5/module & layout |
| Picklist colour coding | – | – | – | 5/module | 10/module |
| Custom ticket IDs | – | – | – | Y | Y |
| Field-level access control | – | – | – | Y | Y |
| Nested picklist [NP] | – | – | – | Y | Y |
| Layout rules | – | – | – | – | 50/dept |
| Validation rules | – | – | – | – | 50/dept |
| Multiple layouts | – | – | – | – | 20/dept |
| **Custom modules** | – | – | – | – | **10** |
| Regex | – | – | – | – | Y |
| Data sharing | – | – | – | – | Y |
| Audit log | – | – | – | – | Y |
| Sandbox | – | – | – | – | 3 |
| Encrypted fields [ENC] | – | – | – | – | 10/module |

- Multi-department: Professional 10 departments, Enterprise 50.
- Import batch: Express 1,000, Standard 10,000, Professional 20,000, Enterprise 30,000.

---

## 10. Other
- **Multi-department**:
  - Ticket and activity layouts, rules and picklist values are per department.
  - Accounts/Contacts/Products are org-wide.
  - Custom modules choose department or org storage.
  - Agents see only their departments when configuring layouts [LAY].
- **Translations**:
  - Multilingual (Professional and above) translates field names and picklist values [PRICE].
  - Path: Setup > Customization > Languages > Multi-lingual. Add Language, export the language file, translate, import [community/search].
  - API exposes `i18NLabel` on fields and sections [API].
- **Audit log** (Enterprise): covers Contacts, Accounts, Workflows, Blueprints, Agents, Departments, Assignment Rules, **Custom Modules**. Admins can view and export to CSV [AUD][PRICE]. Layout/field change auditing is not documented.
- **Record History tab** on custom modules, including IP address [CM].
- **Colour-coded picklists**:
  - Released ~Oct 2024 to all data centres.
  - Saturation is customisable.
  - Professional 5 / Enterprise 10 per module [COLOR][PRICE].
- **Zia**: no Zia features specific to modules or fields are documented in these articles. Formula fields are not Zia.
- **Widgets/extensions**: custom module detail subtab and detail page widget locations exist [CM links].
- **Sandbox** (Enterprise, 3): lets you test customisation [PRICE].
