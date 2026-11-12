const f = arr((await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/fields?take=300')).j?.data);
log(JSON.stringify(f.filter(x => /address|lookup/.test(x.datatypeKey)).map(x => [x.apiName, x.datatypeKey])));
