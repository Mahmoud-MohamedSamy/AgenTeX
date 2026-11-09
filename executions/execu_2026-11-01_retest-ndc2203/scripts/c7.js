const id = '7644ce9e-0fe6-44da-99f1-79f58bfb0d45';
const g = await api('GET', `/modules/${T}/records/${id}`); const h = await api('GET', `/desk/tickets/${id}/activity`);
const ex = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => [e.ruleId.slice(0, 8), e.triggerKind, e.outcome, e.evaluatedAt.slice(11, 19)].join(' '));
return fin({ get: g.s + ' ' + g.t.slice(0, 200), hist: h.s + ' ' + arr(h.j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 19) + ' ' + JSON.stringify(a.summary || '').slice(0, 160)).join(' || ').slice(0, 1500), ex });
