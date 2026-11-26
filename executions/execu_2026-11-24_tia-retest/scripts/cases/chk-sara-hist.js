const all = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data);
return all.slice(0, 50).map(c => (c.updated_at || '').slice(0, 16) + ' | ' + (c.title || '').slice(0, 70));
