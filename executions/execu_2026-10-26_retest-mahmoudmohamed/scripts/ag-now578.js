const id = '36777aa3-d84a-4c6e-8de9-95d67f397b2c';
const rp = (await api('GET', `/desk/tickets/${id}/replies`)).j?.data; const replies = arr(rp?.replies || rp).map(r => r.direction + ' ' + r.created_at.slice(11, 19) + ' ' + (r.subject || '').slice(0, 60));
const cm = arr((await api('GET', `/desk/tickets/${id}/comments`)).j?.data).map(c => c.body_html.replace(/<[^>]+>/g, '').slice(0, 60) + ' @' + c.created_at.slice(11, 19));
const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data).slice(0, 8).map(a => a.action + ' ' + a.occurred_at.slice(11, 19) + ' ' + JSON.stringify(a.summary || '').slice(0, 180));
const ex = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => [e.ruleId.slice(0, 8), e.triggerKind, e.outcome, e.evaluatedAt.slice(11, 19)].join(' '));
return { now: new Date().toISOString().slice(11, 19), replies, cm, ex, h };
