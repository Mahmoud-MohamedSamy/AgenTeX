// NDC-2701 list check: whose leads U2 sees as User @team2 (now) — owner field + creator of each listed lead.
const rows = arr((await api('u2', 'GET', `/modules/${T.LEADS}/records?page=1`)).j?.data);
const val = (r, k) => { const f = (Array.isArray(r.data) ? r.data : []).find(x => x.field === k); return f && (f.value?.value ?? f.value); };
const users = Object.fromEntries(arr((await api('o', 'GET', '/iam/users?limit=200')).j?.data).map(u => [u.userId, u.email + ' [' + u.profileNames + ' @' + u.orgUnitId.slice(0, 8) + ']']));
const by = {}; for (const r of rows) { const o = val(r, 'owner'); const k = (users[o] || o) + ' | created by ' + (users[r.created_by] || r.created_by); by[k] = (by[k] || 0) + 1; }
return { n: rows.length, by };
