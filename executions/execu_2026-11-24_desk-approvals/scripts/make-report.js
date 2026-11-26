// Builds report.html from out/results.jsonl + the spec table titles. node scripts/make-report.js
const fs = require('fs'), path = require('path');
const RUN = path.resolve(__dirname, '..');
const ISSUES = process.argv.includes('--issues');
const KEEP = ['FAIL', 'PARTIAL', 'INCONCLUSIVE'];
const spec = fs.readFileSync(path.resolve(RUN, '../../docs/desk-pending-approvals/spec-desk-approvals-page.md'), 'utf8');
const rows = []; let group = '';
for (const line of spec.split(/\r?\n/)) {
  const g = line.match(/^## (Group [A-Z] — .+|E2E journeys.*)$/); if (g) { group = g[1].replace(/`\[serial\]`/, '').trim(); continue; }
  const m = line.match(/^\| ((?:[A-HKLNZ]\d+)|E2E-\d) \| ([^|]+) \|/); if (m) rows.push({ id: m[1], title: m[2].trim(), group });
}
const last = {}; for (const l of fs.readFileSync(path.join(RUN, 'out/results.jsonl'), 'utf8').trim().split('\n')) { const r = JSON.parse(l); last[r.id] = r; }
const V = id => (last[id] ? last[id].verdict : 'NOT RUN');
const cls = v => ({ PASS: 'pass', FAIL: 'fail', PARTIAL: 'part', INCONCLUSIVE: 'inc', 'NOT RUN': 'nr', 'NOT IN RELEASE': 'nir' })[v] || 'inc';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const counts = {}; for (const r of rows) counts[V(r.id)] = (counts[V(r.id)] || 0) + 1;
const findings = JSON.parse(fs.readFileSync(path.join(RUN, 'findings.json'), 'utf8'));
const shown = ISSUES ? rows.filter(r => KEEP.includes(V(r.id))) : rows;
const groups = [...new Set(shown.map(r => r.group))];
const order = ['PASS', 'FAIL', 'PARTIAL', 'INCONCLUSIVE', 'NOT RUN', 'NOT IN RELEASE'];
const html = `${ISSUES ? "<title>NDC-2871 Approvals Issues</title>" : "<title>NDC-2871 Approvals Retest</title>"}
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: one reading column; verdict strip, findings, then the case ledger grouped like the spec */
:root{--bg:#f6f7f9;--panel:#ffffff;--fg:#1b2330;--muted:#5d6878;--line:#dde2ea;--accent:#2f5bd3;
--pass:#1f7a4d;--pass-bg:#e3f4ea;--fail:#b42323;--fail-bg:#fbe5e5;--part:#9a5b00;--part-bg:#fdf0d9;--inc:#4f5b6b;--inc-bg:#eceff3;--nir:#5b4bb0;--nir-bg:#ece9fa;
--sans:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',sans-serif;--mono:'IBM Plex Mono',ui-monospace,Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#11151b;--panel:#181e26;--fg:#e4e8ee;--muted:#9aa5b4;--line:#2a323d;--accent:#7f9fff;
--pass:#6fd19c;--pass-bg:#173326;--fail:#ff8a8a;--fail-bg:#3a1a1c;--part:#f2bd62;--part-bg:#3a2a10;--inc:#b3bdca;--inc-bg:#242b35;--nir:#b9adff;--nir-bg:#2a2545;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#11151b;--panel:#181e26;--fg:#e4e8ee;--muted:#9aa5b4;--line:#2a323d;--accent:#7f9fff;
--pass:#6fd19c;--pass-bg:#173326;--fail:#ff8a8a;--fail-bg:#3a1a1c;--part:#f2bd62;--part-bg:#3a2a10;--inc:#b3bdca;--inc-bg:#242b35;--nir:#b9adff;--nir-bg:#2a2545;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:15px/1.55 var(--sans)}
.wrap{max-width:1100px;margin:0 auto;padding-block:32px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:28px}
h1{font-size:26px;font-weight:600;margin:0;text-wrap:balance}h2{font-size:18px;font-weight:600;margin:0 0 12px}
.sub{color:var(--muted);margin:4px 0 0;max-width:70ch}
.meta{font:13px var(--mono);color:var(--muted);display:flex;flex-wrap:wrap;gap:6px 18px}
.strip{display:flex;flex-wrap:wrap;gap:8px}
.chip{font:600 13px var(--sans);padding:4px 10px;border-radius:999px;font-variant-numeric:tabular-nums}
.pass{color:var(--pass);background:var(--pass-bg)}.fail{color:var(--fail);background:var(--fail-bg)}.part{color:var(--part);background:var(--part-bg)}
.inc,.nr{color:var(--inc);background:var(--inc-bg)}.nir{color:var(--nir);background:var(--nir-bg)}
section.panel{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:20px}
.f{display:grid;grid-template-columns:88px 1fr;gap:4px 14px;padding:14px 0;border-top:1px solid var(--line)}.f:first-of-type{border-top:0}
.f .sev{font:600 12px var(--mono);text-transform:uppercase;letter-spacing:.04em;align-self:start;padding:3px 8px;border-radius:4px;text-align:center}
.f h3{margin:0;font-size:15px;font-weight:600}.f p{margin:4px 0 0;color:var(--fg);max-width:80ch}.f .ids{font:12px var(--mono);color:var(--muted)}
.tbl{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13.5px}
th,td{text-align:left;padding:8px 10px;border-top:1px solid var(--line);vertical-align:top}th{font-weight:600;color:var(--muted);font-size:12px;letter-spacing:.04em;text-transform:uppercase}
td.id{font:500 13px var(--mono);white-space:nowrap}td.v span{white-space:nowrap}td.note{color:var(--muted);min-width:260px;max-width:560px;word-break:break-word}
.gh td{background:var(--bg);font-weight:600;color:var(--fg)}
.ok{border-left:3px solid var(--pass);padding:10px 14px;background:var(--pass-bg);border-radius:4px}
code{font-family:var(--mono);font-size:12.5px}
@media (max-width:640px){.f{grid-template-columns:1fr}.f .sev{justify-self:start}}
</style>
<div class="wrap">
<header>
<h1>${ISSUES ? "NDC-2871 Desk Approvals page: open issues" : "Retest: NDC-2871 Desk Approvals page and NDC-3186"}</h1>
<p class="sub">Run on NDC-Staging (staging-desk.taviportal.com), 24 Nov 2026. Accounts: owner, Test User 1 (requester, Desk Supervisor), Customer Experience Specialists 2 (approver, Desk Agent), QA Team 1 (team member, Desk Administrator), Mahmoud TAVIPortal (supervisor of a second department). All test data was named "QA PA …" and removed afterwards.</p>
</header>
${ISSUES ? "" : `<section class="panel"><h2>NDC-3186 · Workflow Rules "Field changed" on create</h2>
<div class="ok"><strong>Fixed.</strong> On Create rules with "Priority changed" (created High, Medium default, Low) and "Subject changed" did not run. Create or Edit with "Priority changed" did not run on create and ran once on the Priority edit (Low → High). On Edit ran on the Priority edit and not on another field's edit. Control: a plain On Create rule on the same department ran on create, so the empty results are real.</div></section>
`}<section class="panel"><h2>NDC-2871 · ${rows.length} spec cases</h2>
<div class="strip">${order.filter(k => counts[k]).map(k => `<span class="chip ${cls(k)}">${counts[k]} ${k.toLowerCase()}</span>`).join('')}</div>
<p class="sub" style="margin-top:12px">${esc(findings.summary)}</p></section>
<section class="panel"><h2>Findings</h2>
${findings.items.map(f => `<div class="f"><span class="sev ${f.sev === 'Bug' ? 'fail' : f.sev === 'Gap' ? 'part' : 'inc'}">${esc(f.sev)}</span><div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p><div class="ids">${esc(f.ids)}</div></div></div>`).join('\n')}
</section>
<section class="panel"><h2>${ISSUES ? "Failed, partial and inconclusive cases (" + shown.length + ")" : "All cases"}</h2><div class="tbl"><table><thead><tr><th>ID</th><th>Case</th><th>Result</th><th>What happened</th></tr></thead><tbody>
${groups.map(g => `<tr class="gh"><td colspan="4">${esc(g)}</td></tr>` + shown.filter(r => r.group === g).map(r => `<tr><td class="id">${r.id}</td><td>${esc(r.title)}</td><td class="v"><span class="chip ${cls(V(r.id))}">${esc(V(r.id).toLowerCase())}</span></td><td class="note">${esc(last[r.id]?.note || '')}</td></tr>`).join('')).join('\n')}
</tbody></table></div></section>
</div>`;
fs.writeFileSync(path.join(RUN, ISSUES ? 'report-issues.html' : 'report.html'), html);
console.log(JSON.stringify(counts));
