// Posts the Wave 4 retest comments (after/retest-comments.md) with each ticket's annotated image. No state changes.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const W = path.resolve(__dirname, '..');
const ATTACH = path.resolve(W, '../../execu_2026-10-25_crm-golive-wave2/scripts/plane-attach.js');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1792931401453.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const IDS = {1141:'4e4f6379-1e0d-40d7-9449-0b7e3a69aae3',1479:'a630863e-789b-4d9d-8060-e5bc7e8b2477',2496:'53fc1bde-634c-4678-8231-f181aad9e071',1482:'f9616067-b05d-4184-bf3c-64b1be304452',1333:'de47141e-6067-44f5-9bd0-e0520030ecf7'};
const md = fs.readFileSync(path.join(W, 'after/retest-comments.md'), 'utf8');
const sec = {}; for (const p of md.split(/^## /m).slice(1)) { const n = p.match(/^NDC-(\d+)/); if (n) sec[n[1]] = p.split('\n').slice(1).join('\n').trim(); }
const retry = async fn => { for (let i = 0; i < 3; i++) { try { return await fn(); } catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 8000)); } } };
(async () => {
  for (const [seq, id] of Object.entries(IDS)) {
    const img = path.join(W, `evidence/annotated/NDC-${seq}-retest.png`);
    await retry(async () => execFileSync('node', [ATTACH, id, img], { stdio: 'pipe' }));
    const c = await retry(() => fetch(`${B}/work-items/${id}/comments/`, { method: 'POST', headers: { 'X-API-Key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ comment_html: sec[seq] }) }));
    console.log(`NDC-${seq} image attached, comment ${c.status}`);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
