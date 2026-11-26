// Builds report.html (self-contained) from the out/*.json results.
const fs = require('fs'), path = require('path'); const RUN = path.join(__dirname, '..'); const O = p => JSON.parse(fs.readFileSync(path.join(RUN, 'out', p), 'utf8'));
const img = f => { const p = path.join(RUN, 'screenshots/raw', f); return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : ''; };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = ['single_line', 'multi_line', 'rich_text', 'email', 'phone', 'url', 'number', 'decimal', 'currency', 'percent', 'long_integer', 'auto_number', 'checkbox', 'pick_list', 'radio_button', 'status', 'multi_select', 'date', 'date_time', 'lookup', 'user', 'address', 'location', 'file_upload', 'camera', 'image_upload', 'map', 'multi_select_lookup', 'department', 'team', 'support_plan', 'email_template', 'subform'];
const FNM = ['if', 'concat', 'coalesce', 'min', 'max', 'sum', 'avg', 'count', 'upper', 'lower', 'trim', 'len', 'abs', 'round', 'isblank', 'number', 'text', 'daysbetween', 'hoursbetween'];
const FNO = ['add', 'sub', 'mul', 'div', 'mod', 'amp', 'eq', 'ne', 'gt', 'ge', 'lt', 'le', 'and', 'or', 'not', 'iftruthy', 'cnum', 'cif', 'ccoal', 'cnest', 'cnum2', 'clen', 'ccnt', 'cmix'];
const OPLAB = { add: 'X + 1', sub: 'X - 1', mul: 'X * 2', div: 'X / 2', mod: 'X % 3', amp: 'X & "!"', eq: 'X = X', ne: 'X != X', gt: 'X > X', ge: 'X >= X', lt: 'X < X', le: 'X <= X', and: 'X && true', or: 'X || false', not: '!X', iftruthy: 'if(X, …)', cnum: 'concat(X,"|",Number)', cif: 'if(Checkbox, X, "off")', ccoal: 'coalesce(X, Single Line)', cnest: 'upper(trim(concat(X," ")))', cnum2: 'round(abs(number(X))*2,0)', clen: 'len(text(X)) > 0', ccnt: 'if(isblank(X),0,1)+if(isblank(Number),0,1)', cmix: 'X & " / " & Date & " / " & Checkbox' };
const SHORT = b => (b.match(/NDC-\d+/) || [b.startsWith('NEW') ? 'NEW-1' : ''])[0];
const grid = (rows, FN, labels) => { const cell = {}; for (const r of rows) { const k = r.f + '|' + r.t; const c = cell[k] ||= { pass: 0, fail: 0, note: 0, bugs: new Set(), newf: 0 };
    if (r.verdict === 'PASS') c.pass++; else if (r.verdict === 'NOTE') c.note++; else { c.fail++; if (r.bug) c.bugs.add(SHORT(r.bug)); else c.newf++; } }
  let h = '<div class="gw"><table class="grid"><tr><th>type \\ function</th>' + FN.map(f => `<th title="${esc(labels?.[f] || f)}">${esc(labels ? f : f + '()')}</th>`).join('') + '</tr>';
  for (const t of T) { h += `<tr><th>${t}</th>`; for (const f of FN) { const c = cell[f + '|' + t]; if (!c) { h += '<td class="na">–</td>'; continue; }
      const cls = c.fail ? (c.newf || [...c.bugs].includes('NEW-1') ? 'nw' : 'kn') : c.note && !c.pass ? 'nt' : 'ok'; const txt = c.fail ? [...c.bugs].join(' ') || 'new' : c.note && !c.pass ? 'note' : '✓';
      h += `<td class="${cls}" title="pass ${c.pass}, fail ${c.fail}, note ${c.note}">${esc(txt.replace(/NDC-/g, ''))}</td>`; } h += '</tr>'; }
  return h + '</table></div>'; };
const cnt = rows => { const c = { PASS: 0, 'FAIL known': 0, 'FAIL new': 0, NOTE: 0 }; rows.forEach(r => c[r.verdict] = (c[r.verdict] || 0) + 1); return c; };
const cm = O('check-crm-matrix.json').rows, co = O('check-crm-ops.json').rows, ci = O('check-crm-matrix-recs-crm-import.json').rows, dm = O('check-desk-matrix.json').rows;
const use = O('use-crm.json'), rep = O('report.json'), fix = O('fix1.json'), imp3 = O('imp3.json'), bld = O('ui-builder.json');
const uiC = ['ui-recFull.json', 'ui-recFull2.json', 'ui-desk-rFull-G1.json', 'ui-desk-rFull2-G2.json'].map(f => { try { return O(f); } catch (e) { return null; } });
const cc = cnt(cm), co2 = cnt(co), ci2 = cnt(ci), dc = cnt(dm);
const tot = [cm, co, ci, dm].reduce((a, r) => a + r.length, 0);
const fP = use.filter.filter(x => x.verdict === 'PASS').length, sP = use.sort.filter(x => x.verdict === 'PASS').length;
const truth = O('check-crm-ops.json').truth.rFull;
const H = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Formula fields — full test report (24 Nov 2026)</title><style>
body{font:14px/1.5 system-ui,Segoe UI,Arial;margin:0;color:#1f2937;background:#f6f7f9}main{max-width:1180px;margin:0 auto;padding:24px}h1{font-size:24px;margin:0 0 4px}h2{margin-top:32px;border-bottom:2px solid #e5e7eb;padding-bottom:4px}h3{margin-bottom:6px}
.sub{color:#6b7280}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:16px 0}.card{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px}.card b{font-size:22px;display:block}
table{border-collapse:collapse;background:#fff;width:100%;margin:8px 0}td,th{border:1px solid #e5e7eb;padding:5px 8px;text-align:left;vertical-align:top}th{background:#f3f4f6}
.bug{background:#fff;border:1px solid #e5e7eb;border-left:5px solid #dc2626;border-radius:6px;padding:10px 14px;margin:10px 0}.bug.k{border-left-color:#d97706}.bug.g{border-left-color:#16a34a}.bug h3{margin:0 0 4px}
.tag{display:inline-block;font-size:12px;padding:1px 7px;border-radius:10px;background:#eef2ff;margin-right:4px}.hi{background:#fee2e2}.me{background:#fef3c7}
.gw{overflow-x:auto}.grid td,.grid th{font-size:11px;padding:2px 4px;text-align:center;white-space:nowrap}.grid th:first-child{text-align:left}.ok{background:#dcfce7}.kn{background:#fde68a}.nw{background:#fca5a5}.nt{background:#e0e7ff}.na{background:#f3f4f6}
img{max-width:100%;border:1px solid #d1d5db;border-radius:6px;margin:6px 0}code{background:#f3f4f6;padding:0 4px;border-radius:4px}.legend span{display:inline-block;padding:1px 8px;margin-right:6px;border-radius:4px}
</style></head><body><main>
<h1>Formula fields — full test of every function × field type</h1>
<div class="sub">TAVI CRM + Desk, NDC-Staging (owner account), 24 Nov 2026 · run folder <code>executions/execu_2026-11-24_formula-matrix</code> · nothing filed in Plane yet</div>
<div class="cards">
<div class="card"><b>${tot.toLocaleString()}</b>value checks</div>
<div class="card"><b>${(cc.PASS + co2.PASS + ci2.PASS + dc.PASS).toLocaleString()}</b>pass</div>
<div class="card"><b>${(cc['FAIL known'] + co2['FAIL known'] + ci2['FAIL known'] + dc['FAIL known']).toLocaleString()}</b>fail — bugs already filed</div>
<div class="card"><b>4 new bugs</b>+ 1 known bug wider than filed</div>
<div class="card"><b>1,254 / 1,254</b>formula fields shown correctly on screen (4 record pages)</div>
<div class="card"><b>${fP}/${use.filter.length} · ${sP}/${use.sort.length}</b>list filters · sorts</div></div>

<h2>What was tested</h2>
<table><tr><th>Area</th><th>How</th><th>Result</th></tr>
<tr><td>Every function × every field type</td><td>19 functions × 33 field types = 627 formulas; 5 records each (all filled, all filled on layout 2, all empty, edge values, edited); every value compared with what the function should return for the value the user sees</td><td>CRM ${cm.length} checks: ${cc.PASS} pass, ${cc['FAIL known']} known bugs, ${cc['FAIL new']} new (1 bug), ${cc.NOTE} notes<br>Desk ${dm.length} checks: ${dc.PASS} pass, ${dc['FAIL known']} known bugs, ${dc['FAIL new'] || 0} new, ${dc.NOTE} notes</td></tr>
<tr><td>Operators and combinations</td><td>24 expressions × 33 types = 792 formulas (CRM module QA FX Matrix Ops): + − × ÷ %, &, all 6 comparisons, &&, ||, !, if(X…), and 8 two-field / nested formulas; 4 records</td><td>${co.length} checks: ${co2.PASS} pass, ${co2['FAIL known']} known bugs, ${co2['FAIL new']} new (same bug), ${co2.NOTE} recorded (truth rules, date arithmetic)</td></tr>
<tr><td>Edge values</td><td>Arabic + emoji text, 3,000-character text, HTML/script text, 0, 0.1, −0.005, 1,000,000,000, 100 %, negative decimals (−2.55, 2.25), false checkbox, all 3 multi-select options, 29 Feb 2028, 1 Jan 1970, date-time crossing midnight Cairo, half-filled subform rows, 2 camera photos, Arabic address, (0,0) map</td><td>Engine correct for all edge values (rounding half away from zero, leap day, 1970, large numbers); only the known bugs show</td></tr>
<tr><td>Recalculation on edit</td><td>Every input of one record changed at once (API = inline edit)</td><td>All formulas recalculated ✓</td></tr>
<tr><td>Import</td><td>CSV with 16 field types into the matrix module</td><td>Formulas computed on the imported record ✓ (${ci2.PASS}/${ci.length}, rest = known bugs + new bug 1); <b>Lookup by name fails</b> (new bug 4)</td></tr>
<tr><td>Workflow field update</td><td>Rule sets Number + Single Line on create</td><td><b>PASS</b> — formulas recalculated (8, "WF TEXT"). NDC-3217 failed for this yesterday → workflow part looks fixed (blueprint part not re-tested)</td></tr>
<tr><td>List filters / sort</td><td>Per type: filter on isblank() (boolean), len() > 3 (number), upper() contains (text); sort by len()</td><td>${fP}/${use.filter.length} filters, ${sP}/${use.sort.length} sorts PASS (1 filter not run: sample value was only spaces)</td></tr>
<tr><td>Reports</td><td>Grouped (sum of abs(Number) by upper(Pick List)); detail with 99 formula columns × 14 records</td><td>PASS — totals and all 1,386 cells equal the records</td></tr>
<tr><td>On screen</td><td>Record page of both layouts in CRM and Desk; create form of both CRM layouts; layout builder field list</td><td>${uiC.filter(Boolean).map(u => u.ok + '/' + u.expected).join(', ')} shown = stored value; create form: 330 + 297 formula fields read-only "Computed after save"; builder offers 34/35 fields (not Rollup — correct) and all 19 functions</td></tr>
</table>

<h2>New bugs (4)</h2>
<div class="bug"><h3>1. Formula field | Formulas treat a User field as empty when it was filled in by its default value</h3><span class="tag me">Medium</span><span class="tag">CRM only</span>
<p>A User field is filled automatically with the signed-in user (create form, API create without the field, and import). The record shows the user, but every formula reading it calculates as if it were empty: <code>isblank</code> = true, <code>if(isblank…)</code> = "empty", <code>len</code> = 0, <code>X - 1</code> = −1. Choosing the user by hand gives correct results. <b>Desk is not affected</b> — the same test on Desk gives isblank = false.</p>
<p>Seen on: CRM "QA FX Matrix 2 - all empty", "QA FX matrix - all empty", "QA FX Matrix - imported" (17 formulas each).</p></div>
<div class="bug"><h3>2. Modules and Fields | A record cannot be edited when its layout has a Rollup Summary field</h3><span class="tag hi">High</span><span class="tag">CRM + Desk</span>
<p>The Edit form shows the Rollup Summary as an input box and sends its value on Save. The server refuses the whole save: <i>"Field 'in_rollup_summary' uses read-only datatype 'rollup_summary' and cannot be set by clients."</i> Nothing is saved. Creating a record works (the empty rollup is not sent). Seen on CRM "QA FX matrix - edge values" and Desk "QA FX matrix - edge values".</p>
<img src="${img('form-clear-after-save.png')}" alt="CRM edit form error"><img src="${img('desk-edit-save.png')}" alt="Desk edit form error"></div>
<div class="bug"><h3>3. Formula field | The + operator joins text instead of adding (date + 1 gives "2026-11-241")</h3><span class="tag me">Medium</span><span class="tag">CRM (Desk shares the engine — not run there)</span>
<p>When the left side is not a number, <code>+</code> silently glues the text: <code>Pick List + 1</code> → "Green1", <code>Date + 1</code> → "2026-11-241", <code>Date Time + 1</code> → "2026-11-24T21:30:00Z1", <code>Auto Number + 1</code> → "MX-0011"; the formula's return type is Number. <code>-</code>, <code>*</code>, <code>/</code> on the same fields give blank. Expected: add for numbers (and days for dates, like Zoho's date arithmetic), or refuse the formula — never a glued text. Affects every non-number field type.</p></div>
<div class="bug"><h3>4. Import | A Lookup column cannot be matched by the record name</h3><span class="tag me">Medium</span><span class="tag">CRM</span>
<p>Importing into a module with a Lookup to Accounts: the value "QA FX Matrix Acc" and the value "Anyware Software" (a normal account) are both refused — <i>"No existing record matches 'Anyware Software'."</i> — although both accounts exist with exactly that Account Name. The row is not created. Import sessions a038b54f… and the "Anyware Software" check (out/fix1.json, out/imp3.json).</p></div>

<h2>Known bugs — still failing today</h2>
<div class="bug k"><h3>NDC-3221 — now also Map, File Upload, Image Upload and Camera</h3><p>Multi-select, multi-select lookup, address and location still read as empty in every function. <b>Four more types behave the same and are not in the ticket</b>: Map, File Upload, Image Upload, Camera (concat → "[]", len 0, isblank true; count(Camera) = 1 while isblank(Camera) = true). CRM + Desk. Draft comment ready.</p></div>
<div class="bug k"><h3>NDC-3220 — Lookup, User, Department, Email Template give the id</h3><p>Also seen for Support Plan. len(Lookup) = 36 (length of the id).</p></div>
<div class="bug k"><h3>NDC-3222 — return type not enforced</h3><p>coalesce / if on number or checkbox fields returns a number/boolean into a Text formula.</p></div>
<div class="bug k"><h3>NDC-3224 — date-time shown in UTC</h3><p>text(), concat(), upper() of a Date Time show "2026-11-24T21:30:00Z" (raw UTC) instead of Cairo time.</p></div>
<div class="bug k"><h3>NDC-3225 — min() counts an empty field as 0</h3><p>min(empty, 100) = 0 for every type.</p></div>
<div class="bug g"><h3>NDC-3217 — workflow update: PASS today</h3><p>A workflow FieldUpdate on Number and Single Line recalculated the formulas (sum 8, "WF TEXT"). Yesterday this failed. The blueprint part of NDC-3217 was not re-tested.</p></div>

<h2>Observations (not filed)</h2>
<ul>
<li><b>Empty text vs. no value.</b> A text field set to "" (or only spaces) is stored as text, not as blank: isblank() says true, but <code>sum(X,1)</code> gives blank instead of 1, <code>min(X,100)</code> blank instead of 0, len("   ") = 3. Seen through the API; I could not check how the Edit form clears a field because of bug 2.</li>
<li><b>round() of an empty value is 0</b> — so the rounded daysbetween/hoursbetween show 0 (not blank) for an empty or non-date input. Same blank-as-0 rule as abs() and number().</li>
<li><b>Truth rules</b> (used by &&, ||, !, if(X,…)) are consistent across all 33 types: non-empty text, non-zero numbers, true, set dates/lookups = true; 0, false, empty = false. Fields hit by NDC-3221 are always false.</li>
<li><b>CRM shows Department, Team and Support Plan fields</b> on the form as "not available in this app" — the field types can be added to a CRM module but cannot be filled there.</li>
<li><b>Imported date-time</b> "2026-12-01 10:15" is stored exactly as typed (no time zone, not ISO), unlike date-times saved from the form/API.</li>
<li><b>Pipeline</b> is listed by the field-type API but is system-only (builder never offers it) — not filed.</li>
<li><b>One layout holds at most 512 fields</b> (server limit) — so the matrix is split in two layouts per app.</li>
</ul>

<h2>Result grid — CRM, function × type</h2>
<p class="legend"><span class="ok">✓ pass</span><span class="kn">known bug (ticket number)</span><span class="nw">new bug</span><span class="nt">recorded, no rule</span> — each cell combines 5 records; hover a cell for counts.</p>
${grid(cm, FNM)}
<h2>Result grid — Desk, function × type</h2>${grid(dm, FNM)}
<h2>Result grid — CRM operators and combinations</h2><p>Column = expression (hover for the full expression). X is the field of that row.</p>${grid(co, FNO, OPLAB)}

<h2>On-screen evidence</h2>
<h3>Create form — formula fields read-only</h3><img src="${img('create-form-L1-fx-if.png')}" alt="create form">
<h3>Layout builder — Insert a field + 19 functions</h3><img src="${img('builder-new-formula-panel.png')}" alt="builder">

${fs.existsSync(path.join(RUN, 'out/zoho-section.html')) ? fs.readFileSync(path.join(RUN, 'out/zoho-section.html'), 'utf8') : ''}
<h2>Not covered</h2>
<ul><li>Blueprint transition recalculation per type (NDC-3217 blueprint part), kanban, export, email merge (missing feature, NDC-3229), mobile apps, field permissions per profile.</li>
<li>Desk: operators module and the use tests (filters, import, workflow, reports) were run on CRM only — the formula engine is shared, values on Desk match CRM.</li>
<li>Team (no Desk teams exist) and Support Plan on CRM (only discontinued plans) could not be filled.</li></ul>

<h2>Test data (kept on staging)</h2>
<table><tr><th>App</th><th>Module</th><th>Content</th></tr>
<tr><td>CRM</td><td>QA FX Matrix</td><td>36 inputs, 627 formulas, layouts "QA FX Formula Matrix 1/2", ~15 records</td></tr>
<tr><td>CRM</td><td>QA FX Matrix Ops</td><td>36 inputs, 792 operator/combination formulas (not placed on a layout), 5 records</td></tr>
<tr><td>Desk</td><td>QA FX Matrix Desk</td><td>36 inputs, 627 formulas, layouts "QA FX Formula Matrix 1/2", 6 records</td></tr>
<tr><td>CRM</td><td>Workflow rule "QA FX Matrix WF recalc"</td><td>switched off</td></tr></table>
<p class="sub">Owner signed in 5 times today; the session was ended twice by other sign-ins to the same account. Saved sessions are deleted after the run.</p>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'report.html'), H); console.log('report.html', Math.round(H.length / 1024) + ' KB');
