# Formula matrix layouts — 24 Nov 2026 (CRM, NDC-Staging)

Module "QA FX Matrix" 29d53ef5-1212-4478-81c4-4acd0a2528ee (kept on purpose, no records yet).
- Layout "QA FX Formula Matrix 1" ada8939c-d0a1-4aba-85c6-97be5115817d (default): if, concat, coalesce, min, max, sum, avg, count, upper, lower — 370 fields.
- Layout "QA FX Formula Matrix 2" 437af0a8-d4cf-4e87-840f-04bb6e88dca9: trim, len, abs, round, isblank, number, text, daysbetween, hoursbetween — 337 fields.
- Both: Basic Information + Inputs (35: one per type + in_parent self lookup) + one section per function (33 fields each).
- 19 functions (server list now adds daysbetween, hoursbetween) x 34 types = 646 pairs: 627 created; 19 refused = every function on Rollup Summary (DATATYPE_FORMULA_CHAIN_UNSUPPORTED, formula cannot read a computed field).
- Field types: server lists 36 (user deleted TestDataType). Not in matrix: Formula (chain unsupported), Pipeline (listed by /fields/datatypes but create refused 400 DATATYPE_KEY_UNKNOWN — finding, not filed).
- Product limit: one layout holds at most 512 fields (LAYOUT_FIELD_LIMIT_EXCEEDED at 667) → split in two.
- Scripts: scripts/matrix.js (fields), in2.js/in3.js (new types, rollup via self lookup), split.js (layouts). Results out/matrix.json, out/split.json. Owner signed in once (scratchpad fx-o.json).

## Sample records (24 Nov)
- "QA FX Matrix - all filled" 4c282ba0-8ed7-406a-841d-4e30e72c21f9, "QA FX Matrix - all empty" 8e0fcaa8-e58f-4a3a-98a1-88932fee4080; account "QA FX Matrix Acc" fd5cc62c… (for lookup). Grid: out/values.md, raw: out/records.json.
- Not filled: Team, Support Plan (no source list found by API), File/Camera/Image (need upload), Rollup (needs child records).
- Observations: multi_select/address/location/map/multi_select_lookup read as empty by formulas (known F06 NDC-3221, now also Map + Multi-Select Lookup; count(multi_select)=2 while isblank=true); lookup/user/department show ids (F05); date_time text raw UTC (F09); min(blank,100)=0 (F10).
- Open (user will check): empty record right after create read in_user = owner id while fx_*_user were blank; after a re-save (PATCH name only) in_user reads blank too. Not filed.
- daysbetween/hoursbetween fields wrapped in round() per user (fractional output is not a finding); records re-saved. 2nd owner sign-in (session lost). Session file deleted.

## Field test run (24 Nov, 3rd owner sign-in)
- Data: files uploaded (POST /files → PUT presigned → confirm; value {file_id, filename, size_bytes, mime, url}); L2 records "QA FX Matrix 2 - all filled" 2df83ade…, "- all empty" 27bc7599…; rollup children (5 / 7). Team: Desk has no teams; Support Plan: both plans discontinued/other department → left blank.
- Value check (scripts/check.js → out/check.json, out/summary.md): 2,508 checks (627 formulas × 4 records): 2,083 PASS, 408 FAIL on known bugs (NDC-3220 ids 54, NDC-3221 empty 266 incl. map/file/image/camera, NDC-3222 coalesce returns number 12, NDC-3224 UTC 12, NDC-3225 min blank 64), 17 FAIL new = default User value (create form pre-fills owner) not seen by formulas on a new record (recEmpty2).
- Screen (fxui.js ui1/ui4): record page L1 330/330 and L2 297/297 shown = API value; create form L1 330 + L2 297 formula fields present, read-only, "Computed after save", no cross-layout leak, 35 inputs each. Note: create form pre-fills In User with the signed-in user.
- Note: round() of blank → 0, so daysbetween/hoursbetween show 0 (not blank) for empty or non-date inputs.

## Full test (24 Nov, owner sign-ins 4 + 5; session lost once more mid-run)
Report: report.html (scripts/make-report.js). 10,065 value checks: CRM matrix 3,135, CRM ops 3,168 (module QA FX Matrix Ops 631dc87f…, 792 formulas, no layout), CRM import 627, Desk matrix 3,135 (module QA FX Matrix Desk 1c0925e7…, layouts 781a2648… / 19f69a58…).
- Screens: CRM L1 330/330, L2 297/297; Desk L1 330/330, L2 297/297; create form read-only; builder 34/35 fields (no rollup, correct) + 19 functions.
- Use (CRM): filters 88/89 (1 not run), sort 33/33, report grouped + 99 cols × 14 rows equal, workflow FieldUpdate recalc PASS (NDC-3217 workflow part looks fixed), import computes formulas.
- NEW bugs (not filed): 1 CRM default User invisible to formulas (also import; Desk OK); 2 CRM+Desk Edit form fails when layout has Rollup Summary (High); 3 "+" joins text (date+1 = "2026-11-241"); 4 Import lookup by name "No existing record matches" (also for "Anyware Software").
- NDC-3221 also Map/File/Image/Camera. Observations: "" vs null text, round(blank)=0, truth rules consistent, CRM shows Department/Team/Support Plan "not available in this app", imported date-time stored as typed.
- Data kept: CRM QA FX Matrix (+~15 records, workflow rule "QA FX Matrix WF recalc" OFF), QA FX Matrix Ops (5 records), Desk QA FX Matrix Desk (6 records), uploaded test files.

## Zoho comparison (24 Nov, user approved write in Zoho test org946877290, CSV 14-11 row 2)
- Zoho API from the signed-in page (scripts/zrun.js: captures x-zcsrf-token). Formula create: POST /crm/v8/settings/fields?module=Leads {data_type:'formula', formula:{return_type, expression:'Upper(${Api_Name})'}}; Zoho limit per return type per module (Decimal) → batches of 8.
- Zoho functions (zoho/functions.json): Abs Ceil Floor Round Sqrt Max Min Naturallog Base10log Len Find Concat Contains Startswith Endswith Lower Upper Trim Substring Replace Tostring Tonumber Now Newdate Timepart Adddate Subdate Datecomp Weekday Dayofmonth Hour Minute Month Year If And Or Not IsEmpty CaseInsensitiveEquals. No Sum/Avg/Count/Coalesce/Daysbetween.
- 748 pairs (22 Zoho types × 34 fn/ops): Zoho refuses 431 (type checks), 88 TAVI-only, 229 both accept → 96 same, rest differ (empty input → Zoho blank vs TAVI 0/true/false; names vs ids NDC-3220; multi-select "A;C" NDC-3221; date text in org format / local time; min(empty,100)=100 in Zoho). Results zoho/pairs.json, compare.json, compare-cats.json; report section in report.html.
- Zoho cleanup: 22 input fields, all test formulas, leads, account deleted; 2 non-deletable helper modules for File/Image Upload fields remain. Zoho session file deleted.
- Zoho behaviour (zoho/behaviour.json, behaviour2.json): formula-on-formula refused in Zoho too; new formula not back-filled and expression edit not applied to existing records in Zoho too (NDC-3219 matches Zoho); pick rename breaks formula in Zoho too (NDC-3227 formula part matches Zoho); Zoho refuses deleting a used field (NDC-3218 valid); 1/0 = 0 in Zoho; Abs(empty) blank, empty+1 = 1; Zoho messages generic; Zoho accepted 2,001 chars / 33 nesting. Note: Zoho reserves deleted field labels (use unique labels). Zoho data deleted; session deleted.
- Zoho use (zoho/use.json, use2.json): workflow field update recalcs formulas (same as TAVI); COQL filter on number formula + SUM correct (same); text formula not filterable in Zoho (TAVI extra); API sort only id/time (not comparable); empty > 10 → blank in Zoho (TAVI false). Not comparable: Zoho UI (editor, blueprint, import) does not render in automated Edge; Zoho Desk account = agent (Insufficient Privileges). All Zoho data deleted; session deleted.

## Filed in Plane (24 Nov, user said "File it in Plane")
- New bugs (Bug state, Sprint 17, no assignee): NDC-3273 B1 + joins text (Medium, CRM); NDC-3274 B2 default User empty in formulas (Medium, CRM); NDC-3275 B3 edit fails with Rollup Summary (High, CRM + Desk, 3 images); NDC-3276 B4 import lookup by name (Medium, CRM).
- Comments with images: NDC-3221 (Map/File/Image/Camera), NDC-3224 (date text vs Zoho), NDC-3229 (G1–G4 + remove formula-on-formula), NDC-3219 (same as Zoho), NDC-3227 (formula part same as Zoho), NDC-3217 (workflow part PASS). Nothing closed or moved. All read back OK (filed.json, scripts/plane-check2.js).
