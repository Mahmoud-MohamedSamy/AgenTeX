// NDC-2203 retest 1 Nov — fix 2: "Workflow rule ran" history row for Create rules on rule facts (Is Overdue, Execution Time, …).
// Each rule: same private-comment action; only the condition differs. Plus Is Overdue + assign-to-team (the side effect the developer fixed).
const out = {}; const TEAM = '1adfefb7-0c25-4484-ae92-782964695054'; const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
const S = (field, op, v) => ({ kind: 'StringMatch', field, operator: op, stringValue: v, caseInsensitive: false });
const due = d => new Date(Date.now() + d * 864e5).toISOString();
const defs = {
  X1od: C('isOverdue', 'Equal', { kind: 'bool', boolValue: true }),
  X2bh: C('executionTime', 'Equal', { kind: 'string', stringValue: 'business_hours' }),
  X3obh: C('executionTime', 'Equal', { kind: 'string', stringValue: 'outside_business_hours' }),
  X4recent: { kind: 'Logical', operator: 'Not', operands: [S('recentComment', 'Contains', 'zzzQA')] },
  X5threads: C('threadCount', 'GreaterThanOrEqual', { kind: 'number', numberValue: 0 }),
  X6comments: C('commentCount', 'GreaterThanOrEqual', { kind: 'number', numberValue: 0 }),
  X7mixed: and(S('description', 'Contains', 'QAV2'), C('isOverdue', 'Equal', { kind: 'bool', boolValue: true })),
  X8status: S('status', 'Equal', 'Open'),
};
for (const [tag, c] of Object.entries(defs)) out[tag] = { rule: (await mkRule(tag, { kind: 'RecordCreated' }, cmt(tag), { criteria: and(guard(`QA WF ${tag} `), c) })).s };
// side effect: Is Overdue + Assign to team (+ comment so the run is visible)
out.X9odTeam = { rule: (await mkRule('X9odTeam', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: TEAM }], { criteria: and(guard('QA WF X9odTeam '), C('isOverdue', 'Equal', { kind: 'bool', boolValue: true })) })).s };
for (const tag of Object.keys(out)) out[tag].ticket = (await mkTicket(tag, { description: 'QAV2 text', due_date: due(-1) })).id;
await sleep(50000);
for (const tag of Object.keys(out)) { const id = out[tag].ticket; const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data);
  out[tag].commented = h.filter(a => a.action === 'comment.added' && a.summary?.by_rule_name).length;
  out[tag].ranRows = h.filter(a => a.action === 'ticket.workflow_rule_ran').length;
  out[tag].exec = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => e.outcome).join(',');
  if (tag === 'X9odTeam') { const t = await getTicket(id).catch(() => ({})); const g = (await api('GET', `/modules/${T}/records/${id}`)).s; out[tag].adminRead = g; out[tag].team = t.team ? String(t.team).slice(0, 8) : null; }
  out[tag].n = (await getTicket(id).catch(() => ({}))).ticket_number; }
return fin(out);
