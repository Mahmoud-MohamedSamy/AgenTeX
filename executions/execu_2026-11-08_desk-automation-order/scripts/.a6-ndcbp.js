const L = arr((await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/blueprints?includeInactive=true')).j?.data);
log(L.length, JSON.stringify(L.map(b => [b.name || b.definition?.name, b.isActive])));
