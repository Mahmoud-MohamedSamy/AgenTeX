const M = made.mod, LID = made.layouts[0];
const lay = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data;
log('views', Object.keys(lay.views), 'rowVersion', lay.rowVersion);
const fl = L((await api('GET', `/modules/${M}/fields`)).j?.data).filter(f => /^qa_/.test(f.fieldName));
const mkF = (f, i) => ({ id: f.id, fieldName: f.fieldName, apiName: f.fieldName, labels: f.labels, datatypeKey: f.datatypeKey, fieldOrder: i, config: { required: false, unique: false, ...(f.datatypeOptions || {}) } });
const half = Math.ceil(fl.length / 2);
const sec = (sid) => ({ id: sid, label: { en: 'QA FX Inputs' }, columns: [0, 1].map(c => ({ id: sid + '-col-' + c, column_order: c, visibility: { mode: 'always', field: null, op: null, value: null, visible: true, conditions: null }, span: 1, fields: (c ? fl.slice(half) : fl.slice(0, half)).map(mkF) })), tab_order: null });
const body = { name: lay.name, views: JSON.parse(JSON.stringify(lay.views)), assignedProfiles: lay.assignedProfiles, status: lay.status, accessMode: lay.accessMode, rowVersion: lay.rowVersion, description: lay.description };
for (const v of Object.keys(body.views)) { if (v === 'QUICK_CREATE') continue; body.views[v].layout.sections.push(sec(crypto.randomUUID())); }
const r = await api('PUT', `/modules/${M}/layouts/${LID}`, body); log('PUT', E(r));
const after = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data; for (const v of Object.keys(after.views)) log(v, after.views[v].layout.sections.map(s => s.label.en + ':' + s.columns.reduce((a, c) => a + c.fields.length, 0)));
