const f = arr((await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/fields')).j.data);
return done(f.map(x => x.fieldName + ':' + x.datatypeKey + (x.datatypeOptions && x.datatypeOptions.values ? JSON.stringify(x.datatypeOptions.values).slice(0, 120) : '')));
