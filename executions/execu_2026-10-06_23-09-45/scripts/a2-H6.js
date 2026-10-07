
const enc = v => ({ kind: 'string', value: v });
const ids = ["9e8c45f7-8f5f-40bf-9deb-f09e068820a2","33f898ce-641a-4801-8066-a45411c8e483"];
const list = arr((await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records?page_size=100')).j.data).map(r => r.id);
const seen = ids.filter(i => list.includes(i)).length;
const g = await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + ids[0]);
const e = await api('PATCH', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + ids[0], { data: [{ field: 'qa_vis', value: enc('agent edit H6') }] });
const d = await api('DELETE', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + ids[1]);
const own = await api('POST', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records', { data: [{ field: 'name', value: enc('QA MF agent H6') }] });
rec('H6', 'INFO', 'mode public: agent list shows ' + seen + '/2 owner records; GET owner record → ' + g.s + '; PATCH owner record → ' + e.s + '; DELETE owner record → ' + d.s + '; create own record → ' + own.s, { seen, g: g.s, e: e.s, d: d.s, own: own.s });
return done();