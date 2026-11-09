// Posts the approved Wave 2 retest results: for each ticket attach <ticket>-retest.png, post the drafted comment
// (after/retest-comments.md), and move the state where agreed with the user (26 Oct 2026). API key from Downloads, never printed.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const W2 = path.resolve(__dirname, '..');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1792931401453.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const IDS = {1597:'e9d8afc7-7498-4ad9-8109-6b80db724105',1600:'db49fd3d-7a18-4bb0-97c3-e8ba362f0bab',1601:'d2251673-ef41-4f52-88fe-4f6872081379',1795:'9055774f-badf-4ed9-95d4-5079f8855547',1603:'aca8f04a-d1bf-4291-8add-987a7a7cd59d',1602:'7f0cd60b-84ae-488e-9fd0-6a1447121c33',1797:'2d00ee7f-5f93-4dee-b959-161486a97919',1484:'e9c73778-1b15-47ae-9662-51d434aa1e63',1832:'2fb1e4b7-93b8-4bd4-b6f5-937280b46a57',1193:'967a6cd5-5de1-458c-b6a6-5c6f4012a1d8',1197:'b67daa85-a71a-4c32-95bc-9dd3294f9475',1216:'deff0b1b-cb5f-4474-a4da-48a9016a2785',1302:'2610d4f4-1d79-4d2b-80d1-e70ac05915c7',1593:'dea744ef-8c6a-465c-aa95-08d79d675299',1599:'a1ce40d2-7034-4ca9-8229-992adb312dd3',1554:'424a4cb2-e177-407c-8c0f-b613e8629e7b',2122:'5d893ed7-7e5a-49c0-8810-94471cb82d12',2098:'d1ef2976-b984-4e8e-b2a2-376c480c8d32',2280:'cae95c37-bdf5-4d58-ac0f-adbac851d0fa',2136:'9f559025-4222-4823-933b-57eb3bff3635',2137:'533f6806-b5a3-410d-8ec9-ea4f67c174e7',1819:'2b58d6ec-e6e0-4eb1-9fd9-febc541c2d08',1324:'b983cc0e-7117-4929-a173-f81dd841000b',1316:'4c9b218f-b4a4-4a43-b279-92042723719d',1312:'ce5dac3d-cf36-417f-afb0-ad599be28017'};
const MOVE = {1597:DONE,1484:DONE,1302:DONE,1216:DONE,1197:DONE,1797:BUG,1193:BUG};
const md = fs.readFileSync(path.join(W2, 'after/retest-comments.md'), 'utf8');
const sections = {}; for (const part of md.split(/^## /m).slice(1)) { const n = part.match(/^NDC-(\d+)/); if (n) sections[n[1]] = part.split('\n').slice(1).join('\n').trim(); }
const h = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
(async () => {
  const SKIP = (process.argv[2] || '').split(',');
  const retry = async fn => { try { return await fn(); } catch (e) { await new Promise(r => setTimeout(r, 5000)); return fn(); } };
  for (const [seq, id] of Object.entries(IDS)) {
    if (SKIP.includes(seq)) continue;
    const html = sections[seq]; const img = path.join(W2, `evidence/annotated/NDC-${seq}-retest.png`);
    if (!html || !fs.existsSync(img)) { console.log(`NDC-${seq} SKIPPED: comment ${!!html}, image ${fs.existsSync(img)}`); continue; }
    await retry(async () => execFileSync('node', [path.join(__dirname, 'plane-attach.js'), id, img], { stdio: 'pipe' }));
    const c = await retry(() => fetch(`${B}/work-items/${id}/comments/`, { method: 'POST', headers: h, body: JSON.stringify({ comment_html: html }) }));
    let s = '-'; if (MOVE[seq]) { const p = await retry(() => fetch(`${B}/work-items/${id}/`, { method: 'PATCH', headers: h, body: JSON.stringify({ state: MOVE[seq] }) })); s = p.status; }
    console.log(`NDC-${seq} image attached, comment ${c.status}, state ${s}`);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
