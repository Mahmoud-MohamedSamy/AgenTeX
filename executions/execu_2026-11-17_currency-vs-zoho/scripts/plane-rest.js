// node plane-rest.js <METHOD> <path under project, or "ws:" + path under workspace> [jsonBodyFile]
// Uses the Plane API key from the Downloads CSV (never printed). Prints status + body (truncated).
const fs = require('fs');
const csv = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',');
const src = fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/docs/desk-skills/tools/plane-attach.js', 'utf8');
// reuse the attach tool's own key expression so the column choice stays identical
const keyExpr = src.match(/const KEY\s*=\s*([^;]+);/)[1];
const KEY = eval(keyExpr);
const W = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy';
const P = W + '/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const [method, p, bodyFile] = process.argv.slice(2);
const url = p.startsWith('ws:') ? W + p.slice(3) : P + p;
(async () => {
  const r = await fetch(url, { method, headers: { 'X-API-Key': KEY, 'Content-Type': 'application/json' }, body: bodyFile ? fs.readFileSync(bodyFile, 'utf8') : undefined });
  const t = await r.text();
  console.log(r.status, t.slice(0, +(process.env.MAX || 1500)));
})().catch(e => { console.error('ERR', e.message, e.cause && e.cause.code); process.exit(1); });
