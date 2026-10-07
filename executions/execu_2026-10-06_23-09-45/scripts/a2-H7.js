
const enc = v => ({ kind: 'string', value: v });
const ids = ["6be2c349-3c2e-4670-8284-dd4af7efa7b4","a2eb48e5-75f3-45b1-b93c-1d37459a2e73"];
const list = arr((await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records?page_size=100')).j.data).map(r => r.id);
const seen = ids.filter(i => list.includes(i)).length;
const g = await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + ids[0]);
const e = await api('PATCH', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + ids[0], { data: [{ field: 'qa_vis', value: enc('agent edit H7') }] });
const d = await api('DELETE', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + ids[1]);
const own = await api('POST', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records', { data: [{ field: 'name', value: enc('QA MF agent H7') }] });
rec('H7', 'INFO', 'mode public_read_only: agent list shows ' + seen + '/2 owner records; GET owner record → ' + g.s + '; PATCH owner record → ' + e.s + '; DELETE owner record → ' + d.s + '; create own record → ' + own.s, { seen, g: g.s, e: e.s, d: d.s, own: own.s });
return done();