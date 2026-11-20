const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const I = JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/out/ids-sc.json', 'utf8'));
const o = {}; const S = r => r.s + ' ' + ((r.j && r.j.error && r.j.error.code) || '');
o.list = S(await api('GET', '/scoring-rules?module_id=' + L)); o.get = S(await api('GET', '/scoring-rules/' + I.R1));
o.create = S(await api('POST', '/scoring-rules', { module_id: L, name: 'QA RT20 SC perm', is_active: false, entries: [{ field_key: 'company', operator: 'eq', value: 'x', points: 1 }] }));
o.active = S(await api('PATCH', '/scoring-rules/' + I.R4 + '/active', { is_active: false })); o.del = S(await api('DELETE', '/scoring-rules/' + I.R4)); o.run = S(await api('POST', '/scoring-rules/run', { module_id: L })); o.runStatus = S(await api('GET', '/scoring-rules/run?module_id=' + L));
const rec = await api('GET', '/modules/' + L + '/records/' + I.D); o.readLead = S(rec) + ' score ' + (rec.j && rec.j.data ? JSON.stringify((rec.j.data.data || []).find(x => x.field === 'score')) : '');
o.writeScore = S(await api('PATCH', '/modules/' + L + '/records/' + I.D, { data: [{ field: 'score', value: { kind: 'number', value: 999 } }] }));
return o;
