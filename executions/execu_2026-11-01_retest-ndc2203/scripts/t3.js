// NDC-2203 retest 1 Nov — regression of the 27 Oct fixes + staging set-up for the not-testable items.
const out = {}; const due = d => new Date(Date.now() + d * 864e5).toISOString();
const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
// A4: Private Thread direction saved and read back
out.A4 = {};
for (const d of ['incoming', 'outgoing', 'any']) { const r = await mkRule('R4' + d, { kind: 'TicketEvent', ticketEvents: { events: ['private_thread'], privateThreads: d } }, cmt('R4' + d));
  out.A4[d] = r.s + (r.id ? ' stored ' + (await api('GET', '/workflow/rules/' + r.id)).j?.data?.trigger?.ticketEvents?.privateThreads : ' ' + (r.err || '')); }
// Is Overdue in Create rules, both directions
const odT = await mkRule('RodT', { kind: 'RecordCreated' }, cmt('RodT'), { criteria: and(guard('QA WF RodT '), C('isOverdue', 'Equal', { kind: 'bool', boolValue: true })) });
const odF = await mkRule('RodF', { kind: 'RecordCreated' }, cmt('RodF'), { criteria: and(guard('QA WF RodF '), C('isOverdue', 'Equal', { kind: 'bool', boolValue: false })) });
const tk = {}; for (const [tag, d] of [['RodT', -1], ['RodT', 5], ['RodF', -1], ['RodF', 5]]) tk[tag + (d < 0 ? ' due yesterday' : ' due +5d')] = (await mkTicket(tag, { due_date: due(d) })).id;
// Email action with a Desk template, no subject / body
const t = await api('POST', '/desk/email-templates', { name: 'QA WF R7 template ' + String(Date.now()).slice(-4), subject: 'QA WF R7 template {{ticket.subject}}', body_html: '<p>QA WF R7 template for ticket {{ticket.number}}</p>', module: 'desk_tickets', notification_type: 'contact' });
const TPL = t.j?.data?.id || t.j?.data?.email_template?.id; if (TPL) track('emailTemplate', TPL, 'R7');
const em = await mkRule('R7tpl', { kind: 'RecordCreated' }, [{ type: 'Email', emailTemplateId: TPL, emailRecipients: [{ kind: 'Contact', value: '' }, { kind: 'User', value: ME }] }]);
out.emailTemplate = { template: t.s, rule: em.s + (em.err ? ' ' + em.err : '') };
const noTpl = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF R7neg', isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: guard('QA WF R7neg '), actions: [{ order: 0, type: 'Email', emailRecipients: [{ kind: 'User', value: ME }] }] });
out.emailTemplate.withoutTemplateOrBody = noTpl.s; if (noTpl.j?.data?.id) track('rule', noTpl.j.data.id, 'R7neg');
const et = (await mkTicket('R7tpl')).id;
await sleep(45000);
out.isOverdue = {}; for (const [k, id] of Object.entries(tk)) { const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data); out.isOverdue[k] = h.some(a => a.action === 'comment.added' && a.summary?.by_rule_name) ? 'fired' : 'not fired'; }
out.emailTemplate.run = arr((await api('GET', `/workflow/executions?recordId=${et}`)).j?.data).map(e => e.outcome + ' ' + JSON.stringify((e.dispatches || []).map(d => d.actionType + ':' + d.status + ' ' + String(d.responseBodyTruncated || d.errorMessage || '').slice(0, 120))));
// set-up for B13 / B14: skills with criteria?
const sk = arr((await api('GET', '/desk/skills')).j?.data); out.skills = { total: sk.length, withCriteria: sk.filter(x => x.criteria || x.rules?.length || x.conditions?.length).length };
return fin(out);
