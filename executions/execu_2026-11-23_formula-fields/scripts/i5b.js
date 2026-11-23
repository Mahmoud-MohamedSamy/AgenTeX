const r = await api('GET', '/reporting/reports?limit=5'); const items = L(r.j?.data?.data ?? r.j?.data); log('reports', r.s, items.length);
const one = items.find(x => x.query_spec?.measures?.length) || items[0]; if (one) { const d = await api('GET', '/reporting/reports/' + one.id); log(JSON.stringify((d.j?.data?.data ?? d.j?.data)?.query_spec).slice(0, 1500)); }
