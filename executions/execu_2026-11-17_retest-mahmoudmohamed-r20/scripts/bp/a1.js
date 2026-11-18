const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8')); const o = {};
const me = await api('GET', '/iam/me'); o.me = me.s + ' ' + (me.j?.data?.display_name || me.j?.data?.displayName || '');
for (const k of ['r1', 'r2', 'k1']) { const id = J[k]; const g = await api('GET', '/modules/' + TK + '/records/' + id); const t = await api('GET', '/desk/tickets/' + id);
  const tr = await api('GET', `/modules/${TK}/records/${id}/blueprint-transitions`);
  o[k] = { n: J.n[k], rec: g.s, desk: t.s, perms: JSON.stringify(t.j?.data?.permissions || t.j?.data?.access || t.j?.data?.viewer_access || '').slice(0, 200), trans: E(tr) + ' ' + JSON.stringify(L(tr.j?.data).map(x => ({ id: x.transitionId || x.id, can: x.canRun ?? x.can_run, why: x.reason || x.blockedReason }))).slice(0, 400) }; }
for (const [n, id] of [['4181', '7e784fc0-821d-4a80-8c12-3bfe25a6e89d'], ['4182', '4ad8caa5-4f11-404c-b25b-8235103d4090']]) { const t = await api('GET', '/desk/tickets/' + id); const g = await api('GET', '/modules/' + TK + '/records/' + id); o['t' + n] = 'desk ' + E(t) + ' | rec ' + E(g) + ' | dept ' + (t.j?.data?.department_id || '').slice(0, 8) + ' st ' + (t.j?.data?.status || ''); }
return o;
