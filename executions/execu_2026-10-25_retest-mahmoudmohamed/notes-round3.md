
## NDC-2117 — PASS (25 Oct)
- Editor input maxlength=120. Empty / spaces-only → "Enter a name for the view.", Save disabled (2117-01, 2117-02).
- At 120 chars → "A view name can be at most 120 characters."; typing/pasting a 121st char is cut at 120 (2117-03).
- Exact duplicate "QA RT 2098 last" in editor → "You already have a view with this name." (2117-05).
- API: exact / other case / trailing space → 409 VIEW_NAME_TAKEN "You already have a view with that name on this module."; "   " → 422 required; 121 chars → 422 too_long.
- INFO: uniqueness is scoped by layout_id. API view "QA RT 2098 last" (layout null) and UI view "qa rt 2098 LAST" (Standard layout) coexist in the same Leads picker (2117-04). Only reachable via API-created views.
- Cleanup: view 1ec1626c-5c12-4552-8934-2f3c0e27e795 "qa rt 2098 LAST".

## NDC-2122 — DECISION (25 Oct)
- Editor: Edit Pattern box lower-cases while typing: "(1 OR 2)" → "(1 or 2)", "(1 AND 2)" → "(1 and 2)" (2122-02). Main Save paused while editing ("Save or cancel the pattern to continue").
- UI save sends and stores "(1 and 2)" (POST 201, view 6f41abfa). Summary then shows "( (1 and 2) )" — doubled brackets (cosmetic).
- API still accepts upper/mixed case: "1 And 2" → 201 stored "1 And 2" (c60d7685); "1 OR 2"/"1 AND 2" → 201.
- API view opened in editor: read-only summary shows "( 1 And 2 )" (not lower-cased); Edit Pattern box shows "1 and 2" (2122-04, 2122-05). Dev claim "opens lower-cased" holds only inside Edit Pattern.
- Evaluation identical: (first_name contains QA, lead_source not empty) "1 or 2" = "1 OR 2" = 64; "1 and 2" = "1 AND 2" = 1.
- Ticket expected API to reject upper case; dev says case-insensitive by spec; toggle suggestion (QA 15 Oct) declined. → user decides.
- Cleanup views: 6f41abfa "QA RT 2122 pattern", c60d7685 "QA RT 2122 apiMixed", b840d6b5, b7c744a1, 5e949ad5, b211662b.

## NDC-2101 — PASS (25 Oct)
- Leads layout FieldPermissions (563411f4): Lookup Permission (polymorphic) + Multi-Select Lookup Permission. Seeds: Q1 5e72c952 → X, Q2 ff1b0fa0 → X (multi X,Y), Q3 6ef7fd9c → Y, Q4 1cbc9b91 empty. X = contact "QA CD K4 desk r3529" f7b82386, Y = "test365 123" 25b10f22.
- Editor: module picker (Customers, Transactions, Tasks, Agency Code, Meetings, Calls, Subscriptions) + "Choose a record" dialog with search; single lookup keeps one record (picking Y unticks X); chip + "Change record". Multi: 2 chips + "Add another record".
- Overlap: no control intersects − / + at 1280, 1024, 800 px (module picker on its own line, chips truncate) (2101-06-rows-*).
- Saved view 23d6424a "QA RT 2101 lookup" stores "<module>:<record id>"; X AND any-of{Y, Mahmoud Samy} → Q2 only.
- Operators: equals X → Q1,Q2; not_equal_to X → Q3 + all empty (10,611 = 10,610 empty + 1); is_empty → Q4 + rest (10,610); is_not_empty → Q1,Q2,Q3; multi any-of → Q2,Q3.
- Cleanup views: 23d6424a, 64c7dbc3, 451ec230, 7f9cc46c, 042efe3a, 3cfa9751. Records: Q1–Q4.

## NDC-2106 — PASS (25 Oct)
- Temp number field qa_rt_temp_num (4d61be96) on Leads, placed on layout "test" (6261fa51). Views: e7e994ff "QA RT 2106 crit" (qa_rt_temp_num > 1), bd7ca478 "QA RT 2106 col" (column only).
- Layout builder → Remove from Layout → dialog "This field is in use and cannot be deleted: Custom views: QA RT 2106 crit. Change or remove the condition on this field in each view first."; Delete Permanently disabled; column-only view not listed (2106-03). Dialog cancelled, layout not saved.
- API DELETE field → 409 "\"qa_rt_temp_num\" is used by custom view(s): QA RT 2106 crit. Remove the field from those before deleting it."
- Condition replaced (PUT view 200) → DELETE field 204, field gone; column-only view still lists the column (dropped on next save per dev).
- INFO: dialog also says "Remove the field from those first (Settings → Automation / Process Management)" and the error code is FIELD_IN_USE_BY_WORKFLOW — wording points to workflows although a view blocks it.
- Cleanup views: e7e994ff, bd7ca478. Field already deleted (check Recycle Bin / layout "test" entry).

## NDC-2280 — FAIL (25 Oct)
- View cfc5ae67 "QA RT " + 110×x (116 chars) on Standard layout. Manage Leads custom views at 1280×984.
- Fixed part: View Name column capped (td 285–669, max-width 384px); Shared To / Created By / Last Modified By / Layout / Actions headers all inside the viewport (table right 1255); no horizontal scrollbar; full name in the button's title attribute (116 chars).
- Still failing: name is not cut with "…" — the text span is 815 px wide and runs to x=1116, drawn over Shared To ("Only me"), Created By and Last Modified By; the pin icon sits on top of the text (2280-01, 2280-02). Cause: the "truncate" span is inside an unconstrained wrapper span inside an inline-flex button, so it never gets a width.
- Minor: Layout column wraps "Standar / d".
- Cleanup view: cfc5ae67.

## NDC-2113 — PARTIAL (25 Oct)
- Deals (shown as "Transactions") Kanban "QA RT 2113 kb" c6fcd43b by Stage. Deals: a 95503f26 (stage cleared → Unaccounted), b dbd0c426 (qualification).
- Out of Unaccounted: drag a → Proposal → card moves, API stage = proposal (2113-03). PASS.
- Into Unaccounted: while dragging, Unaccounted dims (opacity 0.5); after the drop b stays qualification in the API. Later drops (2nd, 3rd) refused cleanly.
- Still failing: the FIRST drop on Unaccounted after the board loads, while Unaccounted holds a card, puts the card into the neighbouring Closed_lost column and opens "Verify details — Fill in the required details before closing this deal." (reproduced 3/3: runs d8, d9, d14). Cancel puts it back in Qualification (2113-02). A user who fills the dialog would be closing the deal by accident. With Unaccounted empty, 3/3 drops refused cleanly.
- Unaccounted header is shown struck through and keeps a "Create Transactions" footer (observation).
- Cleanup: Kanban view c6fcd43b; deals a, b.
