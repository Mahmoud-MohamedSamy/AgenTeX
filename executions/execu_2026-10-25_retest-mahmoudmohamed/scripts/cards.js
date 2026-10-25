// Writes the API/log evidence cards for round 3 (25 Oct 2026). Usage: node cards.js  → cards/*.json, then apicard.js each.
const fs = require('fs'); const path = require('path');
const L = '/api/v1/modules/{Leads}';
const C = {
  'NDC-2098-log.png': { title: 'NDC-2098 · ?view= fallback — toast log (MutationObserver) and the view actually shown', rows: [
    ['last-used: 2098 last', 'GET /modules/{Leads}?view=ff0a79b9… (deleted view)', 'toast: "That view is no longer available. Showing All Leads."  ·  ?view removed  ·  view shown: QA RT 2098 last, 2 records', 'bad'],
    ['last-used: 2098 last', 'GET /modules/{Leads}?view=1cb2da03… (test user 2 private)', 'toast: "That view is no longer available. Showing All Leads."  ·  ?view removed  ·  view shown: QA RT 2098 last, 2 records  ·  foreign name not shown', 'bad'],
    ['last-used: other layout', 'GET /modules/{Leads}?view=ff0a79b9… (deleted view)', 'same toast  ·  view shown: All Leads (171 on this layout)', 'ok'],
    ['last-used: other layout', 'GET /modules/{Leads}?view=1cb2da03… (foreign view)', 'same toast  ·  view shown: All Leads  ·  foreign name not shown', 'ok']] },
  'NDC-2117-api.png': { title: 'NDC-2117 · POST /views name validation (Leads)', rows: [
    ['exact duplicate', `POST ${L}/views {name:"QA RT 2098 last"}`, '409 VIEW_NAME_TAKEN "You already have a view with that name on this module."', 'ok'],
    ['other case', `POST ${L}/views {name:"QA RT 2098 LAST"}`, '409 VIEW_NAME_TAKEN', 'ok'],
    ['trailing space', `POST ${L}/views {name:"QA RT 2098 last "}`, '409 VIEW_NAME_TAKEN', 'ok'],
    ['spaces only', `POST ${L}/views {name:"   "}`, '422 INVALID_VIEW · name required "A view name is required."', 'ok'],
    ['121 characters', `POST ${L}/views {name:"QA RT "+115×z}`, '422 INVALID_VIEW · too_long "A view name may be at most 120 characters."', 'ok'],
    ['INFO: scope', 'existing: "QA RT 2098 last" (layout null, API) + UI save "qa rt 2098 LAST" (Standard layout)', '201 — uniqueness is per layout_id; both now in the same Leads picker', 'info']] },
  'NDC-2122-api.png': { title: 'NDC-2122 · criteria pattern case — API accepts and stores mixed case; results identical', rows: [
    ['UI save', 'Edit Pattern: typed "(1 AND 2)" → box shows "(1 and 2)"', 'POST body pattern "(1 and 2)" → 201, stored "(1 and 2)"', 'ok'],
    ['API mixed case', `POST ${L}/views pattern "1 And 2"`, '201 — stored "1 And 2"; editor summary shows "( 1 And 2 )", Edit Pattern box "1 and 2"', 'info'],
    ['API upper case', `POST ${L}/views pattern "1 OR 2" / "1 AND 2"`, '201 / 201 — accepted', 'info'],
    ['evaluation OR', 'first_name contains QA, lead_source not empty', '"1 or 2" = 64 records · "1 OR 2" = 64 records', 'ok'],
    ['evaluation AND', 'same rows', '"1 and 2" = 1 record · "1 AND 2" = 1 record', 'ok']] },
  'NDC-2101-api.png': { title: 'NDC-2101 · lookup criteria saved from the picker — results by operator (Leads, FieldPermissions layout)', rows: [
    ['saved by UI', 'Lookup Permission equals X  AND  Multi-Select any of {Y, Mahmoud Samy}', 'stored "6f553963…:f7b82386…" / ["…:25b10f22…","…:9ea42d35…"] → Q2 only', 'ok'],
    ['equals X', 'lookup_3_9 equals <Contacts:X>', '2 records: Q1, Q2', 'ok'],
    ['not_equal_to X', 'lookup_3_9 not_equal_to <Contacts:X>', '10,611 = Q3 + 10,610 empty (same as module filter)', 'ok'],
    ['is_empty / is_not_empty', 'lookup_3_9', '10,610 incl. Q4  /  3: Q1, Q2, Q3', 'ok'],
    ['multi any of Y', 'multi_select_lookup_8_9 contains_any_of [Contacts:Y]', '2 records: Q2, Q3', 'ok']] },
  'NDC-2106-api.png': { title: 'NDC-2106 · deleting a field used by a view’s criteria', rows: [
    ['setup', 'number field qa_rt_temp_num; view "QA RT 2106 crit" (> 1); view "QA RT 2106 col" (column only)', '201 / 201 / 201', 'info'],
    ['delete refused', 'DELETE /modules/{Leads}/fields/4d61be96…', '409 "\\"qa_rt_temp_num\\" is used by custom view(s): QA RT 2106 crit. Remove the field from those before deleting it."', 'ok'],
    ['condition changed', 'PUT /modules/{Leads}/views/e7e994ff… (criteria → first_name contains)', '200', 'ok'],
    ['delete allowed', 'DELETE /modules/{Leads}/fields/4d61be96…', '204 — field gone; column-only view did not block', 'ok'],
    ['INFO', 'error code / dialog hint', 'code FIELD_IN_USE_BY_WORKFLOW; dialog also says "(Settings → Automation / Process Management)"', 'info']] },
  'NDC-2120-api.png': { title: 'NDC-2120 · removing a pick-list option used by a view', rows: [
    ['remove B', 'PUT field qa_rt_pick [A, C] — view "QA RT 2120 pick" equals "qa rt OPT b"', '409 PICKLIST_OPTION_IN_USE "…used by custom view(s): QA RT 2120 pick. Change or remove it in those views first."', 'ok'],
    ['rename B', 'PUT field [A, B2]', '409 — same message', 'ok'],
    ['remove unused C', 'PUT field [A, B]', '200', 'ok'],
    ['remove A (any-of list)', 'PUT field [B] — view "QA RT 2120 anyof" contains_any_of [A]', '409 — names QA RT 2120 anyof', 'ok'],
    ['after view change', 'PATCH view → equals A; PUT field [A]', '200 — B removed', 'ok']] },
  'NDC-2124-api.png': { title: 'NDC-2124 · column overrides cap (Contacts, set through Manage columns in the UI)', rows: [
    ['ov-01 … ov-13', 'Manage columns → Hide → Apply (in order)', 'overrides stored with updatedAt', 'info'],
    ['ov-01 … ov-51', 'GET /modules/{Contacts}/list-preferences', '50 overrides · missing: ov-01 only', 'ok'],
    ['re-save ov-02, then ov-52', 'GET list-preferences', '50 overrides · missing: ov-01, ov-03 (ov-02 kept as newest)', 'ok']] },
};
for (const [out, s] of Object.entries(C)) fs.writeFileSync(path.join(__dirname, 'cards', out.replace('.png', '.json')), JSON.stringify({ out, ...s }, null, 1));
