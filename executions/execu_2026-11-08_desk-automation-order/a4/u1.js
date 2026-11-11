// A4 user round (user 11 Nov: "I'll reply in portal"). Sets up P1 (customer reply via Help Center), P5 + I28 (rating), P15 (Send Email Reply), P16 + I18 (Email to Contact, user, team).
// Changes, all restored by a4/u1-clean.js: QA AO Dept A Display in Help Center ON; Customer Happiness ON scoped to QA AO Dept A only (originals in a4/u1-orig.json).
const HC = 'e74f2abb-e28d-400e-908c-f2c54862e389', G = 'mahmoud.mmohamedsamy+wfp@gmail.com'; const R = { at: new Date().toISOString() };
const L = s => fs.appendFileSync('../ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' A4 user round: ' + s + '\n');
const orig = {}; const d = (await api('GET', '/desk/departments/' + D)).j.data; orig.visibility = d.visibility;
const hs = (await api('GET', '/desk/happiness/settings')).j.data; orig.happiness = hs; fs.writeFileSync('../a4/u1-orig.json', JSON.stringify(orig));
R.hc = (await api('PATCH', '/desk/departments/' + D, { name: d.name, display_in_help_center: true })).s; L('QA AO Dept A Display in Help Center ON (was ' + orig.visibility + ')');
const ro = ['expiry_days_min', 'expiry_days_max', 'question_max_length', 'public_page_configured', 'supervisors_max', 'closed_email_subject_max', 'closed_email_body_max', 'resend_after_hours_max', 'option_icons', 'option_label_max', 'option_text_max', 'option_image_max_bytes'];
const hb = { ...hs, is_enabled: true, department_scope_enabled: true, department_ids: [D] }; for (const k of ro) delete hb[k];
const hp = await api('PUT', '/desk/happiness/settings', hb); R.happiness = hp.s + (hp.s >= 300 ? ' ' + hp.t.slice(0, 200) : ''); L('Customer Happiness ON, scoped to QA AO Dept A only (restore from a4/u1-orig.json)');
// contact + portal invite
const c = await api('POST', `/modules/${CONTACTS}/records`, { data: [{ field: 'last_name', value: enc('QA AO WF portal') }, { field: 'email', value: enc(G) }] });
const CID = c.j?.data?.id; if (CID) track('contact', CID, 'U1'); R.contact = c.s;
R.invite = (await api('POST', `/help-centers/${HC}/invitations/contacts`, { contact_ids: [CID] })).s;
// QA email template (copy of the module/type the existing workflow Email uses)
const tl = (await api('GET', '/desk/email-templates?per_page=200')).j.data.email_templates; const base = tl.find(t => t.is_system && t.use_case === 'ticket.comment_added') || tl[0];
const tp = await api('POST', '/desk/email-templates', { name: 'QA AO WF P16 template', module: 'desk_tickets', notification_type: base.notification_type, use_case: base.use_case, subject: 'QA AO WF P16 workflow email {{ticket.number}}', body_html: '<p>QA AO WF P16 workflow email for ticket {{ticket.number}}: {{ticket.subject}}</p>' });
const TPL = tp.j?.data?.id; if (TPL) track('emailTemplate', TPL, 'P16'); R.template = tp.s + (TPL ? '' : ' ' + tp.t.slice(0, 200));
const TM = (JSON.parse(fs.readFileSync('../a4/ledger.json', 'utf8')).filter(x => x.k === 'team').pop() || {}).id;
const mark = t => [{ type: 'AddTicketComment', commentBody: 'QA AO WF ' + t + ' fired', commentPublic: false }];
const TE = (events, x) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(x || {}) } });
R.rules = {};
const add = async (t, tr, a) => { const r = await mkRule(t, tr, a); R.rules[t] = r.s + (r.err ? ' ' + r.err : ''); return r; };
await add('U1 P1', TE(['customer_reply']), mark('P1 customer reply'));
await add('U1 P5', TE(['rating'], { ratings: ['good'] }), mark('P5 good rating'));
const p5b = await mkRule('U1 P5', TE(['rating'], { ratings: ['bad'] }), mark('P5 bad rating')); R.rules['P5 bad'] = p5b.s;
const p5a = await mkRule('U1 P5', TE(['rating']), mark('P5 any rating')); R.rules['P5 any'] = p5a.s;
await add('U1 I28', { kind: 'RecordCreated' }, [{ type: 'SendHappinessEmail' }]);
await add('U1 P15', { kind: 'RecordCreated' }, [{ type: 'SendTicketReply', replyIncludeContact: true, replySubject: 'QA AO WF P15 reply sent by a workflow rule', replyBody: '<p>QA AO WF P15: this reply was sent by a workflow rule.</p>' }]);
await add('U1 P16', { kind: 'RecordCreated' }, [{ type: 'Email', emailTemplateId: TPL, emailSubject: 'QA AO WF P16 workflow email {{ticket.number}}', emailBody: '<p>QA AO WF P16 workflow email for ticket {{ticket.number}}</p>', emailRecipients: [{ kind: 'Contact', value: '' }, { kind: 'User', value: SAMY }, ...(TM ? [{ kind: 'Team', value: TM }] : [])] }]);
// tickets for the portal contact
R.tickets = {};
for (const [t, s] of [['U1 P1', 'please reply to this ticket in the Help Center portal'], ['U1 P5', 'rating ticket, please rate Good'], ['U1 I28', 'rating mail sent by a workflow rule, please rate Good'], ['U1 P15', 'Send Email Reply'], ['U1 P16', 'Email to contact, user and team']]) {
  const r = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: `${pre(t)}${s}`, status: 'Open', department: D, contact_id: CID, email: G, channel: 'email' }).map(([k, v]) => ({ field: k, value: enc(v) })) });
  const id = r.j?.data?.id; if (id) track('ticket', id, t); await sleep(3000);
  const x = id ? ((await api('GET', `/modules/${T}/records/${id}`)).j?.data?.data || []) : []; R.tickets[t] = { s: r.s, id, num: val((x.find(e => e.field === 'ticket_number') || {}).value) };
}
// P1: agent reply first so the ticket has a conversation; P5: close the ticket (department closed mail carries the rating question)
R.p1reply = (await api('POST', `/desk/tickets/${R.tickets['U1 P1'].id}/replies`, { mode: 'reply', to: [G], subject: 'QA AO WF P1: please reply in the Help Center portal', body_html: '<p>QA AO WF P1: please reply to this ticket in the Help Center portal.</p>' })).s;
R.p5close = await patchTicket(R.tickets['U1 P5'].id, { status: 'Closed' });
await sleep(20000);
R.exec = {}; for (const [t, x] of Object.entries(R.tickets)) R.exec[t] = (await execs(x.id)).map(e => e.outcome + ' ' + e.trig + ' ' + e.actions.join(','));
fs.writeFileSync('../a4/u1.json', JSON.stringify({ ...R, CID, TPL, p5b: p5b.id, p5a: p5a.id }, null, 1));
return R;
