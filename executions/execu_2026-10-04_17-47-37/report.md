# Custom Views v3 — Backlog test cases

**Run:** execu_2026-10-04_17-47-37 · **Mode:** sequential (run straight through at the user's request) · **Target:** https://crm.taviportal.com (tenant NDC-Staging) · **Environment:** legacy (.env) · **Login:** fresh
**Source sheet:** D:Software TestingTest CasesCRMCustom ViewsCustom Views - Spec v3 Test Cases.xlsx — the 24 rows with Status = Backlog
**Run summary (JSON):** [run-summary.json](./run-summary.json) · **Bugs:** [bugs/bug-list.md](./bugs/bug-list.md)

## Result

**14 passed · 8 failed · 2 inconclusive** (of 24)

| Case | Title | Verdict | Evidence |
|---|---|---|---|
| CVS-A03 | The API refuses a public view from a user without Manage Shared Views | Inconclusive | — |
| CVS-A04 | A user a view is shared with cannot edit or delete it in the UI or the API | Inconclusive | — |
| CVS-A10 | View requests without a valid token are refused with no data | Fail (High) | [vs Zoho](browser-sessions/run-174737-d749/screenshots/annotated/CVS-A10-vs-zoho.png) |
| CVS-A11 | A request without x-tenant-id never returns another tenant's data | Pass | — |
| CVS-B14 | The ?view= URL opens permitted views and falls back safely for others | Fail (Low) | [vs Zoho](browser-sessions/run-174737-d749/screenshots/annotated/CVS-B14-vs-zoho.png) |
| CVS-C02 | The view name is validated and every accepted name is shown as plain text | Fail (Low) | [vs Zoho](browser-sessions/run-174737-d749/screenshots/annotated/CVS-C02-vs-zoho.png) |
| CVS-C09 | The grid shows exactly the chosen columns in the chosen order | Fail (Low) | — |
| CVS-C20 | A PATCH with only a name keeps the other settings | Pass | — |
| CVS-C21 | Read-only view keys cannot be changed through the API | Pass | — |
| CVS-C22 | Wrong value types in a create request are rejected cleanly | Pass | — |
| CVS-D01 | Each field type offers exactly the operators listed in spec §2.3, with none missing and none extra | Pass | — |
| CVS-D02 | Text operators split records correctly for odd input, follow the module filter's case rule, and treat SQL-like input as a literal | Pass | — |
| CVS-D03 | is_empty and is_not_empty classify null, blank and whitespace-only text the same way as the module filter | Pass | — |
| CVS-D04 | Number operators are exact at the 9999.99 / 10000 / 10000.01 boundary | Pass | — |
| CVS-D05 | Odd numeric input is normalised or rejected with a message and is never stored as 15 | Fail (Medium) | — |
| CVS-D06 | An empty number is distinguished from zero in view criteria | Pass | — |
| CVS-D07 | Date is/before/after/between/not between follow one stated bound rule, including same-day bounds | Pass | — |
| CVS-D08 | today, yesterday and tomorrow resolve in the tenant timezone (Cairo), not UTC | Fail (High) | [vs Zoho](browser-sessions/run-174737-d749/screenshots/annotated/CVS-D08-vs-zoho.png) |
| CVS-D09 | this/last/next week, month and year return records inside the correct calendar boundaries | Pass | — |
| CVS-D15 | Multi-select contains_any_of, contains_all_of and contains_none_of follow correct set logic | Pass | — |
| CVS-D16 | Lookup equals, not_equal_to and empty return the correctly linked records | Fail (Medium) | — |
| CVS-D17 | A shared view with Owner = $me shows each user only the records they own | Pass | — |
| CVS-D19 | A view definition with an unknown field or operator is rejected by the API with 400/422 | Fail (Medium) | — |
| CVS-D20 | Three rows with an untouched pattern combine as 1 and 2 and 3 | Pass | — |

## Defects

| # | Severity | Case | Title |
|---|---|---|---|
| 1 | High | CVS-A10 | API accepts expired access tokens (JWT exp not enforced) as long as the session is alive |
| 2 | High | CVS-D08 | today / yesterday / tomorrow criteria cut days at UTC midnight instead of the tenant's Cairo time |
| 3 | Medium | CVS-D16 | Lookup criterion value is a plain text box - no record picker, so 'equals <record>' cannot be built in the UI |
| 4 | Medium | CVS-D05 | Number criteria accept non-numeric values ('1e9' in the editor; 'abc', '15,000', Arabic digits via API) and silently match nothing |
| 5 | Medium | CVS-D19 | API stores a criteria operator that is invalid for the field type (contains on a currency field) |
| 6 | Low | CVS-C09 | Grid appends unchosen Tags and Source columns to a view with a chosen column list; Manage Columns says 8 while 10 are shown |
| 7 | Low | CVS-C02 | Empty or spaces-only view name: Save is silently disabled, 'Enter a name for the view.' is never shown |
| 8 | Low | CVS-B14 | ?view= with a deleted or foreign view id falls back to an arbitrary view ('QA CV tab2') instead of All Leads and overwrites the last-used view |
| 9 | Low | CVS-B14 | Deep link ?view= to a view of a non-default layout is dropped on a full page load |

## Run notes (read before the details)

- **Parallel run collision.** The morning execution (`execu_2026-10-04_12-29-38`) was still running in another session and shares the owner account. It (a) deleted the morning seed records (QA CV L01–L15, H/N/K, D01–D09) at ~15:40 UTC, mid-way through D07 — D07 was re-run on fresh seeds (QA CV R01–R10, created by this run); D02, D03, D04, D05, D06 and D20 had already finished on the morning seeds before they were deleted; and (b) together with this run kept hitting the account's 5-session cap, which revoked this run's browser session three times (re-logged in each time) and two of the three A10 expiry probes.
- **Second user.** "test user 1" (User profile) exists but its credentials are not in `CRM-TAVI-Automation/.env`; A03/A04 are Inconclusive. D17 and the B14 shared/foreign checks used ALT1 (Admin) because those checks do not depend on the profile.
- **Layouts.** The "… Permission" fields exist only on the Leads *FieldPermissions* layout, and a view only shows its own layout's records, so D07, D08, D09, D15, D16 and D17 ran on FieldPermissions seeds R01–R10 (case L01… = R01…).
- **Grid vs module filter.** "Grid" counts are the exact call the grid makes (`GET /records?view_id=&layout_id=`); "module filter" is the call the Filter panel makes (`GET /records?filters=[…]&layout_id=`). Every criteria case saved the view in the editor UI first; the full operator × value matrices were then driven through `PATCH /views/{id}` with `expected_row_version`.
- **Evidence.** Per the standing rule, only failed cases have screenshots, each annotated side by side against live Zoho CRM (org940103646, Edge, read-only — nothing was saved in Zoho). Behaviours that could not be seen in Zoho without writing data are marked "Not checked"; API-only checks are "Not comparable".
- **Deviations from the case text:** C09 uses "Last Activity" for "Modified Time" (not offered on the Standard layout); D15 has only two options (1, 2) on Multi Select Permission, so the {C} record could not be seeded; C22's `columns:null` and `page_size:null` are valid per the contract (treated as "not set").
- **Spec drift spotted (not defects):** criteria empty-operator id is `is_empty` (spec §2.3 says `empty`) and date/picklist/multi-select/lookup also offer "Is not empty"; the view concurrency key is `expected_row_version` (a PATCH without it skips the check); the week starts on Monday.
- **Observations (not filed):** a filtered view with no matches shows "No Deals yet – Create your first Deal"; the toolbar shows "Sort: created_at asc" (API name, not the label); Move up / Move down / Remove field buttons in the column chooser have no field name in their accessible label; error bodies for invalid views say only "The view is not valid." unless a field-level reason exists.


## Case details

### CVS-A03 — Inconclusive
The API refuses a public view from a user without Manage Shared Views

Needs a User-profile login (no Manage Shared Views). 'test user 1' (User profile, user id 45ffbc5b-…) exists in the tenant, but its credentials are not in CRM-TAVI-Automation/.env and could not be read from elsewhere. ALT1/ALT2 are Admin profiles, so running as them would not test the permission. Per the case text: Inconclusive, not Fail, until the account is provided.

### CVS-A04 — Inconclusive
A user a view is shared with cannot edit or delete it in the UI or the API

Needs a User-profile login (no Manage Shared Views). 'test user 1' (User profile, user id 45ffbc5b-…) exists in the tenant, but its credentials are not in CRM-TAVI-Automation/.env and could not be read from elsewhere. ALT1/ALT2 are Admin profiles, so running as them would not test the permission. Per the case text: Inconclusive, not Fail, until the account is provided. (The view shared TO a user can be prepared by OWNER in seconds once the login exists.)

### CVS-A10 — Fail (High)
View requests without a valid token are refused with no data

Request 1 (no Authorization header) -> 401 TOKEN_MISSING 'Authorization token is required.', no data (ok); a malformed bearer -> 401 TOKEN_INVALID (ok). Request 2 (expired token): a fresh login token (JWT iat 15:14:38Z, exp 15:19:38Z = 5 min), never refreshed, was sent at 15:22:55Z (server Date header; server and local clocks agree within 1 s) -> 200 OK with the full Leads view list, 197 s after its exp. After POST /iam/auth/logout the same token -> 401 SESSION_REVOKED. So access-token expiry is not enforced; only session revocation stops a token. One clean observation: two other probe tokens were revoked by the account's 5-session cap (shared with a parallel run) before they could be checked (both answered 401 SESSION_REVOKED, not an expiry code).

Evidence: [CVS-A10-vs-zoho.png](browser-sessions/run-174737-d749/screenshots/annotated/CVS-A10-vs-zoho.png) · [CVS-A10.jsonl](browser-sessions/run-174737-d749/logs/CVS-A10.jsonl)

### CVS-A11 — Pass
A request without x-tenant-id never returns another tenant's data

With bearer + x-tenant-id: 200, 96 Leads list views. Without x-tenant-id: 200, the identical 96 views (same ids). Recorded behaviour: the header is not required - the tenant comes from the token. Extra: a different tenant id (…0003) and a non-UUID value in x-tenant-id were also ignored and returned the same NDC-Staging views; no request returned another tenant's data.

Evidence: [CVS-A11.jsonl](browser-sessions/run-174737-d749/logs/CVS-A11.jsonl)

### CVS-B14 — Fail (Low)
The ?view= URL opens permitted views and falls back safely for others

Shared/foreign views were made by ALT1 (creator profile does not matter here). Own 'QA CV x' -> opens, tab selected. 'QA CV shared-to-me' (ALT1, shared with OWNER) -> opens, 9 records. Deleted 'QA CV gone' and ALT1's private 'QA CV user-private' (both API 404 for OWNER) -> ?view= is stripped, a toast says 'That view is no longer available. Showing your default view.', nothing of the view is shown, no console errors, no failed API calls. FAIL: the fallback is not All Leads - both land on 'QA CV tab2' and lastListViewId is rewritten to it (it was 'QA CV shared-to-me' a moment before), so the 'default view' is neither All Leads nor the last view used. Zoho for an unknown view id shows 'This action cannot be performed. The view you are trying to access is not available. Go To All Leads'. Extra finding (seen in D08): a full page load of ?view=<id> for a view on a non-default layout (FieldPermissions) is also dropped - the app loads the Standard layout and ignores the view, even though the view exists; in-app navigation to the same URL works. openListViewIds still holds 3 deleted ids (as in B03).

Evidence: [B14-foreign-id-falls-back-to-QA-CV-tab2.png](browser-sessions/run-174737-d749/screenshots/B14-foreign-id-falls-back-to-QA-CV-tab2.png) · [CVS-B14-vs-zoho.png](browser-sessions/run-174737-d749/screenshots/annotated/CVS-B14-vs-zoho.png) · [CVS-B14.jsonl](browser-sessions/run-174737-d749/logs/CVS-B14.jsonl)

### CVS-C02 — Fail (Low)
The view name is validated and every accepted name is shown as plain text

D1 '' and D2 '   ': Save is silently disabled and 'Enter a name for the view.' is never shown (Zoho keeps Save enabled and shows 'Custom view name cannot be empty.'). D5 (121 chars): input maxlength=120 cuts the 121st char silently, so 'A view name can be at most 120 characters.' never appears - same pattern as Zoho (maxlength=100); the API alone enforces it (121 chars -> 422 too_long). D3 'Q', D4 (120), D8 Arabic, D9 (RLM kept), D10 emoji/astral saved exactly as typed. D6 stored trimmed ('QA CV trim'). D7 'qa cv NAME' refused as duplicate of 'QA CV name' (409 VIEW_NAME_TAKEN, names are case-insensitive). D14: U+200B and U+0007 kept in the stored name. D11 shown as literal text in tab, picker, Manage page and delete dialog; no <img> created, no alert, no console errors.

Evidence: [CVS-C02-vs-zoho.png](browser-sessions/run-174737-d749/screenshots/annotated/CVS-C02-vs-zoho.png) · [C02-spaces-name-save-disabled-no-message.png](browser-sessions/run-174737-d749/screenshots/C02-spaces-name-save-disabled-no-message.png) · [C02-121-chars-truncated-to-120.png](browser-sessions/run-174737-d749/screenshots/C02-121-chars-truncated-to-120.png)

### CVS-C09 — Fail (Low)
The grid shows exactly the chosen columns in the chosen order

Editor (Standard layout): added Company, Created At, Email, Full Name, Last Activity, Lead Owner, Lead Status, Phone, then reordered with Move up to Full Name, Lead Status, Company, Email, Phone, Lead Owner, Created At, Last Activity ('Modified Time' is not offered on the Standard layout; Last Activity = last_modified_at). POST columns in that exact order -> 201. Grid after reload: Full Name, Lead Status, Company, Email, Phone, Lead Owner, Created At, Last Activity - order correct - but two unchosen columns, Tags and Source, are appended. Manage Columns panel says 'VISIBLE (8)' and lists only the 8, so the panel and the grid disagree, and Tags/Source cannot be chosen or removed in the editor. Not exactly the chosen columns.

Evidence: [C09-grid-columns.png](browser-sessions/run-174737-d749/screenshots/C09-grid-columns.png) · [C09-manage-columns-8-vs-grid-10.png](browser-sessions/run-174737-d749/screenshots/C09-manage-columns-8-vs-grid-10.png)

### CVS-C20 — Pass
A PATCH with only a name keeps the other settings

'QA CV partial' created with criteria (2 rows), 8 columns, sort created_at asc, page size 50. PATCH {name:'QA CV partial-2', row_version} -> 200. GET after: only name, row_version and last_modified_at changed; settings, visibility and shared_user_ids identical.

Evidence: [CVS-C20.jsonl](browser-sessions/run-174737-d749/logs/CVS-C20.jsonl)

### CVS-C21 — Pass
Read-only view keys cannot be changed through the API

PATCH with is_system:true, owner_user_id:<ALT1>, category:public_views + can_edit:false, row_version:999 -> each 200 and the key ignored: GET shows is_system false, owner/created_by unchanged, category created_by_me, can_edit/can_delete true. row_version only advanced by the normal +1 per save (the body's row_version is ignored). The concurrency key is expected_row_version (what the editor sends): expected_row_version:1 when current is 9 -> 409 VERSION_CONFLICT, nothing changed. Observation: a PATCH that omits expected_row_version is accepted without any version check (last write wins).

Evidence: [CVS-C21.jsonl](browser-sessions/run-174737-d749/logs/CVS-C21.jsonl)

### CVS-C22 — Pass
Wrong value types in a create request are rejected cleanly

name 12345 / ['QA CV arr'] / {x:1} -> 400 VALIDATION_ERROR; name null -> 422; columns 'name' / {a:1} -> 422; criteria 'status=1' / [] / 7 -> 422; page_size '25' / [25] / {n:25} -> 422 (also 0 and 500 -> 422). No 500 anywhere, no partial view. Two nulls in the test data are valid per the contract and were accepted as 'not set': columns:null -> 201, stored as [] (= 'No columns chosen'); page_size:null -> 201 (contract: page_size|null). Suggest removing those two values from the case. Observation: 422 bodies only say 'The view is not valid.' with no field detail.

Evidence: [CVS-C22.jsonl](browser-sessions/run-174737-d749/logs/CVS-C22.jsonl)

### CVS-D01 — Pass
Each field type offers exactly the operators listed in spec §2.3, with none missing and none extra

Operator lists read in the editor for 21 fields (Leads Standard: Company, Lead Status, Owner, Source, Tags, Review Status, Created At, Lead Source; Leads FieldPermissions: Date, Date Time, Checkbox, Multi Select, Lookup, Pick List, Number, Currency Permission; Deals: Amount, Stage, Pipeline, Closing date, Account) and in the Filter panel for the same fields - every list is identical (same operators, same order). Against spec §2.3: Text (Company) = the 8 listed; Number/Currency/Amount = equals, not_equal_to, greater_than, less_than, >=, <=, is_empty, is_not_empty (no between); Date = the listed set incl. last/next_n_days, age_in_days, due_in_days, before/after_now; Datetime = date set + last_n_hours/next_n_hours; Checkbox = is_true/is_false; Picklist/Status/Owner/Source/Review status = equals, not_equal_to, contains_any_of, contains_none_of, is_empty; Multi-select/Tags = contains_any/all/none_of, is_empty; Lookup/Pipeline/Account = equals, not_equal_to, is_empty. Nothing from §2.3 is missing. Only difference: date, datetime, picklist, multi-select and lookup also offer 'Is not empty' (and the empty id is is_empty, not 'empty'), which §2.3 does not list - Zoho has both, so this is treated as a spec update, not a defect. Amount never offers contains (cf. D19 API gap).

Evidence: [CVS-D01.jsonl](browser-sessions/run-174737-d749/logs/CVS-D01.jsonl)

### CVS-D02 — Pass
Text operators split records correctly for odd input, follow the module filter's case rule, and treat SQL-like input as a literal

Seeds (Standard layout): L01 'QA CV Acme', L02 'qa cv acme', L03 'شركة الأمل', L04 'QA CV Rocket 🚀', L05 'QA​CV Zero', L06 empty (other QA CV leads empty). 'QA CV text-sweep' built in the editor (Full Name starts with 'QA CV' + Company <op> <value>); one UI save per value (D3 starts_with, D6/D7/D12 equals, D8/D14 contains, D10 ends_with) - the PATCH body and GET carry the value byte-exact (D6 spaces kept, U+200B kept, emoji U+1F680, Arabic). Full 6 operators x 7 values via PATCH: in all 42 cases grid (records?view_id) == module filter (records?filters=, the call the Filter panel makes). Rules recorded: matching is case-insensitive (D3 starts_with 'Q' -> L01,L02,L04,L05; D7 equals 'QA CV ACME' -> L01,L02); leading/trailing spaces are trimmed at match time but stored as typed (D6 equals -> L01,L02); D8 contains 'الأمل' -> L03 only; D10 ends_with '🚀' -> L04 only; D12 is a literal (equals/contains/starts/ends -> 0, not_equal_to/does_not_contain -> all 16, no error); D14 contains/starts_with 'QA​CV' -> L05 only, not L01 (zero-width kept). not_equal_to/does_not_contain include records with an empty Company (same in the module filter). No 500.

Evidence: [CVS-D02.jsonl](browser-sessions/run-174737-d749/logs/CVS-D02.jsonl)

### CVS-D03 — Pass
is_empty and is_not_empty classify null, blank and whitespace-only text the same way as the module filter

Seeds: L01 Comment never set (null), L02 '' (set to 'x', then cleared - stored as an empty string), L03 '   ', L04 'Call back' (L09 also '   ' from an earlier run). 'QA CV text-empty' built in the editor (Full Name starts with 'QA CV' + Comment Is empty) -> 13 records; edited in the editor to Is not empty -> 3. Rule recorded: null and '' match is_empty; whitespace-only ('   ') does NOT (it matches is_not_empty). is_empty: H01q,L01,L02,L05,L06,L07,L08,L10,L11,L12,L13,L14,L15; is_not_empty: L03,L04,L09 - exact complement (13+3 = 16 QA CV leads), L04 never in is_empty, and both identical to the module filter (records?filters=).

Evidence: [CVS-D03.jsonl](browser-sessions/run-174737-d749/logs/CVS-D03.jsonl)

### CVS-D04 — Pass
Number operators are exact at the 9999.99 / 10000 / 10000.01 boundary

Seeds already in place: D01 0, D02 9999.99, D03 10000, D04 10000.01, D05 empty, D06 -1, D07 15000, D08 1000000000 (+ D09 empty). 'QA CV amount-bounds' built in the Deals editor (Deal name starts with 'QA CV' + Amount equals 10000) -> 1; edited in the editor through every operator (ids: not_equal_to, greater_than, less_than, greater_than_or_equal_to, less_than_or_equal_to). equals 10000 -> D03; not_equal_to -> D01,D02,D04,D05,D06,D07,D08,D09 (empty amounts included, same as the module filter); greater_than -> D04,D07,D08; less_than -> D01,D02,D06; >= -> D03,D04,D07,D08; <= -> D01,D02,D03,D06; equals 9999.99 -> D02 only; equals 10000.01 -> D04 only (no rounding). Grid == module filter in all 8. Observation: the editor sends the amount as a string ('10000').

Evidence: [CVS-D04.jsonl](browser-sessions/run-174737-d749/logs/CVS-D04.jsonl)

### CVS-D05 — Fail (Medium)
Odd numeric input is normalised or rejected with a message and is never stored as 15

Editor (Amount box is input type=number): '15,000' -> the browser drops the comma, saved as '15000' -> D07 (ok). '١٥٠٠٠' and 'abc' -> box stays empty, Save shows 'Complete this row (field, operator and value) or remove it.' (ok, blocked with a message). '-1' -> D06 (ok). FAIL '1e9' -> saved as the string '1e9' (not normalised, not rejected) and the view returns 0 records although D08 = 1000000000. API: POST with value '15,000', '١٥٠٠٠', '1e9' and 'abc' -> all 201 Created, the raw string is stored and the view matches 0 records (module filter also 0); expected 400/422 for 'abc' and normalise-or-reject for the others. Numbers work: '15000'/15000 -> D07, 1e9 as a JSON number -> D08, '-1' -> D06. Nothing was ever stored as 15 or 0. No 500.

Evidence: [D05-1e9-saved-zero-records.png](browser-sessions/run-174737-d749/screenshots/D05-1e9-saved-zero-records.png) · [CVS-D05.jsonl](browser-sessions/run-174737-d749/logs/CVS-D05.jsonl)

### CVS-D06 — Pass
An empty number is distinguished from zero in view criteria

'QA CV amount-empty' built in the Deals editor (Deal name starts with 'QA CV' + Amount is empty), then edited to is not empty and equals 0. is_empty -> D05, D09 (both have no amount; D09 is an extra empty-amount deal from an earlier run); is_not_empty -> D01 (0), D02, D03, D04, D06, D07, D08 - never D05; equals 0 -> D01 only, never D05/D09. Grid == module filter for all three.

Evidence: [CVS-D06.jsonl](browser-sessions/run-174737-d749/logs/CVS-D06.jsonl)

### CVS-D07 — Pass
Date is/before/after/between/not between follow one stated bound rule, including same-day bounds

Run on the FieldPermissions layout (Date Permission only exists there). First seeds (H01-H04/N01) were deleted mid-case by the parallel morning run's cleanup, so the case was re-run on fresh seeds QA CV R01-R10 (R01 = D-6 28 Sep, R02 = D-5 29 Sep, R03 = D-2 2 Oct, R04 = D 4 Oct, R05 = D+1 5 Oct, R06-R10 empty; D = 4 Oct 2026 Cairo). 'QA CV date-abs' built and edited in the editor (between uses two date inputs 'from'/'to', stored as [from,to]). is D -> R04; is_before D -> R01,R02,R03; is_after D -> R05; is_between D-5..D -> R02,R03,R04 (bounds inclusive); is_not_between D-5..D -> R01,R05; is_between D..D -> R04. Grid == module filter for all. Rule recorded: bounds are inclusive. Observation: is_not_between returns the complement only among records that have a date (empty dates excluded), whereas number not_equal_to includes empty amounts (D04) - same in the module filter.

Evidence: [CVS-D07.jsonl](browser-sessions/run-174737-d749/logs/CVS-D07.jsonl)

### CVS-D08 — Fail (High)
today, yesterday and tomorrow resolve in the tenant timezone (Cairo), not UTC

FieldPermissions seeds (Date Time Permission, stored UTC, shown by the app in Cairo UTC+3): R01 = 3 Oct 23:50, R02 = 4 Oct 00:10, R03 = 4 Oct 23:50, R04 = 5 Oct 00:10 Cairo. 'QA CV date-rel' built in the editor (Name starts with 'QA CV' + Date Time Permission Today). Grid (records?view_id) == module filter at every check. 19:10 Cairo 4 Oct: today -> R03,R04 (expected R02,R03); yesterday -> R01,R02 (expected R01); tomorrow -> none (expected R04); the grid shows R04 as '05/10/2026 12:10 AM' inside the Today view. 23:50 Cairo 4 Oct: same (today R03,R04; yesterday R01,R02; tomorrow none). 00:10 Cairo 5 Oct: same again - expected today R04, yesterday R02,R03, tomorrow none; the results did not move at Cairo midnight because the UTC date was still 4 Oct. Relative dates are resolved on the UTC date, not the tenant's Cairo date, in both the view and the Filter panel.

Evidence: [CVS-D08-vs-zoho.png](browser-sessions/run-174737-d749/screenshots/annotated/CVS-D08-vs-zoho.png) · [D08-today-1900-cairo-shows-utc-day.png](browser-sessions/run-174737-d749/screenshots/D08-today-1900-cairo-shows-utc-day.png) · [CVS-D08.jsonl](browser-sessions/run-174737-d749/logs/CVS-D08.jsonl)

### CVS-D09 — Pass
this/last/next week, month and year return records inside the correct calendar boundaries

FieldPermissions layout, seeds R01-R10, D = Sun 4 Oct 2026 (Cairo). Week-start probe (26 Sep-12 Oct spread): this_week -> 28 Sep (Mon) .. 4 Oct (Sun) -> the build's week starts on MONDAY. Case seeds: R01 27 Sep (last day of last week), R02 28 Sep (first day of this week), R03 4 Oct (last day of this week), R04 5 Oct (first day of next week), R05 30 Sep (last day of last month), R06 1 Oct, R07 1 Nov, R08 31 Dec 2025, R09 1 Jan 2026, R10 1 Jan 2027. 'QA CV date-cal' built in the editor with This week. this_week -> R02,R03,R05,R06; last_week -> R01; next_week -> R04; this_month -> R03,R04,R06; last_month -> R01,R02,R05; next_month -> R07; this_year -> all but R08,R10; last_year -> R08; next_year -> R10. Every record falls inside its period; grid == module filter for all 9. Note: Monday start is fixed (Egypt commonly uses Saturday/Sunday; Zoho follows the locale/week setting) - worth confirming it is intended.

Evidence: [CVS-D09.jsonl](browser-sessions/run-174737-d749/logs/CVS-D09.jsonl)

### CVS-D15 — Pass
Multi-select contains_any_of, contains_all_of and contains_none_of follow correct set logic

Deviation: Multi Select Permission has only two options ('1','2'), so A='1', B='2' and the case's L04 {C} could not be seeded. Seeds R01 {1}, R02 {1,2}, R03 {2}, R04-R10 empty. 'QA CV multiselect' built in the editor (options are checkboxes) with contains any of 1,2 -> 3. contains_any_of [1,2] -> R01,R02,R03; contains_all_of [1,2] -> R02 only; contains_none_of [1,2] -> R04..R10 (empty values count as 'none of', same as module filter); is_empty -> R04..R10 (7); is_not_empty -> R01,R02,R03; extra: any_of [1] -> R01,R02, all_of [1] -> R01,R02, none_of [1] -> R03..R10. Grid == module filter in every case. Note: the empty operator id is is_empty (spec §2.3 says 'empty' - sending 'empty' gives 422), and the build also offers 'Is not empty' for multi-select, which §2.3 does not list (Zoho has both).

Evidence: [CVS-D15.jsonl](browser-sessions/run-174737-d749/logs/CVS-D15.jsonl)

### CVS-D16 — Fail (Medium)
Lookup equals, not_equal_to and empty return the correctly linked records

Seeds (FieldPermissions): R01 -> Contact X 'lead01', R02 -> X, R03 -> Contact Y 'lead02', R04-R10 empty. Editor: Lookup Permission offers Equals / Not equal to / Is empty / Is not empty, but the value control for Equals is a plain text box ('Value'), with no record search or picker and no suggestions while typing. Typing the record name 'lead01' saves value 'lead01' literally and the view shows 0 records (R01/R02 are linked to lead01). The only way to get a working criterion is to know and paste the record's UUID. Server logic is correct when the UUID is sent (API): equals X -> R01,R02; not_equal_to X -> R03..R10 (empty included, as the module filter does); is_empty -> R04..R10; is_not_empty -> R01,R02,R03; grid == module filter in all. So from the UI the expected results cannot be reached. Not in the missing list / NDC-1869.

Evidence: [D16-lookup-value-is-plain-text.png](browser-sessions/run-174737-d749/screenshots/D16-lookup-value-is-plain-text.png) · [CVS-D16.jsonl](browser-sessions/run-174737-d749/logs/CVS-D16.jsonl)

### CVS-D17 — Pass
A shared view with Owner = $me shows each user only the records they own

Second user = ALT1 (Mahmoud Mohamed, Admin profile) - test user 1 (User profile) credentials were not available; $me resolution does not depend on profile. Seeds (FieldPermissions): R01-R05 owned by OWNER, R06-R10 reassigned to ALT1. As OWNER, 'QA CV owner-me' built in the editor: Name starts with 'QA CV' + Owner equals 'Current user' (picker option), shared with Everyone -> POST value '$me', visibility everyone; grid 5 records. Grid call (records?view_id) as OWNER -> R01..R05; as ALT1 -> R06..R10. Module filter owner = own user id with each user's token gives the same sets. ALT1 GET view: category public_views, stored criterion owner equals '$me' (not OWNER's id).

Evidence: [CVS-D17.jsonl](browser-sessions/run-174737-d749/logs/CVS-D17.jsonl)

### CVS-D19 — Fail (Medium)
A view definition with an unknown field or operator is rejected by the API with 400/422

First pass was a false positive: every POST used pattern '(1)' with one row, and the API rejects that for the pattern alone ('A pattern needs at least two criteria rows'). Re-run with valid patterns (control view with 1 row + pattern null -> 201): unknown field does_not_exist_c -> 422 unknown_field 'That field does not exist on this module.' (1 and 2 rows); unknown operator xor_like -> 422 "filters[n].operator 'xor_like' is not a supported operator."; PATCH with the unknown field -> 422, view unchanged. FAIL: Deals 'QA CV wrong-type' with Amount (currency) + operator contains -> 201 Created (also as row 2 of '(1 and 2)' -> 201). The editor never offers contains for Amount, but the API stores it, and GET records?view_id= applies it as a text match (29 of 51 deals for '1', no error). Operator-vs-field-type is not validated server-side.

Evidence: [CVS-D19.jsonl](browser-sessions/run-174737-d749/logs/CVS-D19.jsonl)

### CVS-D20 — Pass
Three rows with an untouched pattern combine as 1 and 2 and 3

'QA CV and-default' built in the editor with 3 rows (Full Name starts with 'QA CV L0'; Lead Status is not empty; Comment is empty), pattern untouched - POST sends pattern null. Reopened editor shows AND between rows and 'Criteria Pattern ( 1 and 2 and 3 )'. Grid: 6 records L01, L02, L05, L06, L07, L08 (L03/L09 have whitespace-only Comment, L04 'Call back'); module filter with the 3 conditions ANDed returns the same 6.

Evidence: [CVS-D20.jsonl](browser-sessions/run-174737-d749/logs/CVS-D20.jsonl)

