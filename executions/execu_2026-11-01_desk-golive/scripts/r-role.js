const o = {};
for (const [k, u] of [['B', UB], ['C', UC]]) { for (const p of [`/iam/users/${u}?app_key=desk`, `/iam/users/${u}/roles?app_key=desk`]) { const r = await api('GET', p); o[k + ' ' + p.split('/').pop()] = r.s + ' ' + r.t.replace(/"(email|phone)[^,]*,/g, '').slice(0, 400); } }
const rl = await api('GET', '/iam/roles?app_key=desk'); o.roles = rl.s + ' ' + JSON.stringify(arr(rl.j && rl.j.data).map(r => [r.name, (r.id || '').slice(0, 8), (r.parent_role_id || r.parent_id || r.reports_to || '').slice(0, 8)])).slice(0, 1500);
return fin(o);
