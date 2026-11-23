const ids = ['f2b2c1f5-56fd-4098-91e8-8a8704f78898', 'f85fde0c-1152-4743-95f6-801f19e99b33', '6deb60c8-5329-41dc-b237-622a6bfd0a09', '3f8f8148-a453-4929-ac7b-9d1d16275141'];
const out = {};
for (const id of ids) { const g = await getBp(id); if (!g) { out[id.slice(0, 8)] = 'not found'; continue; } if (!g.isActive) { out[id.slice(0, 8)] = 'already off'; continue; }
  const r = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: g.definition, isActive: false, revision: g.revision }); const g2 = await getBp(id); out[id.slice(0, 8)] = E(r) + ' active=' + g2.isActive; LED('blueprint switched OFF ' + id + ' "' + g.definition.name + '": ' + out[id.slice(0, 8)]); }
const all = L((await api('GET', `/modules/${TK}/blueprints`)).j?.data).filter(b => /QA RT20 BP/.test(b.definition?.name || b.name || '')); out.rt20 = all.map(b => (b.definition?.name || b.name) + '=' + (b.isActive ? 'ON' : 'off'));
for (const [k, id] of [['4808', 'b5328b28-4ce9-4896-838e-cb8df66e7441'], ['4829', '5e50f93c-dbe2-4b64-9e33-1536a241469c']]) { const h = L((await api('GET', `/desk/tickets/${id}/history`)).j?.data).map(x => x.action.replace('ticket.', '')); const r = await rec(id); out['recheck' + k] = h.join(',') + ' closed_time=' + (r.closed_time || '-') + ' desk=' + (await api('GET', '/desk/tickets/' + id)).j?.data?.status; }
const dd = (await api('GET', '/desk/departments/e04e88df-03e2-4a9f-8ccc-ff934cca500e')).j?.data; out.dept = { vo: dd.view_only_agent_user_ids, n: dd.agent_user_ids.length, active: dd.is_active };
return out;
