# NDC-2628 Daily record work: recheck 9 Nov 2026

Tenant: NDC-Staging (staging-crm), account ndc-staging-owner (Lane D). Numbering follows the Plane ticket. Checked on Leads with a throwaway lead "QA RT 2628 Lead gdyfh".

| # | Item | TAVI now (9 Nov) | Verdict | Evidence |
|---|---|---|---|---|
| 1 | Clone a record | The record ⋮ menu now has **Clone**. It opens a new-record form pre-filled from the source (`clone_from`, `clone_tags`, `clone_subforms`). Save created a new lead with the same name, phone and tags. | Built | raw/record-kebab.png, raw/clone-form.png, raw/clone-saved.png |
| 2 | Edit or delete a note | Notes have pencil and trash buttons. The UI edit saved (PUT 200) and the note shows "edited"; Delete returns 204. `GET …/notes` returns 200 with `can_edit`/`can_delete`. One direct API PATCH/PUT returned 503 "Notes are temporarily unavailable" a minute earlier; the UI edit worked afterwards. | Built | raw/record.png, raw/note-edited.png |
| 3 | Attach any file type | Files → + Upload accepted a .txt file (`text/plain`, 201). Only .txt was tried. | Built | raw/files-txt.png |
| 4 | List tools that were "Coming soon" | None of these says "Coming soon" now: Drafts (dialog), Approve Leads (page), Deduplicate Leads (3-field compare page), Create Client Script (Settings → Client scripts), Sheet View (inline cell editing), Print View (print page). | Built | raw/module-actions.png, raw/act-*.png |
| 5 | System-defined filters | Activities, Latest email status, Locked, Record action, Related records action, Touched records and Untouched records all open real options. Campaigns and Cadences are not offered; TAVI CRM has no Campaigns or Cadences feature. | Partly | raw/filter-sidebar.png, annotated/01 |
| 6 | Import with manual record approval | The import wizard's step 4 "Assign & approve" has **Manual Record Approval → Enable manual approval**. New records wait in the Approve list. | Built | raw/import-step4.png |
| 7 | Save the filter as a view | After Apply Filter, a **Save as custom view** button appears. The view was not saved, to avoid shared data. | Built | raw/filter-applied.png |
| 8 | Global search finds notes and tags | Plain search now finds note text (Notes tab, "Note · Leads") and tag names (the lead with that tag). Searching "#tag" returns "No results", whereas in Zoho # searches record name or tags. | Partly | raw/search-note.png, raw/search-tag.png, raw/search-hashtag.png, annotated/01 |
| 9 | Repeat on the meeting quick-create popup | + Meeting on the record opens "New Meeting", which now has **Repeat** (None …). | Built | raw/meeting-quick-create.png |

Totals: **7 built, 2 partly built, 0 still missing.**

Writes, all removed (see ledger.md):
- 2 leads (the source and its clone), 2 notes, 2 tags, 1 .txt attachment and its file object.
- The lead deletes were purged from the Recycle Bin by id.
- Checked afterwards: both leads return 404, no "QA RT 2628" tags, no bin items, and 0 search hits.
- One import session stays: qa-rt-2628.csv, status pending_mapping, 0 records. It can't be deleted (405) and doesn't appear in Import History.
- Sheet view was switched off again.
