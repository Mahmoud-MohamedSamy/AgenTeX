// Reads an unpacked credentials .xlsx (dir with xl/sharedStrings.xml + xl/worksheets/sheet1.xml).
// Default: prints rows with every password-like column masked. --csv=<out>: writes name,url,username,password (no header) for login.js; prints nothing secret.
// Usage: node xlsx-creds.js <unpackedDir> [--csv=<out.csv>]
const fs = require('fs'), path = require('path');
const [dir, ...flags] = process.argv.slice(2);
const dec = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const ssXml = fs.existsSync(path.join(dir, 'xl/sharedStrings.xml')) ? fs.readFileSync(path.join(dir, 'xl/sharedStrings.xml'), 'utf8') : '';
const ss = [...ssXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m => dec([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => x[1]).join('')));
const sh = fs.readFileSync(path.join(dir, 'xl/worksheets/sheet1.xml'), 'utf8');
const col = r => r.replace(/\d+/g, '').split('').reduce((a, c) => a * 26 + c.charCodeAt(0) - 64, 0) - 1;
const rows = [...sh.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map(m => {
  const out = [];
  for (const c of m[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
    const v = (c[3] || '').match(/<v>([\s\S]*?)<\/v>/), is = (c[3] || '').match(/<t[^>]*>([\s\S]*?)<\/t>/);
    out[col(c[1])] = /t="s"/.test(c[2]) && v ? ss[+v[1]] : is ? dec(is[1]) : v ? dec(v[1]) : '';
  }
  return out.map(x => x ?? '');
});
const hdr = rows[0].map(h => String(h).toLowerCase());
const secret = hdr.map(h => /pass|pwd|secret|otp|pin/.test(h));
const csvFlag = flags.find(f => f.startsWith('--csv='));
if (!csvFlag) { console.log('HDR', rows[0]); rows.slice(1).forEach((r, i) => console.log(i + 1, r.map((c, j) => secret[j] && c ? '***' : c))); return; }
const ix = k => hdr.findIndex(h => h.includes(k));
const iu = ix('user') >= 0 ? ix('user') : ix('email'), ip = secret.indexOf(true), iname = ix('name') >= 0 ? ix('name') : ix('role'), iurl = ix('url');
const q = s => `"${String(s).replace(/"/g, '""')}"`;
const lines = rows.slice(1).filter(r => r[iu] && r[ip]).map(r => [r[iname] || r[iu], iurl >= 0 ? r[iurl] : 'https://staging-crm.taviportal.com', r[iu], r[ip]].map(q).join(','));
fs.writeFileSync(csvFlag.slice(6), lines.join('\n') + '\n');
console.log('wrote', lines.length, 'accounts');
