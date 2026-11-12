const r = require('../out/sheet-results.json'); const fs = require('fs'); const D = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/out/';
const ids = ['A3', 'A4', 'A6', 'B4', 'K2', 'K8', 'G8', 'Z4']; const b = [];
for (const id of ids) { const d = { ...r[id], at: new Date().toISOString(), byClaude: true }; fs.writeFileSync(D + 'sheet4/' + id + '.json', JSON.stringify(d)); b.push({ op: 'set', collection: 'results', doc_id: id, file_path: D + 'sheet4/' + id + '.json' }); console.log(id, d.status); }
fs.writeFileSync(D + 'batch-s4.json', JSON.stringify(b));
