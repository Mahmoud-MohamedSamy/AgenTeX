// Round 12 status report: self-contained HTML (images embedded) → ../status-r12.html. Data lives in this file; re-run after each ticket.
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..'), RAW = path.join(RUN, 'screenshots', 'raw');
const img = f => { const p = path.join(RAW, f); return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : ''; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const T = [
  { key: 'NDC-1819', pri: 'Urgent', mod: 'CRM', title: 'Work Queue — Workqueue Missings (gap list)', verdict: 'PASS', action: '→ Done + comment',
    prev: 'r10 PARTIAL: "Filter By Related Modules" missing (item 2)',
    checks: [
      ['Filter panel groups', 'System Defined / Fields / Related Modules', 'All three groups; Related Modules lists Leads, Customers, Transactions, Agency Code, Tasks, Calls, Meetings, Subscriptions', 'PASS'],
      ['My Leads › Tasks › With any Tasks', 'Leads that have a task (API: 4)', '4 — WQ-065LeadToSendEmail, WQ-065LeadToTask, AEX-01 ×2', 'PASS'],
      ['Without any Tasks', '51 − 4 = 47', '47', 'PASS'],
      ['With Tasks matching… Subject contains AEX-01', 'API: 2 leads', '2 (AEX-01 ×2)', 'PASS'],
      ['Clear + Apply / Clear filters / reload', 'Back to 51; applied filter survives reload', '51 / 51 / 4 after reload', 'PASS'],
      ['Sort asc / desc from ≡ menu, kept after reload', 'Rows ordered; sort remembered', 'Call… / Webinar…; kept after reload', 'PASS'],
      ['Pin / Unpin, Hide + Show', 'Works, hide survives reload', 'Priority pinned first, Unpin back; Reminder hidden after reload, Show restores', 'PASS'],
      ['Periods vs rail counts', 'Rail = total; Today & Overdue = Today + Overdue', 'Overdue 3, Due today 0, Today & Overdue 3, All open 90', 'PASS'],
      ['Item 13 (skip step 1)', '—', 'Developer decision 25 Oct, unchanged', 'INFO']],
    imgs: [['1819-g1-with.png', 'Related Modules › Tasks › With any Tasks → 4'], ['1819-h3-result.png', 'With Tasks matching… Subject contains AEX-01 → 2'], ['1819-i1-menu.png', 'Column menu: Sort asc/desc, Pin, Hide']] },
  { key: 'NDC-2729', pri: 'Urgent', mod: 'CRM', title: 'Blueprint — create-record actions in After Transition', verdict: 'PASS', action: '→ Done + comment',
    prev: 'r10 PARTIAL: dropdowns showed "Select…" instead of first option',
    checks: [
      ['Module picker on Create task', 'None, or locked to Tasks', 'None', 'PASS'],
      ['Owner', 'Only ASSIGN TO; user picker only for Specific user', 'ASSIGN TO: Record owner / Person who performed / Specific user', 'PASS'],
      ['Task Reminder / Status / Priority', 'First option', 'None / Not Started / Low (all other pick lists on first option too)', 'PASS'],
      ['Meeting Venue / Provider / Reminder', 'First option', 'Office / Zoom / None', 'PASS'],
      ['Call Type / Status / Purpose / Result', 'First option, readable labels', 'Outbound / Scheduled / Prospecting / Interested', 'PASS'],
      ['Related record, Contact Name, Related To', 'Lookups ("Choose a record…")', 'Lookups', 'PASS'],
      ['Yes/No fields; Meeting Host / Check-In By', '—', 'Yes/No default "No"; Host and Check-In By are normal user fields (API), not the owner', 'INFO']],
    imgs: [['2729-d-Create-task-card.png', 'Create task card (AEX-01 › NeedsAnalysisToProposal › After) — nothing saved'], ['2729-d-Call-card.png', 'Call card']] },
  { key: 'NDC-1948', pri: 'High', mod: 'CRM', title: 'Notes — user denied Timeline Visibility', verdict: 'FAIL', action: '→ Bug + comment',
    prev: 'r10 FAIL: note gone after reload; Timeline tab still shown',
    checks: [
      ['Timeline tab for a denied user', 'Hidden', 'Hidden (Overview / Emails / Calls / Files)', 'PASS'],
      ['Add note', 'Shown at once, no "Posting…"', 'POST 201, "Note added", shown at 2 s and 12 s', 'PASS'],
      ['After reload (denied user)', 'Note listed', '"No notes yet" — notes API returns the note', 'FAIL'],
      ['Control: policy back to Allow', '—', 'Same user, reload → note listed: Notes still depend on timeline access', 'INFO']],
    imgs: [['1948-b4-reload.png', 'Denied user after reload: "No notes yet"'], ['1948-c-allowed-control.png', 'Control (policy Allow)']] },
  { key: 'NDC-2630', pri: 'High', mod: 'CRM', title: 'Email — a failed send is shown as sent', verdict: 'BLOCKED (part)', action: 'Your decision',
    prev: 'r8 PARTIAL: timeline logged EmailSent; sendability said can_send true',
    checks: [
      ['Pre-check for a sender with no provider', 'can_send false', 'can_send false, reason no_connection', 'PASS'],
      ['Send', 'Refused, not shown as sent', '422 MAIL_NO_CONNECTION; Mails/Sent empty; timeline has no EmailSent', 'PASS'],
      ['Original case: provider connected but send fails (Zoho without zoid)', 'Failed, never "sent"', 'Not testable: taviportal.com users have no CRM profile (403 mail:send); giving one a profile was refused by the auto-mode safety check', 'BLOCKED']],
    imgs: [] },
  { key: 'NDC-2773', pri: 'Medium', mod: 'CRM', title: 'Invitation — registration page missing the digit rule', verdict: 'PASS', action: '→ Done + comment',
    prev: 'new',
    checks: [
      ['Rules listed under Password', 'Includes a digit rule', '12 chars, uppercase, lowercase, number (0-9), special, not email part', 'PASS'],
      ['Live check while typing "TempTestUser@"', 'Digit rule flagged before submit', 'Digit rule red ○, others green ✓', 'PASS'],
      ['Error placement on Create account', 'Next to the Password field', 'Under Password, box red; no request, no account', 'PASS']],
    imgs: [['2773-a3-no-digit.png', 'Live rule check'], ['2773-a5-after-create.png', 'After Create account']] },
  { key: 'NDC-2136', pri: 'Low', mod: 'CRM', title: 'Custom Views — list first page p95 above 1.5 s', verdict: 'FAIL', action: '→ Bug + comment', prev: 'r10 FAIL: 28–120 s (staging slow)', checks: [['Leads list, 8 loads (1,184 records)', 'p95 ≤ 1.5 s', 'p50 4.2 s, p95 13.1 s (3.3–13.1 s)', 'FAIL'], ['Transactions (Deals) list, 8 loads', 'p95 ≤ 1.5 s', 'p50 2.3 s, p95 5.3 s (2.1–5.3 s)', 'FAIL'], ['Environment', '—', 'Staging slow on 4 Nov (notify service 503)', 'INFO']], imgs: [['2136-a-Leads-list.png', 'Leads list view (timed)']] },
  { key: 'NDC-2781', pri: 'Urgent', mod: 'CRM', title: 'Email — Zoho Mail connect "Invalid Redirect Uri"', verdict: 'USER', action: 'Tested by you', prev: 'new', checks: [], imgs: [] },
  ...[['NDC-2219', 'Urgent', 'Modules and Fields — CRM Admin profile gives admin in Desk', 'needs a profile change — may hit the same auto-mode block'],
    ['NDC-2754', 'High', 'Blueprint + SLA gap list (15 items)', ''], ['NDC-2764', 'High', 'Workflow rule changes Status on a blueprint ticket', 'rule limit reported raised'],
    ['NDC-2777', 'Medium', 'Departments — stale save undoes another admin', ''], ['NDC-2778', 'Medium', 'Agents — inviting an active user\'s email', ''],
    ['NDC-2790', 'Medium', 'Lookup "Choose a record…" window layout', ''], ['NDC-2399', 'Low', 'CRM ⇄ Desk — no notice when initial sync finishes', 'disconnect/connect allowed by you'],
    ['NDC-2643', 'Low', 'Activities drawer accessible names', ''], ['NDC-2776', 'Low', 'Company profile — long phone', ''], ['NDC-2779', 'Low', 'Audit Log — time zone blank → UTC', '']]
    .map(([key, pri, title, note]) => ({ key, pri, mod: 'Desk', title, verdict: 'PENDING', action: '—', prev: note, checks: [], imgs: [] }))];

const cls = v => /PASS/.test(v) ? 'pass' : /FAIL|PARTIAL/.test(v) ? 'fail' : /BLOCK/.test(v) ? 'block' : /INFO|USER/.test(v) ? 'info' : 'pend';
const count = k => T.filter(t => cls(t.verdict) === k).length;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Retest Round 12 Status</title><style>
:root{--bg:#f6f7f9;--card:#fff;--fg:#1d2330;--mut:#5d6675;--line:#e1e5ec;--pass:#1f8a4c;--fail:#c62f2f;--block:#b26a00;--info:#2d6bd6;--pend:#7a8290}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#14171c;--card:#1d2128;--fg:#e7eaf0;--mut:#9aa3b2;--line:#2c323c}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,Segoe UI,sans-serif}main{max-width:1100px;margin:0 auto;padding:24px 16px}
h1{font-size:22px;margin:0 0 4px}.sub{color:var(--mut);margin-bottom:18px}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:20px}
.tile{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 12px}.tile b{font-size:22px;display:block}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:8px;overflow:hidden;margin-bottom:12px}
th,td{text-align:left;padding:7px 9px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:12px;color:var(--mut);font-weight:600}
.v{font-weight:700;white-space:nowrap}.pass{color:var(--pass)}.fail{color:var(--fail)}.block{color:var(--block)}.info{color:var(--info)}.pend{color:var(--pend)}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:16px 0}.card h3{margin:0 0 4px;font-size:16px}.meta{color:var(--mut);font-size:12px;margin-bottom:8px}
figure{margin:10px 0}figure img{max-width:100%;border:1px solid var(--line);border-radius:6px}figcaption{font-size:12px;color:var(--mut)}
ul{margin:6px 0 0 18px;padding:0}.wrap{overflow-x:auto}
</style></head><body><main>
<h1>Retest Round 12 — status</h1>
<div class="sub">Mahmoud Mohamed · NDC · 17 tickets (NDC-2791..2798 ignored) · NDC-Staging, Edge headless + API · ${esc(new Date().toLocaleString('en-GB', { timeZone: 'Africa/Cairo' }))} Cairo · nothing posted to Plane yet</div>
<div class="tiles"><div class="tile"><b class="pass">${count('pass')}</b>Pass</div><div class="tile"><b class="fail">${count('fail')}</b>Fail</div><div class="tile"><b class="block">${count('block')}</b>Blocked</div><div class="tile"><b class="info">${count('info')}</b>Tested by you</div><div class="tile"><b class="pend">${count('pend')}</b>Running / pending</div></div>
<div class="wrap"><table><tr><th>Ticket</th><th>Module</th><th>Priority</th><th>Title</th><th>Verdict</th><th>Proposed Plane action</th></tr>
${T.map(t => `<tr><td>${t.key}</td><td>${t.mod}</td><td>${t.pri}</td><td>${esc(t.title)}</td><td class="v ${cls(t.verdict)}">${esc(t.verdict)}</td><td>${esc(t.action)}</td></tr>`).join('')}</table></div>
${T.filter(t => t.checks.length).map(t => `<section class="card"><h3>${t.key} · <span class="${cls(t.verdict)}">${esc(t.verdict)}</span></h3><div class="meta">${esc(t.title)} · ${t.mod} · ${t.pri} · previous: ${esc(t.prev)}</div>
<div class="wrap"><table><tr><th>Check</th><th>Expected (ticket)</th><th>Now</th><th>Result</th></tr>${t.checks.map(c => `<tr><td>${esc(c[0])}</td><td>${esc(c[1])}</td><td>${esc(c[2])}</td><td class="v ${cls(c[3])}">${c[3]}</td></tr>`).join('')}</table></div>
${t.imgs.map(([f, cap]) => img(f) ? `<figure><img src="${img(f)}" alt="${esc(cap)}"><figcaption>${esc(cap)}</figcaption></figure>` : '').join('')}</section>`).join('')}
<section class="card"><h3>Open points for you</h3><ul>
<li><b>NDC-2630</b>: the original failure (connected Zoho without zoid, sender who isn't the mailbox) needs a taviportal.com user with CRM mail access. Adding a CRM profile was refused by the auto-mode safety check. Either grant one yourself, or I post a partial result.</li>
<li><b>NDC-2219</b> (Desk) needs a CRM profile change for a test user too. Expect the same block.</li></ul></section>
<section class="card"><h3>Environment & security notes</h3><ul>
<li>Staging was slow on 4 Nov: the Work Queue took up to about 4 min to show records; POST /notifications/realtime-ticket → 503 (notify service unavailable). The API itself was fast (records 0.5 s).</li>
<li>The invite API response printed an invitation token for the QA invite qa.rt12.2773@example.com in my console. It will be cancelled at cleanup. No passwords or session tokens were printed.</li></ul></section>
<section class="card"><h3>Data created / changed so far (cleanup at the end)</h3><ul>
<li>Leads: "QA RT12 1948 lead" (by test user 1), "QA RT12 2630 lead" (owner) + its unsent draft</li>
<li>Invitation qa.rt12.2773@example.com (pending user)</li>
<li>Timeline Visibility policy: Allow → Deny → <b>restored to Allow</b></li>
<li>Owner's Work Queue Tasks sort changed to Subject ascending</li></ul></section>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'status-r12.html'), html); console.log('written', (html.length / 1024).toFixed(0) + ' KB');
