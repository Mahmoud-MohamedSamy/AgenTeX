const C = { kind: 'Comparison', field: 'executionTime', operator: 'Equal', negate: false, value: { kind: 'string', stringValue: 'business_hours' } };
const bh = (await api('GET', '/desk/business-hours')).j?.data;
const r = await mkRule('P11 evidence', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', commentBody: 'QA AO WF P11 evidence fired', commentPublic: false }], { criteria: C });
const c = await mkRule('P11 control', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', commentBody: 'QA AO WF P11 control fired', commentPublic: false }]);
const t = await mkTicket('P11 evidence', {}, 'ticket'); await sleep(15000); const g = await getTicket(t.id);
const ex = arr2((await api('GET', `/workflow/executions?recordId=${t.id}`)).j?.data).filter(e => [r.id, c.id].includes(e.ruleId)).map(e => ({ rule: e.ruleId === r.id ? 'evidence' : 'control', outcome: e.outcome, criteriaMatched: e.criteriaMatched, details: JSON.stringify(e.details || '').slice(0, 300) }));
fs.writeFileSync('../a4/p11ev.json', JSON.stringify({ rule: r.id, ctrl: c.id, t: t.id, num: g.ticket_number, bh: { preset: bh.preset, open: bh.is_open_now, at: bh.evaluated_at }, ex }, null, 1));
log(JSON.stringify({ r: r.s, c: c.s, num: g.ticket_number, bh: bh.preset + ' open=' + bh.is_open_now, ex }));
