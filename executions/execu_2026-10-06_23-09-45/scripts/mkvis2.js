// Owner sets a mode + makes 2 owner records; agent then reads / edits / deletes them by id.
const fs = require('fs'); const D = __dirname; const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
for (const [mode, id] of [['public', 'H6'], ['public_read_only', 'H7'], ['hierarchy', 'H8']]) {
  fs.writeFileSync(`${D}/o2-${id}.js`, `
const enc = v => ({ kind: 'string', value: v });
const m = await api('PUT', '/modules/${OPEN}/record-visibility', { mode: '${mode}' });
const ids = []; for (const n of ['QA MF owner ${id} a', 'QA MF owner ${id} b']) { const r = await api('POST', '/modules/${OPEN}/records', { data: [{ field: 'name', value: enc(n) }] }); ids.push(r.j && r.j.data && r.j.data.id); }
rec('${id}.owner', 'INFO', 'record-visibility ${mode} → ' + m.s + '; owner records ' + ids.join(','), { ids });
return done();`);
  fs.writeFileSync(`${D}/a2-${id}.js`, `
const enc = v => ({ kind: 'string', value: v });
const ids = ID_PLACEHOLDER;
const list = arr((await api('GET', '/modules/${OPEN}/records?page_size=100')).j.data).map(r => r.id);
const seen = ids.filter(i => list.includes(i)).length;
const g = await api('GET', '/modules/${OPEN}/records/' + ids[0]);
const e = await api('PATCH', '/modules/${OPEN}/records/' + ids[0], { data: [{ field: 'qa_vis', value: enc('agent edit ${id}') }] });
const d = await api('DELETE', '/modules/${OPEN}/records/' + ids[1]);
const own = await api('POST', '/modules/${OPEN}/records', { data: [{ field: 'name', value: enc('QA MF agent ${id}') }] });
rec('${id}', 'INFO', 'mode ${mode}: agent list shows ' + seen + '/2 owner records; GET owner record → ' + g.s + '; PATCH owner record → ' + e.s + '; DELETE owner record → ' + d.s + '; create own record → ' + own.s, { seen, g: g.s, e: e.s, d: d.s, own: own.s });
return done();`);
}
console.log('ok');
