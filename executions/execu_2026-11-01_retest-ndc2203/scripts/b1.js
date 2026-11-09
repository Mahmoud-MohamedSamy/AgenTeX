// Batch 1: one active rule per new ticket action (trigger: Create), one QA ticket each; check the ticket afterwards.
const R = {};
const defs = {
  B01a: [{ type: 'AddTicketComment', commentBody: 'QA WF B01a private comment', commentPublic: false }],
  B01b: [{ type: 'AddTicketComment', commentBody: 'QA WF B01b public comment', commentPublic: true }],
  B02: [{ type: 'SendTicketReply', replyIncludeContact: true, replySubject: 'QA WF B02 reply', replyBody: '<p>QA WF B02 automatic reply</p>' }],
  B05: [{ type: 'AddTicketFollowers', followerUserIds: [ME] }],
  B06: [{ type: 'MarkTicketSpam', spamContact: false }],
  B07: [{ type: 'ShareTicket', shareDepartmentId: HR, shareAccess: 'read_only' }],
  B11: [{ type: 'AddTicketSkills', skillKeys: ['tier_1_support'] }],
  B12: [{ type: 'RemoveTicketSkills', skillKeys: ['tier_1_support'] }],
  B13: [{ type: 'RecalculateTicketSkills' }],
  B14: [{ type: 'ReassignTicketBySkills' }],
  B15: [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { description: { kind: 'string', stringValue: 'QA WF B15 set by rule' } } }],
};
for (const [tag, acts] of Object.entries(defs)) R[tag] = { rule: await mkRule(tag, { kind: 'RecordCreated' }, acts) };
const extra = { B12: { skills: ['tier_1_support', 'tier_2_support'] }, B13: { skills: ['tier_2_support'] }, B14: { skills: ['tier_1_support'] } };
for (const tag of Object.keys(defs)) R[tag].ticket = await mkTicket(tag, extra[tag]);
return fin(R);
