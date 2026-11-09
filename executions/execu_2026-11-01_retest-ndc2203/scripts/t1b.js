// NDC-2203 fix 1 — as the agent (team CES): read the admin's tickets; count tickets per subject (no duplicates).
const ids = { Z1: 'f885d91a-94fe-4825-93b2-e909c9fc7b59', Z2: '726a299f-5807-4ef1-b779-295f8ffb199e', Z3: 'b0616532-6bce-4703-9109-6722c23658f2', Z4: '5fa9fc0e-6582-4406-89af-7dbc3ba73454' };
const out = {}; const list = [];
for (let p = 1; p <= 3; p++) { const a = arr((await api('GET', `/modules/${T}/records?page=${p}`)).j?.data); list.push(...a); if (a.length < 100) break; }
for (const [k, id] of Object.entries(ids)) { const g = await api('GET', `/modules/${T}/records/${id}`); const t = g.s === 200 ? await getTicket(id) : {};
  out[k] = { read: g.s, number: t.ticket_number, team: t.team ? String(t.team).slice(0, 8) : null, owner: t.owner ? String(t.owner).slice(0, 8) : null, sameSubjectInList: list.filter(x => JSON.stringify(x.data).includes(`QA WF ${k} ticket`)).length }; }
return fin(out);
