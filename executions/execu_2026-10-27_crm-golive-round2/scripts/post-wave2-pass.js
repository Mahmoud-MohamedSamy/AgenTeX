// Posts the Wave 2 "still passes" comments (wave2/after/pass-comments.md) with images on Done tickets. No state changes.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const R = path.resolve(__dirname, '..');
const ATTACH = path.resolve(R, '../execu_2026-10-25_crm-golive-wave2/scripts/plane-attach.js');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1792931401453.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const IDS = {1484:'e9c73778-1b15-47ae-9662-51d434aa1e63',1832:'2fb1e4b7-93b8-4bd4-b6f5-937280b46a57',1302:'2610d4f4-1d79-4d2b-80d1-e70ac05915c7',1603:'aca8f04a-d1bf-4291-8add-987a7a7cd59d',1597:'e9d8afc7-7498-4ad9-8109-6b80db724105',1600:'db49fd3d-7a18-4bb0-97c3-e8ba362f0bab',1601:'d2251673-ef41-4f52-88fe-4f6872081379',2302:'0e6cb4e3-3e24-45b3-a5b3-534e1901c13a',2382:'a28753b1-964a-466a-beeb-d54252161c3d',2386:'b97a3d54-1567-4c1d-9228-79d9145e644b',2282:'4faacfdf-a173-4647-9981-dde53b74178a'};
const md = fs.readFileSync(path.join(R, 'wave2/after/pass-comments.md'), 'utf8');
const sec = {}; for (const p of md.split(/^## /m).slice(1)) { const n = p.match(/^NDC-(\d+)/); if (n) sec[n[1]] = p.split('\n').slice(1).join('\n').trim(); }
const retry = async fn => { for (let i = 0; i < 3; i++) { try { return await fn(); } catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 8000)); } } };
(async () => {
  for (const [seq, id] of Object.entries(IDS)) {
    if (!sec[seq]) { console.log(`NDC-${seq} SKIPPED: no comment draft`); continue; }
    await retry(async () => execFileSync('node', [ATTACH, id, path.join(R, `wave2/evidence/annotated/NDC-${seq}-retest.png`)], { stdio: 'pipe' }));
    const c = await retry(() => fetch(`${B}/work-items/${id}/comments/`, { method: 'POST', headers: { 'X-API-Key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ comment_html: sec[seq] }) }));
    console.log(`NDC-${seq} image attached, comment ${c.status}`);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
