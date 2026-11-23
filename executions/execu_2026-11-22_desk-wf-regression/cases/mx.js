// MX: save every trigger x action (inactive, deleted at once). Records status + message class.
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', C_ACT = 'ce1a9907-f037-4465-9148-b17c2e9fc33d', TLR = '913b2c84-f235-404d-b563-c2cfa9566b6a', CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const tagC = '7397b50e-30dd-4ebb-9abf-7e9468a7cc82';
const TR = {
  C: { kind: 'RecordCreated' }, E: { kind: 'RecordUpdated' }, CE: { kind: 'RecordCreatedOrUpdated' }, D: { kind: 'RecordDeleted' },
  FC: { kind: 'SpecificFieldChanged', fieldName: 'priority', fieldNames: ['priority'], fieldMatch: 'any', alsoOnCreate: false },
  DT: { kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: -3600, offsetMode: 'wall_clock' },
  CR: { kind: 'TicketEvent', ticketEvents: { events: ['customer_reply'] } }, AR: { kind: 'TicketEvent', ticketEvents: { events: ['agent_response'] } },
  PT: { kind: 'TicketEvent', ticketEvents: { events: ['private_thread'], privateThreads: 'any' } }, CM: { kind: 'TicketEvent', ticketEvents: { events: ['comment'], comments: 'any' } },
  HR: { kind: 'TicketEvent', ticketEvents: { events: ['rating'], ratings: [] } },
};
const AX = {
  FieldUpdate: FU({ qa_ndc_company_name: 'MX' }), OwnerAssignment: { type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 },
  AddTags: { type: 'AddTags', tagIds: [tagC], mode: 'append' }, RemoveTags: { type: 'RemoveTags', tagIds: [tagC] },
  Email: { type: 'Email', emailRecipients: [{ kind: 'user', value: TU1 }], emailSubject: 'QA WF MX', emailBody: 'x' },
  Task: { type: 'Task', taskTitle: 'QA WF MX' }, Webhook: { type: 'Webhook', url: 'https://webhook.site/00000000-0000-0000-0000-000000000000', method: 'POST', bodyTemplate: '{}', timeoutSeconds: 5 },
  CreateRecord: { type: 'CreateRecord', targetModuleId: CM, fieldMappings: { name: S('QA WF MX'), last_name: S('QA WF MX') } },
  SendHappinessEmail: { type: 'SendHappinessEmail' }, UpdateRelatedRecord: { type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: S('MX') } },
  AddTicketComment: { type: 'AddTicketComment', commentBody: 'MX', commentPublic: false }, SendTicketReply: { type: 'SendTicketReply', replyIncludeContact: true, replyTo: [], replyBody: 'MX' },
  AddTicketFollowers: { type: 'AddTicketFollowers', followerUserIds: [TU1] }, MarkTicketSpam: { type: 'MarkTicketSpam', spamContact: false },
  ShareTicket: { type: 'ShareTicket', shareDepartmentId: DEPT, shareAccess: 'read_only' }, AddTicketSkills: { type: 'AddTicketSkills', skillKeys: ['QA WF skill'] },
  RemoveTicketSkills: { type: 'RemoveTicketSkills', skillKeys: ['QA WF skill'] }, RecalculateTicketSkills: { type: 'RecalculateTicketSkills' }, ReassignTicketBySkills: { type: 'ReassignTicketBySkills' },
  ChangeTicketLayout: { type: 'ChangeTicketLayout', ticketLayoutId: TLR }, SendSlackNotification: { type: 'SendSlackNotification', slackConnectionId: '00000000-0000-0000-0000-000000000000', slackChannelIds: ['C0'], notificationHeader: 'h', notificationBody: 'b' },
  SendTeamsNotification: { type: 'SendTeamsNotification', notificationHeader: 'h', notificationBody: 'b' }, SendGoogleChatNotification: { type: 'SendGoogleChatNotification', notificationHeader: 'h', notificationBody: 'b' },
  ReplyViaIm: { type: 'ReplyViaIm', imText: 'x' }, NotifyViaIm: { type: 'NotifyViaIm', imText: 'x' }, RunCustomAction: { type: 'RunCustomAction', customActionId: C_ACT, customActionInputs: { ref: 'x', note: 'y' } },
  CreateMeeting: { type: 'CreateMeeting', activitySubject: 'x', meetingVenue: 'x', activityStartOffsetMinutes: 0, activityDurationMinutes: 60 }, SendPortalAccess: { type: 'SendPortalAccess', portalId: '00000000-0000-0000-0000-000000000000', resend: false },
};
const grid = {}; let i = 0;
for (const [tk, trig] of Object.entries(TR)) {
  grid[tk] = {};
  for (const [ak, a] of Object.entries(AX)) {
    const r = await api('POST', '/workflow/rules', { moduleId: T, name: `QA WF MX ${tk} ${ak}`, isActive: false, mode: 'Recurring', trigger: trig, criteria: guard('QA WF MX '), actions: [{ order: 0, delaySeconds: 0, ...a }], departmentIds: [DEPT2] });
    const id = r.j?.data?.id; if (id) await api('DELETE', '/workflow/rules/' + id);
    const msg = r.s < 300 ? '' : ((r.j?.error?.details || []).map(d => d.issue || d.message).join('; ') || r.j?.error?.message || r.t).slice(0, 150);
    grid[tk][ak] = r.s + (msg ? ' ' + msg : ''); i++;
  }
}
fs.writeFileSync(RUN + '/out/mx.json', JSON.stringify(grid, null, 1));
const sum = {}; for (const [tk, row] of Object.entries(grid)) sum[tk] = Object.entries(row).filter(([, v]) => !v.startsWith('201')).map(([a, v]) => a + '=' + v.slice(0, 3)).join(' ');
return { cells: i, nonSaved: sum };
