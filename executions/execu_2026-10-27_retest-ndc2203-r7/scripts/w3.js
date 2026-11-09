const id = '03788922-37ae-41c9-a9ea-2d3f5f565738'; const out = {};
const rp = (await api('GET', `/desk/tickets/${id}/replies`)).j?.data;
out.replies = arr(rp?.replies || rp).map(r => [r.direction, r.is_public, r.visibility_rule, r.trusted, r.dkim_aligned, r.created_at?.slice(11, 19), (r.from_address || '').replace(/@.*/, '@…'), (r.subject || '').slice(0, 40)].join(' | '));
const t = await getTicket(id); out.ticket = { n: t.ticket_number, status: t.status, customer_responded: t.customer_responded };
out.fired = arr((await api('GET', `/desk/tickets/${id}/comments`)).j?.data).filter(c => /fired/.test(c.body_html)).map(c => c.body_html.replace(/<[^>]+>/g, '') + ' @' + c.created_at.slice(11, 19));
out.hist = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 19) + ' ' + JSON.stringify(a.summary || '').replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 150));
out.ex = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => (e.ruleId || '').slice(0, 8) + ' ' + (e.outcome || e.status) + ' ' + (e.evaluatedAt || '').slice(11, 19));
return done(out);
