// Builds report/bug-drafts.html: standalone Plane-ready drafts of the 9 Tia bugs (not filed).
const fs = require('fs'), path = require('path');
const { ENV, bugs } = require('./bug-drafts.js');
const RT = require('./retest-drafts.js'); const ENV2 = 'NDC-Staging (staging-crm / staging-desk.taviportal.com), Tia v37–38, 24 Nov 2026, Edge + API';
const OUT = path.join(__dirname, 'report'); fs.mkdirSync(OUT, { recursive: true });
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const FIND = [
  ['B-13', 'Setup API', 'Saving a draft with only some fields wipes the rest (tools, write modules, instructions) and returns 200.'],
  ['B-12b', 'Setup API', 'A draft save without expected_updated_at is accepted, so two admins can overwrite each other.'],
  ['C-10', 'Setup API', 'enabled_apps [] is accepted and treated as all apps; the page blocks it.'],
  ['G-05 / G-16', 'Setup API', 'Out-of-range values are clamped silently: per-user limit -1 saved as 0 (blocks everyone); strong steps 11 → 10, -1 → 0, 101 → 100.'],
  ['G-12', 'Setup page', 'Cap changes sometimes take about 45 s, although the page says "It applies at once".'],
  ['D-06', 'Setup page', 'The owner is locked out of the chat when the audience does not list them.'],
  ['A-07', 'Permissions', 'Removing "Chat with Tia" takes effect only after the next token refresh (up to about 2.5 min).'],
  ['B-01b', 'Setup page', 'The Settings menu shows both "Tia Assistant" and "Tia" for the same page.'],
  ['E-01b', 'Setup page', 'The Knowledge Base tab shows the raw key "agents.wizard.kb.uploadTitle".'],
  ['B-16', 'Chat panel', 'A deactivated Tia says "Tia has not been set up…" (reason not_configured).'],
  ['E-02', 'Chat panel', '"What Tia can see" lists CRM, Analytics and "Propose a ticket comment" to a Desk agent with no CRM app.'],
  ['M-06', 'Chat panel', 'The panel is a dialog, but keyboard focus is not kept inside it.'],
  ['L-03', 'Chat panel', 'After a cut stream the reply is lost (turn not_found), and asking again is charged again.'],
  ['E-07', 'Answers', 'Workflow card ignores the requested rule name and shows raw JSON; a false "no permission" message when the cause is the module list.'],
  ['E-10', 'Answers', 'When Explain is off for an area, the reason given is wrong ("requires the account ID").'],
  ['J-01 / J-04', 'Action cards', 'Cards show field keys (first_name) instead of labels; update cards show only the new value.'],
  ['J-15', 'Action cards', 'A card is offered for an invalid record and fails with the raw code RECORD_VALIDATION_FAILED.'],
  ['I-19 / I-20', 'Answers', 'Setup explanations are generic, mix in unrelated steps and give no help link.'],
  ['I-21', 'Answers', 'Desk KB articles are not used until KB sync is set up in the Desk integration settings (not set up on this tenant).'],
];
const plain = b => [b.title, '', `Priority: ${b.pri} · App: ${b.app} · Cases: ${b.cases}`, '', 'Steps to reproduce', ...b.steps.map((s, i) => `${i + 1}. ${s}`), '', 'Expected result', b.expected, '', 'Actual result', b.actual, ...b.more.map(m => '- ' + m), '', `Account: ${b.account}`, `Environment: ${b.env || ENV}`].join('\n');
const card = b => `<article class="bug" id="bug-${b.n}">
  <div class="bh"><span class="num">Bug ${b.n}</span>${b.plane ? `<span class="chip mono">${esc(b.plane)}</span>` : `<span class="chip draft">Draft, not filed</span>`}<span class="sev sev-${b.pri.toLowerCase()}">${b.pri}</span>${b.kind ? `<span class="chip">${esc(b.kind)}</span>` : ''}<span class="chip">${esc(b.app)}</span><span class="chip mono">${esc(b.cases)}</span><button type="button" class="copy" data-n="${b.n}" id="copy-${b.n}">Copy draft</button></div>
  <h2>${esc(b.title)}</h2>
  <div class="grid"><div><h3>Steps to reproduce</h3><ol>${b.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol><h3>Account</h3><p>${esc(b.account)}</p></div>
  <div><h3>Expected result</h3><p>${esc(b.expected)}</p><h3>Actual result</h3><p>${esc(b.actual)}</p>${b.more.length ? `<ul>${b.more.map(m => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}</div></div>
  ${b.images ? `<div class="shots">${b.images.map(([f, c]) => `<figure><a href="img/${esc(f)}" target="_blank" rel="noopener"><img src="img/${esc(f)}" alt="${esc(c)}" loading="lazy"></a><figcaption>${esc(c)}</figcaption></figure>`).join('')}</div>` : ''}
  <textarea hidden id="txt-${b.n}">${esc(plain(b))}</textarea>
</article>`;
const hi = bugs.filter(b => b.pri === 'High').length;
const html = `<title>Tia Bug Drafts</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: one reading column; an index table, then one card per Plane draft, then lower findings. */
:root { --bg:#f6f7f9; --panel:#ffffff; --fg:#1b2330; --muted:#5d6878; --line:#dde2e9; --accent:#2b5fab; --high:#c23b3b; --med:#b56d0c;
  --sans:'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif; --mono:'IBM Plex Mono', ui-monospace, Consolas, monospace; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#12161c; --panel:#1a2029; --fg:#e4e8ee; --muted:#9aa5b4; --line:#2d3542; --accent:#7aa7ec; --high:#e86b6b; --med:#e7a54a; color-scheme:dark } }
:root[data-theme="dark"] { --bg:#12161c; --panel:#1a2029; --fg:#e4e8ee; --muted:#9aa5b4; --line:#2d3542; --accent:#7aa7ec; --high:#e86b6b; --med:#e7a54a; color-scheme:dark }
body { background:var(--bg); color:var(--fg); font-family:var(--sans); font-size:15px; line-height:1.55; margin:0 }
a { color:var(--accent) }
.wrap { max-width:1080px; margin:0 auto; padding-block:28px 60px; padding-left:max(16px, env(safe-area-inset-left, 0px)); padding-right:max(16px, env(safe-area-inset-right, 0px)); display:grid; gap:20px }
.eyebrow { font:500 12px/1 var(--mono); letter-spacing:.08em; text-transform:uppercase; color:var(--accent) }
h1 { font-size:clamp(26px, 4vw, 34px); line-height:1.15; margin:6px 0 4px; text-wrap:balance }
h2 { font-size:18px; line-height:1.35; margin:8px 0 6px; text-wrap:balance }
h3 { font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); margin:12px 0 4px }
p { margin:0 0 6px; max-width:75ch }
.meta { display:flex; flex-wrap:wrap; gap:6px 18px; color:var(--muted); font-size:13.5px } .meta b { color:var(--fg); font-weight:600 }
.box, .bug { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:16px 20px; min-width:0 }
.bug { scroll-margin-top:12px }
.bh { display:flex; flex-wrap:wrap; align-items:center; gap:8px }
.num { font:600 13px var(--mono) }
.sev { font:600 11px/1.7 var(--mono); padding:0 8px; border-radius:4px; border:1px solid currentColor } .sev-high { color:var(--high) } .sev-medium { color:var(--med) } .sev-low { color:var(--muted) } .draft { color:var(--accent); border-color:var(--accent) } .grp { font-size:22px; margin:18px 0 0 } .cm { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:16px 20px; min-width:0 }
.chip { font-size:12px; color:var(--muted); border:1px solid var(--line); border-radius:20px; padding:0 9px } .mono { font-family:var(--mono) }
.copy { margin-left:auto; font:500 13px var(--sans); color:var(--accent); background:transparent; border:1px solid var(--line); border-radius:6px; padding:4px 10px; cursor:pointer }
.copy:hover { border-color:var(--accent) } .copy:focus-visible, a:focus-visible { outline:2px solid var(--accent); outline-offset:2px }
.grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:4px 26px } .grid > * { min-width:0 }
ol, ul { margin:0; padding-left:20px } li { margin:3px 0 }
.scroll { overflow-x:auto } table { border-collapse:collapse; width:100%; font-size:13.5px }
th, td { text-align:left; vertical-align:top; padding:7px 8px; border-bottom:1px solid var(--line) }
th { font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.05em; font-weight:600; white-space:nowrap }
td.id { font-family:var(--mono); font-size:12.5px; white-space:nowrap } td.id a { text-decoration:none }
.sub { color:var(--muted); font-size:13px }
.shots { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:12px; margin-top:12px } .shots figure { margin:0; border:1px solid var(--line); border-radius:8px; overflow:hidden } .shots img { width:100%; height:150px; object-fit:cover; object-position:top; display:block } .shots figcaption { font-size:12px; color:var(--muted); padding:5px 8px }
</style>
<div class="wrap">
<header>
  <div class="eyebrow">Tia bugs · 16 filed in Plane · CRM + Desk + Omnichannel</div>
  <h1>Tia Bug Drafts</h1>
  <div class="meta"><span><b>Bugs</b> ${bugs.length} (${hi} High, ${bugs.length - hi} Medium)</span><span><b>From</b> TIA Assistant run, 23–24 Nov 2026</span><span><b>Environment</b> NDC-Staging</span><span><b>Plane</b> NDC-3244 – NDC-3247, NDC-3249 – NDC-3255 (Sprint 17, state Bug)</span><span><b>Retest 24 Nov</b> NDC-3257 – NDC-3261 filed; drafts 17 – 21 not filed yet; comments posted on NDC-3244, 3245, 3246, 3250, 3254</span></div>
</header>

<section class="box" style="border-color:var(--accent)"><p><b>From the 24 Nov retest:</b> ${RT.bugs.map(b => `<a href="#bug-${b.n}">${b.n}. ${esc(b.title.replace(/^Tia | /, ''))}</a>`).join(' · ')} · <a href="#comments">comment drafts for NDC-3244, 3245, 3246, 3254</a></p></section>

<section class="box">
  <p>Each bug below is filed in Plane under the ticket shown; the text matches what was filed: title in "Feature | Title" form, steps, expected and actual results, account and environment. "Copy draft" copies the plain text of one draft. Assignee, state, module, sprint and labels are left for you to choose when filing.</p>
  <div class="scroll"><table><thead><tr><th>#</th><th>Plane</th><th>Priority</th><th>Title</th><th>App</th></tr></thead><tbody>
  ${bugs.map(b => `<tr><td class="id"><a href="#bug-${b.n}">${b.n}</a></td><td class="id">${esc(b.plane || '')}</td><td><span class="sev sev-${b.pri.toLowerCase()}">${b.pri}</span></td><td><a href="#bug-${b.n}">${esc(b.title.replace(/^Tia \| /, ''))}</a></td><td class="sub">${esc(b.app)}</td></tr>`).join('')}
  </tbody></table></div>
</section>

${bugs.map(card).join('\n')}

<h2 class="grp" id="retest">Retest 24 Nov: NDC-3257 – NDC-3261 (filed) and drafts 17 – 21 (not filed)</h2>
<section class="box"><p>From the retest of 24 Nov 2026 (spec docs/tia-assistant/retest-spec-24nov.md, results in executions/execu_2026-11-24_tia-retest). 12–16 are filed in Plane (Sprint 17, state Bug, label AI Features) with annotated screenshots. 17–21 are drafts from the last round of the retest, not filed. The rate limit (L-08: refused after 20 messages in about 50 s) is protective behaviour and is not drafted.</p>
<div class="scroll"><table><thead><tr><th>#</th><th>Priority</th><th>Title</th><th>App</th></tr></thead><tbody>${RT.bugs.map(b => `<tr><td class="id"><a href="#bug-${b.n}">${b.n}</a></td><td><span class="sev sev-${b.pri.toLowerCase()}">${b.pri}</span></td><td><a href="#bug-${b.n}">${esc(b.title.replace(/^Tia \| /, ''))}</a></td><td class="sub">${esc(b.app)}</td></tr>`).join('')}</tbody></table></div></section>
${RT.bugs.map(b => card({ ...b, env: ENV2 })).join('\n')}

<h2 class="grp" id="comments">Retest 24 Nov: comments on filed tickets (posted 24 Nov)</h2>
${RT.comments.map((c, i) => `<article class="cm"><div class="bh"><span class="num">${esc(c.ticket)}</span><span class="chip">${esc(c.title)}</span>${c.posted ? `<span class="chip mono">Posted 24 Nov</span>` : `<span class="chip draft">Comment draft, not posted</span>`}<button type="button" class="copy" data-n="c${i}" id="copy-c${i}">Copy comment</button></div><ul>${c.text.map(t => `<li>${esc(t)}</li>`).join('')}</ul>${c.images ? `<div class="shots">${c.images.map(([f, cap]) => `<figure><a href="img/${esc(f)}" target="_blank" rel="noopener"><img src="img/${esc(f)}" alt="${esc(cap)}" loading="lazy"></a><figcaption>${esc(cap)}</figcaption></figure>`).join('')}</div>` : ''}<textarea hidden id="txt-c${i}">${esc(c.text.join('\n'))}</textarea></article>`).join('\n')}


<section class="box">
  <h2>Lower findings (not drafted as bugs)</h2>
  <p class="sub">The feature works, but these read badly or carry a risk. Tell me which, if any, should become bugs.</p>
  <div class="scroll"><table><thead><tr><th>Case</th><th>Area</th><th>Finding</th></tr></thead><tbody>
  ${FIND.filter(f => !['M-06', 'J-01 / J-04'].includes(f[0])).map(f => `<tr><td class="id">${esc(f[0])}</td><td class="sub">${esc(f[1])}</td><td>${esc(f[2])}</td></tr>`).join('')}
  </tbody></table></div>
</section>
<p class="sub">Environment for every draft: ${esc(ENV)}. Full results: TIA Assistant Execution Report. Source: docs/tia-assistant/bug-drafts.js.</p>
</div>
<script>
document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', () => {
  const t = document.getElementById('txt-' + b.dataset.n);
  const done = () => { b.textContent = 'Copied'; setTimeout(() => b.textContent = b.dataset.n.startsWith('c') ? 'Copy comment' : 'Copy draft', 1500); };
  const fallback = () => { t.hidden = false; t.select(); try { document.execCommand('copy'); done(); } catch (e) { b.textContent = 'Select the text and copy'; } t.hidden = true; };
  try { navigator.clipboard.writeText(t.value).then(done, fallback); } catch (e) { fallback(); }
}));
</script>`;
fs.writeFileSync(path.join(OUT, 'bug-drafts.html'), html);
console.log('ok', bugs.length);
