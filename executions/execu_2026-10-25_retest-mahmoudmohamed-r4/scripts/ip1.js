// Setup for 1593/1599: read-only field qa_rt_ro on Leads layout "test" for profile "test".
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1', P = '64d4aae0-9abd-486b-bc03-d04e22d87160';
const out = {};
out.add = (await api('POST', `/modules/${L}/fields`, { fields: [{ fieldName: 'qa_rt_ro', labels: { en: 'QA RT RO' }, datatypeKey: 'single_line', required: false, unique: false, uniquePeerModuleIds: [] }] })).s;
const f = arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.fieldName === 'qa_rt_ro'); out.fid = f?.id;
const lay = (await api('GET', `/modules/${L}/layouts/${LT}`)).j.data; for (const v of ['CREATE', 'QUICK_CREATE', 'DETAIL']) { const ss = lay.views?.[v]?.layout?.sections; if (!ss || !ss[0]) continue; const col = ss[0].columns[ss[0].columns.length - 1]; if (!ss.some(s => s.columns.some(c => c.fields.some(e => e.id === f.id)))) col.fields.push(JSON.parse(JSON.stringify(f))); } const b = { ...lay }; delete b.id; out.place = (await api('PUT', `/modules/${L}/layouts/${LT}`, b)).s;
let r = await api('POST', `/modules/${L}/field-permissions`, { fieldId: f.id, profileId: P, permission: 'read_only' }); out.perm = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 200) : '');
if (r.s >= 300) { r = await api('POST', `/modules/${L}/field-permissions`, { permissions: [{ fieldId: f.id, profileId: P, permission: 'read_only' }] }); out.perm2 = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 200) : ''); }
out.now = arr((await api('GET', `/modules/${L}/field-permissions`)).j?.data).filter(x => /qa_rt_/.test(x.fieldName)).map(x => x.fieldName + ' ' + x.permission + ' ' + x.profileId.slice(0, 8));
return done(out);
