// NDC-2649: real dependency map on a QA module (created here; deleted at cleanup).
const TS = '5ea90671-4df5-4642-939d-49494f8e4d6e'; const out = {};
const enc = v => typeof v === 'number' ? { kind: 'number', value: v } : { kind: 'string', value: String(v) };
let mod = arr((await api('GET', '/modules')).j?.data).find(m => m.moduleKey === 'qa_rt_r8');
if (!mod) { const r = await api('POST', `/teamspaces/${TS}/modules`, { moduleKey: 'qa_rt_r8', labels: { en: 'QA RT r8' }, pluralForm: 'QA RT r8', singularForm: 'QA RT r8 record', description: 'QA retest round 8, deleted afterwards' }); mod = r.j?.data; out.mod = r.s; }
const M = mod.id; out.modId = M;
const add = (fieldName, label, vals) => api('POST', `/modules/${M}/fields`, { fields: [{ fieldName, labels: { en: label }, datatypeKey: 'pick_list', required: false, unique: false, datatypeOptions: { allowed_values: vals } }] });
out.f1 = (await add('qa_colour', 'QA Colour', ['Red', 'Green'])).s; out.f2 = (await add('qa_child', 'QA Child', ['A', 'B', 'C'])).s;
const fl = arr((await api('GET', `/modules/${M}/fields`)).j?.data); const fc = fl.find(f => f.apiName === 'qa_colour'), fd = fl.find(f => f.apiName === 'qa_child');
const tries = [
  { controllingFieldId: fc.id, dependentFieldId: fd.id, mappings: [{ controllingValue: 'Red', dependentValues: ['A', 'B'] }, { controllingValue: 'Green', dependentValues: ['C'] }] },
  { controllingFieldId: fc.id, dependentFieldId: fd.id, mapping: { Red: ['A', 'B'], Green: ['C'] } },
  { controllingFieldId: fc.id, dependentFieldId: fd.id, valueMap: { Red: ['A', 'B'], Green: ['C'] } }];
out.tries = []; let mapId = null;
for (const b of tries) { const r = await api('POST', `/modules/${M}/dependency-maps`, b); out.tries.push(r.s + ' ' + r.t.slice(0, 300)); if (r.s / 100 | 0 === 2 && r.j?.data?.id) { mapId = r.j.data.id; out.saved = JSON.stringify(r.j.data).slice(0, 500); break; } }
out.mapId = mapId;
if (mapId) { const lay = arr((await api('GET', `/modules/${M}/layouts`)).j?.data)[0]?.id;
  const rec = async (c, d) => { const r = await api('POST', `/modules/${M}/records`, { layout_id: lay, data: [['name', `QA RT r8 dep ${c} ${d}`], ['qa_colour', c], ['qa_child', d]].map(([f, v]) => ({ field: f, value: enc(v) })) }); return r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 250) : r.j?.data?.id); };
  out.redC = await rec('Red', 'C'); out.redA = await rec('Red', 'A'); out.greenC = await rec('Green', 'C'); }
return done(out);
