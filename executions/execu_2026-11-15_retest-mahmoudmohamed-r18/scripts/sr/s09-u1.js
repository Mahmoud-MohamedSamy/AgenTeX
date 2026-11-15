const o = {}; const id = I.k1.rule;
o.list = SR(await api('GET', '/scoring-rules?module_id=' + L)).slice(0, 120);
o.get = SR(await api('GET', '/scoring-rules/' + id)).slice(0, 120);
o.create = SR(await api('POST', '/scoring-rules', { module_id: L, name: P + 'u1', is_active: true, entries: [ent('lead_source', 'eq', 'web', 1)] })).slice(0, 120);
o.active = SR(await api('PATCH', '/scoring-rules/' + id + '/active', { is_active: false })).slice(0, 120);
o.del = SR(await api('DELETE', '/scoring-rules/' + id)).slice(0, 120);
return o;
