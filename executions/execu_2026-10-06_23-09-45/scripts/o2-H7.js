
const enc = v => ({ kind: 'string', value: v });
const m = await api('PUT', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/record-visibility', { mode: 'public_read_only' });
const ids = []; for (const n of ['QA MF owner H7 a', 'QA MF owner H7 b']) { const r = await api('POST', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records', { data: [{ field: 'name', value: enc(n) }] }); ids.push(r.j && r.j.data && r.j.data.id); }
rec('H7.owner', 'INFO', 'record-visibility public_read_only → ' + m.s + '; owner records ' + ids.join(','), { ids });
return done();