// Round 7 batch 2: Desk email template without subject/body (rule + saved action), B15 with Contacts title, D1 ticket lookup.
const R = {}; const TEAM = '1adfefb7-0c25-4484-ae92-782964695054';
const t = await api('POST', '/desk/email-templates', { name: 'QA WF D2 template', subject: 'QA WF D2 alert {{ticket.subject}}', body_html: '<p>QA WF D2 alert for ticket {{ticket.number}}</p>', module: 'desk_tickets', notification_type: 'contact' });
const TPL = t.j?.data?.id || t.j?.data?.email_template?.id; R.tpl = t.s + ' ' + (TPL || t.t.slice(0, 300)); if (TPL) track('emailTemplate', TPL, 'D2');
R.D2t = { rule: await mkRule('D2t', { kind: 'RecordCreated' }, [{ type: 'Email', emailTemplateId: TPL, emailRecipients: [{ kind: 'Contact', value: '' }, { kind: 'User', value: ME }] }]) };
if (R.D2t.rule.id) R.D2t.saved = (await api('GET', `/workflow/rules/${R.D2t.rule.id}`)).j?.data?.actions?.map(a => ({ tpl: a.emailTemplateId, subj: a.emailSubject, body: a.emailBody }));
for (const [k, v] of [['Team', TEAM], ['Role', 'manager']]) { const r = await mkRule('D2' + k, { kind: 'RecordCreated' }, [{ type: 'Email', emailTemplateId: TPL, emailRecipients: [{ kind: k, value: v }] }]); R['D2' + k] = r.s + (r.err ? ' ' + r.err : ''); }
const sa = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA WF F1t saved email', type: 'Email', isActive: true, action: { type: 'Email', order: 0, emailTemplateId: TPL, emailRecipients: [{ kind: 'Contact', value: '' }] } });
R.savedTemplate = sa.s + ' ' + (sa.j?.data?.id || sa.t.slice(0, 300)); if (sa.j?.data?.id) track('savedAction', sa.j.data.id, 'F1t');
if (sa.j?.data?.id) R.F1t = { rule: await mkRule('F1t', { kind: 'RecordCreated' }, [{ type: 'StandaloneAction', standaloneActionId: sa.j.data.id }]) };
R.B15 = { rule: await mkRule('B15', { kind: 'RecordCreated' }, [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: { kind: 'string', stringValue: 'QA WF B15 set by rule' } } }]) };
for (const tag of ['D2t', 'B15', ...(R.F1t ? ['F1t'] : [])]) R[tag].ticket = await mkTicket(tag);
// D1 ticket from batch 1 (create answered 403)
const list = await api('POST', `/modules/${T}/records/search`, { filters: [{ field: 'subject', operator: 'StartsWith', value: { kind: 'string', value: 'QA WF D1 ' } }] });
R.D1search = list.s + ' ' + JSON.stringify(arr(list.j?.data).map(x => x.id)).slice(0, 300);
return fin(R);
