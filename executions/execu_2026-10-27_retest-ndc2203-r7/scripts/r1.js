// Round 7 batch 1: every ticket action (Create rule) + D1 team on Create + Is Overdue on Create + email template without subject/body.
const R = {}; const TEAM = '1adfefb7-0c25-4484-ae92-782964695054';
const due = d => new Date(Date.now() + d * 864e5).toISOString();
const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const lays = arr((await api('GET', `/modules/${T}/layouts`)).j?.data); const std = lays.find(l => l.name === 'Standard');
let qa = lays.find(l => l.name === 'QA WF Layout'); if (!qa) { const r = await api('POST', `/modules/${T}/layouts`, { name: 'QA WF Layout', views: std.views, assignedProfiles: [], status: 'active' }); qa = r.j?.data; if (qa?.id) track('layout', qa.id, 'B08'); }
const defs = {
  B01a: [{ type: 'AddTicketComment', commentBody: 'QA WF B01a private comment', commentPublic: false }],
  B01b: [{ type: 'AddTicketComment', commentBody: 'QA WF B01b public comment', commentPublic: true }],
  B02: [{ type: 'SendTicketReply', replyIncludeContact: true, replySubject: 'QA WF B02 reply', replyBody: '<p>QA WF B02 automatic reply</p>' }],
  B05: [{ type: 'AddTicketFollowers', followerUserIds: [ME] }],
  B06: [{ type: 'MarkTicketSpam', spamContact: false }],
  B07: [{ type: 'ShareTicket', shareDepartmentId: HR, shareAccess: 'read_only' }],
  B08: [{ type: 'ChangeTicketLayout', ticketLayoutId: qa?.id }],
  B11: [{ type: 'AddTicketSkills', skillKeys: ['tier_1_support'] }],
  B12: [{ type: 'RemoveTicketSkills', skillKeys: ['tier_1_support'] }],
  B13: [{ type: 'RecalculateTicketSkills' }],
  B14: [{ type: 'ReassignTicketBySkills' }],
  B15: [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { description: { kind: 'string', stringValue: 'QA WF B15 set by rule' } } }],
  D1: [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: TEAM }],
  D2: [{ type: 'Email', emailTemplateId: 'system.ticket.acknowledgement', emailRecipients: [{ kind: 'Contact', value: '' }, { kind: 'User', value: ME }], emailSubject: 'QA WF D2 alert', emailBody: '<p>QA WF D2 alert body</p>' }],
  D2t: [{ type: 'Email', emailTemplateId: 'system.ticket.acknowledgement', emailRecipients: [{ kind: 'Contact', value: '' }, { kind: 'User', value: ME }] }],
};
for (const [tag, acts] of Object.entries(defs)) R[tag] = { rule: await mkRule(tag, { kind: 'RecordCreated' }, acts) };
// negative: email without a template and without subject/body must still be refused
R.D2neg = (await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF D2neg', isActive: true, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: guard('QA WF D2neg '), actions: [{ order: 0, type: 'Email', emailRecipients: [{ kind: 'User', value: ME }] }] }));
if (R.D2neg.j?.data?.id) track('rule', R.D2neg.j.data.id, 'D2neg'); R.D2neg = R.D2neg.s + ' ' + (R.D2neg.j?.error ? JSON.stringify(R.D2neg.j.error).slice(0, 300) : '');
// Saved action with a Desk email template and no subject/body
const sa = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA WF F1t saved email', type: 'Email', isActive: true, action: { type: 'Email', order: 0, emailTemplateId: 'system.ticket.acknowledgement', emailRecipients: [{ kind: 'User', value: ME }] } });
R.savedTemplate = sa.s + ' ' + (sa.j?.data?.id || sa.t.slice(0, 300)); if (sa.j?.data?.id) track('savedAction', sa.j.data.id, 'F1t');
for (const [tag, c] of [['E3odT', true], ['E3odF', false]]) R[tag] = { rule: await mkRule(tag, { kind: 'RecordCreated' }, cmt(tag), { criteria: and(guard(`QA WF ${tag} `), { kind: 'Comparison', field: 'isOverdue', operator: 'Equal', negate: false, value: { kind: 'bool', boolValue: c } }) }) };
const extra = { B12: { skills: ['tier_1_support', 'tier_2_support'] }, B13: { skills: ['tier_2_support'] }, B14: { skills: ['tier_1_support'] } };
for (const tag of Object.keys(defs)) R[tag].ticket = await mkTicket(tag, extra[tag]);
for (const tag of ['E3odT', 'E3odF']) { R[tag].past = await mkTicket(tag, { due_date: due(-1) }); R[tag].future = await mkTicket(tag, { due_date: due(5) }); }
R.qaLayout = qa?.id;
return fin(R);
