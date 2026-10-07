
const enc = v => ({ kind: 'string', value: v });
const m = await api('PUT', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/record-visibility', { mode: 'public' });
const ids = []; for (const n of ['QA MF owner H6 a', 'QA MF owner H6 b']) { const r = await api('POST', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records', { data: [{ field: 'name', value: enc(n) }] }); ids.push(r.j && r.j.data && r.j.data.id); }
rec('H6.owner', 'INFO', 'record-visibility public → ' + m.s + '; owner records ' + ids.join(','), { ids });
return done();