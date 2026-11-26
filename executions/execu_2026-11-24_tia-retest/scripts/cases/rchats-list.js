const r = await api('GET', '/agents/tia/conversations?limit=50'); return arr(r.j?.data).map(c => (c.updated_at || '').slice(0, 19) + ' ' + c.id.slice(0, 8) + ' ' + (c.title || '').slice(0, 60));
