// Round 10 evidence (2 Nov 2026, Anyware): API card + optional screenshots → annotated image per ticket. Facts from ev-r10-data.js (notes-r10.md).
// writes specs-r10/NDC-<n>.json and the annotated image (annotate.js → screenshots/annotated/NDC-<n>-retest-<VERDICT>.png).
// Usage: node ev-r9.js [ticket ...]   Facts come only from the run outputs in ../r9-*.out.json and notes-r9.md.
// Card row: [check, request / step, what happened now, tone ok|bad|info, expected (ticket)]
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..'); const RAW = path.join(RUN, 'screenshots', 'raw');
const ENV = 'staging-crm.taviportal.com · tenant Anyware · Edge (headless) + API · owner; test users U1–U3';
const DATE = '2 Nov 2026';
const META = JSON.parse(fs.readFileSync(path.join(RUN, 'meta.json'), 'utf8'));
const L = '/api/v1/modules/{Leads}';
const pf = s => s === 'ok' ? 'PASS' : s === 'bad' ? 'FAIL' : 'INFO';
const E = require('./ev-r10-data.js');
const DIM = n => { const b = fs.readFileSync(path.join(RAW, n)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
fs.mkdirSync(path.join(__dirname, 'cards-r10'), { recursive: true }); fs.mkdirSync(path.join(__dirname, 'specs-r10'), { recursive: true });
const only = process.argv.slice(2);
for (const [n, e] of Object.entries(E)) {
  if (only.length && !only.includes(n)) continue;
  const key = 'NDC-' + n; const m = META.find(t => t.key === key);
  const card = `${key}-api.png`; const cf = path.join(__dirname, 'cards-r10', `${key}-api.json`);
  fs.writeFileSync(cf, JSON.stringify({ out: card, date: e.date || DATE, host: e.env ? 'staging (tenant NDC-Staging)' : (m.mod === 'Desk' ? 'staging-desk.taviportal.com (tenant Anyware)' : 'staging-crm.taviportal.com (tenant Anyware)'), who: e.env ? 'admin mahmoud.mahamed1515 / agent fedelav803 / owner ndc-staging-owner' : e.who || (m.mod === 'Desk' ? 'owner; test user 3 as Desk Agent' : 'anyware-staging-owner (Owner); test users U1 / U2 / U3'), title: e.cardTitle, rows: e.rows.map(r => r.slice(0, 4)) }, null, 1));
  const res = execFileSync('node', [path.join(__dirname, 'apicard.js'), cf], { encoding: 'utf8' }).trim();
  const boxes = JSON.parse(res.slice(res.indexOf('[')));
  const panels = (e.panels || []).map(p => { const [w, h] = DIM(p.img); return { img: p.img, caption: p.caption, crop: p.crop || [0, 0, w, h], w, h, boxes: (p.boxes || []).map(([b, nn, kind]) => ({ b, n: nn, kind })) }; });
  const off = panels.reduce((a, p) => a + p.boxes.length, 0);
  const cp = { img: card, caption: e.cardCaption || 'API evidence — ' + e.cardTitle, crop: [0, 0, 1600, boxes[boxes.length - 1][3] + 20], w: 1600, h: 900, full: true,
    boxes: boxes.map((bx, i) => ({ b: [924, bx[1] - 2, 1566, bx[3] + 2], n: off + i + 1, kind: pf(e.rows[i][3]) })) };
  panels.push(cp);
  const rows = [...(e.panelRows || []), ...e.rows.map((r, i) => [String(off + i + 1), r[0], r[4] ?? '—', r[2], pf(r[3])])];
  const out = `${key}-retest-${e.verdict.replace(/ /g, '-')}.png`;
  const spec = { out, ticket: key, title: m.name, priority: m.pri, verdict: e.verdict, env: e.env || (m.mod === 'Desk' ? ENV.replace('staging-crm', 'staging-desk') : ENV), date: e.date || DATE, panels, rows };
  const sf = path.join(__dirname, 'specs-r10', `${key}.json`); fs.writeFileSync(sf, JSON.stringify(spec, null, 1));
  console.log(execFileSync('node', [path.join(__dirname, 'annotate.js'), sf], { encoding: 'utf8' }).trim());
}
