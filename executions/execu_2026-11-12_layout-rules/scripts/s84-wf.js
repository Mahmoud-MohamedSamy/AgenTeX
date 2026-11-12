const mid = await modId(); const out = {};
const body = { moduleId: mid, appKey: 'crm', layoutId: null, departmentIds: [], name: P + ' wf G13', description: null, trigger: { kind: 'RecordCreatedOrUpdated' }, criteria: { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', caseInsensitive: false, stringValue: 'QA LR1112 wf' }, mode: 'Recurring', actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { qa_lr_type: { kind: 'string', stringValue: 'Refund' } } }] };
const c = await api('POST', '/workflow/rules', body); out.create = SR(c).slice(0, 400); const wid = c.j && c.j.data && c.j.data.id; if (!wid) return out; I.wf = wid; SAVE(); LED('workflow rule ' + wid + ' (G13)');
const a = await api('POST', '/workflow/rules/' + wid + '/activate'); out.act = SR(a).slice(0, 120);
const r = await mkRec(mid, { first_name: 'QA LR1112 wf G13' }, I.layout); out.rec = r.s + ' ' + r.id + ' ' + r.err; LED('record wf G13 ' + r.id);
await sleep(8000); const d = (await api('GET', '/modules/' + mid + '/records/' + r.id)).j.data.data; out.after = d.filter(x => /qa_lr_(type|order)/.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value.value));
const ex = await api('GET', '/workflow/executions?ruleId=' + wid); out.exec = JSON.stringify(arr(ex.j && ex.j.data).slice(0, 2).map(e => ({ s: e.status, err: e.error || e.errorMessage }))).slice(0, 400);
out.deact = SR(await api('POST', '/workflow/rules/' + wid + '/deactivate')).slice(0, 60);
return out;
