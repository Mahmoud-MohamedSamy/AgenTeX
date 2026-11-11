// A4 Group P batch 2: ticket-event triggers (agent response, comment public filter, private thread, several events), Field Changed 3 fields any/all, department scope.
const R = {}; const TE = (events, x) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(x || {}) } });
const mark = t => [{ type: 'AddTicketComment', commentBody: 'QA AO WF ' + t + ' fired', commentPublic: false }];
const FC = (names, match) => ({ kind: 'SpecificFieldChanged', fieldName: names[0], fieldNames: names, fieldMatch: match });
const rules = {
  P2: TE(['agent_response']), P3: TE(['comment'], { comments: 'public' }), P4: TE(['private_thread']), P7: TE(['agent_response', 'comment']),
  P6any: FC(['description', 'phone', 'due_date'], 'any'), P6all: FC(['description', 'phone', 'due_date'], 'all'), P8: { kind: 'RecordCreated' }
};
for (const [t, tr] of Object.entries(rules)) R[t] = { rule: await mkRule(t, tr, mark(t)) };
R.P6four = { rule: await mkRule('P6four', FC(['description', 'phone', 'due_date', 'subject'], 'any'), mark('P6four')) };
R.P7mix = { rule: await mkRule('P7mix', { kind: 'RecordCreated', ticketEvents: { events: ['comment'] } }, mark('P7mix')) };
for (const t of Object.keys(rules)) R[t].ticket = await mkTicket(t, t === 'P8' ? { department: D2 } : {});
R.P8ctl = { ticket: await mkTicket('P8', {}, 'control in Dept A') };
await sleep(8000);
const rep = (id, mode, sub) => api('POST', `/desk/tickets/${id}/replies`, { mode, to: [QA_EMAIL], subject: sub, body_html: '<p>' + sub + '</p>' });
const com = (id, pub, txt) => api('POST', `/desk/tickets/${id}/comments`, { body_html: '<p>' + txt + '</p>', is_public: pub });
R.P2.act = [(await rep(R.P2.ticket.id, 'reply', 'QA AO WF P2 reply 1')).s, (await com(R.P2.ticket.id, false, 'QA AO WF P2 private comment, must not fire')).s];
await sleep(3000); R.P2.act.push((await rep(R.P2.ticket.id, 'reply', 'QA AO WF P2 reply 2')).s);
R.P3.act = [(await com(R.P3.ticket.id, false, 'QA AO WF P3 private, must not fire')).s]; await sleep(6000); R.P3.firedAfterPrivate = (await execs(R.P3.ticket.id)).length;
R.P3.act.push((await com(R.P3.ticket.id, true, 'QA AO WF P3 public, fires')).s);
R.P4.act = [(await rep(R.P4.ticket.id, 'forward', 'Fwd: QA AO WF P4 forward')).s];
R.P7.act = [(await rep(R.P7.ticket.id, 'reply', 'QA AO WF P7 reply')).s]; await sleep(3000); R.P7.act.push((await com(R.P7.ticket.id, true, 'QA AO WF P7 public comment')).s);
R.P6any.act = [await patchTicket(R.P6any.ticket.id, { phone: '0100' })];
R.P6all.act = [await patchTicket(R.P6all.ticket.id, { description: 'two of three', phone: '0101' })]; await sleep(6000); R.P6all.firedAfter2of3 = (await execs(R.P6all.ticket.id)).length;
R.P6all.act.push(await patchTicket(R.P6all.ticket.id, { description: 'three of three', phone: '0102', due_date: new Date(Date.now() + 3 * 864e5).toISOString() }));
await sleep(25000);
for (const t of Object.keys(R)) { const id = R[t].ticket?.id; if (!id) continue; R[t].exec = (await execs(id)).map(e => (e.rule === R[t].rule?.id ? '' : 'rule ' + String(e.rule).slice(0, 8) + ' ') + e.outcome + ' ' + e.trig + ' ' + e.actions.join(',')); }
fs.writeFileSync('../a4/p2.json', JSON.stringify(R, null, 1));
const S = {}; for (const [k, v] of Object.entries(R)) S[k] = { rule: v.rule?.s + (v.rule?.err ? ' ' + v.rule.err : ''), act: v.act, runs: (v.exec || []).length, exec: v.exec, a2: v.firedAfterPrivate ?? v.firedAfter2of3 };
return S;
