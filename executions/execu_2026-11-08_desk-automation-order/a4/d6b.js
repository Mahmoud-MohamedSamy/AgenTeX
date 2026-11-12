const r = await api('POST', '/teamspaces/a641f1df-f2c6-450e-a881-857776dacf70/modules', { moduleKey: 'qa_ao_wf_d6', labels: { en: 'QA AO WF D6' }, pluralForm: 'QA AO WF D6', singularForm: 'QA AO WF D6 item', storageScope: 'organization', appKey: 'desk' });
const id = r.j?.data?.id; log('create', r.s, r.s >= 300 ? r.t.slice(0, 300) : id);
if (id) { fs.writeFileSync('../a4/d6.json', JSON.stringify({ module: id }));
  const f = arr((await api('GET', `/modules/${id}/fields?take=200`)).j?.data); log('fields', f.length, JSON.stringify(f.map(x => [x.fieldKey || x.key || x.api_name, x.dataType || x.type || x.fieldType, x.isSystem || x.is_system])));
}
