// 7 Nov: record Plane filing (NDC-2811..2814) in report.md and build-html.js
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const F = path.join(RUN, 'report.md');
let r = fs.readFileSync(F, 'utf8').replace(/\r\n/g, '\n');
const f = JSON.parse(fs.readFileSync(path.join(RUN, 'out/plane-filed.json'), 'utf8'));
for (const k in f) {
  const lines = r.split('\n'); const i = lines.findIndex(l => l.startsWith('| ' + k + ' |'));
  if (i < 0) throw new Error('row ' + k);
  lines[i] = lines[i].replace(/\| New( \(7 Nov\))? \|\s*$/, '| Filed ' + f[k].seq + ' (7 Nov) |');
  if (!lines[i].includes(f[k].seq)) throw new Error('status cell ' + k);
  r = lines.join('\n');
}
const metaOld = lines => lines;
r = r.replace(/\| Plane \| [^\n]*\|/, '| Plane | 7 Nov, after your approval: B-2..B-5 filed as NDC-2811..NDC-2814 (state Bug, module Desk, Sprint 15, image attached, related to NDC-2275 and NDC-1978). Comments on NDC-2275 / NDC-2752 / NDC-1978 drafted, not posted |');
fs.writeFileSync(F, r);

const S = path.join(__dirname, 'build-html.js');
let s = fs.readFileSync(S, 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing ' + a.slice(0, 50)); s = s.replace(a, b); };
rep('Plane draft (not posted)</h2><p class="note">Waiting for your review and filing fields. Full text and images: plane-draft.html.</p>', 'Plane</h2><p class="note">Bugs filed 7 Nov after your approval. Comments on existing items: drafted, not posted. Full text: plane-draft.html.</p>');
rep("txt:'Plane draft (not posted)'", "txt:'Plane'");
rep("'</td><td>New bug</td>", "'</td><td>'+(FILED[b.key]?'Filed '+FILED[b.key].seq:'New bug')+'</td>");
rep("const pd=JSON.parse(", "const FILED=fs.existsSync(path.join(RUN,'out/plane-filed.json'))?JSON.parse(fs.readFileSync(path.join(RUN,'out/plane-filed.json'),'utf8')):{};const pd=JSON.parse(");
rep(' · nothing published to Plane', ' · bugs filed in Plane as NDC-2811..2814');
fs.writeFileSync(S, s);
console.log('ok');
