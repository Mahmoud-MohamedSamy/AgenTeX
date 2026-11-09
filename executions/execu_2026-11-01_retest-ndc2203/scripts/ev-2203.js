// NDC-2203 retest 1 Nov 2026: API card + annotated evidence (screen: the "Record saved…" message after the New Ticket form).
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const RAW = path.join(__dirname, '..', 'screenshots', 'raw');
const card = { out: 'NDC-2203-1nov-api.png', date: '1 Nov 2026', host: 'staging-desk.taviportal.com (tenant NDC-Staging)', who: 'mahmoud.mahamed1515 (Desk Administrator, not on team CES); fedelav803 (Desk Agent, team CES)',
  title: 'NDC-2203 · 1 Nov fixes, regression of the 27 Oct fixes, and A5 / B13 / B14 with temporary set-up (QA WF rules, QA tickets #714–#740)',
  rows: [
    ['Fix 1 · Create rule → team', 'Admin creates a ticket; rule "Assign to team CES" moves it out of view', '201 (was 403), caller_can_read false; agent sees ONE ticket #714, team CES, no owner', 'ok'],
    ['Fix 1 · no rule, other owner', 'Admin creates with owner = another agent / team + no owner', '201 / 201 (were 403); one ticket each (#715, #716)', 'ok'],
    ['Fix 1 · Edit rule → team', 'Admin edits own ticket; Edit rule moves it to team CES', 'PATCH 200 (was 403); #717 team CES, no owner', 'ok'],
    ['Fix 1 · Arabic message', 'Desk web app text savedOutOfView (ar)', '"تم حفظ السجل. نقلته قاعدة سير عمل إلى خارج نطاق رؤيتك."', 'ok'],
    ['Fix 2 · Is Overdue', 'Create rule "Is Overdue = true", ticket due yesterday', 'Fired + "Workflow rule ran" row (#719) — row was missing', 'ok'],
    ['Fix 2 · Execution Time', 'Create rules during / outside business hours', 'During: fired + row (#720); outside: not fired (#721)', 'ok'],
    ['Fix 2 · other facts', 'Recent Comment, Thread Count, Comment Count, description AND Is Overdue, Status', 'All fired with the row (#722, #725, Y5, Y6, Y8)', 'ok'],
    ['Fix 2 · side effect', 'Create rule "Is Overdue = true" → Assign to team CES', 'Applied: #727 team CES, no owner, row written (did nothing before)', 'ok'],
    ['27 Oct fixes', 'A4 directions, Is Overdue both ways, email with a Desk template, D1, "by workflow rule"', 'All still work (stored incoming/outgoing/any; true/false correct; template mail sent; no template/body → 400)', 'ok'],
    ['A5 Happiness Rating trigger', 'Customer Happiness ON briefly (user-approved) → rating email → customer rated #736 Bad, #737 Good', '#736: bad-only + all fired (good-only not); #737: good-only + all fired (bad-only not); setting back OFF', 'ok'],
    ['B13 Recalculate Skills', 'Temporary criterion on skill product_expertise (subject contains SKILLQA)', 'SKILLQA ticket #738: skill added (changed true); plain #739: nothing (changed false); criterion restored to empty', 'ok'],
    ['B14 Reassign based on Skills', 'Online agent with the skill; Recalculate + Reassign on #740', 'reassigned true → owner = the agent; History "auto assigned by QA WF B14"', 'ok'],
    ['Still not verifiable', 'B3 / B4 Instant Messaging, B10 Cliq', 'Need a WhatsApp brand in SalesIQ and a connected Slack / Cliq workspace (real external accounts)', 'info'],
  ] };
fs.mkdirSync(path.join(__dirname, 'cards-1nov'), { recursive: true }); const cf = path.join(__dirname, 'cards-1nov', 'NDC-2203-1nov-api.json'); fs.writeFileSync(cf, JSON.stringify(card, null, 1));
const res = execFileSync('node', [path.join(__dirname, 'apicard.js'), cf], { encoding: 'utf8' }).trim(); const bx = JSON.parse(res.slice(res.indexOf('[')));
const pf = s => s === 'ok' ? 'PASS' : s === 'bad' ? 'FAIL' : 'INFO';
const spec = { out: 'NDC-2203-retest-1nov-PASS.png', ticket: 'NDC-2203', title: 'DESK Workflow Missings', priority: 'urgent', verdict: 'PASS', label: 'RETEST · PASS (B3/B4/B10 need external accounts)',
  env: 'staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) + API · Desk Administrator (not on team CES) + Desk Agent (team CES)', date: '1 Nov 2026',
  panels: [
    { img: 'a5-rating-email.png', caption: 'A5: the rating email as the contact received it — question and Bad / Okay / Good buttons.', crop: [0, 0, 739, 1150], w: 739, h: 1600, boxes: [{ b: [30, 940, 700, 1110], n: 'A', kind: 'PASS' }] },
    { img: 'z1-en-2-toast.png', caption: 'New Ticket form saved ONCE as the admin with the "Assign to team CES" rule: message, back to the Tickets list, one POST 201.', crop: [900, 760, 700, 140], w: 1600, h: 900, boxes: [{ b: [1157, 811, 1575, 875], n: 1, kind: 'PASS' }] },
    { img: card.out, caption: 'API evidence', crop: [0, 0, 1600, bx[bx.length - 1][3] + 20], w: 1600, h: 900, full: true, boxes: bx.map((b, i) => ({ b: [924, b[1] - 2, 1566, b[3] + 2], n: i + 2, kind: pf(card.rows[i][3]) })) }],
  rows: [['A', 'Screen: rating email (A5)', 'Rating question with options', 'Bad / Okay / Good buttons in the email', 'PASS'], ['1', 'Screen: New Ticket form', 'Saved, clear message, no "Permission denied."', '"Record saved. A workflow rule moved it out of your view." — form closed to the list; one ticket', 'PASS'],
    ...card.rows.map((r, i) => [String(i + 2), r[0], i < 9 ? 'Developer fix works' : i < 12 ? 'Works as described in the ticket' : 'Verifiable', r[2], pf(r[3])])] };
const sf = path.join(__dirname, 'cards-1nov', 'spec-2203.json'); fs.writeFileSync(sf, JSON.stringify(spec, null, 1));
console.log(execFileSync('node', [path.join(__dirname, 'annotate.js'), sf], { encoding: 'utf8' }).trim());
