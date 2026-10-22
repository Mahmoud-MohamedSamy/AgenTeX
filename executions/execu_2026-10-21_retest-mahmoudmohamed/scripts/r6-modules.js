// Desk retest: module / field / layout API checks on QA RT MF.
const MID = 'c0394292-52a2-446d-a326-06733fe289ba', LID = '83c29e1a-37f1-4a43-b6b2-33a47cb4b666', CONTACTS = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const T = {}; const e = r => r.s + ' ' + (r.s >= 300 ? ((r.j?.error?.code || '') + ' ' + (r.j?.error?.details?.[0]?.message || r.j?.error?.message || '')).slice(0, 150) : '');
const newMod = (key, name) => api('POST', `/teamspaces/${TS}/modules`, { moduleKey: key, labels: { en: name }, pluralForm: name, singularForm: name, storageScope: 'organization' });
const created = [];
const keep = r => { const id = r.j?.data?.id; if (id) created.push(id); return r; };
// 2236
T['2236 blank "   "'] = e(keep(await newMod('qa_rt_blank', '   ')));
T['2236 120 chars'] = e(keep(await newMod('qa_rt_long', 'Q'.repeat(120))));
T['2236 26 chars'] = e(keep(await newMod('qa_rt_26', 'QA RT ' + 'x'.repeat(20))));
// 2253
T['2253 duplicate display name "QA RT MF"'] = e(keep(await newMod('qa_rt_mf_dup', 'QA RT MF')));
T['2253 duplicate of "Tickets"'] = e(keep(await newMod('qa_rt_tk_dup', 'Tickets')));
// 2237
const mod = (await api('GET', `/modules/${MID}`)).j.data;
T['2237 rename empty'] = e(await api('PUT', `/modules/${MID}`, { pluralForm: '', singularForm: 'QA RT MF', description: null, rowVersion: mod.rowVersion }));
const mod2 = (await api('GET', `/modules/${MID}`)).j.data;
T['2237 rename to "Tickets"'] = e(await api('PUT', `/modules/${MID}`, { pluralForm: 'Tickets', singularForm: 'QA RT MF', description: null, rowVersion: mod2.rowVersion }));
const mod3 = (await api('GET', `/modules/${MID}`)).j.data; T['2237 name after'] = mod3.pluralForm + ' / ' + mod3.labels?.en;
// 2255
const fld = (name, label, extra) => api('POST', `/modules/${MID}/fields`, { fields: [{ fieldName: name, labels: { en: label }, datatypeKey: 'single_line', required: false, unique: false, uniquePeerModuleIds: [], ...(extra || {}) }] });
T['2255 50-char label'] = e(await fld('qa_rt_l50', 'L'.repeat(50)));
T['2255 51-char label'] = e(await fld('qa_rt_l51', 'L'.repeat(51)));
// 2256 / 2244
const lk = (name, opts) => api('POST', `/modules/${MID}/fields`, { fields: [{ fieldName: name, labels: { en: 'QA RT ' + name }, datatypeKey: 'lookup', required: false, unique: false, uniquePeerModuleIds: [], datatypeOptions: opts }] });
T['2256 lookup 1 title "QA RT MF"'] = e(await lk('qa_rt_lk1', { target_module_id: CONTACTS, display_field: 'first_name', related_list_title: 'QA RT MF' }));
T['2256 lookup 2 same title'] = e(await lk('qa_rt_lk2', { target_module_id: CONTACTS, display_field: 'first_name', related_list_title: 'QA RT MF' }));
T['2256 lookup 3 same title via related_module (report payload)'] = e(await lk('qa_rt_lk3', { target_module_id: CONTACTS, display_field: 'first_name', related_module: 'QA RT MF' }));
const rel = await api('GET', `/modules/${CONTACTS}/related-modules`);
T['2244 Contacts related-modules lists QA RT MF'] = rel.s + ' ' + JSON.stringify(arr(rel.j?.data).filter(x => /QA RT|qa_rt/i.test(JSON.stringify(x))).map(x => JSON.stringify(x).slice(0, 220)));
// 2257
T['2257 multi-module lookup []'] = e(await api('POST', `/modules/${MID}/fields`, { fields: [{ fieldName: 'qa_rt_mlk', labels: { en: 'QA RT mlk' }, datatypeKey: 'lookup', required: false, unique: false, uniquePeerModuleIds: [], datatypeOptions: { target_modules: [] } }] }));
// 2246
const cdt = await api('POST', '/custom-datatypes', { key: 'qa_rt_dt', label: 'QA RT dt', base_datatype_key: 'single_line', icon: 'type' });
T['2246 create custom datatype'] = e(cdt);
const dts = await api('GET', '/fields/datatypes'); T['2246 listed'] = String(JSON.stringify(dts.j).includes('qa_rt_dt'));
T['2246 field with custom type'] = e(await api('POST', `/modules/${MID}/fields`, { fields: [{ fieldName: 'qa_rt_cdt', labels: { en: 'QA RT cdt' }, datatypeKey: 'qa_rt_dt', required: false, unique: false, uniquePeerModuleIds: [] }] }));
const cf = (await fieldsOf(MID)).find(f => f.fieldName === 'qa_rt_cdt'); T['2246 field stored'] = cf ? cf.datatypeKey : 'absent';
// 2250
const ms = arr((await api('GET', '/modules')).j.data); T['2250 seeded lastModifiedByName'] = [...new Set(ms.filter(m => /^desk_(tickets|contacts|accounts|products|calls|events|tasks|contracts|time_entries)$/.test(m.moduleKey)).map(m => JSON.stringify(m.lastModifiedByName)))].join(',');
return done({ T, created });
