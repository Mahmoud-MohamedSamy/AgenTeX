// Posts the CRM ⇄ Desk retest comments (after/cdi-retest-comments.md) with each ticket's image; moves NDC-2409 Bug → Done.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const W = path.resolve(__dirname, '..');
const ATTACH = path.resolve(W, '../../execu_2026-10-25_crm-golive-wave2/scripts/plane-attach.js');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1792931401453.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const IDS = {2393:'345ef0c3-275c-40bb-b107-a3d69efda0cb',2395:'6528401a-da40-4376-841f-25c90fab83b7',2396:'896468cb-2eef-4543-8f13-734357f05737',2397:'26fdc768-743c-48bb-8037-7e18a6cef006',2398:'a30030d3-c2ec-4d10-ae59-04713b3a7791',2401:'71e613a6-f2c4-41ea-b4d7-828409e32e83',2402:'4eb61add-499a-43ba-b97f-8f52b8e9dba5',2405:'daedede5-6b6e-4a03-86f4-2e8b5701ffb5',2409:'e5df6fb8-650d-4056-ab6b-3323587c4151'};
const MOVE = {2409:'11f2d31f-9d01-4463-a1de-ce99521b97aa'};
const md = fs.readFileSync(path.join(W, 'after/cdi-retest-comments.md'), 'utf8');
const sec = {}; for (const p of md.split(/^## /m).slice(1)) { const n = p.match(/^NDC-(\d+)/); if (n) sec[n[1]] = p.split('\n').slice(1).join('\n').trim(); }
const h = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const retry = async fn => { for (let i = 0; i < 3; i++) { try { return await fn(); } catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 8000)); } } };
(async () => {
  for (const [seq, id] of Object.entries(IDS)) {
    await retry(async () => execFileSync('node', [ATTACH, id, path.join(W, `evidence/annotated/NDC-${seq}-retest.png`)], { stdio: 'pipe' }));
    const c = await retry(() => fetch(`${B}/work-items/${id}/comments/`, { method: 'POST', headers: h, body: JSON.stringify({ comment_html: sec[seq] }) }));
    let s = '-'; if (MOVE[seq]) s = (await retry(() => fetch(`${B}/work-items/${id}/`, { method: 'PATCH', headers: h, body: JSON.stringify({ state: MOVE[seq] }) }))).status;
    console.log(`NDC-${seq} image attached, comment ${c.status}, state ${s}`);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
