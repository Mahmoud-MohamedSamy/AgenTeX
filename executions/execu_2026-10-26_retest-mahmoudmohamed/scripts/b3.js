// Batch 3: team assignment, email with template, update related record, change layout (onto a new QA layout).
const R = {}; const TEAM = '1adfefb7-0c25-4484-ae92-782964695054';
// QA layout = copy of Standard's views, no profiles
const lays = arr((await api('GET', `/modules/${T}/layouts`)).j?.data); const std = lays.find(l => l.name === 'Standard');
let qa = lays.find(l => l.name === 'QA WF Layout');
if (!qa) { const r = await api('POST', `/modules/${T}/layouts`, { name: 'QA WF Layout', views: std.views, assignedProfiles: [], status: 'active' }); qa = r.j?.data; R.layout = r.s + ' ' + (qa?.id || r.t.slice(0, 200)); if (qa?.id) track('layout', qa.id, 'B08'); }
R.D1 = { rule: await mkRule('D1', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: TEAM }]) };
R.D2 = { rule: await mkRule('D2', { kind: 'RecordCreated' }, [{ type: 'Email', emailTemplateId: 'system.ticket.acknowledgement', emailRecipients: [{ kind: 'Contact', value: '' }, { kind: 'User', value: ME }], emailSubject: 'QA WF D2 alert', emailBody: '<p>QA WF D2 alert body</p>' }]) };
R.B15 = { rule: await mkRule('B15', { kind: 'RecordCreated' }, [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: { kind: 'string', stringValue: 'QA WF B15 set by rule' } } }]) };
if (qa?.id) R.B08 = { rule: await mkRule('B08', { kind: 'RecordCreated' }, [{ type: 'ChangeTicketLayout', ticketLayoutId: qa.id }]), qaLayout: qa.id, std: std.id };
R.D1.t1 = await mkTicket('D1'); R.D1.t2 = await mkTicket('D1');
R.D2.ticket = await mkTicket('D2'); R.B15.ticket = await mkTicket('B15'); if (R.B08) R.B08.ticket = await mkTicket('B08');
return fin(R);
