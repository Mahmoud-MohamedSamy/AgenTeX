// Builds access/report.html from access/results.md + annotated images (17 Nov access run)
const fs = require('fs'), path = require('path'); const R = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(R, 'ticketmenu/report.src.html'), 'utf8').split('</style>')[0].replace(/<title>.*?<\/title>/, '<title>Ticket Access vs Zoho</title>') + '</style>';
const md = fs.readFileSync(path.join(R, 'access/results.md'), 'utf8');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>');
const rows = md.split('\n').filter(l => /^\| \d+ \| AC-/.test(l)).map(l => l.split('|').slice(1, -1).map(c => c.trim()));
const cls = v => /^PASS/.test(v) ? 'pass' : /^GAP/.test(v) ? 'fail' : /^(CHECK|DECISION)/.test(v) ? 'known' : 'info';
const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(R, 'evidence/annotated', f)).toString('base64');
const count = k => rows.filter(r => r[2].startsWith(k)).length;
const html = css + `
<div class="wrap">
<header>
  <div class="eyebrow">Desk go-live · ticket access · 17 Nov 2026</div>
  <h1>Who sees which ticket: departments, teams, sharing and moving vs Zoho</h1>
  <p class="meta">TAVI staging-desk, NDC-Staging, 5 accounts (owner, admin B, agent C, Test User 1 as Agent / custom / Light, Supervisor E) · Zoho Desk live in test org TechEgySolutions (admin, agent 2) · all test data deleted after, settings restored.</p>
  <div class="strip">
    <div class="stat pass"><b>${count('PASS')}</b><span>pass</span></div>
    <div class="stat fail"><b>${count('GAP') + 1}</b><span>gaps vs Zoho</span></div>
    <div class="stat fail"><b>1</b><span>TAVI bug</span></div>
    <div class="stat known"><b>${count('DECISION')}</b><span>your decision</span></div>
    <div class="stat info"><b>${count('INFO') + count('BLOCKED')}</b><span>info / blocked</span></div>
  </div>
</header>
<section>
  <h2>What holds</h2>
  <p>Department walls hold in the list, by URL and on every ticket sub-API. Private sharing follows the role hierarchy, teams and the View-unassigned permission; Public Read Only and Public behave as described; profile permissions (move, share, assign, every-department access, light agent) are enforced. Sharing levels Full / Restricted / Read-only match Zoho, including "status and owner stay with the source department"; TAVI refuses those with a clear message where Zoho silently ignores them. Move resets the ticket like Zoho, and an agent outside the new department loses access. Two things looked like bugs but Zoho does the same: the new-ticket form offers every department, and an agent can create or move a ticket into a department they are not in.</p>
</section>
<section>
  <h2>Gaps and bug (filed 17 Nov: NDC-3095 to NDC-3100; AC-08 waits for a decision)</h2>
  <article class="finding"><div class="head"><span class="id">AC-G1 · NDC-3095</span><h3>A ticket cannot be moved from the ticket list</h3><span class="pill fail">Gap · Low · Zoho live</span></div>
    <p>Zoho's All Departments list shows each ticket's department; clicking it opens "Move Department". TAVI rows have no department and moving is only ⋮ › Move on the ticket page. Zoho has no Move in the mass-selection bar, so bulk Move is not a gap.</p>
    <figure><img src="${img('AC-G1-list-move-vs-zoho.png')}" alt="TAVI list rows without department next to Zoho list with Move Department picker"><figcaption>AC-G1 · TAVI left, Zoho right</figcaption></figure></article>
  <article class="finding"><div class="head"><span class="id">AC-G2 · NDC-3096</span><h3>No message when another agent moves the ticket you have open</h3><span class="pill fail">Gap · Low · Zoho live</span></div>
    <p>Zoho: "&lt;agent&gt; has moved this ticket from TechEgySolutions to Tech department. Would you like to stay on this ticket?" TAVI swaps the page to "This ticket is not available. It was deleted, or it is outside the records you are allowed to see."</p>
    <figure><img src="${img('AC-G2-move-prompt-vs-zoho.png')}" alt="TAVI not-available page next to Zoho moved-ticket prompt"><figcaption>AC-G2 · TAVI left, Zoho right</figcaption></figure></article>
  <article class="finding"><div class="head"><span class="id">AC-G5 · NDC-3098</span><h3>No per-agent ticket access level</h3><span class="pill fail">Gap · Medium · Zoho live</span></div>
    <p>Zoho sets access per agent: all department tickets, own + unassigned, or own + team + unassigned. Live: agent 2 switched to "own + unassigned" got 403 on agent 1's ticket, and 200 again when switched back. TAVI only has the tenant-wide level plus roles, so one agent cannot be limited while the rest see the whole department.</p>
    <figure><img src="${img('AC-G5-per-agent-access-vs-zoho.png')}" alt="AC-G5 annotated evidence"><figcaption>AC-G5 · TAVI left, Zoho right</figcaption></figure></article>
  <article class="finding"><div class="head"><span class="id">AC-G6 · NDC-3099</span><h3>A follower keeps getting notifications for a ticket they can no longer open</h3><span class="pill fail">Gap · Low · Zoho live</span></div>
    <p>Agent C followed a Customer Support ticket; the owner moved it to Sales. C stayed on the follower list and got bell items "Ticket #4860 moved to Sales: QA AC2 R3" and "New comment on ticket #4860: QA AC2 R3" (subject and number, no body), though the ticket page refuses C. Zoho live: agent 2 followed a ticket; after it was moved to a department agent 2 is not in, the followers list was empty.</p>
    <figure><img src="${img('AC-G6-follower-after-move-vs-zoho.png')}" alt="AC-G6 annotated evidence"><figcaption>AC-G6 · TAVI left, Zoho right</figcaption></figure></article>
  <article class="finding"><div class="head"><span class="id">AC-G3 · NDC-3097</span><h3>A light agent can be put in a team and get team tickets</h3><span class="pill fail">Gap · Low · Zoho live</span></div>
    <p>TAVI created "QA AC Light Team" with the light agent as member (201) and a ticket was assigned to it (200). Zoho live: with agent 1 made a Light Agent, creating a team with them answers 422 ("/agents" invalid); the same call with a full agent answers 200.</p>
    <figure><img src="${img('AC-G3-light-agent-team-vs-zoho.png')}" alt="AC-G3 annotated evidence"><figcaption>AC-G3 · TAVI left, Zoho right</figcaption></figure></article>
  <article class="finding"><div class="head"><span class="id">AC-08</span><h3>Peers can read but not edit each other's tickets</h3><span class="pill known">Decision · Zoho live</span></div>
    <p>TAVI: with "Share data with peers" on the Manager role, D and E read each other's tickets, a field edit is refused (403) and a private comment is allowed; the Ticket Access page says "read — not edit". Zoho live (both agents Custom access, role Manager, tickets Private): peers off → 403; peers on → view, edit (priority changed) and comment all 200. Keep TAVI's read-only design, or match Zoho?</p>
    <figure><img src="${img('AC-08-peers-edit-vs-zoho.png')}" alt="AC-08 annotated evidence"><figcaption>AC-08 · TAVI left, Zoho right</figcaption></figure></article>
  <article class="finding"><div class="head"><span class="id">AC-B1 · NDC-3100</span><h3>Agent page shows raw keys in "Tickets owned"</h3><span class="pill fail">Bug · Low · TAVI</span></div>
    <p>Setup › Agents › Test User 1 › Overview: <code>records.views.open 93</code>, <code>records.views.onHold 2</code>, <code>records.views.closed 51</code>.</p>
    <figure><img src="${img('AC-B1-agent-raw-keys.png')}" alt="AC-B1 annotated evidence"><figcaption>AC-B1 · TAVI</figcaption></figure></article>
</section>
<section>
  <h2>Recheck results (afternoon)</h2>
  <ul>
    <li><b>AC-22</b> Restricted share now behaves the same every time: internal and outside forward accepted, customer reply refused, private comment allowed. Zoho's Restricted forward also accepts an outside address. The 11:46 refusal did not come back.</li>
    <li><b>AC-G4 withdrawn.</b> TAVI does have Department Notifications › "Receiving a shared ticket" (off by default, as in Zoho). Switched on, agent C got "Ticket #4859 shared with Customer Support" in the bell. The first read only covered the top of the settings page.</li>
    <li><b>NDC-3073</b> (spam ticket still replyable) looks fixed: spam removes the share and comment, reply and re-share are refused with "Mark it as Not Spam first."</li>
    <li><b>NDC-3059</b> (view-only member can edit) did not reproduce: a view-only member can only view and add a private comment.</li>
    <li><b>Still blocked:</b> AC-36 (no SLA attaches to Marketing tickets on staging, so the SLA reset on move could not be seen) and AC-47 (needs a Help Center customer login).</li>
  </ul>
  <h2>Observations</h2>
  <ul>
    <li>Moving a ticket into a department with its own layout has no layout step: the ticket keeps the shared Standard layout and gets the target department's ticket number (#4862).</li>
    <li>Profile, override and permission changes reach the API only when the agent's session token refreshes (5 to 10 min); until then the old rights apply (a ticket was moved with Move already denied).</li>
    <li>After switching the data-sharing level, ticket pages answered "not found" for about a minute.</li>
    <li>A profile cannot be removed from a user (DELETE answers PROFILE_NOT_ASSIGNED); only "replace" works, and the agent page has no profile field.</li>
    <li>Move, assign and share errors show raw ids, e.g. "The ticket is already in department 2a73bbc0-…".</li>
  </ul>
</section>
<section>
  <h2>All 48 cases</h2>
  <div class="tbl"><table><thead><tr><th>Id</th><th>Result</th><th>TAVI</th><th>Zoho</th></tr></thead><tbody>
  ${rows.map(r => `<tr><td>${r[1]}</td><td><span class="pill ${cls(r[2])}">${esc(r[2])}</span></td><td>${esc(r[3])}</td><td>${esc(r[4])}</td></tr>`).join('\n  ')}
  </tbody></table></div>
</section>
<section>
  <h2>Cleanup</h2>
  <p>TAVI: 17 tickets deleted and purged, 2 teams and 1 profile deleted, Test User 1 back to Desk Supervisor, Customer Support members restored, no overrides left, ticket access back to Private / Agent's departments / no peers. Zoho: agent 2, CEO peers and data sharing restored; tickets #125 to #133 and the contact purged. Afternoon recheck: TAVI 8 tickets and a contact purged, 2 SLA policies deleted, D out of Customer Support again, team assignment on and the shared-ticket rule off; Zoho agents, Manager peers and data sharing restored, test tickets, contact and control team deleted. A few test replies and forwards went to the QA mailbox and example.com.</p>
</section>
</div>`;
fs.writeFileSync(path.join(R, 'access/report.html'), html); console.log('report', html.length);
