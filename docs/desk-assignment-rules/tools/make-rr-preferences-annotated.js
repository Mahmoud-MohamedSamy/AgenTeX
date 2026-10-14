// Annotates the Zoho "Round Robin Preferences" screenshot (14 Oct 2026) for NDC-2275.
// Output: evidence/zoho-round-robin-preferences-annotated.png
// Run: node tools/make-rr-preferences-annotated.js
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../node_modules/playwright-core'));

const ROOT = path.join(__dirname, '..');
const SRC = path.resolve(ROOT, '../WhatsApp Image 2026-10-14 at 12.20.30 PM.jpeg');
const OUT = path.join(ROOT, 'evidence', 'zoho-round-robin-preferences-annotated.png');
const CROP_TOP = 95; // hide the browser tab and bookmarks bar
const W = 1600, H = 866 - CROP_TOP;

// Boxes in original screenshot pixels: [x1, y1, x2, y2]. kind: 'pref' (dialog) or 'page' (behind the dialog).
const items = [
  { box: [450, 96, 1150, 560], kind: 'frame', tag: [1194, 104],
    title: 'Round Robin Preferences dialog',
    text: 'One dialog per department, opened from the ⋯ menu on the Round Robin list (13). Its settings apply to all round-robin rules of that department together, never to one rule. Thresholds are set only here.', ref: 'Section 8.3' },
  { box: [478, 143, 1123, 208], kind: 'pref',
    title: 'Assign tickets to offline agents (off)',
    text: 'By default round robin gives tickets only to agents who are online on the email channel. Switched on, offline agents can get tickets too.', ref: 'RR-10, RR-11' },
  { box: [478, 215, 1123, 318], kind: 'pref',
    title: 'Department wise threshold (on)',
    text: 'The most open tickets any agent of this department may hold. When an agent reaches it, round robin skips them (marked SKIPPED) until they drop below it.', ref: 'RR-12, RR-7' },
  { box: [490, 268, 782, 297], kind: 'pref', tagSide: 'right',
    title: 'Threshold drop-down (40)',
    text: 'The number for the department wise threshold. Whole numbers 1 to 200. 40 is the value set in this test org.', ref: 'RR-12' },
  { box: [478, 325, 1123, 391], kind: 'pref',
    title: 'Agent level threshold (off)',
    text: 'When ticked, a row appears: an agent pick list and a number field (1 to 200). One agent per row; add a row per agent. The agent\'s number replaces the department threshold for that agent in every round-robin rule.', ref: 'RR-13' },
  { box: [478, 397, 1123, 451], kind: 'pref',
    title: 'Assign tickets on closure (off)',
    text: 'When an agent closes a ticket, the next waiting unassigned ticket goes to them at once, if they are online and under their threshold.', ref: 'RR-16' },
  { box: [478, 458, 1123, 512], kind: 'pref',
    title: 'Assign backlogs (off)',
    text: 'Assigns tickets that came in while agents were offline or full, as agents become free. When on, Zoho also offers a per-agent limit per run (1 to 50) and the order (Due Date or Created Time).', ref: 'RR-14, RR-15' },
  { box: [472, 524, 637, 554], kind: 'pref',
    title: 'Save / Cancel',
    text: 'Nothing changes until Save. Cancel closes the dialog without changes. Saving adds an Audit Log entry.', ref: 'MSG-6, GEN-11' },
  { box: [230, 144, 388, 169], kind: 'page',
    title: 'Round Robin Rules master switch (on)',
    text: 'Turns all round-robin rules on or off at once, without deleting them. Off: no round-robin rule runs.', ref: 'GEN-7' },
  { box: [391, 144, 451, 169], kind: 'page', tagSide: 'top',
    title: 'Department picker ("Anyware S…")',
    text: 'Round-robin rules and their preferences belong to one department. The dialog edits the department picked here.', ref: 'RR-1' },
  { box: [230, 202, 338, 226], kind: 'page',
    title: 'Rule list ("test round robin")',
    text: 'The department\'s round-robin rules. They are checked top to bottom; the first matching rule assigns the ticket.', ref: 'GEN-6, EO-6' },
  { box: [1348, 141, 1514, 171], kind: 'page', tagSide: 'left',
    title: '"New Round Robin Assignment" button',
    text: 'Creates a round-robin rule: name, Execute on Create / Update, up to 5 targets, each with criteria, one method (Load based, Sequential or Skill based) and agents or a team.', ref: 'GEN-1 to GEN-4, RR-2' },
  { box: [1520, 141, 1556, 171], kind: 'page', tagSide: 'bottom',
    title: '⋯ menu → Preferences',
    text: 'Opens this Round Robin Preferences dialog.', ref: 'Section 8.3' },
  { box: [12, 512, 178, 588], kind: 'page', tagSide: 'right',
    title: 'Setup → Assignment Rules',
    text: 'Two separate sub-pages: Direct Assignment and Round Robin (open here), each with its own list. Direct Assignment has no preferences dialog: it ignores availability and thresholds.', ref: 'GEN-1, DA-5' },
];

const img = 'data:image/jpeg;base64,' + fs.readFileSync(SRC).toString('base64');
const COL = { frame: '#ff9f1c', pref: '#ff4d6d', page: '#3ea6ff' };

const overlay = items.map((it, i) => {
  const [x1, y1, x2, y2] = it.box; const n = i + 1; const c = COL[it.kind];
  const top = y1 - CROP_TOP, h = y2 - y1, w = x2 - x1;
  let tx = x1 - 30, ty = top - 4; // default: left of the box
  if (it.tag) { tx = it.tag[0] - 34; ty = it.tag[1] - CROP_TOP - 2; }
  if (it.tagSide === 'right') { tx = x2 + 6; ty = top + h / 2 - 13; }
  if (it.tagSide === 'left') { tx = x1 - 32; ty = top + h / 2 - 13; }
  if (it.tagSide === 'top') { tx = x1 + w / 2 - 13; ty = top - 30; }
  if (it.tagSide === 'bottom') { tx = x1 + w / 2 - 13; ty = y2 - CROP_TOP + 4; }
  const dash = it.kind === 'frame' ? 'dashed' : 'solid';
  return `<div class="box" style="left:${x1}px;top:${top}px;width:${w}px;height:${h}px;border:3px ${dash} ${c}"></div>` +
    `<div class="tag" style="left:${tx}px;top:${ty}px;background:${c}">${n}</div>`;
}).join('');

const legend = items.map((it, i) => `<li><span class="n" style="background:${COL[it.kind]}">${i + 1}</span><div><b>${it.title}</b> <span class="ref">${it.ref}</span><br>${it.text}</div></li>`).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;background:#0f1115;font:15px/1.45 "Segoe UI",system-ui,sans-serif;color:#e8eaed;width:${W}px}
.head{padding:16px 22px 12px;border-bottom:1px solid #2a2f37}
.head h1{margin:0 0 4px;font-size:22px}.head p{margin:0;color:#aab2bd;font-size:14px}
.shot{position:relative;width:${W}px;height:${H}px;overflow:hidden}
.shot img{position:absolute;left:0;top:-${CROP_TOP}px;width:${W}px}
.box{position:absolute;border-radius:6px;box-shadow:0 0 0 1px rgba(0,0,0,.5)}
.tag{position:absolute;width:26px;height:26px;border-radius:50%;color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.6);border:2px solid #fff}
.legend{padding:14px 22px 20px}
.keys{display:flex;gap:18px;margin:0 0 10px;color:#aab2bd;font-size:13px}.keys i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:-1px}
ol{list-style:none;margin:0;padding:0;columns:2;column-gap:28px}
li{break-inside:avoid;display:flex;gap:10px;margin:0 0 10px}
.n{flex:0 0 24px;height:24px;border-radius:50%;color:#fff;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center}
.ref{color:#9ecbff;font-size:12.5px;white-space:nowrap}
</style></head><body>
<div class="head"><h1>Zoho Desk — Round Robin Preferences (what TAVI must match)</h1>
<p>Setup → Automation → Assignment Rules → Round Robin → ⋯ → Preferences. Zoho Desk test org, 14 Oct 2026. Requirement ids refer to NDC-2275.</p></div>
<div class="shot"><img src="${img}">${overlay}</div>
<div class="legend"><div class="keys"><span><i style="background:${COL.pref}"></i>Settings in the dialog</span><span><i style="background:${COL.page}"></i>Round Robin page behind the dialog</span><span><i style="background:${COL.frame}"></i>The dialog itself</span></div><ol>${legend}</ol></div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: 900 } });
  await p.setContent(html, { waitUntil: 'load' });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await p.screenshot({ path: OUT, fullPage: true });
  await b.close();
  console.log('wrote', OUT);
})();
