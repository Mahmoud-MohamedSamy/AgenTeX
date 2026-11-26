// Read-only probe: departments, candidate agent C, settings baseline. Signs in O and the candidate (once each).
const out = {};
const d = await api.O('GET', '/desk/departments');
const deps = arr(d.j?.data?.departments || d.j?.data).map(x => ({ id: x.id, name: x.name, def: x.is_default }));
out.deps = deps.map(x => x.name + (x.def ? '*' : ''));
const cs = deps.find(x => /customer support/i.test(x.name)); ST.CS = cs && cs.id; saveState();
for (const p of ['/desk/time-tracking/settings', '/desk/resolution-confirmation/settings', '/desk/tickets/parent-child/settings']) {
  const r = await api.O('GET', p); out[p] = r.s + ' ' + short(r.j?.data, 700);
}
fs.writeFileSync(RUN + '/out/baseline.json', JSON.stringify({ at: new Date().toISOString(), ts: (await api.O('GET', '/desk/time-tracking/settings')).j?.data, rc: (await api.O('GET', '/desk/resolution-confirmation/settings')).j?.data, pc: (await api.O('GET', '/desk/tickets/parent-child/settings')).j?.data }, null, 1));
// who am I (C) + departments of C
const me = await api.C('GET', '/iam/me'); const md = me.j?.data || {};
out.C = { s: me.s, name: md.display_name || md.name, id: md.id || md.user_id };
const ag = await api.O('GET', '/desk/agents?page_size=200');
const list = arr(ag.j?.data?.agents || ag.j?.data);
const mine = list.find(a => (a.user_id || a.id) === out.C.id);
out.Cagent = ag.s + ' ' + short(mine && { profile: mine.profile_name || mine.profile, deps: mine.department_ids || mine.departments }, 400);
const meO = await api.O('GET', '/iam/me'); ST.O_ID = meO.j?.data?.id; ST.C_ID = out.C.id; saveState();
return out;
