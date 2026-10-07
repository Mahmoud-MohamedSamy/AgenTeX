const r = await api('POST', `/teamspaces/${TS}/modules`, { moduleKey: 'qa_mf_types', labels: { en: 'QA MF Types' }, pluralForm: 'QA MF Types', singularForm: 'QA MF Types1', storageScope: 'organization' });
const m = (await mods()).filter(x => /qa_mf/.test(x.moduleKey)).map(x => x.moduleKey + '=' + x.id.slice(0, 8));
rec('MK', 'INFO', `POST → ${r.s} ${r.t.slice(0, 300)}; qa modules now ${m.join(', ')}`);
return done();
