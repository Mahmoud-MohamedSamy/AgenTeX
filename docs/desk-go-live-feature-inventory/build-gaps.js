// node build-gaps.js -> desk-missing-and-partly.md + .html (Missing + Partly rows only)
const fs = require('fs'); const rows = require('./matrix-data.js'), d = require('./gaps-descriptions.js');
const g = rows.filter(r => /^(Missing|Partly)$/.test(r[4]));
const areas = [...new Set(g.map(r => r[1]))];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const nM = g.filter(r => r[4] === 'Missing').length, nP = g.length - nM;
let md = `# TAVI Desk: missing and partly built features vs Zoho Desk\n\n2 Nov 2026 · ${g.length} features (${nM} missing, ${nP} partly built) out of 131 in the go-live inventory. Includes the Wave 1 findings.\n\n`;
for (const a of areas) { md += `## ${a}\n\n`; for (const r of g.filter(x => x[1] === a)) md += `- **${r[0]} ${r[2]}** (${r[4]}, ${r[7]}) — Zoho: ${d[r[0]][0]} TAVI: ${d[r[0]][1]}${r[6] && r[6] !== '—' ? ` Plane: ${r[6]}.` : ''}\n`; md += '\n'; }
fs.writeFileSync('desk-missing-and-partly.md', md);
const card = r => `<article class="row" data-s="${r[4]}"><div class="top"><span class="id">${r[0]}</span><span class="pill ${r[4].toLowerCase()}">${r[4]}</span><span class="pri">${r[7]}</span></div><h3>${esc(r[2])}</h3>
<dl><dt>Zoho Desk</dt><dd>${esc(d[r[0]][0])}</dd><dt>TAVI Desk today</dt><dd>${esc(d[r[0]][1])}</dd>${r[6] && r[6] !== '—' ? `<dt>Plane</dt><dd class="pl">${esc(r[6])}</dd>` : ''}</dl></article>`;
const sec = a => { const rs = g.filter(x => x[1] === a); return `<section><h2>${esc(a)} <span class="n">${rs.length}</span></h2><div class="list">${rs.map(card).join('')}</div></section>`; };
const html = `<title>Desk Missing and Partly Features</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,600&display=swap">
<style>
/* Layout: one reading column; areas as sections, each feature a compact entry with Zoho vs TAVI lines. */
:root{--bg:#f6f7f9;--panel:#fff;--fg:#1b2230;--muted:#5d6676;--line:#dfe3ea;--accent:#2d5bd7;--warn:#9a6200;--warn-bg:#fbf0d9;--bad:#b4232c;--bad-bg:#fbe4e5;--grey-bg:#eceef2;
--display:"Fraunces",Georgia,serif;--body:"IBM Plex Sans",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12161d;--panel:#1a2029;--fg:#e4e8ef;--muted:#9aa3b2;--line:#2c3441;--accent:#7ea2ff;--warn:#f0bf63;--warn-bg:#3a2f16;--bad:#ff8f95;--bad-bg:#3d1c20;--grey-bg:#252c37;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#12161d;--panel:#1a2029;--fg:#e4e8ef;--muted:#9aa3b2;--line:#2c3441;--accent:#7ea2ff;--warn:#f0bf63;--warn-bg:#3a2f16;--bad:#ff8f95;--bad-bg:#3d1c20;--grey-bg:#252c37;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:15px/1.55 var(--body)}
.wrap{max-width:980px;margin:0 auto;padding-block:28px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:grid;gap:26px}
h1{font:600 clamp(24px,3.4vw,32px)/1.15 var(--display);margin:0;text-wrap:balance}
h2{font:600 20px/1.3 var(--display);margin:0 0 10px;display:flex;gap:8px;align-items:baseline}
h2 .n{font:500 13px var(--mono);color:var(--muted)}
h3{font:600 15.5px/1.35 var(--body);margin:4px 0 8px}
.meta{color:var(--muted);margin:6px 0 0;max-width:80ch}
.tiles{display:flex;flex-wrap:wrap;gap:10px}
.tile{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:10px 16px;display:grid;min-width:120px}
.tile b{font:500 24px var(--mono);font-variant-numeric:tabular-nums}.tile span{color:var(--muted);font-size:13px}
.tile.m b{color:var(--bad)}.tile.p b{color:var(--warn)}
.bar{display:flex;flex-wrap:wrap;gap:8px}
.bar button{font:inherit;font-size:13px;border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:999px;padding:4px 12px;cursor:pointer}
.bar button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--panel)}
.bar button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.list{display:grid;gap:10px}
.row{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:12px 16px}
.top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.id{font:500 12.5px var(--mono);color:var(--muted)}
.pill{font-size:12px;font-weight:600;border-radius:999px;padding:1px 9px}
.pill.missing{background:var(--bad-bg);color:var(--bad)}.pill.partly{background:var(--warn-bg);color:var(--warn)}
.pri{font:500 12px var(--mono);background:var(--grey-bg);border-radius:4px;padding:1px 6px}
dl{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 14px;margin:0;font-size:14px}
dt{color:var(--muted);font-size:12px;letter-spacing:.05em;text-transform:uppercase;padding-top:2px}dd{margin:0}
dd.pl{font-family:var(--mono);font-size:12.5px}
@media (max-width:520px){dl{grid-template-columns:1fr}dt{padding-top:6px}}
.note{color:var(--muted);font-size:13.5px;max-width:85ch}
</style>
<div class="wrap">
<header><h1>TAVI Desk: missing and partly built features</h1><p class="meta">Compared with Zoho Desk Enterprise on 2 Nov 2026. These are the ${g.length} features from the go-live inventory of 131 that TAVI Desk does not have (Missing) or has only in part (Partly), including what Wave 1 found. Each entry says what Zoho has, what TAVI has today, and the Plane item if one exists. P0 is needed for go-live, P1 soon after, P2 later.</p></header>
<div class="tiles"><div class="tile"><b>${g.length}</b><span>features</span></div><div class="tile m"><b>${nM}</b><span>missing</span></div><div class="tile p"><b>${nP}</b><span>partly built</span></div><div class="tile"><b>${g.filter(r=>r[7]==='P0').length}</b><span>P0</span></div></div>
<div class="bar" role="group" aria-label="Filter"><button aria-pressed="true" data-f="">All</button><button aria-pressed="false" data-f="Missing">Missing ${nM}</button><button aria-pressed="false" data-f="Partly">Partly ${nP}</button></div>
${areas.map(sec).join('\n')}
<p class="note">Not listed here: 82 features whose screen and API exist (tested in the waves), 6 TAVI-only features, 2 in development (Chat, Social) and 5 not confirmed yet. Source: docs/desk-go-live-feature-inventory in the QA repository.</p>
</div>
<script>
const bs=[...document.querySelectorAll('.bar button')],rs=[...document.querySelectorAll('.row')],ss=[...document.querySelectorAll('section')];
bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));const f=b.dataset.f;rs.forEach(r=>r.hidden=!!f&&r.dataset.s!==f);ss.forEach(s=>s.hidden=![...s.querySelectorAll('.row')].some(r=>!r.hidden));}));
</script>`;
fs.writeFileSync('desk-missing-and-partly.html', html);
console.log(g.length, nM, nP, areas.join(' | '));
