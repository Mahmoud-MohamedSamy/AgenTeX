const mid = await modId(); const lid = I.layout; const out = {};
out.rules = (await rules(mid, '?layoutId=' + lid)).map(r => ({ id: r.id, name: r.name, pf: r.primaryField, st: r.status, br: (r.branches||[]).map(b => JSON.stringify(b.condition).slice(0,120) + ' => ' + b.actions.map(a => a.type + ':' + (a.fields||a.sections||[a.field]).join(',')).join(' ; ')) }));
const L = await getLayout(mid, lid); out.views = Object.keys(L.views);
const c = L.views.create || L.views[out.views[0]]; out.sections = c.layout.sections.map(s => s.label + ' [' + s.columns.flatMap(x => x.fields.map(f => f.fieldName)).join(',') + ']');
const F = await fieldsOf(mid); out.fkeys=Object.keys(F[0]).join(','); out.qaFields = F.filter(f => (f.name||f.fieldName||f.apiName||'').startsWith('qa_lr')).map(f => (f.name||f.fieldName||f.apiName) + ':' + f.type + (f.options ? '(' + (f.options||[]).map(o=>o.value||o.label).join('/') + ')' : ''));
out.allLayouts = arr((await api('GET','/modules/'+mid+'/layouts')).j.data).map(l=>l.id+' '+l.name);
return out;
