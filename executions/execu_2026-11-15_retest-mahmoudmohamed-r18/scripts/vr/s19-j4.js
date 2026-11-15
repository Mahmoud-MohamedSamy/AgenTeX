const mid = await modId(); const o = {};
const f = (await fieldsOf(mid)).find(x => x.fieldName === 'qa_rt18v_pick');
const body = { ...f, datatypeOptions: { ...(f.datatypeOptions || {}), allowed_values: ['Open', 'Done'] }, config: { ...(f.config || {}), allowed_values: ['Open', 'Done'] } };
const u = await api('PUT', '/modules/' + mid + '/fields/' + f.id, body); o.removeReject = SR(u).slice(0, 300);
o.e2 = await ruleState(mid, I.rE2);
const f2 = (await fieldsOf(mid)).find(x => x.fieldName === 'qa_rt18v_pick'); o.valuesNow = (f2.datatypeOptions || {}).allowed_values || (f2.config || {}).allowed_values;
if (u.s < 300) { const back = await api('PUT', '/modules/' + mid + '/fields/' + f.id, { ...f2, datatypeOptions: f.datatypeOptions, config: f.config }); o.restored = back.s; LED('changed field qa_rt18v_pick: removed option Reject then restored ' + back.s + ' (Leads)'); o.e2after = await ruleState(mid, I.rE2); }
return o;
