# CRM go-live — Wave 2: daily record work — report

25–26 Oct 2026 · staging-crm.taviportal.com (NDC-Staging) · owner + test user 1 · full feature retest (plan.md, Gate 1 approved).
Case-by-case facts: `results.md`. Evidence (raw screenshots): `evidence/raw/`. Data before/after: `baseline/`, `after/`.
How it ran: one owner browser session and one test-user-1 session; API calls made with the session's own token
(`scripts/run.sh` + snippets). Nothing filed in Plane yet (Gate 2).

## Summary
| | Count |
|---|---|
| Groups run | 16 of 17 (Zoho side-by-side images are made for what you choose to file) |
| Cases with a result | ~95 |
| Tickets now passing | 16 |
| Tickets still failing | 15 |
| New candidate bugs (not in Plane) | 8 (W2-B1 … W2-B8) + minor notes |
| Not run | listed at the end |

## Tickets that now pass (16)
NDC-1832 owner kept on edit · NDC-1197 actions menu (every entry acts or says "Coming soon"; Export works) ·
NDC-1302 stage keeps pipeline · NDC-2282 kanban toolbar · NDC-1597 / 1600 / 1601 recycle-bin filters ·
NDC-1795 bin list refills after bulk delete · NDC-1603 restore with taken unique value refused ·
NDC-1554 tag delimiter is helper text · NDC-1593 / 1599 field permissions enforced on import (screen + server) ·
NDC-2302 import with trigger off runs no workflow · NDC-1216 mass delete by criteria (120 records) ·
NDC-1602 Empty Bin no longer times out (ran ~4 min) · NDC-1484 the 15 modules: create / read / edit / delete / restore work.

## Tickets still failing (15)
| Ticket | Now |
|---|---|
| NDC-1193 | Blank record via API refused in 14 modules, **still accepted in Customers** |
| NDC-2136 | Leads list first rows 13–25 s (target 1.5 s; was 9.1 s) |
| NDC-2137 | Kanban first cards 3.0–4.5 s (target 2 s; was 5.1 s — better) |
| NDC-2122 | "1 AND 2" pattern still accepted |
| NDC-2098 | `?view=` deleted id opens last-used view |
| NDC-2280 | Long view name overlaps the other columns |
| NDC-2388 | Two modules created tonight by another user were switched on as conversion targets ("always") |
| NDC-1823 | Probability / Expected Revenue (and 3 duration fields) editable at conversion |
| NDC-2382 | API can't set any pipeline but the literal "Standard (Standard)"; can't move a deal |
| NDC-1324 | Inline Pipeline editor offers only "Standard (Standard)" |
| NDC-1316 | Pipeline is offered in Mass Update, but applying it fails (422) |
| NDC-1312 | Dialog asks for the stage (good) but saving fails (422) — see W2-B4 |
| NDC-2386 | Settings › Pipelines stuck on "Loading board…" — now also when opened from the menu |
| NDC-1797 | 16 items of deleted modules can't be deleted or restored (forbidden), Empty Bin leaves them |
| NDC-2385 | Import review: "All errors 1" but the table says "No errors match your filters" |
| NDC-1819 | Partly done; still missing Zoho filter panel, column Pin/Hide, Manage Columns pin, row Add Note |

## New candidate bugs (not in Plane)
| ID | Sev. | Title |
|---|---|---|
| W2-B4 | **High** | Pipelines \| A deal can't be moved to another pipeline: the record page "Change pipeline", Mass Update and the API all fail with 422 "Invalid value for: Pipeline" (the Pipeline field only allows "Standard (Standard)"), and the screen shows no error |
| W2-B6 | Medium | Search \| Users on the built-in "User" profile can't use global search ("You don't have access to search", 403 search.global.access) |
| W2-B7 | Medium | Activities \| "+ Task" on a record: "No quick-create form is available for this activity" (first open hangs on "Loading form…") |
| W2-B8 | Medium | Activities \| Recurring task ("Weekly, 3 times") is saved but no further tasks are ever created |
| W2-B1 | Medium | Timeline \| Record deleted and attachment added/removed are not logged (only created / field changed / restored / note) |
| W2-B3 | Low | Tags \| The record tag API accepts an 11th tag (limit 10) |
| W2-B5 | Low | Transactions \| Pipeline shown as a raw id (record page, list column, inline editor) and stages as raw keys (needs_analysis, closed_won) |
| W2-B2 | Low | Timeline \| Create entry reads "leads created" instead of "Lead created" |

Minor notes (no ticket proposed unless you want one): conversion error shows only "Conversion failed. Please try again.";
owner change logs two timeline entries; list header "Sort: created_at"; bin labels use module keys (Accounts, Contacts,
Deals) and Meetings show "(no name)"; bin facet "Accounts (0)" while an item is listed; import status "partially_completed"
when 0 rows were created; import source `excel_import` for a CSV; Mass Update offers system fields (Lead Conversion Time,
Stage Modified Time); search matches any word and does not rank an exact name first; search API accepts 1 character.

## Gaps vs Zoho seen in this wave (for the gap list, not bugs)
Clone record · edit/delete a note · .txt and other file types as attachments · system-defined filters (9, "coming soon") ·
Sheet / Print views, Drafts, Approve Leads, Deduplicate, Client Script ("coming soon") · import manual approval ("coming
soon") · notes and tags in global search · Repeat in the meeting quick-create popup · "Save as view" from the filter panel.

## Not run (and why)
- NT-03 NDC-1948 (note by a user denied Timeline Visibility) — needs a tenant-wide Timeline Visibility rule; next round with your OK.
- LC-04 NDC-2296 / 2297 (convert a lead held for approval/review), TL-04 NDC-2321 — covered by the crm-order automation suite → Wave 3.
- CV-05 NDC-2113 — needs removing a pick-list value from a live field (schema change).
- NDC-1224 large background deletion (needs thousands of records), NDC-2135 (Firefox), NDC-1950 (Backlog idea).
- PL-01 / PL-03 pipeline settings (create, clone, default, delete with transfer) — blocked: the Pipelines page doesn't load (NDC-2386).
- Regression of Done tickets NDC-2124, NDC-1837, NDC-1788, NDC-1789 — not repeated this round.
- RC-05 clone (no Clone action exists), RC-11 special field types, RP-05 previous/next, SV-01 split view create, KB-01 kanban settings, TG-02 screen limit.

## Data and clean-up
- Empty Bin was run as you asked: 3,080 → 1,217 items (CRM screen scope; Desk items untouched). Full list before:
  `baseline/recycle-bin-before-empty.json`.
- Every QA W2 record, view, tag, workflow rule, profile and field permission was removed; 51 QA items purged from the bin;
  test user 1 restored to User / Sales. `after/diff.txt`: remaining differences are all the other session's "QA RT" data.
