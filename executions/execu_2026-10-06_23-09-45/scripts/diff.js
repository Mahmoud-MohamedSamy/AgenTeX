// Compare baseline/baseline.json with baseline/after.json on the parts this run could have touched.
const b = require('../baseline/baseline.json'), a = require('../baseline/after.json');
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data)) || [];
const out = [];
const mods = j => arr(j.modules.data).map(m => `${m.moduleKey}|${m.pluralForm}|${m.status}|rv${m.rowVersion}|${m.recordVisibility}|sort${m.sortOrder}`).sort();
const mb = mods(b), ma = mods(a); out.push(['modules', JSON.stringify(mb) === JSON.stringify(ma) ? 'same' : 'DIFF: before ' + mb.filter(x => !ma.includes(x)).join(';') + ' | after ' + ma.filter(x => !mb.includes(x)).join(';')]);
for (const k of Object.keys(b.perModule)) {
  const pb = b.perModule[k], pa = a.perModule[k] || {};
  const f = j => arr(j && j['/fields'] && j['/fields'].data).map(x => `${x.fieldName}|${x.status}|${x.required}|${x.datatypeKey}|rv${x.rowVersion}`).sort();
  const l = j => arr(j && j['/layouts'] && j['/layouts'].data).map(x => `${x.name}|${x.status}|${x.isDefault}|rv${x.rowVersion}|${x.lastModifiedAt}`).sort();
  const fb = f(pb), fa = f(pa), lb = l(pb), la = l(pa);
  const df = JSON.stringify(fb) === JSON.stringify(fa) ? 'same' : `DIFF before[${fb.filter(x => !fa.includes(x)).join(';')}] after[${fa.filter(x => !fb.includes(x)).join(';')}]`;
  const dl = JSON.stringify(lb) === JSON.stringify(la) ? 'same' : `DIFF before[${lb.filter(x => !la.includes(x)).join(';')}] after[${la.filter(x => !lb.includes(x)).join(';')}]`;
  for (const r of ['/layout-rules', '/validation-rules', '/dependency-maps', '/field-permissions', '/links', '/buttons']) { const x = JSON.stringify(pb[r] && pb[r].data), y = JSON.stringify(pa[r] && pa[r].data); if (x !== y) out.push([`${k}${r}`, 'DIFF']); }
  out.push([`${k} fields`, df]); out.push([`${k} layouts`, dl]);
}
const dt = j => arr(j.customDatatypes.data).map(x => x.key).sort().join(','); out.push(['custom data types', dt(b) === dt(a) ? 'same' : `DIFF ${dt(b)} → ${dt(a)}`]);
const us = j => arr(j.users.data).map(u => `${u.userId.slice(0, 8)}:${u.profileNames}`).sort().join(' | '); out.push(['user profiles', us(b) === us(a) ? 'same' : `DIFF\n  before ${us(b)}\n  after  ${us(a)}`]);
const tb = (b.tabPrefCalls.find(c => /nav_tabs/.test(c.url)) || {}).body, ta = (a.tabPrefCalls.find(c => /nav_tabs/.test(c.url)) || {}).body;
const tv = s => { try { return JSON.parse(s).data.value_json; } catch (e) { return s; } }; out.push(['admin tab setting', tv(tb) === tv(ta) ? 'same value' : `DIFF ${tv(tb)} → ${tv(ta)}`]);
console.log(out.map(([k, v]) => `${k}: ${v}`).join('\n'));
require('fs').writeFileSync(require('path').join(__dirname, '../baseline/diff.txt'), out.map(([k, v]) => `${k}: ${v}`).join('\n') + '\n');
