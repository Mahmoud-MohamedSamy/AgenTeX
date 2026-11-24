const r = await api('GET', '/reporting/reports?limit=50'); const l = await api('GET', '/reporting/reports/library');
const L = arr(r.j?.data);
return { s: r.s, n: L.length, total: r.j?.meta?.total_count ?? r.j?.meta?.total, names: L.slice(0, 8).map(x => x.name || x.title), lib: l.s + ':' + arr(l.j?.data).length, err: r.j?.error?.code };
