// node mk-review20.js → ../review-r20.html : review of retest round 20 (17 Nov 2026). Data: plane-draft.json + lane results.
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const d = require('../plane-draft.json');
const css = fs.readFileSync(path.join(RUN, '../execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/mk-review.js'), 'utf8').match(/const css = `([\s\S]*?)`;/)[1];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const txt = h => String(h || '').replace(/<br\s*\/?>/g, '\n').replace(/<\/(p|li|tr|h\d)>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/[ \t]+/g, ' ');
const checks = h => { const m = txt(h).split(/Checked:/)[1] || ''; return m.split(/Still failing:|Evidence:/)[0].trim(); };
const still = h => { const m = txt(h).split(/Still failing:/)[1]; return m ? m.split(/Evidence:/)[0].trim() : ''; };
const img = f => fs.existsSync(path.join(RUN, 'screenshots/annotated', f)) ? `<a href="screenshots/annotated/${esc(f)}" target="_blank"><img loading="lazy" src="screenshots/annotated/${esc(f)}" alt="${esc(f)}"></a>` : `<a href="../execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/annotated/${esc(f)}" target="_blank"><img loading="lazy" src="../execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/annotated/${esc(f)}" alt="${esc(f)}"></a>`;
const by = t => d.find(x => x.ticket === t);
const DONE = ['NDC-2729', 'NDC-2933', 'NDC-3013', 'NDC-3018', 'NDC-3055', 'NDC-3071', 'NDC-3072', 'NDC-3073'];
const HELD = { 'NDC-3067': 'Most web-app changes now show the user\'s public IP (499 rows). Still failing: agent/permission changes show 172.19.0.19, Recycle Bin restore 172.19.0.36, blueprint runs and mass deletes show no IP.',
  'NDC-3027': 'Delete/restore entries now name the ticket by subject; no EngineDeletedAt, no email; round 18\'s department item fixed. Still failing: other entries use internal names ("IsActive", "Version").',
  'NDC-1988': '3 of 6 items built (layout rules, cross-field validation rules, nested picklists 7 levels). Missing: picklist values per layout, Help Center access per field, field encryption with ePHI label — none of the three is on the NDC-2996 gap list.',
  'NDC-1483': 'Works end to end (points, operators, rescoring existing leads, on/off/delete, list/view/workflow/report use, permissions, audit). Defect: reports keep old scores after a background rescore. 7 Zoho gaps already on NDC-2934.' };
const DEC = [
  { t: 'NDC-3064', q: 'The new Edit form saves contact, subject, description and priority together; Add / Change / Remove contact work and survive reload. Status, Ticket Owner and Department are not in the Edit form (still inline / Move).', o: '(a) Done — those 3 stay inline · (b) Bug for the 3 fields' },
  { t: 'NDC-3065', q: 'Read-only through role is fully fixed (designer, owners list, Assign owners, API refusals, "Read only" marker). The ticket\'s exact case still happens: a normal agent who can only read another person\'s ticket is offered the transition and Run moves the ticket (developer decision B-14 keeps this). Right after, the agent loses access to the ticket ("not available").', o: '(a) Bug — keep the ticket\'s expectation · (b) accept B-14 and file only the access-loss problem' },
];
const BLOCK = [
  { t: 'NDC-2275', title: 'Assignment Rules: Direct Assignment and Round Robin (requirements)', img: 'NDC-2275-retest-FAIL.png', s: 'Round robin assigned nothing 09:38–10:15 UTC — 13 tickets stayed Unassigned, even with plain control rules (no threshold, online owner as the pool). Held: the phantom-count fix (Test User 1 counts 4, Dev Team 2 counts 1 = real), import to importer (GEN-13), English help text. Lane verdict FAIL; my call: blocked by the staging outage.' },
  { t: 'NDC-3000', title: 'Email | acknowledgement emails + rating link', img: 'NDC-3000-retest-PENDING.png', s: 'Passed: new-ticket acknowledgement for #4745 (one copy, user inbox, 16 Nov) and the rating link in the closed email. Blocked: reply acknowledgement — the user\'s reply to #4745 (09:58 Cairo, correct address) and a new "inbound check" email never reached staging; address active/verified, quarantine empty.' },
  { t: 'NDC-3068', title: 'Ticket History | Closed Time / Resolution Time', img: 'NDC-3068-retest-PARTIAL.png', s: 'The reported entry on #4177 now reads correctly ("Closed Time 16/11/2026 11:48 AM", "Resolution Time Less than a minute"). Tickets closed today get neither line — caused by the history outage, so the fix can\'t be judged on new tickets.' },
];
const NEW = [
  ['High', 'Staging outage since ~17 Nov morning: incoming email, ticket history (status/blueprint events, closed time, desk status after blueprint runs) and round robin assignment all stopped', 'all lanes; verified by the lead (#4807/#4811/#4829 vs #4699)', 'Ask devs / file'],
  ['Medium', 'Agent loses access to another person\'s ticket right after running its transition', 'NDC-3065', 'depends on the 3065 decision'],
  ['Medium/Low', 'CRM reports keep old Score after a background rescore (list + API correct)', 'NDC-1483', ''],
  ['Low', 'Disabling a department with a transfer target moves its tickets to the default department instead', 'NDC-3027 lane', 'needs confirming'],
  ['Low', 'Mark as Spam dialog doesn\'t warn that sharing will be revoked; re-share refusal uses the "add conversation" wording; Actions still offers a custom action on spam', 'NDC-3073', 'Zoho warns'],
  ['Low', 'Sidebar view count stays at 300 after bulk delete until reload', 'NDC-3055', 'cosmetic'],
  ['Low', 'Records API: some malformed kinds report error path "", "kind" or "value" instead of data[i].value', 'NDC-3071', ''],
  ['INFO', 'Clone fills current user as Ticket Owner (Zoho: Unassigned); Run scoring rules has no confirmation (12,041 leads); score workflow does not fire on background rescore', 'NDC-3072 / 1483', 'parity / decision'],
];
const row = x => `<tr><td><b>${x.ticket}</b><br><span class="pill PASS">PASS</span></td><td>${esc(x.title)}</td><td><details><summary>${esc(checks(x.comment_html).slice(0, 120))}…</summary>${esc(checks(x.comment_html))}</details></td><td>${x.images.map(img).join('')}</td></tr>`;
let h = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest Round 20 Review</title><style>${css}</style></head><body><main>
<h1>Retest round 20 — review</h1>
<div class="muted">Mahmoud Mohamed's Ready For Test tickets · NDC · 17 Nov 2026 · NDC-Staging (staging-desk / staging-crm) · 5 parallel lanes · Edge + API</div>
<div class="tiles">
<div class="tile"><b>17</b><span>tickets in Ready For Test, all tested</span></div>
<div class="tile t-pass"><b>8</b><span>PASS → moved to Done (posted, read back)</span></div>
<div class="tile t-part"><b>5</b><span>PARTIAL — held for your OK</span></div>
<div class="tile t-you"><b>2</b><span>need your decision</span></div>
<div class="tile t-fail"><b>3</b><span>blocked by the staging outage</span></div>
<div class="tile t-info"><b>0</b><span>posted as Bug yet</span></div>
</div>
<div class="card fail"><h3>⚠ Staging outage found today</h3>Since early 17 Nov staging stopped three background jobs at once: <b>incoming email</b> (two user emails never arrived), <b>ticket history</b> (no status/blueprint events, no closed or resolution time, desk status stays Open after a blueprint run — verified on #4807, #4811, #4829 vs yesterday's #4699) and <b>round robin assignment</b> (nothing assigned since 16 Nov 12:15 UTC). It looks like one stopped service. Not filed yet. It blocks NDC-2275, NDC-3000 and NDC-3068.</div>

<h2>1 · Needs your decision</h2>`;
for (const x of DEC) { const e = by(x.t); h += `<div class="card you"><h3>${x.t} <span class="pill YOU">DECISION</span> <span class="muted" style="font-weight:400">${esc(e.title)}</span></h3><div>${esc(x.q)}</div><div class="ask"><b>Options:</b> ${esc(x.o)}</div><details><summary>Evidence</summary>${e.images.map(img).join('')}</details></div>`; }
h += `<div class="card you"><h3>Also waiting on you</h3><ul><li>Raise the staging outage with the developers, or let me file it (High).</li><li>OK to move the 4 held partials below to Bug with their comments and images.</li><li>Which new findings (section 5) to draft.</li><li>Cleanup of rounds 18–20 test data, including switching off 16 old "QA RT18 SR" scoring rules that still add points to every lead.</li></ul></div>

<h2>2 · Blocked by the staging outage (3)</h2>`;
for (const b of BLOCK) h += `<div class="card"><h3>${b.t} <span class="pill INFO">BLOCKED</span> <span class="muted" style="font-weight:400">${esc(b.title)}</span></h3><div>${esc(b.s)}</div><details><summary>Evidence</summary>${img(b.img)}</details></div>`;
h += `<p class="muted">Plan: when staging recovers, retest these three (about 30 min); for 3000 the user replies to #4745 once more if the earlier reply never shows.</p><h2>3 · Partial — held, proposed → Bug (4)</h2>`;
for (const [t, s] of Object.entries(HELD)) { const e = by(t); h += `<div class="card fail"><h3>${t} <span class="pill PARTIAL">PARTIAL</span> <span class="muted" style="font-weight:400">${esc(e.title)}</span></h3><div>${esc(s)}</div><details><summary>Still failing (as it will be posted) + evidence</summary><div>${esc(still(e.comment_html))}</div><div class="thumbs">${e.images.map(img).join('')}</div></details></div>`; }
h += `<h2>4 · Passed → Done (8, posted)</h2><div class="wrap"><table><tr><th>Ticket</th><th>Title</th><th>What proved it</th><th>Evidence</th></tr>${DONE.map(t => row(by(t))).join('')}</table></div>
<h2>5 · New findings — not filed</h2><div class="wrap"><table><tr><th>Sev</th><th>Finding</th><th>Found in</th><th>Note</th></tr>${NEW.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</table></div>
<h2>6 · How the round ran</h2><ul>
<li>5 parallel lanes on one owner session (renewed by one keeper process; owner re-signed once at 08:2x UTC with your OK after the overnight expiry). Lanes: Assignment+Skills, Blueprint/History/Audit, Tickets, Validation+Layout rules, CRM Scoring.</li>
<li>Extra sign-ins: one QA agent (Customer Experience Specialists 2) for NDC-3065, one CRM user (Mahmoud Samy) for NDC-1483 permissions. Zoho CRM opened read-only; no Zoho data created.</li>
<li>All data prefixed "QA RT20", ${fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8').split('\n').filter(l => l.startsWith('- ') || l.startsWith('|')).length} ledger lines; rules/blueprints/workflows left inactive; settings and agents restored. Cleanup pending your OK.</li>
<li>Privacy: one lane's tool output briefly showed real contact addresses from the contact picker; never written to a file or image, screenshot deleted, all evidence masked.</li></ul>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'review-r20.html'), h);
console.log('written review-r20.html', (h.length / 1024).toFixed(0) + ' KB');
