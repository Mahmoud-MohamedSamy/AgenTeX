# CRM Global Sets — missing list vs Zoho CRM

Date: 11 Nov 2026 · TAVI CRM staging `https://staging-crm.taviportal.com` (tenant NDC-Staging) · Zoho CRM test org **org944965048** (Enterprise trial, read + write allowed by the user for this work)
PRD: **NDC-2806 "CRM Global Sets"** (Urgent, label Modules & Fields). It has 8 scope items (numbered S1–S8 below). Audit work is shared with NDC-1858.
Earlier check: retest round 15 (10 Nov) found S3 "replace propagates" and S6 "Used In shows reports" not met. It did not compare with Zoho, because the old Zoho org's trial had expired.

Sources:
- TAVI app code: bundle `index-CwFh2vbx.js` and `pages-Cj5gQgA1.js`, where the API client is `/global-sets` and the UI keys are `globalSets.*`.
- TAVI live API, read-only, as the owner.
- Zoho documentation inventory: `reference/zoho-docs-inventory.md`.
- What we saw in Zoho live: `reference/zoho-live-findings.md`, with screens in `evidence/originals/gs-*.png`.

## What TAVI ships today

| Area | TAVI CRM |
|---|---|
| Where | Setup › Modules and Fields › tab **Global Sets** (also Customization › Global Sets) |
| List | Name, values count, unused count, Used In (field count), last modified; Edit / Clone / Delete; search; empty and no-access states |
| Editor | Name, description, colour toggle + colour per value, bulk add, **Sort A–Z** button (one-time), drag reorder, per-value label + stored value, remove (to Unused), Replace panel, Unused values with "Move back" (max 50 at a time) |
| Create paths | From scratch (S2a); **Convert** a field's own pick list from the field's settings (S2b); **Clone** → `<name>_Cloned`, `_Cloned_2` (S2c) |
| Field link | Field settings: Use a global set (new field); **Associate** an existing pick list with mapping popup (local value, records, Map to / Move to unused, View associated places); **Disassociate** |
| Used In | Per field: layouts, custom views, workflow rules, saved actions, approval processes, review processes, custom actions; says "Reports … are not listed here yet" (`not_tracked: ["reports"]`) |
| Safeguards | More than 15 linked fields → delete and replace refused (`GLOBAL_SET_TOO_MANY_FIELDS`); restore max 50 values per request; locked fields refused (`GLOBAL_SET_FIELD_LOCKED`, e.g. approval_status; status-type fields such as Lead Status); max 1000 values; duplicate name 409, duplicate value 422; stale save 409 (`row_version`) |
| API | `GET/POST /global-sets`, `GET/PUT/DELETE /global-sets/{id}`, `…/used-in`, `…/clone`, `…/values/remove`, `…/values/restore`, `…/values/replace`, `/global-sets/from-field`, `…/association-preview`, `…/associate`, `…/disassociate` |
| Permissions / audit | `crm:global_set:view`, `crm:global_set:manage`; audit events created / updated / deleted with value events |
| TAVI extras | Multi-select and radio-button fields can use a set (Zoho: pick list only); version check on save; Used In lists approval/review processes and custom actions per field |

## Missing — managing values

1. **Replace doesn't update the places that use the value** (PRD S3). In Zoho, Replace changes the value in records, view and workflow criteria, workflow field updates and field dependency, updates the records' modified time, and moves the old value to Unused (seen live: view criteria and field update changed Silver Plus → Gold). TAVI refuses instead: "GLOBAL_SET_VALUE_IN_USE … Change or remove it in those views first".
2. **There's no way to delete an unused value for good.** Zoho deletes from Unused, one value at a time, and refuses to delete a value still in use ("Option delete not allowed"). TAVI can only move a value to Unused and back; no screen action or API route deletes it.
3. **The sort order preference isn't saved on the set.** Zoho has Entered order / Alphabetical order, which list views, reports and dashboards follow. TAVI has a one-time "Sort A–Z" button only. Not in NDC-2806.
4. **There are no predefined choices.** Zoho's gear menu has "Add Predefined Choices" next to Unused values and bulk add. Not in NDC-2806.

## Missing — sets Zoho ships

5. **There are no ready-made Source and Industry sets.** Zoho ships both, ready to link. TAVI's Lead Source (Leads, Contacts, Deals) and Industry (Leads, Accounts) are separate local pick lists that have to be kept in sync by hand. Not in NDC-2806.
6. **There's no Countries and States list for address fields.** Zoho's built-in "Countries and States List" feeds every address Country/State field (Leads, Contacts, Accounts, Quotes, Sales/Purchase Orders, Invoices, Vendors), with codes, a state count, Configure and Address Update Preference. In TAVI, Contacts and Accounts country fields are free text (`mailing_country`, `billing_country` are single-line). Not in NDC-2806.

## Missing — where Zoho shows a set is used

7. **Used In doesn't list reports, field dependencies or blueprints** (PRD S6). TAVI says "Reports that filter on these fields are not listed here yet". Zoho's Replace covers reports, criteria and field dependency.
8. **There's no "which value is used where" view.** Zoho can list, for one value, the field updates and workflows that use it. TAVI's Used In works per field, not per value.
9. **The list has no "Created By" column, and "Used In" doesn't name the modules.** Zoho shows Used In as module names (links that open "Associated places") plus Created By and Modified By. TAVI shows a field count and "last modified". The API already returns `created_by_name`.

## Missing — limits and API

10. **There's no per-org limit on how many sets you can create** (to be confirmed in the run). Zoho allows 30 sets (Enterprise) or 50 (Ultimate), 15 linked pick lists per module, 30 fields per set, 1000 used and 500 unused values per set. TAVI enforces 1000 values and the 15-field threshold; a per-org, per-module or unused limit was not found in the code.
11. **There's no "replaced values" history.** Zoho's API returns past replacements (`GET …/actions/replaced_values`), and a replace runs as a job with a notification when done. TAVI's replace is a single synchronous call with no history.

## Checked in the spec run (11 Nov 2026), so not gaps
- **Rename a value:** works like Zoho. The label changes and the stored value stays the same; the record page shows the new label.
- **Delete a set:** works like Zoho. The linked fields become local pick lists and keep their values.
- **Value checks:**
  - Duplicates that differ only in case are refused, as in Zoho.
  - Values max out at 120 characters, as in Zoho.
  - Names max out at 100 characters; Zoho's limit is 50, so this is not a gap.
- **Audit:** rename, replace, unused, restore, and field link/unlink are all logged with old → new values.
- **Field dependency with a set field:** not run (see the run report).

## Bugs found in the run (drafts, not filed; see `executions/execu_2026-11-11_crm-global-sets/report.md`)
- **B1 (High):** a new pick list field set to "Use a global set" cannot be saved. The error is 400 "Option 'global_set_id' is not supported for datatype 'pick_list'".
- **B2 (High):** Replace leaves workflow rule criteria and field updates on the old value, which is now in Unused. The rule then writes that unused value onto records.
- **B3 (Medium):** Replace is refused when a custom view filters on the value. Zoho and NDC-2806 S3 carry the change over instead.
- **B4 (Low, possible):** a PUT without `row_version` overwrites the set.

## Additional notes
- **Not gaps:**
  - Zoho runs Replace in the background; TAVI does it at once.
  - Zoho's Sandbox rules don't apply (TAVI has no sandbox).
  - Multi-select and radio-button fields can use a set in TAVI but not in Zoho. That's a TAVI extra.
- **Zoho quirks we should not copy:**
  - Zoho's API stores a record value that isn't in the set ("NotAValue").
  - Zoho's API let us move a value used by a field update to Unused, which its own docs forbid.
  - Zoho's replace API returned 500.
- **Leftover data:** "QA RT15 …" sets and fields from retest round 15 are still on NDC-Staging and in the Zoho test org. They belong to that round's cleanup.
- **Nothing changed on TAVI during this intake.** In the Zoho test org, the `QA GS1111` items are listed in the ledger and get removed at the end of the run.
