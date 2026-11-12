const o = {}; const TK = '47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5';
const r = await api('POST', `/desk/tickets/${TK}/replies`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 split test', body_html: '<p>QA GL W2 split test: please reply to this email with one line, for example "Third question: split this message into its own ticket."</p>' });
o.send = r.s + ' ' + r.t.slice(0, 200); o.outId = r.j && r.j.data && (r.j.data.id || (r.j.data.reply && r.j.data.reply.id));
await sleep(6000); const l = await api('GET', `/desk/tickets/${TK}/replies`); o.msgs = arr(l.j && l.j.data).map(m => [m.id, m.direction, m.status, m.created_at]);
const out = o.msgs.find(m => m[1] === 'outbound'); if (out) { const s = await api('POST', `/desk/tickets/${TK}/replies/${out[0]}/split`, {}); o.splitOutbound = s.s + ' ' + s.t.slice(0, 250); }
return done(o);
