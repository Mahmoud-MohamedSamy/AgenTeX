// node scripts/make-progress-w4.js — rebuild the Wave 4 parts of progress.html from wave4/cases.md + wave4/results-data.js
const fs = require('fs'); const E = __dirname + '/..';
const md = fs.readFileSync(E + '/wave4/cases.md', 'utf8');
const { R, CANDS, LEFT, LIVE } = require(E + '/wave4/results-data.js');
const html = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rows = md.split('\n').filter(l => /^\| W4-\d\d /.test(l)).map(l => {
  const c = l.split('|').map(s => s.trim());
  const r = R[c[1]] || ['todo', ''];
  return [c[1], (c[3] + ': ' + c[4].replace(/\*\*/g, '')).slice(0, 110), r[0], r[1]];
});
let h = fs.readFileSync(E + '/progress.html', 'utf8');
h = h.replace(/const CASES = \[[\s\S]*?\n\];/, () => 'const CASES = [\n' + rows.map(r => ' ' + JSON.stringify(r)).join(',\n') + '\n];');
h = h.replace(/const CANDS = \[[\s\S]*?\n\];/, () => 'const CANDS = [\n' + CANDS.map(x => ' ' + JSON.stringify(x)).join(',\n') + '\n];');
h = h.replace(/\{n:2, name:"Ticket daily work"[^\n]*\},/, () => '{n:2, name:"Ticket daily work", scope:"Views, create, reply, comments, assign, status, merge, split, approvals, time, AI · T-01..T-40, Q-03", status:"done", label:"Done 12 Nov", pass:72, fail:13, check:0, todo:0, note:"85 cases, 72 pass. 8 bugs filed (NDC-2947..2960); C10 parked."},');
h = h.replace(/\{n:4, name:"Channels & self service"[^\n]*\},/, () => '{n:4, name:"Channels & self service", scope:"Email, web forms, help center, community, knowledge base, happiness · N-01..N-10, O-08, T-37", status:"run", label:"Running", auto:true},');
h = h.replace(/<h2>Wave \d · [^<]*<\/h2>\s*<p class="meta"[^>]*>[^<]*<\/p>/, () => '<h2>Wave 4 · Channels &amp; self service</h2>\n    <p class="meta" style="margin-bottom:12px">83 cases, department Marketing, owner (A) plus admin B and agent C for permission checks. Approved at Gate 1 on 12 Nov (W4-19 SMTP skipped by you).</p>');
h = h.replace(/(<h3 style="margin-bottom:10px">Left to do<\/h3>\s*<ul>)[\s\S]*?(<\/ul>)/, (m, a, b) => a + '\n' + LEFT.map(x => '          <li>' + html(x) + '</li>').join('\n') + '\n        ' + b);
h = h.replace(/(<h3 style="margin-bottom:10px">Test data live now<\/h3>\s*<ul>)[\s\S]*?(<\/ul>)/, (m, a, b) => a + '\n' + LIVE.map(x => '          <li>' + html(x) + '</li>').join('\n') + '\n        ' + b);
h = h.replace(/<h2>Wave \d bug candidates \(not filed\)<\/h2>/, '<h2>Wave 4 bug candidates (not filed)</h2>').replace(/<h2>Wave \d cases<\/h2>/, '<h2>Wave 4 cases</h2>');
fs.writeFileSync(E + '/progress.html', h);
const c = rows.reduce((m, r) => (m[r[2]] = (m[r[2]] || 0) + 1, m), {});
console.log(rows.length, JSON.stringify(c));
