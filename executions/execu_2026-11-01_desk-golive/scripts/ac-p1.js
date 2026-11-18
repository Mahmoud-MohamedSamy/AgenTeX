const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 100) : ''); };
const perms = (await api('GET', '/iam/me/permissions?app_key=desk')).t; out.perm = ['all_departments', 'view_unassigned', 'ticket:move'].map(k => k + ':' + perms.includes(k)).join(' ');
for (const k of ['MK1', 'HR1', 'CST', 'CSE']) out[k] = st(await probe(k));
out.editMK1 = await pr('PATCH', '/modules/' + TM + '/records/' + TK.MK1, { data: [{ field: 'priority', value: sv('low') }] });
out.moveOwn = await pr('POST', '/desk/tickets/' + TK.CSD + '/move', { department_id: DEP.CS }); out.moveMK1 = await pr('POST', '/desk/tickets/' + TK.MK1 + '/move', { department_id: DEP.HR });
out.assignUnassigned = await pr('POST', '/desk/tickets/' + TK.SH2 + '/assign', { owner_id: US.E });
out.reassignOwn = await pr('POST', '/desk/tickets/' + TK.CSD + '/assign', { owner_id: US.E });
await go('/views/all/tickets/' + TK.MK1, 9000); out.ui = (await mtxt()).slice(0, 160); out.toast = await toasts(); await shot('access/d-mk1-alldepts');
return fin({ out });
