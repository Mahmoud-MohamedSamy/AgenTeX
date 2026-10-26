# CRM go-live — Wave 2: daily record work — full feature test list (plan)

25 Oct 2026, staging-crm.taviportal.com (tenant NDC-Staging). Full feature retest: every function of each screen, with
the open tickets mapped onto the cases. Sources: TAVI locale files (`crm-records`, `crm-timeline`, `crm-tags`,
`crm-conversion`, `crm-pipelines`, `crm-data-import`, `crm-workqueue`, `recycle-bin`, `search`), the live API, and the
Zoho CRM inventory (`docs/crm-go-live-feature-inventory/reference/zoho-crm-inventory.md`, section 1).

How: **A** = API automation · **U** = screen automation (Selenium) · **M** = manual look, screenshot · **R** = existing suite rerun.
Status: ⏳ to run · 🔒 needs your OK (Gate 1 questions at the end).
Test data: every record, view, tag, pipeline and import is named `QA W2 …`, owned by a QA account where possible,
and removed at the end (recycle bin → delete forever only for QA items). Baseline snapshot before, diff after.

Modules (15): Leads, Customers (contacts), Transactions (deals), Agency Code (accounts), Tasks, Calls, Meetings,
Subscriptions, Agency, Services, Daily Move, Cases, Purchase Orders, Sales Orders, NDCAgencies.

## 1. Create, edit, clone, delete — all 15 modules (R13, R12, NDC-1484)
| ID | Function | How | Tickets |
|---|---|---|---|
| RC-01 | Full create form per module: layout picker, required fields marked, Save, Save and New, Cancel, "Created" toast | U+A | NDC-1484 (RFT) |
| RC-02 | Required-field and format validation on the form (one error, many errors, invalid value messages) | U | |
| RC-03 | API create skips required fields → must be refused | A | NDC-1193 |
| RC-04 | Quick create (from list + button menu): Save, Save and another, Open full form | U | |
| RC-05 | Clone a record: form pre-filled, auto-number / unique fields not copied, clone source failure message | U | |
| RC-06 | Edit on the record page: Save, Cancel, "nothing editable" state; Owner is kept after edit (web) | U+A | NDC-1832 (Ready for Deployment) |
| RC-07 | Inline edit on list and record page: save, cancel, invalid value, permission denied | U | |
| RC-08 | Change owner (single): search users, current owner shown, success, permission denied | U+A | |
| RC-09 | Delete one record: confirm dialog, connected-records warning, blocked while awaiting approval | U+A | |
| RC-10 | Record page title shows the module name (not the id) for modules beyond the first 25 | U | NDC-1834 (Ready for Deployment) |
| RC-11 | Special field types on create/edit: lookup + multi-lookup picker, multi-user, department/team/support plan, subform rows, auto-number, formula (computed), rich text, image upload (type/size), location, map, camera | U | |
| RC-12 | Record image: upload, replace, remove, wrong type / too large messages | U | |
| RC-13 | Duplicate check: a unique field refuses a duplicate value on create, edit and API | A | |
| RC-14 | Permissions: a user without Create / Edit / Delete gets the right message (UI + API, test user 1) | A+U | |

## 2. Record page (R14)
| ID | Function | How | Tickets |
|---|---|---|---|
| RP-01 | Tabs (Overview / Timeline / related tabs), business-card fields, customer owner, back link | U | |
| RP-02 | Related lists: shown per layout, "View all", invited meetings, projects, visit summary, survey | U | |
| RP-03 | Record not found / no access states (deleted id, other user's record, foreign tenant id) | U+A | lead eec80974 404 |
| RP-04 | Usage statistics panel (sessions, time, scores) where the module has it | M | |
| RP-05 | Previous / next record navigation (Zoho has it) | U | gap check |
| RP-06 | Send email from the record (opens composer only; sending is Wave 4) | M | |

## 3. Notes, attachments, timeline (R15–R17)
| ID | Function | How | Tickets |
|---|---|---|---|
| NT-01 | Add note (text, rich text), edit, delete, note count, empty state | U+A | |
| NT-02 | Note with attachment: upload, type rejected, preview, download, remove | U | |
| NT-03 | Note by a user denied Timeline Visibility (stays "Posting…") | U+A | NDC-1948 (Bug) |
| NT-04 | Notes carried over from a converted lead ("from converted lead") | A | |
| AT-01 | Attachments tab: upload, uploading state, type rejected, preview, download, delete with confirm | U+A | |
| AT-02 | Attachment size limit and blocked file types | A | |
| TL-01 | Timeline entries: created, field changed, owner changed, note added, attachment added, deleted, restored, created by conversion | A+U | |
| TL-02 | Timeline filter: action type, performed by, date range, automation; clear all; empty after filter | U | |
| TL-03 | Upcoming panel, interactions tab, load more, degraded state | U | |
| TL-04 | Workflow field update / blueprint entry shown; assignment not shown as "System" | R | NDC-2321 (Bug) |

## 4. List view (R28)
| ID | Function | How | Tickets |
|---|---|---|---|
| LV-01 | Columns, record count, row numbers, sort by column (asc/desc/none), per page, pagination | U | |
| LV-02 | Manage columns: show/hide, search, required columns locked, reset; more than 50 overrides | U+A | NDC-2124 (Done — regression) |
| LV-03 | Empty states: no records, no matching records + clear filters, no layout, load error | U | |
| LV-04 | Actions menu: every entry works or says "Coming soon" (no silent no-ops, Export does not go home) | U | NDC-1197 (Backlog) |
| LV-05 | Export: CSV/XLSX formats, all / filtered / page scope, visible / all columns, cap message, forbidden | U+A | |
| LV-06 | Awaiting-approval badge on rows; source column values | U | |
| LV-07 | First page load time — Leads, Transactions (p95 over 5 loads) | A | NDC-2136 (Bug), Transactions slow on 25 Oct |

## 5. Custom views (R29)
| ID | Function | How | Tickets |
|---|---|---|---|
| CV-01 | Create view: criteria (all operators), pattern (AND/OR, brackets), columns, sort, sharing (me / users / profiles), save | U+A | |
| CV-02 | Edit, clone, delete, pin / unpin, set default, manage views list | U | |
| CV-03 | Upper-case "AND" pattern refused | A | NDC-2122 (Bug) |
| CV-04 | `?view=` with a deleted or foreign view id falls back to All | U | NDC-2098 (Bug) |
| CV-05 | Removed picklist value flagged in the view | U | NDC-2113 (Bug) |
| CV-06 | Long view name truncated in the manage list | U | NDC-2280 (Bug) |
| CV-07 | Shared view visible to the shared profile only (test user 1 / 2) | A | |
| CV-08 | "Save as view" from the filter panel | U | |

## 6. Kanban and split views (R30, R31)
| ID | Function | How | Tickets |
|---|---|---|---|
| KB-01 | Kanban settings: group-by picklist, card fields, aggregates, sort; create / edit / delete board | U | |
| KB-02 | Drag a card to another column updates the field; blocked moves (blueprint, required fields) show the notice | U+A | |
| KB-03 | Transactions board: layout + pipeline pickers labelled, no duplicates | U | NDC-2282 (Bug) |
| KB-04 | Board first paint time | A | NDC-2137 (Bug) |
| SV-01 | Split view: create per-split criteria, sections, manage, delete | U | |

## 7. Filters (R33)
| ID | Function | How | Tickets |
|---|---|---|---|
| FL-01 | Field filters: every operator group (text, number, date incl. between / days / hours, picklist, user incl. current user, lookup) | U+A | |
| FL-02 | Presets, clear field, clear all, apply, search fields, "no fields match" | U | |
| FL-03 | System-defined filters greyed "coming in a future update" — list exactly which | M | gap |
| FL-04 | Owner / created by / modified by / review status filters | U | |

## 8. Global search (R34)
| ID | Function | How | Tickets |
|---|---|---|---|
| GS-01 | Search box: 3-character minimum, results grouped by module, recent searches, clear recent, see all | U | |
| GS-02 | Search page: tabs, module filter, sort (relevance / recent), load more, not-navigable rows | U | |
| GS-03 | Only records the user may see are returned (test user 1 vs owner) | A | ties to NDC-2412/2413 |
| GS-04 | Search by tag and by note text (Zoho: `#`, notes only in advanced search) | A | gap check |

## 9. Tags (R18)
| ID | Function | How | Tickets |
|---|---|---|---|
| TG-01 | Manage tags: create, colour, edit, delete, duplicate name → merge offer, merge (winner), usage count, search | U+A | |
| TG-02 | Record tags: add, create new from record, remove, limit 10 per record message | U+A | |
| TG-03 | Bulk tag from list: append / overwrite, running / done / partial | U+A | |
| TG-04 | Tag column and tag filter in the list | U | |
| TG-05 | Module limit 100 tags (Zoho Enterprise) | A | |

## 10. Lead conversion (R19)
| ID | Function | How | Tickets |
|---|---|---|---|
| LC-01 | Convert page: targets, create new / existing, plan text, confirm, outcome with "View record" | U+A | |
| LC-02 | Field mapping settings: targets on/off, gating field (always / when field present), standard fields, save | U | |
| LC-03 | New module switched on as a target without asking | A | NDC-2388 (Bug) |
| LC-04 | Lead waiting for approval / held for review cannot be converted | A | NDC-2296, NDC-2297 (Bug) |
| LC-05 | Deal created at conversion: Probability / Expected Revenue read-only | U | NDC-1823 (Bug) |
| LC-06 | Notes, attachments and tags carried to the new records; timeline "created by conversion" | A | |
| LC-07 | Not-a-lead and blocked states | U | |

## 11. Pipelines and Transactions (C11, R04)
| ID | Function | How | Tickets |
|---|---|---|---|
| PL-01 | Settings › Pipelines: list per layout, create (stages required), rename, clone, set default, add/remove/reorder stages, probability, categories | U+A | |
| PL-02 | Page opened directly or reloaded loads | U | NDC-2386 (Bug) |
| PL-03 | Delete pipeline with transfer + stage remap | U+A | |
| PL-04 | API create/update respects the pipeline (and the 422 "Invalid Pipeline" seen in Wave 1 FP-08) | A | NDC-2382 (Bug, urgent) |
| PL-05 | Selecting a stage keeps the pipeline | U+A | NDC-1302 (Ready for Deployment, urgent) |
| PL-06 | Changing pipeline asks for the stage | U | NDC-1312 (Ready for Deployment) |
| PL-07 | Inline edit of Pipeline on the list shows the list | U | NDC-1324 (Ready for Deployment) |
| PL-08 | Mass update offers Pipeline | U | NDC-1316 (Ready for Deployment) |
| PL-09 | Closing won / lost dialog (amount, closing date, reason for loss); stage history; progression bar | U | |
| PL-10 | FP-08 from Wave 1: field permissions on Transactions (hidden / read-only) | A | NDC-1337 |

## 12. Mass update and mass delete (R23)
| ID | Function | How | Tickets |
|---|---|---|---|
| MU-01 | Mass update: pick fields, too many, invalid value, permission error, partial result, pipeline incomplete | U+A | |
| MD-01 | Delete selected: confirm, connected warning, counts | U+A | |
| MD-02 | Mass delete by criteria: criteria builder, pattern, preview, cap exceeded, confirm dialog, background job, result | U+A | NDC-1216, NDC-1224 (Bug) |
| MD-03 | After a mass delete the list loads the next records by itself | U | NDC-1795 (Ready for Deployment) |

## 13. Recycle bin (R38)
| ID | Function | How | Tickets |
|---|---|---|---|
| RB-01 | List, columns, count, expires-in, load more, search, empty states | U | |
| RB-02 | Filters: app, module (all system modules), deleted by (all users), from/to dates; changing a filter keeps the other options | U | NDC-1597, NDC-1600, NDC-1601 (Ready for Deployment) |
| RB-03 | Restore one / selected / batch; restored record back in its list; timeline "restored" | U+A | |
| RB-04 | Restore a record whose unique value is now taken → refused | A | NDC-1603 (Ready for Deployment) |
| RB-05 | Delete forever (QA items only), bulk delete forever completes | U+A | NDC-1797 (Ready for Deployment) |
| RB-06 | Empty Bin (whole tenant) | — | NDC-1602 — 🔒 irreversible for everyone's items |
| RB-07 | Users without permission see the disabled actions | U | |

## 14. Import (R35)
| ID | Function | How | Tickets |
|---|---|---|---|
| IM-01 | Upload: CSV/XLSX, wrong format, too large, rows parsed, header note, draft resume / discard | U | |
| IM-02 | Operation: add / update / upsert, match field, skip duplicates (field, other modules), skip empty, target layout | U+A | |
| IM-03 | Mapping: auto-map, required unmapped, duplicate fields, restricted / read-only fields, replace empty, default tags, tag delimiter text | U | NDC-1554 (Ready for Deployment) |
| IM-04 | Field permissions enforced on import (hidden / read-only for the profile) | A | NDC-1593, NDC-1599 (Ready for Deployment) |
| IM-05 | Assign: assignment rule, manual approval, trigger automation off really skips workflows | A | NDC-2302 (Bug), NDC-2419 (Bug) |
| IM-06 | Review step: error counts and the "All errors" table | U | NDC-2385 (Bug) |
| IM-07 | Result: imported / updated / skipped / errors, download errors, view records | U | |
| IM-08 | History page: status values, details, undo (added records), undo unavailable for updates, download errors | U+A | |

## 15. Work Queue, My Approvals, My Reviews (S01)
| ID | Function | How | Tickets |
|---|---|---|---|
| WQ-01 | Activities section: due buckets, complete, reschedule, assign, delete, not-completable message | U+A | |
| WQ-02 | Queues: system queues, create queue wizard (all steps incl. lookup categorisation), arrange, rename, delete, limits | U | NDC-1837 (Done — regression), NDC-1819 (Bug) |
| WQ-03 | Filters on any layout field; filters kept after reload and new sign-in | U | NDC-1788, NDC-1789 (Done — regression) |
| WQ-04 | Manager view: switch to a subordinate, not-subordinate refused, actions note | A+U | |
| WQ-05 | Jobs: blueprint, approvals, reviews tabs; approve / reject / review from the queue | U+A | NDC-1950 (Backlog — note only) |
| WQ-06 | Alphabet filter, table settings (columns, column size, per page, wrap/clip) | U | |

## 16. Activities — Tasks, Calls, Meetings (R05)
| ID | Function | How | Tickets |
|---|---|---|---|
| AC-01 | Task: due date, status, priority, related to, reminder options, repeat (types, ends never / after / on) | U+A | |
| AC-02 | Meeting: participants (users, contacts, guests, invalid email), repeat, reminder | U+A | |
| AC-03 | Call: log call modal, scheduled call, deferred hint | U | |
| AC-04 | Activities shown on the parent record and in Work Queue | A | |

## 17. Zoho comparison (read-only, org943261092)
For every failure and every function TAVI lacks: same screen in Zoho, side-by-side image. Missing functions go to the
gap list (NDC-2031/2032), not the bug list. Zoho functions already known missing in TAVI: mass transfer, find & merge
duplicates, record sharing, sheet/print/chart/map views, smart filters, follow record, print / mailing labels.

## Size
~150 cases across 17 groups; 45 tickets mapped: 16 Ready for Deployment, 21 Bug, 3 Backlog, 1 Ready For Test
(NDC-1484), 4 Done (regression check). The matrix said "11 custom-view items Ready For Test" — today 7 custom-view
items are open, all in Bug.
Mostly new automation in `automation/.../crmrecords/` (API first, screens second), reusing `crmaccess` helpers.
One owner sign-in and one sign-in per test user per JVM run (429 rule).

## Gate 1 questions
1. **Automation on staging fires on QA records.** Creating, editing, converting and importing records will trigger the
   tenant's active workflow, assignment, approval and blueprint rules (some send emails or create tasks). Options:
   run as is and clean up; or use only modules/layouts with no active rules; or switch rules off for the run (changes
   shared config).
2. **Recycle bin "Empty Bin" (RB-06 / NDC-1602)** deletes every user's deleted items forever. Skip and list as not
   tested (recommended), or run it on a day the team agrees.
3. **Mass delete and imports** create and delete up to ~200 QA records per module (Leads, Transactions). OK?
4. **Performance checks** (LV-07, KB-04): 5 page loads each on Leads and Transactions. OK?
5. **Other session**: the "QA AEO" session works on the same tenant; Wave 2 will not touch its records (prefix filter).

## Gate 1 — answers, 25 Oct 2026
- Automation rules: run as is; QA W2 records may trigger workflows/emails/tasks — list them and clean up after.
- Empty Bin (RB-06 / NDC-1602): user said **run it now**. Before emptying, the full bin contents are saved to
  `baseline/recycle-bin-before-empty.json` (names, modules, deleted by, dates) as a record.
- Volume: up to ~200 QA records per module for mass delete / import, and the 5-load performance checks — approved.
- Plan approved; Step 2 (snapshot) and Step 3 (run) started.
- Note: 16 mapped tickets are "Ready for Deployment" — if a fix is not on staging yet, the case is reported as
  "still fails — fix not deployed?" rather than a new bug.
