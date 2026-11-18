// node mk-review.js → ../review-r19.html : full review of round 19 / 19b / 19c (16 Nov 2026) for the QA lead.
// Data: plane-draft.json (verdicts + posted comments) + LIVE (Plane states read back 16 Nov ~19:30Z) + hand-written pending sections.
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const d = require('../plane-draft.json');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const txt = h => String(h || '').replace(/<br\s*\/?>/g, '\n').replace(/<\/(p|li|tr|h\d)>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/[ \t]+/g, ' ');
// Live Plane state (read back 16 Nov 2026 ~19:30Z with rb19.js / st.js)
const LIVE = { 'NDC-2275': 'In Progress', 'NDC-2997': 'In Progress', 'NDC-2933': 'In Progress', 'NDC-3056': 'In Progress', 'NDC-3000': 'Ready For Test', 'NDC-3007': 'Bug', 'NDC-2841': 'Bug' };
const ROUND = { r19: ['NDC-3029','NDC-3030','NDC-3031','NDC-3032','NDC-3034','NDC-3035','NDC-3036','NDC-3037','NDC-3038','NDC-3039','NDC-3054','NDC-3056','NDC-2275','NDC-2970','NDC-2931','NDC-2932','NDC-3046','NDC-2824','NDC-2838','NDC-2839','NDC-2971','NDC-2933','NDC-2962','NDC-2963','NDC-2967','NDC-2997','NDC-2968','NDC-2973','NDC-2966'], r19c: ['NDC-3066','NDC-3069','NDC-3070','NDC-2850','NDC-2870'] };
const roundOf = t => ROUND.r19.includes(t) ? '19' : ROUND.r19c.includes(t) ? '19c' : '19b';
const img = f => fs.existsSync(path.join(RUN, 'screenshots/annotated', f)) ? `<a href="screenshots/annotated/${esc(f)}" target="_blank"><img loading="lazy" src="screenshots/annotated/${esc(f)}" alt="${esc(f)}"></a>` : `<span class="muted">${esc(f)} (missing)</span>`;
const checks = h => { const t = txt(h); const m = t.split(/Checked:/)[1] || ''; return m.split(/Still failing:|Evidence:|Developer's comment|Zoho Desk comparison|Expected \(as Zoho|Note:|Also seen/)[0].trim(); };
const still = h => { const t = txt(h); const m = t.split(/Still failing:/)[1]; return m ? m.split(/Evidence:|Developer's comment|Expected \(as Zoho/)[0].trim() : ''; };
const extra = h => { const t = txt(h); const parts = []; for (const k of ["Developer's comment", 'Zoho Desk comparison', 'Expected (as Zoho', 'Note:', 'Also seen', 'Decision (QA lead']) { const i = t.indexOf(k); if (i >= 0) parts.push(t.slice(i).split(/Evidence:/)[0].trim()); } return [...new Set(parts)].join(' ').slice(0, 900); };

const done = d.filter(x => (x.verdict === 'PASS' || x.ticket === 'NDC-2963'));
const bug = d.filter(x => ['FAIL', 'PARTIAL'].includes(x.verdict) && !['NDC-3056', 'NDC-3000'].includes(x.ticket));
const byFeat = a => { const g = {}; for (const x of a) (g[x.feat] = g[x.feat] || []).push(x); return Object.entries(g).sort((a, b) => b[1].length - a[1].length); };

const FILED = [
  ['NDC-3065', 'Blueprint | An agent with read-only access to a ticket can still run a transition', 'NDC-3036', 'In Progress', 'Blueprint lane; you decided it is a bug'],
  ['NDC-3066', 'Ticket History | Automatic blueprint steps show the wrong From state and To state', 'NDC-3034', 'Done', 'fixed the same day, retested in 19c → PASS'],
  ['NDC-3067', 'Audit Log | Changes made in the web app show the server\'s internal address', 'NDC-3029', 'In Progress', ''],
  ['NDC-3068', 'Ticket History | Closed Time shows a raw timestamp and Resolution Time a blank', 'NDC-3054', 'In Progress', ''],
  ['NDC-3069', 'Blueprint API | A malformed transition owner id returns .NET parser text', 'NDC-3037', 'Done', 'fixed the same day, retested in 19c → PASS'],
  ['NDC-3070', 'Blueprint API | A save that sends no revision silently overwrites a newer one', 'NDC-3030', 'Done', 'fixed the same day, retested in 19c → PASS'],
  ['NDC-3071', 'Records API | A field value without a "kind" key returns 500', 'NDC-2967', 'In Progress', 'assignees Mahmoud, Hegazy, eahmed; label API & Platform'],
  ['NDC-3076', 'Round Robin Assignment | Department threshold counts Open tickets the agent does not have', 'NDC-2275', 'Bug', 'Zoho checked live: Zoho counts correctly'],
  ['NDC-3077', 'Tickets | A created ticket can stay without a ticket number and History', 'NDC-2275', 'Bug', 'Zoho checked live: Zoho always numbers the ticket'],
];

const PEND = [
  { t: 'NDC-3000', title: 'Email | Customers get no acknowledgement emails; closed email has no rating link', kind: 'action', img: 'NDC-3000-retest-PENDING.png',
    now: 'Your email arrived: it created ticket <b>#4745</b> in QA RT19 NTF Dept at 15:44:46Z (17:44 Cairo), channel email. The app queued the acknowledgement <b>"Re: QA RT19 NTF 3000 ack test [#4745]"</b> to your address at 15:44:54Z and logged it as sent at 15:44:58Z. Already PASS: rating link in the closed email (#4678, you checked it). Not an issue: tickets made by API get no ack, by design.',
    why: 'Two "reply sent" events are logged for this one acknowledgement (15:44:58Z and 15:44:59Z). Please check whether it reached you once or twice; twice would be a defect. The reply-acknowledgement part (step 3) has not been tested yet.',
    ask: '(1) Confirm the "Re: QA RT19 NTF 3000 ack test [#4745]" email is in your inbox, and how many copies. (2) Say "go" and I post an agent reply on #4745. You then reply to that email, and I check the reply acknowledgement. Then → Done, or → Bug if something is missing.' },
  { t: 'NDC-2850', title: 'SLA | Removing an agent drops them from SLA escalations instead of handing them over', kind: 'action', img: 'NDC-2850-retest-PASS.png',
    now: 'PASS in the app on all 4 checks: the Remove-from-Desk dialog has a per-department chooser and the new hint text; the SLA levels were handed to Mahmoud Samy; the escalation on #4725 fired at 15:41:59Z, notified Mahmoud Samy and reassigned the ticket to him.',
    why: 'The escalation email goes to the Mahmoud Samy mailbox (your Gmail). Only you can see the inbox.',
    ask: 'Check that mailbox for "[SLA] #4725 …" at about 17:41 Cairo, and send a screenshot or say yes. I then post → Done with the inbox image added.' },
  { t: 'NDC-2870', title: 'Global Sets: features Zoho CRM has that CRM is missing (gap list, 11 items)', kind: 'decision', img: 'NDC-2870-retest-PARTIAL.png', img2: 'NDC-2870-retest-PARTIAL-vs-zoho.png',
    now: 'PARTIAL, compared live with Zoho CRM. PASS: 1 Replace everywhere, 4 Predefined Choices, 5 Source/Industry sets, 8 per-value "where used", 10 limits. FAIL: 3 saved sort order (list views and reports still A–Z; Zoho follows entered order), 6 Countries/States list not built. PARTIAL: 2 delete unused value (API OK, screen crashes), 7 Used In (reports not shown), 9 Used In column still a field count.',
    why: 'Item 11 (replace history plus a notification for long replaces): history is there. There is no notification because the replace runs at once, with no background job. The 11 Nov intake called this "not a gap".',
    ask: '(a) Move to Bug with a comment covering items 2, 3, 6, 7, 9 and both images? (b) Item 11: accept (no notification needed) or count it as missing? (c) Draft the 4 new defects below as separate bugs?' },
];

const NEWOBS = [
  ['High', 'Global Sets | Delete icon and "Where is this value used" on an Unused value crash the page', 'NDC-2870 item 2', 'API works (used 422, unused 200). Not drafted yet.'],
  ['Medium', 'Global Sets | Used In never lists the reports that use the set', 'NDC-2870 item 7', 'API field-usage finds them (response body wrapped twice). Not drafted.'],
  ['Medium', 'Global Sets | List views and reports ignore the saved "Entered order" sort', 'NDC-2870 item 3', 'Entered Silver, Platinum, Bronze → shown Bronze, Platinum, Silver; Zoho keeps entered order. Not drafted.'],
  ['Low', 'Global Sets | Used In column shows a field count, not module names / report count', 'NDC-2870 item 9', 'Not drafted.'],
  ['?', 'Agents API | POST /desk/agents/{id}/reassign removes the agent from every department, team and RR pool, also ones not in the request', 'NDC-2850 item 6', 'The screen always sends every department, so users do not hit it. API-only. Restored. File it or not?'],
  ['?', 'Email | One acknowledgement logged as "sent" twice (#4745)', 'NDC-3000', 'Depends on your inbox count (above).'],
];
const NOTBUG = [
  ['Ticket Import | Ticket Owner given by agent name is not matched', 'Zoho Desk live: owner is matched by email only (your note: email is the unique key); a name gives Unassigned, 0 failed. TAVI behaves the same → not filed.'],
  ['Skills API | Skills of another department / inactive are silently dropped', 'Zoho Desk live does the same (drops silently) → not filed.'],
  ['NDC-2963 | Script in an Add Comment action', 'Shown as safe rich text exactly like Zoho → Done (your decision). Hardening note left for devs: TAVI stores the raw onerror HTML, Zoho strips it before saving.'],
];

const css = `:root{--bg:#f7f7f5;--card:#fff;--ink:#1d1d1b;--mut:#6b6b66;--line:#e3e2dc;--pass:#1f7a45;--passbg:#e5f3ea;--fail:#b3261e;--failbg:#fbe9e7;--part:#9a5b00;--partbg:#fdf0dc;--info:#2f5d9e;--infobg:#e6eef9;--you:#6a3fb0;--youbg:#efe8fa}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#161615;--card:#1f1f1d;--ink:#ecebe6;--mut:#a3a29b;--line:#33322f;--pass:#6fcf97;--passbg:#163222;--fail:#f28b82;--failbg:#3a1c1a;--part:#f2b45c;--partbg:#3a2a12;--info:#8ab4f8;--infobg:#17263b;--you:#c5a3ff;--youbg:#2a1f3d}}
:root[data-theme=dark]{--bg:#161615;--card:#1f1f1d;--ink:#ecebe6;--mut:#a3a29b;--line:#33322f;--pass:#6fcf97;--passbg:#163222;--fail:#f28b82;--failbg:#3a1c1a;--part:#f2b45c;--partbg:#3a2a12;--info:#8ab4f8;--infobg:#17263b;--you:#c5a3ff;--youbg:#2a1f3d}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:1180px;margin:0 auto;padding:24px 16px 80px}h1{font-size:24px;margin:0 0 4px}h2{font-size:18px;margin:36px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--line)}h3{font-size:15px;margin:18px 0 8px}
.muted{color:var(--mut)}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:18px 0}
.tile{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px}.tile b{display:block;font-size:26px;line-height:1.1}.tile span{color:var(--mut);font-size:12.5px}
.t-pass b{color:var(--pass)}.t-fail b{color:var(--fail)}.t-part b{color:var(--part)}.t-you b{color:var(--you)}.t-info b{color:var(--info)}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden;margin:8px 0}
th,td{text-align:left;vertical-align:top;padding:7px 10px;border-bottom:1px solid var(--line)}th{font-size:12px;text-transform:uppercase;letter-spacing:.03em;color:var(--mut);background:var(--bg)}tr:last-child td{border-bottom:0}
.wrap{overflow-x:auto}.pill{display:inline-block;padding:1px 8px;border-radius:99px;font-size:12px;font-weight:600;white-space:nowrap}
.PASS{background:var(--passbg);color:var(--pass)}.FAIL{background:var(--failbg);color:var(--fail)}.PARTIAL{background:var(--partbg);color:var(--part)}.DECISION,.INFO{background:var(--infobg);color:var(--info)}.YOU{background:var(--youbg);color:var(--you)}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:12px 0}.card.you{border-left:4px solid var(--you)}.card.fail{border-left:4px solid var(--fail)}
.card h3{margin:0 0 6px}.lbl{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:var(--mut);margin-top:8px}
.card img{max-width:100%;border:1px solid var(--line);border-radius:6px;margin-top:8px}.thumbs{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px}
details{margin:6px 0}summary{cursor:pointer;color:var(--info)}td img{width:120px;border:1px solid var(--line);border-radius:4px}
.ask{background:var(--youbg);border-radius:8px;padding:8px 10px;margin-top:8px}code{font-size:12.5px}ul{margin:4px 0 4px 18px;padding:0}`;

let h = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest Round 19 Review</title><style>${css}</style></head><body><main>
<h1>Retest round 19 — full review</h1>
<div class="muted">Mahmoud Mohamed's Ready For Test tickets · NDC · rounds 19, 19b, 19c · 16 Nov 2026 · NDC-Staging (staging-desk / staging-crm), Edge + API · Plane states read back live at ~19:30Z</div>
<div class="tiles">
<div class="tile"><b>${d.length + 2}</b><span>tickets retested (49)</span></div>
<div class="tile t-pass"><b>${done.length}</b><span>PASS → Done (incl. 2963 by your decision)</span></div>
<div class="tile t-fail"><b>${bug.length}</b><span>FAIL / PARTIAL → Bug</span></div>
<div class="tile t-info"><b>1</b><span>skipped by you (NDC-3056)</span></div>
<div class="tile t-you"><b>3</b><span>waiting on you (3000, 2850, 2870)</span></div>
<div class="tile t-info"><b>9</b><span>new bugs filed (3065–3071, 3076, 3077)</span></div>
<div class="tile"><b>0</b><span>blocked</span></div>
</div>
<p class="muted">All writes were read back from Plane: ${done.length} in Done, comment and annotated images present on every posted ticket. Not counted above: round 18 carry-overs NDC-3015 → Done (your A) and NDC-3018 → Bug (your B), posted this morning.</p>

<h2>1 · Needs your decision or action</h2>`;
for (const p of PEND) h += `<div class="card you"><h3>${p.t} <span class="pill YOU">${p.kind === 'action' ? 'YOUR ACTION' : 'YOUR DECISION'}</span> <span class="muted" style="font-weight:400">${esc(p.title)}</span></h3>
<div class="lbl">Where it stands</div><div>${p.now}</div><div class="lbl">Why it waits on you</div><div>${p.why}</div><div class="ask"><b>What I need:</b> ${p.ask}</div>
<details><summary>Evidence</summary><div class="thumbs">${img(p.img)}${p.img2 ? img(p.img2) : ''}</div></details></div>`;
h += `<h3>New findings not filed yet: file them?</h3><div class="wrap"><table><tr><th>Sev</th><th>Proposed title</th><th>Found in</th><th>Note</th></tr>${NEWOBS.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</table></div>
<h3>Housekeeping for you to approve</h3><ul>
<li><b>Cleanup of round 18 and round 19 test data</b>, done once after your OK: ${fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8').split('\n').filter(l => l.startsWith('- ')).length} ledger lines (QA RT19 AS / WF / SK / SLA / NTF / BUG / GS / D3 / HC records, departments, rules, blueprints, SLA policies, skills, contacts, tickets), the r18 Leads list back to Kanban, and the saved sign-in files. It also stops the session keeper.</li>
<li><b>Zoho CRM test org leftover:</b> private view "QA RT19 GS Zsort view" cannot be deleted by API (400). I will delete it from the Zoho screen during cleanup. The set "QA RT19 GS Zsort" delete is scheduled by Zoho. Zoho Desk (techegysolutions) is already at zero.</li>
<li><b>Plane API key CSV</b> expires 1 Dec 2026. Delete it in Plane and in Downloads when we are done.</li></ul>

<h2>2 · Failed or partial → moved to Bug (${bug.length})</h2>`;
for (const x of bug) h += `<div class="card fail"><h3>${x.ticket} <span class="pill ${x.verdict}">${x.verdict}</span> <span class="muted" style="font-weight:400">${esc(x.title)}</span></h3>
<div class="muted">${esc(x.mod)} › ${esc(x.feat)} · priority ${esc(x.pri)} · round ${roundOf(x.ticket)} · Plane now: <b>${esc(LIVE[x.ticket] || 'Bug')}</b>${LIVE[x.ticket] === 'In Progress' ? ' (developer picked it up after our post)' : ''}</div>
<div class="lbl">Still failing</div><div>${esc(still(x.comment_html))}</div>
${extra(x.comment_html) ? `<div class="lbl">Notes</div><div>${esc(extra(x.comment_html))}</div>` : ''}
<details><summary>What was checked + evidence</summary><div>${esc(checks(x.comment_html))}</div><div class="thumbs">${x.images.map(img).join('')}</div></details></div>`;

h += `<h2>3 · Skipped / not changed</h2><div class="card"><h3>NDC-3056 <span class="pill PARTIAL">PARTIAL</span> <span class="muted" style="font-weight:400">Blueprint | Agents cannot see the blueprint's flow and transition conditions from a ticket</span></h3>
<div>Retested PARTIAL: the Steps card and popup now show, with per-step "can I run it" and "Shown when". Still missing: the full flow; the popup shows only the current state and the steps leaving it. The developer had already moved it to In Progress, so you said skip. Comment and image added, state not changed (now <b>In Progress</b>).</div>
<details><summary>Evidence</summary>${img('NDC-3056-retest-PARTIAL.png')}</details></div>
<p class="muted">Blocked: none. Every ticket in scope was tested. Runs made during the staging outage (12:30–12:40Z, Desk 500/503, owner session revoked) were thrown away and redone.</p>

<h2>4 · Passed → moved to Done (${done.length})</h2>`;
for (const [f, a] of byFeat(done)) h += `<h3>${esc(f)} (${a.length})</h3><div class="wrap"><table><tr><th>Ticket</th><th>Title</th><th>Rd</th><th>What proved it</th><th>Evidence</th></tr>${a.map(x => `<tr><td><b>${x.ticket}</b><br><span class="pill ${x.verdict === 'DECISION' ? 'DECISION' : 'PASS'}">${x.verdict === 'DECISION' ? 'MATCHES ZOHO' : 'PASS'}</span></td><td>${esc(x.title)}</td><td>${roundOf(x.ticket)}</td><td><details><summary>${esc(checks(x.comment_html).slice(0, 110))}…</summary>${esc(checks(x.comment_html))}${extra(x.comment_html) ? '<br><i>' + esc(extra(x.comment_html)) + '</i>' : ''}</details></td><td>${x.images.map(img).join('')}</td></tr>`).join('')}</table></div>`;

h += `<h2>5 · New bugs filed today (9)</h2><p class="muted">All in Desk module, Sprint 16, with annotated images and a "relates to" link to the ticket where they were found.</p><div class="wrap"><table><tr><th>Bug</th><th>Title</th><th>Found while retesting</th><th>Plane now</th><th>Note</th></tr>${FILED.map(r => `<tr><td><b>${r[0]}</b></td><td>${esc(r[1])}</td><td>${r[2]}</td><td><span class="pill ${r[3] === 'Done' ? 'PASS' : r[3] === 'Bug' ? 'FAIL' : 'INFO'}">${r[3]}</span></td><td>${esc(r[4])}</td></tr>`).join('')}</table></div>

<h2>6 · Checked against live Zoho: not bugs</h2><div class="wrap"><table><tr><th>Finding</th><th>Result</th></tr>${NOTBUG.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table></div>

<h2>7 · How the round ran</h2><ul>
<li>Round 19 (Blueprint, Assignment, Workflow Rules, Skills, 29 tickets) first, as you asked. Then 19b (SLA, Notifications, Help Center, 16 tickets) and 19c (5 tickets left in Ready For Test).</li>
<li>Parallel lanes on one owner session. A single keeper process renews the session, and the lanes never rotate the refresh token. The owner session was still lost 3 times early on (09:35, 12:20, 12:41Z) before the keeper was fixed. Since then it has renewed cleanly every ~6 minutes.</li>
<li>Emails were sent only to your own Gmail (plus-addresses), and to agent Mahmoud Samy on the same mailbox. Addresses are masked in every image.</li>
<li>Zoho comparisons were live: Zoho Desk techegysolutions (admin) and Zoho CRM test org. Only QA data was used, and it was deleted after.</li>
<li>Every ticket was re-checked as still in Ready For Test right before posting. Plane read-back: 0 failed writes.</li></ul>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'review-r19.html'), h);
console.log('written', path.join(RUN, 'review-r19.html'), (h.length / 1024).toFixed(0) + ' KB', 'done', done.length, 'bug', bug.length);
