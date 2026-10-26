return done(arr((await api('GET', '/modules')).j?.data).map(m => m.moduleKey + ' => ' + JSON.stringify(m.labels || m.name)));
