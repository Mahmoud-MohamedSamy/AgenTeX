// Builds report/crud-report.html from executions/execu_2026-11-24_tia-retest/out/crud-results.jsonl (Tia create/update/delete test, 25 Nov 2026).
const fs = require('fs'), path = require('path');
const RUN = path.resolve(__dirname, '../../executions/execu_2026-11-24_tia-retest');
const rows = fs.readFileSync(RUN + '/out/crud-results.jsonl', 'utf8').trim().split('\n').map(l => JSON.parse(l));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const blank = r => !r.text.replace('|| FOLLOW-UP:', '').trim();
const cls = r => {
  if (r.err) return ['bad', 'Broke', 'The reply stream failed (' + r.err + ').'];
  if (r.confirm) return r.confirm.s < 300 && r.confirm.status === 'done' ? ['ok', 'Done', 'Card confirmed: ' + r.confirm.msg + (JSON.parse(r.confirm.data || '{}').message || '').split('\n')[0]] : ['bad', 'Card failed', r.confirm.err || r.confirm.status];
  if (r.rejected) return ['warn', 'Card (rejected)', 'A card was offered for a real item; rejected, nothing changed. ' + r.text.replace(/\s*\|\| FOLLOW-UP:\s*/, ' ').slice(0, 220)];
  if (blank(r)) return ['bad', 'Blank reply', 'Tia answered with no text at all (also to "Yes, please prepare the card now.").'];
  if (/prepared|will prepare|I have selected/i.test(r.text) && !r.card) return ['bad', 'Says card, no card', r.text.replace(/\s*\|\| FOLLOW-UP:\s*/, ' ').slice(0, 260)];
  return ['no', 'No', r.text.replace(/\s*\|\| FOLLOW-UP:\s*/, ' ').trim().slice(0, 260)];
};
const objs = [];
for (const r of rows) { const k = r.app + '|' + r.obj; let o = objs.find(x => x.k === k); if (!o) objs.push(o = { k, app: r.app, obj: r.obj, ops: {} }); o.ops[r.op.replace('-existing', '')] = { ...r, existing: r.op.endsWith('existing') }; }
const tally = {}; rows.forEach(r => { const c = cls(r)[1]; tally[c] = (tally[c] || 0) + 1; });
const cell = r => { if (!r) return '<td class="na">—</td>'; const [k, l, t] = cls(r); return `<td><span class="chip ${k}">${esc(l)}</span>${r.existing ? '<span class="ex">on an existing item</span>' : ''}<div class="tx">${esc(t)}</div></td>`; };
const table = app => `<table><thead><tr><th>Object</th><th>Create</th><th>Update</th><th>Delete</th></tr></thead><tbody>${objs.filter(o => o.app === app).map(o => `<tr><td class="obj">${esc(o.obj)}</td>${cell(o.ops.create)}${cell(o.ops.update)}${cell(o.ops.delete)}</tr>`).join('')}</tbody></table>`;
const creates = rows.filter(r => r.op === 'create'), cOk = creates.filter(r => r.confirm && r.confirm.status === 'done');
const FIND = [
  ['High', 'Tia can create only 3 of 24 object types', 'Create worked for a lead, a Leads field and a CRM workflow rule. Everything else was refused or got no answer: CRM modules, layouts, assignment/approval/review processes, blueprints, scoring/validation/layout rules, pipelines, web forms, buttons; and in Desk every type, including a plain ticket. Several refusals say only fixed "recipe" names are allowed (same cause as NDC-3250).', 'NDC-3317 (see also NDC-3250)'],
  ['High', 'What Tia creates, it cannot update or delete', 'Lead: update worked, but delete broke the stream and the retry offered the update card again. Leads field: rename failed with an internal error ("Missing required argument \'record_id\'"); delete asked for "the field\'s record ID". Workflow rule: rename and delete both said "I have prepared a proposal card…" but no card existed. All three items had to be deleted through the API.', 'NDC-3318'],
  ['Withdrawn', 'Blank replies (NDC-3319) — test-script error, not a Tia bug', 'Corrected 25 Nov: the script read only streamed chunks; when Tia sent its answer in one piece the text was in the final message. Re-read from chat history, none of the 72 answers was blank — they were recipe refusals, "I couldn\'t build this", internal errors ("Missing required argument \'record_id\'") and "Sorry, I couldn\'t answer that just now". NDC-3319 should be cancelled.', 'NDC-3319 (cancel)'],
  ['Medium', 'Tia says a card is ready when there is none', 'Workflow rule rename and delete, the Leads module rename ("I have selected the \'Lead\' module and prepared to change its name"), the delete of the real ticket #7640 ("I will prepare a card to delete this ticket") and the delete of the button "Look up booking" — none came with a card.', 'NDC-3320 (see also NDC-3307)'],
  ['Medium', 'Cards for the wrong object or the wrong action', 'Asked to rename a layout rule, Tia offered a card renaming an assignment rule ("Confirming this will create an inactive copy"). Asked to delete an assignment rule (CRM) or a workflow rule (Desk), Tia offered the rename card again. Asked to rename a web form, it offered an update_record card. All were rejected.', 'NDC-3321'],
  ['Medium', 'The Owner is told they have no access', 'Desk: "You do not have access to create tickets in the \'desk_tickets\' module", "I do not have access to describe any Desk module fields", "no module named \'macros\' or \'desk_macros\' accessible to you", "no module named \'ticket_tags\'". CRM: "there is no module named \'Web Forms\' open to you". The account is the Owner. The replies also show internal module keys.', 'NDC-3322'],
  ['Low', 'Contradictory or doubtful lists', '"I found 14 SLA policies in Desk but none are listed here to pick from." Its other "there are none" answers were not counted as bugs: CRM scoring rules really are 0 (checked with the API); Desk assignment rules, Desk blueprints and CRM approval processes were not checked.', 'NDC-3323'],
];
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tia: create, update, delete — test report (25 Nov 2026)</title>
<style>:root{--ink:#1b2330;--mut:#5b6575;--line:#e3e7ee;--bg:#f6f8fb;--ok:#1f7a45;--okb:#e5f5ec;--bad:#b42318;--badb:#fdecea;--warn:#8a5a00;--warnb:#fff4dc;--no:#4a5565;--nob:#eef1f5}
*{box-sizing:border-box}body{margin:0;font:15px/1.5 'Segoe UI',system-ui,Arial,sans-serif;color:var(--ink);background:var(--bg)}main{max-width:1180px;margin:0 auto;padding:28px 20px 60px}
h1{font-size:26px;margin:0 0 6px}h2{font-size:19px;margin:34px 0 12px}.sub{color:var(--mut)}.meta{display:flex;flex-wrap:wrap;gap:8px 18px;margin:14px 0 0;color:var(--mut);font-size:13.5px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:20px 0}.card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px 14px}.card b{display:block;font-size:24px}.card span{color:var(--mut);font-size:13px}
.box{background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px 18px}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden;font-size:13.5px}th{background:#eef1f5;text-align:left;padding:8px 10px;font-weight:600}td{border-top:1px solid var(--line);padding:8px 10px;vertical-align:top}
td.obj{font-weight:600;white-space:nowrap}td.na{color:var(--mut)}.tx{color:var(--mut);margin-top:4px}.ex{font-size:11.5px;color:var(--mut);margin-left:6px}
.chip{display:inline-block;padding:1px 8px;border-radius:10px;font-size:12px;font-weight:600}.chip.ok{background:var(--okb);color:var(--ok)}.chip.bad{background:var(--badb);color:var(--bad)}.chip.warn{background:var(--warnb);color:var(--warn)}.chip.no{background:var(--nob);color:var(--no)}
.f td:first-child{white-space:nowrap}.scroll{overflow-x:auto}ul{margin:6px 0;padding-left:20px}</style></head><body><main>
<h1>Tia: can it create, update and delete?</h1><div class="sub">Records, modules, fields, layouts, automation and pipelines in CRM and Desk, asked in plain words as the Owner.</div>
<div class="meta"><span><b>Environment</b> NDC-Staging (staging-crm / staging-desk.taviportal.com)</span><span><b>Date</b> 25 Nov 2026, 09:33–09:50 UTC</span><span><b>Account</b> Owner (ndc-staging-owner)</span><span><b>Method</b> Tia chat API (same calls as the panel), cards confirmed or rejected through the API</span><span><b>Tia</b> propose changes on for all 134 areas; daily allowance 1000 credits</span></div>
<div class="cards"><div class="card"><b>${objs.length}</b><span>object types (${objs.filter(o => o.app === 'crm').length} CRM, ${objs.filter(o => o.app === 'desk').length} Desk)</span></div><div class="card"><b>${rows.length}</b><span>requests</span></div><div class="card"><b>${cOk.length} / ${creates.length}</b><span>creates that worked</span></div><div class="card"><b>${tally['Says card, no card'] || 0}</b><span>"card ready" with no card</span></div><div class="card"><b>0</b><span>test items left</span></div></div>
<h2>In short</h2><div class="box"><ul>
<li><b>Records:</b> Tia created and updated a CRM lead through cards, but could not delete it. In Desk it refused to create a ticket, telling the Owner they have no access.</li>
<li><b>Modules and layouts:</b> not supported. Tia refuses to create modules or layouts and says modules cannot be deleted.</li>
<li><b>Fields:</b> Tia created a Leads field, but could not rename it (internal error) or delete it (asked for a record ID).</li>
<li><b>Automation and pipelines:</b> only the CRM workflow rule could be created. Its rename and delete were "prepared" with no card. Assignment, approval and review processes, blueprints, scoring/validation/layout rules, pipelines, web forms, buttons, SLAs, macros and tags could not be created.</li>
<li><b>Safety held:</b> nothing happened without a confirm. Every card for a real item was rejected and nothing real changed.</li></ul></div>
<h2>Findings (filed in Plane, Sprint 17)</h2><div class="scroll"><table class="f"><thead><tr><th>Severity</th><th>Finding</th><th>What happened</th><th>Plane</th></tr></thead><tbody>${FIND.map(f => `<tr><td>${f[0]}</td><td><b>${esc(f[1])}</b></td><td>${esc(f[2])}</td><td>${esc(f[3])}</td></tr>`).join('')}</tbody></table></div>
<h2>How it was run</h2><div class="box"><ul><li>One chat per object type. For each type: "Create … named QA TIA CRUD …", then "Rename it to … v2", then "Delete …". Each request ends with "Prepare it as a card for me to confirm."; if no card came and Tia did not refuse, one follow-up was sent: "Yes, please prepare the card now."</li>
<li>Cards for QA items were confirmed. If the create failed, Tia was asked to rename and delete <i>an existing</i> item instead, and any card was <b>rejected</b> (capability check only).</li>
<li>Automation was asked to stay inactive and limited to records named "QA TIA CRUD".</li>
<li>An earlier attempt at 09:23 stopped after 3 requests because the workspace Tia daily limit was reached (see NDC-3309); the run was restarted from the start after the limit was raised.</li></ul></div>
<h2>CRM</h2><div class="scroll">${table('crm')}</div>
<h2>Desk</h2><div class="scroll">${table('desk')}</div>
<h2>Cleanup</h2><div class="box"><ul><li>Deleted through the API, because Tia could not delete them: the lead "QA TIA CRUD Lead" (lead source was Referral after Tia's update), the Leads field "QA TIA CRUD Field" (single line, on no layout) and the workflow rule "QA TIA CRUD Workflow" (inactive, never ran).</li>
<li>Checked afterwards: no lead, field or workflow rule named "QA TIA CRUD" in CRM, and no ticket or rule in Desk. The real ticket #7640 that Tia offered to delete is still there.</li>
<li>The lead is in the Recycle Bin. Tia's daily allowance was left at the 1000 credits the user set.</li></ul></div>
</main></body></html>`;
fs.writeFileSync(path.join(__dirname, 'report/crud-report.html'), html);
console.log(JSON.stringify({ objs: objs.length, rows: rows.length, tally, creates: cOk.length + '/' + creates.length }));
