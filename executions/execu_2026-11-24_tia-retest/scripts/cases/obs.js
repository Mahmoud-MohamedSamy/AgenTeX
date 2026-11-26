const a = await getAgent(); const id = a.id; const o = { deployed: a.deployed_version_no };
const v = await api('GET', `/agents/${id}/versions`); const vl = arr(v.j?.data?.items || v.j?.data); o.versions = { s: v.s, n: vl.length, last5: vl.slice(0, 6).map(x => [x.version_no ?? x.versionNo ?? x.version, x.deployed_at || x.created_at || x.createdAt, x.deployed_by_name || x.created_by_name || x.createdByName || x.deployed_by, x.note || x.change_summary || ''].join(' | ')) };
for (const p of ['metrics', 'runs?limit=5', 'sessions/trace?limit=3']) { const r = await api('GET', `/agents/${id}/${p}`); o[p] = { s: r.s, b: JSON.stringify(r.j?.data).slice(0, 500) }; }
return o;
