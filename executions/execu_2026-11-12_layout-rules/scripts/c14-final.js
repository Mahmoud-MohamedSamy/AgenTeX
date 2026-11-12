const out = {}; const P0 = '11111111-1111-1111-1111-111111111103';
const before = JSON.parse(fs.readFileSync(RUN + '/out/perm-user-before.json', 'utf8')).map(x => x.permissionKey + ':' + x.effect).sort();
const now = arr((await api('GET', '/iam/profiles/' + P0 + '/permissions')).j.data).map(x => x.permissionKey + ':' + x.effect).sort();
out.permAdded = now.filter(x => !before.includes(x)); out.permRemoved = before.filter(x => !now.includes(x));
const Q = /QA LR1112|qa_lr/i; const mods = arr((await api('GET', '/modules')).j.data); out.left = {};
for (const m of mods) { const o = []; const r = arr((await api('GET', '/modules/' + m.id + '/layout-rules')).j.data); if (r.length) o.push('rules ' + r.length);
  if (arr((await api('GET', '/modules/' + m.id + '/layouts')).j.data).some(x => Q.test(x.name))) o.push('layout'); if (arr((await api('GET', '/modules/' + m.id + '/fields')).j.data).some(x => Q.test(x.fieldName))) o.push('fields');
  for (const k of ['buttons', 'links', 'dependency-maps', 'validation-rules', 'blueprints']) if (arr(((await api('GET', '/modules/' + m.id + '/' + k)).j || {}).data).some(y => Q.test(JSON.stringify(y)))) o.push(k);
  if (arr(((await api('GET', '/modules/' + m.id + '/records?q=' + encodeURIComponent('QA LR1112') + '&per_page=50')).j || {}).data).some(y => JSON.stringify(y).includes('QA LR1112'))) o.push('records');
  if (o.length) out.left[m.moduleKey] = o; }
out.profile = (await api('GET', '/iam/profiles/6f2daba4-7087-4950-8ddc-92c3491a663a')).s;
return out;
