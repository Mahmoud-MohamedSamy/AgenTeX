# Formula fields run — 23 Nov 2026 (P0 first, CRM then Desk)

Plan: docs/formula-fields (192 cases). Env: NDC-Staging, owner (one sign-in, session file scratchpad fx-o.json, covers CRM + Desk).
Data: CRM module "QA FX" 7267b791-47cc-479c-aa79-c35acbdeff4c (layout Default 148d7328…), account "QA FX Acc" 59fab8eb…; ids in scripts/made.json; ledger.md.
Scripts: scripts/fx.js (API), scripts/fxui.js (browser), lib.js; b1.js/b2.js batches → out/b1.json, out/b2.json.

## CRM P0 results

| Case | Result | Note |
|---|---|---|
| A1 | PASS | Formula tile in palette; drop opens Field Properties on ADVANCED |
| A2 | PASS | Expression box, hint, amber required note, Insert a field (layout fields), 17 function chips with signature/description/args/example |
| A4 | PASS | Chips = fields on this layout (incl. system name/created_by…); subform qa_items offered as a chip (alone it is invalid) |
| A6 | PASS | Builder save: label + expression `qa_num * 2` stored |
| A7 | PASS (msg) | Empty expression: Apply accepted, Save blocked by the server with raw text "Field 'formula': Option 'expression' is required." — the planned client message is not shown on Save |
| B1 | FINDING | Builder stores no return_kind (only expression, read_only); no return-type control (Z2) |
| B2–B5 | PASS | number 6, "Ab-7", true/false, date 2026-11-23 |
| C1, C2, C7, C9 | PASS | arithmetic, precedence, 8 comparisons × 2, and/or truth table |
| C14 | PASS | divide by 0 → blank (null) |
| D1, D5, D6, D7, D9 | PASS | if, concat (date as 2026-11-23, blank adds nothing), coalesce, min/max, sum(4,5)=9 (NDC-2536) |
| D16 | PASS | round half away from zero (2.5→3, -2.5→-3), round(3.14159,2)=3.14 |
| D17 | PASS | isblank: empty→true, "x"/0→false, "  "→true |
| D22 | PASS | today()/substring() refused 400 "Unknown function … Available: …" |
| E1, E7, E8, E9, E13, E14, E18 | PASS | blank number counts as 0 (E7 → 0) |
| E19 | FAIL | text(date_time) gives raw UTC "2026-11-23T21:30:00Z", not Cairo 23:30 / org format |
| E20 | FAIL | concat(lookup) gives the record id "59fab8eb-…", not the account name |
| E28 | PASS (refused) | server: DATATYPE_FORMULA_CHAIN_UNSUPPORTED — formula cannot read a formula (Z8 confirmed) |
| E32 | PASS | blank record: 47 formulas, no null/undefined/NaN text |
| F1, F2, F3 | PASS | sum 60.5, avg/min/max 3/1/6, count rows 3 / column 2 |
| G6, G7 | PASS | self reference / unknown field refused (400 with clear codes) |
| G11 | PASS | all 17 bad expressions refused by the server (2001 chars, 100k chars, 33 levels, 513 tokens, empty, spaces, subform column outside aggregate…); 31 levels saves |
| H1 | PASS | UI create qa_num 4 → 8 shown after save |
| H3 | PASS | Edit form 4→10 → 20 |
| H4 | PASS | inline edit on record page 10→7 → 14 at once and after reload |
| H7 | PASS | API PATCH 4→10 → 15; null → 0 |
| H15 | FAIL | formula added to a module with records: old records stay without a value (no back-fill) |
| J1 | PASS | create form: locked, "Computed after save" |
| J2 | PASS | API write 999/555 to a formula ignored |
| J3 | PASS (+note) | Required/Unique switches disabled; Regex Pattern and Conditional visibility still offered for a formula |
| K1 | FAIL | edit expression: existing records keep the old value (8 after 20 s and after 1 h); only a later save recalculates |
| K4 | FAIL | field used by a formula deletes with 204, usage check lists no formulas, formula keeps "qa_k4 + 1", new records silently get 1, the formula field can no longer be saved (422 FIELD_UNKNOWN) |
| I1 | PASS | record page shows value |
| I10 (P2, seen) | NOTE | timeline logs every changed formula as "… was updated from 6.0 to 15.0" |
| K8 (P1, seen) | INFO | 47+ formula fields on one module accepted (no limit hit) |
| H6 | PASS (+note) | import computes formulas (3→6, 12→24, blank→0); formula column not mapped by default; import field list still offers fx_f1/fx_l1 as read_write and a mapping to a formula is accepted (204) |
| H8 | FAIL | workflow FieldUpdate sets qa_num 1→7 but formulas stay at the value from 1 (fx_e7 2, expected 14) — confirmed after wait |
| I2 | PASS | list shows the formula column; sort by formula numeric 2,10,14,100 / desc reverse (API; UI sort click blocked by slow list page) |
| I3 | PASS | filters on number (greater_than), text (contains) and boolean formulas return the right records (API) |
| I7 | PASS | workflow criteria fx_e7 > 10 fires for 12, not for 4, fires after edit to 16 |
| F8 | PASS (API) | subform formula column line = qty*price → 20, 4.5 (sub-field key `expression`); screen view not checked yet |
| F12 | PASS | add/remove subform rows → sum 30→60.5→30.5, count 2→3→1 |
| K3 | PASS (API) | qa_num off the layout: formulas still computed (8, 14); builder warning not checked |
| L1 | PASS | HTML/script in result shown as text on record page; no element, no dialog |
| X1 | PASS | quote: sum(subform formula column) → 24.5, total 24.05; add row → 1024.5 / 924.05 |
| Z1, Z2, Z8 | GAP confirmed | no date functions; no return-type control; formula cannot read formula |

## Desk P0 (custom module "QA FX Desk" 4e66c57e…, made-desk.json)
Same engine — batches b1–b8 give identical results to CRM: same PASS list, same FAILs E19, E20, H8, H15, K1, K4.
Builder on Desk: A1/A2 PASS, A7 same raw server message, A3/A6 PASS, J3 same (Required/Unique disabled; regex/visibility offered), editor error G PASS.
Still to do on Desk: record page checks H1/J1/I1/L1 (screen).

Desk screens (P0) done: J1 locked "Computed after save", H1/I1 4 → 12 (QA FX UI Triple = qa_num*3, saved from the Desk builder), L1 shown as text. Observation: a builder save cut off mid-way leaves the field created but not placed on the layout (two-step save).

## P1 (CRM, then the same API batches on Desk — identical results)
| Case | Result | Note |
|---|---|---|
| B6, B7 | FAIL | return_kind not enforced: number formula stores "AB", date formula stores 5 |
| B8 | PASS | currency/datetime/xyz return_kind refused with allowed list |
| B9, C3, C4, C5, C10, C11, C12 | PASS | 3.333…, round 3.33, %, unary minus, &, !/not, literals, quoted comma/escaped quote |
| D2, D4, D10–D15, D18–D21 | PASS | nested if, concat 1/16 args, avg skips blank, count non-blank, upper/lower incl. É, trim, len (Arabic 5), abs, number(), text(), nested functions, wrong types → blank (no 500) |
| D8 | FAIL | min() treats a blank as 0 (avg skips blanks) |
| D14 note | INFO | len("👍a") = 3 (UTF-16 units) |
| D3, F6, F7, G1–G4, G6, G7, D22 (editor) | PASS | each shows its message, field marked invalid |
| G5 | FAIL (minor) | concat(,"a") not flagged in the editor (server refuses) |
| G12 | PASS | message clears, hint returns |
| G13 | FAIL (minor) | two bad formulas → Save shows only the first, as raw server text |
| E2, E4, E5, E10, E12, E15, E16, E31 | PASS | multi-line len 5, phone keeps digits, url, percent 15→30, auto number in same save, radio, status, field not on any layout still read |
| E6 | INFO | len(rich text) counts HTML (9) |
| E17, E21 | FAIL | multi-select and multi-select lookup read as empty ("", len 0) |
| E22 | FAIL | user field gives the user id (like E20) |
| E30 | FAIL | created_at / created_by read as blank on create (name works) |
| H5 | PASS | mass update → formulas recalculated |
| I6 | PASS | export has formula columns |
| I13 | PASS | layout rule / validation rule on a formula refused with clear text |
| J4, J5 | PASS | hidden formula absent for User profile; formula with hidden input still right and kept after user save |
| A10 | PASS (API) | CRM User → 403 creating a formula field |
| K2, K5 | PASS | rename label fine; delete formula fine (note: sort/filter by deleted field returns 200 silently) |
| L3, L3s, L4, L5 | PASS | injection names refused, SQL-like text stays text, other-module field unknown, error bodies clean |
| X2 | PASS | label/tag journey, filter VIP |
| Z3, Z4, Z5 | GAP | 21 Zoho functions refused (find, contains, substring, replace, ceil, floor, sqrt, mod, logs, and(), or(), case, now, today, adddate, datecomp, year…) |
| X4, Z11 | covered | by K1/K3/K4/H15 |
Pending P1: F9/F10 subform editor (screen), B11, M1/M2 Arabic, I5 reports, I9 email merge, H9 blueprint, H10 clone, A11 Desk agent, X3; H12 (Leads conversion) and H14 (ticket channels) need formula fields on live Leads/Tickets — need user OK.

## Remaining P1 + P2 (23 Nov afternoon; CRM, same API batches on Desk — identical)
| Case | Result | Note |
|---|---|---|
| NEW — typing | FAIL (High) | Builder formula box drops the Space key: typed `concat(qa_text, " ", "High value")` saves `concat(qa_text,"","Highvalue")`; `a␣b` → `ab`. Paste keeps spaces; record form keeps spaces. CRM + Desk. Shots SPACE-typed, SPACE-string-literal, desk-SPACE-string-literal |
| A8 | PASS (code + API) | spaces-only = empty (server 400 "cannot be empty") |
| A9 | PASS (code + API) | box maxLength 2000; server refuses 2001 / 100k |
| A11 | PASS | Desk Agent (Specialists 2) → 403; Desk Administrator (Specialists 1) allowed (fx_a11 created, cleanup) |
| A12 | PARTIAL | builder puts the formula on Quick Create layout; QA FX not in the New menu, form not opened |
| B11 | PASS | blank number formula shows 0 (same as E7); empty fields under "Show N empty fields" |
| C6 | INFO | `+` on text joins ("Ax") |
| C8 | INFO/DECISION | text comparison is case-insensitive ("ABC" = "abc" true) |
| C13, C15, C16 | PASS | brackets; new lines/tabs; names and functions case-insensitive |
| E11 | PASS | long integer 9007199254740991+1 exact |
| E23 | BLOCKED | Department/Team/Support plan exist on Desk Tickets only (live module) |
| E24, E26 | FAIL | address and location stored but read as "" in a formula |
| E25, E27 | INFO | file / email template read as "" |
| E29 | PASS (refused) | formula on a rollup refused: DATATYPE_FORMULA_CHAIN_UNSUPPORTED |
| F4, F5 | PASS | no rows: sum 0, count 0, avg/min blank; sum − disc + tax = 57 |
| F9, F10 | PASS (API) | row scope, self reference, cycle (a → b → a) refused; chained columns a→b work (6, 7) — note: subform columns may chain, parent formulas may not |
| F11 | PASS (refused) | subform column cannot read a parent field |
| H9 | FAIL (CRM) / BLOCKED (Desk) | blueprint transition sets qa_num 1→7 and moves to Closed, formula stays 2 (same as H8). Desk custom module has no department, record never enters a Desk blueprint |
| H10 | PASS | Clone (⋮ menu): formula locked on form, clone value 18 |
| H11 | PASS | delete + restore from bin keeps value |
| H12, H14 | NOT RUN | need formula fields on live Leads/Contacts/Tickets — waiting for user OK |
| H13 | N/A | lookup gives the id (E20), so a rename cannot show |
| I4 | NOT RUN | no search box on the module list page |
| I5 | PASS | report detail with formula columns sorted 2,10,100; grouped by text formula, sum of number formula = 882 / 6000, same as records API (167 records) |
| I8 | BLOCKED | Desk assignment rules work on Tickets only |
| I9 | NOT RUN | merge happens on send — sending mail needs user OK |
| I11 | NOT RUN | kanban board needs a board view set up |
| I12 | BLOCKED | no device/emulator in this run |
| K6 | PASS | return kind number→string allowed, value "1" |
| K7 | FAIL (minor) | rename option Blue→Navy leaves `qa_pick = "Blue"` in the formula; result silently false |
| K9, K10 | PASS | record on cloned layout B gets formulas; clone keeps formula |
| K11 | FAIL (minor) | two layout saves (and two field saves) with the same rowVersion both 200 — last write wins silently |
| L6 | PASS | ~1,900-char nested expression saves and works |
| M1, M2 | PASS | AR UI rtl; "أحمد - عميل - Ali" in correct order. Note: HTML text formula jumbled in RTL; formula values in monospace |
| M3 | PASS | labels EN/AR/FR kept |
| M4 | PASS | Tab reaches field chips with focus ring; Enter inserts |
| M5 | FAIL (minor) | aria-invalid + label present; error text not linked (no aria-describedby) |
| N1 | INFO | 123 formulas: save ~1.3 s vs ~0.4 s without |
| N2 | PASS | 100 subform rows: 100 / 100 / 50.5 in ~1.1 s |
| N3 | PASS | import 1,000 rows: all 1,000 formulas right, ~7 min |
| X3 | PASS (Desk custom module) | covered by Desk I7 + X2 (formula tag + workflow criteria); Tickets not used |
| Z6, Z7, Z9, Z12 | GAP | 2,000 vs 5,000 chars; no blank-as-zero option; no now(); no currency/percent/datetime return types |
| Z10 | NOT A GAP | live checking instead of a Check Syntax button |

## Not-run / blocked cases, run 23 Nov evening (user OK to use live Leads/Contacts/Tickets and to send one mail)
| Case | Result | Note |
|---|---|---|
| E23 | FAIL | Desk Tickets: concat(department) gives the department id (like E20); channel "web" fine; team empty (none set); no support-plan field on Tickets |
| H9 (Desk) | FAIL | Tickets blueprint "QA FX H9 Tickets": transition sets Priority High, status On Hold, formula priority = "High" stays false |
| H12 | PASS | Lead "qafx h12 lead" converted: new contact formula upper(concat(first_name, " ", last_name)) = "QAFX H12 LEAD" |
| H14 | PARTIAL | ticket from the public web form (source web_form): formulas worked out ✓; Help Center and email channels not run (need a portal user / outside mailbox) |
| I4 | PASS | global search (Ctrl K) finds records by formula value "High value" / "Standard" |
| I8 | FAIL | Desk assignment rule refuses formula fields in criteria (400 unknown_field); email custom field, priority, channel accepted |
| I9 | GAP (not formula) | email templates accept only {{recipient_email}}, {{recipient_name}}, {{sender_email}}, {{sender_name}}, {{today}} — no record field (formula or other) can be merged; no mail sent |
| I11 | PASS (API) | kanban board by qa_pick with formula card fields; column total over a formula: Green 30 (10+20); formula cannot be the grouping field (pick list/status/radio only — fine) |
| I12 | BLOCKED | Android app backend is ndc-crm.anyware.software, not staging — QA FX data not there |
| A12 | BLOCKED | custom module QA FX not offered in the New (quick create) menu |

## Filed in Plane 23 Nov 2026 (Bug, Sprint 17, CRM+Desk modules, 3 assignees, 1 image each)
- NDC-3216 — F01 — Formula field | Typing in the formula Expression box removes every space, so text in quotes is saved wrong
- NDC-3217 — F02 — Formula field | Formulas are not recalculated when a workflow rule or a blueprint transition changes a field they use
- NDC-3218 — F03 — Formula field | A field used in a formula can be deleted without warning; the formula then gives wrong values and cannot be saved
- NDC-3219 — F04 — Formula field | Existing records keep the old result after the expression is changed, and stay empty when a formula is added
- NDC-3220 — F05 — Formula field | Lookup, user and department fields give the record id in a formula instead of the name
- NDC-3221 — F06 — Formula field | Multi-select, multi-select lookup, address and location fields read as empty in a formula
- NDC-3222 — F07 — Formula field | The formula return type is not enforced, and the layout builder does not save one
- NDC-3223 — F08 — Formula field | Created Time and Created By are blank in formulas when the record is created
- NDC-3224 — F09 — Formula field | text() of a date-time shows UTC instead of the organisation time
- NDC-3225 — F10 — Formula field | min() treats an empty field as 0, while avg() skips empty fields
- NDC-3226 — F11 — Formula field | Layout builder shows raw server messages for broken formulas and names only the first one
- NDC-3227 — F12 — Formula field | Formulas break silently when a pick-list option is renamed; same-version layout saves are both accepted
- NDC-3228 — F13 — Formula field | Desk assignment rules do not accept formula fields in their conditions

## Gap ticket + cleanup (23 Nov 2026, evening)
- Gap ticket filed: NDC-3229 "Formula field | Missing compared with Zoho …" (10 items, High, CRM + Desk, Sprint 17, state as NDC-3102).
- Cleanup verified at zero on both apps: QA FX / QA FX Desk modules and child modules deleted; live Leads/Contacts formula fields + test lead/contact deleted; Desk Tickets 4 formula fields, 3 tickets, 3 assignment rules, blueprint deleted; web-form contact and both QA FX accounts deleted; workflow rules, blueprints, kanban view, field permissions gone; recycle bin has no QA FX items (CRM 257 + Desk 142 purged).
- Interruptions: staging metadata-engine 503 for a few minutes; owner session lost once more → 3rd owner sign-in. Saved sign-in files deleted from the scratchpad.
