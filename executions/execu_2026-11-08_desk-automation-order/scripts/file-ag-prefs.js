// Files EM-08 and E18-03 (user asked 10 Nov 2026: "file EM-08 and E18-03 with annotated evidence"). Plane REST with the API key (never printed).
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads'; const f = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const KEY = (fs.readFileSync(path.join(DL, f), 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const BASE = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-ag-prefs.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };

const bugs = [
  { key: 'AG-PREFS', priority: 'low', labels: ['5ad0a95a-678e-4485-845d-bb93c27dce36'], image: 'AG-prefs-agent-can-read-rr-preferences.png',
    name: 'Assignment Rules | An agent without the assignment permission can still read Round Robin Preferences and Team Assignment',
    html: '<p><strong>Summary</strong></p><p>An agent whose profile does not have the "Manage assignment rules" permission is blocked from the Assignment Rules page and from the rules, but can still read the department’s Round Robin Preferences (thresholds, agent thresholds, backlog and closure settings) and its Team Assignment setting. Saving them is blocked correctly. Reading should be blocked the same way.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Sign in as an agent with the Desk Agent profile (no "Manage assignment rules" permission).</li><li>Open Setup › Assignment Rules. The page says "You can’t manage assignment".</li><li>As the same agent, request the department’s Round Robin Preferences and Team Assignment (GET /api/v1/desk/departments/{id}/round-robin-preferences and /team-assignment).</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>Both requests are refused, like the rules request, because the agent cannot manage assignment.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>The rules request is refused (403, Missing required permission desk:assignment:manage) and saving preferences is refused (403).</li><li>Reading Round Robin Preferences returns 200 with all the department’s threshold, backlog and closure settings.</li><li>Reading Team Assignment returns 200.</li></ul>'
      + '<p><strong>Environment</strong></p><p>staging-desk.taviportal.com (NDC-Staging), agent Customer Experience Specialists 2 (Desk Agent profile), department QA AS6 Dept A, 10 Nov 2026 11:42 UTC.</p>'
      + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (AG-prefs-agent-can-read-rr-preferences.png).</p>' }];
async function attach(id, file) {
  const buf = fs.readFileSync(path.join(RUN, 'evidence/annotated', file));
  const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: file, type: 'image/png', size: buf.length }); if (r1.s >= 300) return 'step1 ' + r1.s;
  const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v);
  fd.append('file', new Blob([buf], { type: 'image/png' }), file);
  const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) return 'step2 ' + r2.status;
  const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id);
  return 'attached ' + (await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true })).s;
}
(async () => {
  for (const b of bugs) {
    if (done[b.key]) { console.log(b.key, 'already filed', done[b.key].seq); continue; }
    const c = await call('POST', '/work-items/', { name: b.name, description_html: b.html, priority: b.priority, state: BUG, labels: b.labels, assignees: ASSIGNEES, start_date: '2026-11-10' });
    if (!c.j || !c.j.id) { console.log(b.key, 'create failed', c.s, JSON.stringify(c.j).slice(0, 300)); continue; }
    const id = c.j.id; done[b.key] = { id, seq: 'NDC-' + c.j.sequence_id, title: b.name, priority: b.priority, image: 'evidence/annotated/' + b.image }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] });
    const cy = await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [id] });
    const a = await attach(id, b.image);
    const back = await call('GET', `/work-items/${id}/`); const att = await call('GET', `/work-items/${id}/attachments/`);
    console.log(b.key, '->', done[b.key].seq, '| module', m.s, '| cycle', cy.s, '|', a, '| state ok', back.j.state === BUG, '| attachments', (Array.isArray(att.j) ? att.j : att.j.results || []).length);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
