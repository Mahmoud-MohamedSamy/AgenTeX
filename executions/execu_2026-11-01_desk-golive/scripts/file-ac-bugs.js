// Files ticket-access findings AC-G1, G2, G3, G5, G6, B1 (user: "file the bugs you found with annotated evidence", 17 Nov). Bug, Desk module, Sprint 16, 4 assignees, one annotated image each.
const fs = require('fs'), path = require('path');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', SPRINT_16 = '7143596a-fcfb-48b6-a6ee-193bfc04bfdd';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9529016b-e67d-42b9-815c-263f673b8252', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'access/plane-filed.json'); const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'staging-desk.taviportal.com, NDC-Staging (Wonder Travel), Edge, 17 Nov 2026; accounts: owner, Desk Administrator (B), Desk Agent (C, Customer Support), Test User 1 (Desk Agent / Light Agent for the test). Zoho Desk checked live the same day in the test org TechEgySolutions (admin, test agents 1 and 2); test data deleted and settings restored after.';
const BUGS = {
  'AC-G1': { title: 'Tickets | A ticket cannot be moved to another department from the ticket list', priority: 'low', labels: ['Tickets'], img: 'AC-G1-list-move-vs-zoho.png',
    summary: 'The ticket list gives no way to move a ticket to another department. Rows do not show the department, and moving is only possible from ⋮ › Move on the ticket page.',
    steps: ['Sign in as an agent or admin who belongs to more than one department.', 'Open Tickets › All Tickets (any list view).', 'Look for the ticket\'s department on a row and try to move the ticket from the list.'],
    expected: 'As in Zoho: each row shows its department, and clicking it opens a "Move Department" picker that moves the ticket from the list.',
    actual: 'Rows show subject, number, time, status and owner only. There is no department label and no move action in the list; the agent has to open each ticket and use ⋮ › Move.',
    zoho: 'Checked live 17 Nov: All Departments list, Classic view — every row shows its department (e.g. "Tech ▾"); clicking it opens "MOVE DEPARTMENT" with the other departments. (Zoho\'s mass-selection bar has no Move either, so bulk Move is not part of this report.)' },
  'AC-G2': { title: 'Tickets | No message tells an agent that the ticket they have open was moved to another department', priority: 'low', labels: ['Tickets'], img: 'AC-G2-move-prompt-vs-zoho.png',
    summary: 'When another agent moves the ticket an agent has open, the page silently switches to a generic "not available" message. The agent is not told that the ticket was moved, by whom, or where.',
    steps: ['Agent C (Customer Support only) opens a Customer Support ticket and keeps it open.', 'Another agent or the owner moves that ticket to Sales (⋮ › Move).', 'Look at agent C\'s open ticket page.'],
    expected: 'As in Zoho: a prompt such as "<agent> has moved this ticket from Customer Support to Sales department. Would you like to stay on this ticket?" with Yes / Exit.',
    actual: 'Within seconds the page shows "This ticket is not available — It was deleted, or it is outside the records you are allowed to see." and, after a reload, "Permission denied." Nothing says that the ticket was moved.',
    zoho: 'Checked live 17 Nov: test agent 2 had ticket #132 open while the admin moved it from TechEgySolutions to Tech; agent 2 saw "mahmoud.mahamed1717 has moved this ticket from TechEgySolutions to Tech department. Would you like to stay on this ticket?" with Yes / Exit.' },
  'AC-G3': { title: 'Teams | A light agent can be added to a team, and the team can then be given tickets', priority: 'low', labels: ['Teams & Agents'], img: 'AC-G3-light-agent-team-vs-zoho.png',
    summary: 'A light agent (view and private comment only) is accepted as a team member, and tickets can then be assigned to that team. Making the light agent the ticket owner is refused correctly, so the team is the way around it.',
    steps: ['Give an agent the Desk Light Agent profile (here Test User 1, member of Customer Support).', 'Setup › Teams › New Team in Customer Support, add that agent as the only member, save (POST /desk/teams).', 'Assign a Customer Support ticket to that team (POST /desk/tickets/{id}/assign with team_id).'],
    expected: 'As in Zoho: a light agent cannot be added to a team; saving the team with a light agent is refused.',
    actual: 'Team "QA AC Light Team" created (201) with member_user_ids = [the light agent]; a ticket assigned to the team (200). Assigning the same light agent as owner is refused (422 "not an active agent of the ticket\'s department").',
    zoho: 'Checked live 17 Nov: test agent 1 switched to Light Agent; POST teams with agents [agent 1] → 422 INVALID_DATA "/agents" invalid; the same call with a full agent (agent 2) → 200. Zoho help also says light agents cannot be added to teams.' },
  'AC-G5': { title: 'Access | Ticket access cannot be set per agent (all department tickets / own + unassigned / own + team + unassigned)', priority: 'medium', labels: ['Access Control', 'Teams & Agents'], img: 'AC-G5-per-agent-access-vs-zoho.png',
    summary: 'Which tickets an agent sees can only be set for the whole tenant (Setup › Ticket Access: Private, Public Read Only, Public) plus roles. There is no per-agent choice, so one agent cannot be limited to their own (and unassigned) tickets while the rest of the department sees every ticket.',
    steps: ['Open Setup › Agents › an agent: look for a ticket-access choice for that agent.', 'Open Setup › Ticket Access: the data-sharing level applies to all agents.', 'Try to limit one Customer Support agent to own + unassigned tickets while the other Customer Support agents keep seeing all Customer Support tickets.'],
    expected: 'As in Zoho: each agent has a ticket access type — all tickets of their departments, own + unassigned, or own + team + unassigned — independent of the other agents.',
    actual: 'No per-agent setting. The only levers are the tenant-wide data-sharing level and the role hierarchy, which affect every agent of that role or the whole tenant.',
    zoho: 'Checked live 17 Nov: agent 2 (AgentPublic) opened and edited agent 1\'s ticket #130 (200). Only agent 2 was switched to AgentPersonal (own + unassigned): GET, edit and comment on #130 → 403. Switched back → 200. Other agents unchanged.' },
  'AC-G6': { title: 'Tickets | A follower keeps getting notifications for a ticket that moved out of their department', priority: 'low', labels: ['Tickets', 'Access Control'], img: 'AC-G6-follower-after-move-vs-zoho.png',
    summary: 'When a followed ticket is moved to a department the follower is not in, the follower stays on the followers list and keeps getting bell notifications with the ticket number and subject, although they can no longer open the ticket.',
    steps: ['Agent C (Customer Support only) follows a Customer Support ticket (#4860).', 'The owner moves it to Sales (⋮ › Move), then adds a comment.', 'Check the ticket\'s followers and agent C\'s bell; agent C opens the ticket.'],
    expected: 'As in Zoho: an agent who loses access is removed from the followers and gets no further updates for that ticket.',
    actual: 'GET /desk/tickets/{id}/followers still returns agent C. Agent C\'s bell shows "Ticket #4860 moved to Sales: QA AC2 R3" and then "New comment on ticket #4860: QA AC2 R3". Opening the ticket: record 403, /desk/tickets 404, page "This ticket is not available".',
    zoho: 'Checked live 17 Nov: test agent 2 (TechEgySolutions only) followed a ticket (addFollowers 204, followers = [agent 2]); after the admin moved it to Tech the followers list was empty.' },
  'AC-B1': { title: 'Agents | The agent page shows raw text keys in "Tickets owned"', priority: 'low', labels: ['Teams & Agents'], img: 'AC-B1-agent-raw-keys.png',
    summary: 'On Setup › Agents › an agent › Overview, the three "Tickets owned" cards show untranslated keys instead of their labels.',
    steps: ['Open Setup › Agents.', 'Open any agent (here Test User 1).', 'Look at the Overview tab, "Tickets owned".'],
    expected: 'Cards labelled Open, On Hold and Closed (and the Arabic labels in Arabic).',
    actual: 'Cards labelled "records.views.open" (93), "records.views.onHold" (2) and "records.views.closed" (51).',
    zoho: 'Not a parity item: TAVI-only display bug.' },
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
    const html = '<div><h2>Summary</h2><p>' + esc(b.summary) + ' Found in the Desk go-live ticket access run (departments, teams, sharing, moving), NDC-Staging, 17 Nov 2026.</p>'
      + '<h2>Steps</h2><ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>'
      + '<h2>Expected</h2><p>' + esc(b.expected) + '</p><h2>Actual</h2><p>' + esc(b.actual) + '</p>'
      + '<h2>Zoho Desk</h2><p>' + esc(b.zoho) + '</p><h2>Environment</h2><p>' + esc(ENV) + '</p><h2>Attachment</h2><p>Annotated evidence: ' + esc(b.img) + '.</p></div>';
    const labels = b.labels.map(lid).filter(Boolean);
    const cr = await call('POST', '/work-items/', { name: b.title, description_html: html, priority: b.priority, state: BUG, labels, assignees: ASSIGNEES, start_date: '2026-11-17' });
    if (!cr.j || !cr.j.id) { console.log(key, 'create failed', cr.s, JSON.stringify(cr.j).slice(0, 300)); continue; }
    const id = cr.j.id; done[key] = ['NDC-' + cr.j.sequence_id, id]; fs.writeFileSync(OUTF, JSON.stringify(done));
    const mo = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] }); const cy = await call('POST', `/cycles/${SPRINT_16}/cycle-issues/`, { issues: [id] }); const a = await attach(id, b.img);
    console.log(key, '->', done[key][0], 'labels', labels.length + '/' + b.labels.length, 'module', mo.s, 'cycle', cy.s, a);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
