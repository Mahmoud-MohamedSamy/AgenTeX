const out = {};
for (const id of ['23339d62-fecf-4324-8950-5fa1bfdef0df', '5392f456-66f9-4bc7-aa95-99bad990f4d5']) { const g = await getBp(id); if (!g.isActive) { out[id.slice(0, 8)] = 'already off'; continue; }
  const r = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: g.definition, isActive: false, revision: g.revision }); const g2 = await getBp(id); out[id.slice(0, 8)] = E(r) + ' active=' + g2.isActive; LED('blueprint switched OFF ' + id + ' "' + g.definition.name + '": ' + out[id.slice(0, 8)]); }
const g = await getBp('5392f456-66f9-4bc7-aa95-99bad990f4d5'); out.units = (g.definition.states || []).map(s => [s.id, s.slaMinutes, s.slaPreExpiryMinutes, s.autoTransitionAfterMinutes, (s.slaEscalationLevels || s.escalationLevels || []).length]);
out.t4869 = (await bstate('9ec8bdc5-2362-4386-a4cd-e5bee332d0c7'))?.activeStates;
return out;
