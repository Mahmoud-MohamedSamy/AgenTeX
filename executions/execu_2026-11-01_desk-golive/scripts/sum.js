// Usage: node sum.js <raw-ndc name> [width]
const o = require('../wave2/raw-ndc/' + process.argv[2] + '.json'); const w = +process.argv[3] || 300;
for (const [k, v] of Object.entries(o)) { if (k === 'R' || k === 'CREATED') continue; const s = typeof v === 'object' && v && 's' in v ? (v.s + ' ' + (v.e || '') + ' ' + (v.d || '').slice(0, 110)) : JSON.stringify(v).slice(0, w); console.log(k, ':', s); }
