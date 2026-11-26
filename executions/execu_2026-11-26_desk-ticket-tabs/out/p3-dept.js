const out = {};
const deps = arr((await api.O('GET', '/desk/departments')).j?.data?.departments || (await api.O('GET', '/desk/departments')).j?.data);
for (const name of ['Sales', 'Tech', 'HR', 'QA RT26 VO Dept']) {
  const d = deps.find(x => x.name === name); if (!d) continue;
  const t = await mkTicket('O', 'QA TT probe ' + name, { department: d.id }); await sleep(2500);
  const h = await history(t.id); const bp = h.items.some(x => /blueprint/.test(x.event_type || x.type || ''));
  const c = await api.O('POST', TK(t.id) + '/close', {});
  out[name] = { bp, close: E(c).slice(0, 120), status: (await getTicket(t.id)).status, id: d.id, cIn: (d.agent_user_ids || []).includes(ST.C_ID) };
}
return out;
