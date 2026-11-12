// G13: workflow field update writes a value that breaks a validation rule
const mid = await modId(); const out = {};
const body = { moduleId: mid, appKey: 'crm', layoutId: null, departmentIds: [], name: P + ' wf G13', description: null, trigger: { kind: 'RecordCreatedOrUpdated' }, criteria: { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', caseInsensitive: false, stringValue: 'QA VR1112 wf' }, mode: 'Recurring', actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { qa_vr_text: { kind: 'string', stringValue: 'BAD-from-workflow' } } }] };
const c = await api('POST', '/workflow/rules', body); out.create = SR(c).slice(0, 300); const wid = c.j && c.j.data && c.j.data.id; if (!wid) return out; I.wf = wid; SAVE(); LED('workflow rule ' + wid + ' (G13)');
out.act = SR(await api('POST', '/workflow/rules/' + wid + '/activate')).slice(0, 120);
const r = await mkRec(mid, { first_name: 'QA VR1112 wf G13', last_name: P + ' wf', qa_vr_phone: '+201001234567' }, I.layout); out.rec = r.s + ' ' + r.err.slice(0, 150);
await sleep(9000);
if (r.id) { const d = (await api('GET', '/modules/' + mid + '/records/' + r.id)).j.data.data; out.after = d.filter(x => /qa_vr_text/.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value.value)); }
const ex = await api('GET', '/workflow/executions?ruleId=' + wid); out.exec = JSON.stringify(arr(ex.j && ex.j.data).slice(0, 2).map(e => ({ s: e.status, err: e.error || e.errorMessage, steps: JSON.stringify(e.steps || e.actions || '').slice(0, 300) }))).slice(0, 700);
out.deact = SR(await api('POST', '/workflow/rules/' + wid + '/deactivate')).slice(0, 60);
out.del = SR(await api('DELETE', '/workflow/rules/' + wid)).slice(0, 60); LED('workflow rule deleted ' + out.del);
RES('G13', 'INFO', `workflow field update sets qa_vr_text='BAD-from-workflow' on create: record ${out.rec}; value after: ${JSON.stringify(out.after)}; execution: ${out.exec.slice(0, 300)}`);
return out;
