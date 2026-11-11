// Builds report-email-e18-bugs-blocked.html: 2 drafted bugs (EM-08, E18-03) with annotated images + blocked cases.
// Source: execu_2026-11-08_retest-ndc2275/report-checklist-2026-11-10.html (run by another session, 10 Nov 2026).
const fs = require('fs'); const D = __dirname + '/..';
const img = f => 'data:image/png;base64,' + fs.readFileSync(D + '/evidence/annotated/' + f).toString('base64');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const bugs = [
  { id: 'EM-08', type: 'Bug', prio: 'Medium', title: 'Email setup says "Mail is arriving" even when customer mail does not reach Desk',
    summary: 'The Email Overview page shows a green "Mail is arriving" status and "4 of 4 done", but it has no way of knowing whether mail actually arrives. On 9 Nov a customer reply never reached Desk while the page showed exactly this status, so an admin is told everything is fine when it is not.',
    steps: ['Go to Setup › Channels › Email › Overview.', 'Look at the status card at the top.', 'From a customer mailbox, reply to an email that an agent sent from a Desk ticket.', 'Wait 40 minutes and open the ticket in Desk.', 'Go back to the Email Overview page.'],
    expected: ['If customer mail is not arriving, the page warns about it.', 'The page shows when the last email was received, so the admin can see whether mail really arrives.'],
    actual: ['The page shows a green "Mail is arriving. Customers can write in, and replies go out. Nothing is waiting on you." and "4 of 4 done".', 'There is no time of the last email received anywhere on the page.', 'The same card says "The mail provider did not answer when we checked taviportal.com. This says nothing about whether mail is arriving."', 'The customer reply (sent 9 Nov 3:30 PM Cairo) never appeared on the ticket or as a new ticket, while the status stayed green.'],
    env: 'TAVI Desk staging-desk.taviportal.com (NDC-Staging), owner account, Edge; Overview seen 9 Nov and 10 Nov 2026 09:31 UTC; receiving address customer-support@help-staging.anyware.software; customer mailbox mmohamed@anyware.software.',
    note: 'The other session drafted this as plane-draft-mail.html (not posted). The receiving cases EM-01/02/04/05 are still blocked; this bug stands on its own because the page shows the same status whether mail arrives or not.',
    image: 'EM-08-email-overview-says-mail-arriving-vs-customer-mailbox.png' },
  { id: 'E18-03', type: 'Gap', prio: 'Low', title: 'Round robin backlog skips an old ticket without saying why',
    summary: 'The 30-day rule works: a backlog ticket with no customer reply in the last 30 days is not assigned. But nothing tells the agent or admin why. The ticket just stays unassigned in the backlog with no entry in its History, while newer tickets are assigned within seconds.',
    steps: ['In a department with a round robin rule, turn on "Assign tickets to offline agents" and set the department threshold to 1, so new tickets wait in the backlog.', 'Create a new ticket that matches the rule; it waits unassigned.', 'Reopen an old ticket (created more than 30 days ago, no customer reply), move it to the same department and clear its owner; it waits unassigned.', 'Turn the department threshold off and turn on "Assign backlogs".', 'After a few minutes, open both tickets and look at the owner and the History tab.'],
    expected: ['The new ticket is assigned from the backlog.', 'The old ticket is left out (30-day rule), and its History, or the backlog view, says why, for example "Not assigned: no customer reply in the last 30 days".'],
    actual: ['The new ticket (#2453) was assigned to Test User 1 13 seconds after release; its History says "Taken from the backlog".', 'The old ticket (#1) was still unassigned 32 minutes later.', 'Its History shows only the reopen, move and owner change; nothing says it was skipped or why.', 'Same result on 9 Nov (twice) and 10 Nov.'],
    env: 'TAVI Desk staging-desk.taviportal.com (NDC-Staging), owner account; QA AS6 Dept B, rule "QA E18 manual"; 10 Nov 2026 10:02–10:36 UTC.',
    note: 'The rule itself passes. Drafted as a gap (missing explanation), not a defect. Zoho Desk was not checked live for a skip reason.',
    image: 'E18-03-backlog-skips-old-ticket-without-reason.png' }];
const blocked = [
  ['EM-01', 'New email from an outside address creates a ticket', 'Needs a new email sent from an outside mailbox (Gmail or Outlook). Claude cannot send mail from a real mailbox.', 'Send an email with subject "QA EM-01 new email Gmail <time>" from your Gmail to customer-support@help-staging.anyware.software, then tell Claude the time. Claude checks TAVI for the new ticket.'],
  ['EM-02', 'New email from the company domain creates a ticket', 'Same reason; needs an email from mmohamed@anyware.software.', 'Send "QA EM-02 new email anyware <time>" from mmohamed@anyware.software to the same address and tell Claude the time.'],
  ['EM-04', 'Customer reply attaches to the same ticket (the original bug)', 'Needs a customer reply to a ticket that started from Gmail; that ticket only exists after EM-01. On 9 Nov a reply from mmohamed@ never arrived (watched 42 min).', 'Do EM-01 first. When the agent reply reaches Gmail, reply to it and tell Claude the time. Expected: the reply shows on the same ticket as an incoming message.'],
  ['EM-05', 'Same as EM-04, from the company mailbox', 'The agent half is done (reply sent to mmohamed@ on #2382). The customer half needs a reply from that mailbox.', 'In mmohamed@anyware.software, reply to "Re: QA EM-03 agent reply 11:40 Cairo" and tell Claude the time. #2382 is kept open for this. Expected: your text on #2382, no new ticket.'],
  ['EM-06', 'Second receiving address (Tech)', 'The Tech address exists in Setup, but a test email has to be sent to it from outside.', 'Send "QA EM-06 Tech <time>" to tech@help-staging.anyware.software and tell Claude the time. Expected: a new ticket in Tech.'],
  ['EM-09', 'No bounce reached the customer', 'Needs a look inside the customer mailboxes; TAVI cannot see them.', 'After EM-01/02/04/05, check Inbox and Spam in both mailboxes for "Undeliverable" or "Delivery failed" and tell Claude what you see.'],
  ['E18-04', 'A customer reply makes the old ticket assignable', 'Depends on incoming customer replies (EM-04/EM-05), which are blocked.', 'Do EM-05 first (or reply to ticket #1 "Check-in" from mmohamed@). Claude then repeats the backlog release and checks that #1 is assigned.']];
const li = a => a.map(x => '<li>' + esc(x) + '</li>').join('');
const css = `:root{--bg:#f6f7f9;--card:#fff;--text:#1c2230;--muted:#5d6678;--line:#e2e5eb;--bug:#b42318;--bug-bg:#fdecea;--gap:#a15c00;--gap-bg:#fff3df;--blk:#4b5563;--blk-bg:#eceff3}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12151b;--card:#1b1f27;--text:#e6e9ef;--muted:#9aa3b2;--line:#2c323d;--bug:#ff8a7e;--bug-bg:#3d1c1a;--gap:#f0b252;--gap-bg:#3a2c12;--blk:#b6bdc9;--blk-bg:#262b35}}
:root[data-theme="dark"]{--bg:#12151b;--card:#1b1f27;--text:#e6e9ef;--muted:#9aa3b2;--line:#2c323d;--bug:#ff8a7e;--bug-bg:#3d1c1a;--gap:#f0b252;--gap-bg:#3a2c12;--blk:#b6bdc9;--blk-bg:#262b35}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:1100px;margin:0 auto;padding:28px 16px 60px}h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:36px 0 12px}h3{font-size:17px;margin:8px 0 0}
.sub{color:var(--muted);margin:0 0 20px}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px;margin-bottom:18px}
.pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600;margin-right:6px}.bug{color:var(--bug);background:var(--bug-bg)}.gap{color:var(--gap);background:var(--gap-bg)}.blk{color:var(--blk);background:var(--blk-bg)}
.lbl{font-weight:600;margin:14px 0 4px}ul,ol{margin:4px 0;padding-left:22px}li{margin:3px 0}.muted{color:var(--muted)}p{margin:0}
img{width:100%;height:auto;border:1px solid var(--line);border-radius:8px;margin-top:10px}
.tw{overflow-x:auto}table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line)}th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
code{font-size:13px;background:var(--blk-bg);padding:1px 5px;border-radius:4px}`;
const bugHtml = b => `<div class="card"><span class="pill ${b.type === 'Bug' ? 'bug' : 'gap'}">${b.type}</span><span class="pill blk">${b.prio}</span><span class="muted">${b.id}</span>
<h3>${esc(b.title)}</h3>
<div class="lbl">Summary</div><p>${esc(b.summary)}</p>
<div class="lbl">Steps to reproduce</div><ol>${li(b.steps)}</ol>
<div class="lbl">Expected result</div><ul>${li(b.expected)}</ul>
<div class="lbl">Actual result</div><ul>${li(b.actual)}</ul>
<div class="lbl">Environment</div><p>${esc(b.env)}</p>
<div class="lbl">Note</div><p class="muted">${esc(b.note)}</p>
<div class="lbl">Annotated evidence</div><img src="${img(b.image)}" alt="${esc(b.id)} annotated evidence"><p class="muted">evidence/annotated/${b.image}</p></div>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email and Backlog Bugs</title><style>${css}</style></head><body><main>
<h1>Email channel and 30-day rule: bugs and blocked cases</h1>
<p class="sub">From the 10 Nov 2026 checklist run on NDC-Staging (source: <code>executions/execu_2026-11-08_retest-ndc2275/report-checklist-2026-11-10.html</code>). Drafts only — nothing is filed in Plane.</p>
<h2>Drafted bugs (2)</h2>${bugs.map(bugHtml).join('')}
<h2>Blocked cases (7)</h2>
<p class="muted">All seven need a real customer mailbox: an email sent from it, a reply from it, or a look inside it. Claude has no access to those mailboxes.</p>
<div class="tw"><table><tr><th>Case</th><th>What it tests</th><th>Why it is blocked</th><th>To start it</th></tr>
${blocked.map(r => `<tr><td><span class="pill blk">${r[0]}</span></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</table></div>
<p class="muted" style="margin-top:16px">Suggested order: EM-05 (one reply, ticket already waiting) → EM-01 → EM-04 → EM-02, EM-06 → EM-09 → E18-04. Also still to confirm: whether "Re: QA EM-03 agent reply 11:40 Cairo" reached the mmohamed@ inbox (EM-03 delivery).</p>
</main></body></html>`;
fs.writeFileSync(D + '/report-email-e18-bugs-blocked.html', html); console.log('ok', html.length);
