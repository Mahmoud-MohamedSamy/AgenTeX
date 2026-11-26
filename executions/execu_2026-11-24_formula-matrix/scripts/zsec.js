// Builds the Zoho comparison HTML section -> out/zoho-section.html (inserted by make-report.js)
const fs = require('fs'), path = require('path'); const RUN = path.join(__dirname, '..'); const J = p => JSON.parse(fs.readFileSync(path.join(RUN, p), 'utf8'));
const C = J('zoho/compare.json'), K = J('zoho/compare-cats.json'), FN = J('zoho/functions.json'); const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const T = ['single_line', 'multi_line', 'rich_text', 'email', 'phone', 'url', 'number', 'decimal', 'currency', 'percent', 'long_integer', 'auto_number', 'checkbox', 'pick_list', 'multi_select', 'date', 'date_time', 'lookup', 'user', 'multi_select_lookup', 'file_upload', 'image_upload'];
const F = ['if', 'concat', 'coalesce', 'min', 'max', 'sum', 'avg', 'count', 'upper', 'lower', 'trim', 'len', 'abs', 'round', 'isblank', 'number', 'text', 'daysbetween', 'hoursbetween', 'op_add', 'op_sub', 'op_mul', 'op_div', 'op_mod', 'op_plus_text', 'op_eq', 'op_ne', 'op_gt', 'op_ge', 'op_lt', 'op_le', 'op_and', 'op_or', 'op_not'];
const ZN = { if: 'If', concat: 'Concat', coalesce: '—', min: 'Min', max: 'Max', sum: '—', avg: '—', count: '—', upper: 'Upper', lower: 'Lower', trim: 'Trim', len: 'Len', abs: 'Abs', round: 'Round', isblank: 'IsEmpty', number: 'Tonumber', text: 'Tostring', daysbetween: 'Datecomp/1440', hoursbetween: 'Datecomp/60', op_add: 'X+1', op_sub: 'X-1', op_mul: 'X*2', op_div: 'X/2', op_mod: 'X%3', op_plus_text: "X+'!'", op_eq: 'X==X', op_ne: 'X!=X', op_gt: 'X>X', op_ge: 'X>=X', op_lt: 'X<X', op_le: 'X<=X', op_and: 'X&&true', op_or: 'X||false', op_not: '!X' };
const by = {}; for (const r of C.rows) by[r.fn + '|' + r.t] = r; const cats = {}; for (const r of K.rows) cats[r.fn + '|' + r.t] = r.causes;
let g = '<div class="gw"><table class="grid"><tr><th>type \\ TAVI fn</th>' + F.map(f => `<th title="Zoho: ${esc(ZN[f])}">${esc(f.replace('op_', ''))}</th>`).join('') + '</tr>';
for (const t of T) { g += `<tr><th>${t}</th>`; for (const f of F) { const r = by[f + '|' + t]; if (!r) { g += '<td class="na">–</td>'; continue; }
    let cls, txt; if (r.verdict.startsWith('TAVI only')) { cls = 'nt'; txt = 'T'; } else if (r.verdict.startsWith('Zoho refuses')) { cls = 'nw'; txt = '✗'; }
    else if (r.verdict.startsWith('both accept')) { cls = 'ok'; txt = '✓'; }
    else { const c = cats[f + '|' + t] || []; const real = c.filter(x => !/input, not formula|auto-number/.test(x)); if (!real.length) { cls = 'ok'; txt = '='; } else { cls = 'kn'; txt = '≠'; } }
    g += `<td class="${cls}" title="${esc((r.zohoError || '') + ' ' + (cats[f + '|' + t] || []).join('; '))}">${txt}</td>`; } g += '</tr>'; }
g += '</table></div>';
const cnt = C.cnt; const agg = Object.entries(K.agg).filter(([k]) => !/input, not formula|auto-number/.test(k)).sort((a, b) => b[1].length - a[1].length);
const same = K.rows.filter(r => !r.causes.filter(x => !/input, not formula|auto-number/.test(x)).length).length;
const zExtra = Object.entries(FN).filter(([k, v]) => v.ok && !['Abs', 'Max', 'Min', 'Round', 'Len', 'Concat', 'Lower', 'Upper', 'Trim', 'Tostring', 'Tonumber', 'If', 'IsEmpty'].includes(k)).map(([k]) => k).join(', ');
const both = (cnt['same result'] || 0) + (cnt['different result'] || 0) + (cnt['both accept (different expression — value not compared)'] || 0);
const html = `<h2>Comparison with Zoho CRM (live, 24 Nov 2026)</h2>
<p>The same function × field-type pairs were built in Zoho CRM (Enterprise trial org946877290, Leads module) through Zoho's own API, using Zoho's equivalent function where the name differs. Zoho's acceptance was recorded for each formula, and values were read on a filled and an empty lead with the same input values as in TAVI. All Zoho test fields, leads and the account were deleted afterwards (2 hidden helper modules that Zoho creates for File/Image Upload fields cannot be deleted).</p>
<div class="cards"><div class="card"><b>748</b>pairs compared</div><div class="card"><b>${cnt['Zoho refuses — TAVI accepts']}</b>Zoho refuses, TAVI accepts</div><div class="card"><b>${cnt['TAVI only (Zoho has no such function)']}</b>TAVI-only functions</div><div class="card"><b>${both}</b>both accept</div><div class="card"><b>${same}</b>same result</div></div>
<h3>Answer: the combinations do not match Zoho</h3>
<ol>
<li><b>Zoho checks types when the formula is saved; TAVI accepts every combination.</b> Zoho refused ${cnt['Zoho refuses — TAVI accepts']} of the pairs TAVI accepts ("Incorrect return type" / "syntax error"):
<ul><li>Number functions and operators (Min, Max, Abs, Round, + − * / %, &gt; &lt; &gt;= &lt;=): only number, decimal, currency, percent, long integer.</li>
<li>Text functions (Upper, Lower, Trim, Len): only text, email, phone, URL, pick list, multi-select, auto number, user, lookup. Numbers, checkbox and dates must be wrapped in Tostring() first.</li>
<li>Date difference (Datecomp): only date and date-time.</li>
<li><code>&amp;&amp;</code>, <code>||</code>, <code>!</code> directly on a field: refused for every field type (Zoho wants a true/false expression).</li>
<li><code>==</code> / <code>!=</code>: refused on checkbox, date, date-time.</li>
<li><code>+</code> with text (<code>X + '!'</code>): refused for every type. Zoho does not join text with +; TAVI does (new bug 3).</li>
<li>Rich text, File Upload, Image Upload and Multi-Select Lookup cannot be used in any Zoho formula. TAVI accepts them and reads them as empty (NDC-3221).</li></ul></li>
<li><b>Different function sets.</b> TAVI only: sum, avg, count, coalesce, daysbetween, hoursbetween (Zoho uses Datecomp, in minutes). Zoho only: ${esc(zExtra)} (already in the gap ticket NDC-3229).</li>
<li><b>Where both accept (${both} pairs), results differ in these ways</b> (differences caused by the input are left out: Zoho trims spaces when a text field is saved, and the auto-number sequence differs):
<table><tr><th>Pairs</th><th>Difference</th></tr>${agg.map(([k, l]) => `<tr><td>${l.length}</td><td>${esc(k)}<br><span class="sub">${esc(l.slice(0, 14).join(', '))}${l.length > 14 ? ' …' : ''}</span></td></tr>`).join('')}</table>
${same} pairs give the same result in both.</li></ol>
<p><b>Biggest behaviour gap: empty fields.</b> Zoho returns a blank result when an input is empty (abs, round, Tonumber, Len, *, /, comparisons); TAVI returns 0, "" or true/false. Zoho min(empty,100) = 100 (TAVI 0: NDC-3225 confirmed against Zoho). An empty Zoho checkbox counts as false, not blank.</p>
<p class="legend"><span class="ok">= same / ✓ both accept</span><span class="kn">≠ different result</span><span class="nw">✗ Zoho refuses</span><span class="nt">T TAVI-only function</span>. Hover for the Zoho message or the difference.</p>${g}`;
fs.writeFileSync(path.join(RUN, 'out/zoho-section.html'), html); console.log('zoho section', html.length, 'same', same, 'both', both);
