const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const fl = (await api('GET', '/modules/' + T + '/fields')).j.data;
return done(fl.map(x => x.apiName + (x.required ? '*' : '') + ':' + x.datatypeKey).join(' '));
