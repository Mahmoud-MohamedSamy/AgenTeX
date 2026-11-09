// Writes the annotation specs for retest round 8 (27–28 Oct 2026, CRM, 30 tickets — NDC-2620 left to the user) and renders them with annotate.js.
// Usage: node cards-r8.js (once) → node specs-r8.js [ticket ...] → screenshots/annotated/NDC-<n>-retest-<VERDICT>.png
// Source of truth: notes-r8.md (verdicts + facts) and results.json.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const RAW = path.join(__dirname, '..', 'screenshots', 'raw');
const ENV = { env: 'staging-crm.taviportal.com · tenant NDC-Staging · Edge (headless) + API · mahmoud.mahamed1515 (CRM Admin); test user 1; owner account through the automation', date: '27 Oct 2026' };
const DIM = n => { const b = fs.readFileSync(path.join(RAW, n)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const P = (img, caption, crop, boxes) => { const [w, h] = DIM(img); return { img, caption, crop: crop || [0, 0, w, h], w, h, boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) }; };
const BOX = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards-r8', 'boxes.json'), 'utf8'));
const CARD = (out, caption, marks) => { const rows = BOX[out]; const p = P(out, caption, [0, 0, 1600, rows[rows.length - 1][3] + 20], marks.map(([r, n, kind]) => [[924, rows[r - 1][1] - 2, 1566, rows[r - 1][3] + 2], n, kind])); p.full = true; return p; };
const ALL = (out, kinds) => BOX[out].map((_, i) => [i + 1, i + 1, kinds[i] || 'PASS']);
const R = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'results.json'), 'utf8'));
const title = n => R.tickets.find(t => t.id === 'NDC-' + n).title;
const pf = s => s === 'ok' ? 'PASS' : s === 'bad' ? 'FAIL' : 'INFO';
// Rows of the comparison table come from the card rows: [#, check, expected, now, result]
const CARDS = JSON.parse(JSON.stringify(Object.fromEntries(fs.readdirSync(path.join(__dirname, 'cards-r8')).filter(f => /^NDC-.*\.json$/.test(f)).map(f => [f.replace('.json', '.png'), JSON.parse(fs.readFileSync(path.join(__dirname, 'cards-r8', f), 'utf8'))]))));
const rowsOf = (out, expected) => CARDS[out].rows.map((r, i) => [String(i + 1), r[0], expected[i] ?? '—', r[2], pf(r[3])]);
const S = {
  1335: { verdict: 'PASS', panels: [P('v40-after-save.png', 'New Leads layout with predefined fields only (Name, Created/Modified Time/By) after Save: no Subform error, layout created.', [332, 56, 1268, 520], [[[356, 340, 1576, 568], 1, 'PASS'], [[1532, 66, 1586, 98], 2, 'INFO']])],
    exp: ['Saves, no Subform / field error', 'Updates the same layout', 'Was 422 on the Subform field'] },
  2294: { verdict: 'PARTIAL', panels: [P('v42-import-options.png', 'Import wizard › Assign: renamed option and manual approval "Coming soon" (items 1–2).', [400, 90, 800, 500], [[[430, 350, 1170, 412], 1, 'PASS'], [[430, 510, 1170, 556], 2, 'PASS']])],
    exp: ['Renamed', 'Implemented or Coming soon', 'Offered', 'All four offered and working', 'All options', 'Settable and running', 'Stored and applied', 'Runs', 'Offered', 'Per process', 'Delay honoured', 'Available', 'No automation'] },
  1344: { verdict: 'PASS', panels: [P('v39-entities.png', 'Settings › Audit Log › All Entities: module names, "Records (all modules)"; no raw or table names.', [420, 280, 600, 380], [[[432, 380, 684, 660], 1, 'PASS']])], exp: ['No duplicates', 'Labels only, grouped as asked', 'Gone'] },
  2621: { verdict: 'PASS', panels: [P('v16-inline-edit.png', 'Transactions list › Pipeline pencil → "Change pipeline?" to "1" with its stage.', [560, 280, 580, 340], [[[596, 292, 1106, 608], 1, 'PASS']]), P('v19-mass-pipeline.png', 'Mass Update › Pipeline with "Stage in the new pipeline".', [560, 220, 580, 460], [[[588, 324, 1112, 510], 2, 'PASS']])],
    exp: ['Not limited to "Standard (Standard)"', 'Moves', 'Moves', 'Moves'] },
  2630: { verdict: 'PARTIAL', panels: [], exp: ['Says if the sender cannot send', 'Failure reported, not "Sent"', 'Shown as failed with the reason', 'No sent entry for a failed email', '—'] },
  2632: { verdict: 'PASS', panels: [P('v21-bell.png', 'Bell (CRM Admin): notifications listed.', [1152, 0, 448, 900], [[[1160, 132, 1596, 860], 1, 'PASS']])], exp: ['200', '200', 'Bell lists notifications'] },
  2634: { verdict: 'PASS', panels: [P('v36-portal-on.png', 'Portal on, signed-out browser: the portal\'s Sign in page.', [380, 0, 640, 560], [[[480, 92, 920, 512], 1, 'PASS']]), P('v36-portal-off.png', 'Portal off: "This portal is not available".', [380, 80, 640, 200], [[[480, 120, 920, 212], 2, 'PASS']])],
    exp: ['—', 'Sign-in page', '"Not available" page'] },
  2406: { verdict: 'FAIL', panels: [], exp: ['—', 'Removed', 'Desk contact in the recycle bin', 'Restorable'] },
  2419: { verdict: 'PASS', panels: [], exp: ['—', 'Owner = rule user', 'Unchanged', '—', 'Owner = rule user'] },
  1797: { verdict: 'PASS', panels: [], exp: ['—', 'Deleted forever', '—', 'No new orphans'] },
  2622: { verdict: 'PASS', panels: [P('u1d-search.png', 'Test user 1 (User profile): top search box returns records.', [512, 108, 576, 490], [[[520, 400, 1080, 560], 1, 'PASS']])], exp: ['200', 'Results, no "no access" message'] },
  2623: { verdict: 'PASS', panels: [], exp: ['Stored', '3 tasks'] },
  2624: { verdict: 'BLOCKED', panels: [P('v34-files-15.png', 'Files tab: every upload fails on staging (storage PUT 500).', [290, 300, 1300, 600], [[[1157, 810, 1575, 876], 2, 'FAIL'], [[290, 356, 1570, 552], 1, 'INFO']])], exp: ['Every step logged', 'Attachment added / removed logged'] },
  2645: { verdict: 'PASS', panels: [P('v38-export-allfields.png', 'Export Leads: "All fields — Every field on the layout this list shows, plus Record ID, Tags and the audit columns."', [608, 168, 384, 564], [[[620, 550, 980, 612], 1, 'PASS']])], exp: ['—', 'Layout fields + Record ID, Tags, audit', '—'] },
  2646: { verdict: 'PASS', panels: [], exp: ['—', 'Refused with the message', 'Refused', 'Refused', 'Saved'] },
  2647: { verdict: 'BLOCKED', panels: [], exp: ['12', 'Report shows 12'] },
  2410: { verdict: 'PASS', panels: [], exp: ['Refused with a message', 'Allowed', '—'] },
  1324: { verdict: 'PASS', panels: [P('v16-inline-edit.png', 'Inline edit of Pipeline: the change-pipeline dialog, not an empty picker.', [560, 280, 580, 340], [[[596, 292, 1106, 608], 1, 'PASS']]), P('v18-selected.png', 'List after the change: Pipeline shown as "1" for QA RT r8 deal (later moved back by Mass Update).', [260, 230, 1440, 110], [[[1250, 285, 1390, 320], 2, 'PASS']])], exp: ['Pipelines + stage offered', 'Applied'] },
  1316: { verdict: 'PASS', panels: [P('v19-mass-pipeline.png', 'Mass Update offers Pipeline with "Stage in the new pipeline".', [560, 220, 580, 460], [[[588, 324, 1112, 510], 1, 'PASS']])], exp: ['Pipeline + stage', 'Deals moved'] },
  1312: { verdict: 'PASS', panels: [P('v16-inline-edit.png', '"Stage in the new pipeline" in the change-pipeline dialog.', [560, 280, 580, 340], [[[618, 455, 1082, 530], 1, 'PASS']])], exp: ['Asks the stage', 'Lands on the chosen stage'] },
  1694: { verdict: 'PASS', panels: [], exp: ['Refused', 'Refused'] },
  2648: { verdict: 'PASS', panels: [], exp: ['409 clear message', '409'] },
  2649: { verdict: 'PASS', panels: [], exp: ['Refused', '—', 'Refused', 'Saved'] },
  2650: { verdict: 'PASS', panels: [], exp: ['Stored', 'Accepted and listed', '—', '—'] },
  2625: { verdict: 'PASS', panels: [], exp: ['Saved', '11th refused'] },
  2626: { verdict: 'PASS', panels: [P('v13-list-wide.png', 'Transactions list: Pipeline column shows names.', [260, 230, 1440, 330], [[[1250, 285, 1390, 560], 1, 'PASS']]), P('v13-inline-pipeline.png', 'Deal page: Pipeline "Standard", stage labels, Stage "Needs Analysis".', [340, 356, 1280, 420], [[[352, 366, 940, 456], 2, 'PASS'], [[1284, 700, 1420, 750], 2, 'PASS']])], exp: ['Names', 'Labels'] },
  2627: { verdict: 'PASS', panels: [P('v1-lead-timeline.png', 'Lead timeline: "Lead created".', [290, 350, 960, 260], [[[400, 500, 700, 550], 1, 'PASS']])], exp: ['"Lead created"', 'Module display name'] },
  2629: { verdict: 'PASS', panels: [P('v26-reminders-users.png', 'Activity Reminders: each list in its own scrolling box.', [292, 120, 860, 780], [[[312, 160, 1120, 416], 1, 'PASS'], [[312, 628, 686, 884], 2, 'PASS'], [[746, 628, 1120, 884], 3, 'PASS']])], exp: ['Fixed height + scroll', 'Fixed height + scroll', 'Fixed height + scroll', 'Item at that spot'] },
  2631: { verdict: 'PASS', panels: [], exp: ['Refused or warned'] },
  2633: { verdict: 'PASS', panels: [P('v24-signals.png', 'Settings › Signals (My Notifications): names, no raw keys.', [292, 400, 770, 500], [[[300, 500, 700, 900], 1, 'PASS']])], exp: ['Names', 'Names'] },
};
const DIR = path.join(__dirname, 'specs-r8'); fs.mkdirSync(DIR, { recursive: true });
const only = process.argv.slice(2); let n = 0;
for (const [id, s] of Object.entries(S)) {
  if (only.length && !only.includes(id)) continue;
  const out = `NDC-${id}-api.png`; const card = CARDS[out];
  const shot = []; for (const p of s.panels) for (const b of p.boxes) if (!shot.find(x => x.n === b.n)) shot.push({ n: b.n, kind: b.kind, cap: p.caption }); const k = Math.max(0, ...shot.map(x => x.n));
  const marks = card.rows.map((r, i) => [i + 1, k + i + 1, pf(r[3])]);
  const panels = [...s.panels, CARD(out, 'API / automation evidence — ' + card.title.replace(/^NDC-\d+ · /, ''), marks)];
  const rows = [...shot.map(x => [String(x.n), 'Screen', '—', x.cap, x.kind]), ...rowsOf(out, s.exp).map((r, i) => [String(k + i + 1), r[1], r[2], r[3], r[4]])];
  const spec = { out: `NDC-${id}-retest-${s.verdict}.png`, ticket: `NDC-${id}`, title: title(id), verdict: s.verdict, ...ENV, panels, rows };
  const f = path.join(DIR, `NDC-${id}.json`); fs.writeFileSync(f, JSON.stringify(spec, null, 1));
  execFileSync('node', [path.join(__dirname, 'annotate.js'), f], { encoding: 'utf8' }); n++;
}
console.log('rendered', n);
