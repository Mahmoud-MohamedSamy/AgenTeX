// Builds report/index.html from RESULTS.md (the matrix) + the 4 approved images in report/img.
const fs = require('fs'), path = require('path');
const RUN = path.resolve(__dirname, '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rows = fs.readFileSync(path.join(RUN, 'RESULTS.md'), 'utf8').split('\n').filter(l => /^\| SK-/.test(l))
  .map(l => l.split('|').slice(1, -1).map(c => c.trim()));
const kind = v => /bug/i.test(v) ? 'bug' : /^Differs/.test(v) ? 'diff' : /extra/i.test(v) ? 'extra' : /Not compared/i.test(v) ? 'nc' : 'same';
const label = { bug: 'Bug', diff: 'Differs', extra: 'TAVI extra', nc: 'Not compared', same: 'Same' };
const AREA = { A: 'Skills list', B: 'Skill form', C: 'Skill types', D: 'Status, limits, delete', E: 'Preferences', F: 'Agents', G: 'Ticket skills', H: 'Skill-based assignment', I: 'Workflow actions', J: 'Layout and ticket page', K: 'Permissions' };
const order = 'ABCDEFGHIJK';
rows.sort((a, b) => order.indexOf(a[0][3]) - order.indexOf(b[0][3]) || a[0].localeCompare(b[0], 'en', { numeric: true }));
const count = k => rows.filter(r => kind(r[4]) === k).length;
let lastArea = '';
const tbody = rows.map(r => {
  const k = kind(r[4]); const a = r[0][3]; let head = '';
  if (a !== lastArea) { lastArea = a; head = `<tr class="area" data-area="${a}"><th colspan="5" scope="colgroup">${esc(AREA[a])}</th></tr>`; }
  return head + `<tr data-k="${k}" data-area="${a}"><td class="id">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td><span class="pill ${k}">${label[k]}</span></td></tr>`;
}).join('\n');

const bugs = [
  { img: 'SK-H02-skill-rr-any-skill-vs-zoho.png', ids: 'SK-H02 · SK-H05', title: 'Skill-based assignment needs every skill on the ticket',
    tavi: 'A ticket stays unassigned unless one agent holds <em>every</em> skill on it. #3143 (QA SK12 S4 + S1) stayed unassigned although the pool agent holds S1. Assign by Skills answers "No agent of the department holds every skill on the ticket."',
    zoho: 'Assigns to an agent who holds at least one of the ticket\'s skills. #181 (QA SK12 S3 + test) went to Fathy, who holds only "test". A ticket whose skills nobody holds stays unassigned (#180).' },
  { img: 'SK-H03-skill-rr-no-skill-ticket-assigned-vs-zoho.png', ids: 'SK-H03', title: 'A ticket with no skills is assigned by the skill-based rule, even outside the pool',
    tavi: '#3144 had no skills and was assigned to Mahmoud Samy, who is not in the rule\'s pool (pool = Test User 1 only). In an earlier run #3132 went to the pool agent.',
    zoho: '#182 with no skills, same rule: left unassigned.' },
  { img: 'SK-G02-ticket-skills-field-inactive-other-dept-vs-zoho.png', ids: 'SK-G02 · SK-G03 · SK-J02 · SK-J04 · SK-J05', title: 'The ticket Skills field offers and keeps inactive skills and other departments\' skills',
    tavi: 'Create Ticket and the inline Edit Skills on a ticket list every skill of every department, inactive ones included, whatever department the ticket is in. Saved values stay (#3145 kept QA SK12 Inact and QA AS6 sk1). The side-rail Skills tab (Associate Skills) is filtered correctly.',
    zoho: 'The Add Ticket form has no Skills input. Inactive and other-department skills set on a ticket are dropped on save (#170 kept only QA SK12 S1).' },
];
const newBugs = [
  { filed: 'NDC-2970', ids: 'SK-H06', title: 'The department threshold counts the agent\'s open tickets in every department',
    tavi: 'QA SK13 Dept A, threshold on. Test User 1 had 2 open tickets in Dept A and about 92 across all departments. Threshold 1 and 40: not assigned (#3177, #3181). Threshold 100: assigned (#3182). Threshold off: assigned (#3179).',
    zoho: 'Counts only the tickets in that department. Fathy had 5 open in Tech and 1 in another department. Threshold 3: not assigned. Threshold 6: assigned (#189).' },
  { filed: 'NDC-2971', ids: 'SK-I03 · SK-I05 · SK-J07', title: 'Skill pickers offer deleted skills, and workflow actions offer every department\'s and inactive skills',
    tavi: 'Workflow Add / Remove skills lists 87 skills: every department\'s, inactive ones, and 31 skills deleted this morning (QA SK12). Choosing a department for the rule does not narrow it. Create Ticket lists the 32 deleted skills too, and a ticket saved with deleted "QA SK12 S1" keeps it (#3176). At run time the action skips inactive skills and stops at 10, like Zoho.',
    zoho: 'Add / Remove Skills lists only the rule department\'s active skills (13 in Tech). A deleted skill is gone everywhere.' },
];
const card2 = (b, n) => `<article class="finding" id="f${n}">
  <header><span class="num">${n}</span><div><h3>${esc(b.title)}</h3><p class="ids">${b.ids} · found 12 Nov afternoon, filed as ${b.filed}</p></div></header>
  <div class="cmp"><div><h4>TAVI</h4><p>${b.tavi}</p></div><div><h4>Zoho Desk</h4><p>${b.zoho}</p></div></div>
</article>`;
const differs = { img: 'SK-E01-default-skill-preferences-vs-zoho.png', ids: 'SK-E01', title: 'A new department starts with auto-add off',
  tavi: 'QA SK12 Dept B (new, untouched): "Add skills to tickets by their criteria" is off, so no skill is added until an admin turns it on.',
  zoho: 'Auto-add skills to tickets is on, and new skills go to the bottom (Tech, and Haytham Mohamed, which was never changed).' };
const card = (b, n, cls) => `<article class="finding ${cls}" id="f${n}">
  <header><span class="num">${n}</span><div><h3>${esc(b.title)}</h3><p class="ids">${b.ids}</p></div></header>
  <div class="cmp"><div><h4>TAVI</h4><p>${b.tavi}</p></div><div><h4>Zoho Desk</h4><p>${b.zoho}</p></div></div>
  <a class="shot" href="img/${b.img}" target="_blank" rel="noopener"><img src="img/${b.img}" alt="Annotated evidence: ${esc(b.title)}. TAVI left, Zoho right." loading="lazy"></a>
  <p class="cap">Evidence image, TAVI on the left and Zoho on the right. Full size: <a href="img/${b.img}" target="_blank" rel="noopener">${b.img}</a></p>
</article>`;

const gaps = [
  ['1', 'Skills per department', 'Built', 'Same'], ['2', 'Active / Inactive', 'Built', 'Same'], ['3', 'Add Skill on the page, type required', 'Built', 'Same'],
  ['4', 'Agents on the skill form', 'Built', 'Same'], ['5', 'Search and filters', 'Built', 'Same'], ['6', 'Reorder skills', 'Built', 'Same'],
  ['7', 'Recalculate / assign on one ticket', 'Built', 'Assign by skills differs (finding 1)'], ['8', 'Where a skill is used', 'Built', 'TAVI extra; approval processes not listed (NDC-2805)'],
  ['9', 'Limits (30 active, 10 per ticket)', 'Built', 'Same']];

const css = fs.readFileSync(path.join(__dirname, 'report.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'report-filter.js'), 'utf8');

const html = `<title>Desk Skills Parity</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
${css}
</style>
<div class="wrap">
<header class="top read">
  <span class="eyebrow">TAVI Desk · QA parity run · 12 Nov 2026</span>
  <h1>Desk Skills: TAVI vs Zoho Desk</h1>
  <p class="lede">Every Skills function was run on both products at runtime, with QA data created in each. All rows are now compared on both sides.</p>
  <div class="meta"><span>TAVI: NDC-Staging, owner + Desk Agent</span><span>Zoho: Desk test portal, Enterprise trial, admin</span><span>${rows.length} behaviours compared</span></div>
</header>

<div class="answer read">
  <strong>Not identical yet. Five bugs and one smaller difference remain.</strong>
  <p>Setup now matches Zoho: per-department skills and types, Active/Inactive, filters, reorder, agents, limits and usage all behave the same. The gaps are in how skills reach tickets and how skill-based assignment picks an agent.</p>
  <div class="tally" role="group" aria-label="Filter the comparison table">
    <button type="button" data-f="bug" aria-pressed="false"><span class="dot bug"></span>Bug <b>${count('bug')}</b></button>
    <button type="button" data-f="diff" aria-pressed="false"><span class="dot diff"></span>Differs <b>${count('diff')}</b></button>
    <button type="button" data-f="same" aria-pressed="false"><span class="dot same"></span>Same <b>${count('same')}</b></button>
    <button type="button" data-f="extra" aria-pressed="false"><span class="dot extra"></span>TAVI extra <b>${count('extra')}</b></button>
    <button type="button" data-f="nc" aria-pressed="false"><span class="dot nc"></span>Not compared <b>${count('nc')}</b></button>
  </div>
  <p class="small">The ${count('bug')} bug rows in the table roll up into the five findings below. All five are filed: NDC-2931, NDC-2932, NDC-2933, NDC-2970 and NDC-2971.</p>
</div>

<section class="read" aria-labelledby="h-bugs">
  <h2 id="h-bugs">Bugs to fix</h2>
  ${bugs.map((b, i) => card(b, i + 1, '')).join('\n')}
  ${newBugs.map((b, i) => card2(b, i + 4)).join('\n')}
</section>

<section class="read" aria-labelledby="h-diff">
  <h2 id="h-diff">Smaller difference</h2>
  ${card(differs, 6, 'd')}
</section>

<section class="read" aria-labelledby="h-layout">
  <h2 id="h-layout">Correction to the 11 Nov "Skills out of layout" draft</h2>
  <div class="note warn">
    <p>The draft said Zoho has no Skills field in the ticket layout. That is wrong. Zoho lists <b>Skills</b> (Lookup, <code>entitySkills</code>) as a standard, removable field in Ticket Information, both in the layout editor and in Fields List, and shows it in the ticket's properties. Zoho only leaves it off the Add Ticket form.</p>
    <p>So TAVI keeping Skills as a layout field matches Zoho. The real problem is finding 3: the create form shows the field, and its options are not limited to active skills of the ticket's department. The draft should be rewritten around finding 3 and not filed as it stands.</p>
  </div>
</section>

<section class="read" aria-labelledby="h-extra">
  <h2 id="h-extra">TAVI extras (not bugs)</h2>
  <ul>
    <li>Skill names up to 100 characters (Zoho 50). HTML characters are accepted and shown as plain text; Zoho refuses them.</li>
    <li>A skill may have no criteria; it is then only added by hand or by a workflow. Zoho requires criteria.</li>
    <li>"Where used" lists assignment rules, workflow rules and actions, other skills' criteria, agents and open tickets. Zoho lists related rules only. Approval processes are still missing from TAVI's list (NDC-2805).</li>
    <li>Recalculate skills for many tickets from the Skills page, with progress. It runs on every open unowned ticket in <b>all</b> departments, not only the department shown on the page.</li>
  </ul>
</section>

<section aria-labelledby="h-matrix">
  <h2 id="h-matrix" class="read">Full comparison</h2>
  <p class="small read">Click a count above to filter. Values were seen in the live products on 12 Nov; ticket numbers are QA records.</p>
  <div class="tablebox"><table>
    <thead><tr><th scope="col">Case</th><th scope="col">Behaviour</th><th scope="col">Zoho Desk</th><th scope="col">TAVI</th><th scope="col">Result</th></tr></thead>
    <tbody id="rows">${tbody}</tbody>
  </table></div>
</section>

<section class="read" aria-labelledby="h-2752">
  <h2 id="h-2752">NDC-2752 gap list, rechecked</h2>
  <div class="tablebox"><table class="narrow">
    <thead><tr><th scope="col">#</th><th scope="col">Gap (1 Nov)</th><th scope="col">Now</th><th scope="col">Against Zoho</th></tr></thead>
    <tbody>${gaps.map(g => `<tr><td class="id">${g[0]}</td><td>${esc(g[1])}</td><td>${g[2]}</td><td>${esc(g[3])}</td></tr>`).join('')}</tbody>
  </table></div>
</section>

<section class="read" aria-labelledby="h-scope">
  <h2 id="h-scope">Scope, automation and open items</h2>
  <div class="grid2">
    <div class="note"><h4>Added 12 Nov afternoon</h4><ul><li>Workflow skill actions run on both sides: same four actions, same 1–10 limit, same run-time result; the picker differs (finding 5).</li><li>Round-robin department threshold with skills: run on both sides (finding 4).</li></ul></div>
    <div class="note"><h4>Automation</h4><p>New feature <code>deskskills</code>, <code>DeskSkillsParityTest</code>: 16 API tests. 12 pass; the 4 tests in group <code>parity-bug</code> fail until findings 1–3 are fixed. Each run builds and removes its own QA department.</p></div>
  </div>
  <div class="note"><h4>Test data</h4><p>The morning's QA SK12 data was deleted on both sides. The afternoon's QA SK13 data (2 TAVI departments, 14 skills, 2 rules, 9 tickets; Zoho 14 skills, 1 workflow rule, 3 tickets, 1 contact) is still in place for evidence and is listed in the run ledger. The Zoho Tech threshold was raised to 6 for one check and is back at 3.</p></div>
</section>
</div>
<script>
${js}
</script>
`;
fs.writeFileSync(path.join(RUN, 'report/index.html'), html);
console.log('rows', rows.length, 'bug', count('bug'), 'diff', count('diff'), 'same', count('same'), 'extra', count('extra'), 'nc', count('nc'));
