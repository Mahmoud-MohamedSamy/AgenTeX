// Files OR-13 (14 Nov: user "yes fix the report and file OR-13"). Plane REST with the user's API key (never printed).
const fs = require('fs'), path = require('path');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const LABELS = ['5ad0a95a-678e-4485-845d-bb93c27dce36', 'eebb0fe0-596b-4764-a971-3caa2b20071d', 'e449cd35-5c91-4f32-8359-6aabc6ce08ff']; // Assignment Rules, SLA, Automation Execution Order
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-partB.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, owner account, department QA AS6 Dept A, agents Test User 1, Mahmoud Samy and Dev Team 2 online, 14 Nov 2026.';
const ZENV = '';
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
  { key: 'OR-13', priority: 'medium', image: 'OR-13-round-robin-cannot-see-sla-on-new-ticket.png', name: 'Assignment Rules | Round robin rule with an SLA condition does not assign new tickets',
    summary: 'A round-robin rule whose condition uses the SLA (for example "SLA Name is X") never assigns a newly created ticket, even though the SLA is already applied to it. The same rule assigns the ticket only later, when someone edits it. The Round Robin page itself says "Round robin runs after workflows and SLAs".',
    steps: ['Setup › SLA & Escalation: create an active SLA policy in a department that applies on ticket create (any target that matches the test ticket).', 'Setup › Assignment Rules › Round Robin: in the same department create an active rule that runs on Ticket Create and Ticket Update, with the condition SLA Name is <that policy> and a few online agents in the pool.', 'Create a new unassigned ticket in that department that matches the SLA policy.', 'Open the ticket and look at Ticket Owner and the History tab.', 'Edit any field on the ticket (e.g. Priority) and look again.'],
    expected: ['The SLA is applied first and the round-robin rule then assigns the new ticket at creation, as the Round Robin page states ("Round robin runs after workflows and SLAs").'],
    actual: ['The SLA is applied on create, but the ticket stays Unassigned and History has no assignment entry (QA ticket #3922, created 14 Nov 2026 3:33 PM Cairo).', 'After one edit (Priority High › Medium at 3:45 PM) the same rule assigns it at once to Test User 1, trigger "The ticket was edited". So the rule and its condition are correct; on create the round robin does not see the SLA.', 'Same result in the earlier run on 14 Nov (OR-13 and OR-13b). Round-robin rules whose conditions use fields set by workflows (e.g. Priority) do assign on create, so only the SLA step is affected.'],
    note: 'Zoho Desk help states SLA is applied before round robin; not checked live in Zoho (its API refused to create round-robin rules in the test org). Found in the Desk automation order run, case OR-13.' },
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
