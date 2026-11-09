// Builds decisions.html: filed bugs + explanation of B-06, B-08, D-14, E-12, E-16, E-18, F-12, H-13 + open decisions. Usage: node build-decisions-html.js
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const F = JSON.parse(fs.readFileSync(path.join(RUN, 'out/plane-filed.json'), 'utf8'));
const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'screenshots/annotated', f)).toString('base64');
const PL = id => `<a href="https://app.plane.so/ahmed-hegazy/browse/${id}/" target="_blank">${id}</a>`;

const bugs = [
  ['B-2', F['B-2'].seq, 'high', 'Round robin gives tickets to agents whose Email channel is off', 'B2-email-channel-off-vs-zoho.png'],
  ['B-3', F['B-3'].seq, 'medium', 'Team Assignment off: the assign API still gives a ticket to a team', 'B3-team-assignment-off-api-vs-zoho.png'],
  ['B-4', F['B-4'].seq, 'medium', 'New Ticket form shows the current agent as owner but saves the ticket unassigned', 'B4-new-ticket-owner-not-saved-vs-zoho.png'],
  ['B-5', F['B-5'].seq, 'medium', '"On a holiday of" never matches a holiday list that is not linked to business hours', 'B5-holiday-list-not-attached-vs-zoho.png'],
];

// verdict: filed | decide | notrun
const cases = [
  { id: 'B-08', title: 'Execution Time criteria (business hours / holiday)', verdict: 'filed', bug: 'B-5',
    passed: ['"During business hours" and "outside business hours" work (Default profile, 24/7).', 'A holiday list linked to business hours works: "on a holiday" matched (#1233 → A1), "not a holiday" did not (#1234).', 'A list that is not linked, with a holiday on 25 Dec, behaves correctly on other days (#1231 no match, #1232 → A3).'],
    failed: ['A holiday list <strong>not linked</strong> to business hours: "on a holiday of" never matches, so today\'s holiday is treated as a working day (#1229 / #1252 stayed Unassigned; "not a holiday" sent #1230 / #1254 to A2).', 'The picker still offers such lists, so an admin can choose one and the rule silently never fires on holidays.'],
    decision: 'None — filed.' },
  { id: 'D-14', title: 'How a new ticket arrives (API, New Ticket form, email, web form, import)', verdict: 'filed', bug: 'B-4', extra: 'notrun',
    passed: ['API create (owner null or no owner key) → assignment rules route it.', 'New Ticket form with Ticket Owner cleared → round robin assigned it (A2).'],
    failed: ['New Ticket form with the default owner left as is: the form shows <em>you</em> as owner, but the request sends no owner, so the ticket is saved Unassigned (#1200) or round robin gives it to someone else (#1199 → Dev Team 2).', 'This contradicts the developer\'s 6 Nov fix note ("a ticket created with an owner keeps it, including the form\'s default of the current agent").'],
    notrun: ['Email, web form and import. NDC-Staging has no mail channel. Web form and import may be testable there; not tried yet.'],
    decision: 'Should I test the web form and import paths? Email needs a mailbox set up on NDC-Staging.' },
  { id: 'E-12', title: 'Round robin skips an agent who is not available', verdict: 'filed', bug: 'B-2',
    passed: ['An agent who is fully signed out is skipped and History lists them as SKIPPED.'],
    failed: ['An agent who is signed in but has the <strong>Email channel off</strong> still gets their turn and is not listed as SKIPPED (re-checked on the 7 Nov build).', 'Zoho assigns round-robin tickets only to agents online in the ticket\'s channel.'],
    decision: 'None — filed (High: tickets go to agents who said they are not taking email).' },
  { id: 'E-16', title: 'Everyone unavailable → ticket waits in the backlog', verdict: 'filed', bug: 'B-2',
    passed: ['All agents signed out → the ticket waits Unassigned in the backlog.'],
    failed: ['All three agents with Email off → the ticket is still assigned (to A1). Same root cause as E-12.'],
    decision: 'None — filed together with E-12.' },
  { id: 'F-12', title: 'Team Assignment switch off = agents only', verdict: 'filed', bug: 'B-3',
    passed: ['Screens: with the switch off the ticket owner picker shows AGENTS only; with it on, AGENTS + TEAMS.', 'New rules with a team target are refused (<code>team_assignment_off</code>).'],
    failed: ['The assign API (<code>POST /desk/tickets/{id}/assign</code> with a team) still returns 200 and the ticket gets the team (#1189 → "QA AS6 Team A").'],
    decision: 'None — filed (Medium: only API callers or integrations can reach it; the screens are correct).' },
  { id: 'B-06', title: 'Fields offered in rule criteria', verdict: 'decide',
    passed: ['Every field that is offered works when used.', 'Ticket fields: 138 (Zoho 38) — every custom field is offered. Created / Modified / Closed Time were added on 7 Nov.', 'Account fields: 15 (Zoho 14).'],
    failed: ['<strong>Contact fields: 17 vs 26 in the requirements</strong> (taken from Zoho). TAVI has: first name, last name, email, phone, mobile, title, owner, secondary email, twitter, facebook, type, language, is spam, external ref, and 3 CRM sync fields. Not compared one by one with Zoho, so the 9 missing names are not listed yet.', '<strong>"Is Escalated"</strong> ticket field is missing.'],
    kind: 'Missing feature compared with Zoho, not a broken function.',
    options: ['(a) File one low-priority gap: "Is Escalated" + the missing contact fields (I would first list Zoho\'s 26 contact fields so the ticket names them).', '(b) Accept the current list.'] },
  { id: 'E-18', title: 'The 30-day rule', verdict: 'notrun',
    passed: [], failed: [],
    notrun: ['A backlog ticket whose last customer reply is more than 30 days old should not be auto-assigned.', 'Testing needs such a ticket. The screens and API cannot backdate one, and NDC-Staging has none.'],
    kind: 'Not tested, so there is no result.',
    options: ['(a) Ask a developer to backdate one QA ticket\'s last-reply date on staging, then I test it.', '(b) Look for a suitable old ticket on another environment.', '(c) Leave it untested and say so in the NDC-2275 comment.'] },
  { id: 'H-13', title: 'Deleting a skill type that skills still use', verdict: 'decide',
    passed: [], failed: [],
    facts: ['<strong>1 Nov:</strong> deleting the type kept its skills and left them with no type. This was recorded in the Skills ticket (NDC-2752) and is what the test plan expects.', '<strong>7 Nov:</strong> the same delete is refused with a 409 error — you must move the skills to another type first.', 'Both are reasonable designs. Zoho behaviour not checked (it means deleting a type in Zoho; Zoho is kept read-only).'],
    kind: 'Behaviour changed — a question, not a bug.',
    options: ['(a) Accept the new behaviour (refuse the delete) and update the test plan.', '(b) Treat it as a bug if you want the 1 Nov behaviour back.', '(c) Let me check Zoho with a throw-away skill type that I create and delete (a Zoho change — needs your OK).'] },
];

const open = [
  ['Comments on NDC-2275, NDC-2752, NDC-1978', 'Drafted (plane-draft.html), not posted. NDC-2275: Done (bugs filed separately) or Bug? NDC-1978: Done, or keep in Ready For Test until NDC-2811..2814 are fixed? NDC-2752: comment only.'],
  ['I-12 — agent threshold counts tickets in every department', 'A1: Dept A 60 + Dept B 6 = 66 counted. Help text says "an agent in the department". Bug, or intended? Zoho not checked.'],
  ['I-11 — conversion entries in the Audit Log', 'Read as if nothing changed ("type from round_robin to round_robin"), raw rule ids, actor not in the users filter. File as a low bug, or leave as a note?'],
  ['QA AS6 test data on NDC-Staging', 'Still live for review (ledger.md). Clean up when you say.'],
];

const V = { filed: ['Filed bug', 'filed'], decide: ['Your decision', 'decide'], notrun: ['Not tested — your decision', 'notrun'] };
const li = a => a && a.length ? '<ul>' + a.map(x => `<li>${x}</li>`).join('') + '</ul>' : '';
const bugBy = Object.fromEntries(bugs.map(b => [b[0], b]));
const caseHtml = c => {
  const [vt, vc] = V[c.verdict]; const b = c.bug && bugBy[c.bug];
  return `<section class="case ${vc}" id="${c.id}"><div class="ch"><span class="cid">${c.id}</span><h3>${c.title}</h3><span class="v ${vc}">${vt}${b ? ' · ' + PL(b[1]) : ''}</span>${c.extra === 'notrun' ? '<span class="v notrun">part not tested</span>' : ''}</div>
  ${c.kind ? `<p class="kind">${c.kind}</p>` : ''}
  <div class="cols">${c.passed.length ? `<div><h4 class="ok">What passed</h4>${li(c.passed)}</div>` : ''}${c.failed.length ? `<div><h4 class="bad">${c.verdict === 'decide' ? 'What is missing' : 'What failed'}</h4>${li(c.failed)}</div>` : ''}${c.facts ? `<div><h4>What happens</h4>${li(c.facts)}</div>` : ''}${c.notrun ? `<div><h4 class="nr">Not tested</h4>${li(c.notrun)}</div>` : ''}</div>
  ${c.options ? `<div class="dec"><h4>Your decision</h4>${li(c.options)}</div>` : c.decision ? `<div class="dec small"><h4>Decision</h4><p>${c.decision}</p></div>` : ''}</section>`;
};

const order = ['B-06', 'E-18', 'H-13', 'D-14', 'B-08', 'E-12', 'E-16', 'F-12'];
const cs = order.map(id => cases.find(c => c.id === id));
const count = v => cases.filter(c => c.verdict === v).length;

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Desk Assignment Rules + Skills — bugs filed and decisions needed (7 Nov 2026)</title>
<style>
:root{--fg:#1d2330;--mut:#5d6677;--line:#e2e5ea;--ok:#1f8a4c;--bad:#c62f2f;--dec:#b8650a;--nr:#6b7387;--link:#2f55c4}
*{box-sizing:border-box}body{margin:0;font:14px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f6f7f9;color:var(--fg)}
header{background:#1d2330;color:#fff;padding:26px 40px 20px}header h1{margin:0 0 4px;font-size:21px}header .sub{color:#b9c0cc;font-size:13px}
main{max-width:1180px;margin:0 auto;padding:22px 40px 40px}a{color:var(--link)}
h2{font-size:18px;margin:30px 0 12px;padding-bottom:6px;border-bottom:1px solid var(--line)}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px 16px}.card .n{font-size:26px;font-weight:700}.card .l{font-size:12px;color:var(--mut);text-transform:uppercase;letter-spacing:.04em}
.card.filed .n{color:var(--bad)}.card.decide .n{color:var(--dec)}.card.notrun .n{color:var(--nr)}
table{border-collapse:collapse;width:100%;background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden}th,td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{background:#eef0f4;font-size:12px;color:var(--mut);text-transform:uppercase}
.p{font-weight:700;text-transform:capitalize}.p.high{color:var(--bad)}.p.medium{color:var(--dec)}
.case{background:#fff;border:1px solid var(--line);border-left:5px solid var(--line);border-radius:10px;padding:14px 18px;margin:12px 0}
.case.filed{border-left-color:var(--bad)}.case.decide{border-left-color:var(--dec)}.case.notrun{border-left-color:var(--nr)}
.ch{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.ch h3{margin:0;font-size:15px;flex:1}.cid{font-weight:700;background:#eef0f4;border-radius:6px;padding:2px 8px}
.v{font-size:12px;font-weight:700;border-radius:10px;padding:2px 10px}.v.filed{background:#fbe3e3;color:var(--bad)}.v.decide{background:#fbefd9;color:var(--dec)}.v.notrun{background:#eceef2;color:var(--nr)}
.kind{color:var(--mut);font-style:italic;margin:8px 0 0}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:4px 22px}
h4{margin:12px 0 2px;font-size:13px}h4.ok{color:var(--ok)}h4.bad{color:var(--bad)}h4.nr{color:var(--nr)}
.dec{background:#fdf8ef;border:1px solid #f1e0c0;border-radius:8px;padding:2px 14px 6px;margin-top:10px}.dec h4{color:var(--dec)}.dec.small{background:#f6f7f9;border-color:var(--line)}.dec.small h4{color:var(--mut)}.dec p{margin:4px 0}
ul{padding-left:20px;margin:4px 0}li{margin:3px 0}code{background:#eef0f4;padding:1px 5px;border-radius:4px;font-size:12.5px}
figure{margin:12px 0;background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px}figure img{width:100%;border-radius:6px}figcaption{font-size:13px;margin-top:6px}
.note{color:var(--mut)}
@media print{header{background:#fff;color:#000}}
</style></head><body>
<header><h1>Desk Assignment Rules + Skills — bugs filed and decisions needed</h1><div class="sub">NDC-Staging · 7 Nov 2026 · full results in report.html · Plane comments still drafts (plane-draft.html)</div></header>
<main>
<div class="cards">
<div class="card filed"><div class="n">${bugs.length}</div><div class="l">Bugs filed in Plane</div></div>
<div class="card filed"><div class="n">${count('filed')}</div><div class="l">Cases → a filed bug</div></div>
<div class="card decide"><div class="n">${count('decide') + count('notrun') + 1}</div><div class="l">Case decisions for you</div></div>
<div class="card notrun"><div class="n">${open.length}</div><div class="l">Other open items</div></div>
</div>

<h2>Bugs filed in Plane (7 Nov, after your approval)</h2>
<table><thead><tr><th>Ours</th><th>Plane</th><th>Priority</th><th>Title</th><th>Cases</th></tr></thead><tbody>
${bugs.map(b => `<tr><td><strong>${b[0]}</strong></td><td>${PL(b[1])}</td><td class="p ${b[2]}">${b[2]}</td><td>${b[3]}</td><td>${cases.filter(c => c.bug === b[0]).map(c => `<a href="#${c.id}">${c.id}</a>`).join(', ') || '—'}</td></tr>`).join('')}
</tbody></table>
<p class="note">All four: state Bug, label Assignment Rules, module Desk, Sprint 15 (starts 8 Nov; no sprint is running today), assignees MahmoudMohamed, mfathy, Hegazy; "relates to" NDC-2275 and NDC-1978; approved TAVI-vs-Zoho image attached. Read back from Plane: all four in Sprint 15 and module Desk.</p>

<h2>The 8 cases you asked about</h2>
<p class="note">Decisions first, then the cases whose failing part is already a filed bug.</p>
${cs.map(caseHtml).join('\n')}

<h2>Other open items</h2>
<table><thead><tr><th>Item</th><th>Status / question</th></tr></thead><tbody>${open.map(o => `<tr><td><strong>${o[0]}</strong></td><td>${o[1]}</td></tr>`).join('')}</tbody></table>

<h2>Evidence attached to the filed bugs</h2>
<p class="note">TAVI on the left, live Zoho Desk on the right, same box numbers on both sides.</p>
${bugs.map(b => `<figure><a href="${img(b[4])}" target="_blank"><img src="${img(b[4])}" alt="${b[0]}"></a><figcaption><strong>${b[0]} · ${b[1]}</strong> — ${b[3]}</figcaption></figure>`).join('')}
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'decisions.html'), html);
console.log('decisions.html', (html.length / 1024).toFixed(0) + ' KB');
