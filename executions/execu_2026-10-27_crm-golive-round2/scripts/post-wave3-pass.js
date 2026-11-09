// Posts the Wave 3 (+NDC-1333) "still passes" comments (wave3/after/pass-comments.md) with images on tickets still in Done. No state changes.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const R = path.resolve(__dirname, '..');
const ATTACH = path.resolve(R, '../execu_2026-10-25_crm-golive-wave2/scripts/plane-attach.js');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1792931401453.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const IDS = {2422:'79c37985-afc7-494f-80b7-787cac009234',2421:'2997b047-ab93-4c3b-8a9d-7be3cc9a700d',2411:'5f61b254-25be-48fb-a2c5-805cf2668a6b',2391:'99f20ca0-c9d1-4a21-a4cb-a2273c435b6e',2334:'7347b379-cb48-414c-af3a-7d93bc780508',2323:'3e832279-3a1a-458c-8d33-2b599d5aa26c',2309:'42e16ff8-d3e2-457a-941f-79a591a574aa',2308:'0fe9eca6-89ee-4a09-ab85-a27a1cf1e1eb',2298:'9ff00920-1f60-4246-ab23-0878a03647d1',2297:'c97e7584-b075-4058-8adc-83c2b47ea364',2296:'084ef91a-e6e2-4e6b-8273-ebab4d8a7dd8',1333:'de47141e-6067-44f5-9bd0-e0520030ecf7'};
const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa';
const md = fs.readFileSync(path.join(R, 'wave3/after/pass-comments.md'), 'utf8');
const sec = {}; for (const p of md.split(/^## /m).slice(1)) { const n = p.match(/^NDC-(\d+)/); if (n) sec[n[1]] = p.split('\n').slice(1).join('\n').trim(); }
const retry = async fn => { for (let i = 0; i < 3; i++) { try { return await fn(); } catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 8000)); } } };
(async () => {
  for (const [seq, id] of Object.entries(IDS)) {
    if (!sec[seq]) { console.log(`NDC-${seq} SKIPPED: no comment draft`); continue; }
    const st = await retry(async () => (await (await fetch(`${B}/work-items/${id}/`, { headers: { 'X-API-Key': KEY } })).json()).state);
    if (st !== DONE) { console.log(`NDC-${seq} SKIPPED: no longer in Done`); continue; }
    await retry(async () => execFileSync('node', [ATTACH, id, path.join(R, `${seq === '1333' ? 'wave4' : 'wave3'}/evidence/annotated/NDC-${seq}-retest.png`)], { stdio: 'pipe' }));
    const c = await retry(() => fetch(`${B}/work-items/${id}/comments/`, { method: 'POST', headers: { 'X-API-Key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ comment_html: sec[seq] }) }));
    console.log(`NDC-${seq} image attached, comment ${c.status}`);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
