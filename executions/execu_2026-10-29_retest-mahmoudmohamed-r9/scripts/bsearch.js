// Searches the downloaded web bundle (scratchpad/bundle-r9) for literal strings; prints file + context.
// Usage: node bsearch.js <needle> [context=220] [max=4]
const fs = require('fs'), path = require('path');
const D = 'C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/3b03ac4f-1ce1-4a04-9337-4cb90e2010e4/scratchpad/bundle-r9';
const [needle, c = 220, max = 4] = process.argv.slice(2); let n = 0;
for (const f of fs.readdirSync(D).filter(x => x.endsWith('.js'))) {
  const s = fs.readFileSync(path.join(D, f), 'utf8'); let i = s.indexOf(needle);
  while (i >= 0 && n < +max) { console.log(`== ${f} @${i}\n${s.slice(Math.max(0, i - c), i + needle.length + +c)}\n`); n++; i = s.indexOf(needle, i + needle.length); }
}
if (!n) console.log('not found:', needle);
