const out = {};
for (const q of ['?limit=5', '?limit=5&app=desk', '?limit=5&app=crm', '?page=1&size=5']) { const b = await api('GET', '/audit/recycle-bin/items' + q); out[q] = b.s + ' ' + JSON.stringify(b.j).slice(0, 600); }
return out;
