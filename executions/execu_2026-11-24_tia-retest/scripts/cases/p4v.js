const a = await getAgent(); const v = await api('GET', `/agents/${a.id}/versions/paged?limit=3`); const l = arr(v.j?.data?.items || v.j?.data);
return { s: v.s, keys: Object.keys(l[0] || {}), rows: l.map(x => JSON.stringify({ id: x.id, n: x.version_no ?? x.versionNo, st: x.status })).slice(0, 3) };
