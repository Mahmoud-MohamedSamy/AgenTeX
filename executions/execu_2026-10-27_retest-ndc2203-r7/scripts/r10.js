const DL = 'f7845032-d1be-48ff-8708-c539f2360df7', DA = '9be4c422-b8cb-4f75-968e-acd686bac02e'; const out = {};
const t = await getTicket(DL); out.now = { d: t.description, r: t.resolution, l: t.language, s: t.subject };
out.ex = arr((await api('GET', `/workflow/executions?recordId=${DL}`)).j?.data).map(e => [e.ruleId?.slice(0, 8), e.outcome, e.criteriaMatched, e.triggerKind || e.trigger, e.evaluatedAt?.slice(11, 23), JSON.stringify(e.changedFields || e.changed_fields || '')].join(' '));
out.exDA = arr((await api('GET', `/workflow/executions?recordId=${DA}`)).j?.data).map(e => [e.ruleId?.slice(0, 8), e.outcome, e.criteriaMatched, e.evaluatedAt?.slice(11, 23)].join(' '));
out.hist = arr((await api('GET', `/desk/tickets/${DL}/activity`)).j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 23) + ' ' + JSON.stringify(a.summary || '').slice(0, 160));
out.sample = JSON.stringify(arr((await api('GET', `/workflow/executions?recordId=${DL}`)).j?.data)[0] || '').slice(0, 900);
return done(out);
