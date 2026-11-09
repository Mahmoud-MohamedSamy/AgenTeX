// Collects every string literal that looks like an app or API path ("/x/y", `/x/${id}/y`) from a bundle folder, as text only.
const fs = require('fs'), path = require('path');
const [dir, out] = process.argv.slice(2);
const all = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !/mock/i.test(f)).map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
const s = new Set();
for (const m of all.matchAll(/[`"'](\/[a-z][a-z0-9_-]*(?:\/(?:[a-z0-9_.:-]+|\$\{[^}`]{1,40}\}))*\/?)[`"'?]/g)) {
  const p = m[1].replace(/\$\{[^}]*\}/g, ':x');
  if (p.length > 2 && !/\.(js|css|png|svg|json|woff2?)$/.test(p)) s.add(p);
}
fs.writeFileSync(out, JSON.stringify([...s].sort(), null, 1)); console.log(out, s.size);
