// NDC-2203 → Done with comment + evidence (user, 1 Nov 2026: "move NDC-2203 to done with comment and evidence").
// Usage: node post-2203.js <token.csv>. Token read by the "Secret key" column, never printed. Skips if the ticket is no longer in Ready For Test.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const csv = process.argv[2]; const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3', WI = '2f7deb90-a42b-43ea-b910-41b4cb4d8114'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1'; const IMG = 'NDC-2203-retest-1nov-PASS.png';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 6; i++) { try { const r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } catch (e) { await new Promise(s => setTimeout(s, 5000)); } } return { s: 'retry-exhausted' }; };
const li = a => '<ul>' + a.map(x => `<li>${x}</li>`).join('') + '</ul>';
const html = '<p><strong>Retest PASS — 1 Nov 2026</strong> → moved to Done</p>'
  + '<p>Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge (headless) + API; accounts: Desk Administrator (mahmoud.mahamed1515, not on team Customer Experience Specialists) and Desk Agent (fedelav803, team CES). Every rule guarded by a "QA WF &lt;id&gt; " subject; QA tickets #714–#740.</p>'
  + '<p><strong>Developer\'s 1 Nov fixes — both work:</strong></p>' + li([
    'False "Permission denied." after a save: a Create rule "Assign to team CES" → create answers 201 (was 403), caller_can_read false, ONE ticket #714 with team CES and no owner; no rule with another owner / team only → 201 (#715, #716); Edit rule moving the ticket → PATCH 200 (#717). New Ticket form saved once → "Record saved. A workflow rule moved it out of your view.", back to the list, one ticket. Arabic text present: "تم حفظ السجل. نقلته قاعدة سير عمل إلى خارج نطاق رؤيتك."',
    '"Workflow rule ran" row for Create rules on rule facts: Is Overdue (#719), Execution Time during business hours (#720; outside → not fired #721), Recent Comment, Thread Count, Comment Count, description AND Is Overdue — all fire with the row. Side effect fixed too: "Is Overdue = true" → Assign to team now applies (#727 team CES, no owner, row written).'])
  + '<p><strong>27 Oct fixes — still work:</strong> A4 Private Thread incoming / outgoing / both stored; Is Overdue in Create rules both ways; Email action with a Desk template sends without subject / body (no template → 400); D1 assign to team on create (#714); History "by workflow rule &lt;name&gt;".</p>'
  + '<p><strong>Previously not testable — now verified with temporary set-up (user-approved, all restored):</strong></p>' + li([
    'A5 Happiness Rating: Customer Happiness switched on briefly; the rating email arrived with Bad / Okay / Good; contact rated #736 Bad → "bad only" + "all" fired, "good only" not; #737 Good → "good only" + "all" fired, "bad only" not. Customer Happiness switched off again.',
    'B13 Recalculate Skills: temporary criterion on skill product_expertise (subject contains SKILLQA): #738 got the skill (changed true), #739 not (changed false). Criterion restored to empty.',
    'B14 Reassign based on Skills: online agent with the skill → #740 reassigned to the agent (reassigned true); History "auto assigned by QA WF B14".'])
  + '<p><strong>Still not verifiable on staging:</strong> B3 / B4 Reply / Notify via Instant Messaging (needs a WhatsApp brand in SalesIQ) and B10 Send Cliq Notification (needs a connected Slack / Cliq workspace).</p>'
  + `<p>Evidence: ${IMG} (attached)</p>`;
(async () => {
  const w = await call('GET', `/work-items/${WI}/`); if (w.j?.state !== RFT) { console.log('SKIPPED — not in Ready For Test (state ' + w.s + ')'); return; }
  const c = await call('POST', `/work-items/${WI}/comments/`, { comment_html: html }); const u = await call('PATCH', `/work-items/${WI}/`, { state: DONE });
  console.log(`NDC-2203 comment ${c.s} | Done ${u.s}`);
  const map = path.join(__dirname, '..', 'attach-2203-1nov.json'); fs.writeFileSync(map, JSON.stringify({ dir: path.join(__dirname, '..', 'screenshots', 'annotated').split(path.sep).join('/'), files: { [IMG]: WI } }));
  for (let i = 0; i < 3; i++) { try { console.log(execFileSync('node', [path.join(process.env.USERPROFILE, '.claude/skills/retest-ready-tickets/scripts/plane-attach.js'), csv, 'ahmed-hegazy', PID, map], { encoding: 'utf8' }).trim().replace(/plane_api_\w+/g, '<t>')); break; } catch (e) { console.log('attach retry', i + 1); } }
  const r = await call('GET', `/work-items/${WI}/?expand=state`); const a = await call('GET', `/work-items/${WI}/attachments/`);
  console.log('READ BACK NDC-2203 → ' + r.j?.state?.name + ' | image ' + ((a.j?.results || a.j || []).filter(x => x.attributes?.name === IMG).length));
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<t>')));
