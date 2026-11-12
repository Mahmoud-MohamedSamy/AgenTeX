const fs = require('fs'), path = require('path'); const RUN = path.resolve(__dirname, '..');
const r = require(RUN + '/out/sheet-results.json'); const ids = (process.env.IDS || 'A7 B1 B9 C7 D26 E7 G7 G12 G14 G17 G18 G19 G22 H5 H6 H7 H9 I8 J5 J10 K2 M3 M4 N3 X2 X6 Z6 Z10 Z11 Z12 Z13 Z15').split(' ');
const old = JSON.parse(fs.readFileSync(RUN + '/out/sheet/R1.json', 'utf8')); const ops = [];
for (const i of ids) { const d = { ...old, status: r[i].status, notes: r[i].notes, at: new Date().toISOString(), by: process.env.BY || 'Claude (run 13 Nov)', byClaude: true }; const p = RUN + '/out/sheet/' + i + '.json'; fs.writeFileSync(p, JSON.stringify(d)); ops.push({ op: 'set', collection: 'results', doc_id: i, file_path: p.split(path.sep).join('/') }); }
fs.writeFileSync(RUN + '/out/batch3.json', JSON.stringify(ops)); console.log(ops.length, Object.keys(old).join(','));
