// save-result.js <outfile> : reads the run-code JSON result on stdin, writes it, appends CREATED ids to after/created.jsonl
const fs = require('fs'), path = require('path');
let s = ''; process.stdin.on('data', d => s += d).on('end', () => {
  let v = JSON.parse(s); if (typeof v === 'string') v = JSON.parse(v);
  const out = process.argv[2]; fs.writeFileSync(out, JSON.stringify(v, null, 1));
  if (v && Array.isArray(v.CREATED) && v.CREATED.length) {
    const led = path.join(path.dirname(out), 'created.jsonl');
    fs.appendFileSync(led, v.CREATED.map(c => JSON.stringify({ ...c, src: path.basename(out) })).join('\n') + '\n');
  }
  console.log('saved', out, s.length, 'created', (v && v.CREATED || []).length);
});
