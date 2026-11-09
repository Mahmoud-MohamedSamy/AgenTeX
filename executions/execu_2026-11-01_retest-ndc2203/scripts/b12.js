const out = {}; const ev = (events, x) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(x || {}) } });
out.A1 = await mkRule('A1', ev(['customer_reply']), [{ type: 'AddTicketComment', commentBody: 'QA WF A1 fired (customer reply)', commentPublic: false }]);
const rr = async (name, ratings) => { const r = await api('POST', '/workflow/rules', { moduleId: T, name, isActive: true, mode: 'Recurring', trigger: ev(['rating'], ratings ? { ratings } : {}), criteria: guard('QA WF A5 '), actions: [{ order: 0, type: 'AddTicketComment', commentBody: name + ' fired', commentPublic: false }] }); if (r.j?.data?.id) track('rule', r.j.data.id, name); return r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 200)); };
out.A5all = await rr('QA WF A5 all ratings'); out.A5good = await rr('QA WF A5 good only', ['good']); out.A5bad = await rr('QA WF A5 bad only', ['bad']);
out.A5send = await mkRule('A5send', { kind: 'RecordCreated' }, [{ type: 'SendHappinessEmail' }]);
// tickets
const a1 = (await mkTicket('A1')).id; out.a1 = a1;
out.a1reply = (await api('POST', `/desk/tickets/${a1}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'QA WF A1 — please reply to this email', body_html: '<p>QA WF A1: please reply to this email with any text. Your reply fires the Customer Reply rule.</p>' })).s;
// A5: ticket whose subject matches both "QA WF A5send " (sends the email) and the A5 rating guard "QA WF A5 "? -> use subject "QA WF A5 send" for rating guard; separate send rule on its own prefix
const a5 = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: 'QA WF A5 rating ticket', status: 'Open', department: CS, email: QA_EMAIL, channel: 'email' }).map(([k, v]) => ({ field: k, value: enc(v) })) }); const a5id = a5.j?.data?.id; track('ticket', a5id, 'A5'); out.a5 = a5id;
await sleep(10000);
const t5 = await getTicket(a5id); out.a5fields = { happiness_link_status: t5.happiness_link_status, happiness_rating: t5.happiness_rating };
return fin(out);
