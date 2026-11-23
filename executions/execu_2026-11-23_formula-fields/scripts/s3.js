const M = made.mod, LID = made.layouts[0];
const lay = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data;
const fl = L((await api('GET', `/modules/${M}/fields`)).j?.data).filter(f => ['fx_l1', 'qa_items3', 'fx_f1'].includes(f.fieldName));
const mkF = (f, i) => ({ id: f.id, fieldName: f.fieldName, apiName: f.fieldName, labels: f.labels, datatypeKey: f.datatypeKey, fieldOrder: i, config: { required: false, unique: false, ...(f.datatypeOptions || {}) } });
const views = JSON.parse(JSON.stringify(lay.views));
for (const v of ['CREATE', 'DETAIL']) { const sid = crypto.randomUUID(); views[v].layout.sections.push({ id: sid, label: { en: 'QA FX Checks' }, columns: [{ id: sid + '-col-0', column_order: 0, visibility: { mode: 'always', field: null, op: null, value: null, visible: true, conditions: null }, span: 1, fields: fl.map(mkF) }, { id: sid + '-col-1', column_order: 1, visibility: { mode: 'always', field: null, op: null, value: null, visible: true, conditions: null }, span: 1, fields: [] }], tab_order: null }); }
const r = await api('PUT', `/modules/${M}/layouts/${LID}`, { name: lay.name, views, assignedProfiles: lay.assignedProfiles, status: lay.status, accessMode: lay.accessMode, rowVersion: lay.rowVersion, description: lay.description }); log('PUT', E(r));
