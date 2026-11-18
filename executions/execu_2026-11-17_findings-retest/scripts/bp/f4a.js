const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f04.json', 'utf8')); const o = { t: new Date().toISOString() };
const me = await api('GET', '/iam/me'); o.me = me.s + ' ' + (me.j?.data?.display_name || me.j?.data?.displayName || '');
for (const k of ['k1', 'c1']) { const id = J[k]; const g = await api('GET', '/modules/' + TK + '/records/' + id); const t = await api('GET', '/desk/tickets/' + id);
  const tr = await api('GET', `/modules/${TK}/records/${id}/blueprint-transitions`);
  o[k] = { rec: E(g), desk: E(t), trans: E(tr) + ' ' + JSON.stringify(L(tr.j?.data).map(x => x.transitionId || x.id)) }; }
return o;
