for (const [n, id] of [['tasks', 'd120a6c2-2596-4254-968b-a1bcd3a000bf'], ['calls', 'f7e488b5-0232-42fd-811c-1f24356af653'], ['events', '6fb19115-9356-40f0-b064-840d8f1fad93']]) { const f = D((await api('GET', '/modules/' + id + '/fields')).j); out[n] = f.filter(x => !x.isSystemManaged).map(x => x.apiName + ':' + x.datatypeKey + (x.required ? '*' : '')).join(', '); }
const r = await api('GET', '/modules/d120a6c2-2596-4254-968b-a1bcd3a000bf/records?limit=1'); out.sample = JSON.stringify(arr(D(r.j))[0] && arr(D(r.j))[0].data).slice(0, 900);
return fin({ out });
