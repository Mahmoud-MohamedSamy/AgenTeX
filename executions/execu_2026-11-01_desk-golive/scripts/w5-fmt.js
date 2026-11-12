const r = await api('GET', '/modules/' + KM + '/records?limit=3'); const rec = arr(D(r.j))[0]; out.contract = JSON.stringify(rec && rec.data).slice(0, 1500);
const a = await api('GET', '/modules/' + AM + '/records?limit=5'); out.acc = arr(D(a.j)).map(x => x.id + ' ' + JSON.stringify((x.data || []).filter(f => /account_name|parent|crm_sync/.test(f.field)))).join('\n').slice(0, 800);
const f = D((await api('GET', '/modules/' + AM + '/fields')).j); out.parentField = f.filter(x => /parent/i.test(x.apiName)).map(x => x.apiName + ':' + x.datatypeKey);
const kf = D((await api('GET', '/modules/' + KM + '/fields')).j); out.kTypes = kf.map(x => x.apiName + ':' + x.datatypeKey + (x.required ? '*' : '')).join(', ');
const sp = await api('GET', '/desk/support-plans'); out.sp = sp.s + ' ' + JSON.stringify(D(sp.j)).slice(0, 400);
return fin({ out });
