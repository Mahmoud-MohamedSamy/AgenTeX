return arr((await api('GET', '/reporting/reports?limit=100')).j?.data).map(x => x.name + ' ' + x.id);
