const fs = require('fs');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
(async () => { for (let i = 0; i < 4; i++) { try { const r = await fetch(`${B}/work-items/${process.argv[2]}/attachments/`, { headers: { 'X-API-Key': KEY } }); const j = await r.json(); const a = Array.isArray(j) ? j : j.results || [];
  const m = {}; for (const x of a) { const n = x.attributes?.name || x.name; m[n] = (m[n] || []).concat(x.is_uploaded ? 'up' : 'NOT'); } console.log(JSON.stringify(m, null, 0)); return; } catch (e) { await new Promise(s => setTimeout(s, 3000)); } } })();
