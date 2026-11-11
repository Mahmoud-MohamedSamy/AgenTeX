# Spec — CRM Global Sets

| | |
|---|---|
| App | TAVI CRM `https://staging-crm.taviportal.com`, tenant NDC-Staging (`a7a7a7a7-0000-0000-0000-000000000004`) |
| Feature | Setup › Modules and Fields › **Global Sets**, plus everything a set touches: field settings (Use / Convert / Associate / Disassociate), records, custom views, workflow rules and actions, layouts and field dependency, approval and review processes, Used In, audit log |
| PRD | **NDC-2806** "CRM Global Sets" — scope S1 Target, S2 Create paths, S3 Values and Unused, S4 Association and mapping, S5 Safeguards, S6 Used In, S7 Screens, S8 Permissions, plus audit and recycle bin (NDC-1858) |
| Missing list | `crm-global-sets-missing-list.md` (11 gaps = Z1–Z11). Plane draft: `plane-draft/description.html` (**not published**) |
| Expected behaviour | (1) NDC-2806; (2) live Zoho CRM test org org944965048 (`reference/zoho-live-findings.md`, seen 11 Nov 2026); (3) Zoho docs (`reference/zoho-docs-inventory.md`); (4) common sense for save and security rows. Where the PRD and Zoho differ, the PRD wins and the row says so |
| Written | 11 Nov 2026 from the bundle (`index-CwFh2vbx.js`, `pages-Cj5gQgA1.js`), the live API (GET only) and Zoho live |

---

## 0 How to run
1. **Order:** §1 preconditions and baseline → A → B → C → D → E → F → G → H → I → J → K → L → E2E → Z → cleanup → baseline diff.
2. **Serial:** every row that writes a set, a field or a record. Sets are tenant-wide and the 15-field rule counts all linked fields, so parallel writers break each other's counts.
3. **Exclusive:** `[perf]` rows run alone.
4. **`[data]` rows** record the input (exact characters), what the screen showed and what a GET returned after the save.
5. **Accounts:** one sign-in per account per run (the refresh token rotates; a second sign-in can revoke the first). On HTTP 429 **stop** and tell the user. Report token lengths only.
6. **Verdicts:** Pass · Fail · Blocked · Inconclusive · Gap (a Z row still missing). A row blocked by §1.4 is Inconclusive, not Fail.
7. **Evidence:** screenshots only for **failed** rows. Each failed row is shown side by side with live Zoho (TAVI on the left, Zoho on the right, numbered boxes, and a table Behaviour | Zoho | TAVI | Match). Passed rows get a verdict and one line of text.
8. Every API call: `Authorization: Bearer …`, `x-tenant-id`, `x-app-key: crm`. Envelope `{success, data, error:{code,message}, meta}`.

## 1 Preconditions
### 1.1 Accounts
- **Owner** `ndc-staging-owner` (CRM admin, has `crm:global_set:manage`).
- **Low user:** a CRM user without `crm:global_set:manage` (e.g. Test User 1). If none is available, A3–A6 are Blocked.
- **Zoho:** test org org944965048 (Enterprise trial, ends 17 Nov 2026). Read and write are allowed, with the prefix `QA GS1111` and cleanup afterwards.

### 1.2 Test data (prefix `QA GS1111`)
- Sets: `QA GS1111 Tier` (Gold, Silver, Bronze), plus others created by the rows.
- Fields: Leads `qa_gs1111_tier` and Contacts `qa_gs1111_tier`, linked to the Tier set; Leads `qa_gs1111_local`, a local pick list (Gold, Platinum, Silver).
- Records: leads L1 Silver, L2 Bronze, L3 Gold; contact C1 Silver.
- Custom view `QA GS1111 Silver view` (Leads, Tier = Silver); workflow rule `QA GS1111 Bronze rule` (Tier = Bronze → field update Tier = Silver), **inactive**.
- Every created id goes into `ledger.md`.

### 1.3 Baseline
- Before A: `GET /global-sets` (ids + `row_version`), and `GET /modules/{leads|contacts}/fields`. Save to `baseline/`.
- After cleanup: run the same GETs again; the diff must show only the sets and fields that existed before (the QA RT15 data belongs to round 15).

### 1.4 Environment blockers
- Reports module: if no report can filter on a QA field, J4 is Inconclusive.
- Blueprint on Leads: if blueprint editing is not available on staging, J6 is Inconclusive.

### 1.5 Cannot be undone cleanly
- Audit log entries stay.
- Deleted fields go to the Recycle Bin; purge them, or note that they are left there.
- Records are deleted and then purged from the bin.

## 2 Surface and contract
### 2.1 Admin API (`/api/v1`)
| Call | Body | Notes |
|---|---|---|
| `GET /global-sets` | — | list: id, name, description, value_count, unused_count, field_count, colors_enabled, created_*, last_modified_* |
| `POST /global-sets` | `{name, description?, colors_enabled?, values:[{value,label,color?}]}` | 201 |
| `GET /global-sets/{id}` | — | + values, unused_values, fields, row_version |
| `PUT /global-sets/{id}` | full set + `row_version` | stale → 409 |
| `DELETE /global-sets/{id}` | — | > 15 fields → 409 `GLOBAL_SET_TOO_MANY_FIELDS` |
| `GET …/used-in` | — | `{fields:[{field, layouts, custom_views, workflow_rules, saved_actions, approval_processes, review_processes, custom_actions}], not_tracked:["reports"]}` |
| `POST …/clone` | `{name?}` | `<name>_Cloned`, `_Cloned_2` |
| `POST …/values/remove` / `…/values/restore` | `{values:[…]}` | restore max 50 |
| `POST …/values/replace` | `{replacements:[{from,to}]}` | value in use → 409 `GLOBAL_SET_VALUE_IN_USE` (seen 10 Nov) |
| `POST /global-sets/from-field` | `{module_id, field_id, name, description}` | convert |
| `GET …/association-preview?module_id&field_id` | — | local values, record counts, suggested match |
| `POST …/associate` | `{module_id, field_id, mappings}` | |
| `POST …/disassociate` | `{module_id, field_id}` | |

### 2.2 Field register
| Field | Kind | Limits (TAVI / Zoho) |
|---|---|---|
| Set name | text, unique | TAVI ? / Zoho 50 chars, unique |
| Description | text | TAVI ? / Zoho 1000 |
| Value label | text, unique in set | TAVI ? / Zoho 120, unique ignoring case |
| Values per set | — | TAVI 1000 / Zoho 1000 used + 500 unused |
| Fields per set | — | TAVI over 15 blocks delete/replace / Zoho 30 max, over 15 blocks delete/replace |
| Sets per tenant | — | TAVI ? / Zoho 30 (Enterprise), 50 (Ultimate) |
| Field types | — | TAVI pick_list, multi_select, radio_button / Zoho picklist only |

### 2.3 Screens
- List (`globalSets.title`, search, Create, columns name / values / used in / modified / actions, empty, no matches, no access).
- Editor (create / edit / view), Replace panel, Unused panel, Used In dialog, Delete dialog (linked / not linked), field-settings panel (Use a set / Convert / Associate / Disassociate), Associate popup.

## Group A — Access and permissions
| ID | Tags | Steps | Expected |
|---|---|---|---|
| A1 | api | Owner `GET /global-sets` | 200 list |
| A2 | api | `GET /iam/permissions`, find global_set keys | `crm:global_set:view` and `crm:global_set:manage` exist (S8) |
| A3 | api,🔒 | Low user (no manage): `POST /global-sets` | 403, nothing created |
| A4 | api,🔒 | Low user: `PUT`, `DELETE`, `…/values/replace` on Tier | 403 each; set unchanged |
| A5 | ui | Low user opens Global Sets tab | read-only, or the no-access message `globalSets.noAccess`; no Create / Edit / Delete |
| A6 | api,🔒 | Low user `GET /global-sets` | 200 if they have view, else 403 — record which |
| A7 | api,🔒 | No token `GET /global-sets` | 401 |
| A8 | api,🔒 | Owner token with another tenant id in `x-tenant-id` | 401/403, never another tenant's sets |
| A9 | api,🔒 | `GET /global-sets/00000000-0000-0000-0000-000000000000` | 404, no stack trace |

## Group B — List page and defaults
| ID | Tags | Steps | Expected |
|---|---|---|---|
| B1 | ui | Open Setup › Modules and Fields › Global Sets | tab loads under 3 s; title, description, search, Create |
| B2 | ui | Read columns | name, values, used in, modified, actions (Zoho: Name, Used In with module names, Created By, Modified By — see Z9) |
| B3 | ui | Search "GS1111" / "zzz" | filters; "no matches" text for zzz |
| B4 | api | Compare list counts with `GET /global-sets/{id}` | value_count, unused_count, field_count match the detail |
| B5 | ui | Built-in sets | Zoho ships Source, Industry, Countries and States List → see Z5, Z6 |

## Group C — Create a set (S2a, S7)
| ID | Tags | Steps | Expected |
|---|---|---|---|
| C1 | api | Create `QA GS1111 Tier` with Gold, Silver, Bronze | 201; GET shows 3 values in order |
| C2 | ui | Create in the screen with bulk add (one per line) and colours on | saved; colours kept |
| C3 | api,neg | Same name again | 409, clear message (Zoho "Duplicate name found") |
| C4 | api,neg,data | Name that differs only in case `qa gs1111 tier` | refused like Zoho (unique name) — record |
| C5 | api,neg | Values `A` and `A` | 422 duplicate |
| C6 | api,neg,data | Values `A` and `a` | Zoho refuses (case-insensitive) — record TAVI |
| C7 | api,data | Value of 120 characters / 121 characters | 120 accepted; 121 refused (Zoho max 120) — record TAVI |
| C8 | api,data | Name of 50 / 51 / 255 characters | Zoho max 50 — record TAVI's limit and message |
| C9 | api,neg | Empty name; name of spaces only; no values | refused with a field message |
| C10 | api,neg,data | Empty value label; value of spaces only | refused |
| C11 | api,data | 1000 values; then 1001 | 1000 accepted; 1001 refused |
| C12 | api,sec | Name `QA GS1111 <img src=x onerror=alert(1)>`, value `<b>x</b>` | stored as text; shown as text in the list and editor, no script runs |
| C13 | api,data | Unicode: Arabic `ذهبي`, emoji `⭐`, RTL mixed | Arabic stored and shown; record the emoji result (Zoho refuses emoji) |
| C14 | api,neg | Type confusion: `values:"Gold"`, `name:123`, `colors_enabled:"yes"` | 400/422, no 500 |
| C15 | api | Count sets per tenant: create sets until refused, or up to 31 (then delete) | Zoho stops at 30 (Enterprise). Record TAVI's limit → Z10 |

## Group D — Edit, reorder, colours, save (S3, S7)
| ID | Tags | Steps | Expected |
|---|---|---|---|
| D1 | api | Add value Platinum | value added; linked fields list it |
| D2 | api | Reorder (Bronze first) | order saved; linked field's option order follows |
| D3 | ui | Sort A–Z button | values sorted; after save the order stays. Zoho also saves an "Alphabetical order" preference → Z3 |
| D4 | api | Colours on; Gold = #FFD700 | linked field shows the colour on record pills |
| D5 | api | Edit description | saved |
| D6 | api,conc | Two PUTs with the same `row_version` | first 200, second 409; no lost update |
| D7 | api,conc | Double submit create (same body twice at once) | one set, or a clear duplicate error; never two sets with the same name |
| D8 | api,neg | PUT without `row_version` | refused, or treated as stale — record |
| D9 | api,neg | PUT with `fields` / `field_count` / `id` changed (read-only keys) | ignored or refused; nothing changes |
| D10 | ui | Edit, change a value, leave the dialog without saving | unsaved-changes warning, or the change is lost on purpose — record |

## Group E — Rename a value
| ID | Tags | Steps | Expected (Zoho, seen) |
|---|---|---|---|
| E1 | api | Rename label Silver → "Silver Plus" (stored value unchanged) | Leads and Contacts fields show "Silver Plus" |
| E2 | api | Read lead L1 and contact C1 | both show "Silver Plus" on screen; the stored value stays `silver` |
| E3 | api | Silver view: criteria and rows | criteria shows "Silver Plus"; L1 still listed |
| E4 | api | Workflow field update (Tier = Silver) | still points at the same value |
| E5 | api | Audit log | "renamed Silver → Silver Plus" entry with the user |

## Group F — Remove, restore, delete values (S3)
| ID | Tags | Steps | Expected |
|---|---|---|---|
| F1 | api | Remove Bronze (on L2, in workflow criteria) | Bronze moves to Unused; L2 keeps Bronze; new records can't choose it |
| F2 | ui | Create a lead in the screen | Bronze not offered |
| F3 | api | Restore Bronze | back in used values at its place |
| F4 | api,data | Restore 51 values at once / 50 | 51 refused "At most 50"; 50 OK |
| F5 | api | Delete an unused value for good | Zoho: allowed from Unused, one at a time → Z2 if TAVI has no way |
| F6 | api,neg | Delete a value still in use | refused (Zoho "Option delete not allowed") |
| F7 | api | Remove a value used by a workflow field update | Zoho docs: blocked; Zoho live: allowed. Record TAVI's result |

## Group G — Replace a value (S3)
| ID | Tags | Steps | Expected (PRD S3 + Zoho, seen) |
|---|---|---|---|
| G1 | api | Replace Gold → Silver Plus when only records use Gold | L3 and records in other modules become Silver Plus; Gold moves to Unused; modified time updated |
| G2 | api | Replace Silver Plus → Gold when the Silver view uses it | view criteria becomes Gold, L1 stays in the view (Zoho). TAVI 10 Nov: 409 → **Fail vs S3** |
| G3 | api | Replace a value used by workflow criteria / field update | criteria and field update follow the new value (S3, Zoho) |
| G4 | api | Replace a value used by layout field dependency | dependency follows (Zoho "Field Dependency") |
| G5 | api,neg | Replace into the same value; replace from an unused value; replace into a value not in the set | refused with a message |
| G6 | api,neg | Replace when more than 15 fields are linked | 409 `GLOBAL_SET_TOO_MANY_FIELDS` (S5) |
| G7 | api | Audit log after replace | "replaced A → B" entry |

## Group H — Clone, convert, delete a set (S2, S5)
| ID | Tags | Steps | Expected |
|---|---|---|---|
| H1 | api | Clone Tier | `QA GS1111 Tier_Cloned`, same values, order and colours; unused values: record; no fields linked |
| H2 | api | Clone again | `_Cloned_2` |
| H3 | api | Convert Leads `qa_gs1111_local` into set `QA GS1111 Local Set` | set has Gold, Platinum, Silver; field linked; records unchanged |
| H4 | api,neg | Convert a field that is already linked | refused |
| H5 | api | Delete a set with no fields | deleted; gone from list; audit entry |
| H6 | api | Delete a set with 2 linked fields | Zoho: fields become local pick lists that keep the values and records keep values. Record TAVI (message `globalSets.delete.messageLinked`) |
| H7 | api,neg | Delete a set with 16 linked fields | 409 TOO_MANY_FIELDS |
| H8 | api | Recycle bin after delete | set listed and restorable if TAVI supports it (NDC-2806 mentions recycle bin) — record |

## Group I — Linking fields (S1, S4, S5)
| ID | Tags | Steps | Expected |
|---|---|---|---|
| I1 | api | New Leads pick list field with `global_set_id` = Tier | field gets the set's values |
| I2 | api | Same set on a Contacts field | both linked; Used In shows Leads and Contacts |
| I3 | api | Multi-select / radio button with a set | TAVI allows (extra); Zoho only pick list. Record |
| I4 | api,neg | Link a set to Lead Status (status type), Approval Status, a text field | refused (locked / datatype) |
| I5 | api | Association preview of `qa_gs1111_local` against Tier | Gold and Silver matched; Platinum unmatched with record count |
| I6 | api | Associate with mapping Platinum → Gold | records with Platinum become Gold; field linked |
| I7 | ui | Associate popup | columns Field value / Records / Map to, "Move to unused values", "View associated places" |
| I8 | api | Disassociate a field | field becomes local and keeps its values; records keep values |
| I9 | api,neg | Link a field that is already on another set | 409 |
| I10 | api | Edit the set (add Diamond) | every linked field gets Diamond (S1 "updates … across all linked module fields") |
| I11 | api,neg | Record with a value not in the set (API create) | refused (422). Zoho stores it — TAVI must not |

## Group J — Where the set is used (S6)
| ID | Tags | Steps | Expected |
|---|---|---|---|
| J1 | api | Used In after I1, I2, the Silver view and the Bronze rule | Leads + Contacts fields; Silver view under custom views; Bronze rule under workflow rules |
| J2 | ui | Used In dialog | same lists; text for reports |
| J3 | api | Field used on a layout | layout listed |
| J4 | api | Report filtering on Tier | S6 says reports are listed; TAVI 10 Nov says not tracked → **Fail vs S6** / Z7 |
| J5 | api | Field dependency with Tier as parent | listed (Zoho replace covers dependency) |
| J6 | api | Blueprint using Tier | listed (Zoho blocks replace/delete for blueprint values) |
| J7 | api | Per-value usage (which rule uses Gold) | Zoho per-value associations → Z8 |
| J8 | ui | List "Used In" column | shows modules (Zoho) or a field count (TAVI) → Z9 |

## Group K — Cross-module behaviour on records
| ID | Tags | Steps | Expected |
|---|---|---|---|
| K1 | ui | Lead create form: Tier options | set's values in set order, colours shown |
| K2 | ui | List view filter on Tier | options = set values (+ unused shown for old records?) — record |
| K3 | api | Mass update Tier on 2 leads | allowed values only |
| K4 | api | Import a lead with Tier = Gold / = Unknown | Gold accepted; Unknown refused or mapped — record |
| K5 | api | Workflow rule criteria Tier = Silver fires on create (temporarily active, QA lead only) | action runs; switch the rule off after |
| K6 | ui | Kanban grouped by Tier (if offered) | columns follow the set |

## Group L — Security, i18n, accessibility, performance
| ID | Tags | Steps | Expected |
|---|---|---|---|
| L1 | sec | XSS in name / value / description shown in list, editor, Used In, record form | plain text |
| L2 | sec | IDOR: set id from another tenant (if known) | 404 |
| L3 | sec | Error bodies | no stack traces or SQL |
| L4 | i18n | Arabic UI (if the language switch exists) | labels translated; RTL layout of editor |
| L5 | a11y | Keyboard: open editor, add value, reorder, save without mouse | possible; focus visible; dialogs labelled |
| L6 | perf | `GET /global-sets` and `GET /global-sets/{id}` with a 1000-value set | under 1 s |
| L7 | perf | Editor with 1000 values | opens under 2 s, scrolls smoothly |
| L8 | audit | Audit log entity "Global Set" | create / update / delete / value events with user and time (NDC-1858) |

## E2E journeys
| ID | Journey | Expected |
|---|---|---|
| E2E-1 | Create Tier → link Leads + Contacts → create records → build a view → rename Silver → replace Gold → check records, view, Used In, audit | everything follows the set; one place to change values |
| E2E-2 | Local pick list with records → Convert to a set → link a second module → add a value → it appears in both | convert path works end to end |
| E2E-3 | Existing local pick list with an extra value → Associate with mapping → records move to the mapped value | association path works |
| E2E-4 (negative recovery) | Replace blocked (view uses the value) → fix the view → Replace works → old value in Unused → Restore it | user can recover without support |

## Group Z — Gaps (expected = Zoho)
| ID | Gap | How to check | Expected |
|---|---|---|---|
| Z1 | Replace updates dependent places | G2, G3, G4 | criteria, actions, dependency follow |
| Z2 | Delete unused value | F5 | allowed, one at a time; in-use refused |
| Z3 | Saved sort preference | D3; look for Entered / Alphabetical | preference stored and used in list views and reports |
| Z4 | Predefined choices | editor menu | "Add Predefined Choices" |
| Z5 | Built-in Source / Industry sets | B5 | present |
| Z6 | Countries and States list | B5; address Country field type | address country/state are pick lists from a configurable list |
| Z7 | Used In: reports, dependency, blueprints | J4–J6 | listed |
| Z8 | Per-value usage | J7 | listed |
| Z9 | Created By + module names in list | B2, J8 | shown |
| Z10 | Limits per tenant / module / unused | C15 | 30 sets, 15 per module, 30 fields per set, 500 unused |
| Z11 | Replaced values history | look for API/screen | list of past replacements |

## Traceability
| NDC-2806 item | Rows |
|---|---|
| S1 Target and scope (shared across modules; edits update all linked fields, colours, labels) | I1, I2, I10, D4, E1, E2, K1 |
| S2 Create paths (scratch, convert, clone) | C1, C2, H3, H4, H1, H2, E2E-2 |
| S3 Values (add, rename, replace propagates; Unused) | D1, E1–E5, G1–G7, F1–F7, E2E-1, E2E-4 |
| S4 Association + mapping + View associated places | I5–I9, E2E-3 |
| S5 Safeguards (15 fields, 50 per request, locked fields) | G6, H7, F4, I4 |
| S6 Used In | J1–J8 |
| S7 Screens (list, reorder, colours, clone) | B1–B4, C2, D3, D10, I7, J2 |
| S8 Permissions + settings entry | A1–A9 |
| Audit + recycle bin (NDC-1858) | E5, G7, H5, H8, L8 |

## Reporting
- `report.md` + `report.html` in `executions/execu_2026-11-11_crm-global-sets/`: one line per row (verdict + one-line fact).
- Failed rows: annotated image vs Zoho in `evidence/annotated/<id>-vs-zoho.png`.
- Coverage gaps (Blocked / Inconclusive) restated with the reason.
- Token lengths only; no credentials in logs.
- Cleanup proof: the ledger with each item deleted, and the baseline diff after cleanup.
