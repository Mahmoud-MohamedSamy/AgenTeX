const M = made.mod;
let fl = L((await api('GET', `/modules/${M}/fields`)).j?.data); const has = n => fl.some(f => f.fieldName === n);
if (!has('in_parent')) log('parent', E(await api('POST', `/modules/${M}/fields`, { fields: [fdef('in_parent', 'In Parent (self lookup)', 'lookup', { target_module_id: M, related_list_title: 'QA FX Matrix children' })] })));
if (!has('in_rollup_summary')) log('rollup', E(await api('POST', `/modules/${M}/fields`, { fields: [fdef('in_rollup_summary', 'In Rollup Summary', 'rollup_summary', { target_module_id: M, relation_field: 'in_parent', target_field: 'in_number', aggregation: 'sum' })] })));
fl = L((await api('GET', `/modules/${M}/fields`)).j?.data);
log(fl.filter(f => /^in_/.test(f.fieldName)).length, 'inputs:', fl.filter(f => /^in_/.test(f.fieldName)).map(f => f.datatypeKey).join(' '));
