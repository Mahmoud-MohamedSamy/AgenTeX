// Files Wave 4 bugs D1–D9 (user approved 13 Nov 2026). Same fields as Wave 2 (NDC-2947…): Bug, Desk, Sprint 15, 4 assignees. One annotated image each.
const fs = require('fs'), path = require('path');
const KEY = (fs.readFileSync('D:/Learning & Work/Software Testing/Anyware Software/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9529016b-e67d-42b9-815c-263f673b8252', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'wave4/plane-filed.json'); const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const data = require(path.join(RUN, 'wave4/report-data.js')); const B = (data.bugs || data.default?.bugs || []);
const META = {
  D8: { area: 'Email', labels: ['Email Channel', 'Customer Happiness'], img: 'W4-D8-no-acks-no-rating-link.png', note: 'From the Desk automation-order run on the same tenant: with ratings not limited to a department, the closing-style email did carry working rating buttons (NT-10 on 10 Nov, and workflow I29 on 12 Nov, ticket #3194 rated Good). So the missing link may be tied to ratings limited to one department (Marketing here).' },
  D5: { area: 'Knowledge Base', labels: ['Knowledge Base', 'Localization'], img: 'W4-D5-kb-translation-reversed.png' },
  D1: { area: 'Email', labels: ['Email Channel'], img: 'W4-D1-email-domains-validation.png' },
  D9: { area: 'Email Templates', labels: ['Email Channel'], img: 'W4-D9-reply-ack-template-stuck.png' },
  D3: { area: 'Web Forms', labels: ['Web Forms'], img: 'W4-D3-disabled-form-blank.png' },
  D4: { area: 'Web Forms', labels: ['Web Forms', 'Localization'], img: 'W4-D4-arabic-form-english-ltr.png' },
  D6: { area: 'Knowledge Base', labels: ['Knowledge Base'], img: 'W4-D6-kb-gallery-empty.png' },
  D7: { area: 'Community', labels: ['Help Center'], img: 'W4-D7-topic-no-ticket-vs-zoho.png' },
  D2: { area: 'Email', labels: ['Email Channel'], img: 'W4-D2-wildcard-blocked-vs-zoho.png' },
};
async function attach(id, file) {
  const buf = fs.readFileSync(path.join(RUN, 'evidence/annotated', file));
  const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: file, type: 'image/png', size: buf.length }); if (r1.s >= 300) return 'step1 ' + r1.s;
  const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), file);
  const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) return 'step2 ' + r2.status;
  const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id); const r3 = await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true }); return 'attached ' + r3.s;
}
(async () => {
  if (!KEY) throw new Error('no key');
  let L = [], c = ''; for (let i = 0; i < 6; i++) { const j = (await call('GET', '/labels/?per_page=100' + (c ? '&cursor=' + c : ''))).j; L = L.concat(j.results || []); if (!j.next_page_results) break; c = j.next_cursor; }
  const lid = n => (L.find(l => l.name === n) || {}).id;
  for (const key of ['D8', 'D5', 'D1', 'D9', 'D3', 'D4', 'D6', 'D7', 'D2']) {
    if (done[key]) { console.log(key, 'already filed', done[key][0]); continue; }
    const b = B.find(x => x.id === key), m = META[key]; if (!b) { console.log(key, 'no draft'); continue; }
    const html = '<div><h2>Summary</h2><p>' + md(b.title) + '. Found in the Desk go-live retest, Wave 4 (' + esc(b.cases) + '), NDC-Staging, 12 Nov 2026. Where: ' + esc(b.where) + '.</p>'
      + '<h2>Steps</h2><ol>' + b.steps.map(s => '<li>' + md(s) + '</li>').join('') + '</ol>'
      + '<h2>Expected</h2><p>' + md(b.expected) + '</p><h2>Actual</h2><p>' + md(b.actual) + '</p>'
      + (b.request ? '<p>' + esc(b.request).replace(/\n/g, '<br>') + '</p>' : '')
      + '<h2>Zoho Desk</h2><p>' + md(b.zoho) + '</p>' + (m.note ? '<h2>Note</h2><p>' + esc(m.note) + '</p>' : '')
      + '<h2>Environment</h2><p>staging-desk.taviportal.com, NDC-Staging (Wonder Travel), owner and a customer mailbox, Edge, 12 Nov 2026.</p><h2>Attachment</h2><p>Annotated evidence: ' + esc(m.img) + '.</p></div>';
    const name = 'W4-' + key + ' ' + m.area + ' | ' + b.title;
    const cr = await call('POST', '/work-items/', { name, description_html: html, priority: b.sev.toLowerCase(), state: BUG, labels: m.labels.map(lid).filter(Boolean), assignees: ASSIGNEES, start_date: '2026-11-13' });
    if (!cr.j || !cr.j.id) { console.log(key, 'create failed', cr.s, JSON.stringify(cr.j).slice(0, 300)); continue; }
    const id = cr.j.id; done[key] = ['NDC-' + cr.j.sequence_id, id]; fs.writeFileSync(OUTF, JSON.stringify(done));
    const mo = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] }); const cy = await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [id] }); const a = await attach(id, m.img);
    console.log(key, '->', done[key][0], b.sev, 'labels', m.labels.map(lid).filter(Boolean).length, 'module', mo.s, 'cycle', cy.s, a);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
