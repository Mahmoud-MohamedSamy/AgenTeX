const ids = { TR01:'cb7e6344-f00a-40b2-a5be-56ff42cbf8ac', TRC:'8fe1e5bc-41d1-46e3-8be1-36667bb38502', TRE:'e39b7ea6-65e5-4714-96e1-d522461b6bcd', TRCE:'528c977a-f5bd-4039-bc51-1a47be806784' };
const subj = {}; const out = {};
for (const [k, id] of Object.entries(ids)) {
  const e = arr((await api('GET','/workflow/executions?ruleId='+id+'&take=100')).j.data);
  out[k] = [];
  for (const x of e) { if (!subj[x.recordId]) subj[x.recordId] = (await getTicket(x.recordId)).subject || '(gone)'; out[k].push(x.outcome + ' ' + x.triggerKind + ' ' + subj[x.recordId] + ' ' + x.evaluatedAt.slice(11,19)); }
}
const r = arr((await api('GET','/workflow/rules?moduleId='+T+'&take=200')).j.data).find(x=>x.id===ids.TR01);
out.tr01 = { criteria: r.criteria, updated: r.updatedAt, version: r.version };
return out;
