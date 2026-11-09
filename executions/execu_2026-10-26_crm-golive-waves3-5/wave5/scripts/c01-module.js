const TS = '5ea90671-4df5-4642-939d-49494f8e4d6e', out = {};
const mods = (await call('GET', '/modules')).j.data;
let m = mods.find(x => x.moduleKey === 'qa_w5_module');
if (!m) {
  const t0 = Date.now();
  const c = await call('POST', `/teamspaces/${TS}/modules`, { moduleKey: 'qa_w5_module', labels: { en: 'QA W5 Module' }, pluralForm: 'QA W5 Module', singularForm: 'QA W5 Record', description: 'QA W5 lane C, deleted after the run' });
  out.create = c.s + ' ' + (c.s < 300 ? '' : c.t.slice(0, 300)); out.createMs = Date.now() - t0;
  if (c.s < 300) m = c.j.data;
}
out.module = m && { id: m.id, key: m.moduleKey, plural: m.pluralForm, status: m.status };
if (m) {
  const lay = await call('GET', `/modules/${m.id}/layouts`); out.layouts = lay.s + ' ' + JSON.stringify((lay.j.data.layouts || lay.j.data || []).map(l => l.name + '|' + l.id + '|' + l.status)).slice(0, 300);
  const f = await call('GET', `/modules/${m.id}/fields`); const fl = f.j.data.fields || f.j.data; out.defaultFields = (fl || []).map(x => x.apiName + ':' + x.datatypeKey);
  const dup = await call('POST', `/teamspaces/${TS}/modules`, { moduleKey: 'qa_w5_module', labels: { en: 'QA W5 Module' }, pluralForm: 'QA W5 Module', singularForm: 'QA W5 Record' });
  out.duplicateKey = dup.s + ' ' + dup.t.slice(0, 200);
  const noPlural = await call('POST', `/teamspaces/${TS}/modules`, { moduleKey: 'qa_w5_noplural', labels: { en: 'QA W5 No plural' } });
  out.noPlural = noPlural.s + ' ' + noPlural.t.slice(0, 250); if (noPlural.s < 300) out.noPluralId = noPlural.j.data.id;
}
return out;
