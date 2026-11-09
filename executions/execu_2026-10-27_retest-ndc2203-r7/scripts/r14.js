const out = {}; const G = 'mahmoud.mahamed1515@gmail.com';
out.A1 = { rule: await mkRule('A1', { kind: 'TicketEvent', ticketEvents: { events: ['customer_reply'] } }, [{ type: 'AddTicketComment', commentBody: 'QA WF A1 fired', commentPublic: false }]) };
const t = await mkTicket('A1', { email: G }); out.A1.ticket = t;
if (t.id) { const r = await api('POST', `/desk/tickets/${t.id}/replies`, { mode: 'reply', to: [G], subject: 'QA WF A1 ticket', body_html: '<p>QA WF A1 — please reply to this email (round 7 test of the Customer Reply trigger).</p>' }); out.A1.reply = r.s; out.A1.n = (await getTicket(t.id)).ticket_number; }
const b4 = [["E1c","Y","2adc5f1f-a42f-456e-8a86-83021efdc529"],["E1a","Y","b8d8ed03-8504-4cb1-875c-874c165f8ac1"],["E2in","Y","388e0bf5-ef1a-419a-9ee3-63c6ecdcad78"],["E3od","Y","633a7cc3-2d0c-4e16-80fd-a95b4cca1bd8"],["E3cb","Y","40f63dc3-e540-4090-ba36-6c9501386fa8"],["E4","Y","b52b2456-b5bf-480d-99f4-3657dfabdf0d"]];
out.hist = {}; for (const [tag, exp, id] of b4) out.hist[tag + exp] = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data).map(a => a.action + (a.summary?.by_rule_name ? '[' + a.summary.by_rule_name + ']' : '') + (a.summary?.rule_name ? '{' + a.summary.rule_name + '}' : '')).join(', ');
return fin(out);
