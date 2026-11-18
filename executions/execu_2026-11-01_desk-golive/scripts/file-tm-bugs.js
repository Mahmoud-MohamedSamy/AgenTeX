// Files ticket-menu bugs TM-1, TM-2 (user: "file TM-1 and TM-2", 16 Nov). Bug, Desk module, Sprint 16, 4 assignees, one annotated image each.
const fs = require('fs'), path = require('path');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', SPRINT_16 = '7143596a-fcfb-48b6-a6ee-193bfc04bfdd';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9529016b-e67d-42b9-815c-263f673b8252', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'ticketmenu/plane-filed.json'); const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'staging-desk.taviportal.com, NDC-Staging (Wonder Travel), owner account, Edge, 16 Nov 2026. Zoho Desk checked live the same day in the test org TechEgySolutions as admin; test data deleted after.';
const BUGS = {
  'TM-1': {
    title: 'Tickets | Clone leaves the required Status empty, so the copy cannot be saved until it is picked again',
    labels: ['Tickets'], img: 'TM-1-clone-status-vs-zoho.png',
    summary: 'Cloning a ticket from the ticket page opens the new-ticket form with Status empty, but Status is required, so the first Save always fails.',
    steps: ['Open any ticket (tried on the Standard layout and on the "Test Layout Rules" layout).', 'Open the ⋮ menu › Clone.', 'Look at Status on the form, then click Save.'],
    expected: 'The clone form starts with a valid status (Zoho fills "Open"), so Save works straight away.',
    actual: 'Status shows "Select" with "This field is required". Save shows "Please fix the field highlighted below." The clone link skips status on purpose (clone_skip=status,resolution,closed_time,ticket_number) but nothing puts the default back. After picking Open by hand the copy saved (#4582, same contact and email).',
    zoho: 'Checked live 16 Nov: More Actions › Clone on ticket #108 opens "Clone Ticket" with Status = Open, Ticket Owner Unassigned, Subject "… (Clone)"; Submit works at once.',
  },
  'TM-2': {
    title: 'Tickets | A ticket marked as spam still accepts replies and comments and stays shared with other departments',
    labels: ['Tickets'], img: 'TM-2-spam-reply-vs-zoho.png',
    summary: 'After Mark as Spam the ticket shows the Spam chip and banner, but agents can still reply to the sender and add comments, and the ticket keeps its sharing with other departments.',
    steps: ['Share a ticket with another department (⋮ › Share, e.g. HR, Full Access).', 'Mark it as spam (⋮ › Mark as Spam › Mark as Spam).', 'Click Reply All; add a private comment; look at the "Shared with" chip and the ⋮ menu.'],
    expected: 'A spam ticket is closed to conversation: no reply and no comment, and sharing with other departments is removed, as in Zoho. Only Not Spam and Delete stay in the menu.',
    actual: 'Reply All opens the composer with Send; a private comment saves (POST /desk/tickets/{id}/comments → 201); the ticket still shows "Shared with HR" and GET /desk/tickets/{id}/shares still returns HR (full access); the full ⋮ menu (Move, Share, Merge, Clone…) is still offered.',
    zoho: 'Checked live 16 Nov on ticket #109: after Mark Spam the ticket shows "Ticket has been marked as spam, so you are not able to add Conversation"; More Actions shows only Not Spam and Delete. Zoho\'s Mark Spam dialog says "If the ticket is shared with other departments, it will be revoked." (dialog text seen; not tried with a shared Zoho ticket).',
  },
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
  for (const [key, b] of Object.entries(BUGS)) {
    if (done[key]) { console.log(key, 'already filed', done[key][0]); continue; }
    const html = '<div><h2>Summary</h2><p>' + esc(b.summary) + ' Found in the Desk go-live retest (ticket ⋮ menu run), NDC-Staging, 16 Nov 2026.</p>'
      + '<h2>Steps</h2><ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>'
      + '<h2>Expected</h2><p>' + esc(b.expected) + '</p><h2>Actual</h2><p>' + esc(b.actual) + '</p>'
      + '<h2>Zoho Desk</h2><p>' + esc(b.zoho) + '</p><h2>Environment</h2><p>' + esc(ENV) + '</p><h2>Attachment</h2><p>Annotated evidence (TAVI vs Zoho): ' + esc(b.img) + '.</p></div>';
    const cr = await call('POST', '/work-items/', { name: b.title, description_html: html, priority: 'medium', state: BUG, labels: b.labels.map(lid).filter(Boolean), assignees: ASSIGNEES, start_date: '2026-11-16' });
    if (!cr.j || !cr.j.id) { console.log(key, 'create failed', cr.s, JSON.stringify(cr.j).slice(0, 300)); continue; }
    const id = cr.j.id; done[key] = ['NDC-' + cr.j.sequence_id, id]; fs.writeFileSync(OUTF, JSON.stringify(done));
    const mo = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] }); const cy = await call('POST', `/cycles/${SPRINT_16}/cycle-issues/`, { issues: [id] }); const a = await attach(id, b.img);
    console.log(key, '->', done[key][0], 'labels', b.labels.map(lid).filter(Boolean).length, 'module', mo.s, 'cycle', cy.s, a);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
