// Builds the Plane work-item draft from requirements-desk-assignment-rules.md.
// Output: plane-draft/description.html (raw description_html for Plane) and plane-draft/preview.html (review page).
// Plane house style: bold-paragraph headers, no tables, no <h3>, list items wrapped in <p>.
// Run: node tools/make-plane-draft.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'requirements-desk-assignment-rules.md');
const OUT = path.join(ROOT, 'plane-draft');
const TITLE = 'Assignment Rules: Direct Assignment and Round Robin (requirements)';

// ---------- 1. Plane-specific text changes (the .md stays the source of truth)
let md = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');

// Drop the title and the local metadata block; Plane gets its own "About this item".
md = md.slice(md.indexOf('## 1. Summary'));

const swaps = [
  [/Decided 14 Oct(?: 2026)?:\s*/g, 'Agreed in review: '],
  [/Decided 14 Oct\.?/g, 'Agreed in review.'],
  [/ \(was EO-7\)/g, ''],
  [/^## 13\. Proposed phases \(for review\)$/m, '## 13. Phases'],
  [/^### Still open\nNone\.\n/m, ''],
  [/\(missing list item (\d+)\)/g, '(QA missing list item $1)'],
  [/missing list item (\d+)/g, 'QA missing list item $1'],
  [/QA QA missing/g, 'QA missing'],
  [/### Decided in the review of 14 Oct 2026/, '### Agreed in the review of 14 Oct 2026'],
  [/- Live Zoho Desk org, 6 Oct 2026: `reference\/zoho-live-notes\.md`\. Round Robin Preferences screenshot, 14 Oct 2026: `docs\/WhatsApp Image[^`]*`\./,
    '- Live Zoho Desk org, 6 Oct 2026 (QA notes in the QA repository), and the Round Robin Preferences screenshot of 14 Oct 2026 (attached to this item).'],
  [/- TAVI Desk build, 6 Oct 2026: `reference\/tavi-build-map\.md`\./, '- TAVI Desk build of 6 Oct 2026 (QA build map in the QA repository).'],
];
for (const [a, b] of swaps) md = md.replace(a, b);

// The API section was removed from the source file on 14 Oct 2026 (the API is the developers' to design).
if (/^## \d+\. API$/m.test(md) || /API-\d/.test(md)) throw new Error('API content found in the source; it should not be there');

// ---------- 2. Small markdown → Plane HTML converter (only what this file uses)
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
  return s;
}

const lines = md.split('\n');
const indentOf = l => l.match(/^ */)[0].length;
const listRe = /^(\s*)(-|\d+\.)\s+(.*)$/;

// Parse a list starting at line i with the given indent. Returns [html, nextIndex].
function parseList(i, indent) {
  const first = lines[i].match(listRe);
  const ordered = first[2] !== '-';
  const startNum = ordered ? parseInt(first[2], 10) : 1;
  let html = ordered ? (startNum > 1 ? `<ol start="${startNum}">` : '<ol>') : '<ul>';
  while (i < lines.length) {
    const m = lines[i].match(listRe);
    if (!m || m[1].length !== indent || (m[2] !== '-') !== ordered) break;
    let item = `<li><p>${inline(m[3])}</p>`;
    i++;
    // children: deeper list items, or indented continuation paragraphs (possibly after a blank line)
    while (i < lines.length) {
      const l = lines[i];
      if (l.trim() === '') {
        const nxt = lines[i + 1];
        if (nxt !== undefined && nxt.trim() !== '' && indentOf(nxt) > indent) { i++; continue; }
        break;
      }
      if (indentOf(l) <= indent) break;
      const cm = l.match(listRe);
      if (cm) { const [h, n] = parseList(i, cm[1].length); item += h; i = n; }
      else { item += `<p>${inline(l.trim())}</p>`; i++; }
    }
    html += item + '</li>';
  }
  return [html + (ordered ? '</ol>' : '</ul>'), i];
}

let body = '';
let section = '';
for (let i = 0; i < lines.length;) {
  const l = lines[i];
  if (l.trim() === '' || /^---\s*$/.test(l)) { i++; continue; }
  let m;
  if ((m = l.match(/^## (.*)$/))) { section = m[1]; body += `<p><strong>${inline(m[1])}</strong></p>`; i++; continue; }
  if ((m = l.match(/^### (.*)$/))) {
    if (m[1] === 'Requirements') { i++; continue; }
    // Name the section in sub-headers so each one reads on its own in Plane.
    const label = /^Acceptance criteria$/.test(m[1]) ? `Acceptance criteria — ${section.replace(/^\d+\.\s*/, '')}` : m[1];
    body += `<p><strong><em>${inline(label)}</em></strong></p>`; i++; continue;
  }
  if (listRe.test(l)) { const [h, n] = parseList(i, indentOf(l)); body += h; i = n; continue; }
  body += `<p>${inline(l.trim())}</p>`; i++;
}

// ---------- 3. Plane intro ("About this item"), in the approved short style
const intro = [
  '<p><strong>About this item</strong></p>',
  '<ul>',
  '<li><p>Requirements for TAVI Desk Assignment Rules, compared with Zoho Desk → Setup → Automation → Assignment Rules. Reviewed and agreed on 14 Oct 2026.</p></li>',
  '<li><p>Guiding rule: match Zoho Desk\'s behaviour everywhere. Where Zoho\'s help pages are silent, the item says so and states the behaviour we chose.</p></li>',
  '<li><p>Each requirement has an id (for example DA-7), one rule in plain words, the Zoho behaviour it follows, what TAVI does today (Built, Partly built, Missing or Not checked) and its phase.</p></li>',
  '<li><p>"Zoho (seen)" means it was seen on Zoho Desk\'s screen. "Zoho (docs)" means it comes from Zoho\'s help pages only.</p></li>',
  '<li><p>Related items: NDC-1978 (Assignment rules and skills), NDC-1976 (agent online / offline status), NDC-1975 and NDC-1910 (working teams), NDC-1211 (CRM automation execution order bug), NDC-1980 (reassign on leave), NDC-1585 (CRM import assignment rule).</p></li>',
  '<li><p>QA files (missing list with annotated evidence, Zoho notes, TAVI build map) are in the QA repository under docs/desk-assignment-rules.</p></li>',
  '</ul>',
].join('');

const description = intro + body;
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'description.html'), description);

// ---------- 4. Review page that looks like a Plane work item
const preview = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plane Draft Preview</title>
<style>
:root{--bg:#f5f6f8;--card:#fff;--ink:#1f2328;--muted:#5f6b7a;--line:#e3e6ea;--accent:#3f76ff;--code:#f0f2f5;--note:#fff7e0;--note-ink:#7a5a00}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#121417;--card:#1b1e23;--ink:#e6e8eb;--muted:#9aa4b1;--line:#2c3138;--accent:#7aa2ff;--code:#262a31;--note:#2f2710;--note-ink:#e3c46a}}
:root[data-theme="dark"]{--bg:#121417;--card:#1b1e23;--ink:#e6e8eb;--muted:#9aa4b1;--line:#2c3138;--accent:#7aa2ff;--code:#262a31;--note:#2f2710;--note-ink:#e3c46a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 Inter,"Segoe UI",system-ui,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:24px 16px;display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:20px}
@media (max-width:900px){.wrap{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:24px 28px}
.crumb{font-size:13px;color:var(--muted);margin-bottom:6px}
h1{font-size:24px;line-height:1.3;margin:0 0 16px}
.note{background:var(--note);color:var(--note-ink);border-radius:8px;padding:10px 14px;font-size:13.5px;margin-bottom:18px}
.desc p{margin:6px 0}.desc ul,.desc ol{margin:4px 0 8px;padding-left:24px}.desc li>p{margin:2px 0}
.desc>p>strong:only-child{display:block;font-size:17px;margin-top:22px}
.desc>p>strong>em{font-style:normal;color:var(--muted);font-size:14.5px}
.desc code{background:var(--code);padding:1px 5px;border-radius:4px;font-size:13px}
.desc a{color:var(--accent)}
.side .row{display:flex;justify-content:space-between;gap:8px;padding:9px 0;border-bottom:1px solid var(--line);font-size:14px}
.side .row:last-child{border:0}.side .k{color:var(--muted)}.side .v{text-align:right}.tbd{color:var(--note-ink);font-style:italic}
.side h2{font-size:14px;margin:0 0 6px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
</style></head><body>
<div class="wrap">
<main class="card">
<div class="crumb">NDC · New work item (draft, not published)</div>
<h1>${esc(TITLE)}</h1>
<div class="note">Preview only. This is how the description will look in Plane. Nothing has been sent to Plane. The raw description is in <code>plane-draft/description.html</code>.</div>
<div class="desc">${description}</div>
</main>
<aside class="card side">
<h2>Properties</h2>
<div class="row"><span class="k">State</span><span class="v">Backlog</span></div>
<div class="row"><span class="k">Priority</span><span class="v">Urgent</span></div>
<div class="row"><span class="k">Assignees</span><span class="v">Mahmoud, mfathy</span></div>
<div class="row"><span class="k">Labels</span><span class="v">assignment rule</span></div>
<div class="row"><span class="k">Module</span><span class="v">DESK</span></div>
<div class="row"><span class="k">Cycle</span><span class="v">Current sprint</span></div>
<div class="row"><span class="k">Start date</span><span class="v">14 Oct 2026</span></div>
<div class="row"><span class="k">Attachment</span><span class="v">Round Robin Preferences screenshot (14 Oct 2026)</span></div>
<div class="row"><span class="k">Comment on</span><span class="v">NDC-1978, linking this item (to confirm)</span></div>
</aside>
</div></body></html>`;
fs.writeFileSync(path.join(OUT, 'preview.html'), preview);

const reqs = (description.match(/<strong>[A-Z]{2,4}-\d+[a-z]? —/g) || []).length;
console.log(`wrote plane-draft/description.html (${description.length} chars, ${reqs} requirement ids) and plane-draft/preview.html`);
