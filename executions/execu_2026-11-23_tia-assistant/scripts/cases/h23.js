const r = await api('GET', '/agents/tia/conversations'); return arr(r.j?.data).slice(0, 50).map(c => c.id.slice(0, 8)).join(',');
