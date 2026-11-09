// Round 2 Wave 3 (27–28 Oct 2026): one annotated image per verdict the coordinator asked for (A-14, B-18, G-07, G-10,
// NDC-2621, A-17) and per candidate, in the approved layout (TAVI left, Zoho right, the same box number on both sides
// per row). Facts are copied from the automated logs in after/ (run2–run6); nothing is invented. Usage: node make-r2-evidence.js
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const W3 = path.join(P, 'executions/execu_2026-10-27_crm-golive-round2/wave3');
const RAW = path.join(W3, 'evidence/raw'), SPECS = path.join(W3, 'scripts/specs');
fs.mkdirSync(SPECS, { recursive: true });
const ENV = 'staging-crm.taviportal.com, build index-De3hTVb3.js (CRM Admin A / B, Supervisor, test users; API) vs Zoho CRM org943261092 (read-only)';
const ZBOX = [250, 60, 1590, 940];

// id -> { verdict, label, title, zimg, ztext, rows: [[check, zoho, tavi, result]], lines: [[text, kind, group]] }
// group 'r1'..'r3' marks the card lines that box n on the TAVI side; the Zoho side gets the same numbers.
const CASES = JSON.parse(fs.readFileSync(path.join(W3, 'scripts/r2-cases.json'), 'utf8'));

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const K = { ok: '#16a34a', bad: '#dc2626', info: '#2563eb', '': '#111827' };
const wrap = (s, n = 112) => { const out = []; let t = String(s); while (t.length > n) { let i = t.lastIndexOf(' ', n); if (i < 40) i = n; out.push(t.slice(0, i)); t = t.slice(i).trimStart(); } out.push(t); return out; };

async function card(browser, out, title, lines) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;width:1600px;background:#fff;font:22px/1.55 Consolas,monospace;color:#111827}
h1{margin:0;padding:22px 32px;font:600 26px "Segoe UI",sans-serif;background:#f3f4f6;border-bottom:1px solid #d1d5db}.l{padding:6px 32px 6px 64px;white-space:pre-wrap}</style></head><body>
<h1>${esc(title)}</h1><div style="padding:14px 0">${lines.map(([t, k, g]) => `<div class="l" data-g="${g || ''}" style="color:${K[k || '']};${k === 'bad' ? 'font-weight:700' : ''}">${esc(t)}</div>`).join('')}</div></body></html>`;
  const pg = await browser.newPage({ viewport: { width: 1600, height: 400 } });
  await pg.setContent(html);
  const h = await pg.evaluate(() => document.body.scrollHeight);
  await pg.setViewportSize({ width: 1600, height: h });
  const groups = await pg.evaluate(() => { const g = {}; document.querySelectorAll('.l[data-g]').forEach(e => { const n = e.dataset.g; if (!n) return; const r = e.getBoundingClientRect();
    const b = g[n] || [r.left + 40, r.top, r.right - 16, r.bottom]; g[n] = [Math.min(b[0], r.left + 40), Math.min(b[1], r.top), Math.max(b[2], r.right - 16), Math.max(b[3], r.bottom)]; }); return g; });
  await pg.screenshot({ path: path.join(RAW, out) }); await pg.close();
  return { h, groups };
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
  for (const [id, c] of Object.entries(CASES)) {
    const lines = [];
    for (const [t, k, g] of c.lines) wrap(t).forEach(x => lines.push([x, k, g]));
    const tc = c.timg ? { h: 950, groups: {} } : await card(browser, `r2-card-${id}.png`, `TAVI — ${id}, round 2 (27–28 Oct 2026)`, lines);
    const nums = c.rows.map((_, i) => String(i + 1));
    const tBoxes = nums.filter(n => tc.groups['r' + n]).map(n => ({ b: tc.groups['r' + n], n }));
    const panels = [{ img: c.timg || `r2-card-${id}.png`, w: 1600, h: c.timg ? 950 : tc.h, crop: c.timg ? [0, 0, 1600, 950] : [0, 0, 1600, tc.h],
      caption: c.tcaption || `TAVI — facts logged by the automated run (${c.src}).`, boxes: c.timg ? (c.tboxes || []) : tBoxes }];
    if (c.zimg) panels.push({ img: c.zimg, w: 1600, h: 950, crop: [0, 0, 1600, 950], caption: `Zoho — ${c.ztext} (read-only).`,
      boxes: nums.map((n, i) => ({ b: [ZBOX[0] + i * 60, ZBOX[1], ZBOX[2], ZBOX[3]], n, color: '#16a34a' })) });   // the Zoho screen answers every row: same area, tags side by side
    else {
      const z = await card(browser, `r2-zoho-${id}.png`, 'Zoho CRM — not checked live for this case', c.rows.map((r, i) => [`${i + 1}. ${r[1]}`, '', 'r' + (i + 1)]));
      panels.push({ img: `r2-zoho-${id}.png`, w: 1600, h: z.h, crop: [0, 0, 1600, z.h], caption: 'Zoho — expected behaviour from the test spec; not checked live (nothing is saved in Zoho).',
        boxes: nums.filter(n => z.groups['r' + n]).map(n => ({ b: z.groups['r' + n], n, color: '#16a34a' })) });
    }
    const spec = { out: `${id}-round2.png`, ticket: id, verdict: c.verdict, label: c.label, title: c.title, env: ENV, date: '28 Oct 2026', panels,
      rows: c.rows.map((r, i) => [String(i + 1), r[0], r[1], r[2], r[3]]) };
    fs.writeFileSync(path.join(SPECS, `${id}-round2.json`), JSON.stringify(spec, null, 1));
    execFileSync('node', [path.join(W3, 'scripts/annotate-vs-zoho.js'), path.join(SPECS, `${id}-round2.json`)], { stdio: 'pipe' });
    console.log('built', spec.out);
  }
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
