const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 100) : ''); };
const U2 = '0d95ea42-a0df-4742-ace5-b3fcae73e53b';
const perms = (await api('GET', '/iam/me/permissions?app_key=desk')).t; out.perm = (perms.match(/desk:ticket:[a-z_]+/g) || []).map(x => x.slice(12)).join(' ');
out.view = (await api('GET', '/modules/' + TM + '/records/' + U2)).s; out.tkt = (await api('GET', '/desk/tickets/' + U2)).s;
out.list = (await listQA()).ids.filter(x => /^[A-Z0-9]/.test(x)).join(',');
out.pick = await pr('POST', '/desk/tickets/' + U2 + '/pick-up', {});
const tq = await api('GET', '/desk/queues/teams'); out.canViewUnassigned = (D(tq.j) || {}).can_view_unassigned;
return fin({ out });
