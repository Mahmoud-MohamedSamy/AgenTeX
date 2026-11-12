// Remaining A4 rows, prep (12 Nov evening): M5 Field Changed run for the Execution History screen; M7 counts.
const S = v => ({ kind: 'string', stringValue: v });
const R = {};
const m5 = await mkRule('M5fc', { kind: 'SpecificFieldChanged', fieldName: 'priority' }, [{ type: 'FieldUpdate', fieldUpdates: { description: S('QA WF M5 fired') } }]);
R.m5rule = m5.s + (m5.err || '');
if (m5.s >= 300) { const m5b = await mkRule('M5fc2', { kind: 'FieldChanged', watchField: 'priority' }, [{ type: 'FieldUpdate', fieldUpdates: { description: S('QA WF M5 fired') } }]); R.m5rule2 = m5b.s + (m5b.err || ''); }
const t = await mkTicket('M5fc'); R.t = t.s;
await sleep(5000); R.patch = await patchTicket(t.id, { priority: 'high' });
R.ex = await waitExec(t.id, 1, 45); R.ticket = t.id;
const all = arr2((await api('GET', '/workflow/executions?take=500')).j?.data); R.execTotalTake500 = all.length;
fs.writeFileSync('../a4/rx1-out.json', JSON.stringify(R, null, 1)); log(JSON.stringify(R).slice(0, 1500));
