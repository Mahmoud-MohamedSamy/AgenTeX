// Fire batch 2: replies / comments / forward / field changes, then read which rules fired.
const A2 = 'a22482e2-3205-4c40-9972-0912ade816eb', A3 = 'e9314303-2abb-44b6-8b76-f908b7a3553b', DA = '9be4c422-b8cb-4f75-968e-acd686bac02e', DL = 'f7845032-d1be-48ff-8708-c539f2360df7';
const s = r => r.s + (r.s >= 300 ? ' ' + (r.j?.error?.message || r.t).slice(0, 160) : '');
const steps = {};
steps.a2reply = s(await api('POST', `/desk/tickets/${A2}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'Re: QA WF A2 ticket', body_html: '<p>QA WF A2 agent response</p>' }));
steps.a3private = s(await api('POST', `/desk/tickets/${A3}/comments`, { content_html: '<p>QA WF A3 private comment (must not fire)</p>', is_public: false }));
await sleep(8000); const a3after1 = arr((await api('GET', `/desk/tickets/${A3}/comments`)).j?.data).filter(c => /A3 fired/.test(c.body_html)).length;
steps.a3public = s(await api('POST', `/desk/tickets/${A3}/comments`, { content_html: '<p>QA WF A3 public comment (must fire)</p>', is_public: true }));
steps.daOne = await patchTicket(DA, { description: 'QA WF D3any changed one' });
steps.dlOne = await patchTicket(DL, { description: 'QA WF D3all changed one' });
await sleep(8000); const dlAfterOne = arr((await api('GET', `/desk/tickets/${DL}/comments`)).j?.data).filter(c => /D3all fired/.test(c.body_html)).length;
steps.dlAll = await patchTicket(DL, { description: 'QA WF D3all changed all', resolution: 'QA WF resolution', language: 'ar' });
await sleep(15000);
const fired = {}; for (const [k, id] of [['A2', A2], ['A3', A3], ['D3any', DA], ['D3all', DL]]) fired[k] = arr((await api('GET', `/desk/tickets/${id}/comments`)).j?.data).filter(c => /fired/.test(c.body_html)).map(c => c.body_html + ' @' + c.created_at.slice(11, 19));
return fin({ steps, a3firedAfterPrivate: a3after1, d3allFiredAfterOneField: dlAfterOne, fired });
