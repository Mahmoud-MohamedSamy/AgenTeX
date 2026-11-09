const id = '44681cc8-30c5-49b5-a50d-718fee90c862'; const out = {};
const rp = (await api('GET', `/desk/tickets/${id}/replies`)).j?.data; const inb = arr(rp?.replies || rp).find(r => r.direction === 'inbound');
out.inbound = inb && Object.fromEntries(Object.entries(inb).filter(([k, v]) => !/body|html|text|headers|raw|from_email|to|cc/i.test(k) && (typeof v !== 'object' || v === null)).map(([k, v]) => [k, typeof v === 'string' ? v.slice(0, 60) : v]));
const t = await getTicket(id); out.ticket = { status: t.status, customer_responded: t.customer_responded, customerResponded: t.customerResponded };
out.hist = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 19) + ' ' + JSON.stringify(a.summary || '').replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 170));
out.ex = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => (e.ruleId || '').slice(0, 8) + ' ' + (e.outcome || e.status) + ' ' + (e.evaluatedAt || '').slice(11, 19));
return done(out);
