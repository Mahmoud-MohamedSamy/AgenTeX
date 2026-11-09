// Fire batch 2: replies / comments / forward / field changes, then read which rules fired.
const A2 = '30a2f098-c129-4229-abd0-d7af0594207a', A3 = '1a696e04-600e-4ca9-9cdf-22cd8aa78257', A4 = '8783b9e7-d5fa-4f07-86b9-c38e95a815cf', DA = '68384f10-598d-418e-b049-4ec7684a4890', DL = '924f2fa3-5d1c-44ec-86cd-9082a7544789';
const s = r => r.s + (r.s >= 300 ? ' ' + (r.j?.error?.message || r.t).slice(0, 160) : '');
const steps = {};
steps.a2reply = s(await api('POST', `/desk/tickets/${A2}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'Re: QA WF A2 ticket', body_html: '<p>QA WF A2 agent response</p>' }));
steps.a3private = s(await api('POST', `/desk/tickets/${A3}/comments`, { content_html: '<p>QA WF A3 private comment (must not fire)</p>', is_public: false }));
await sleep(8000); const a3after1 = arr((await api('GET', `/desk/tickets/${A3}/comments`)).j?.data).filter(c => /A3 fired/.test(c.body_html)).length;
steps.a3public = s(await api('POST', `/desk/tickets/${A3}/comments`, { content_html: '<p>QA WF A3 public comment (must fire)</p>', is_public: true }));
steps.a4forward = s(await api('POST', `/desk/tickets/${A4}/replies`, { mode: 'forward', to: [QA_EMAIL], subject: 'Fwd: QA WF A4 ticket', body_html: '<p>QA WF A4 forward</p>' }));
steps.daOne = await patchTicket(DA, { description: 'QA WF D3any changed one' });
steps.dlOne = await patchTicket(DL, { description: 'QA WF D3all changed one' });
await sleep(8000); const dlAfterOne = arr((await api('GET', `/desk/tickets/${DL}/comments`)).j?.data).filter(c => /D3all fired/.test(c.body_html)).length;
steps.dlAll = await patchTicket(DL, { description: 'QA WF D3all changed all', resolution: 'QA WF resolution', language: 'ar' });
await sleep(15000);
const fired = {}; for (const [k, id] of [['A2', A2], ['A3', A3], ['A4', A4], ['D3any', DA], ['D3all', DL]]) fired[k] = arr((await api('GET', `/desk/tickets/${id}/comments`)).j?.data).filter(c => /fired/.test(c.body_html)).map(c => c.body_html + ' @' + c.created_at.slice(11, 19));
return fin({ steps, a3firedAfterPrivate: a3after1, d3allFiredAfterOneField: dlAfterOne, fired });
