// Static audit: in each a4 script, rules made with mkRule(tag) only match tickets whose subject starts "QA AO WF <tag> ".
const fs = require('fs'), path = require('path'); const dir = process.argv[2];
const lit = s => (s.match(/^\s*(['"`])((?:(?!\1).)*)\1/) || [])[2];
for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.js') && !/^(lib|clean|build)/.test(x))) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const rules = [...src.matchAll(/mkRule\(([^,]+),/g)].map(m => lit(m[1]) ?? '<expr ' + m[1].trim().slice(0, 30) + '>');
  const tickets = [...src.matchAll(/mkTicket\(([^,)]+)(?:,\s*(\{[^}]*\}|[^,)]+))?(?:,\s*([^)]+))?\)/g)].map(m => ({ tag: lit(m[1]) ?? '<expr ' + m[1].trim().slice(0, 30) + '>', suf: m[3] ? (lit(m[3]) ?? '<expr>') : 'ticket' }));
  if (!rules.length) continue;
  const subj = tickets.map(t => `QA AO WF ${t.tag} ${t.suf}`);
  const bad = rules.filter(r => !/^<expr/.test(r) && !subj.some(s => s.startsWith(`QA AO WF ${r} `) || /<expr/.test(s)));
  const expr = rules.filter(r => /^<expr/.test(r)).length + tickets.filter(t => /<expr/.test(t.tag)).length;
  if (bad.length || expr) console.log(f.padEnd(14), 'NO-MATCH rules:', JSON.stringify(bad), expr ? '(dynamic tags: ' + expr + ', check by hand)' : '', '| tickets:', JSON.stringify(tickets.map(t => t.tag)));
}
