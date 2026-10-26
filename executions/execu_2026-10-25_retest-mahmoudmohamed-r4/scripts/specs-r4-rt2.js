// Second retest of NDC-1602 and NDC-2399 (26 Oct 2026, user asked to run them). Writes the API cards (apicard.js),
// the annotation specs, and renders the images with annotate.js. Usage: node specs-r4-rt2.js
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const run = (s, f) => execFileSync('node', [path.join(__dirname, s), f], { encoding: 'utf8' }).trim();
const DATE = '26 Oct 2026', I = '/api/v1/desk/integrations/crm';
const cards = {
  'NDC-1602-r2-api.png': { host: 'staging-crm.taviportal.com', who: 'mahmoud.mahamed1515 (CRM Admin)', date: DATE, title: 'NDC-1602 · Empty Bin on a 281-item bin — calls the page made', rows: [
    ['bin size', 'GET /api/v1/audit/recycle-bin/items (all pages)', '281 items before Empty Bin', 'info'],
    ['batches 1–5', 'POST /api/v1/audit/recycle-bin/delete {ids: 50} ×5', '200 each, 3.4–5.6 s per call — no 504, no timeout', 'ok'],
    ['batch 6', 'POST /api/v1/audit/recycle-bin/delete {ids: 31}', '200 in 1.4 s — 281 ids sent in total (the whole bin, not only the loaded rows)', 'ok'],
    ['progress', 'Banner while running', '"Working on it…" → "Deleting… 100 of 281 items done. You can keep using the page."', 'ok'],
    ['left after', 'GET /audit/recycle-bin/items', '16 items left — all failed with recyclebin.error.forbidden (records of deleted/test modules from 14 Sep–18 Oct, deleted by ndc-staging-owner)', 'info'],
    ['2nd Empty Bin', 'POST /recycle-bin/delete {ids: 17}', '0 succeeded, 17 failed: 16 forbidden + 1 not_found_or_out_of_scope ("QA W2 UI 50121", already purged, still listed on the page)', 'info'],
    ['messages', 'Toasts', '"(no name): You don\'t have permission to do this. (8 items)", "zxcaqwe23: …", "QA W2 UI 50121: Item no longer exists or is outside your access." — no final "n removed, n failed" summary', 'info']] },
  'NDC-2399-r2-api.png': { host: 'staging-desk.taviportal.com', who: 'mahmoud.mahamed1515 (Desk Administrator)', date: DATE, title: 'NDC-2399 · Disconnect + Connect — initial sync and the admin notice', rows: [
    ['disconnect', 'Settings › CRM ⇄ Desk Integration › Disconnect › confirm (08:04:19 UTC)', 'Disconnected', 'info'],
    ['connect', 'Connect › confirm (08:05:03 UTC)', 'Toast "Integration connected."; enabled true, paused false', 'ok'],
    ['runs', `GET ${I}/runs`, 'initial_customers: requested 19, created 0, updated 0, skipped 14, needs_attention 5 · initial_contracts: requested 2, needs_attention 2', 'info'],
    ['bell', 'GET /api/v1/notifications', '2 new: "CRM customer sync finished: 0 added, 0 updated, 5 could not sync" / "CRM contract sync finished: 0 added, 0 updated, 2 could not sync" — "The Failure Log lists the records that could not sync."', 'ok'],
    ['skipped count', 'Notice text vs run', 'The 14 skipped (ignored) customers are not in the notice', 'bad'],
    ['reasons', `GET ${I}/failures + Failure Log tab`, 'Still 19 entries, newest 07:30 UTC — none of the 7 records from this run; no skip/failure reasons anywhere', 'bad'],
    ['email', 'Admin mailbox', 'Not checked (no access to the admin inbox)', 'info'],
    ['settings', `GET ${I}/config before/after`, 'Identical except import timestamps — nothing reset by Connect', 'ok']] },
};
const B = {}; fs.mkdirSync(path.join(__dirname, 'cards'), { recursive: true });
for (const [out, c] of Object.entries(cards)) { const f = path.join(__dirname, 'cards', out.replace('.png', '.json')); fs.writeFileSync(f, JSON.stringify({ out, ...c }, null, 1)); B[out] = JSON.parse(run('apicard.js', f).replace(/^\S+\s+/, '')); }
const P = (img, caption, crop, boxes) => ({ img, caption, crop, w: /^NDC-/.test(img) ? 1600 : 1280, h: /^NDC-/.test(img) ? 900 : 720, boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) });
const CARD = (img, caption, marks) => { const bx = B[img]; return P(img, caption, [0, 0, 1600, Math.min(900, bx[bx.length - 1][3] + 16)], marks.map(([r, n, kind]) => [[272, bx[r[0]][1] - 4, 1570, bx[r[r.length - 1]][3] + 4], n, kind])); };
const S = {
  1602: { title: 'Recycle Bin | Empty Bin returns 504 Gateway Timeout.', verdict: 'PASS', env: 'staging-crm.taviportal.com · tenant NDC-Staging · Edge (headless) · account mahmoud.mahamed1515 (CRM Admin)',
    panels: [P('1602-r2-05-after-15s.png', 'Empty Bin on 281 items runs in the background: "Deleting… 100 of 281 items done. You can keep using the page."; count drops to 181.', [268, 56, 1012, 260], [[[292, 189, 1256, 237], 1, 'PASS'], [[975, 74, 1050, 102], 2, 'PASS']]),
      CARD('NDC-1602-r2-api.png', 'All 281 ids sent in 6 batches, every call 200 in ≤ 5.6 s. 16 items left are refused as forbidden and reported per item.', [[[1, 2], 3, 'PASS'], [[4], 4, 'INFO'], [[5, 6], 5, 'INFO']]),
      P('1602-r2-09-second-run-end.png', 'Leftovers: old items of deleted/test modules; Empty Bin again shows "You don\'t have permission to do this." per item.', [268, 56, 1012, 664], [[[292, 235, 1256, 460], 6, 'INFO'], [[840, 638, 1256, 696], 7, 'INFO']])],
    rows: [['1', 'Empty Bin on a large bin (281 items)', 'No 504 / timeout', 'Completed; 6 calls, all 200, 1.4–5.6 s each', 'PASS'],
      ['1–2', 'Runs in the background as the banner says', 'Progress, page usable', '"Deleting… 100 of 281 items done. You can keep using the page."; count updates live', 'PASS'],
      ['3', 'Clears the whole bin, not only loaded rows', 'All items submitted', '281 of 281 ids submitted; 264 removed', 'PASS'],
      ['4–7', 'Items that cannot be removed', 'Says what failed', '16 forbidden items (deleted test modules, owner\'s) reported per item with the reason', 'PASS'],
      ['—', 'Final summary', '"n removed, n failed"', 'No summary at the end; per-item toasts only; header said 17 while 16 were left (1 stale row)', 'INFO'],
      ['—', 'Size', '"1000+ items" in the ticket', 'Tested with 281; batches of 50 scale linearly', 'INFO']] },
  2399: { title: 'CRM - Desk Integration | No notice to the admin when the initial sync finishes', verdict: 'PARTIAL', env: 'staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) · account mahmoud.mahamed1515 (Desk Administrator)',
    panels: [P('2399-r2-05-bell.png', 'After Disconnect + Connect the admin\'s bell has two "CRM SYNC RUN" notices for the initial imports.', [832, 0, 448, 340], [[[848, 172, 1270, 326], 1, 'PASS']]),
      CARD('NDC-2399-r2-api.png', 'The notice has added / updated / could-not-sync counts, but not the 14 skipped, and the Failure Log it points to has none of the records.', [[[2, 3], 2, 'PASS'], [[4], 3, 'FAIL'], [[5], 4, 'FAIL'], [[7], 5, 'PASS']]),
      P('2399-r2-07-failure-log.png', 'Failure Log after the reconnect (11:05 local): still 19 entries, the newest from 10:30 — the 7 records of this run are not listed.', [268, 56, 1012, 664], [[[292, 225, 1256, 255], 6, 'FAIL'], [[292, 296, 1256, 430], 7, 'FAIL']])],
    rows: [['1', 'Admin told when initial sync is done', 'Notice in bell / email', '2 bell notices ("CRM customer/contract sync finished: …") within seconds of the runs', 'PASS'],
      ['2', 'Counts', 'Added / updated / ignored', '"0 added, 0 updated, 5 could not sync" — 14 skipped (ignored) customers missing', 'FAIL'],
      ['3–7', 'Skip / failure reasons', 'Reasons per record', 'Notice says "The Failure Log lists the records that could not sync" — none of the 7 are there; no reasons anywhere', 'FAIL'],
      ['—', 'Bell title', 'Readable', 'Truncated to "…finished: 0 added, …" in the list', 'INFO'],
      ['—', 'Email', 'Email to the admin (Zoho)', 'Not checked — no access to the admin mailbox', 'INFO'],
      ['5', 'Settings after reconnect', 'Unchanged', 'Config identical to the backup except import timestamps', 'PASS']] },
};
for (const [n, s] of Object.entries(S)) {
  const f = path.join(__dirname, 'specs', `NDC-${n}.json`);
  fs.writeFileSync(f, JSON.stringify({ out: `NDC-${n}-retest-${s.verdict}.png`, ticket: `NDC-${n}`, title: s.title, verdict: s.verdict, env: s.env, date: DATE, panels: s.panels, rows: s.rows }, null, 1));
  console.log(run('annotate.js', f));
}
