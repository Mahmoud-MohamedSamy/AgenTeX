const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const f = await api('GET', '/modules/' + L + '/fields'); const fl = arr(f.j && f.j.data);
const req = fl.filter(x => x.required || (x.config && x.config.required)).map(x => x.apiName + ':' + x.datatypeKey);
const rb = await api('GET', '/recycle-bin?page=1&per_page=5'); 
const me = await api('GET', '/iam/me');
return done({ req, names: fl.map(x => x.apiName).slice(0, 40), rb: rb.s + ' ' + rb.t.slice(0, 700), me: (me.j && me.j.data && (me.j.data.id || me.j.data.userId)) || me.t.slice(0, 200) });
