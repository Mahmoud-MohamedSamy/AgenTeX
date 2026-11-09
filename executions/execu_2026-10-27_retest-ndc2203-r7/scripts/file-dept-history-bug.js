// Files the new bug (user asked 27 Oct 2026): ticket History row written at create shows "department_id" + raw id instead of the department name.
// Then adds it to module Desk and attaches the evidence. Usage: node scripts/file-dept-history-bug.js <token.csv>. Token read by the "Secret key" column, never printed.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const csv = process.argv[2];
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 5; i++) { const r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const ZOHO = fs.existsSync(path.join(__dirname, '..', 'zoho-dept.txt')) ? fs.readFileSync(path.join(__dirname, '..', 'zoho-dept.txt'), 'utf8').trim() : '';
const html = `<p><strong>Summary.</strong> When a ticket is created, Ticket History writes a "Department changed" row that shows the internal field key <code>department_id</code> and the department's raw id (e.g. <code>7e1ac409-58b0-41ab-97e1-0e7d5c8c5158</code>) instead of the department name, attributed to "System". Same in Arabic. A later move between departments is shown correctly with names.</p>
<h3>Steps to reproduce</h3><ol>
<li>Desk › Tickets › New Ticket (layout Standard), Department = Customer Support, fill Email, Subject, Status = Open › Save.</li>
<li>Open the ticket › History tab › scroll to the rows at creation time.</li>
<li>Switch the language to العربية and look at the same row.</li>
<li>Control: on another ticket use the department chip › Move ticket › HR › Move, then open History.</li></ol>
<h3>Expected</h3><ul>
<li>The creation entry names the department: e.g. "Department: Customer Support" (or the department listed in "Ticket was created by …"), never a field key or an id.${ZOHO ? ' ' + ZOHO : ''}</li>
<li>The same in Arabic (قسم: Customer Support).</li></ul>
<h3>Actual</h3><ul>
<li>#657 (27 Oct 15:52): "Department changed · Field department_id · Old blank · New 7e1ac409-58b0-41ab-97e1-0e7d5c8c5158 · by System"; the "Ticket was created by mahmoud.mahamed1515" row lists Subject and Status but no department.</li>
<li>Arabic: "تغيّر القسم · الحقل department_id · القديم فارغ · الجديد 7e1ac409-… · بواسطة النظام".</li>
<li>Same on every ticket created by form or API in this round (#598, #651, …).</li>
<li>Control #656: a real move shows "Ticket moved to another department · From Customer Support · To HR" and "Department was updated · Old Customer Support · New HR" — names are resolved there.</li></ul>
<h3>Impact</h3><p>Agents and admins see an unreadable id and an internal field key in every ticket's history; it looks like a system change rather than the creator's choice.</p>
<h3>Suggested fix</h3><ol><li>Resolve the department id to its name (as the Move rows already do) and show the field label "Department", not <code>department_id</code>.</li><li>Prefer recording the department inside the "Ticket was created" entry instead of a separate "changed from blank" row by System.</li></ol>
<p><strong>Environment:</strong> staging-desk.taviportal.com, tenant NDC-Staging, Edge, account mahmoud.mahamed1515 (Desk Administrator), 27 Oct 2026. Found while retesting NDC-2203.</p>
<p><strong>Evidence:</strong> NDC-new-dept-history-BUG.png (attached).</p>`;
(async () => {
  const c = await call('POST', '/work-items/', { name: 'Ticket History | Creation row shows "department_id" and the raw department id instead of the department name', description_html: html, priority: 'low',
    state: '34a7f4b6-7207-4955-b927-0d8d1dd3c666', assignees: ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'], labels: ['c250807e-0e69-4057-82e2-32ccf9803ed4'] });
  const id = c.j?.id; console.log('create', c.s, id ? 'NDC-' + c.j.sequence_id : JSON.stringify(c.j).slice(0, 200)); if (!id) return;
  const m = await call('POST', '/modules/274a73de-564a-4b8c-8b51-74fe8304e7c2/module-issues/', { issues: [id] }); console.log('module Desk', m.s);
  fs.writeFileSync(path.join(__dirname, '..', 'attach-bug.json'), JSON.stringify({ dir: path.join(__dirname, '..', 'screenshots', 'annotated').replace(/\\/g, '/'), files: { 'NDC-new-dept-history-BUG.png': id } }));
  console.log(execFileSync('node', [path.join(process.env.USERPROFILE, '.claude/skills/retest-ready-tickets/scripts/plane-attach.js'), csv, 'ahmed-hegazy', PID, path.join(__dirname, '..', 'attach-bug.json')], { encoding: 'utf8' }).trim());
  fs.writeFileSync(path.join(__dirname, '..', 'new-bug.json'), JSON.stringify({ id, seq: c.j.sequence_id }));
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
