const M = { leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', calls: 'e72e608a-a5d3-45cf-888a-dfadc6e8b456', meetings: 'f13e02be-03d3-46c3-a74e-22c7770823ca' };
const ME = '3445ec4a-020e-4f12-b156-dd2de7610164'; const out = { records: {}, fields: [], layouts: [], pipelines: [], teamspaces: [], stageField: null };
for (const [k, id] of Object.entries(M)) {
  const fl = encodeURIComponent(JSON.stringify([{ field: k === 'deals' ? 'deal_name' : k === 'leads' ? 'name' : k === 'meetings' ? 'title' : 'subject', operator: 'contains', value: 'QA RT' }]));
  let r = await api('GET', `/modules/${id}/records?page=1&per_page=100&filters=${fl}`);
  let recs = arr(r.j?.data);
  if (k === 'leads') { const fl2 = encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'contains', value: 'QA RT' }])); const r2 = await api('GET', `/modules/${id}/records?page=1&per_page=100&filters=${fl2}`); recs = recs.concat(arr(r2.j?.data)); }
  out.records[k] = recs.filter(x => /QA RT/.test(JSON.stringify(x.data))).map(x => x.id + ' ' + ((x.data.find(f => /deal_name|^name$|subject|title|first_name/.test(f.field)) || {}).value?.value));
}
for (const id of [M.leads, M.deals]) { const F = arr((await api('GET', `/modules/${id}/fields`)).j.data); out.fields.push(...F.filter(f => f.createdBy === ME && f.createdAt >= '2026-10-21').map(f => id.slice(0, 4) + ' ' + f.id + ' ' + f.fieldName + ' ' + (f.labels?.en || ''))); }
out.layouts = (await api('GET', `/modules/${M.leads}/layouts`)).j.data.filter(l => /QA RT/.test(l.name)).map(l => l.id + ' ' + l.name);
out.pipelines = arr((await api('GET', `/modules/${M.deals}/pipelines?layout_id=fcba0068-d67f-44f5-8412-cdef9c09e16e`)).j.data).map(p => p.name + ':' + p.stages.map(s => s.stageValue).join(','));
out.stageField = arr((await api('GET', `/modules/${M.deals}/fields`)).j.data).find(f => f.fieldName === 'stage').config.allowed_values.filter(v => /qa_rt/.test(v));
out.teamspaces = arr((await api('GET', '/settings/teamspaces')).j.data).filter(t => /QA RT/.test(t.name)).map(t => t.id + ' ' + t.name);
const sp = (await api('GET', `/modules/${M.deals}/stage-probability?pipeline_id=5170500c-b335-479c-96d1-ed138965c345`)).j.data.find(x => x.stageValue === 'qualification'); out.stdQualification = sp.probability + '/' + sp.forecastCategory;
out.defaultLeadLayout = (await api('GET', `/modules/${M.leads}/layouts`)).j.data.filter(l => l.isDefault).map(l => l.name);
return done(out);
