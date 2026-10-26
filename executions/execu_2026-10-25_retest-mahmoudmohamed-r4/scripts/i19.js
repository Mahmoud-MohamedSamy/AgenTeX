const T = '88e8ea44-1658-4df3-9930-d0902b91073d', TID = 'fd913c6d-eaa9-4f11-8b7f-4c886dac0a58';
const fl = arr((await api('GET', '/modules/' + T + '/fields')).j?.data).filter(f => /owner|assign/i.test(f.fieldName)).map(f => f.fieldName + ' ' + f.datatypeKey);
let r = await api('PATCH', '/modules/' + T + '/records/' + TID, { data: [{ field: 'owner', value: { kind: 'string', value: '9d182dfa-05f3-4af7-9685-8615a2fbe537' } }] });
return done({ fl, patch: r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 200) : '') });
