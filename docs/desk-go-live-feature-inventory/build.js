// node build.js -> desk-go-live-feature-inventory.md + .html (from matrix-data.js)
const fs = require('fs'), path = require('path'); const rows = require('./matrix-data.js');
const W = { 0: 'Not in go-live run (missing / in development)', 1: 'Wave 1 — Organisation & access', 2: 'Wave 2 — Ticket daily work', 3: 'Wave 3 — Automation', 4: 'Wave 4 — Channels & self service', 5: 'Wave 5 — Customers, activities, insight, data, customization, integrations' };
const cnt = f => rows.reduce((m, r) => (m[f(r)] = (m[f(r)] || 0) + 1, m), {});
const st = cnt(r => r[4]), pr = cnt(r => r[7]), wv = cnt(r => r[8]);
const isGap = r => /Missing|Partly/.test(r[4]);
let md = `# TAVI Desk — go-live feature inventory vs Zoho Desk (Enterprise)\n\n1 Nov 2026 · staging-desk.taviportal.com, org Anyware, owner account · reference: Zoho Desk Enterprise trial (org techsolutionsegypt) + Zoho Desk help centre (2,491 items, reference/zoho-desk-inventory.md).\n\n`;
md += `**How to read the status.** *Built* = the screen and its API exist in today's build (bundle index-CA-OX4H6.js, settings hub, page tour). Whether it **works** is decided in the wave runs, not here. *Partly* = exists but a known part is missing. *Missing* = Zoho has it, TAVI has no screen or API. *In development* = TAVI shows an "In Development" page. *Not confirmed* = could not be checked yet (page did not load or no string found). *TAVI-only* = TAVI has it, Zoho does not.\n\n`;
md += `**Totals (${rows.length} features):** ` + Object.entries(st).map(([k, v]) => `${k} ${v}`).join(' · ') + `  \n**Priority:** ` + Object.entries(pr).map(([k, v]) => `${k} ${v}`).join(' · ') + `\n\n`;
md += `Open Plane items are taken from the Desk module sweep (reference/plane-desk-items.md, 353 items). Items in brackets (Done / RFT) are listed for context.\n\n`;
for (const w of [1, 2, 3, 4, 5, 0]) { const rs = rows.filter(r => r[8] === w); md += `## ${W[w]} (${rs.length})\n\n| Id | Area | Feature | TAVI status | Evidence | Open Plane items | Priority |\n|---|---|---|---|---|---|---|\n`;
  for (const r of rs) md += `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[4]} | ${r[5]} | ${r[6]} | ${r[7]} |\n`; md += '\n'; }
md += `## Gaps (Missing + Partly): ${rows.filter(isGap).length}\n\n` + rows.filter(isGap).map(r => `- **${r[0]}** ${r[2]} — ${r[4]}. ${r[5]}. Plane: ${r[6]}`).join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, 'desk-go-live-feature-inventory.md'), md);
// HTML
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cls = s => s.toLowerCase().replace(/[^a-z]+/g, '-');
const tr = rows.map(r => `<tr data-w="${r[8]}" data-s="${esc(r[4])}"><td class="id">${r[0]}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td><span class="pill ${cls(r[4])}">${esc(r[4])}</span></td><td class="ev">${esc(r[5])}</td><td class="pl">${esc(r[6])}</td><td>${r[7]}</td><td>${r[8] ? 'W' + r[8] : '—'}</td></tr>`).join('\n');
const tile = (k, v) => `<div class="tile"><b>${v}</b><span>${esc(k)}</span></div>`;
const html = fs.readFileSync(path.join(__dirname, 'page-template.html'), 'utf8')
  .replace('{{TILES}}', `<div class="tile"><b>${rows.length}</b><span>features</span></div>` + Object.entries(st).map(([k, v]) => tile(k, v)).join(''))
  .replace('{{WAVES}}', [1, 2, 3, 4, 5, 0].map(w => `<li><b>${W[w]}</b> — ${wv[w] || 0} features</li>`).join(''))
  .replace('{{ROWS}}', tr).replace('{{STATUSES}}', Object.keys(st).map(s => `<option>${esc(s)}</option>`).join(''));
fs.writeFileSync(path.join(__dirname, 'desk-go-live-feature-inventory.html'), html);
console.log('rows', rows.length, JSON.stringify(st), JSON.stringify(pr), JSON.stringify(wv), 'gaps', rows.filter(isGap).length);
