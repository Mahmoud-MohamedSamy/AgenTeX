const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const val = v => v && typeof v === 'object' && 'value' in v ? v.value : v;
const r = await api('GET', `/modules/${L}/records?page=1&per_page=40&sort_by=created_at&sort_dir=desc`); out.s = r.s; out.keys = r.j && Object.keys(r.j.data || {});
const rows = arr(r.j?.data); out.n = rows.length;
const users = arr((await api('GET', '/iam/users?limit=200')).j?.data); const nm = id => { const u = users.find(u => (u.user_id || u.id) === id); return u ? (u.email || u.display_name || '').replace(/@.*/, '') : id; };
out.rows = rows.slice(0, 15).map(x => { const o = {}; for (const d of x.data || []) o[d.field] = val(d.value); return [o.last_name || o.name, 'owner=' + nm(o.owner), 'by=' + nm(o.created_by || x.created_by), (o.created_at || x.created_at || '').toString().slice(11, 19)].join(' | '); });
return done(out);
