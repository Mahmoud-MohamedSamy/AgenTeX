const M = made.mod, sid = 'c55d5b79-b51e-478b-82d9-b05c875a7f10';
const s = await api('GET', `/modules/${M}/import/${sid}`); log('session', JSON.stringify(s.j?.data).slice(0, 1500));
for (const p of ['errors', 'rows?status=failed', 'failed-rows', 'report', 'results']) { const r = await api('GET', `/modules/${M}/import/${sid}/${p}`); log(p, r.s, JSON.stringify(r.j?.data ?? r.t).slice(0, 900)); }
const ds = L((await api('GET', '/reporting/semantic-layer/datasets')).j?.data); log('datasets', ds.map(d => (d.name || d.label) + ':' + (d.module_id || d.moduleId || d.source?.module_id || '')).join(' | ').slice(0, 1500));
log('ds keys', Object.keys(ds[0] || {}));
