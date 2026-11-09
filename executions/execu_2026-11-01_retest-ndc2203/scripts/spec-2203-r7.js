// NDC-2203 retest round 7 evidence (27 Oct 2026): API card + annotation spec, rendered with apicard.js / annotate.js.
// Usage: node spec-2203-r7.js [A1 verdict PASS|FAIL]   (A1 = Customer Reply; waits for a reply from the QA Gmail)
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const run = (s, f) => execFileSync('node', [path.join(__dirname, s), f], { encoding: 'utf8' }).trim();
const A1 = process.argv[2] || 'PENDING';
const card = { out: 'NDC-2203-r7-behaviour.png', host: 'staging-desk.taviportal.com', who: 'mahmoud.mahamed1515 (Desk Administrator) + fedelav803 (Desk Agent)', date: '27 Oct 2026',
  title: 'NDC-2203 round 7 · the five fixes used on QA tickets (rules guarded by Subject starts with "QA WF <id> ")', rows: [
    ['A4 private thread', 'Rules Incoming / Outgoing / Both on #592; forward to a Gmail address (not the contact), then a reply from it', 'Forward: Outgoing + Both fired, Incoming not. Reply: filed private (private_thread_answer), Incoming + Both fired, Outgoing not; ticket stays Open, Customer Responded not set', 'ok'],
    ['D1 team on Create', 'Create rule Owner Assignment › Team (Customer Experience Specialists); tickets by API, New Ticket form, and an agent with owner = self', '#605, #616, #617, #618: team set, owner null at create; #618 then round robin ("sequence") gave it to a team agent. Edit rule #650: owner cleared, team set', 'ok'],
    ['Is Overdue on Create', 'Create rules Is Overdue = true / = false; due yesterday and due in 5 days', 'Yesterday: true fired, false not. +5 days: false fired, true not', 'ok'],
    ['History by rule', 'History tab of #598 (Share), #594 (Add comment), #597 (Mark as spam), EN and AR', '"by workflow rule QA WF B07"; "Workflow rule ran · Actions Share ticket"; AR "بواسطة قاعدة سير العمل" / "مشاركة التذكرة"', 'ok'],
    ['Email with template', 'Rule and saved action: Desk template, no subject / body', '201; sent: agents_emailed 1, contact_emailed true (#612, #615). Without a template, subject + body still required (400)', 'ok'],
    ['regression', 'A2, A3, D3, D4, E1–E6, F1–F3, B1–B15 on new QA tickets', 'All as in round 5 (match / no-match pairs correct); 4th watched field refused', 'ok'],
    ['new: false 403', 'Save a ticket that a rule moves to a team the saver is not in (form + API, create and edit)', '403 "Permission denied." although the ticket is created / the edit is saved (#616, #617, #605, #650)', 'bad'],
    ['new: history gaps', 'Rules on Execution Time / Is Overdue; Department changed row', 'No "Workflow rule ran" row (comment is still "by workflow rule"); Department shows the raw id 7e1ac409-…', 'info']] };
const cf = path.join(__dirname, 'cards', 'NDC-2203-r7-behaviour.json'); fs.mkdirSync(path.dirname(cf), { recursive: true }); fs.writeFileSync(cf, JSON.stringify(card, null, 1));
const bx = JSON.parse(run('apicard.js', cf).replace(/^\S+\s+/, ''));
const P = (img, caption, crop, boxes, w = 1280, h = 720) => ({ img, caption, crop, w, h, boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) });
const CB = (r, n, kind) => [[272, bx[r[0]][1] - 4, 1570, bx[r[r.length - 1]][3] + 4], n, kind];
const rows = [
  ['A1', 'Customer Reply', 'Fires on a customer reply', A1 === 'PASS' ? 'Fired on the reply from the QA Gmail (#648)' : A1 === 'FAIL' ? 'Reply landed, rule did not fire' : 'Waiting for a reply from the QA Gmail (#648)', A1 === 'PENDING' ? 'INFO' : A1],
  ['A4', 'Private Thread: incoming / outgoing / both', 'Direction choice works', 'Outgoing fires on a forward, Incoming on the third party\'s answer, Both on each; answer stays private, no Customer Responded', 'PASS'],
  ['D1', 'Assign to team (Create rule)', 'Ticket goes to the team, owner cleared', 'Team set, owner null on API, form and agent-created tickets; round robin then assigns', 'PASS'],
  ['D1', 'Assign to team (Edit rule)', 'Unchanged', 'Owner cleared, team set (#650)', 'PASS'],
  ['E3', 'Is Overdue in Create rules', 'true for a past due date', 'true fired for yesterday, false for +5 days', 'PASS'],
  ['F4', 'History names the rule', '"by workflow rule <name>", actions as words, EN + AR', 'Share ticket / Add comment / Mark as spam / Reply sent by workflow rule QA WF …; Arabic the same', 'PASS'],
  ['D2', 'Email with a Desk template', 'Saves without subject / body', 'Rule + saved action saved and sent (contact_emailed true)', 'PASS'],
  ['—', 'On Edit rule on a new ticket', 'Developer: not a bug', 'New ticket: no fire in 20 s; real edit: fired', 'PASS'],
  ['—', 'Regression of the round 5 passes', 'Still pass', 'A2, A3, D3, D4, E1–E6, F1–F3, B1–B15 as before', 'PASS'],
  ['A5 B3 B4 B10 B13 B14', 'Not testable on staging', 'Developer: needs setup staging lacks', 'Same as round 5 (setup not changed)', 'INFO'],
  ['B9', 'Run Custom Action', '—', 'Not re-run: no custom action / API source on staging now (NDC-1989)', 'INFO'],
  ['new', 'Saving moves the ticket out of my reach', 'Saved, no error', '403 "Permission denied." toast although saved → duplicates likely', 'FAIL'],
  ['new', 'History rows', 'Rule-ran row, department name', 'Missing for Execution Time / Is Overdue rules; raw department id', 'INFO']];
const spec = { out: 'NDC-2203-retest-r7.png', ticket: 'NDC-2203', title: 'DESK Workflow Missings — round 7', verdict: 'PASS', label: A1 === 'PENDING' ? 'RETEST PASS · A1 waiting' : 'RETEST ' + (A1 === 'FAIL' ? 'PARTIAL' : 'PASS'), date: '27 Oct 2026',
  env: 'staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) + API · mahmoud.mahamed1515 (Desk Administrator), fedelav803 (Desk Agent)',
  panels: [
    P('a4-private-thread-options.png', 'A Ticket Event › Private Thread now offers Incoming and outgoing / Incoming / Outgoing.', [208, 236, 900, 400], [[[228, 572, 700, 632], 1, 'PASS']]),
    P('NDC-2203-r7-behaviour.png', 'Each fix used on a QA ticket and checked on the ticket, Execution History and Ticket History.', [0, 0, 1600, Math.min(900, bx[bx.length - 1][3] + 16)], [CB([0], 2, 'PASS'), CB([1], 3, 'PASS'), CB([2], 4, 'PASS'), CB([3], 5, 'PASS'), CB([4], 6, 'PASS'), CB([5], 7, 'PASS'), CB([6], 8, 'FAIL'), CB([7], 9, 'INFO')], 1600, 900),
    P('f4-history-b07-ruleran.png', 'History of #598: the share and the "Workflow rule ran" row are "by workflow rule QA WF B07"; action "Share ticket".', [664, 230, 616, 410], [[[700, 505, 1000, 628], 10, 'PASS']]),
    P('d1-form-4-after-save.png', 'New Ticket form: "Permission denied." after Save, yet tickets #616 / #617 were created on the team.', [664, 400, 616, 310], [[[975, 638, 1258, 696], 11, 'FAIL']])],
  rows };
const sf = path.join(__dirname, 'specs', 'NDC-2203-r7.json'); fs.mkdirSync(path.dirname(sf), { recursive: true }); fs.writeFileSync(sf, JSON.stringify(spec, null, 1));
console.log(run('annotate.js', sf));
