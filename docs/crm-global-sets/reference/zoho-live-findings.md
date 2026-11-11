# Zoho CRM Global Sets — what we saw live (11 Nov 2026)

Org: **org944965048** (Zoho CRM Enterprise trial, test org, ends 17 Nov 2026). The user allowed read **and write** in this org on 11 Nov 2026.
Not NDC's real Zoho. Our data uses the prefix `QA GS1111`; ledger in the session scratchpad `zoho/ledger-zoho.md`, all removed at the end of the run.
Screens: `../evidence/originals/gs-*.png`. API snapshots: `after-rename.json`, `after-replace-remove.json`, `after-replace.json`.

## Where it lives and what the list shows
- Setup › Customization › Modules and Fields › tab **Global Sets** (tabs: Modules · Web Tabs · Global Sets). Text: "Global Sets are custom picklist values set that could be associated with multiple picklist fields across modules."
- Search box, **Create Global Set** button, Help link.
- Columns: **Global Set Name · Used In · Created By · Modified By**. "Used In" lists module names as links; a click opens **Associated places of "<set>"**: "This Global Set is associated with the below fields in the following modules and layouts." → `Leads / QA RT15 GS Color - Standard`.
- Row menu (⋯ on hover): **Edit · Clone · Replace Values · Delete**.

## Sets Zoho ships
- **Source** and **Industry** — ready-made global sets (17 and 20+ values), not linked to a field in this org.
- **Countries and States List** — a special global set behind every address Country/State field in Leads, Contacts, Accounts, Quotes, Sales Orders, Purchase Orders, Invoices, Vendors (API: `Country__s`, `States__s`). Page: "Configure the countries and states where you do business. Only the configured list of countries and states will be available in the address fields." Columns Country/Region Name, Code, State/Province Count, State/Province Name, Code; buttons **Address Update Preference** and **Configure**.
- **Team Member Role** and **Access** (`__s`, not customizable) — used by the Team Selling modules.

## Create / Edit dialog
- Fields: Global Set Name, Description, Global Set Values (drag handle per value; per-value + / − / ⇄ buttons), expand icon, gear menu **View / Add Unused Values · Add Predefined Choices · Add Bulk Options**.
- **Sort order preference**: Entered order / Alphabetical order — "The order customized here will be followed in List views, reports and dashboards where sorting is applied for the picklist field." (saved on the set: `pick_list_values_sorted_lexically`).
- **Enable color for Options** checkbox.
- New sets start with "Option 1/2". "-None-" is added to the set automatically and is not shown in the editor.

## Validation (API, seen)
- Name unique: `DUPLICATE_DATA` "Duplicate name found, enter a unique name."
- Values unique **ignoring case**: "A" + "a" → `DUPLICATE_DATA` "Duplicate option found. Enter a unique option."
- Value max **120** characters, name max **50** (`INVALID_DATA`, `maximum_length`).
- `<b>x</b>` / `<img src=x>` accepted and shown as plain text in the list.

## Linking fields
- New picklist field with `global_picklist:{id}` → linked; the field gets `-None-` + the set's values. Sending values too → `AMBIGUITY_DURING_PROCESSING` "cannot provide both picklist options and global set".
- **Multi-select** with `global_picklist` → field created as a plain local multi-select ("Option 1"); the link is dropped silently. Multi-select cannot use a set.
- One set used by Leads and Contacts at once; list "Used In" = "Leads, Contacts".

## Rename a value (Silver → "Silver Plus")
- Display value changes; the stored (actual) value stays `Silver`.
- Records in **both** modules now show "Silver Plus"; the custom view criteria now reads "Silver Plus" and still returns the record; the field update keeps the stored value `Silver`.

## Replace a value (screen; the API call returned 500 INTERNAL_ERROR)
- Dialog "Replace Values "<set>"": Change value from → Change value to. Note: "Existing Value will be replaced in all the used places (Records, Criteria, Workflow Actions, Field Dependency). This action will also update the records modified time. Replaced value will be moved to 'Unused value' section once the replacing action is over."
- After Replace: "It will take a few minutes to complete this operation. You will get notified once the process is over."
- Result (Silver Plus → Gold): lead and contact now Gold (modified time updated); **view criteria changed to Gold**; **field update value changed to Gold**; Silver Plus moved to Unused.

## Remove / delete values
- Remove → value moves to **Unused**; records keep their value; the field metadata still lists it (marked unused).
- A value used by a field update could still be moved to Unused through the API (docs say it should be blocked).
- **Delete** a value that is still in use → `NOT_ALLOWED` "Option delete not allowed". Delete works only from Unused.
- Two deletes in one call → `NOT_ALLOWED` "More than one picklist value cannot be deleted" (limit 1).
- After deleting Bronze: the record keeps "Bronze"; workflow criteria still says "Bronze".

## Per-value "where used"
- `GET …/actions/pick_list_values_associations?picklist_value_id=` lists the field updates that use the value, and the workflows that use those field updates. A value used only in workflow **criteria** or a custom view returns 204 (not listed).

## Other
- Workflow rules cannot be created inactive through the API (created active, then switched off).
- Records accept a value that is not in the set through the API (`NotAValue` stored). TAVI should not copy this.
