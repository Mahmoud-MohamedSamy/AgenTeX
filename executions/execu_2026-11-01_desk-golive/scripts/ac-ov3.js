out.r = [];
for (const [k, e] of [['desk:ticket:view_unassigned', 'DENY'], ['desk:ticket:all_departments', 'GRANT'], ['desk:ticket:move', 'DENY']]) { const r = await api('POST', '/iam/users/' + US.D + '/overrides?app_key=desk', { permission_key: k, effect: e, reason: 'QA AC access run, remove after' }); out.r.push(k + ' ' + e + ' ' + r.s); }
out.ta = (await api('GET', '/desk/ticket-access/settings')).t.slice(0, 200);
return fin({ out });
