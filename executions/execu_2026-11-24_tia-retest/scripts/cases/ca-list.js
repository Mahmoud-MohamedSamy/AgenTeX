const ca = await api('GET', '/workflow/custom-actions?limit=100'); const l = arr(ca.j?.data?.items || ca.j?.data);
const wa = await api('GET', '/workflow/actions?limit=100'); const w = arr(wa.j?.data?.items || wa.j?.data);
const runs = await api('GET', '/workflow/custom-actions/runs?limit=5');
return { ca: { s: ca.s, n: l.length, keys: Object.keys(l[0] || {}), list: l.slice(0, 25).map(x => [x.name, x.status || x.state, x.moduleId?.slice?.(0, 8) || x.module_id?.slice?.(0, 8) || x.moduleApiName, x.kind || x.type || x.actionType, String(x.id).slice(0, 8)].join(' | ')) }, actions: { s: wa.s, n: w.length, list: w.slice(0, 15).map(x => [x.name, x.type || x.actionType, String(x.id).slice(0, 8)].join(' | ')) }, runs: { s: runs.s, n: arr(runs.j?.data?.items || runs.j?.data).length } };
