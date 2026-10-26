const l = await call('GET', `/modules/${MODS.leads}/views?kind=list&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288`);
const vs = l.j.data.views || l.j.data;
const qa = vs.find(v => /QA CV$/.test(v.name)) || vs.find(v => v.criteria) || vs[0];
const one = await call('GET', `/modules/${MODS.leads}/views/${qa.id}`);
return { keys: Object.keys(l.j.data), names: vs.map(v => v.name + '|' + (v.isSystem ?? v.is_system) + '|' + (v.visibility || v.sharing || '')), detail: one.t.slice(0, 1800) };
