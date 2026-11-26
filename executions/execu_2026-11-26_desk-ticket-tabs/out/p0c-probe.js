const out = {};
const perm = await api.C('GET', '/iam/me/permissions?app_key=desk');
const raw = perm.j?.data; out.permShape = short(raw, 200);
const ps = arr(raw?.permissions || raw?.items || raw).map(x => typeof x === 'string' ? x : (x.key || x.code || x.name || JSON.stringify(x).slice(0, 60)));
out.Cperms = ps.filter(x => /ticket|time|resol|setting/i.test(x)).join(' | ').slice(0, 1500);
for (const id of [ST.CS, ST.MK]) {
  const r = await api.O('GET', `/desk/departments/${id}`); const j = r.j?.data?.department || r.j?.data || {};
  const ag = arr(j.agents || j.members || j.agent_ids || []);
  out['dep ' + (j.name || id)] = r.s + ' keys=' + Object.keys(j).join(',').slice(0, 300) + ' | C in: ' + JSON.stringify(ag).includes(ST.C_ID) + ' | O in: ' + JSON.stringify(ag).includes(ST.O_ID);
}
const st = await api.O('GET', '/desk/ticket-statuses'); out.statuses = arr(st.j?.data?.statuses).map(s => s.value + ':' + s.type).join(', ').slice(0, 900);
return out;
