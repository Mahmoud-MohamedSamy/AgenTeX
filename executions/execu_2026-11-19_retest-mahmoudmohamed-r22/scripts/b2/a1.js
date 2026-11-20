// agent: read-only look at every ticket (no writes)
const J = JSON.parse(fs.readFileSync(RUN + '/scripts/b2/3065.json', 'utf8')); const o = {};
for (const [k, id] of Object.entries(J.t)) { const t = await api('GET', '/desk/tickets/' + id); const tr = await api('GET', `/modules/${TK}/records/${id}/blueprint-transitions`);
  o[k] = (J.n[k] || '') + ' open=' + t.s + ' st=' + (t.j?.data?.status || '-') + ' perms=' + JSON.stringify(t.j?.data?.permissions || t.j?.data?.access || t.j?.data?.viewer_access || '').slice(0, 120) + ' | trans ' + E(tr) + ' ' + JSON.stringify(L(tr.j?.data).map(x => ({ id: x.transitionId || x.id, can: x.canRun ?? x.can_run, why: x.reason || x.blockedReason }))).slice(0, 200); }
return o;
