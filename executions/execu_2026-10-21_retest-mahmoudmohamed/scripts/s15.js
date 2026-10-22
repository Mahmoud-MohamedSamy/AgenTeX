const ms = arr((await api('GET', '/modules')).j.data).map(m => m.moduleKey + ' | by ' + m.lastModifiedBy + ' | name ' + JSON.stringify(m.lastModifiedByName) + ' | at ' + (m.lastModifiedAt || '').slice(0, 16));
return done({ ms });
