const mid = await modId(); const o = {};
const bp = arr((await api('GET', '/modules/' + mid + '/blueprints')).j.data).filter(b => b.isActive);
o.bp = bp.map(b => ({ id: b.id, name: b.definition.name, layout: b.definition.layoutId, field: b.definition.stateField || b.definition.fieldName || b.definition.field, keys: Object.keys(b.definition), tr: (b.definition.transitions || []).slice(0, 4).map(t => JSON.stringify(t).slice(0, 400)) }));
if (APP === 'crm') { const w = await api('GET', '/web-forms?app=crm'); o.wf = arr(w.j && w.j.data).map(x => [x.id, x.kind, x.name, x.layout_id, x.is_enabled, x.module_key || x.module_id]).slice(0, 10); }
const pk = await api('GET', '/iam/permissions'); o.perm = arr(pk.j && pk.j.data).map(p => p.key || p.permissionKey || p.name).filter(k => /custom|layout|module|setting/i.test(String(k))).slice(0, 40);
return o;
