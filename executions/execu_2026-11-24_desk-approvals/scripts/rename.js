const fs = require('fs'), path = require('path');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
(async () => {
  const filed = require(path.resolve(__dirname, '../out/filed.json'));
  for (const [k, v] of Object.entries(filed)) {
    let g; for (let i = 0; i < 5; i++) { const rr = await fetch(`${B}/work-items/${v.id}/`, { headers: H }); const tx = await rr.text(); try { g = JSON.parse(tx); break; } catch (e) { await new Promise(s => setTimeout(s, 4000)); } } if (!g) { console.log(k, "read failed"); continue; } await new Promise(s => setTimeout(s, 1200));
    if (!/^Approvals \| /.test(g.name)) { console.log(`NDC-${g.sequence_id} kept: ${g.name.split(' | ')[0]}`); continue; }
    const name = g.name.replace(/^Approvals \| /, 'Approvals Page | ');
    const r = await fetch(`${B}/work-items/${v.id}/`, { method: 'PATCH', headers: H, body: JSON.stringify({ name }) });
    const j = await r.json(); console.log(`NDC-${g.sequence_id} ${r.status} ${j.name.slice(0, 70)}`);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
