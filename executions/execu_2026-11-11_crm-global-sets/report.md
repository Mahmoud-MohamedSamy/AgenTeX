# CRM Global Sets — spec run report (11 Nov 2026)

- Spec: `docs/crm-global-sets/spec-crm-global-sets.md`
- Missing list: `docs/crm-global-sets/crm-global-sets-missing-list.md`
- Plane draft (not published): `docs/crm-global-sets/plane-draft/description.html`
- PRD: NDC-2806
- TAVI: NDC-Staging (`staging-crm.taviportal.com`). Accounts: owner, and Mahmoud Samy (CRM "User" profile) for the permission rows.
- Zoho: test org org944965048, Enterprise trial. Read and write were allowed by the user. Our `QA GS1111` data there is deleted.
- Row results: `results.tsv`. Created items and their cleanup: `ledger.md`. Bug images: `evidence/annotated/`.

## Totals
103 rows:

| Verdict | Rows |
|---|---|
| Pass | 62 |
| Fail | 8 |
| Gap (confirmed missing) | 5 |
| Info | 16 |
| Blocked | 1 |
| Not run | 11 |

## Bugs (drafts, not filed)

### B1 — High — A new pick list field can't use a global set
- **Steps:**
  1. Open the Leads › Standard layout editor.
  2. Drag in a Pick List field.
  3. Open Edit Properties › Advanced › Global set and choose a set. The set's values appear.
  4. Click Save.
- **Expected (Zoho, seen):** the field is created and linked to the set. NDC-2806 S4 says "linking new or existing picklists".
- **Actual:** "Field '…': Option 'global_set_id' is not supported for datatype 'pick_list'." Nothing is saved. `POST /modules/{id}/fields` returns the same 400.
- **Workaround:** create a local pick list, then Associate it with the set.
- **Image:** `B1-new-field-from-global-set-vs-zoho.png`

### B2 — High — Replace leaves workflow rules on the old value
- **Steps:**
  1. Create a rule with the criteria "Tier = Bronze" and a field update "Tier = Silver".
  2. Replace Bronze → Gold, and replace Silver → Gold.
- **Expected (Zoho Replace note, plus the field update we saw change live):** the rule's criteria and actions follow the new value. NDC-2806 S3 says "propagates … workflows, criteria".
- **Actual:**
  - Records move to the new value.
  - The rule's criteria stay "Bronze" and its action stays "Silver", although both values are now in Unused. The rule stops matching.
  - When the rule runs, it writes "Silver" onto new leads, a value the set no longer offers.
  - Removing a value that a rule uses gives no warning, because only custom views are checked.
- **Image:** `B2-replace-leaves-workflow-rules-on-old-value-vs-zoho.png`

### B3 — Medium — Replace is refused when a custom view filters on the value
- **Expected (Zoho, seen live):** the view's criteria change to the new value and the view still shows the record. NDC-2806 S3.
- **Actual:** "\"Gold\" is used by custom view filters. Change or remove it in those views first." The same thing was seen in round 15 on NDC-2806 (10 Nov).
- **Image:** `B3-replace-blocked-by-custom-view-vs-zoho.png`

### B4 — Low (possible) — A save without the version number overwrites
- `PUT /global-sets/{id}` without `row_version` returns 200 and overwrites the set.
- The two-tab case with a version is guarded (409).
- The screen always sends the version, so only API clients are exposed.

## Gaps confirmed in the run (already in the missing list)
- **F5 / Z2:** there's no way to delete an unused value. Every route tried returns 404, and a PUT ignores it.
- **C15 / Z10:** there's no limit on the number of sets. We reached 51 sets; Zoho's limit is 30.
- **J4 / Z7:** reports aren't tracked in Used In.
- **J7 / Z8:** there's no per-value usage.
- **J8 / Z9:** the list shows a field count instead of module names, and has no Created By column.

## What works (highlights)
- **Create:** duplicate names and values are refused, including values that differ only in case, as in Zoho. Values max out at 120 characters, as in Zoho. Names max out at 100 characters (Zoho: 50). A set holds at most 1000 values. Arabic text works. Wrong field types return a clean 400.
- **Edit:** adding and reordering values reaches every linked field in Leads and Customers. Colours, the description and the stale-save guard (409) work, and a double-submit creates only one set.
- **Rename:** only the label changes and the stored value stays the same. The record page shows "Silver Plus" (same as Zoho).
- **Unused values:**
  - Remove moves a value to Unused, and records keep it.
  - New records can't use an unused value.
  - Values come back 50 at a time; 51 is refused.
- **Replace with records only:** records move, the old value goes to Unused, and the modified time is updated (same as Zoho).
- **Clone, Convert and Delete:**
  - Clone produces `_Cloned` and `_Cloned_2` and copies values, colours and unused values.
  - Convert keeps records.
  - Deleting a set turns its fields into local pick lists that keep their values (same as Zoho).
- **Associate and Disassociate:**
  - Mapping moves records to the new value.
  - An unmapped value goes to Unused.
  - Locked fields (Lead Status, Approval Status, text fields) are refused.
  - Linking a field to a second set is refused.
- **Permissions and security:**
  - The CRM User profile gets 403 on every call, no token gets 401, and a foreign tenant header is ignored.
  - XSS text is shown as plain text.
  - The API answers in about 0.2–0.3 s, even for a 1000-value set.
- **Audit:** the log records add, rename (old → new), replace, move to Unused, restore, colours, reorder, and field link and unlink.

## Not run / blocked
- **Not run:**
  - The low-user screen (A5), creating a set through the screen (C2) and the associate popup (I7). The API covers these, and round 15 already passed I7.
  - Field dependency (J5): it needs a shared layout change, and B1 blocks it.
  - Blueprint (J6), list filter (K2), mass update (K3), import (K4) and Kanban (K6).
  - Arabic UI (L4) and keyboard-only use (L5).
- **Blocked:** J3 (layout listed in Used In), because B1 stops a set field from being saved on a layout.

## Cleanup
- **TAVI:** all `QA GS1111` sets, fields, records, the view and the rule are deleted. The baseline diff is clean for sets and fields, and the Leads Standard layout is unchanged (version 4).
  - The deleted records and fields are still in the Recycle Bin, because the purge was refused by the permission check.
  - `first_name` and `phone` on Leads were changed by the owner account at 10:04 and 10:08 UTC. None of this run's calls touch those fields.
- **Zoho test org:** the workflow, field update, view, records, fields and the Tier set are deleted. The deleted records are in Zoho's Recycle Bin.
- **Left alone:** the "QA RT15 …" data belongs to round 15.
