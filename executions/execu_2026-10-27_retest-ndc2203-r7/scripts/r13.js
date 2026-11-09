const ACC = '784400e1-4a2a-42c2-b4f3-7ca56e79828a', aY = '85c35c48-4675-4d7c-9e10-f0f9091d76c8'; const out = {};
const a = await getRec(ACC, aY); out.acc = { name: val(a.account_name), desc: val(a.description) };
out.accFields = arr((await api('GET', `/modules/${ACC}/fields`)).j?.data).filter(f => /desc/i.test(f.fieldName)).map(f => f.fieldName);
const r = await mkRule('E1a2', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', commentBody: 'QA WF E1a2 fired', commentPublic: false }], { criteria: and(guard('QA WF E1a2 '), { kind: 'StringMatch', field: 'account_id.account_name', operator: 'Contains', stringValue: 'QA WF E1', caseInsensitive: false }) });
out.rule = r.s; const y = await mkTicket('E1a2', { subject: 'QA WF E1a2 ticket Y', account_id: aY }); const n = await mkTicket('E1a2', { subject: 'QA WF E1a2 ticket N' });
await sleep(15000);
for (const [k, t] of [['Y', y], ['N', n]]) out[k] = arr((await api('GET', `/desk/tickets/${t.id}/comments`)).j?.data).filter(c => /fired/.test(c.body_html)).length;
return fin(out);
