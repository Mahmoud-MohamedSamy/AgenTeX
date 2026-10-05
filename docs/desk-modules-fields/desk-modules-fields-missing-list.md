# Modules, tabs and fields — what Zoho Desk has that TAVI Desk is missing

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging), bundle `index-Cegqr3UG.js` |
| Reference | Zoho Desk, checked live on 5 Oct 2026 (org "anywaresoftwaredesk", Enterprise trial, admin "CEO", read-only) plus Zoho's help and API docs |
| Scope | Modules and Fields, layouts, fields, Organize Tabs and the tab bar, for Tickets, Contacts, Accounts, Products, Calls, Events, Tasks, Contracts and custom modules. **Time Entry skipped** (user, 5 Oct 2026) |
| Already in Plane | **NDC-1879** "Customization (modules, fields, layouts): features Zoho Desk has that Desk is missing" — 6 items, not repeated below. NDC-1866 item 16 (ticket number format) |
| Test spec | `docs/desk-modules-fields/spec-desk-modules-fields.md` (Group Z: Z1–Z7 = filed items, Z8–Z19 = items 1–12 below) |
| Status | **Draft for review. Nothing filed in Plane** (user asked for no Plane changes) |

How each side was checked:
- **Zoho Desk:** opened in headless Edge. Looked at the tab bar, Setup → Modules and Tabs (Manage Modules, New Module form, Organize Tabs, Rename Tabs) and Layouts and Fields (Layouts, the layout editor of every module, Layout Rules, Validation Rules, Fields List, Field Dependencies, Field Permissions, Search Fields, Ticket Status). Also one ticket and one contact. Nothing was saved, created, dragged or switched.
- **TAVI Desk:** read from the build's code, the live API (GET only) and the setup pages, as the owner and the second admin. Nothing was changed on the tenant.

"Live" = seen on screen in Zoho Desk. "Docs" = Zoho help pages only.

**Evidence.** To see all images inline, open [`evidence/evidence-report.md`](evidence/evidence-report.md). There is one annotated image per item in `evidence/`. Each has TAVI on the left and live Zoho Desk on the right, with numbered boxes and a "Behaviour | Zoho | TAVI | Match" table:
- `01-tab-bar-set-by-admin-vs-zoho.png`
- `02-rename-any-tab-vs-zoho.png`
- `03-search-fields-vs-zoho.png`
- `04-standard-fields-protected-vs-zoho.png`
- `05-department-layouts-vs-zoho.png`
- `06-standard-fields-missing-vs-zoho.png`
- `07-picklist-tools-vs-zoho.png`
- `08-rounding-options-vs-zoho.png` (Zoho side is docs only)
- `09-lookup-options-vs-zoho.png` (Zoho side is docs only)
- `10-layout-help-center-vs-zoho.png`
- `11-ticket-status-vs-zoho.png`
- `12-agents-module-vs-zoho.png`

The unannotated screenshots are in `evidence/originals/`. To rebuild an image, edit `evidence/configs/` and run `node make-evidence.js configs/<item>.json`. All captures were read-only; menus and panels were closed with Cancel or Escape.

---

## Already done in TAVI Desk

- Module list with search, paging, enable/disable, reorder, and a row menu per module.
- Create a custom module: plural and singular name, description, storage by organisation or by department (cannot change later), and which profiles can open it.
- Rename a module (singular, plural, API name, icon, description). Deleting a module is allowed only when it has no records.
- Module record visibility: Public Read/Write/Delete, Public Read Only, Private. Access Control by users, profiles or org units.
- Layout builder with Create, Quick Create and Detail views. Sections in 1 or 2 columns, tab order, and section names in English and Arabic.
- Several layouts per module: create, clone, set default, enable/disable, and delete with "Move records to" another layout. Layouts are assigned to profiles.
- 33 field types, including all of Zoho's custom field types except colour-coded and nested picklists.
- Field properties: required, read-only, unique, regex, conditional visibility, default value and description. Labels in English, Arabic and French.
- Remove a field to Unused Fields, or delete it permanently with a usage check.
- Picklist option replacement when you remove an option that records still use.
- Field Dependency rules (show, hide, require, make optional).
- Field Listing with a layout filter, and Field Permissions (Read and Write, Read Only, Don't Show).
- Organize Tabs (show, hide, reorder, reset) and a "More modules" overflow.
- Customers and Activities group their modules the same way Zoho does.
- **Desk has more than Zoho:**
  - Deleting and disabling a custom module.
  - More than one layout on a custom module.
  - Field types Zoho does not have: auto-number, user, rich text, subform, rollup summary, file, image, address, location and others.
  - Unique values across modules, auto-fill, quick-create triggers.
  - Custom data types and capabilities.
  - Up to 512 custom fields per layout, against Zoho's 230 per module.

---

## Missing — tabs and modules

1. **Tab bar set by the admin for everyone.** Zoho: Setup → Modules and Tabs → Organize Tabs; a hidden module is hidden for every profile, and at least one module must stay. Today TAVI's Organize Tabs is personal ("Changes apply to you only"). — Live. (Z8)
2. **Rename any tab.** Zoho has a Rename Tabs page with 19 display names, including Knowledge Base, Customers, Activities, Analytics, Reports, Dashboards, Community, Social, Chat and IM. Today TAVI can rename only record modules, from the module list. — Live. (Z9)

## Missing — fields

3. **Search Fields setting.** Pick which fields are used when searching a module (All Fields / Specific Fields). Docs say up to 10 per module, and 6 for Contracts, Products and Activities. Today there is no such setting. — Live. (Z10)
4. **Protect the standard fields.**
   - **Zoho:**
     - Core fields say "Non-removable standard field".
     - System-mandatory fields cannot be made optional.
     - Other standard fields can only be moved to Unused Fields, never deleted.
     - Only custom fields are marked as custom.
   - **TAVI today:**
     - Every seeded field is marked "Custom Field" (`isCustomField: true`).
     - Calls, Events and Tasks Subject, Product Name and Contract Name can be deleted.
     - Ticket Subject and Status can be made optional, and then removed.
     - Contact, Department, Email, Description, Due Date, Priority, Channel, Ticket Owner and Resolution on tickets can be removed from the layout.
     - These come from the API permission flags (`canMarkRequired`, `canRemoveFromLayout`); the flags were read, not clicked.
   - — Live. (Z11)
5. **Department-specific layouts and the Department field.**
   - **Zoho:**
     - Tickets, Tasks, Calls, Events and Contracts have one layout per department.
     - Department cannot be removed from these modules, and is mandatory on Tasks, Calls, Events and Contracts.
     - Products has a mandatory Department (multi-select).
   - **TAVI today:** layouts are assigned to profiles only. Department is optional and is not on the Tasks, Calls or Events layouts.
   - — Live. (Z12)
6. **Missing or different standard fields:**
   - Tickets: Category and Sub Category, with a Category → Sub Category dependency.
   - Accounts: Annual Revenue (Currency), and Street, City, State and Code as separate fields.
   - Products: Department, and Manufacturer as a pick list (single line in TAVI).
   - Tasks: Remind At. Calls and Events: Remind me.
   - Contact Name is mandatory on Calls and Events.
   - Call Status is mandatory on Calls.
   - Contracts: Account Name, Start Date and Support Plan are mandatory, and there is an SLA Name.
   - Zoho keeps several of these in Unused Fields by default. In TAVI they do not exist, or are soft-deleted (see "Could not be checked").
   - — Live. (Z13)
7. **Picklist tools.**
   - **Zoho:**
     - "Add Values in Bulk" from predefined lists, typed values or an imported file.
     - Sort A–Z.
     - Clear all values.
     - **Replace Values** at any time, which updates existing records.
   - **TAVI today:** values are added, reordered and removed one at a time. Replacement is offered only when you remove an option that records still use.
   - — Live (editor and menu); export of values is Docs. (Z14)
8. **Rounding for Decimal and Currency fields** (Normal, Round off, Round down, Round up). Today TAVI has precision and scale only. — Docs. (Z15)
9. **Lookup options.**
   - **Zoho:**
     - Filter which records can be picked (up to 5 criteria).
     - Search them by up to 6 fields.
     - Show up to 6 fields in the pop-up.
     - Sort them.
     - Fill up to 5 fields from the chosen record.
   - **TAVI today:** target module, display field, related list title and multi-module only.
   - — Docs. (Z16)

## Missing — layouts and setup pages

10. **Help Center settings on a layout.** Display in Help Center (a column on the Tickets layouts list), Display Name in Help Center, Description, and Allow non-department agents. Today the Create New Layout form has a name only. — Live (column), Docs (form). (Z17)
11. **Ticket Status page.** Per department: add statuses, give each one a status type (Open, On Hold, Closed) and a fall-back, so that On Hold pauses the SLA clock. Today Status is a field with a list of values only. Check whether a Tickets or SLA gap item already covers this before filing. — Live. (Z18)
12. **Agents as a customisable module.** In Zoho, Agents has its own layout (2 sections), 15 field types and 240 custom fields left. TAVI has no Agents module in Modules and Fields. Check NDC-1878 (Agents gaps) before filing. — Live. (Z19)

---

## Already filed (still missing, confirmed live)

- NDC-1879 item 1, **layout rules**: Zoho has a Layout Rules page with "Create Rule". TAVI's Desk module page shows only Layouts, Fields, Workflow Rules and Summary.
- NDC-1879 item 2, **validation rules**: Zoho has a Validation Rules page with "Create Rule".
- NDC-1879 item 3, **picklist values per layout**: Zoho's "Sales" ticket layout has its own order and mandatory fields.
- NDC-1879 item 4, **Help Center access per field**: Zoho has "Hide from Help Center" and "Editable for End Users" in Edit Properties.
- NDC-1879 item 5, **nested and colour-coded picklists**: Zoho has the "Nested picklist" toggle, and Colored Picklist and Colored Multiselect in the palette.
- NDC-1879 item 6, **field encryption**: Zoho shows "Encrypted Fields 10" in Custom Fields Left.
- NDC-1866 item 16, **ticket number format**: Zoho's Ticket Id is an Autonumber field. TAVI's Ticket Number is a read-only single line.

---

## Could not be checked

- **Department storage and department layouts.** The owner account sees **0 departments** (`GET /desk/departments` returns `[]`, and HQ shows "Showing all 0 departments"). Please add one department and assign the test agents to it, so we can test Department storage for custom modules and items 5 and 6.
- **Lower-profile behaviour.** No Agent, Light Agent or Reviewer account has been confirmed. Please name one account per profile from the TAVI Desk credentials file, so we can test field permissions, Access Control, layout permissions and the per-user tab bar (item 1).
- **Custom module behaviour.** No custom module exists on the tenant, and none was created because this check was read-only. Please allow a `QA MF Assets` test module (deleted at cleanup), so we can test where custom modules appear (tab bar, More, Create menu, search, Recycle Bin, workflows) and their record history.
- **Standard fields already soft-deleted on the tenant** (last changed 14 Sep 2026): Contacts Mailing Address and Description; Accounts Industry, Fax, Address and Description. Please confirm whether this was done on purpose by another tester, so we know whether to restore them before running item 6.
- **Zoho's new-field dialogs.** The Zoho palette is drag-only and nothing was dragged, so per-type options (rounding, lookup filters) come from the docs, not from the screen (items 8 and 9).

---

## Additional notes

- **Not gaps:**
  - Department accessibility for custom modules. The docs say it can be chosen, but live Zoho shows it locked to "All Departments".
  - "Add to Other Layouts" and "Preview by profile" are in the docs but were not seen live.
  - Zoho has no Products tab in the bar either.
  - The IM tab belongs to the Instant Messaging channel, not to this feature.
  - Zoho's lookup limit (5 per module) and per-type field caps are limits, not features.
  - Import/export of custom module records is unsupported in Zoho too.
- **Different values, not gaps:**
  - Ticket Priority in TAVI is low/medium/high/urgent; in Zoho it is -None-/High/Medium/Low.
  - Ticket Channel values differ (Zoho: Phone, Twitter, Email, Facebook, Web, Chat, Forums, Feedback Widget, Instagram).
  - Both are editable lists.
- Possible bug to check separately: in the Tickets layout builder, gear (Layout settings) → **Rename Module** crashes the page with "Something went wrong — Cannot read properties of undefined (reading 'trim')". This happened 2 of 2 times as the second admin on 5 Oct 2026, the second time after the builder had fully loaded. Nothing was saved. Evidence: `evidence/02-rename-any-tab-vs-zoho.png` box 3.
- Possible bug to check separately: seeded standard fields are flagged as custom fields and can be permanently deleted (the API shows `isCustomField: true`, `isDeletable: true` and `canPermanentlyDelete: true` on many of them).
- Possible bug to check separately: the layout builder preview shows stored option keys (`low`, `email`, `question`, `english`) instead of labels.
- Possible bug to check separately: every module has a required "Name" field that is on no layout (for example Tickets).
- Possible bug to check separately: Desk shows CRM wording. Setup Home says "Set up your CRM", and the Web Tabs placeholder says "inside the CRM".
- Possible bug to check separately: the module list's Last Modified shows "UN" for all seeded modules (`createdByName` is empty).
- Possible bug to check separately: the Desk module page hides the Layout Rules and Validation Rules tabs, but the builder's field menu has "Create Layout Rule" and "Create Validation Rule" items in the code (flag `canCreateLayoutRule`). Check whether they show and where they lead.
- Possible bug to check separately: the Create module dialog says "Registers a new module (English label)" and has no Arabic name.
- Tenant hygiene: a leftover custom data type "TestDataType" (25 Aug 2026) appears in every module's field palette.
- Session note: the owner session was revoked partway through the read-only checks (`SESSION_REVOKED`). This is likely another sign-in on the same account, so long runs should use the second admin account.
- Test spec: `docs/desk-modules-fields/spec-desk-modules-fields.md`.
- Nothing was changed on the TAVI tenant or in the Zoho org.

## Environment

staging-desk.taviportal.com, headless Chromium (TAVI) and headless Edge (Zoho Desk), 5 October 2026, admin accounts.
