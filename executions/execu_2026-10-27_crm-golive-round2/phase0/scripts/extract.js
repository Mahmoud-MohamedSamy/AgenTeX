// Reads every .js file in a bundle folder as TEXT (never executes it) and extracts routes, API paths, permission keys,
// coming-soon / in-development markers and English UI strings. Usage: node extract.js <bundleDir> <out.json>
const fs = require('fs'), path = require('path');
const [dir, out] = process.argv.slice(2);
const all = fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
const uniq = a => [...new Set(a)].sort();
const norm = p => p.replace(/\$\{[^}]*\}/g, ':x').replace(/\/\d+/g, '/:n');
const routes = uniq([...all.matchAll(/path:`([^`]{1,120})`/g)].map(m => m[1]));
const api = uniq([...all.matchAll(/\.(get|post|put|patch|delete|getBlob|postForm)\(`(\/[^`]{1,160})`/g)].map(m => m[1].toUpperCase() + ' ' + norm(m[2]))
  .concat([...all.matchAll(/\.(get|post|put|patch|delete)\(\s*"(\/[a-z][^"]{1,160})"/g)].map(m => m[1].toUpperCase() + ' ' + norm(m[2]))));
const perms = uniq([...all.matchAll(/[`"']((?:crm|iam|desk|audit|workflow|search|records|settings|general|mail|ai|billing|reports|dashboards|integrations|metadata)[.:][a-z0-9_.:-]{3,80})[`"']/g)].map(m => m[1]).filter(k => /\.(view|manage|create|edit|delete|access|read|write|admin|export|import|run|own|all|team|self)\b|:(view|manage)/.test(k)));
const soon = uniq([...all.matchAll(/(in-development|InDevelopment[A-Za-z]*|comingSoon[A-Za-z.]*|[Cc]oming soon[^`"]{0,60})/g)].map(m => m[1]));
const strings = uniq([...all.matchAll(/[a-zA-Z_]+:`([A-Z][^`$]{3,160})`/g)].map(m => m[1]).filter(s => !/[\u0600-\u06FF]/.test(s) && /\s/.test(s)));
fs.writeFileSync(out, JSON.stringify({ routes, api, perms, soon, strings }, null, 1));
console.log(out, 'routes', routes.length, 'api', api.length, 'perms', perms.length, 'soon', soon.length, 'strings', strings.length);
