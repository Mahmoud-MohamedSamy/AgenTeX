const o = {}; const M = 'c0394292-52a2-446d-a326-06733fe289ba';
const m = await api('GET', '/modules/' + M); o.module = m.s + ' ' + (m.j && m.j.data && (m.j.data.name || m.j.data.moduleKey));
const f = await api('GET', '/modules/' + M + '/fields'); o.fields = ((f.j && f.j.data) || []).map(x => x.apiName + (x.required ? '*' : '') + ':' + x.id.slice(0, 8));
const fp = await api('GET', '/modules/' + M + '/field-permissions'); o.fp = { s: fp.s, d: JSON.stringify(fp.j && fp.j.data).slice(0, 400) };
const ts = await api('GET', '/teamspaces'); o.ts = ((ts.j && ts.j.data) || []).map(x => x.name + ':' + x.id + ':' + x.appKey);
return done(o);
