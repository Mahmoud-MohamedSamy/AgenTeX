// Desk Modules & Fields API retests on Anyware (module QA RT r10 MF): 2222, 2247, 2238, 2241, 2261, 2230, 2260, 2387.
const out = {}; const M = '0a2f56b2-681d-41c1-b504-d2140eecb1e8', LY = '09b93625-6702-4995-a484-3319b63f3f9f';
const sv = v => ({ kind: 'string', value: v }); const short = r => r.s + ' ' + (r.s > 299 ? (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || r.t).slice(0, 160) : '');
const fields = arr((await api('o', 'GET', `desk:/modules/${M}/fields`)).j?.data); const F = n => fields.find(x => x.apiName === n);
// 2222: change saved field type
const r0 = await api('o', 'POST', `desk:/modules/${M}/records`, { layout_id: LY, data: [{ field: 'name', value: sv('QA RT r10 2222 rec') }, { field: 'qa_sl', value: sv('some text') }] }); out.rec2222 = short(r0);
const sl = F('qa_sl'); const t = await api('o', 'PUT', `desk:/modules/${M}/fields/${sl.id}`, { fieldName: 'qa_sl', labels: { en: 'QA sl' }, datatypeKey: 'number', required: false, unique: false, uniquePeerModuleIds: [] });
out['2222_type_change'] = short(t); out['2222_after'] = arr((await api('o', 'GET', `desk:/modules/${M}/fields`)).j?.data).find(x => x.apiName === 'qa_sl')?.datatypeKey;
// 2247: unknown field
out['2247_unknown_field'] = short(await api('o', 'POST', `desk:/modules/${M}/records`, { layout_id: LY, data: [{ field: 'name', value: sv('QA RT r10 2247 rec') }, { field: 'qa_uq_nope', value: sv('QA-UQ-1') }] }));
// 2238: module lost update
const mg = (await api('o', 'GET', `desk:/modules/${M}`)).j?.data; const rv = mg.rowVersion; out.modRv = rv;
const base = { pluralForm: mg.pluralForm, singularForm: mg.singularForm };
out['2238_first'] = short(await api('o', 'PUT', `desk:/modules/${M}`, { ...base, description: 'QA tab one', rowVersion: rv }));
out['2238_stale'] = short(await api('o', 'PUT', `desk:/modules/${M}`, { ...base, description: 'QA tab two (stale)', rowVersion: rv }));
out['2238_desc'] = (await api('o', 'GET', `desk:/modules/${M}`)).j?.data?.description;
// 2241: layout lost update
const lg = (await api('o', 'GET', `desk:/modules/${M}/layouts/${LY}`)).j?.data; const lrv = lg.rowVersion; out.layoutRv = lrv; out.layoutKeys = Object.keys(lg);
const strip = o => { const c = JSON.parse(JSON.stringify(o)); for (const k of ['id', 'moduleId', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'lastModifiedAt', 'lastModifiedBy', 'createdByName', 'lastModifiedByName']) delete c[k]; return c; };
const l1 = await api('o', 'PUT', `desk:/modules/${M}/layouts/${LY}`, { ...strip(lg), name: 'QA RT r10 L one', rowVersion: lrv }); out['2241_first'] = short(l1); out['2241_rv_after_first'] = (await api('o', 'GET', `desk:/modules/${M}/layouts/${LY}`)).j?.data?.rowVersion;
out['2241_stale'] = short(await api('o', 'PUT', `desk:/modules/${M}/layouts/${LY}`, { ...strip(lg), name: 'QA RT r10 L two (stale)', rowVersion: lrv }));
const lg2 = (await api('o', 'GET', `desk:/modules/${M}/layouts/${LY}`)).j?.data; out['2241_name'] = lg2.name;
// find where field entries live in the layout
const entries = []; const walk = (o, p) => { if (Array.isArray(o)) o.forEach((x, i) => walk(x, p + '[' + i + ']')); else if (o && typeof o === 'object') { if (o.fieldName || o.fieldId || o.field_name) entries.push(p); for (const [k, v] of Object.entries(o)) walk(v, p + '.' + k); } }; walk(lg2, '$'); out.entryPaths = entries.slice(0, 6); out.entrySample = JSON.stringify((() => { let x = lg2; return x; })()).slice(0, 800);
return out;
