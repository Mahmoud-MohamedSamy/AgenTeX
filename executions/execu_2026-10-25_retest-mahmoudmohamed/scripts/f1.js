// NDC-2106 setup: temp number field on Leads, placed on layout "test", one criteria view + one column-only view.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
const out = {};
const add = await api('POST', `/modules/${L}/fields`, { fields: [{ fieldName: 'qa_rt_temp_num', labels: { en: 'QA RT Temp Number' }, datatypeKey: 'number', required: false, unique: false, uniquePeerModuleIds: [] }] });
out.add = add.s + ' ' + (add.s >= 300 ? add.t.slice(0, 200) : '');
const f = arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.fieldName === 'qa_rt_temp_num'); out.field = f && { id: f.id, api: f.apiName, isDeletable: f.isDeletable };
if (f) {
  const lay = (await api('GET', `/modules/${L}/layouts/${LT}`)).j.data;
  for (const v of ['CREATE', 'QUICK_CREATE', 'DETAIL']) { const ss = lay.views?.[v]?.layout?.sections; if (!ss || !ss[0]) continue; const col = ss[0].columns[ss[0].columns.length - 1]; if (!ss.some(s => s.columns.some(c => c.fields.some(e => e.id === f.id)))) col.fields.push(JSON.parse(JSON.stringify(f))); }
  const b = { ...lay }; delete b.id; const put = await api('PUT', `/modules/${L}/layouts/${LT}`, b); out.place = put.s + ' ' + (put.s >= 300 ? put.t.slice(0, 200) : '');
  const mk = async (n, settings) => { const r = await api('POST', `/modules/${L}/views`, { name: n, kind: 'list', visibility: 'private', layout_id: LT, settings }); return r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 200)); };
  out.crit = await mk('QA RT 2106 crit', { criteria: { conditions: [{ field: f.apiName, operator: 'greater_than', value: 1 }] } });
  out.col = await mk('QA RT 2106 col', { criteria: { conditions: [] }, columns: ['first_name', f.apiName] });
}
return done(out);
