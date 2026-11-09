// Probe: create an INACTIVE QA rule with a guard, to learn the accepted names. Deleted right after.
const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const out = [];
const guard = { kind: 'Comparison', field: 'subject', operator: 'StartsWith', negate: false, value: { kind: 'string', stringValue: 'QA WF ' } };
const tryRule = async (label, trigger, actions) => { const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF probe ' + label, isActive: false, mode: 'Recurring', trigger, criteria: guard, actions });
  const id = r.j?.data?.id; if (id) await api('DELETE', `/workflow/rules/${id}`); out.push({ label, s: r.s, err: r.s >= 300 ? r.t.slice(0, 300) : undefined, trig: id ? JSON.stringify(r.j.data.trigger).replace(/,"[a-zA-Z]+":null/g, '') : undefined }); };
await tryRule('event', { kind: 'TicketEvent', ticketEvents: ['CustomerReply'] }, [{ type: 'AddComment', order: 0, commentBody: 'x', commentPublic: false }]);
await tryRule('event2', { kind: 'TicketEvent', ticketEvents: [{ event: 'CustomerReply' }] }, [{ type: 'AddComment', order: 0, commentBody: 'x', commentPublic: false }]);
return done(out);
