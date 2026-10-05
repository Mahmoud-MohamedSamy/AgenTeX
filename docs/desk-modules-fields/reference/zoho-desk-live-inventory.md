# Zoho Desk (live) – Modules, Tabs, Layouts & Fields inventory

- Captured: **5 Oct 2026**, headless Microsoft Edge via playwright-cli (session `zdesk`), strictly read-only.
- Org / portal: `desk.zoho.com`, portal **anywaresoftwaredesk**, org id 941784376, signed in as Mahmoud Mohamed (`CEO - Support Administrator`).
- Edition shown (profile card): **"Enterprise (Trial)"** – "Trial expires in 15 days. Extend Trial | Upgrade". Setup → Organization also lists "Trial Extension".
- Departments (top-bar selector "Anyware Software ▾" / API `myDepartments`): **Anyware Software** (default, `anyware-software`) and **Sales** (`sales`, created 5 Oct 2026 09:32).
- Profiles seen in module permissions / layout profiles: Support Administrator, Agent, Help Center (portal profile id 1483686000000008347 – rendered as a raw ID chip on department-level modules' "Module Permission"), Supervisor, Support Manager, Newbie Agent, Light Agent.
- Data sources: on-screen text (innerText / snapshots), one screenshot per page in this folder, plus the agent UI's own read-only GET endpoints (`/supportapi/zd/anywaresoftwaredesk/api/v1/organizationModules`, `organizationFields?module=…`, `layouts?module=…`, `layouts/{id}`) saved under `api/`. Raw page texts under `txt/`.
- Nothing was saved, created, deleted, dragged or toggled. Dialogs opened for reading (New Module form, field "Edit Properties" drawers, field-settings menus, module dropdown, quick-create menu) were closed with Cancel / Escape; the layout editor's Save buttons stayed disabled.
- **Time Entry** module exists (API `timeEntry`, Department-level) – skipped beyond noting it, per request.

---

## 1. Agent UI – top tab bar

URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/tickets/list/all-cases` – screenshot `01-agent-tickets-list.png`

Tabs in order (all visible at 1600 px, **no "More"/overflow menu**):

| # | Tab | Link |
|---|---|---|
| 1 | Tickets | `/tickets/list` |
| 2 | Knowledge Base | `/knowledge-base/page#Solutions` |
| 3 | Contracts | `/contracts/list` |
| 4 | Customers | `/contacts/list` (left switcher: Contact / Account) |
| 5 | Analytics | `/dashboards/details` |
| 6 | Activities | `/activities/list` (Tasks / Calls / Events) |
| 7 | Community | `/community/page#Community/forum` |
| 8 | Social | `/social/brands` |
| 9 | Chat | `/chat/page#Chat` |
| 10 | IM | `/im/page` |

Right side of the bar: department selector "Anyware Software ▾", "Add new Ticket" (+) with "Quick Action Dropdown", GlobalSearch, Notification, Marketplace, Setup (gear), avatar "MM", "Applications menu".

Quick Action dropdown (screenshot `23-quick-create-dropdown.png`), with shortcuts: Ticket T+, Article K+, Contract Q+, Account A+, Contact C+, Report R+, Dashboard D+, Topic F+, Call L+, Task P+, Event E+, WhatsApp Message W+.

Tickets left rail: HQ, Team Feeds, Views, Agent Queue, Team Queue, Tags, Scheduled Replies. Bottom bar: My Pins, Chats, Channels, Threads, Contacts, Live Chat, Need Help.

No tab-customisation menu on the tab bar itself; tab customisation lives in Setup → Customization → Modules and Tabs → **Organize Tabs** / **Rename Tabs** (below).

---

## 2. Setup landing

URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup` – screenshot `02-setup-landing.png`

Categories (exact labels): ORGANIZATION (Company, Rebranding, Business Hours, Holiday Lists, Departments, Customer Happiness, Gamescope, Products, Trial Extension) · USER MANAGEMENT (Agents, Zia Agents, Teams, Roles, Profiles, Data Sharing) · CHANNELS (Email, Phone, Chat, Help Center, Instant Messaging, Social, Web Forms, Community) · SELF SERVICE (Guided Conversations, ASAP) · **CUSTOMIZATION (Buttons, Modules and Tabs, Layouts and Fields, General Settings, Notifications, Languages, Skills, Email Templates, Ticket Templates, Time Tracking)** · AUTOMATION (Assignment Rules, Workflows, Blueprint, Macros, Service Level Agreement(SLA), Supervisor Rules, Support Plans, Schedules) · DATA ADMINISTRATION (Sandbox, Import, Export, Data Backup, Zwitch(Data Migration), Bulk Action Log, Recycle Bin) · INTEGRATIONS (Marketplace, Zoho, Microsoft, Others) · DEVELOPER SPACE (APIs, Connections, Functions, Webhooks, Mobile, Extensions) · ZIA (Intelligence, Anomaly, Field Predictions, Answer Bot, Generative AI) · PRIVACY AND SECURITY (Data Subject Requests, Read Receipts, Audit Log, Attachments Control) · PERSONALIZATION (My Profile, My Information, Preferences). Right column: "Product Updates".

Left-nav sub-menus under CUSTOMIZATION:
- **Modules and Tabs** → Manage Modules, Organize Tabs, Rename Tabs
- **Layouts and Fields** → Layouts, Layout Rules, Validation Rules, Fields List, Field Dependencies, Field Permissions, Search Fields, Ticket Status

---

## 3. Modules and Tabs → Manage Modules

URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/modules/list` – screenshot `03-modules-and-tabs.png`

Header: breadcrumb "Customization / Modules and Tabs - Manage Modules", textbox "Search Module", button **New Module**, a help (i) button (opens KB article "Creating Custom Modules" – `03b-modules-kebab-menu.png`).
Intro text: "MODULES – Modules help you organize and manage different types of business data. Zoho Desk provides standard modules with customization options. If you need additional modules to meet your business requirements, you can create new modules (custom modules) and customize them to suit your needs."

Columns: MODULE NAME | API NAME | DATA STORAGE | LAST MODIFIED BY | LAST MODIFIED TIME

| Module | API name | Data storage | Last modified by / time | Edit URL |
|---|---|---|---|---|
| Accounts | accounts | Organization-level | - / - | `…#setup/customization/modules/edit/1483686000000134005` |
| Contacts | contacts | Organization-level | - / - | `…/modules/edit/1483686000000134011` |
| Tickets | tickets | Department-level | - / - | `…/modules/edit/1483686000000134017` |
| Calls | calls | Department-level | - / - | `…/modules/edit/1483686000000134029` |
| Events | events | Department-level | - / - | `…/modules/edit/1483686000000134035` |
| Tasks | tasks | Department-level | - / - | `…/modules/edit/1483686000000134041` |
| Contracts | contracts | Department-level | - / - | `…/modules/edit/1483686000000134053` |
| Products | products | Organization-level | - / - | `…/modules/edit/1483686000000134059` |
| Time Entry | timeEntry | Department-level | - / - | (skipped) |
| Agents | agents | Organization-level | - / - | `…/modules/edit/1483686000000134110` |

**Custom modules: none** (API `organizationModules` – all `isCustomModule:false`). No per-row hover actions/kebab; clicking a module name opens its edit form. No department selector on this page (modules are org-wide; storage column states the scope).

API extras (`organizationModules`): nameField per module – accounts `accountName`, contacts `lastName`, tickets `subject`, …; `hasRecycleBin: true`; `isDeptSpecific` mirrors "Department-level".

### 3a. Edit <Module> form (standard modules) – read only, left via navigation, never saved

Screenshots `04-module-<name>-detail.png`. Example URL `…#setup/customization/modules/edit/1483686000000134017` (Tickets).

Breadcrumb "Customization / Modules and Tabs - Manage Modules / Edit Tickets". Section **Module Information**:
- **Module Name (Plural)*** – editable (Tickets / Contacts / Accounts / Calls / Events / Tasks / Contracts / Products / Agents)
- **Module Name (Singular)*** – editable (Ticket / Contact / Account / Call / Event / Task / Contract / Product / Agent)
- **Description** – textarea, placeholder "Briefly describe the module" (empty for all)
- **Accessible To*** (i: "This module is visible to all departments of the organization.") – chip "All Departments", locked
- **Module Data Storage** (locked) – radio "Organization-level – Data is shared across all departments." / "Department-level – Data is stored separately for each department."; hint "The data storage option can't be changed after the module is created."
- **Module Permission*** (i: "Select the Profiles that can access this module and its data. You can also manage module access and user permissions under Profiles.") – chips: Support Administrator, Agent, [1483686000000008347 = Help Center profile, shown as raw id on Tickets/Calls/Events/Time Entry/Agents only], Supervisor, Support Manager, Newbie Agent, Light Agent
- Footer: **Save**, **Cancel**

Note: the edit form has no rename-tab, show/hide, layouts, fields or related-list links – those live under Organize Tabs / Rename Tabs / Layouts and Fields.

---

## 4. New Module (custom module) – opened, read, Cancelled

URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/modules/new` – screenshot `05-new-module-form.png`

Breadcrumb "Customization / Modules and Tabs - Manage Modules / New Module". Section **Module Information**:

| Field | Control | Placeholder / limits | Default |
|---|---|---|---|
| Module Name (Plural)* | text | "Enter the plural name. e.g., Doctors", maxlength 25 | empty |
| Module Name (Singular)* | text | "Enter the singular name. e.g., Doctor", maxlength 25 | empty |
| Description | textarea | "Briefly describe the module", maxlength 200 | empty |
| Accessible To* | chip (locked) | tooltip "This module is visible to all departments of the organization." | All Departments |
| Module Data Storage | radio | Organization-level ("Choose this option if all departments need to share the same set of records.") / Department-level ("Choose this option if each department needs to maintain its own set of records."); hint "The data storage option can't be changed after the module is created." | **Organization-level** selected |
| Module Permission* | profile picker | placeholder "Select Profiles"; tooltip as above | empty |

Buttons: **Save**, **Save and Go to Layouts**, **Cancel** (Cancel clicked → back to list, list unchanged).
No custom-module count/limit text was shown on the list or the form.

---

## 5. Modules and Tabs → Organize Tabs

URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/modules/organize` – screenshot `06-organize-tabs.png`

Title "Organize Tabs", hint "Drag-drop to change order". Selected tabs (order): Tickets, Knowledge Base, Contracts, Customers, Analytics, Activities, Community, Social, Chat, IM. Right panel **"Unselected Modules"** – empty, illustration with "Drop here to remove". No Save button visible until a change is made (not attempted – drag forbidden).

## 6. Modules and Tabs → Rename Tabs

URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/modules/rename` – screenshot `07-rename-tabs.png`

Cards (icon, tab key, "Display Name <value>"), two per row, in this order:

| Tab key | Display Name |
|---|---|
| Tickets | Tickets |
| Solutions | Knowledge Base |
| Contracts | Contracts |
| Accounts | Accounts |
| Contacts | Contacts |
| Products | Products |
| Reports | Reports |
| Dashboards | Dashboards |
| Activities | Activities |
| Time Entry | Time Entry |
| Community | Community |
| Social | Social |
| Chat | Chat |
| Calls | Calls |
| Tasks | Tasks |
| Events | Events |
| IM | IM |
| Analytics | Analytics |
| Customers | Customers |

---

## 7. Layouts and Fields → Layouts (list)

URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Cases/pagelayout` – screenshots `08-layouts-and-fields.png`, `08b-layouts-module-dropdown.png`

Header: "Layouts", module dropdown (**MODULES AND TABS**, "Search Module": Accounts, Contacts, Tickets, Calls, Events, Tasks, Contracts, Products, Time Entry, Agents), department dropdown (department-level modules only), **Add Layout** button, list/grid view toggle, (i).
Columns: NAME | PROFILES | DISPLAY IN HELP CENTER (Tickets only) | ACTIVE (1) ▾.

| Module | URL key | Layouts (dept "Anyware Software") | Profiles | Add Layout button | Notes |
|---|---|---|---|---|---|
| Tickets | Cases | "Anyware Software" **Default** | Support Administrator, Agent + 3 more | yes | Display in Help Center ✓, Active toggle on; Sales dept has its own default layout "Sales" |
| Contacts | Contacts | "Anyware Software" Default | same | yes | org-level, no dept dropdown |
| Accounts | Accounts | "Anyware Software" Default | same | yes | org-level |
| Products | Products | "Anyware Software" Default | same | yes | org-level |
| Contracts | Contracts | "Anyware Software" (no Default badge) | same | **no** | dept-level |
| Tasks | Tasks | "Anyware Software" Default | same | yes | dept-level |
| Calls | Calls | "Anyware Software" Default | same | yes | dept-level |
| Events | Events | "Anyware Software" Default | same | yes | dept-level |
| Agents | Agents | "Anyware Software" (no Default badge) | same | **no** | org-level |

Each department-level module has one layout per department (API): Tickets/Tasks/Calls/Events/Contracts/Time Entry each have an "Anyware Software" and a "Sales" layout. Sales vs default: Calls, Events, Contracts identical; Tickets differs (Sales: Department is mandatory and first; Resolution moved to Additional Information; Language before Due Date); Tasks differs only in field order.

---

## 8. Layout editor (common to all modules) – Tickets as reference

URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Cases/pagelayout/1483686000000074011` – screenshots `09-tickets-layout-editor.png`, `11-tickets-layout-editor.png`

- Header: "‹ Edit Layout  Tickets  Anyware Software", **Preview** button. Layout card "AS – Anyware Software- Anyware Software ✎ / General" (name – department, description).
- Sections are bordered blocks with an editable title and a trash icon (e.g. "Ticket Information", "Additional Information").
- Each field tile: type icon + label; **mandatory labels are red** (rgb 226,75,75); grey sub-text "Non-removable standard field" (or "Non-removable standard field which is available only on edit mode" for Resolution); tiles are half-width or full-width (Subject, Description, Resolution are full-width).
- Hover on a tile shows: a help-center icon (tooltip "Visible in help center" / "Not visible in help center"; Tickets only) and a gear "Field Settings".
- **Field Settings menu** (`09b-field-settings-menu-*.png`):
  - removable standard field (Phone): Edit Properties, Mark as required, Set Permission, Remove Field
  - picklist (Priority): Edit Properties, **Replace Values**, Mark as required, Set Permission, Remove Field
  - system-mandatory (Contact Name): Mark as required (checked, disabled), Set Permission, Remove Field (disabled); no Edit Properties
- **Edit Field drawer** (opened then Cancel; `09c-…`, `09d-…`):
  - Phone: Label "Phone", Length "120", API Name "phone" (read-only), toggle "Mark as required – Set the field to be mandatory or optional.", toggle "Hide from Help Center – End users cannot view the field in the Help Center.", buttons Update / Cancel.
  - Priority: Label, "Pick list type" = Standard ▾, "Pick List Values" (-None- [Default], High, Medium, Low) with icons (import, clear, sort, expand) and "Add Values in Bulk ▾", API Name "priority", toggle "Nested picklist – A picklist values can contain upto 6 nested values arranged hierarchically. These values must be separated by colons.", toggle "Mark as required", "Editable for End Users ▾ – End users can edit the field while submitting a ticket.", Update / Cancel.
- Right panel **Add Field** palette (drag only – tooltip "Click and drag field to create new fields"; no click-to-add dialog, so the new-field dialog was not opened): see per-module palette below. Then **+ Add Section**.
- Accordion **Unused Fields (n)** (drag back to use) and **Custom Fields Left (n)** with "See how close you are to hitting your custom field limits." table (Fields type | Maximum Limit | Available).
- Footer: **Save**, **Save & Close** (both disabled until a change), **Cancel**.

### 8a. Add Field palette per module

| Palette item | Tickets | Contacts | Accounts | Tasks | Calls | Events | Products | Contracts | Agents |
|---|---|---|---|---|---|---|---|---|---|
| Single Line, Multi-Line, Integer, Percent, Decimal, Currency, Date, Date/Time, Email, Phone, Pick List, Multi-Select, URL, Checkbox | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| LookUp | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – | – | – |
| Colored Picklist | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – | – | – |
| Colored Multiselect | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – | – | – |
| Formula | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – | ✓ | ✓ |
| **Count** | 18 | 18 | 18 | 18 | 18 | 18 | 14 | 15 | 15 |

(Fax and Autonumber exist as system field types – Accounts "Fax", Tickets "Ticket Id" Autonumber – but are not in the palette.)

### 8b. Custom-field limits ("Custom Fields Left" panel, all "Available" = max; no custom fields exist)

| Fields type (exact label) | Tickets / Contacts / Accounts / Tasks | Products / Agents | Calls | Events | Contracts |
|---|---|---|---|---|---|
| String Fields (Single Line , Pick List , Email , Phone and URL) | 100 | 100 | 100 | 80 | 20 |
| Other Fields (Multi-Select and Multi-Line) | 30 | 30 | 25 | 25 | 5 |
| Integer | 20 | 20 | 10 | 10 | 5 |
| Decimal,Percentage and Currency | 20 | 20 | 10 | 10 | 5 |
| Date | 20 | 20 | 15 | 15 | 5 |
| Date/Time | 20 | 20 | 15 | 15 | 5 |
| Boolean Field (Checkbox) | 20 | 20 | 15 | 15 | 5 |
| LookUp | 5 | – | 5 | 5 | – |
| Encrypted Fields (inclusive of String, Date, Decimal, Percentage, Currency and Integer fields) | 10 | 10 | 10 | 10 | 10 |
| Formula Field (inclusive of String, Date, DateTime, Decimal, Currency and Boolean fields) | 10 | 10 | 10 | 10 | 10 |
| **Custom Fields Left (header)** | **245** | **240** | **205** | **185** | **60** |

---

## 9. Per-module layouts and fields

Legend: "Mandatory" = API `isMandatory` plus red label in the editor; "system-mandatory" = API `isSystemMandatory` (cannot be un-required); "non-removable" = API `isRemovable:false` / UI "Non-removable standard field". All fields in this org are **System** (no custom fields). "Type (UI)" is the DATA TYPE shown on the Fields List page; "API type" from `organizationFields`/`layouts`. Default layout of department "Anyware Software" is shown.

### Tickets

- Layout editor URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Cases/pagelayout/1483686000000074011`
- Layout list URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Cases/pagelayout`
- Fields List URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Cases/fieldslist`
- Default layout: **Anyware Software** (Default, department 1483686000000006907), id 1483686000000074011
- Sections (in order): "Ticket Information", "Additional Information"
- Add Field palette (18): Single Line, Multi-Line, Integer, Percent, Decimal, Currency, Date, Date/Time, Email, Phone, Pick List, Multi-Select, URL, Checkbox, LookUp, Colored Picklist, Colored Multiselect, Formula
- Unused Fields (2): Category, Sub Category
- Custom Fields Left: 245

| # | Section | Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Ticket Information | Contact Name | contactId | Lookup | LookUp | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; Visible in help center; maxLength 300; lookup→contacts |
| 2 | Ticket Information | Department | departmentId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; Visible in help center; maxLength 50; lookup→departments |
| 3 | Ticket Information | Account Name | accountId | Lookup | LookUp | No | System | maxLength 300; lookup→accounts |
| 4 | Ticket Information | Email | email | Email | Email | No | System | non-removable; UI: "Non-removable standard field"; Visible in help center; maxLength 120 |
| 5 | Ticket Information | Phone | phone | Phone | Phone | No | System | Not visible in help center; maxLength 120 |
| 6 | Ticket Information | Subject | subject | Single Line | Text | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; Visible in help center; maxLength 255 |
| 7 | Ticket Information | Description | description | Multi-Line | Textarea | No | System | non-removable; UI: "Non-removable standard field"; Visible in help center; maxLength 65535 |
| 8 | Ticket Information | Status | status | Pick List | Picklist | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; Visible in help center; maxLength 120; values: Open / On Hold / Escalated / Closed; default: Open |
| 9 | Ticket Information | Ticket Owner | assigneeId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; Visible in help center; maxLength 120; lookup→agents |
| 10 | Ticket Information | Product Name | productId | Lookup | LookUp | No | System | Visible in help center; maxLength 120; lookup→products |
| 11 | Ticket Information | Resolution | resolution | Multi-Line | Textarea | No | System | non-removable; UI: "Non-removable standard field which is available only on edit mode"; maxLength 65535 |
| 12 | Ticket Information | Skills | entitySkills | Lookup | LookUp | No | System | maxLength 300 |
| 13 | Additional Information | Due Date | dueDate | Date/Time | DateTime | No | System | non-removable; UI: "Non-removable standard field"; Visible in help center; maxLength 300 |
| 14 | Additional Information | Priority | priority | Pick List | Picklist | No | System | non-removable; UI: "Non-removable standard field"; Visible in help center; maxLength 120; values: -None- / High / Medium / Low; default: -None- |
| 15 | Additional Information | Channel | channel | Pick List | Picklist | No | System | non-removable; UI: "Non-removable standard field"; Visible in help center; maxLength 120; values: Phone / Twitter / Email / Facebook / Web / Chat / Forums / Feedback Widget / Instagram; default: Phone |
| 16 | Additional Information | Language | language | Pick List | Picklist | No | System | Not visible in help center; maxLength 255; values: 191 values: -None- / Abkhazian / Afar / Afrikaans / Akan / Albanian / … / Zhuang / Zulu; default: -None- |
| 17 | Additional Information | Classification | classification | Pick List | Picklist | No | System | UI label in editor: "Classifications"; Visible in help center; maxLength 120; values: -None- / Question / Problem / Feature / Others; default: -None- |
| 18 | (UI only) | Layout | layoutId | Lookup | – | Yes (red label) | System | shown in layout editor but not returned by layouts API; UI: "Non-removable standard field"; Visible in help center |

Unused (in module, not on layout):

| Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|
| Category | category | Pick List | Picklist | No | System | maxLength 120; values: Defects |
| Sub Category | subCategory | Pick List | Picklist | No | System | maxLength 120; values: Sub Defects |

Also listed on Fields List page (system, not in layout API): Layout (Lookup, layoutId); Ticket Id (Autonumber, ticketNumber)

Fields List page (21 rows): Account Name – Lookup; Category – Pick List; Channel – Pick List; Classifications – Pick List; Contact Name – Lookup; Department – Lookup; Description – Multi-Line; Due Date – Date/Time; Email – Email; Language – Pick List; Layout – Lookup; Phone – Phone; Priority – Pick List; Product Name – Lookup; Resolution – Multi-Line; Skills – Lookup; Status – Pick List; Sub Category – Pick List; Subject – Single Line; Ticket Id – Autonumber; Ticket Owner – Lookup

### Contacts

- Layout editor URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Contacts/pagelayout/1483686000000074005`
- Layout list URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Contacts/pagelayout`
- Fields List URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Contacts/fieldslist`
- Default layout: **Anyware Software** (Default, organization-level), id 1483686000000074005
- Sections (in order): "Contact Information"
- Add Field palette (18): Single Line, Multi-Line, Integer, Percent, Decimal, Currency, Date, Date/Time, Email, Phone, Pick List, Multi-Select, URL, Checkbox, LookUp, Colored Picklist, Colored Multiselect, Formula
- Unused Fields (6): Street, City, State, Zip, Country, Description
- Custom Fields Left: 245

| # | Section | Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Contact Information | First Name | firstName | Single Line | Text | No | System | maxLength 40 |
| 2 | Contact Information | Last Name | lastName | Single Line | Text | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 200 |
| 3 | Contact Information | Email | email | Email | Email | No | System | maxLength 100 |
| 4 | Contact Information | Secondary Email | secondaryEmail | Email | Email | No | System | maxLength 100 |
| 5 | Contact Information | Account Name | accountId | Lookup | LookUp | No | System | maxLength 100; lookup→accounts |
| 6 | Contact Information | Contact Owner | ownerId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→agents |
| 7 | Contact Information | Twitter | twitter | Single Line | Text | No | System | UI label in editor: "X"; maxLength 100 |
| 8 | Contact Information | Facebook | facebook | Single Line | Text | No | System | maxLength 100 |
| 9 | Contact Information | Phone | phone | Phone | Phone | No | System | maxLength 50 |
| 10 | Contact Information | Mobile | mobile | Phone | Phone | No | System | maxLength 30 |
| 11 | Contact Information | Type | type | Pick List | Picklist | No | System | maxLength 120; values: -None- / Paid user / Prospect; default: -None- |
| 12 | Contact Information | Title | title | Single Line | Text | No | System | maxLength 100 |
| 13 | Contact Information | Language | language | Pick List | Picklist | No | System | maxLength 255; values: 191 values: -None- / Abkhazian / Afar / Afrikaans / Akan / Albanian / … / Zhuang / Zulu; default: -None- |
| 14 | (UI only) | Layout | layoutId | Lookup | – | Yes (red label) | System | shown in layout editor but not returned by layouts API; UI: "Non-removable standard field" |

Unused (in module, not on layout):

| Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|
| Street | street | Single Line | Text | No | System | maxLength 250 |
| City | city | Single Line | Text | No | System | maxLength 100 |
| State | state | Single Line | Text | No | System | maxLength 100 |
| Zip | zip | Single Line | Text | No | System | maxLength 30 |
| Country | country | Single Line | Text | No | System | maxLength 100 |
| Description | description | Multi-Line | Textarea | No | System | maxLength 5000 |

Also listed on Fields List page (system, not in layout API): Layout (Lookup, layoutId)

Fields List page (20 rows): Account Name – Lookup; City – Single Line; Contact Owner – Lookup; Country – Single Line; Description – Multi-Line; Email – Email; Facebook – Single Line; First Name – Single Line; Language – Pick List; Last Name – Single Line; Layout – Lookup; Mobile – Phone; Phone – Phone; Secondary Email – Email; State – Single Line; Street – Single Line; Title – Single Line; X – Single Line; Type – Pick List; Zip – Single Line

### Accounts

- Layout editor URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Accounts/pagelayout/1483686000000074009`
- Layout list URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Accounts/pagelayout`
- Fields List URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Accounts/fieldslist`
- Default layout: **Anyware Software** (Default, organization-level), id 1483686000000074009
- Sections (in order): "Account Information"
- Add Field palette (18): Single Line, Multi-Line, Integer, Percent, Decimal, Currency, Date, Date/Time, Email, Phone, Pick List, Multi-Select, URL, Checkbox, LookUp, Colored Picklist, Colored Multiselect, Formula
- Unused Fields (8): Fax, Industry, Annual Revenue, Street, City, State, Code, Description
- Custom Fields Left: 245

| # | Section | Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Account Information | Account Name | accountName | Single Line | Text | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 200 |
| 2 | Account Information | Email | email | Email | Email | No | System | maxLength 120 |
| 3 | Account Information | Phone | phone | Phone | Phone | No | System | maxLength 30 |
| 4 | Account Information | Website | website | URL | URL | No | System | maxLength 2083 |
| 5 | Account Information | Country | country | Single Line | Text | No | System | maxLength 100 |
| 6 | Account Information | Account Owner | ownerId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→agents |
| 7 | (UI only) | Layout | layoutId | Lookup | – | Yes (red label) | System | shown in layout editor but not returned by layouts API; UI: "Non-removable standard field" |

Unused (in module, not on layout):

| Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|
| Fax | fax | Fax | Fax | No | System | maxLength 30 |
| Industry | industry | Pick List | Picklist | No | System | maxLength 120; values: 17 values: -None- / ASP / Data/Telecom OEM / ERP / Government/Military / Large Enterprise / … / Systems Integrator / Wireless Industry |
| Annual Revenue | annualrevenue | Currency | Currency | No | System | maxLength 19 |
| Street | street | Single Line | Text | No | System | maxLength 250 |
| City | city | Single Line | Text | No | System | maxLength 100 |
| State | state | Single Line | Text | No | System | maxLength 100 |
| Code | code | Single Line | Text | No | System | maxLength 30 |
| Description | description | Multi-Line | Textarea | No | System | maxLength 5000 |

Also listed on Fields List page (system, not in layout API): Layout (Lookup, layoutId)

Fields List page (15 rows): Account Name – Single Line; Account Owner – Lookup; Annual Revenue – Currency; City – Single Line; Code – Single Line; Country – Single Line; Description – Multi-Line; Email – Email; Fax – Fax; Industry – Pick List; Layout – Lookup; Phone – Phone; State – Single Line; Street – Single Line; Website – URL

### Products

- Layout editor URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Products/pagelayout/1483686000000074001`
- Layout list URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Products/pagelayout`
- Fields List URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Products/fieldslist`
- Default layout: **Anyware Software** (Default, organization-level), id 1483686000000074001
- Sections (in order): "Product Information"
- Add Field palette (14): Single Line, Multi-Line, Integer, Percent, Decimal, Currency, Date, Date/Time, Email, Phone, Pick List, Multi-Select, URL, Checkbox
- Unused Fields (2): Manufacturer, Unit Price
- Custom Fields Left: 240

| # | Section | Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Product Information | Department | departmentIds | Multi-Select | Multiselect | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 50; values:  |
| 2 | Product Information | Product Name | productName | Single Line | Text | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 120 |
| 3 | Product Information | Product Code | productCode | Single Line | Text | No | System | maxLength 120 |
| 4 | Product Information | Product Category | productCategory | Pick List | Picklist | No | System | maxLength 120; values: -None- / Hardware / Software / CRM Applications; default: -None- |
| 5 | Product Information | Product Owner | ownerId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→agents |
| 6 | Product Information | Description | description | Multi-Line | Textarea | No | System | maxLength 5000 |
| 7 | (UI only) | Layout | layoutId | Lookup | – | Yes (red label) | System | shown in layout editor but not returned by layouts API; UI: "Non-removable standard field" |

Unused (in module, not on layout):

| Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|
| Manufacturer | manufacturer | Pick List | Picklist | No | System | maxLength 120; values: -None- / AltvetPet Inc. / LexPon Inc. / MetBeat Corp |
| Unit Price | unitPrice | Currency | Currency | No | System | maxLength 19 |

Also listed on Fields List page (system, not in layout API): Layout (Lookup, layoutId)

Fields List page (9 rows): Department – Multi-Select; Description – Multi-Line; Layout – Lookup; Manufacturer – Pick List; Product Category – Pick List; Product Code – Single Line; Product Name – Single Line; Product Owner – Lookup; Unit Price – Currency

### Contracts

- Layout editor URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Contracts/pagelayout/1483686000000074016`
- Layout list URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Contracts/pagelayout`
- Fields List URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Contracts/fieldslist`
- Default layout: **Anyware Software** (Default, department 1483686000000006907), id 1483686000000074016
- Sections (in order): "Contract Information", "Description Information"
- Add Field palette (15): Single Line, Multi-Line, Integer, Percent, Decimal, Currency, Date, Date/Time, Email, Phone, Pick List, Multi-Select, URL, Checkbox, Formula
- Unused Fields (0): "No fields available"
- Custom Fields Left: 60

| # | Section | Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Contract Information | Department | departmentId | Lookup | LookUp | Yes (red label) | System | non-removable; UI: "Non-removable standard field"; maxLength 100; lookup→departments |
| 2 | Contract Information | Contract Owner | ownerId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→agents |
| 3 | Contract Information | Contract Name | contractName | Single Line | Text | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 200 |
| 4 | Contract Information | Contract Number | contractNumber | Single Line | Text | No | System | maxLength 100 |
| 5 | Contract Information | Account Name | accountId | Lookup | LookUp | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 100; lookup→accounts |
| 6 | Contract Information | Product Name | productId | Lookup | LookUp | No | System | maxLength 100; lookup→products |
| 7 | Contract Information | Contract Start Date | startDate | Date | Date | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 50 |
| 8 | Contract Information | Contract End Date | endDate | Date | Date | No | System | non-removable; UI: "Non-removable standard field"; maxLength 50 |
| 9 | Contract Information | Support Plan | associatedSupportPlanId |  | LookUp | Yes (red label) | System | system-mandatory; UI: "Non-removable standard field"; maxLength 100; lookup→supportPlans |
| 10 | Description Information | Description | description | Multi-Line | Textarea | No | System | maxLength 5000 |

Also listed on Fields List page (system, not in layout API): SLA Name (Lookup, associatedSLAId)

Fields List page (10 rows): Account Name – Lookup; Contract End Date – Date; Contract Name – Single Line; Contract Number – Single Line; Contract Owner – Lookup; Contract Start Date – Date; Department – Lookup; Description – Multi-Line; Product Name – Lookup; SLA Name – Lookup

### Tasks

- Layout editor URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Tasks/pagelayout/1483686000000074003`
- Layout list URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Tasks/pagelayout`
- Fields List URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Tasks/fieldslist`
- Default layout: **Anyware Software** (Default, department 1483686000000006907), id 1483686000000074003
- Sections (in order): "Task Information"
- Add Field palette (18): Single Line, Multi-Line, Integer, Percent, Decimal, Currency, Date, Date/Time, Email, Phone, Pick List, Multi-Select, URL, Checkbox, LookUp, Colored Picklist, Colored Multiselect, Formula
- Unused Fields (0): "No fields available"
- Custom Fields Left: 245

| # | Section | Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Task Information | Department | departmentId | Lookup | LookUp | Yes (red label) | System | non-removable; UI: "Non-removable standard field"; maxLength 50; lookup→departments |
| 2 | Task Information | Subject | subject | Single Line | Text | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 255 |
| 3 | Task Information | Ticket | ticketId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→tickets |
| 4 | Task Information | Due Date | dueDate | Date/Time | DateTime | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120 |
| 5 | Task Information | Task Owner | ownerId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→agents |
| 6 | Task Information | Contact Name | contactId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 300; lookup→contacts |
| 7 | Task Information | Status | status | Pick List | Picklist | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; values: Not Started / Deferred / In Progress / Completed / Waiting on someone else / Canceled; default: Not Started |
| 8 | Task Information | Priority | priority | Pick List | Picklist | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; values: High / Highest / Low / Lowest / Normal; default: High |
| 9 | Task Information | Category | category | Pick List | Picklist | No | System | maxLength 120; values: -None-; default: -None- |
| 10 | Task Information | Remind At | reminder | Date/Time | DateTime | No | System | non-removable; UI: "Non-removable standard field"; maxLength 100 |
| 11 | Task Information | Description | description | Multi-Line | Textarea | No | System | maxLength 5000 |
| 12 | (UI only) | Layout | layoutId | Lookup | – | Yes (red label) | System | shown in layout editor but not returned by layouts API; UI: "Non-removable standard field" |

Also listed on Fields List page (system, not in layout API): Layout (Lookup, layoutId)

Fields List page (12 rows): Category – Pick List; Contact Name – Lookup; Department – Lookup; Description – Multi-Line; Due Date – Date/Time; Layout – Lookup; Priority – Pick List; Remind At – Date/Time; Status – Pick List; Subject – Single Line; Task Owner – Lookup; Ticket – Lookup

### Calls

- Layout editor URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Calls/pagelayout/1483686000000110528`
- Layout list URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Calls/pagelayout`
- Fields List URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Calls/fieldslist`
- Default layout: **Anyware Software** (Default, department 1483686000000006907), id 1483686000000110528
- Sections (in order): "Call Information"
- Add Field palette (18): Single Line, Multi-Line, Integer, Percent, Decimal, Currency, Date, Date/Time, Email, Phone, Pick List, Multi-Select, URL, Checkbox, LookUp, Colored Picklist, Colored Multiselect, Formula
- Unused Fields (0): "No fields available"
- Custom Fields Left: 205

| # | Section | Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Call Information | Department | departmentId | Lookup | LookUp | Yes (red label) | System | non-removable; UI: "Non-removable standard field"; maxLength 50; lookup→departments |
| 2 | Call Information | Subject | subject | Single Line | Text | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 255 |
| 3 | Call Information | Direction | direction | Single Line | Text | No | System | non-removable; UI: "Non-removable standard field"; maxLength 255 |
| 4 | Call Information | Call Status | status | Date/Time | DateTime | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 120 |
| 5 | Call Information | Ticket | ticketId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→tickets |
| 6 | Call Information | Contact Name | contactId | Lookup | LookUp | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→contacts |
| 7 | Call Information | Priority | priority | Pick List | Picklist | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; values: High / Highest / Low / Lowest / Normal; default: High |
| 8 | Call Information | Call Owner | ownerId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→agents |
| 9 | Call Information | Description | description | Multi-Line | Textarea | No | System | maxLength 10000 |
| 10 | Call Information | Remind me | reminder | Date/Time | DateTime | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120 |
| 11 | (UI only) | Layout | layoutId | Lookup | – | Yes (red label) | System | shown in layout editor but not returned by layouts API; UI: "Non-removable standard field" |

Unused (in module, not on layout):

| Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|
| Created By | creatorId | Lookup | LookUp | No | System | maxLength 25; lookup→agents |
| Modified By | modifiedBy | Lookup | LookUp | No | System | maxLength 25; lookup→agents |

Also listed on Fields List page (system, not in layout API): Layout (Lookup, layoutId)

Fields List page (13 rows): Call Owner – Lookup; Call Status – Date/Time; Contact Name – Lookup; Created By – Lookup; Department – Lookup; Description – Multi-Line; Direction – Single Line; Layout – Lookup; Modified By – Lookup; Priority – Pick List; Remind me – Date/Time; Subject – Single Line; Ticket – Lookup

### Events

- Layout editor URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Events/pagelayout/1483686000000110526`
- Layout list URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Events/pagelayout`
- Fields List URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Events/fieldslist`
- Default layout: **Anyware Software** (Default, department 1483686000000006907), id 1483686000000110526
- Sections (in order): "Event Information"
- Add Field palette (18): Single Line, Multi-Line, Integer, Percent, Decimal, Currency, Date, Date/Time, Email, Phone, Pick List, Multi-Select, URL, Checkbox, LookUp, Colored Picklist, Colored Multiselect, Formula
- Unused Fields (0): "No fields available"
- Custom Fields Left: 185

| # | Section | Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Event Information | Department | departmentId | Lookup | LookUp | Yes (red label) | System | non-removable; UI: "Non-removable standard field"; maxLength 50; lookup→departments |
| 2 | Event Information | Subject | subject | Single Line | Text | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 255 |
| 3 | Event Information | Category | category | Pick List | Picklist | No | System | maxLength 120; values: -None- / Meeting / Demo; default: -None- |
| 4 | Event Information | Status | status | Pick List | Picklist | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; values: Not Started / Deferred / In Progress / Canceled / Completed; default: Not Started |
| 5 | Event Information | Start Time | startTime | Date/Time | DateTime | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 100 |
| 6 | Event Information | Ticket | ticketId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→tickets |
| 7 | Event Information | Contact Name | contactId | Lookup | LookUp | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→contacts |
| 8 | Event Information | Priority | priority | Pick List | Picklist | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; values: High / Highest / Low / Lowest / Normal; default: High |
| 9 | Event Information | Event Owner | ownerId | Lookup | LookUp | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; lookup→agents |
| 10 | Event Information | Description | description | Multi-Line | Textarea | No | System | maxLength 10000 |
| 11 | Event Information | Remind me | reminder | Date/Time | DateTime | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120 |
| 12 | (UI only) | Layout | layoutId | Lookup | – | Yes (red label) | System | shown in layout editor but not returned by layouts API; UI: "Non-removable standard field" |

Unused (in module, not on layout):

| Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|
| Created By | creatorId | Lookup | LookUp | No | System | maxLength 25; lookup→agents |
| Modified By | modifiedBy | Lookup | LookUp | No | System | maxLength 25; lookup→agents |

Also listed on Fields List page (system, not in layout API): Layout (Lookup, layoutId)

Fields List page (14 rows): Category – Pick List; Contact Name – Lookup; Created By – Lookup; Department – Lookup; Description – Multi-Line; Event Owner – Lookup; Layout – Lookup; Modified By – Lookup; Priority – Pick List; Remind me – Date/Time; Start Time – Date/Time; Status – Pick List; Subject – Single Line; Ticket – Lookup

### Agents

- Layout editor URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Agents/pagelayout/1483686000000156001`
- Layout list URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Agents/pagelayout`
- Fields List URL: `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup#setup/customization/Agents/fieldslist`
- Default layout: **Anyware Software** (Default, organization-level), id 1483686000000156001
- Sections (in order): "Agent Information", "Agent Additional Information"
- Add Field palette (15): Single Line, Multi-Line, Integer, Percent, Decimal, Currency, Date, Date/Time, Email, Phone, Pick List, Multi-Select, URL, Checkbox, Formula
- Unused Fields (0): "No fields available"
- Custom Fields Left: 240

| # | Section | Field label | API name | Type (UI) | API type | Mandatory | System/Custom | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Agent Information | First Name | firstName | Single Line | Text | No | System | maxLength 50 |
| 2 | Agent Information | Last Name | lastName | Single Line | Text | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 50 |
| 3 | Agent Information | Email | emailId | Email | Email | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 100 |
| 4 | Agent Information | Status | status | Pick List | Picklist | No | System | maxLength 20; values: Active / Disabled; default: Active |
| 5 | Agent Information | Department | associatedDepartmentIds | Multi-Select | Multiselect | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 25; values:  |
| 6 | Agent Information | Role and Permission | rolePermissionType | Lookup | LookUp | Yes (red label) | System | system-mandatory; non-removable; UI: "Non-removable standard field"; maxLength 25 |
| 7 | Agent Additional Information | Channel Expert | channelExpert | Multi-Select | Multiselect | No | System | non-removable; UI: "Non-removable standard field"; maxLength 120; values: -None-; default: -None- |
| 8 | Agent Additional Information | About | aboutInfo | Multi-Line | Textarea | No | System | maxLength 255 |
| 9 | Agent Additional Information | Phone | phone | Phone | Phone | No | System | maxLength 30 |
| 10 | Agent Additional Information | Mobile | mobile | Phone | Phone | No | System | maxLength 30 |
| 11 | Agent Additional Information | Extn | extn | Phone | Phone | No | System | maxLength 30 |

Fields List page (11 rows): About – Multi-Line; Channel Expert – Multi-Select; Department – Multi-Select; Email – Email; Extn – Phone; First Name – Single Line; Last Name – Single Line; Mobile – Phone; Phone – Phone; Role and Permission – Lookup; Status – Pick List

### Time Entry

Exists (API `timeEntry`, Department-level, layouts "Anyware Software" 1483686000000074007 and "Sales" 1483686000000435673, edit form `…/modules/edit/1483686000000134065`). Not inventoried further, per request (raw API JSON is in `api/` anyway).

### Per-module field counts

| Module | Storage | Sections on default layout | Fields on layout (incl. UI-only "Layout") | Unused fields | Fields List rows | Custom fields | Custom Fields Left |
|---|---|---|---|---|---|---|---|
| Tickets | Department | 2 (Ticket Information, Additional Information) | 18 | 2 (Category, Sub Category) | 21 | 0 | 245 |
| Contacts | Organization | 1 (Contact Information) | 14 | 6 (Street, City, State, Zip, Country, Description) | 20 | 0 | 245 |
| Accounts | Organization | 1 (Account Information) | 7 | 8 (Fax, Industry, Annual Revenue, Street, City, State, Code, Description) | 15 | 0 | 245 |
| Products | Organization | 1 (Product Information) | 7 | 2 (Manufacturer, Unit Price) | 9 | 0 | 240 |
| Contracts | Department | 2 (Contract Information, Description Information) | 10 | 0 | 10 | 0 | 60 |
| Tasks | Department | 1 (Task Information) | 12 | 0 | 12 | 0 | 245 |
| Calls | Department | 1 (Call Information) | 11 | 0 (Created By / Modified By exist but are not offered) | 13 | 0 | 205 |
| Events | Department | 1 (Event Information) | 12 | 0 (Created By / Modified By exist but are not offered) | 14 | 0 | 185 |
| Agents | Organization | 2 (Agent Information, Agent Additional Information) | 11 | 0 | 11 | 0 | 240 |

Observations worth noting for parity:
- Every module except Agents and Contracts shows a non-removable, red (mandatory) **"Layout"** lookup field in the editor that the layouts API does not return.
- Contracts' "Support Plan" (`associatedSupportPlanId`, system-mandatory) is on the layout, but the Fields List page shows "SLA Name" (`associatedSLAId`) instead.
- Calls "Call Status" is typed **Date/Time** on both the API and the Fields List page (looks like a Zoho quirk).
- Tickets "Department" is not mandatory on the default department's layout but is mandatory on the "Sales" layout.
- Ticket Category / Sub Category currently hold the values "Defects" / "Sub Defects", and a Category → Sub Category field dependency exists.
- Contacts "Twitter" field shows the label **"X"** in the editor and Fields List (API displayLabel "Twitter").

---

## 10. Other Layouts-and-Fields pages (Tickets / Anyware Software)

| Page | URL | Exact on-screen content |
|---|---|---|
| Layout Rules | `…#setup/customization/Cases/layout-rules` (`12-layout-rules.png`) | "Layout Rules · Tickets · Anyware Software · **Create Rule** · No layout rules here. Add a layout rule to control the order in which fields are presented to users." |
| Validation Rules | `…#setup/customization/Cases/validation-rules` (`13-validation-rules.png`) | "Validation Rules · Tickets · Anyware Software · **Create Rule** · No validation rules here. Add a validation rule to verify data an agent enters within a record before saving it." |
| Fields List | `…#setup/customization/Cases/fieldslist` (`14-fields-list.png`) | Breadcrumb "Customization / Layouts and Fields / Fields List / Tickets", button **Create Or Edit Fields**, intro "FIELDS LIST – When you have several fields across multiple departments, you may lose track of their details over time… you will be taken to the edit layout page of the respective department when you create or edit fields of a selected module." Columns FIELD NAME, DATA TYPE, API NAME, ASSOCIATED DEPARTMENT ("View Departments", department-level modules only). |
| Field Dependencies | `…#setup/customization/Cases/fieldsmap` (`15-field-dependencies.png`) | "Field Dependencies · Tickets · Anyware Software · **Add New Dependency** · PARENT FIELD / CHILD FIELD" – one row: **Category → Sub Category** |
| Field Permissions | `…#setup/customization/Cases/fieldpermissions/1483686000000008343` (`16-field-permissions.png`) | Breadcrumb "… / Field Permissions / Tickets / Support Administrator"; intro "FIELD PERMISSIONS – Control who sees what information and who can perform what task…"; columns FIELD NAME, DATA TYPE, PERMISSION LEVEL, ASSOCIATED DEPARTMENT. Rows (Support Administrator): Account Name Lookup R&W; Agent Responded Time Date/Time Read Only; Category Pick List R&W; CCs Multi-Select R&W; Channel R&W; Classifications R&W; Contact Name R&W; Created By Read Only; Created Time Read Only; Customer Responded Time Integer Read Only; Department R&W; Description R&W; Due Date R&W; Email R&W; Happiness Rating Pick List Read Only; Is Escalated Boolean Read Only; Is Overdue Boolean Read Only; isSpam Boolean Read Only; Language R&W; Layout R&W; Modified By Read Only; Modified Time Read Only; Number of Comments Integer Read Only; Number of Threads Integer Read Only; Phone R&W; Priority R&W; Product Name R&W; Resolution R&W; Skills R&W; Status R&W; Sub Category R&W; Subject R&W; Thread Status Integer Read Only; Ticket Closed Time Read Only; Ticket Id Autonumber Read Only; Ticket On Hold Time Date/Time R&W; Ticket Owner R&W; Time to Respond Date/Time R&W; To Address Single Line Read Only |
| Search Fields | `…#setup/customization/Cases/searchfields` (`17-search-fields.png`) | "Search Fields · Tickets · All Fields / Specific Fields" + list: Contact Name, Email, Phone, Subject, ThreadsComments, Status, Product Name, Ticket Owner, Created By, Modified By, Ticket Id, Resolution, To Address, Number of Threads, Account Name, Due Date, Priority, Channel, Category, Sub Category, Is Overdue, Is Escalated, Classifications, Number of Comments, Team, Language, Relationship Type |
| Ticket Status | `…#setup/customization/1483686000000006907/requeststatus` (`18-ticket-status.png`) | "Ticket Status · Anyware Software · **Add Status**"; columns STATUS, STATUS TYPE, FALL-BACK TO DEFAULT: Open (OPEN, Default), On Hold (ON HOLD), Escalated (OPEN), Closed (CLOSED). A "New – Pause the SLA clock with the new On Hold State" info overlay appears first ("Got It! / Learn More"). |

---

## 11. Record views (read only)

### Tickets list
URL `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/tickets/list/all-cases` (`01-agent-tickets-list.png`). Header "★ All Tickets (01) ▾", Filter, "My saved filters", "Total Count", "Classic View ▾", Sort-by, a view-switch icon. One card: "Here's your first ticket." #100 · Lawrence · Zoho · 11:45 AM · 07 Oct 11:45 AM · Open · owner MM.

### Ticket detail (#100)
URL `…/tickets/details/1483686000000423244` (`20-ticket-detail.png`). Left: mini list. **Ticket Properties** panel (edit pencil): Contact Info (Lawrence, Zoho, support@zohodesk.com, 1 888 900 9646, https://www.zoho.com/) · **Key Information** (Ticket Owner, Status, Due Date, Tags) · **Ticket Information** (Phone, Product Name, Skills) · **Additional Information** (Priority, Channel, Language, Classifications). Main: subject, #100, contact, time, timer "00 : 00 : 00"; tabs **1 CONVERSATION ▾, RESOLUTION, TIME ENTRY, ATTACHMENT, ACTIVITY, APPROVAL, HISTORY**; bottom actions Apply Macro, Remote Assist, Close Ticket; top-right Reply All ▾, comment, "…", layers icon. (Layout sections drive the properties panel; Key Information is a fixed block.)

### Contacts list
URL `…/contacts/list/all-contacts` (`21-contacts-list.png`). Left switcher Contact / Account. Header "All Contacts ( All )", Total Count, Classic View; A–Z index bar (ALL, A…Z). One record: Lawrence · Zoho · support@zohodesk.com · 1 888 900 9646.

### Contact detail (Lawrence)
URL `…/contacts/details/1483686000000423186` (`22-contact-detail.png`). **Contact Properties** panel: Contact Owner, Email, Mobile ("Add Mobile"), Phone, Language ("Add Language"), Facebook, Twitter, Title, Contact Created Time, Layout. Header: avatar LA, Lawrence, **Add Ticket**, account "Zoho". Related tabs: **OVERVIEW, HISTORY, ACTIVITIES, TICKET INTERACTION, TICKETS, TIME ENTRY, HAPPINESS RATING, PRODUCTS**. Overview widgets: All Tickets 1, Open Tickets 1, Overdue Tickets 0, Happiness Rating 0%; Tickets ALL (1) / OPEN (1) / ON HOLD (0); Traffic Analysis (Email 100%); Average Handling Time (Last 6 months): First Response Time, Response Time, Resolution Time.

---

## 12. URLs visited (Setup)

- `https://desk.zoho.com/agent/anywaresoftwaredesk/anyware-software/setup`
- `…/setup#setup/customization/modules/list` (Manage Modules)
- `…/setup#setup/customization/modules/edit/{1483686000000134005|134011|134017|134029|134035|134041|134053|134059|134065|134110}`
- `…/setup#setup/customization/modules/new`
- `…/setup#setup/customization/modules/organize`
- `…/setup#setup/customization/modules/rename`
- `…/setup#setup/customization/{Cases|Contacts|Accounts|Products|Contracts|Tasks|Calls|Events|Agents}/pagelayout`
- `…/setup#setup/customization/Cases/pagelayout/1483686000000074011`, `Contacts/pagelayout/1483686000000074005`, `Accounts/pagelayout/1483686000000074009`, `Products/pagelayout/1483686000000074001`, `Contracts/pagelayout/1483686000000074016`, `Tasks/pagelayout/1483686000000074003`, `Calls/pagelayout/1483686000000110528`, `Events/pagelayout/1483686000000110526`, `Agents/pagelayout/1483686000000156001`
- `…/setup#setup/customization/Cases/{layout-rules|validation-rules|fieldslist|fieldsmap|searchfields}`, `…/Cases/fieldpermissions/1483686000000008343`, `…/1483686000000006907/requeststatus`
- `…/setup#setup/customization/{Contacts|Accounts|Products|Contracts|Tasks|Calls|Events|Agents}/fieldslist`

Note: the Setup UI is a React shell that hosts the classic pages in an iframe (`/support/anywaresoftwaredesk/ShowHomePage.do`). A deep-link hash URL only routes after a full reload.

## 13. Not reached / limitations

- **New-field dialog**: the Add Field palette is drag-only ("Click and drag field to create new fields"). Dragging was not allowed, so the per-type new-field property dialogs were not seen. Edit-Properties drawers for an existing Phone field and Priority picklist were captured instead.
- **Add Layout**, **Create Rule**, **Add New Dependency**, **Add Status**, **Create Or Edit Fields**, and tab rename/organize were not opened, because they start create/edit flows.
- Layout editors were captured only for department "Anyware Software". "Sales" layouts were compared through the API only.
- No custom modules or custom fields exist, so there were no custom-module settings to read. No limit on the number of custom modules was shown anywhere.
- Related-list configuration is not a separate Setup page in this Desk org. Related lists were seen only as record-detail tabs.
- Accounts, Tasks, Calls, Events, Contracts and Products record views were not opened. Only Tickets and Contacts were requested.
