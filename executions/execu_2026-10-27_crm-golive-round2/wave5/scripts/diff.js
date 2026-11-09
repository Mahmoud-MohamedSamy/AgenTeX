// node diff.js -> prints keys whose JSON differs between baseline/snapshot.json and after/snapshot.json
const a = require('../baseline/snapshot.json'), b = require('../after/snapshot.json');
const out = [];
for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
  const x = JSON.stringify(a[k]), y = JSON.stringify(b[k]);
  if (x === y) { out.push(`| ${k} | identical |`); continue; }
  let note = 'differs';
  if (Array.isArray(a[k]) && Array.isArray(b[k])) {
    const ia = new Set(a[k].map(v => JSON.stringify(v))), ib = new Set(b[k].map(v => JSON.stringify(v)));
    const add = b[k].filter(v => !ia.has(JSON.stringify(v))), rem = a[k].filter(v => !ib.has(JSON.stringify(v)));
    note = `differs: +${add.length} / -${rem.length}: ` + JSON.stringify({ added: add, removed: rem }).slice(0, 600);
  } else note = 'differs: before ' + (x || '').slice(0, 250) + ' / after ' + (y || '').slice(0, 250);
  out.push(`| ${k} | ${note.replace(/\|/g, '/')} |`);
}
console.log(out.join('\n'));
