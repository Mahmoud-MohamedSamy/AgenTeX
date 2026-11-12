// node crawl.js <app> <outDir> — downloads index + every assets/*.js reachable (recursive), 12 in parallel
const fs = require('fs'), path = require('path');
const [app, out] = process.argv.slice(2);
const base = 'https://staging-' + app + '.taviportal.com/';
fs.mkdirSync(out, { recursive: true });
(async () => {
  const html = await (await fetch(base)).text();
  const q = [...new Set((html.match(/assets\/[A-Za-z0-9_.-]+\.js/g) || []))];
  const seen = new Set(q); let n = 0;
  async function worker() {
    while (q.length) {
      const f = q.shift(); const dst = path.join(out, path.basename(f));
      let t;
      if (fs.existsSync(dst) && fs.statSync(dst).size > 0) t = fs.readFileSync(dst, 'utf8');
      else { try { t = await (await fetch(base + f)).text(); fs.writeFileSync(dst, t); n++; } catch (e) { continue; } }
      for (const m of t.match(/[A-Za-z0-9_.-]+\.js/g) || []) {
        const g = 'assets/' + m; if (!seen.has(g) && /-[A-Za-z0-9_-]{8}\.js$/.test(m)) { seen.add(g); q.push(g); }
      }
    }
  }
  await Promise.all(Array.from({ length: 12 }, worker));
  console.log(app, 'files', seen.size, 'new', n);
})();
