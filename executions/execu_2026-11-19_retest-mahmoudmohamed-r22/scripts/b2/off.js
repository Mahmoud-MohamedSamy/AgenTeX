const J = JSON.parse(fs.readFileSync(RUN + '/scripts/b2/3065.json', 'utf8')); const out = {}; const DD = J.DD;
const r = await api('PATCH', '/desk/departments/' + DD, { name: 'QA RT20 B2 Dept', agent_user_ids: [OWNER], view_only_agent_user_ids: [] });
const g = (await api('GET', '/desk/departments/' + DD)).j?.data; out.dept = { s: r.s, agents: g.agent_user_ids.map(x => x === OWNER ? 'OWNER' : x.slice(0, 8)), vo: g.view_only_agent_user_ids };
LED('CES2 view-only removed AND CES2 removed from QA RT20 B2 Dept ' + DD + ' (restore): ' + r.s + ' agents=' + JSON.stringify(out.dept.agents) + ' vo=' + JSON.stringify(g.view_only_agent_user_ids));
for (const id of made.bps) { const b = await getBp(id); if (!b) { out[id.slice(0, 8)] = 'not found'; continue; } if (!b.isActive) { out[id.slice(0, 8)] = (b.definition?.name) + ' already off'; continue; }
  const x = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: b.definition, isActive: false, revision: b.revision }); const b2 = await getBp(id); out[id.slice(0, 8)] = b.definition.name + ' ' + E(x) + ' active=' + b2.isActive; LED('blueprint switched OFF ' + id + ' "' + b.definition.name + '": ' + x.s + ' active=' + b2.isActive); }
const cs = (await api('GET', '/desk/departments/' + CS)).j?.data; out.csHasCES2 = cs.agent_user_ids.includes(AG_A); out.csVOhasCES2 = cs.view_only_agent_user_ids.includes(AG_A);
return out;
