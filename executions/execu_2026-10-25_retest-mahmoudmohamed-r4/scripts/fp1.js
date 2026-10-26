// NDC-1337 setup: temp field qa_rt_fp on Leads, placed on layout "test"; read current field-permissions shape and profiles.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
const out = {};
const add = await api('POST', `/modules/${L}/fields`, { fields: [{ fieldName: 'qa_rt_fp', labels: { en: 'QA RT FP' }, datatypeKey: 'single_line', required: false, unique: false, uniquePeerModuleIds: [] }] });
out.add = add.s + ' ' + (add.s >= 300 ? add.t.slice(0, 200) : '');
const f = arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.fieldName === 'qa_rt_fp'); out.fid = f?.id;
if (f) { const lay = (await api('GET', `/modules/${L}/layouts/${LT}`)).j.data; for (const v of ['CREATE', 'QUICK_CREATE', 'DETAIL']) { const ss = lay.views?.[v]?.layout?.sections; if (!ss || !ss[0]) continue; const col = ss[0].columns[ss[0].columns.length - 1]; if (!ss.some(s => s.columns.some(c => c.fields.some(e => e.id === f.id)))) col.fields.push(JSON.parse(JSON.stringify(f))); } const b = { ...lay }; delete b.id; out.place = (await api('PUT', `/modules/${L}/layouts/${LT}`, b)).s; }
const fp = await api('GET', `/modules/${L}/field-permissions`); out.fpShape = fp.s + ' ' + fp.t.slice(0, 400);
const pr = await api('GET', '/iam/profiles'); out.profiles = pr.s + ' ' + arr(pr.j?.data).map(p => p.id + ' ' + p.name).join(' ; ').slice(0, 600);
return done(out);
