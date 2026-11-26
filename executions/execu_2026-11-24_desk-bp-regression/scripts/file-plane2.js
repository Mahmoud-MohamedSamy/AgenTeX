// Files the 5 approved drafts (user 24 Nov 2026: "File all 5"). Plane REST with the user's API key (never printed).
// Bug state, Blueprint label (+ Workflow Rules on R4), Desk module, Sprint 17, assignees MahmoudMohamed + mfathy + Hegazy, one annotated image each, relates-to links.
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads'; const kf = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const KEY = (fs.readFileSync(path.join(DL, kf), 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const WS = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy';
const BASE = WS + '/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const L_BP = 'abdc5684-1c9c-46f3-b7ce-f7b7909b42fc', L_WF = 'bf14090c-73c4-4e27-923e-59ffd0ccb7cb';
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', SPRINT17 = '8347595f-5728-4093-bb08-f451e7faa47b';
const IMG = path.join(__dirname, '../evidence/annotated');
const OUTF = path.join(__dirname, '../out/plane-filed2.json');
const ENV = 'NDC-Staging (staging-desk.taviportal.com), Desk → Tickets, department Customer Support; reproduced 25 Nov 2026 11:40 Cairo (owner + Agent A / Agent B accounts, Edge + API). Found in the Desk Blueprint go-live regression (24 Nov 2026).';
const call = async (m, p, body, base = BASE) => { const r = await fetch(base + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j, t: t.slice(0, 300) }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const html = b => '<p><strong>Summary</strong></p><p>' + esc(b.summary) + '</p>'
  + '<p><strong>Steps to Reproduce</strong></p><ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>'
  + '<p><strong>Expected Result</strong></p><ul>' + b.expected.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>'
  + '<p><strong>Actual Result</strong></p><ul>' + b.actual.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>'
  + (b.note ? '<p><strong>Note</strong></p><p>' + esc(b.note) + '</p>' : '')
  + '<p><strong>Environment</strong></p><p>' + esc(ENV) + '</p>'
  + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (' + esc(b.image) + ').</p>';
const bugs = require('./bugs2.js');
(async () => {
  const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
  const idOf = async ident => { const r = await call('GET', `/work-items/${ident}/`, undefined, WS); return r.j?.id; };
  for (const b of bugs) {
    if (done[b.key]?.id) { console.log(b.key, 'already filed', done[b.key].ident); continue; }
    const c = await call('POST', '/work-items/', { name: b.name, description_html: html(b), priority: b.priority, state: BUG, labels: b.labels, assignees: ASSIGNEES, start_date: '2026-11-25' });
    const id = c.j?.id; if (!id) { console.log(b.key, 'create failed', c.s, c.t); continue; }
    const ident = 'NDC-' + c.j.sequence_id; done[b.key] = { id, ident }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] });
    const cy = await call('POST', `/cycles/${SPRINT17}/cycle-issues/`, { issues: [id] });
    // attach
    const file = path.join(IMG, b.image); const buf = fs.readFileSync(file);
    const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: b.image, type: 'image/png', size: buf.length });
    let att = 'fail ' + r1.s;
    if (r1.s < 300) { const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), b.image);
      const r2 = await fetch(up.url, { method: 'POST', body: fd }); const aid = r1.j.asset_id || r1.j.attachment?.id; const r3 = await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true }); att = r2.status + '/' + r3.s; }
    let rel = '-'; if (b.rel.length) { const ids = (await Promise.all(b.rel.map(idOf))).filter(Boolean); const r = await call('POST', `/work-items/${id}/relations/`, { relation_type: 'relates_to', issues: ids }); rel = r.s + ' (' + ids.length + '/' + b.rel.length + ')'; }
    Object.assign(done[b.key], { module: m.s, cycle: cy.s, attach: att, relations: rel }); fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    console.log(b.key, ident, 'module', m.s, 'cycle', cy.s, 'attach', att, 'rel', rel);
  }
  // read back
  for (const [k, v] of Object.entries(done)) { const r = await call('GET', `/work-items/${v.id}/?expand=labels,assignees`); const a = await call('GET', `/work-items/${v.id}/attachments/`);
    console.log('readback', v.ident, r.j?.priority, (r.j?.labels || []).map(x => x.name || x).join('+'), (r.j?.assignees || []).length + ' assignees', 'attachments', (Array.isArray(a.j) ? a.j : a.j?.results || []).length, '|', String(r.j?.name).slice(0, 70)); }
})().catch(e => console.error('ERR', String(e.message).replace(/plane_[\w-]+/g, '<key>')));
