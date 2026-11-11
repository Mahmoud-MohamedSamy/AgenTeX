// A4 Group P batch 1: one active Create rule per new action, one QA ticket each; read the ticket and Execution History after.
const R = {};
const teams = arr2((await api('GET', '/desk/teams?department_id=' + D)).j?.data).filter(t => (t.department_id || t.departmentId) === D);
R.teams = teams.map(t => t.name);
const defs = {
  P14a: [{ type: 'AddTicketComment', commentBody: 'QA AO WF P14a private comment', commentPublic: false }],
  P14b: [{ type: 'AddTicketComment', commentBody: 'QA AO WF P14b public comment', commentPublic: true }],
  P18: [{ type: 'AddTicketFollowers', followerUserIds: [SAMY] }],
  P19: [{ type: 'MarkTicketSpam', spamContact: false }],
  P20: [{ type: 'ShareTicket', shareDepartmentId: D2, shareAccess: 'read_only' }],
  P23a: [{ type: 'AddTicketSkills', skillKeys: ['tier_1_support'] }],
  P23b: [{ type: 'RemoveTicketSkills', skillKeys: ['tier_1_support'] }],
  P23c: [{ type: 'RecalculateTicketSkills' }],
  P24: [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { description: { kind: 'string', stringValue: 'QA AO WF P24 set by rule' } } }],
};
if (teams[0]) defs.P17c = [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: teams[0].id }];
for (const [tag, acts] of Object.entries(defs)) R[tag] = { rule: await mkRule(tag, { kind: 'RecordCreated' }, acts) };
if (teams[0]) R.P17e = { rule: await mkRule('P17e', { kind: 'RecordUpdated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: teams[0].id }]) };
const extra = { P23b: { skills: ['tier_1_support', 'tier_2_support'] }, P23c: { skills: ['tier_2_support'] } };
for (const tag of Object.keys(R).filter(k => /^P/.test(k))) R[tag].ticket = await mkTicket(tag, extra[tag]);
if (R.P17e?.ticket?.id) { await sleep(5000); R.P17e.patch = await patchTicket(R.P17e.ticket.id, { priority: 'High' }); }
await sleep(20000);
for (const tag of Object.keys(R).filter(k => /^P/.test(k))) {
  const id = R[tag].ticket?.id; if (!id) continue;
  const t = await getTicket(id); const tk = (await api('GET', '/desk/tickets/' + id)).j?.data || {};
  const cm = arr2((await api('GET', '/desk/tickets/' + id + '/comments')).j?.data);
  R[tag].seen = { owner: t.owner || tk.owner_id || null, team: t.team || tk.team_id || null, spam: tk.is_spam ?? t.is_spam, shared: tk.shared_departments || tk.shares || t.shared_departments, skills: t.skills || tk.skills, followers: tk.followers || tk.follower_ids, comments: cm.map(c => (c.is_public ?? c.public) + ':' + String(c.content || c.body || '').replace(/<[^>]+>/g, '').slice(0, 40)), contact: t.contact_id };
  R[tag].exec = await execs(id);
}
if (R.P24?.seen?.contact) { const c = (await api('GET', `/modules/${CONTACTS}/records/${R.P24.seen.contact}`)).j?.data?.data || []; R.P24.contactDescription = val((c.find(x => x.field === 'description') || {}).value); }
fs.writeFileSync('../a4/p1.json', JSON.stringify(R, null, 1));
return R;
