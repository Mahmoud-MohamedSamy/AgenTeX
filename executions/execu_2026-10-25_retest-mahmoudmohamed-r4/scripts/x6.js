const r = await api('GET', '/desk/integrations/crm/runs?limit=2'); const runs = arr(r.j?.data);
const det = []; for (const x of runs) { const d = await api('GET', `/desk/integrations/crm/runs/${x.id}`); det.push({ s: d.s, t: d.t.slice(0, 700) }); }
const f = await api('GET', '/desk/integrations/crm/failures?limit=200&status=all'); 
return { run0: JSON.stringify(runs[0]).slice(0, 900), det, failAll: arr(f.j?.data).length, failRecent: arr(f.j?.data).filter(x => x.occurred_at > '2026-10-26T08:05').length };
