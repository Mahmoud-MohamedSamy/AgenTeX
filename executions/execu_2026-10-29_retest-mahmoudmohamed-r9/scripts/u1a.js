// Test user 1: plain lead create (no assignment rule targets this name), read back, list own leads.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const me = (await api('GET', '/iam/me')).j?.data; out.me = { id: me?.user_id || me?.id, profile: me?.profile_name || me?.profiles };
const enc = v => ({ kind: 'string', value: String(v) });
const lay = undefined;
const r = await api('POST', `/modules/${L}/records`, { data: [['last_name', 'QA RT r8 u1 plain'], ['first_name', 'QA RT r8 u1 plain'], ['phone', '+201000000081']].map(([f, v]) => ({ field: f, value: enc(v) })) });
out.create = r.s + ' ' + r.t.slice(0, 300);
const perms = (await api('GET', '/iam/me/permissions')).j?.data; const pk = (Array.isArray(perms) ? perms : perms?.permissions || []).map(x => typeof x === 'string' ? x : x.key || x.permission_key); out.recordPerms = pk.filter(k => /records\.|leads/.test(k || '')).slice(0, 20);
return done(out);
