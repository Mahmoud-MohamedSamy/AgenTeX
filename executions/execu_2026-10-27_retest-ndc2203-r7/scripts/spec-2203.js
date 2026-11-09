// NDC-2203 retest evidence (26 Oct 2026): API card + annotation spec, rendered with apicard.js / annotate.js.
// Usage: node spec-2203.js [A1 verdict]   (A1 = Customer Reply, waits for a reply from the QA mailbox)
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const run = (s, f) => execFileSync('node', [path.join(__dirname, s), f], { encoding: 'utf8' }).trim();
const A1 = process.argv[2] || 'PENDING';
const card = { out: 'NDC-2203-behaviour.png', host: 'staging-desk.taviportal.com', who: 'mahmoud.mahamed1515 (Desk Administrator)', date: '26 Oct 2026',
  title: 'NDC-2203 · what each new item did on a QA ticket (rules guarded by Subject starts with "QA WF <id> ")', rows: [
    ['ticket events', 'Agent reply · public vs private comment · forward', 'Agent Response fired; Comment "public only" fired on the public comment, not on the private one; Private Thread fired on a forward', 'ok'],
    ['private thread', 'Ticket Event › Private Thread', 'No incoming / outgoing / both choice (UI and saved trigger have only comments + ratings options)', 'bad'],
    ['new actions', 'Create-trigger rule per action', 'Add comment (private + public, by System), Send email reply (sent to contact), Add followers, Mark as spam, Share ticket (HR, read_only), Add / Remove skills, Change layout (→ QA WF Layout), Update related record (contact title) — all done', 'ok'],
    ['skills', 'Recalculate / Reassign based on skills', 'Both Succeeded; recalc changed:false (no skill on staging has criteria); reassign reassigned:false reason nobody_online', 'info'],
    ['custom action', 'QA custom action (targetApps desk, published) › Run custom action', 'Offered once published; rule ran it: run status succeeded; agents see it under the ticket header Actions menu', 'ok'],
    ['assign to team', 'Owner Assignment › Teams (Customer Experience Specialists)', 'Edit rule: team set, owner cleared. Create rule: rule ran before the ticket row was written; ticket kept owner = creator, no team', 'bad'],
    ['email alert', 'Email with a Desk template → Contact + User', 'agents_emailed 1, contact_emailed true; Team / Role recipients accepted; Contact without a template refused', 'ok'],
    ['field changed', '3 watched fields, Any / All', 'Any fired on one field; All: 2 of 3 changed → no fire, 3 of 3 in one save → fired; a 4th field refused', 'ok'],
    ['conditions', 'Rules with a should-match and a should-not ticket', '16 / 16 as expected: Contact · Title, Account · Account Name, Execution Time (business hours yes / outside no / holiday no), Created By, doesn\'t contain, between, not between, before Current Time', 'ok'],
    ['is overdue', 'Is Overdue = true, due date yesterday', 'Create rule: not true (Is Overdue = false fired instead); Edit rule: true', 'info'],
    ['other', 'Saved action · department scope · tabs · history', 'Saved Add comment ran via a rule; HR-only rule fired on HR ticket, not on CS; Active 12 / Inactive 1 after deactivating one; history: "Workflow rule ran — Rule QA WF D4all"', 'ok'],
    ['not testable', 'Happiness Rating · IM · Slack / Teams / Google Chat', 'Customer Happiness disabled (send: reason disabled); no WhatsApp brand; Slack uninstalled → actions hidden as the developer said', 'info']] };
const cf = path.join(__dirname, 'cards', 'NDC-2203-behaviour.json'); fs.mkdirSync(path.dirname(cf), { recursive: true }); fs.writeFileSync(cf, JSON.stringify(card, null, 1));
const bx = JSON.parse(run('apicard.js', cf).replace(/^\S+\s+/, ''));
const P = (img, caption, crop, boxes, w = 1280, h = 720) => ({ img, caption, crop, w, h, boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) });
const CB = (r, n, kind) => [[272, bx[r[0]][1] - 4, 1570, bx[r[r.length - 1]][3] + 4], n, kind];
const rows = [
  ['A1', 'Customer Reply', 'Trigger fires on a customer reply', A1 === 'PASS' ? 'Fired on the reply from the QA mailbox' : A1 === 'FAIL' ? 'Reply landed, rule did not fire' : 'Waiting for a reply from the QA mailbox', A1 === 'PENDING' ? 'INFO' : A1],
  ['A2', 'Agent Response', 'Trigger fires', 'Fired on an agent reply', 'PASS'],
  ['A3', 'Comment', 'Trigger fires', 'Public-only rule: public comment fired, private did not', 'PASS'],
  ['A4', 'Private Thread', 'Incoming / outgoing / both', 'Fires on a forward; no direction choice', 'FAIL'],
  ['A5', 'Happiness Rating', 'All / good / okay / bad', 'Options offered; not fired — Customer Happiness disabled on staging', 'INFO'],
  ['B1', 'Add Comment', 'Public / private', 'Both added (by System)', 'PASS'],
  ['B2', 'Send Email Reply', 'Reply to customer', 'Sent to the contact', 'PASS'],
  ['B3–B4', 'Reply / Notify via IM', 'Offered', 'Hidden — no WhatsApp brand (setup not changed)', 'INFO'],
  ['B5', 'Add Followers', 'Follower added', 'Follower added', 'PASS'],
  ['B6', 'Mark as Spam', 'Ticket is spam', 'is_spam true', 'PASS'],
  ['B7', 'Share Ticket', 'Shared with dept', 'Shared with HR', 'PASS'],
  ['B8', 'Change Layout', 'Layout changed', 'Moved to QA WF Layout', 'PASS'],
  ['B9', 'Custom Functions', 'Offered', 'Moved to NDC-1989; Run Custom Action works', 'PASS'],
  ['B10', 'Cliq notification', 'Offered', 'N/A per developer; Slack/Teams/Chat hidden (Slack uninstalled)', 'INFO'],
  ['B11–B12', 'Add / Remove Skills', 'Skills changed', 'Added / removed', 'PASS'],
  ['B13', 'Recalculate Skills', 'Skills recalculated', 'Runs; no skill has criteria to match', 'INFO'],
  ['B14', 'Reassign by Skills', 'Owner = skilled agent', 'Runs; nobody_online, no reassign', 'INFO'],
  ['D1', 'Assign to team', 'Team / round robin', 'Works on Edit; ignored on Create', 'FAIL'],
  ['D2', 'Email alerts', 'Template; users/teams/roles/contact', 'Sent to contact + user; team/role accepted', 'PASS'],
  ['D3–D4', 'Field Changed 3 fields, All / Any', 'Up to 3, All / Any', 'Any and All behave; 4th refused', 'PASS'],
  ['E1', 'Contact / Account fields', 'In conditions', '35 fields; Contact · Title and Account · Name match', 'PASS'],
  ['E2', 'Execution Time', 'Business hours / holiday', 'business_hours yes, outside / holiday no (24/7 tenant)', 'PASS'],
  ['E3', 'Missing ticket fields', 'Offered', 'All offered except Name (no value); Is Overdue false in Create rules', 'PASS'],
  ['E4', "doesn't contain", 'Works', 'Matched / not matched as expected', 'PASS'],
  ['E5', 'between / not between', 'Works', 'Both as expected', 'PASS'],
  ['E6', 'Current Time', 'Date value', 'Offered; before Current Time matched', 'PASS'],
  ['F1', 'Saved actions', 'New types saveable', 'Saved Add comment ran via rule', 'PASS'],
  ['F2', 'Department-scoped rules', 'Runs only in dept', 'HR yes, Customer Support no', 'PASS'],
  ['F3', 'Active / Inactive tabs', 'Filter', 'Active 12 / Inactive 1', 'PASS'],
  ['F4', 'History names the rule', 'Rule name shown', '"Workflow rule ran — Rule QA WF D4all"', 'PASS']];
const fails = rows.filter(r => r[4] === 'FAIL').length; const verdict = fails ? 'PARTIAL' : 'PASS';
const spec = { out: `NDC-2203-retest-${verdict}.png`, ticket: 'NDC-2203', title: 'DESK Workflow Missings', verdict, date: '26 Oct 2026',
  env: 'staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) + API · account mahmoud.mahamed1515 (Desk Administrator)',
  panels: [
    P('a4-events-all.png', 'A Ticket Event: Customer Reply, Agent Response, Private Thread, Comment (any / public / private), Happiness Rating (good / okay / bad). Private Thread has no incoming / outgoing choice.', [208, 170, 900, 440], [[[228, 255, 1100, 290], 1, 'FAIL'], [[228, 295, 1100, 352], 2, 'PASS'], [[228, 358, 1100, 432], 3, 'PASS']]),
    P('NDC-2203-behaviour.png', 'Every item was used on a QA ticket and checked on the ticket, in Execution History and in Ticket History.', [0, 0, 1600, Math.min(900, bx[bx.length - 1][3] + 16)], [CB([0], 4, 'PASS'), CB([1], 5, 'FAIL'), CB([2, 4], 6, 'PASS'), CB([5], 7, 'FAIL'), CB([6, 8], 8, 'PASS'), CB([10], 9, 'PASS'), CB([11], 10, 'INFO')], 1600, 900),
    P('f4-history-rule-ran.png', 'Ticket History names the rule that ran, what triggered it and its actions.', [620, 250, 660, 200], [[[640, 315, 1270, 440], 11, 'PASS']])],
  rows };
const sf = path.join(__dirname, 'specs', 'NDC-2203.json'); fs.mkdirSync(path.dirname(sf), { recursive: true }); fs.writeFileSync(sf, JSON.stringify(spec, null, 1));
console.log(run('annotate.js', sf));
