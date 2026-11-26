const all = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data);
return { n: all.length, rows: all.map(c => (c.updated_at || '').slice(0, 16) + ' | ' + (c.title || '').slice(0, 55)) };
