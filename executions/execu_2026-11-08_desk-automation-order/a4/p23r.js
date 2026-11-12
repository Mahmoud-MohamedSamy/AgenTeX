// P23 reassign by skills with Test User 1 (has QA AS6 sk1 in D2) signed in.
await sleep(45000);
const rule = await mkRule('P23r', { kind: 'RecordCreated' }, [{ type: 'ReassignTicketBySkills' }], { departmentIds: [D2] });
const t = await mkTicket('P23r', { department: D2, skills: ['QA AS6 sk1'] }); await sleep(25000);
const ex = arr2((await api('GET', '/workflow/executions?recordId=' + t.id)).j?.data).filter(e => e.ruleId === rule.id).map(e => e.outcome + ' ' + (e.dispatches || []).map(d => d.actionType + ':' + d.status + ' ' + String(d.responseBodyTruncated || d.lastError || '').slice(0, 160)).join('|'));
const g = await getTicket(t.id);
log({ rule: rule.s + (rule.err || ''), ex, owner: g.owner, ownerIsTestUser1: g.owner === A1, skills: g.skills });
