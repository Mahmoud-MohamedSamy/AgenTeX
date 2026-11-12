// node rec.js STATUS "ROW ROW" "note"  -> records rows in a6/results.json (last write wins)
const fs = require('fs'), f = __dirname + '/results.json'; const R = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
const [st, rows, note] = process.argv.slice(2); for (const r of rows.split(/\s+/).filter(Boolean)) R[r] = [st, note || '', new Date().toISOString().slice(0, 16)];
fs.writeFileSync(f, JSON.stringify(R, null, 1)); console.log(Object.keys(R).length, 'rows recorded');
