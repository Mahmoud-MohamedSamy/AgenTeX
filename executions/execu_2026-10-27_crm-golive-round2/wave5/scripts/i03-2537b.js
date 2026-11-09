// NDC-2537 run time: ACTIVE rule on the QA module only (name guard), one QA record, read the dispatch, delete rule + record
const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842';
const res = {};
const crit = { kind: 'Comparison', field: 'name', op: 'StartsWith', value: { kind: 'string', value: 'QA R2W5 WHRT' }, negate: null };
const body = { moduleId: M, appKey: 'crm', layoutId: null, departmentIds: [], name: 'QA R2W5 WHRT rule', description: null, mode: 'Recurring', isActive: true,
  trigger: { kind: 'RecordCreated', fieldName: null, fieldNames: null, fieldMatch: null, dateFieldName: null, offsetSeconds: null, offsetMode: null }, criteria: null,
  actions: [{ type: 'Webhook', order: 0, delaySeconds: 0, method: 'Post', url: 'http://169.254.169.254.nip.io/latest/meta-data/', bodyTemplate: '{"id":"${id}"}', headers: {}, timeoutSeconds: 10 }] };
const r = await call('POST', '/workflow/rules', body); res.rule = r.s + ' ' + r.t.slice(0, 150);
const rid = r.s < 300 ? r.j.data.id : null;
if (rid) {
  const rec = await call('POST', `/modules/${M}/records`, { layout_id: L, data: [{ field: 'name', value: { kind: 'string', value: 'QA R2W5 WHRT rec' } }, { field: 'qa_email', value: { kind: 'string', value: 'qa.r2w5.whrt@example.com' } }, { field: 'qa_text', value: { kind: 'string', value: 'QA55' } }] });
  res.record = rec.s + ' ' + rec.t.slice(0, 120); const id = rec.s < 300 ? rec.j.data.id : null; res.recId = id;
  if (id) {
    await sleep(25000);
    const ex = await call('GET', `/workflow/executions?recordId=${id}&take=50`);
    const mine = ((ex.j && ex.j.data) || []).filter(e => e.recordId === id);
    res.execs = [];
    for (const e of mine) { const d = await call('GET', '/workflow/executions/' + e.id); res.execs.push(e.outcome + ' ' + JSON.stringify(d.j && d.j.data && d.j.data.dispatches).slice(0, 700)); }
    res.delRec = (await call('DELETE', `/modules/${M}/records/${id}`)).s;
  }
  res.delRule = (await call('DELETE', '/workflow/rules/' + rid)).s;
}
return res;
