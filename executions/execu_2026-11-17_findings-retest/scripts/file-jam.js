// Files the Jam 4ca9d5fe closure bug (user 19 Nov: "file it and assign mahmoud, hegazy and mfathy"). Bug, Desk module, current sprint, one annotated image, Jam link.
const fs = require('fs'), path = require('path');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2';
const MAHMOUD = 'e1364b0b-d3cd-4167-8261-6194577a480a', HEGAZY = '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', MFATHY = '82cf7a79-0707-4f47-97ca-f8926587b6db';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-jam.json'); const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const JAM = 'https://jam.dev/c/4ca9d5fe-e1d1-4007-a494-68fb0153f3f5';
const TITLE = 'Assignment Rules | "Assign tickets on closure" skips offline agents even when "Assign tickets to offline agents" is on';
const IMG = 'JAM-4ca9d5fe-closure-offline-agent.png';
const rows = [
  ['1', 'Online', 'Assign tickets on closure', 'The agent closes own ticket', 'Assigned in 11–24 s'],
  ['2', 'Online', 'Assign tickets on closure', 'Administrator closes the agent’s ticket', 'Assigned in 10–11 s'],
  ['3', 'Offline', 'Assign tickets on closure', 'Administrator closes the agent’s ticket (11:46 UTC)', 'Unassigned after 110 s'],
  ['4', 'Offline', 'Assign backlogs', 'Threshold raised by 1 and “Assign backlogs” turned on (13:44 UTC)', '<strong>Assigned in 11 s</strong>, while offline'],
  ['5', 'Offline', 'Assign tickets on closure', 'Same agent; administrator closes their ticket, 6 → 5 open (13:45 UTC)', 'Unassigned after 2 min']];
const table = '<table><thead><tr><th>#</th><th>Agent</th><th>Setting used</th><th>What happened</th><th>Backlog ticket</th></tr></thead><tbody>'
  + rows.map(r => '<tr>' + r.map((x, i) => '<td>' + (i === 4 ? x : esc(x)) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
const steps = ['Setup › Assignment Rules › Round Robin › choose a department › ⋮ › Preferences.', 'Turn on “Assign tickets to offline agents”.', 'Turn on “Agent level threshold” and set one agent to their current open tickets + 1.', 'Turn on “Assign tickets on closure”, leave “Assign backlogs” off, and save.', 'Add an active round-robin rule in that department whose pool holds only that agent.', 'Create a matching ticket: it goes to the agent, who is now at the threshold.', 'Create one more matching ticket: it goes to the backlog (unassigned).', 'Let the agent go offline (signed out, or about 12 minutes with no activity).', 'As an administrator, close one of the agent’s tickets.', 'Open the backlog ticket and its History, and watch it for 2 minutes.'];
const HTML = '<div><h2>Summary</h2><p>With “Assign tickets to offline agents” on, round robin treats offline agents as available, and “Assign backlogs” gives them backlog tickets. “Assign tickets on closure” does not follow this setting: when an offline agent’s ticket is closed, the next backlog ticket is not given to that agent, even though they are now under the threshold. The backlog ticket stays unassigned until the agent comes back online and closes another ticket, or until “Assign backlogs” picks it up. With the agent online, closure assignment works.</p>'
  + '<h2>Steps to Reproduce</h2><ol>' + steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>'
  + '<h2>Expected Result</h2><ul><li>“Assign tickets to offline agents” is on, so the agent counts as available, as it does for “Assign backlogs”.</li><li>The agent is now under the threshold, so the backlog ticket is assigned to them straight after the close.</li><li>History shows the assignment.</li></ul>'
  + '<h2>Actual Result</h2><p>The backlog ticket stays unassigned and in the backlog, and History has no assignment entry.</p>'
  + '<p>Results on 19 Nov 2026 (QA AO Dept B, Test User 1, “Assign tickets to offline agents” on):</p>' + table
  + '<ul><li>Controls: with “Assign tickets to offline agents” off, “Assign backlogs” left the backlog ticket unassigned while the agent was offline and assigned it 11 s after the agent came online. The same results were seen in a separate manual run in another department.</li>'
  + '<li>Jam (19 Nov ~10:30 UTC, Customer Support, department threshold 1): #5666 was owned by Customer Experience Specialists 1, who was offline (last active 07:31 UTC); #5666 was closed at 10:30:32 UTC; backlog ticket #5668 was still unassigned an hour later.</li>'
  + '<li>Also seen once: at 10:44 UTC the agent was online and closed their own ticket, and the backlog ticket was not assigned within 70 s. The same setup passed four times afterwards, so this may be intermittent; noted here in case it is related.</li></ul>'
  + '<h2>Environment</h2><ul><li>staging-desk.taviportal.com, NDC-Staging.</li><li>Jam: Edge 152 on Windows, reporter’s session 19 Nov 2026 10:29–10:31 UTC: <a href="' + JAM + '">' + JAM + '</a></li><li>Retests 19 Nov 2026, 11:00–11:48 and 13:40–13:51 UTC, Desk Administrator and Test User 1 accounts (preferences saved through the Preferences screen and the API), plus a manual UI run 13:15–13:38 UTC.</li><li>QA rules and tickets were deleted and the department preferences restored afterwards.</li></ul>'
  + '<h2>Attachment</h2><p>Annotated evidence: ' + IMG + ' (Preferences screen; online, offline and Assign backlogs results; Check | Expected | Now | Result table). Recording: <a href="' + JAM + '">' + JAM + '</a></p><p>Related: NDC-2275 (assignment rules requirements, RR-16).</p></div>';
async function attach(id, file) {
  const buf = fs.readFileSync(path.join(RUN, 'screenshots/annotated', file));
  const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: file, type: 'image/png', size: buf.length }); if (r1.s >= 300) return 'step1 ' + r1.s;
  const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), file);
  const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) return 'step2 ' + r2.status;
  const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id); const r3 = await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true }); return 'attached ' + r3.s;
}
(async () => {
  if (!KEY) throw new Error('no key');
  const cur = (await call('GET', '/cycles/7143596a-fcfb-48b6-a6ee-193bfc04bfdd/')).j; console.log('cycle', cur.name, cur.end_date);
  let L = [], c = ''; for (let i = 0; i < 6; i++) { const j = (await call('GET', '/labels/?per_page=100' + (c ? '&cursor=' + c : ''))).j; L = L.concat(j.results || []); if (!j.next_page_results) break; c = j.next_cursor; }
  const lab = (L.find(l => l.name === 'Assignment Rules') || {}).id; console.log('label', lab ? 'ok' : 'MISSING');
  if (process.argv[2] === 'check') return;
  if (done.JAM) { console.log('already filed', done.JAM[0]); return; }
  const cr = await call('POST', '/work-items/', { name: TITLE, description_html: HTML, priority: 'medium', state: BUG, labels: lab ? [lab] : [], assignees: [MAHMOUD, HEGAZY, MFATHY], start_date: '2026-11-19' });
  if (!cr.j || !cr.j.id) { console.log('create failed', cr.s, JSON.stringify(cr.j).slice(0, 300)); return; }
  const id = cr.j.id; done.JAM = ['NDC-' + cr.j.sequence_id, id]; fs.writeFileSync(OUTF, JSON.stringify(done));
  const mo = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] }); const cy = await call('POST', `/cycles/${cur.id}/cycle-issues/`, { issues: [id] });
  const lk = await call('POST', `/work-items/${id}/links/`, { url: JAM, title: 'Jam 4ca9d5fe' }); const a = await attach(id, IMG);
  console.log('->', done.JAM[0], 'module', mo.s, 'cycle', cy.s, 'link', lk.s, a);
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
