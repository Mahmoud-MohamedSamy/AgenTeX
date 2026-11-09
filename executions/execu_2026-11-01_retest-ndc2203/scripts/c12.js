page.on('dialog', d => d.accept().catch(() => {}));
const A1 = '6b1158b3-36f1-40dd-a5ba-688ef8f4df88';
const cm = arr((await api('GET', `/desk/tickets/${A1}/comments`)).j?.data).map(c => (c.is_public ? 'PUB ' : 'prv ') + c.body_html.replace(/<[^>]+>/g, '').slice(0, 60) + ' @' + c.created_at.slice(11, 19));
const rp = (await api('GET', `/desk/tickets/${A1}/replies`)).j?.data; const replies = arr(rp?.replies || rp).map(r => ({ dir: r.direction, from: r.from || r.from_address, subj: r.subject, at: r.created_at }));
const ex = arr((await api('GET', `/workflow/executions?recordId=${A1}`)).j?.data).map(e => [e.ruleId.slice(0, 8), e.triggerKind, e.criteriaMatched, e.outcome, e.evaluatedAt.slice(11, 19)].join(' '));
const h = arr((await api('GET', `/desk/tickets/${A1}/activity`)).j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 19) + ' ' + JSON.stringify(a.summary || '').slice(0, 140));
const t = await getTicket(A1);
// any new ticket created from the reply?
const recent = arr((await api('GET', `/modules/${T}/records?page=1&per_page=15&sort_by=created_at&sort_dir=desc`)).j?.data).map(r => { const o = {}; for (const x of r.data || []) o[x.field] = val(x.value); return (o.subject || '') + ' #' + (o.ticket_number || '') + ' ' + (o.created_at || '').slice(11, 19); }).filter(s => /QA WF A1|Re:/i.test(s));
return fin({ status: t.status, customer_responded: t.customer_responded, cm, replies, ex, h: h.slice(0, 10), recent });
