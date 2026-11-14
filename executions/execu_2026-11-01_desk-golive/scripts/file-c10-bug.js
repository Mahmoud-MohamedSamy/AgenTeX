// Files Wave 2 C10 (user: "file it", 14 Nov 2026) with the reviewed text. Bug, High, Desk, Sprint 16, 4 assignees, image.
const fs = require('fs'), path = require('path');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '7143596a-fcfb-48b6-a6ee-193bfc04bfdd';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9529016b-e67d-42b9-815c-263f673b8252', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'wave3/plane-filed.json'); const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const data = require(path.join(RUN, 'wave3/report-data.js')); const B = (data.bugs || data.default?.bugs || []);
const META = {
  F4: { labels: ['Access Control', 'Desk Settings', 'Tickets'], img: 'w3/F4-vs-zoho.png' },
  F2: { labels: ['Custom Actions', 'API & Platform'], img: 'w3/F2-vs-zoho.png' },
  F3: { labels: ['Custom Actions', 'Workflow Rules'], img: 'w3/F3-vs-zoho.png' },
  F1: { labels: ['SLA & Business Hours', 'Customers', 'API & Platform'], img: 'w3/F1-vs-zoho.png', note: 'Same pattern as NDC-2841 (the screen blocks it, the API does not).' },
};
async function attach(id, file) {
  const buf = fs.readFileSync(path.join(RUN, 'evidence/annotated', file));
  const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: path.basename(file), type: 'image/png', size: buf.length }); if (r1.s >= 300) return 'step1 ' + r1.s;
  const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), path.basename(file));
  const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) return 'step2 ' + r2.status;
  const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id); const r3 = await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true }); return 'attached ' + r3.s;
}

const OUTC = path.join(RUN, 'wave2/plane-filed-c10.json');
(async () => {
  if (!KEY) throw new Error('no key'); if (fs.existsSync(OUTC)) { console.log('already filed', fs.readFileSync(OUTC,'utf8')); return; }
  let L = [], c = ''; for (let i = 0; i < 6; i++) { const j = (await call('GET', '/labels/?per_page=100' + (c ? '&cursor=' + c : ''))).j; L = L.concat(j.results || []); if (!j.next_page_results) break; c = j.next_cursor; }
  const lid = n => (L.find(l => l.name === n) || {}).id;
  const name = 'Access | With Private ticket sharing, an agent can open tickets of a department they are not in when a lower-role agent owns them';
  const html = '<div><h2>Summary</h2><p>With Tickets data sharing set to Private, an agent can list and open tickets of a department they don’t belong to, when those tickets are owned by an agent below them in the role hierarchy. Found in the Desk go-live retest, Wave 2 (W2-76, W2-85), NDC-Staging, 12 Nov 2026.</p>'
   + '<h2>Steps</h2><ol><li>In Setup › Data Sharing, set Tickets to <strong>Private</strong>.</li><li>Agent C is in <strong>Customer Support only</strong>. Agent B has a <strong>lower role</strong> than C (B reports to C in Roles) and is in <strong>Marketing</strong>.</li><li>Assign Marketing tickets #3105 and #3106 to agent B.</li><li>Sign in as agent C, open All Tickets and search "QA GL W2".</li><li>Open #3105.</li></ol>'
   + '<h2>Expected</h2><p>C can’t see or open Marketing tickets, because C isn’t a Marketing agent. Department membership should come first; the role hierarchy should only widen access within the agent’s own departments.</p>'
   + '<h2>Actual</h2><p>C sees #3105 and #3106 in the list and opens both, comments included. Other Marketing tickets stay hidden from C, so the access comes only from C being above B in the role hierarchy. The department isn’t checked.</p>'
   + '<h2>Zoho Desk (checked live, 14 Nov 2026)</h2><p>Same setup in a Zoho Desk Enterprise test org:</p><ul><li>Tickets set to Private.</li><li>Agent 1 is a Manager in department "QA C10 Marketing" and owns ticket #101.</li><li>Agent 2 is a CEO (above Manager) and is not in that department.</li></ul><p>Agent 2 opening #101 gets <strong>"Permission denied. You do not have sufficient permissions to perform this operation."</strong> Through the API, opening the ticket and listing the department’s tickets both return 403, and search finds nothing. Control: once Agent 2 is added to the department, #101 opens. So Zoho checks the department first.</p>'
   + '<h2>Related</h2><p>NDC-2196</p><h2>Environment</h2><p>staging-desk.taviportal.com, NDC-Staging (Wonder Travel), owner + agent B + agent C, Edge, 12 Nov 2026. Zoho Desk test org, 14 Nov 2026.</p><h2>Attachment</h2><p>Annotated evidence (TAVI vs Zoho): W2-C10-vs-zoho-live.png.</p></div>';
  const labels = ['Access Control', 'Tickets', 'Teams & Agents'];
  const cr = await call('POST', '/work-items/', { name, description_html: html, priority: 'high', state: BUG, labels: labels.map(lid).filter(Boolean), assignees: ASSIGNEES, start_date: '2026-11-14' });
  if (!cr.j || !cr.j.id) { console.log('create failed', cr.s, JSON.stringify(cr.j).slice(0, 300)); return; }
  const id = cr.j.id; fs.writeFileSync(OUTC, JSON.stringify(['NDC-' + cr.j.sequence_id, id]));
  const mo = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] }); const cy = await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [id] }); const a = await attach(id, 'W2-C10-vs-zoho-live.png');
  console.log('C10 -> NDC-' + cr.j.sequence_id, 'labels', labels.map(lid).filter(Boolean).length, 'module', mo.s, 'cycle', cy.s, a);
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
