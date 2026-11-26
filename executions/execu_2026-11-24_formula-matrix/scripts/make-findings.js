// findings.html — every finding from the 24 Nov formula work that is NOT in Plane yet, with evidence (self-contained).
const fs = require('fs'), path = require('path'); const RUN = path.join(__dirname, '..'); const J = p => JSON.parse(fs.readFileSync(path.join(RUN, p), 'utf8'));
const img = f => { const p = path.join(RUN, 'screenshots/raw', f); return fs.existsSync(p) ? `<img src="data:image/png;base64,${fs.readFileSync(p).toString('base64')}" alt="${f}"><div class="cap">${f}</div>` : ''; };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const v = x => x === null || x === undefined ? '<i>blank</i>' : esc(typeof x === 'string' ? JSON.stringify(x) : JSON.stringify(x));
const tbl = (head, rows) => `<table><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const ops = J('out/check-crm-ops.json').rows, mx = J('out/check-crm-matrix.json').rows, imp = J('out/check-crm-matrix-recs-crm-import.json').rows, dk = J('out/recs-desk-matrix.json');
const Z = J('zoho/pairs.json'), ZC = J('zoho/compare.json'), ZK = J('zoho/compare-cats.json'), ZB2 = J('zoho/behaviour2.json'), ZU = J('zoho/use2.json'), fix1 = J('out/fix1.json'), imp3 = J('out/imp3.json');
const recM = J('out/recs-crm-matrix.json'), recO = J('out/recs-crm-ops.json');
const zerr = k => (Z[k]?.tries || []).join(' ; ').replace(/^\w+:/, '');
const row = (rows, rec, f, t) => rows.find(x => x.rec === rec && x.f === f && x.t === t) || {};
// B1 + on text
const b1 = ['pick_list', 'auto_number', 'single_line', 'email', 'date', 'date_time'].map(t => { const r = row(ops, 'rFull', 'add', t); return [esc(t), v(r.input), `<code>${esc('in_' + t)} + 1</code>`, v(r.actual), esc(zerr('op_add x ' + t) || 'refused')]; });
// B2 default user
const ue = mx.filter(x => x.rec === 'rEmpty' && x.t === 'user' && ['if', 'isblank', 'len', 'concat', 'text'].includes(x.f)).map(x => [`<code>${esc({ if: 'if(isblank(In User), "empty", "set")', concat: 'concat("[", In User, "]")' }[x.f] || x.f + '(In User)')}</code>`, v(x.actual), esc(x.f === 'isblank' ? 'false' : x.f === 'if' ? '"set"' : x.f === 'len' ? '> 0' : 'the user')]);
const uFull = mx.find(x => x.rec === 'rFull' && x.t === 'user' && x.f === 'isblank');
const dEmpty = dk.rEmpty.values;
// A1 NDC-3221 extra types
const a1 = ['map', 'file_upload', 'image_upload', 'camera'].map(t => { const g = f => row(mx, 'rFull', f, t).actual; const inp = recM.rFull.values['in_' + t]; return [esc(t), esc(Array.isArray(inp) ? inp.map(x => x.filename).join(', ') : inp?.filename || (inp ? `${inp.lat}, ${inp.lng}` : '')), v(g('concat')), v(g('len')), v(g('isblank')), v(g('count'))]; });
const a1z = ['rich_text', 'file_upload', 'image_upload', 'multi_select_lookup'].map(t => [esc(t), esc(zerr('concat x ' + t))]);
// A2 date text format
const dt = ['text x date', 'text x date_time', 'concat x date'].map(k => { const r = ZC.rows.find(x => x.fn + ' x ' + x.t === k); return [`<code>${esc(k.replace(' x ', '('))})</code>`, v(r?.taviFull), v(r?.zohoFull)]; });
// G1 type checking
const g1 = [['upper x number', 'upper(Number)'], ['abs x single_line', 'abs(Single Line)'], ['len x date', 'len(Date)'], ['round x pick_list', 'round(Pick List, 1)'], ['op_eq x checkbox', 'Checkbox = Checkbox'], ['op_and x checkbox', 'Checkbox && true'], ['op_gt x single_line', 'Text > Text'], ['daysbetween x number', 'daysbetween(Number, Date)']].map(([k, lab]) => { const [fn, , t] = k.split(' '); const tv = fn.startsWith('op_') ? recO.rFull.values['fx_' + { op_eq: 'eq', op_and: 'and', op_gt: 'gt' }[fn] + '_' + t] : recM.rFull.values['fx_' + fn + '_' + t]; return [`<code>${esc(lab)}</code>`, 'Saved; result ' + v(tv), esc(zerr(k))]; });
const refusedBy = {}; ZC.rows.filter(r => r.verdict.startsWith('Zoho refuses')).forEach(r => (refusedBy[r.fn] ||= []).push(r.t));
// G2 empty handling
const g2 = [['abs x number', 'abs(Number)'], ['op_mul x number', 'Number * 2'], ['op_gt x number', 'Number > Number'], ['len x single_line', 'len(Single Line)'], ['round x decimal', 'round(Decimal, 1)'], ['number x number', 'number(Number)'], ['op_eq x pick_list', 'Pick List = Pick List'], ['text x checkbox', 'text(Checkbox)']].map(([k, lab]) => { const r = ZC.rows.find(x => x.fn + ' x ' + x.t === k); return [`<code>${esc(lab)}</code>`, v(r?.taviEmpty), v(r?.zohoEmpty)]; });
const emptyCount = Object.entries(ZK.agg).filter(([k]) => /^empty input/.test(k)).reduce((a, [, l]) => a + l.length, 0);
// G3 checkbox
const g3 = ['if x checkbox', 'isblank x checkbox', 'concat x checkbox'].map(k => { const r = ZC.rows.find(x => x.fn + ' x ' + x.t === k); return [`<code>${esc(k.replace(' x ', '('))})</code> on an unticked / empty checkbox`, v(r?.taviEmpty), v(r?.zohoEmpty)]; });
const S = []; let n = 0; const sec = (id, title, tags, body) => { S.push(`<div class="f" id="${id}"><h3>${esc(id)} · ${esc(title)}</h3><div>${tags.map(t => `<span class="tag ${t[1] || ''}">${esc(t[0])}</span>`).join('')}</div>${body}</div>`); };
// ---- New bugs
sec('B1', 'Formula field | The + operator joins text instead of adding (Date + 1 gives "2026-11-241")', [['Bug'], ['Medium', 'me'], ['CRM (engine shared with Desk)'], ['Differs from Zoho', 'z']],
 `<p>When the field is not a number, <code>+</code> glues the text and the formula (return type Number) shows it. <code>-</code>, <code>*</code>, <code>/</code> on the same fields give blank. Zoho refuses all of these formulas when saving.</p>
<p><b>Steps:</b> 1. Add a formula with return type Number: <code>in_pick_list + 1</code> (or Date, Auto Number, Single Line). 2. Save a record with Pick List = Green, Date = 2026-11-24. 3. Open the record.</p>
<p><b>Expected (Zoho):</b> the formula is refused at save ("The datatype of param is invalid"), or for dates the days are added. <b>Actual:</b> text is joined.</p>
${tbl(['Field type', 'Value', 'Formula', 'TAVI result', 'Zoho'], b1)}<p class="sub">Record: CRM "QA FX Matrix Ops" → "QA FX ops - all filled" (${esc(recO.rFull.id)}).</p>`);
sec('B2', 'Formula field | Formulas treat a User field as empty when it was filled in by its default value', [['Bug'], ['Medium', 'me'], ['CRM only'], ['Internal inconsistency', 'i']],
 `<p>The create form pre-fills a User field with the signed-in user, and an API or import create without the field also stores the signed-in user. The record shows that user, but every formula reading the field calculates as if it were empty. Choosing the user by hand works (isblank = ${v(uFull?.actual)}). <b>Desk is not affected</b>: the same Desk record gives isblank = ${v(dEmpty.fx_isblank_user)}.</p>
<p><b>Steps:</b> 1. Module with a User field "In User" and formulas <code>if(isblank(in_user), "empty", "set")</code>, <code>len(in_user)</code>. 2. Create a record without changing In User (form, API or import). 3. Open it.</p>
${tbl(['Formula', 'TAVI result (record shows In User = ndc-staging-owner)', 'Expected'], ue)}
<p class="sub">Records: "QA FX matrix - all empty" (${esc(recM.rEmpty.id)}), "QA FX Matrix 2 - all empty", "QA FX Matrix - imported" — 17 formulas each.</p>${img('create-form-default.png')}`);
sec('B3', 'Modules and Fields | A record cannot be edited when its layout has a Rollup Summary field', [['Bug'], ['High', 'hi'], ['CRM + Desk'], ['Blocks users', 'i']],
 `<p>The Edit form shows the Rollup Summary as an input box and sends its value on Save. The server refuses the whole save, so nothing on the record can be changed from the form. Creating a record works (the empty rollup is not sent).</p>
<p><b>Steps:</b> 1. Module with a Rollup Summary field on the layout. 2. Open a record → Edit → change any field → Save.</p>
<p><b>Expected:</b> saved; the rollup is read-only and not sent. <b>Actual:</b> error under the rollup box: <i>"Field 'in_rollup_summary' uses read-only datatype 'rollup_summary' and cannot be set by clients."</i></p>
<p class="sub">CRM record "QA FX matrix - edge values" (QA FX Matrix), Desk record "QA FX matrix - edge values" (QA FX Matrix Desk). No existing Plane ticket found (searched "rollup").</p>${img('form-clear-after-save.png')}${img('desk-edit-save.png')}`);
sec('B4', 'Import | A Lookup column cannot be matched by the record name', [['Bug'], ['Medium', 'me'], ['CRM'], ['Zoho imports lookups by name (not run live today)', 'z']],
 `<p>Importing a CSV into a module with a Lookup to Accounts: the row is refused although an account with exactly that name exists.</p>
<p><b>Steps:</b> 1. Module with a Lookup to Accounts. 2. Import a CSV with columns Name, In Lookup = "Anyware Software" (an existing account). 3. Map In Lookup and run.</p>
<p><b>Expected:</b> the record is created and linked to the account. <b>Actual:</b> status ${esc(imp3.status)}, 0 created — <i>"${esc(imp3.errors?.[0]?.reason)}"</i>. Same for "QA FX Matrix Acc" (${esc(fix1.imp2.errors?.[0]?.reason)}).</p>
<p class="sub">Import sessions ${esc(fix1.imp2.sid)} and the "Anyware Software" check (24 Nov). No existing Plane ticket found (searched "import lookup").</p>`);
// ---- additions to filed tickets
sec('A1', 'Comment on NDC-3221 — four more field types read as empty', [['Add to NDC-3221'], ['CRM + Desk']],
 `<p>Still failing for multi-select, multi-select lookup, address and location. The same happens for:</p>${tbl(['Field type', 'Value on record', 'concat()', 'len()', 'isblank()', 'count()'], a1)}
<p>In Zoho these types cannot be used in a formula at all (refused when saving) — TAVI should either read them or refuse them:</p>${tbl(['Zoho type', 'Zoho message'], a1z)}`);
sec('A2', 'Comment on NDC-3224 — dates as text also differ from Zoho', [['Add to NDC-3224'], ['CRM + Desk']],
 `<p>Besides UTC, the text form of a date uses ISO, while Zoho uses the organisation's date format and local time:</p>${tbl(['Formula', 'TAVI', 'Zoho'], dt)}`);
// ---- parity gaps
sec('G1', 'Parity gap — no type checking when a formula is saved', [['Gap item for NDC-3229'], ['High', 'hi'], ['CRM + Desk']],
 `<p>TAVI saves every function × field-type combination (748/748); Zoho refuses ${ZC.cnt['Zoho refuses — TAVI accepts']} of them at save with a clear error. In TAVI the wrong combination saves and then silently gives blank or wrong values.</p>${tbl(['Formula', 'TAVI', 'Zoho'], g1)}
<p><b>Zoho rules seen:</b> number functions/operators only on number, decimal, currency, percent, long integer; text functions only on text-like fields (numbers/dates need Tostring); date difference only on dates; &amp;&amp; || ! not directly on a field; == != not on checkbox/date; Rich text, File, Image, Multi-Select Lookup never.</p>`);
sec('G2', 'Parity gap — empty fields give 0 / "" / true-false instead of a blank result', [['Gap item for NDC-3229'], ['Medium', 'me'], ['CRM + Desk']],
 `<p>In Zoho, when an input is empty the formula result is blank. TAVI treats empty as 0, "" or false/true. ${emptyCount} of the pairs both accept differ only because of this.</p>${tbl(['Formula (input empty)', 'TAVI', 'Zoho'], g2)}`);
sec('G3', 'Parity gap — an empty checkbox is blank in TAVI, false in Zoho', [['Gap item for NDC-3229'], ['Low', 'lo']], tbl(['Formula', 'TAVI', 'Zoho'], g3));
sec('G4', 'Parity gap — 1 / 0', [['Gap item for NDC-3229'], ['Low', 'lo']], `<p>TAVI gives blank; Zoho gives ${v(ZB2.created?.['F9 1/0'])}. (TAVI's blank is arguably safer — decision.)</p>`);
// ---- same as Zoho
sec('S1', 'Same as Zoho — NDC-3219 (existing records not updated)', [['Proposal: comment / close as same as Zoho'], ['Decision', 'i']],
 `<p>Zoho also leaves existing records empty when a formula is added, and keeps the old value when the expression is edited (existing record ${v(ZB2.afterEditExisting)} after 60 s, new record ${v(ZB2.newRecordAfterEdit)}). Only saving the record recalculates — same as TAVI.</p>`);
sec('S2', 'Same as Zoho — NDC-3227 formula part (pick-list option renamed)', [['Proposal: comment'], ['Decision', 'i']],
 `<p>Zoho: after renaming Red → Crimson the record shows ${v(ZB2.afterRename?.pickOnRecord)} and the formula <code>If(Pick=='Red','is red','other')</code> gives ${v(ZB2.afterRename?.formulaValue)} — same as TAVI. The "same-version layout saves" part of NDC-3227 was not compared.</p>`);
sec('S3', 'Same as Zoho — NDC-3229 item "formulas using formulas"', [['Proposal: remove the item'], ['Decision', 'i']], `<p>Zoho refuses it too: <i>"Formula Field(s) cannot be used inside another formula field"</i>.</p>`);
sec('S4', 'NDC-3217 workflow part passes now — same as Zoho', [['Proposal: comment'], ['Info']],
 `<p>TAVI 24 Nov: a workflow FieldUpdate recalculated the formulas (sum 8, "WF TEXT"). Zoho: workflow set Num 1 → 7, formula ${v(ZU.workflowResult?.F1)}. The blueprint part of NDC-3217 was not retested.</p>`);
// ---- observations
sec('O1', 'Observation — cleared text vs never-filled text', [['Observation'], ['Needs a form check (blocked by B3)', 'i']],
 `<p>A text field saved as "" (or only spaces) is stored as text, not as blank: isblank() says true, but <code>sum(X,1)</code> gives blank instead of 1, <code>min(X,100)</code> blank instead of 0, len("   ") = 3. Seen through the API only.</p>`);
sec('O2', 'Observation — CRM offers Department, Team and Support Plan field types it cannot fill', [['Observation'], ['CRM']], `<p>The CRM form shows them as "Departments / Teams / Support plans are not available in this app".</p>`);
sec('O3', 'Observation — imported date-time stored as typed', [['Observation'], ['CRM']], `<p>"2026-12-01 10:15" from the CSV is stored as that text (no time zone, not ISO), unlike date-times saved from the form or API.</p>`);
sec('O4', 'Observation — Pipeline listed but system-only', [['Not a bug'], ['Dropped']], `<p>/fields/datatypes lists "pipeline"; creating it returns "not a recognized datatype". The app marks it system-only and the builder never offers it. Only the message wording is misleading.</p>`);
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Formula fields — findings not in Plane (24 Nov 2026)</title><style>
body{font:14px/1.55 system-ui,Segoe UI,Arial;margin:0;background:#f6f7f9;color:#1f2937}main{max-width:1100px;margin:0 auto;padding:24px}h1{font-size:23px;margin:0}h2{margin-top:30px;border-bottom:2px solid #e5e7eb}
.f{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:12px 0}.f h3{margin:0 0 6px}.tag{display:inline-block;font-size:12px;padding:1px 8px;border-radius:10px;background:#eef2ff;margin:0 4px 6px 0}.hi{background:#fee2e2}.me{background:#fef3c7}.lo{background:#e0f2fe}.z{background:#dcfce7}.i{background:#f3e8ff}
table{border-collapse:collapse;width:100%;margin:8px 0}td,th{border:1px solid #e5e7eb;padding:5px 8px;text-align:left;vertical-align:top}th{background:#f3f4f6}img{max-width:100%;border:1px solid #d1d5db;border-radius:6px;margin-top:8px}.cap,.sub{color:#6b7280;font-size:12px}code{background:#f3f4f6;padding:0 4px;border-radius:4px}
.sum td:first-child{white-space:nowrap}</style></head><body><main>
<h1>Formula fields — findings and bugs not filed in Plane</h1><div class="sub">TAVI CRM + Desk on NDC-Staging vs Zoho CRM (live, test org946877290) · 24 Nov 2026 · source: executions/execu_2026-11-24_formula-matrix (report.html has the full test results)</div>
<h2>Summary</h2><table class="sum"><tr><th>ID</th><th>Finding</th><th>Type</th><th>Suggested action</th></tr>
<tr><td>B1</td><td>+ joins text (Date + 1 = "2026-11-241")</td><td>Bug, Medium, differs from Zoho</td><td>File new bug</td></tr>
<tr><td>B2</td><td>Default User value is empty for formulas (CRM)</td><td>Bug, Medium</td><td>File new bug</td></tr>
<tr><td>B3</td><td>Edit form fails when the layout has a Rollup Summary (CRM + Desk)</td><td>Bug, High</td><td>File new bug</td></tr>
<tr><td>B4</td><td>Import cannot match a Lookup by name</td><td>Bug, Medium</td><td>File new bug</td></tr>
<tr><td>A1</td><td>Map, File, Image, Camera also read as empty</td><td>Addition</td><td>Comment on NDC-3221</td></tr>
<tr><td>A2</td><td>Dates as text use ISO, Zoho uses org format</td><td>Addition</td><td>Comment on NDC-3224</td></tr>
<tr><td>G1–G4</td><td>No type checking; empty → 0 instead of blank; empty checkbox; 1/0</td><td>Parity gaps</td><td>Add to gap ticket NDC-3229</td></tr>
<tr><td>S1–S4</td><td>NDC-3219, NDC-3227 (formula part), NDC-3229 "formula on formula" behave the same in Zoho; NDC-3217 workflow part passes</td><td>Same as Zoho</td><td>Comment; you decide close/keep</td></tr>
<tr><td>O1–O4</td><td>Cleared text vs blank, unusable Desk field types in CRM, imported date-time, Pipeline</td><td>Observations</td><td>No action unless you want</td></tr></table>
<h2>New bugs</h2>${S.filter(s => /id="B/.test(s)).join('')}
<h2>Additions to filed tickets</h2>${S.filter(s => /id="A/.test(s)).join('')}
<h2>Parity gaps vs Zoho</h2>${S.filter(s => /id="G/.test(s)).join('')}
<h2>Filed items that behave the same as Zoho</h2>${S.filter(s => /id="S/.test(s)).join('')}
<h2>Observations</h2>${S.filter(s => /id="O/.test(s)).join('')}
<p class="sub">Not compared with Zoho: formula editor screen, blueprint transitions, import in Zoho, Zoho Desk (agent account only). Nothing in this page has been posted to Plane.</p>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'findings.html'), html); console.log('findings.html', Math.round(html.length / 1024) + ' KB');
