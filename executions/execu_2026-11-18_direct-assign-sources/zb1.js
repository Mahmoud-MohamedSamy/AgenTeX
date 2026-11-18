const l = await api(page, 'GET', 'blueprints?module=tickets&departmentId=1499272000000006907&status=ACTIVE');
out.ls = l.s; out.list = (l.j && l.j.data || []).map(b => ({ id: b.id, name: b.name, layout: b.layoutId }));
if (out.list[0]) { const g = await api(page, 'GET', 'blueprints/' + out.list[0].id); const j = g.j || {}; out.detail = { criteria: JSON.stringify(j.criteria || null).slice(0, 400), recordType: j.recordType, states: (j.states || []).map(s => s.name + ':' + s.type + ':' + s.id), connections: JSON.stringify(j.connections || []).slice(0, 700), keys: Object.keys(j).join(',') }; }
