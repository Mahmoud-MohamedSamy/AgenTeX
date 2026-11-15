const o = {};
const f = await mkField('qa_rt18sr_pl3', 'pick_list', ['Alpha', 'Beta']); o.f = SR(f);
const F = (await fieldsOf(L)).filter(x => x.fieldName === 'qa_rt18sr_pl3');
const Ls = arr((await api('GET', '/modules/' + L + '/layouts')).j.data); const def = Ls.find(x => x.isDefault); const full = (await api('GET', '/modules/' + L + '/layouts/' + def.id)).j.data; const views = {};
for (const [vk, v] of Object.entries(full.views || {})) { const lo = JSON.parse(JSON.stringify(v.layout)); lo.sections.push({ id: 'sec-qa-rt18sr', label: { default: 'QA RT18 SR', en: 'QA RT18 SR' }, tab_order: 'left_to_right', columns: [{ id: 'col-sec-qa-rt18sr', column_order: 1, visibility: { mode: 'ALWAYS', field: null, op: null, value: null, visible: true, conditions: [] }, span: 2, fields: F.map(x => JSON.parse(JSON.stringify(x))) }] }); views[vk] = { layout: lo }; }
const r = await api('POST', '/modules/' + L + '/layouts', { name: 'QA RT18 SR Layout', description: 'QA RT18 scoring retest', views, status: full.status, accessMode: full.accessMode, assignedProfiles: full.assignedProfiles });
o.layout = SR(r).slice(0, 300); if (r.s < 300) { LED('layout "QA RT18 SR Layout" ' + r.j.data.id + ' (Leads)'); I.layout = r.j.data.id; }
const rr = await mkRule({ name: P + 'K2 ui', entries: [ent('qa_rt18sr_pl3', 'eq', 'Alpha', 4)] }); o.rule = SR(rr);
const rec = await mkRec({ last_name: P + 'K2 ui lead', qa_rt18sr_pl3: 'Alpha' }); o.rec = rec.s; o.score = await score(rec.id);
I.k2ui = { field: f.id, rule: rr.j && rr.j.data && rr.j.data.id, rec: rec.id }; SAVE();
return o;
