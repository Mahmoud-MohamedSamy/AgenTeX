const M = { tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', calls: 'e72e608a-a5d3-45cf-888a-dfadc6e8b456', meetings: 'f13e02be-03d3-46c3-a74e-22c7770823ca' };
const out = {};
for (const [k, id] of Object.entries(M)) { const f = arr((await api('GET', `/modules/${id}/fields`)).j.data); out[k] = f.filter(x => /remind|due|start|from|to_time|subject|title|status|owner|host|call_type|duration/i.test(x.fieldName)).map(x => x.fieldName + ':' + x.datatypeKey + (x.config?.required ? '*' : '') + (x.config?.allowed_values ? '[' + x.config.allowed_values.slice(0, 6).join(',') + ']' : '')); out[k + '_lay'] = (await api('GET', `/modules/${id}/layouts`)).j.data.map(l => l.id + ' ' + l.name); }
const s = await api('GET', '/settings/resolved?app_key=crm&key=crm.activity.reminders&scope_type=Org');
return done({ out, s: s.s + ' ' + s.t.slice(0, 600) });
