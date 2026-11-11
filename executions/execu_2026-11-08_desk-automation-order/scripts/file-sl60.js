// Files EM-08 and E18-03 (user asked 10 Nov 2026: "file EM-08 and E18-03 with annotated evidence"). Plane REST with the API key (never printed).
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads'; const f = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const KEY = (fs.readFileSync(path.join(DL, f), 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const BASE = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-sl60.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };

const bugs = [
  { key: 'SL-60', priority: 'medium', labels: ['eebb0fe0-596b-4764-a971-3caa2b20071d','e449cd35-5c91-4f32-8359-6aabc6ce08ff'], image: 'SL-60-contract-takes-plan-from-another-department-vs-zoho.png',
    name: 'SLA | A contract in one department can use a support plan (and its SLA) from another department',
    html: '<p><strong>Summary</strong></p><p>Support plans and SLA policies belong to a department, and a contract belongs to a department. Desk accepts a contract in one department with a support plan from another department, so the other department’s SLA is applied to this customer. In Zoho Desk a contract is created inside its department and the Support Plan field only lists that department’s plans.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>In Setup › Support Plans, select department B and create a support plan with an SLA policy of department B.</li><li>Create a contract in department A (with an account, start and end date) and choose the department B plan as its support plan.</li><li>Open the contract.</li><li>Go to Setup › Support Plans and select department B.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>Only department A’s support plans can be chosen for a department A contract; a plan from another department is refused.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>The contract is saved. Its Department is QA AO Dept A, and Support Plan Info shows the QA AO Dept B plan and its Dept B SLA.</li><li>Support Plans for QA AO Dept B lists that plan with Contracts = 1.</li><li>Attaching a Dept B plan to an existing Dept A contract was also accepted on 9 Nov.</li><li>Note: the contract was created through the API; whether the New Contract form also offers other departments’ plans was not checked.</li></ul>'
      + '<p><strong>Environment</strong></p><p>staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, owner account, 10 Nov 2026 12:10 UTC. Zoho Desk (techsolutionsegypt) checked live, read-only: Add Contract under the current department; plans loaded with departmentId of the current department.</p>'
      + '<p><strong>Attachment</strong></p><p>Annotated comparison with Zoho attached (SL-60-contract-takes-plan-from-another-department-vs-zoho.png).</p>' }];
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
