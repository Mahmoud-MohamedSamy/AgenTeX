const tm = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065'; const out = {}; const ls = arr((await api('GET', '/modules/' + tm + '/layouts')).j.data); out.layouts = ls.map(l => l.id + ' ' + l.name);
const F = await fieldsOf(tm); out.choice = F.filter(f => f.capabilities && f.capabilities.canCreateLayoutRule).map(f => f.fieldName + ':' + f.datatypeKey + ' ' + JSON.stringify((f.datatypeOptions || {}).allowed_values || '').slice(0, 80));
const L = await getLayout(tm, ls[0].id); out.onLayout = L.views.CREATE.layout.sections.flatMap(s => s.columns.flatMap(c => c.fields.map(f => f.fieldName + (f.required ? '*' : '')))).join(',');
return out;
