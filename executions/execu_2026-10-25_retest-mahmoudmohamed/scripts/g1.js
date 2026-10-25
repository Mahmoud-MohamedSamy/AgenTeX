// NDC-2120 setup: temp pick list on Leads + view filtering on one option, then try to remove that option.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
const out = {};
const add = await api('POST', `/modules/${L}/fields`, { fields: [{ fieldName: 'qa_rt_pick', labels: { en: 'QA RT Pick' }, datatypeKey: 'pick_list', datatypeOptions: { allowed_values: ['QA RT opt A', 'QA RT opt B', 'QA RT opt C'] }, required: false, unique: false, uniquePeerModuleIds: [] }] });
out.add = add.s + ' ' + (add.s >= 300 ? add.t.slice(0, 250) : '');
const f = arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.fieldName === 'qa_rt_pick'); out.field = f && { id: f.id, opts: f.datatypeOptions };
const v = await api('POST', `/modules/${L}/views`, { name: 'QA RT 2120 pick', kind: 'list', visibility: 'private', layout_id: LT, settings: { criteria: { conditions: [{ field: 'qa_rt_pick', operator: 'equals', value: 'qa rt OPT b' }] } } });
out.view = v.s + ' ' + (v.j?.data?.id || v.t.slice(0, 200));
return done(out);
