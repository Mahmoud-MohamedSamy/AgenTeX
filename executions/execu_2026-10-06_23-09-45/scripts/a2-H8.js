
const enc = v => ({ kind: 'string', value: v });
const ids = ["4d67f9f0-06e1-4014-8510-038f671f9e2d","207fa521-d0c9-4626-ac05-54b8739dc851"];
const list = arr((await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records?page_size=100')).j.data).map(r => r.id);
const seen = ids.filter(i => list.includes(i)).length;
const g = await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + ids[0]);
const e = await api('PATCH', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + ids[0], { data: [{ field: 'qa_vis', value: enc('agent edit H8') }] });
const d = await api('DELETE', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + ids[1]);
const own = await api('POST', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records', { data: [{ field: 'name', value: enc('QA MF agent H8') }] });
rec('H8', 'INFO', 'mode hierarchy: agent list shows ' + seen + '/2 owner records; GET owner record → ' + g.s + '; PATCH owner record → ' + e.s + '; DELETE owner record → ' + d.s + '; create own record → ' + own.s, { seen, g: g.s, e: e.s, d: d.s, own: own.s });
return done();