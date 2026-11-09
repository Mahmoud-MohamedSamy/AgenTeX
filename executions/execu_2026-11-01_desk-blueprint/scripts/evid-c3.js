// C3 evidence (TAVI vs live Zoho): API panel from c3c4.json + Zoho captures (copied from the scratchpad) → annotated image.
const path = require('path'), fs = require('fs'); const { execFileSync } = require('child_process');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const RAW = path.join(P, 'executions/execu_2026-11-01_desk-blueprint/evidence/raw');
const ZS = 'C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/e12f27e4-edb0-452a-a10f-0861faf81818/scratchpad/desk/blueprint1101/zoho2';
fs.copyFileSync(path.join(ZS, 'f05-xss.png'), path.join(RAW, 'zoho-c3-special-chars.png'));
fs.copyFileSync(path.join(ZS, 'f15-len.png'), path.join(RAW, 'zoho-c3-len60.png'));
const d = JSON.parse(fs.readFileSync(path.join(RAW, 'c3c4.json'), 'utf8')); const by = k => d.results.find(r => r.k === k);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const bad = s => `<span class="bad">${esc(s)}</span>`, ok = s => `<span class="ok">${esc(s)}</span>`;
const line = (k, label) => { const r = by(k); return `${esc(label)} → ${r.status === 201 ? bad('201 created') : ok(r.status)}, stored ${r.storedLen} chars${r.storedSame ? ', exactly as sent' : ''}`; };
const page = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1600px;height:900px;background:#0f172a;color:#e2e8f0;font:22px/1.5 Consolas,monospace;padding:36px;box-sizing:border-box}
h1{font:600 27px "Segoe UI",sans-serif;color:#fff;margin:0 0 18px}.blk{background:#1e293b;border-radius:10px;padding:18px 24px;margin-bottom:20px;outline:4px solid #ff2d55;position:relative}
.lbl{font:600 21px "Segoe UI",sans-serif;color:#94a3b8;margin-bottom:8px}.ok{color:#4ade80;font-weight:700}.bad{color:#fb7185;font-weight:700}
.mark{position:absolute;right:-14px;top:-14px;width:44px;height:44px;border-radius:50%;background:#ff2d55;color:#fff;font:700 24px "Segoe UI";display:flex;align-items:center;justify-content:center}
pre{margin:0;white-space:pre-wrap}</style></head><body>
<h1>TAVI Desk API — POST /modules/{tickets}/blueprints (inactive QA drafts, QA WF Dept R, deleted after) · 2 Nov 2026</h1>
<div class="blk"><span class="mark">1</span><div class="lbl">Special characters in the name</div><pre>${line('xss', 'name "QA BP <script>alert(1)</script>"')}</pre></div>
<div class="blk"><span class="mark">2</span><div class="lbl">Name length (no limit)</div><pre>${line('long70', 'name of 70 characters')}\n${line('long309', 'name of 309 characters')}</pre></div>
<div class="blk" style="outline-color:#334155"><div class="lbl">Same as Zoho</div><pre>${line('arabic', 'Arabic name')}\n${line('emoji', 'emoji name')}\n${line('trailing', 'name with 3 trailing spaces')}</pre></div>
</body></html>`;
const spec = { label: 'DIFFERS', verdict: 'FAIL', date: '2 Nov 2026', out: 'BP-C3-name-rules-vs-zoho.png', ticket: 'Blueprint name',
  env: 'TAVI: staging-desk.taviportal.com, org Anyware, owner (QA drafts deleted after) · Zoho: Zoho Desk Enterprise trial, Setup → Blueprint → Create Blueprint (nothing saved)',
  taviHead: 'TAVI Desk (API + designer)', zohoHead: 'Zoho Desk (Create Blueprint)',
  title: 'Blueprint name: TAVI accepts special characters and any length; Zoho refuses special characters and stops at 60 characters',
  panels: [
    { img: 'c3c4-api.png', caption: 'TAVI API: "<script>" name and 70 / 309-character names are saved as sent', crop: [0, 0, 1600, 900], boxes: [] },
    { img: 'zoho-c3-special-chars.png', caption: 'Zoho: Next with "QA BP <script>alert(1)</script>" → "Special characters are not allowed."', crop: [221, 98, 760, 330], boxes: [{ b: [276, 160, 546, 210], n: 1 }] },
    { img: 'c3-ui-new.png', caption: 'TAVI designer: Name and Description boxes have no length limit (maxlength not set)', crop: [1300, 120, 300, 240], boxes: [{ b: [1314, 190, 1586, 350], n: 2 }] },
    { img: 'zoho-c3-len60.png', caption: 'Zoho: typing a 70-character name stops at 60 characters (" END" is cut off); Description allows 1000', crop: [221, 98, 760, 330], boxes: [{ b: [276, 135, 546, 190], n: 2 }] }],
  rows: [
    [1, 'Special characters such as < > ( ) in the name', 'Refused on Next: "Special characters are not allowed." (also "(" — seen 1 Nov).', 'Accepted and stored as typed (201). The text is shown as plain text, so it does not run (no XSS), but Zoho does not allow it.', 'DIFFERS'],
    [2, 'Name length', 'The name box stops at 60 characters (maxlength 60); Description 1000.', 'No limit in the designer or the API: 70 and 309-character names are saved.', 'DIFFERS'],
    [3, 'Arabic, emoji, trailing spaces', 'Accepted; trailing spaces kept in the draft name.', 'Accepted and stored exactly as typed.', 'SAME']] };
(async () => {
  const br = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] }); const pg = await br.newPage({ viewport: { width: 1600, height: 900 } });
  await pg.setContent(page); await pg.screenshot({ path: path.join(RAW, 'c3c4-api.png') }); await br.close();
  const f = path.join(__dirname, 'spec-C3.json'); fs.writeFileSync(f, JSON.stringify(spec, null, 1));
  console.log(execFileSync('node', [path.join(__dirname, 'annotate-vs-zoho.js'), f], { encoding: 'utf8' }).trim());
})();
