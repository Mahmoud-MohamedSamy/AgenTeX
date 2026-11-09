const o = {}; const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + String(r.j.error.message).slice(0, 200)) : null });
const TS = 'a641f1df-f2c6-450e-a881-857776dacf70'; const DA = '44444444-4444-4444-4444-444444444402';
const mods = async () => { const r = await api('GET', '/modules'); const d = r.j.data; return Array.isArray(d) ? d : d.items || []; };
let m = (await mods()).find(x => /qaglnrt/.test(x.moduleKey || ''));
if (!m) { const r = await api('POST', `/teamspaces/${TS}/modules`, { moduleKey: 'qaglnrt', labels: { en: 'QA GL N RT' }, pluralForm: 'QA GL N RT', singularForm: 'QA GL N RT1', storageScope: 'organization' }); o.create = S(r); m = (await mods()).find(x => /qaglnrt/.test(x.moduleKey || '')); }
o.mid = m && m.id;
const fr = await api('POST', '/modules/' + m.id + '/fields', { fields: [{ fieldName: 'qa_req', datatypeKey: 'single_line', labels: { en: 'QA GL N Required' }, required: true, unique: false, uniquePeerModuleIds: [] }] }); o.addField = S(fr);
const fl = (await api('GET', '/modules/' + m.id + '/fields')).j.data; const req = fl.find(x => x.fieldName === 'qa_req'); o.req = req && { id: req.id, required: req.required };
o.hidden = S(await api('POST', '/modules/' + m.id + '/field-permissions', { fieldId: req.id, profileId: DA, permission: 'hidden' }));
o.readOnly = S(await api('POST', '/modules/' + m.id + '/field-permissions', { fieldId: req.id, profileId: DA, permission: 'read_only' }));
const fp = await api('GET', '/modules/' + m.id + '/field-permissions'); o.fpAfter = JSON.stringify(fp.j && fp.j.data).slice(0, 300);
return done(o);
