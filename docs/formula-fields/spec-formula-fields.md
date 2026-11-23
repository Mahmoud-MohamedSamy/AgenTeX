# Formula fields in a layout — test plan

Planned 23 Nov 2026 · 192 cases · P0 63, P1 83, P2 46

## What the build offers (facts)

- Source: TAVI public JS bundle of staging-crm and staging-desk, downloaded 23 Nov 2026 (CRM index-DsnunHz6.js, layout builder pages-BbFDqljF.js; Desk pages-B22mHLWz.js). CRM and Desk use the same formula editor and the same checker.
- Field type key `formula`, category "system", read-only, "Computed server-side on every save". It cannot be Required or Unique, cannot drive a layout rule or a validation rule; field permissions can be set.
- Field settings › Advanced: an Expression box (max 2,000 characters, ltr, monospace), "Insert a field" chips (fields placed in this layout, without the field itself, other formula fields and rollup fields), and "Functions" chips with signature, description, number of arguments and an example on hover.
- Return type: the API takes `return_kind` = string | number | boolean | date. The layout builder screen has no return-type control — what it saves has to be checked (B1).
- 17 functions: if(3), concat(1–16), coalesce(1–16), min(1–16), max(1–16), sum(1–16), avg(1–16), count(1–16), upper(1), lower(1), trim(1), len(1), abs(1), round(1–2), isblank(1), number(1), text(1). sum/avg/min/max/count also take a subform column (Subform.Column); count takes a subform (count(Items)).
- Operators: + - * / %  &  = == != <>  < > <= >=  && ||  !  and or not; literals true false null, numbers, "text"; parentheses. Limits: 2,000 characters, 512 tokens, 32 levels of nesting.
- Subform columns can also be formulas, worked out per row from the same row's columns (own checker: row scope, unknown column, self reference, cycle).
- Checker messages in the editor (English): Expression is too complex. · Unterminated text starting at position N. · Unexpected character 'x' at position N. · Expression is longer than 2000 characters. · Unknown function 'x'. Available: … · Subform column 'x' can only be used inside sum(), avg(), min(), max() or count(). · Expression nests deeper than 32 levels. · Unmatched ')' … · Unexpected ',' … · Operator 'x' … has nothing on its left/right. · Expression ends with 'x'. · Missing a closing ")". · Expression is incomplete. · A formula cannot reference itself ('x'). · The subform 'x' has no column 'y'. · A formula field needs an expression before the layout can be saved.
- Known tickets: NDC-2536 (SUM over subform rows / formula in subform), NDC-1586 (empty expression), NDC-1450 (report formula accepts divide by zero — report formulas, not fields, regression check only).

## Setup and data

- Environment: NDC-Staging. CRM https://staging-crm.taviportal.com, Desk https://staging-desk.taviportal.com, owner account (one sign-in per run, never printed). Second account: a CRM User / Desk agent profile for J-cases.
- CRM: create a custom module "QA FX" with one field of every type that can be referenced (list in group E) plus a subform "QA FX Items" (columns: qty number, price currency, disc percent, note text, line = formula qty*price) and a lookup to Accounts. All on one layout "QA FX Standard". Desk: the same set of fields added to a copy of the Tickets layout ("QA FX Tickets"), only for the Both-cases.
- All names start with "QA FX". Records start with "QA FX ". Everything is listed in ledger.md and deleted once, at the end of the run (fields, layout, module, records, recycle bin).
- Each value check has a worked-out expected value in the case; numbers are compared after the API read (GET record) and on screen.
- Zoho side: Zoho CRM help pages (create-formula-fields, formula functions list) and, read-only, the NDC Zoho org. No writes in NDC Zoho.

## Groups

| Group | Name | Cases | Covers |
|---|---|---|---|
| A | Editor and access | 12 | Add a formula field from the palette, the Advanced panel, insert-field and function chips, help on hover, who can do it. |
| B | Return type and how the value is shown | 11 | string / number / boolean / date results, decimals, what the UI saves, how each one looks on the record. |
| C | Operators and literals | 16 | Every operator, precedence, parentheses, text in quotes, true / false / null. |
| D | Functions | 22 | Each of the 17 functions: normal use, number of arguments, blanks, wrong type. |
| E | Field types as inputs | 32 | One row per field type a formula can read, with a value and with a blank. Types that cannot be read are refused. |
| F | Subforms | 12 | sum / avg / min / max / count over subform rows in a parent formula, and formula columns inside a subform. |
| G | Errors and checks | 13 | Every checker message in the editor, and the same bad expressions sent straight to the API. |
| H | When the value is worked out | 15 | Create, edit, inline edit, mass update, import, API, workflow field update, blueprint, clone, restore, conversion. |
| I | Where the value is used | 13 | Record page, list column, sort, filter, custom view, search, reports, export, workflow / assignment criteria, merge fields, API, history, mobile. |
| J | Read-only and permissions | 5 | Nobody can type a value; field permissions; options greyed out (Required, Unique, rules). |
| K | Changes after the fact | 11 | Edit the expression, rename, remove or delete a referenced field, delete the formula, limits, several layouts. |
| L | Security and API contract | 6 | Injection, HTML in results, very long input, other tenants, error text. |
| M | Language, RTL and accessibility | 5 | Arabic / French labels, Arabic text in results, RTL screen, keyboard and screen reader. |
| N | Performance | 3 | Many formulas, many subform rows, big imports. Run alone, last. |
| X | End-to-end journeys | 4 | Real stories from start to finish. |
| Z | Missing or different compared with Zoho | 12 | One row per gap: how to show it, and what Zoho does. |

## A — Editor and access

Add a formula field from the palette, the Advanced panel, insert-field and function chips, help on hover, who can do it.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| A1 | Both | Formula is in the field palette | Owner: Settings › Modules › QA FX (Desk: Tickets) › Layouts › QA FX Standard › New fields palette. | "Formula" tile is there, drag it into a section → field appears with default label "Formula" and the settings panel opens. | P0 | UI |
| A2 | Both | Advanced panel content | Open the new formula field › Advanced. | Expression box (placeholder "e.g. quantity * unit_price"), hint "Computed server-side on every save…", "Insert a field" chips, "Functions" chips (17). Amber note "A formula field needs an expression…" while empty. | P0 | UI |
| A3 | Both | Insert a field chip | Put the cursor in the middle of "1 +  * 2", click chip qa_num. | API name is inserted at the cursor (not at the end), cursor moves after it, box keeps focus. | P1 | UI |
| A4 | Both | Insert-field list content | Look at the chips. | Every field placed in this layout is listed by API name, label on hover. Not listed: the field itself, other formula fields, rollup fields, fields not on this layout. | P0 | UI |
| A5 | Both | Function chip and help | Hover every function chip, click "round". | Hover shows signature, description, "Arguments: 1–2", example. Click inserts "round(" at the cursor. | P1 | UI |
| A6 | Both | Save with a valid expression | Expression qa_num * 2 → Save layout, reload builder. | Layout saves, expression is kept exactly as typed after reload. | P0 | UI+API |
| A7 | Both | Empty expression blocks save | Leave expression empty → Save layout. | Save is refused, message "A formula field needs an expression before the layout can be saved." (NDC-1586). | P0 | UI |
| A8 | Both | Spaces-only expression | Expression "   " → Save. | Treated as empty (same message), not saved. | P1 | UI |
| A9 | Both | 2,000-character box limit | Paste 2,100 characters. | Box stops at 2,000 (maxLength). A valid 2,000-character expression saves. | P2 | UI |
| A10 | CRM | User without customize permission | Sign in as CRM User (Mahmoud Samy); open the layout builder URL and POST a formula field by API. | No access in UI; API 403. Nothing created. | P1 | UI+API |
| A11 | Desk | Desk agent without setup permission | Same as A10 with a Desk agent. | No access; API 403. | P1 | UI+API |
| A12 | Both | Formula on other layout kinds | Add a formula field to Quick Create and Detail layouts of QA FX, if offered. | Either offered and works the same, or not offered — note which. Value shows on Detail even when the field is only on Create layout? (record). | P2 | UI |

## B — Return type and how the value is shown

string / number / boolean / date results, decimals, what the UI saves, how each one looks on the record.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| B1 | Both | What return type the UI saves | Create formula "QA FX txt" = concat("a", qa_text) in the UI, save. GET /modules/{m}/fields. | Record what return_kind is stored (none / string / inferred). If none and the value is wrong type later → finding. Builder offers no return-type choice → see Z2. | P0 | UI+API |
| B2 | Both | Return number | API: expression qa_num * 1.5, return_kind number; record qa_num=4. | Value 6 (number, not "6"), right-aligned/number format on record and list. | P0 | API |
| B3 | Both | Return string | return_kind string, expression concat(qa_text, "-", qa_num); qa_text=Ab, qa_num=7. | Value "Ab-7". | P0 | API |
| B4 | Both | Return boolean | return_kind boolean, expression qa_num > 10; qa_num=11 then 9. | true then false; shown as Yes/No or ✓ (record which), consistent on record and list. | P0 | API |
| B5 | Both | Return date | return_kind date, expression qa_date; qa_date=2026-11-23. | Value 23 Nov 2026 shown in the org date format, no time-zone shift (not 22 Nov). | P0 | API |
| B6 | Both | Mismatch: number kind, text result | return_kind number, expression upper(qa_text). | Refused on save with a clear message, or value blank — never a text in a number field. Record which. | P1 | API |
| B7 | Both | Mismatch: date kind, number result | return_kind date, expression qa_num + 1. | Refused, or blank. No crash, no 500. | P1 | API |
| B8 | Both | Bad return_kind value | return_kind "currency" / "datetime" / "xyz". | 422 with allowed values listed (string, number, boolean, date). | P1 | API |
| B9 | Both | Decimals in a number result | qa_num / 3 with qa_num=10. | Stored 3.333… ; shown with a sensible number of decimals (record how many). round(qa_num/3,2) → 3.33. | P1 | UI+API |
| B10 | Both | Very large and negative numbers | qa_long * 1000 with qa_long=9007199254740 ; 0 - qa_num with 5. | No precision loss reported as wrong digits (record); -5 shown with minus sign. | P2 | API |
| B11 | Both | Blank result display | Expression qa_text with qa_text empty. | Record shows the empty mark ("—" or blank), not "null"/"undefined". | P1 | UI |

## C — Operators and literals

Every operator, precedence, parentheses, text in quotes, true / false / null.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| C1 | Both | + - * / | (qa_num + 2) * 3 - 4 / 2 with qa_num=4. | 16. | P0 | API |
| C2 | Both | Precedence without brackets | 2 + 3 * 4. | 14 (not 20). | P0 | API |
| C3 | Both | % remainder | qa_num % 3 with 10. | 1. | P1 | API |
| C4 | Both | Unary minus | -qa_num + 1 with 5. | -4 (or a clear error if unary minus is not supported — record). | P1 | API |
| C5 | Both | & text join | qa_text & " " & qa_text2 with "A","B". | "A B". | P1 | API |
| C6 | Both | + on text | qa_text + "x". | Either "Ax" or a type error — record and compare with &. | P2 | API |
| C7 | Both | Comparison = == != <> < > <= >= | Eight formulas, qa_num=5 vs 5 and vs 6, return boolean. | = and == same result; != and <> same; all eight correct. | P0 | API |
| C8 | Both | Text comparison | qa_text = "abc" with "ABC". | Record case rule (Zoho: case-sensitive). Same rule in workflow criteria. | P2 | API |
| C9 | Both | && \|\| and or | qa_num > 1 && qa_check ; qa_num > 9 or qa_check. | Correct truth table for 4 combinations. | P0 | API |
| C10 | Both | ! and not | !qa_check ; not (qa_num > 3). | Inverted values. | P1 | API |
| C11 | Both | true / false / null literals | if(qa_check = true, 1, 0) ; coalesce(null, 5). | 1/0; 5. | P1 | API |
| C12 | Both | Text with quotes and commas | concat("a, b", "c\"d"). | "a, bc"d" (escaped quote), the comma inside quotes is not an argument separator. | P1 | API |
| C13 | Both | Deep brackets | ((((qa_num)))) + ((1)). | qa_num + 1. | P2 | API |
| C14 | Both | Divide by zero | qa_num / 0 ; qa_num / qa_zero. | No 500; value blank or a clear "cannot divide by zero" — never Infinity/NaN on screen (compare NDC-1450). | P0 | API |
| C15 | Both | Spaces and new lines | Expression written on 3 lines with tabs. | Works, saved as written. | P2 | UI |
| C16 | Both | Case of names | QA_NUM * 2, ROUND(qa_num,0), If(...). | Record: function and field names case-insensitive or not; error message clear if not. | P2 | API |

## D — Functions

Each of the 17 functions: normal use, number of arguments, blanks, wrong type.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| D1 | Both | if — true / false branch | if(qa_num > 1000, "High value", "Standard") with 1500 and 10. | "High value" / "Standard". | P0 | API |
| D2 | Both | if — nested | if(qa_num>10,"A",if(qa_num>5,"B","C")) with 11, 7, 1. | A, B, C. | P1 | API |
| D3 | Both | if — wrong argument count | if(qa_num>1, 1). | Refused: if needs 3 arguments. | P1 | UI+API |
| D4 | Both | concat — 1 and 16 arguments | concat(qa_text) ; concat with 16 values ; with 17. | Joined text; 17 refused (max 16). | P1 | API |
| D5 | Both | concat — numbers, dates, blanks | concat(qa_num, "\|", qa_date, "\|", qa_blank). | Number without ".0", date in a readable form (record), blank adds nothing (no "null"). | P0 | API |
| D6 | Both | coalesce | coalesce(qa_mobile, qa_phone, "no number") with both empty / phone only / both set. | "no number" / phone / mobile. | P0 | API |
| D7 | Both | min / max with numbers | min(qa_num, qa_dec, 3) ; max(...) with 4, 2.5. | 2.5 ; 4. | P0 | API |
| D8 | Both | min / max with a blank | min(qa_num, qa_blank). | Blank skipped → qa_num (record if 0 is used instead). | P1 | API |
| D9 | Both | sum with numbers | sum(qa_num, 5) with 4 (NDC-2536 regression). | 9. | P0 | API |
| D10 | Both | avg with numbers and blank | avg(qa_num, qa_dec, qa_blank) with 4, 2. | 3 (blank skipped, as the help text says). | P1 | API |
| D11 | Both | count values | count(qa_num, qa_blank, qa_text). | 2 (non-blank values). | P1 | API |
| D12 | Both | upper / lower | upper("aBc é") ; lower(qa_email) with "Ab@X.com". | "ABC É" ; "ab@x.com". | P1 | API |
| D13 | Both | trim | trim("  a b  "). | "a b" (inner space kept). | P1 | API |
| D14 | Both | len | len(qa_text) with "hello", "", Arabic "مرحبا", emoji "👍a". | 5, 0, 5, record emoji count (2 or 3). | P1 | API |
| D15 | Both | abs | abs(qa_num) with -7.25. | 7.25. | P1 | API |
| D16 | Both | round | round(2.5) ; round(-2.5) ; round(3.14159, 2) ; round(1234.5, -2). | Record rounding rule (half up / half even); 3.14; negative places accepted or refused clearly. | P0 | API |
| D17 | Both | isblank | isblank(qa_text) with "", "  ", "x"; isblank(qa_num) with 0 and empty. | true, record "  ", false; 0 → false, empty → true. | P0 | API |
| D18 | Both | number() | number("12.5") + 1 ; number("abc") ; number(qa_pick) with "3". | 13.5 ; blank or clear error (no 500) ; 3. | P1 | API |
| D19 | Both | text() | concat(text(qa_num), "x") ; text(qa_date) ; text(qa_check). | "4x"; date as text (record format); "true"/"false". | P1 | API |
| D20 | Both | Functions inside functions | upper(trim(concat(" a", text(round(qa_dec, 1))))) with 2.46. | "A2.5". | P1 | API |
| D21 | Both | Wrong type into a function | abs("x") ; upper(5) ; round(qa_text, 2). | Each: clear refusal on save or blank value; no 500. | P1 | API |
| D22 | Both | Unknown function | today() ; substring(qa_text,1,2). | "Unknown function 'today'. Available: …" in the editor and 4xx from the API. | P0 | UI+API |

## E — Field types as inputs

One row per field type a formula can read, with a value and with a blank. Types that cannot be read are refused.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| E1 | Both | Single line | concat("[", qa_text, "]") with "Abc" and empty. | "[Abc]" / "[]". | P0 | API |
| E2 | Both | Multi line | len(qa_multi) with 2 lines "ab\ncd". | 5 (new line counted) — record. | P1 | API |
| E3 | Both | Email | lower(qa_email) with "QA@X.COM". | "qa@x.com". | P1 | API |
| E4 | Both | Phone | concat("+", qa_phone) with 201001234567. | "+201001234567" (not 2.01e+11). | P1 | API |
| E5 | Both | URL | concat(qa_url, "/x"). | URL text joined. | P2 | API |
| E6 | Both | Rich text | len(qa_rich) with "<b>Hi</b>". | Record: counts 2 (text) or 9 (HTML). HTML must not be rendered in the result (L2). | P1 | API |
| E7 | Both | Number | qa_num * 2 with 21 and empty. | 42 / blank (or 0 — record; Zoho lets you choose). | P0 | API |
| E8 | Both | Decimal | qa_dec + 0.1 with 0.2. | 0.3 (no 0.30000000000000004 on screen). | P0 | API |
| E9 | Both | Currency | qa_cur * 2 with 10.50. | 21 shown with currency (or plain number — record), 2 decimals. | P0 | API |
| E10 | Both | Percent | qa_pct * 200 with 15 (stored 15 or 0.15?). | Record stored scale; result matches it (3000 or 30). | P1 | API |
| E11 | Both | Long integer | qa_long + 1 with 9007199254740991. | Exact digits or documented limit; no silent change. | P2 | API |
| E12 | Both | Auto number | concat("ID-", qa_auto) on a new record. | Uses the auto number given on create (same save), not blank. | P1 | API |
| E13 | Both | Checkbox | if(qa_check, "Yes", "No") with ticked / unticked / never set. | Yes / No / No. | P0 | API |
| E14 | Both | Pick list | concat("P:", qa_pick) ; qa_pick = "Blue". | Option value (not id); boolean correct. | P0 | API |
| E15 | Both | Radio button | qa_radio = "B". | Correct boolean. | P1 | API |
| E16 | Both | Status / Pipeline | concat(qa_status) ; CRM Deals: concat(stage). | Status / stage name, not id. | P1 | API |
| E17 | Both | Multi-select | concat(qa_multi_sel) with A,C ; len(qa_multi_sel). | Record join format ("A; C" / "A,C"); no "[object]". | P1 | API |
| E18 | Both | Date | text(qa_date) ; qa_date > qa_date2. | Date text; comparison right across months/years (31 Dec vs 1 Jan). | P0 | API |
| E19 | Both | Date-time | text(qa_dt) with 23 Nov 2026 23:30 Cairo. | Same Cairo day/time, not UTC (24 Nov 21:30 would be a bug). | P0 | API |
| E20 | Both | Lookup | concat(qa_account) with account "QA FX Acc". | Shows the record name (not the id). Record what it gives. | P0 | API |
| E21 | Both | Multi-select lookup | concat(qa_accounts) with 2 accounts. | Names joined, or refused clearly — record. | P1 | API |
| E22 | Both | User | concat(qa_user) / owner. | User name, not id/email (record). | P1 | API |
| E23 | Desk | Department / Team / Support plan | concat(department) on a ticket. | Name, not id. | P2 | API |
| E24 | Both | Address | concat(qa_address). | Readable text or refused — no "[object Object]". | P2 | API |
| E25 | Both | File / Image / Camera | concat(qa_file). | Refused (not readable) or file name — never a storage URL with a token. | P2 | API |
| E26 | Both | Location / Map | concat(qa_location). | Refused or "lat, lng" — record. | P2 | API |
| E27 | CRM | Email template field | concat(qa_tpl). | Refused or name — record. | P2 | API |
| E28 | Both | Another formula field | UI: not in chips. API: QA FX f2 = qa_fx1 * 2. | Record: refused (then Z gap if Zoho allows) or worked out after f1. No loop. | P0 | UI+API |
| E29 | Both | Rollup field | API: qa_rollup + 1. | Record: refused or works. Picker hides it. | P1 | UI+API |
| E30 | Both | System fields | concat(name), created_time, modified_time, owner, id. | Record which system fields can be read; created_time gives the true create time. | P1 | API |
| E31 | Both | Field not on this layout | API: formula reads a module field that is only on another layout. | Record: refused or works; the editor chips do not offer it. | P1 | API |
| E32 | Both | Blank sweep — every type | On a record with every input empty, read all E1–E30 formulas. | No formula shows "null", "undefined", "NaN", "[object Object]"; numbers blank or 0 consistently. | P0 | API |

## F — Subforms

sum / avg / min / max / count over subform rows in a parent formula, and formula columns inside a subform.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| F1 | Both | sum over subform column | Parent formula sum(qa_items.line) ; 3 rows line 10, 20, 30.5. | 60.5 (NDC-2536). | P0 | UI+API |
| F2 | Both | avg / min / max over a column | avg(qa_items.qty), min(...), max(...) with 1, 2, 6. | 3, 1, 6. | P0 | API |
| F3 | Both | count rows and column | count(qa_items) ; count(qa_items.note) with 3 rows, 1 empty note. | 3 ; 2. | P0 | API |
| F4 | Both | No rows | All F1–F3 on a record with 0 rows. | sum 0 (or blank), count 0, avg blank — no error. | P1 | API |
| F5 | Both | Mixed with fields | sum(qa_items.line) - qa_disc + qa_tax with 60, 5, 2. | 57. | P1 | API |
| F6 | Both | Column outside an aggregate | qa_items.qty + 1. | "Subform column 'qa_items.qty' can only be used inside sum(), avg(), min(), max() or count()." | P1 | UI+API |
| F7 | Both | Unknown column | sum(qa_items.nope). | "The subform 'qa_items' has no column 'nope'." | P1 | UI+API |
| F8 | Both | Subform formula column | Column line = qty * price; rows (2, 10), (3, 1.5). | Rows show 20 and 4.5, read-only, recalculated when qty changes before save. | P0 | UI |
| F9 | Both | Row scope | Column formula = qa_items.qty * 2. | "…reads outside this row. Write the column key alone: qty." | P1 | UI |
| F10 | Both | Column self reference and cycle | line = line + 1 ; a = b, b = a. | "A column cannot calculate from itself (line)." ; cycle message with the path; layout save blocked with toast. | P1 | UI |
| F11 | Both | Column formula reads parent field | line = qty * qa_num (parent). | Refused (row only) or works — record. | P2 | UI |
| F12 | Both | Add / remove rows changes parent | Add a row, remove a row, save. | Parent sum and count follow on save. | P0 | UI+API |

## G — Errors and checks

Every checker message in the editor, and the same bad expressions sent straight to the API.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| G1 | Both | Unterminated text | concat("abc). | "Unterminated text starting at position 7." Field border red, save blocked. | P1 | UI |
| G2 | Both | Unexpected character | qa_num # 2 ; qa_num @ 2. | "Unexpected character '#' at position 8." | P1 | UI |
| G3 | Both | Brackets | (qa_num + 1 ; qa_num + 1). | "Missing a closing \")\"." ; "Unmatched ')' at position …". | P1 | UI |
| G4 | Both | Operator without side | * 2 ; qa_num + ; qa_num + * 2. | "…has nothing on its left." / "Expression ends with '+'." / "…nothing on its right." | P1 | UI |
| G5 | Both | Bad comma | concat(,"a") ; concat("a",). | "Unexpected ',' at position …". | P2 | UI |
| G6 | Both | Self reference | Field qa_fx = qa_fx + 1. | "A formula cannot reference itself ('qa_fx')." | P0 | UI+API |
| G7 | Both | Unknown field name | qa_nope * 2. | Refused in editor or on save with the field name; API 422. Not silently blank. | P0 | UI+API |
| G8 | Both | Too deep | 33 nested brackets / 33 nested if. | "Expression nests deeper than 32 levels." 32 levels OK. | P2 | UI+API |
| G9 | Both | Too many tokens | A valid expression of 513 tokens under 2,000 chars (1+1+1+…). | "Expression is too complex." 512 OK. | P2 | UI+API |
| G10 | Both | Too long by API | POST 2,001 / 5,000 / 100,000 characters. | 4xx with length message; no 500, no timeout. | P1 | API |
| G11 | Both | Server repeats every check | Send G1–G9 expressions straight to POST/PATCH fields (bypassing the editor). | Every one refused by the server with a clear message. Any that saves = finding. | P0 | API |
| G12 | Both | Error clears when fixed | Type a bad expression, then fix it. | Red border and message go away, hint text returns, Save works. | P1 | UI |
| G13 | Both | Layout save toast lists bad fields | Two formula fields with errors → Save layout. | Save blocked, toast names both fields. | P1 | UI |

## H — When the value is worked out

Create, edit, inline edit, mass update, import, API, workflow field update, blueprint, clone, restore, conversion.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| H1 | Both | On create (UI) | Create record with qa_num=4, formula qa_num*2. | 8 visible right after save, without reload. | P0 | UI |
| H2 | Both | Live while typing? | Change qa_num on the create form before saving. | Record: preview updates or shows after save only (hint says on save). Field is read-only in the form. | P1 | UI |
| H3 | Both | On edit | Edit qa_num 4 → 10. | 20 after save. | P0 | UI |
| H4 | Both | Inline edit (record page and list) | Inline edit qa_num on the record page and in the list. | Formula updates in both places after save. | P0 | UI |
| H5 | Both | Mass update | Mass update qa_num=3 on 3 records. | All 3 show 6. | P1 | UI |
| H6 | Both | Import | Import 3 rows with qa_num values (and a value in the formula column). | Formula worked out from qa_num; the imported formula column value is ignored. | P0 | UI |
| H7 | Both | API create / update | POST and PATCH records with qa_num. | Response and GET show the worked-out value. | P0 | API |
| H8 | Both | Workflow field update | Workflow rule: on create set qa_num = 7. | Formula 14 after the rule runs (record if it lags one save). | P0 | UI+API |
| H9 | Both | Blueprint transition field | Transition asks for qa_num. | Formula follows the value set in the transition. | P1 | UI |
| H10 | Both | Clone | Clone a record. | Clone has the same formula value; changing the clone does not change the original. | P1 | UI |
| H11 | Both | Restore from Recycle Bin | Delete then restore a record. | Formula value present and right. | P2 | UI |
| H12 | CRM | Lead conversion | Formula on Leads and on Contacts/Deals; convert lead with field mapping. | Target formula worked out from target fields; mapping a formula to a normal field copies the value (record). | P1 | UI |
| H13 | Both | Referenced lookup record changes | Formula concat(qa_account); rename the account. | Record: formula updates on next save only (expected) or at once. Note for Zoho. | P2 | UI |
| H14 | Desk | Ticket via email / Help Center / web form | New ticket from each channel with the input field set. | Formula worked out on all channels. | P1 | UI |
| H15 | Both | New formula on old records | Add a formula field to a module that already has records. | Record: old records filled in (back-fill) or blank until saved. Compare Zoho (fills existing). | P0 | UI+API |

## I — Where the value is used

Record page, list column, sort, filter, custom view, search, reports, export, workflow / assignment criteria, merge fields, API, history, mobile.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| I1 | Both | Record page | Open record. | Formula shows in its section, read-only, label right. | P0 | UI |
| I2 | Both | List column + sort | Add formula column to list; sort A→Z and Z→A (number formula). | Values shown; sort by numeric value (2, 10, 100), not text order. | P0 | UI |
| I3 | Both | Filter / custom view | Custom view: QA FX num2 > 10 ; string formula contains "High". | Right records (count from API). | P0 | UI+API |
| I4 | Both | Search | Global and list search for a string formula value. | Record: found or not; consistent. | P2 | UI |
| I5 | CRM | Reports | Report on QA FX with formula column, group by string formula, sum of number formula. | Values and totals match the records. | P1 | UI |
| I6 | Both | Export | Export list with the formula column. | CSV has the values; a value starting with = + - @ is escaped (NDC-1733). | P1 | UI |
| I7 | Both | Workflow criteria | Rule criteria: formula > 10 → action. | Rule fires only when the formula is > 10 after save. Formula offered in the criteria field list? | P0 | UI+API |
| I8 | Desk | Assignment rule / SLA criteria | Criteria on the formula field. | Offered or not (record); if offered, matches. | P2 | UI |
| I9 | Both | Merge field in email template | Template with ${QA FX num2}; send. | Value in the mail, not the token. | P1 | UI |
| I10 | Both | History / audit | Edit qa_num. | Record: history shows formula change or only qa_num. No "changed by" a user for the formula. | P2 | UI |
| I11 | Both | Kanban / card view | Show formula on cards. | Value shown. | P2 | UI |
| I12 | Both | Mobile (iOS / Android) | Open the record in the app. | Value shown, read-only. | P2 | UI |
| I13 | Both | Layout rules / validation rules | Try to pick the formula as primary field / in a validation rule. | Not offered (capability false). Record whether it can be used as a condition field. | P1 | UI |

## J — Read-only and permissions

Nobody can type a value; field permissions; options greyed out (Required, Unique, rules).

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| J1 | Both | Form shows it read-only | Create / edit form. | Formula not editable (greyed or text only). | P0 | UI |
| J2 | Both | API write ignored | PATCH record with qa_fx = 999. | Ignored or 4xx; stored value stays computed. | P0 | API |
| J3 | Both | Required / Unique greyed | Field settings of formula. | Required and Unique not available. | P1 | UI |
| J4 | Both | Field permission: hidden | Hide formula for CRM User profile. | User cannot see it on record, list, export, API. | P1 | UI+API |
| J5 | Both | Hidden input field | User cannot see qa_num but formula reads it. | Formula still right for that user; user does not learn qa_num through an error. | P2 | UI |

## K — Changes after the fact

Edit the expression, rename, remove or delete a referenced field, delete the formula, limits, several layouts.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| K1 | Both | Edit the expression | Change qa_num*2 → qa_num*3. | Record: old records recalculated at once, on next save, or never. Compare Zoho (recalculates all). | P0 | UI+API |
| K2 | Both | Rename a referenced field label | Rename label of qa_num. | Formula still works (uses API name). | P1 | UI |
| K3 | Both | Remove referenced field from layout | Move qa_num to Unused fields, save. | Warning that a formula uses it, or formula still works; never a silent blank. | P0 | UI |
| K4 | Both | Delete referenced field | Delete qa_num permanently. | Blocked with "used in formula X", or formula marked broken. No 500 when opening records. | P0 | UI+API |
| K5 | Both | Delete the formula field | Delete it, restore if offered. | Gone from layout, list, views, reports; views using it show a clear message. | P1 | UI |
| K6 | Both | Change return_kind on an existing field | PATCH number → string. | Allowed with recalculation or refused — record. | P2 | API |
| K7 | Both | Rename pick-list option used in formula | qa_pick = "Blue"; rename Blue → Navy. | Record: formula text not updated → false result. Compare Zoho. | P2 | UI |
| K8 | Both | Limit per module | Add formula fields until refused. | Record the limit and message (Zoho 20 / Desk 10). | P1 | API |
| K9 | Both | Two layouts, one formula | Formula field on layout A only; record created with layout B. | Record value on layout B records. | P2 | UI |
| K10 | Both | Clone layout | Clone QA FX Standard. | Formula copied with the expression. | P2 | UI |
| K11 | Both | Two admins at once | Admin 1 and 2 edit the same formula expression and save. | Second save warns or wins clearly (layout version conflict). | P2 | UI |

## L — Security and API contract

Injection, HTML in results, very long input, other tenants, error text.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| L1 | Both | HTML in result | concat("<img src=x onerror=alert(1)>", qa_text). | Shown as text on record, list, export, email; no script runs. | P0 | UI |
| L2 | Both | Rich-text input in result | concat(qa_rich) with <script>. | Text only. | P0 | UI |
| L3 | Both | Expression injection | Expression with ); DROP, {{ }}, ${ }, __proto__, constructor. | Refused or treated as text; no server error, no data change. | P1 | API |
| L4 | Both | Other tenant field | Expression names a field API name that exists only in another org. | Unknown field; no data from other tenant. | P1 | API |
| L5 | Both | Error text leaks | Look at all 4xx bodies from G11. | No stack traces, SQL, internal paths. | P1 | API |
| L6 | Both | Heavy expression | 2,000-char expression of nested concat on 100 records. | Saves in < 2 s; no CPU timeout. | P2 | API |

## M — Language, RTL and accessibility

Arabic / French labels, Arabic text in results, RTL screen, keyboard and screen reader.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| M1 | Both | Arabic UI | Switch to Arabic; open formula settings. | Labels and hints translated; expression box stays left-to-right. | P1 | UI |
| M2 | Both | Arabic text in result | concat(qa_text, " - ", "عميل") with Arabic qa_text. | Correct order on record in Arabic and English UI. | P1 | UI |
| M3 | Both | Field labels EN / AR / FR | Formula label in 3 languages. | Right label per language. | P2 | UI |
| M4 | Both | Keyboard only | Add formula, type, use chips with Tab/Enter, save. | All reachable; focus visible. | P2 | UI |
| M5 | Both | Screen reader | Expression box with error. | aria-invalid true and message read out. | P2 | UI |

## N — Performance

Many formulas, many subform rows, big imports. Run alone, last.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| N1 | Both | 20 formulas on one layout | Record save time with 20 formulas vs none. | < 1 s extra. | P2 | API |
| N2 | Both | 100 subform rows | sum over 100 rows. | Right total; save < 2 s. | P2 | API |
| N3 | Both | Import 1,000 rows | Import with 3 formulas. | All computed; import time noted. | P2 | UI |

## X — End-to-end journeys

Real stories from start to finish.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| X1 | CRM | Quote total | Subform items (qty, price, line = qty*price) → Sub total = sum(items.line), Discount %, Total = round(subtotal * (1 - disc/100) + tax, 2) → list, view Total > 1000, report, export. | Every value matches hand calculation at each step, also after editing a row. | P0 | UI |
| X2 | Both | Customer label | Formula Full label = upper(trim(concat(last_name, ", ", first_name))), Priority tag = if(isblank(qa_phone), "No phone", if(qa_num > 1000, "VIP", "Standard")) → workflow sends mail when "VIP". | Values right; mail only for VIP. | P1 | UI |
| X3 | Desk | Ticket ageing tag | Formula on Tickets from priority + checkbox (no date math available — see Z1) → custom view, assignment rule. | Right tickets in the view; rule uses value if offered. | P1 | UI |
| X4 | Both | Change the rules later | From X1: change Total expression, remove Discount from layout, delete it. | Each change gives a clear result (K1, K3, K4). | P1 | UI |

## Z — Missing or different compared with Zoho

One row per gap: how to show it, and what Zoho does.

| ID | App | Title | Steps | Expected | Pri | Via |
|---|---|---|---|---|---|---|
| Z1 | Both | No date functions | Try Now(), Today(), Adddate(), Subdate(), Datecomp(), Year(), Month(), Dayofmonth(), Weekday(), Hour(), Newdate(). | TAVI: "Unknown function". Zoho has date functions (age in days, due date + 3 days). Return kind "date" exists but nothing can work out a date. | P0 | Zoho |
| Z2 | Both | No return type choice in the builder | Look for a return-type control in the formula settings. | TAVI: none (API only). Zoho asks for return type first (Number/Currency, Decimal, Percent, String, Date, DateTime, Boolean) with decimal places. | P0 | Zoho |
| Z3 | Both | Missing text functions | Find(), Contains(), Startswith(), Endswith(), Substring(), Replace(), Tostring(). | TAVI: unknown. Zoho has them. | P1 | Zoho |
| Z4 | Both | Missing math functions | Ceil(), Floor(), Sqrt(), Naturallog(), Base10log(), Mod(). | TAVI: unknown (% works). Zoho has them. | P2 | Zoho |
| Z5 | Both | Missing logic functions | And(), Or(), Not(), Case(). | TAVI has operators and/or/not but no Case(). Zoho has Case(). | P2 | Zoho |
| Z6 | Both | Expression length 2,000 vs 5,000 | Paste 5,000 chars. | TAVI 2,000. Zoho 5,000. | P2 | Zoho |
| Z7 | Both | Blank as zero option | Look for "treat blank as 0 / empty" option. | Zoho has a choice; TAVI: record behaviour from E7/E32. | P2 | Zoho |
| Z8 | Both | Formula reading another formula | From E28. | Zoho allows formula fields to use other formula fields. TAVI picker hides them. | P1 | Zoho |
| Z9 | CRM | Auto-refresh formula (Now()) | — | Zoho: up to 2 per module recalculated over time. TAVI: no Now(). | P2 | Zoho |
| Z10 | Both | Check syntax button | Look for "Check Syntax". | Zoho has Check Syntax; TAVI checks while typing (fine — not a gap if errors are clear). | P2 | Zoho |
| Z11 | Both | Back-fill and recalculation | From H15 and K1. | Zoho recalculates existing records when a formula is added or changed. If TAVI does not → gap. | P1 | Zoho |
| Z12 | Both | Currency / decimal places / percent result | From B9, E9. | Zoho return types Currency/Percent with decimal places. TAVI: number only. | P2 | Zoho |

