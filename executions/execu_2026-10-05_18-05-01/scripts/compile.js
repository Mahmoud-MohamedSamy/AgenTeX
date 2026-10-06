// Merge per-group logs into results.jsonl (later files override earlier ones per id), then apply overrides.json.
// Usage: node compile.js <log1.json> <log2.json> ...
const fs = require('fs'); const path = require('path');
const runDir = path.resolve(__dirname, '..'); const outF = path.join(runDir, 'results.jsonl');
const prev = fs.existsSync(outF) ? fs.readFileSync(outF, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
const map = new Map(prev.map(r => [r.id, r]));
for (const f of process.argv.slice(2)) for (const r of JSON.parse(fs.readFileSync(f, 'utf8'))) map.set(r.id, { ...r, source: path.basename(f) });
const ovF = path.join(__dirname, 'overrides.json');
if (fs.existsSync(ovF)) for (const [id, o] of Object.entries(JSON.parse(fs.readFileSync(ovF, 'utf8')))) map.set(id, { ...(map.get(id) || { id }), ...o });
const rows = [...map.values()];
fs.writeFileSync(outF, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
const c = {}; for (const r of rows) if (!/\./.test(r.id)) c[r.verdict] = (c[r.verdict] || 0) + 1;
console.log(rows.length, 'rows;', JSON.stringify(c));
