const all = L((await api('GET', '/fields/datatypes')).j?.data);
log(all.length); log(all.map(x => x.key + '|' + (x.labels?.en || x.label || x.name || '') + '|' + (x.capabilities?.creatable ?? x.is_creatable ?? x.creatable ?? '') ).join('\n'));
