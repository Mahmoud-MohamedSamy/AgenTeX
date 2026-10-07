const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data); const one = (await api('GET', `/modules/${OPEN}/layouts/${L[0].id}`)).j.data;
const f = arr((await api('GET', `/modules/${OPEN}/fields`)).j.data).find(x => x.fieldName === 'qa_vis');
const T = arr((await api('GET', `/modules/88e8ea44-0000-0000-0000-000000000000/layouts`)).j.data);
const probes = []; for (const p of [`/modules/${OPEN}/layouts/${L[0].id}/profiles`, `/modules/${OPEN}/layouts/${L[0].id}/permissions`, `/modules/${OPEN}/layout-permissions`, `/modules/${OPEN}/field-dependencies`, `/modules/${OPEN}/dependencies`, `/modules/${OPEN}/layout-rules`, `/modules/${OPEN}/layouts/${L[0].id}/rules`, `/modules/${OPEN}/usage`]) { const r = await api('GET', p); probes.push(p.replace(OPEN, 'M').replace(L[0].id, 'L') + ' ' + r.s); }
rec('SHAPE', 'INFO', `layout list keys: ${Object.keys(L[0]).join(',')}; layout keys: ${Object.keys(one).join(',')}; view keys: ${Object.keys(one.views.CREATE).join(',')}; layout-field entry keys: ${Object.keys(one.views.CREATE.layout.sections[0].columns[0].fields[0] || {}).join(',')}; section keys: ${Object.keys(one.views.CREATE.layout.sections[0]).join(',')}; field keys: ${Object.keys(f).join(',')}; field config: ${JSON.stringify(f.config || f.datatypeOptions || {}).slice(0, 200)}; probes: ${probes.join(' ; ')}`);
return done();
