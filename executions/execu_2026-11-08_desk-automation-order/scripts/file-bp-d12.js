// Files D-12 (14 Nov: user 'yes file it').
// Plane REST with the user's API key (never printed). Bug state, labels Blueprint + Automation Execution Order, module Desk, Sprint 15, NDC-2788 assignees.
const fs = require('fs'), path = require('path');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const LABELS = ['abdc5684-1c9c-46f3-b7ce-f7b7909b42fc', 'e449cd35-5c91-4f32-8359-6aabc6ce08ff']; // Blueprint, Automation Execution Order
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-blueprint.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, owner account, 13 Nov 2026.';
const ZENV = ' Compared live with Zoho Desk (test account techsolutionsegypt; test blueprint deleted afterwards).';
const html = b => '<p><strong>Summary</strong></p><p>' + esc(b.summary) + '</p>'
  + '<p><strong>Steps to Reproduce</strong></p><ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>'
  + '<p><strong>Expected Result</strong></p><ul>' + b.expected.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>'
  + '<p><strong>Actual Result</strong></p><ul>' + b.actual.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>'
  + (b.zoho ? '<p><strong>Zoho Desk</strong></p><p>' + esc(b.zoho) + '</p>' : '')
  + (b.note ? '<p><strong>Note</strong></p><p>' + esc(b.note) + '</p>' : '')
  + '<p><strong>Environment</strong></p><p>' + esc(ENV + (b.zoho ? ZENV : '')) + '</p>'
  + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (' + esc(b.image) + ').</p>';
const CYCLE_16 = '7143596a-fcfb-48b6-a6ee-193bfc04bfdd';
const bugs = [
  { key: 'D-12', priority: 'low', image: 'BP-K3-help-center-reply-shown-as-email-received.png', name: 'Ticket History | A customer reply from the Help Center is shown as "Email received"',
    summary: 'When a customer replies to their ticket from the Help Center, the ticket History tab records it as "Email received", as if the reply came by email.',
    steps: ['Create a ticket for a contact who can sign in to the Help Center.', 'As the contact, open the ticket in the Help Center and post a reply.', 'As an agent, open the ticket › History.'],
    expected: ['The entry says the reply came from the Help Center, e.g. "Reply received from the Help Center".'],
    actual: ['The entry reads "Email received from <contact name>" (seen on QA ticket #3463, 13 Nov 2026, 14:35 Cairo).'],
    note: 'Not compared with Zoho (not checked live). Found during Blueprint case K3: the reply also moved the ticket correctly through the blueprint, only the History label is wrong.' },
];

async function attach(id, file) {
  const buf = fs.readFileSync(path.join(RUN, 'evidence/annotated', file));
  const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: file, type: 'image/png', size: buf.length });
  if (r1.s >= 300) return 'step1 ' + r1.s;
  const up = r1.j.upload_data; const fd = new FormData();
  for (const [k, v] of Object.entries(up.fields)) fd.append(k, v);
  fd.append('file', new Blob([buf], { type: 'image/png' }), file);
  const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) return 'step2 ' + r2.status;
  const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id);
  const r3 = await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true });
  return 'attached ' + r3.s;
}

(async () => {
  if (!KEY) throw new Error('no key');
  for (const b of bugs) {
    if (done[b.key]) { console.log(b.key, 'already filed', done[b.key].seq); continue; }
    if (!fs.existsSync(path.join(RUN, 'evidence/annotated', b.image))) { console.log(b.key, 'no image, skipped'); continue; }
    const c = await call('POST', '/work-items/', { name: b.name, description_html: html(b), priority: b.priority, state: BUG, labels: LABELS, assignees: ASSIGNEES, start_date: "2026-11-14" });
    if (!c.j || !c.j.id) { console.log(b.key, 'create failed', c.s, JSON.stringify(c.j).slice(0, 300)); continue; }
    const id = c.j.id; done[b.key] = { id, seq: 'NDC-' + c.j.sequence_id, priority: b.priority, title: b.name, image: 'evidence/annotated/' + b.image }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] });
    const cy = await call('POST', `/cycles/${CYCLE_16}/cycle-issues/`, { issues: [id] });
    const a = await attach(id, b.image);
    done[b.key].module = m.s; done[b.key].cycle = cy.s; done[b.key].attach = a; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    console.log(b.key, '->', done[b.key].seq, b.priority, 'module', m.s, 'cycle', cy.s, a);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
