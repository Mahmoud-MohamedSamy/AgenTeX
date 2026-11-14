// Usage: node scripts/w3-rec.js ID status "note"  — adds/replaces a row in wave3/results-data.js
const fs = require('fs'); const p = __dirname + '/../wave3/results-data.js'; const m = require(p);
const [id, st, note] = process.argv.slice(2); m.R[id] = [st, note];
const keys = Object.keys(m.R).sort((a, b) => +a.slice(3) - +b.slice(3)); const R = {}; for (const k of keys) R[k] = m.R[k];
fs.writeFileSync(p, 'module.exports.R = ' + JSON.stringify(R, null, 1) + ';\nmodule.exports.BLOCK = ' + JSON.stringify(m.BLOCK || '') + ';\n'); console.log(id, st, Object.keys(R).length);
