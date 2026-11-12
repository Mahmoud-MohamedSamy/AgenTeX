// Builds report-workflow-findings.html: only the A4 Workflow rows marked FINDING (12 unique; P18/P25 also count as Z19/Z28).
// Reuses the bug cards and Zoho verdicts from build-workflow-bugs-report.js. Local report; nothing filed in Plane.
const fs = require('fs'), path = require('path');
const { bugs, Z, css, esc, pill, img, SEV, VC } = require('./build-workflow-bugs-report.js');
const D = path.join(__dirname, '..');
const VC2 = { ...VC, 'NOT CHECKED': 'grey', SAME: 'ok' };

// Findings taken from the bugs report (by case), plus the two that only live in the progress report.
const fromBugs = ['WF-02', 'WF-08', 'WF-09', 'WF-10', 'WF-11', 'WF-12', 'WF-13', 'WF-07'].map(id => {
  const b = bugs.find(x => x[0] === id); const z = Z[id];
  return { id: 'FN-' + id.slice(3), bugId: id, cases: b[1], sev: b[2], area: b[3] === 'Security' ? 'Security' : 'Finding', title: b[4], steps: b[5], verdict: z[0], zoho: z[1], expected: z[2], actual: b[7], tImg: b[8], zImg: z[3], note: b[9] };
});
const extra = [
  { id: 'FN-15', bugId: null, cases: 'P18 (= Z19)', sev: 'Low', area: 'Finding', title: 'Add Ticket Followers skips agents who cannot see the ticket, but the execution still says Succeeded',
    steps: ['Rule On Create with action Add Ticket Followers, choosing agents of whom some have no access to the ticket\'s department.', 'Create a ticket in that department.'],
    verdict: 'NOT CHECKED', zoho: 'Not compared: Zoho help does not say what happens to followers who cannot see the ticket, and trying it live would save a rule in Zoho.',
    expected: 'Agents who can\'t see the ticket are either refused when the rule is saved, or the execution shows them as skipped with the reason (not a plain "Succeeded").',
    actual: 'Only the agents with access became followers; the others were dropped silently. Execution History: AddTicketFollowers Succeeded, no warning.', tImg: null, zImg: null,
    note: 'Same access rule as NDC-2852 (SLA escalation skips chosen agents without ticket access).' },
  { id: 'FN-16', bugId: null, cases: 'C3 / P25 (= Z28)', sev: 'Low', area: 'Finding', title: 'A ticket closed by a workflow Field Update: history does not show the status change',
    steps: ['Rule: Field Update Status = Closed on a ticket condition.', 'Fire it on a ticket (on create, or by editing the ticket).', 'Open the ticket History.'],
    verdict: 'SAME', zoho: 'Rechecked TAVI 12 Nov 19:00 (#3161): history now shows "Status was updated Open → Closed" and "Workflow rule ran · Rule QA AO WF EV7 · Actions Field Update · by workflow rule" — same information as Zoho, so NOT filed. Zoho checked live 12 Nov (techsolutionsegypt, contact notification "Closing a ticket" turned on for the test, off again after). Closed by a workflow Field Update (#185 on Create, #186 on Edit): NO closed mail in Zoho either. Closed by an agent (#184): closed mail sent ("Notification Rule Applied: Acknowledge Contact when the Ticket is closed"). So the missing mail is Zoho behaviour, NOT a bug. The difference is the history: Zoho writes "Ticket was updated through a Workflow Rule · Rule Name QA C3 close by workflow · Assignment Name QA C3 set Closed · Status changed from Open to Closed".',
    expected: 'History shows that the workflow changed the status, as in Zoho: "Ticket was updated through a Workflow Rule", the rule name, the field update name and "Status changed from Open to Closed". No closed mail is expected (Zoho sends none when a workflow closes the ticket).',
    actual: 'Ticket #2952 closed by the rule: history only "Workflow rule ran", no status line. No closed mail and no rating request (same as Zoho, so not a bug). Ticket #2951 closed with the close action: closed mail + rating (same as Zoho).',
    tImg: null, zImg: 'evidence/a4-bugs/C3-zoho-workflow-close-no-mail.png', note: 'Zoho agent-close comparison: evidence/a4-bugs/C3-zoho-manual-close-mail-sent.png. All Zoho test data deleted (rule, field update, tickets #184–186, contact) and the notification switched back off.' },
];
const items = [...fromBugs, ...extra];
const sevOrder = { High: 0, Medium: 1, Low: 2 };
items.sort((a, b) => sevOrder[a.sev] - sevOrder[b.sev] || a.id.localeCompare(b.id));
const vc = k => items.filter(i => i.verdict === k).length;

const card = i => `<article class="bug" id="${i.id}"><header><b>${i.id}</b> ${pill(i.sev, SEV[i.sev])} ${pill(i.area, i.area === 'Security' ? 'bad' : 'grey')} <span class="muted">case ${esc(i.cases)}${i.bugId ? ' · ' + i.bugId + ' in the bugs report' : ''}</span><h3>${esc(i.title)}</h3></header>
<div class="zoho">${pill('vs Zoho: ' + i.verdict, VC2[i.verdict])} ${esc(i.zoho)}${i.zImg ? img(i.zImg).replace('Screenshot', 'Zoho screenshot') : ''}</div>
<div class="grid2"><div><h4>Steps</h4><ol>${i.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div><div><h4>${i.verdict === 'DIFFERS' ? 'Expected (Zoho Desk)' : i.verdict === 'NO ZOHO' ? 'Expected (no Zoho equivalent)' : 'Expected'}</h4><p>${esc(i.expected)}</p><h4>Actual (TAVI)</h4><p>${esc(i.actual)}</p>${i.note ? `<p class="muted">${esc(i.note)}</p>` : ''}</div></div>${img(i.tImg).replace('Screenshot', 'TAVI screenshot')}</article>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Workflow Rules Findings</title><style>${css}</style></head><body><main>
<h1>Desk Workflow Rules: findings</h1>
<p class="sub">TAVI Desk on NDC-Staging, automation-order run part A4, 11–12 Nov 2026. Only the rows marked <b>FINDING</b>: issues where the spec had no clear pass/fail, or that need your call. Each one compared with Zoho Desk (live techsolutionsegypt, nothing saved, plus help.zoho.com). Clear failures are in <a href="report-workflow-bugs.html">report-workflow-bugs.html</a>. <b>Nothing is filed in Plane.</b></p>
<div class="tiles"><div class="tile"><b>${items.length}</b><span>findings (14 A4 rows; P18 and P25 also count as Z19 and Z28)</span></div><div class="tile"><b>${vc('DIFFERS')}</b><span>differ from Zoho → parity bugs</span></div><div class="tile"><b>${vc('BUG')}</b><span>defects with no Zoho equivalent</span></div><div class="tile"><b>${vc('NO ZOHO')}</b><span>in TAVI-only features</span></div><div class="tile"><b>${vc('NOT CHECKED')}</b><span>Zoho not compared yet</span></div></div>
<div class="tw" style="padding:10px 14px"><b>"vs Zoho":</b> ${pill('DIFFERS', 'bad')} Zoho behaves differently, expected result is Zoho's. ${pill('BUG', 'warn')} nothing comparable in Zoho, still a defect. ${pill('NO ZOHO', 'grey')} TAVI-only feature, not a parity bug. ${pill('NOT CHECKED', 'grey')} Zoho comparison still open.</div>
<h2>Summary</h2>
<div class="tw"><table><tr><th>Id</th><th>Case</th><th>Severity</th><th>vs Zoho</th><th>Finding</th></tr>${items.map(i => `<tr><td><a href="#${i.id}">${i.id}</a></td><td>${esc(i.cases)}</td><td>${pill(i.sev, SEV[i.sev])}</td><td>${pill(i.verdict, VC2[i.verdict])}</td><td>${esc(i.title)}</td></tr>`).join('')}</table></div>
<h2>Details</h2>
${items.map(card).join('')}
<p class="muted">Ids FN-xx follow the WF-xx numbers in the bugs report (FN-08 = WF-08); FN-15 and FN-16 are only here. Sources: PROGRESS.md, a4 results, screen steps s1–s28. Test data was deleted after each test.</p>
</main></body></html>`;
fs.writeFileSync(path.join(D, 'report-workflow-findings.html'), html);
console.log('findings', items.length, JSON.stringify({ DIFFERS: vc('DIFFERS'), BUG: vc('BUG'), 'NO ZOHO': vc('NO ZOHO'), 'NOT CHECKED': vc('NOT CHECKED') }));
