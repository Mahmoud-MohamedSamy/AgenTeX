const all = L((await api('GET', '/fields/datatypes')).j?.data); log('types', all.length, all.map(x => x.key).join(' '));
const mods = L((await api('GET', '/modules')).j?.data); const ACC = mods.find(m => m.moduleKey === 'accounts')?.id;
const have = new Set(L((await api('GET', `/modules/${made.mod}/fields`)).j?.data).map(f => f.fieldName));
const NEW = { camera: 'Camera', image_upload: 'Image Upload', map: 'Map', multi_select_lookup: 'Multi-Select Lookup', department: 'Department', team: 'Team', pipeline: 'Pipeline', support_plan: 'Support Plan', email_template: 'Email Template', rollup_summary: 'Rollup Summary' };
for (const [k, lab] of Object.entries(NEW)) { if (have.has('in_' + k)) { log(k, 'exists'); continue; }
  const o = k === 'multi_select_lookup' ? { target_module_id: ACC, related_list_title: 'QA FX Matrix MSL' } : undefined;
  const r = await api('POST', `/modules/${made.mod}/fields`, { fields: [fdef('in_' + k, 'In ' + lab, k, o)] }); log(k, E(r));
  if (r.s >= 300) log('  schema', JSON.stringify(all.find(x => x.key === k)?.options_schema).slice(0, 600)); }
for (const [a, b] of [['in_date', 'in_date'], ['in_date_time', 'in_date_time']]) log('probe', E(await api('POST', `/formulas/validate`, { expression: `daysbetween(${a}, ${b})` })).slice(0, 200));
