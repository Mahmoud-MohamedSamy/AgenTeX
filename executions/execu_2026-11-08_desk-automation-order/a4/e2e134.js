const CEO = '7972984b-b5cc-034a-bd96-6de61e3937d0'; const S = { made: { tags: [], tpl: [], actions: [] } }; const OUT = '../a4/e2e134.json'; const save = () => fs.writeFileSync(OUT, JSON.stringify(S, null, 1));
const NM = { '876ce871-2b02-4854-89a7-68050391c62b': 'Test User 1', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4': 'Dev Team 2', [SAMY]: 'Mahmoud Samy', [OWNER]: 'owner' };
const C = (f, v) => ({ kind: 'Comparison', field: f, operator: 'Equal', negate: false, value: { kind: 'string', stringValue: v } });
const disp = async (id, rid) => arr2((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).filter(e => e.ruleId === rid).map(e => ({ outcome: e.outcome, err: e.errorMessage, d: (e.dispatches || []).map(d => (d.actionType || d.type) + ':' + d.status + (d.lastError ? ' ' + String(d.lastError).slice(0, 100) : '')) }));
const tags = async id => arr2((await api('GET', `/desk/tickets/${id}/tags`)).j?.data).map(t => t.name || t.tag_name || t.label);
const mkTag = async n => { const r = await api('POST', '/desk/tags', { name: n, department_id: D }); const id = r.j?.data?.id; if (id) S.made.tags.push(id); return { s: r.s, id, err: r.s >= 300 ? r.t.slice(0, 200) : undefined }; };
const TL = arr2((await api('GET', '/desk/email-templates?take=200')).j?.data); const wfT = TL.find(t => /workflow|custom|general/i.test(t.use_case || '')) || TL.find(t => t.notification_type === 'agent');
const tp = await api('POST', '/desk/email-templates', { name: 'QA AO WF E2E tpl', module: 'desk_tickets', notification_type: 'agent', use_case: wfT ? wfT.use_case : 'workflow.custom', subject: 'QA AO WF E2E {{ticket.subject}}', body_html: '<p>QA AO WF E2E version ONE</p>' });
const TPL = tp.j?.data?.id; if (TPL) S.made.tpl.push(TPL); S.tpl = tp.s + (TPL ? '' : ' ' + tp.t.slice(0, 200)); save();
// ---------- E2E-1
const tagU = await mkTag('QA WF urgent'); S.tagUrgent = tagU;
const r1 = await mkRule('E2E1', { kind: 'RecordCreated' }, [
  { type: 'OwnerAssignment', ownerTargetKind: 'RoleRoundRobin', ownerValue: CEO },
  { type: 'AddTags', tagIds: [tagU.id], mode: 'append' },
  { type: 'Task', taskTitle: 'QA AO WF E2E1 Call customer', taskDueOffsetDays: 1, taskStatus: 'Not Started', taskPriority: 'Normal' },
  { type: 'Email', emailRecipients: [{ kind: 'userfield', value: 'owner' }], emailTemplateId: TPL, emailSubject: 'x', emailBody: 'x' }], { criteria: C('priority', 'urgent') });
S.e1 = { rule: r1.id, rs: r1.s + (r1.err || '') }; save();
const t1a = await mkTicket('E2E1', { priority: 'urgent' }, 'urgent A'); await sleep(3000); const t1b = await mkTicket('E2E1', { priority: 'urgent' }, 'urgent B'); const t1c = await mkTicket('E2E1', { priority: 'low' }, 'not urgent');
await sleep(20000);
S.e1.tickets = []; for (const t of [t1a, t1b, t1c]) { const g = await getTicket(t.id); S.e1.tickets.push({ subj: g.subject, prio: g.priority, owner: NM[g.owner] || g.owner, tags: await tags(t.id), exec: await disp(t.id, r1.id) }); }
S.e1.ids = [t1a.id, t1b.id, t1c.id]; save();
// ---------- E2E-3 saved Email action in 2 rules, edit template once
const sa = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA AO WF E2E3 saved email', description: null, isActive: true, action: { type: 'Email', order: 0, delaySeconds: 0, emailRecipients: [{ kind: 'user', value: SAMY }], emailTemplateId: TPL, emailSubject: 'x', emailBody: 'x' } });
const aid = sa.j?.data?.id; if (aid) S.made.actions.push(aid);
const r3a = await mkRule('E2E3a', { kind: 'RecordCreated' }, [{ type: 'Email', standaloneActionId: aid }]); const r3b = await mkRule('E2E3b', { kind: 'RecordCreated' }, [{ type: 'Email', standaloneActionId: aid }]);
const use = await api('GET', '/workflow/actions/' + aid + '/usage');
S.e3 = { saved: sa.s + (aid ? '' : ' ' + sa.t.slice(0, 200)), rules: [r3a.s + (r3a.err || ''), r3b.s + (r3b.err || '')], usage: use.s + ' ' + JSON.stringify(use.j?.data).slice(0, 300) };
const listA = arr2((await api('GET', '/workflow/actions?take=200')).j?.data).find(a => a.id === aid); S.e3.usedByInList = listA && (listA.usedBy ?? listA.usageCount ?? listA.used_by ?? listA.ruleCount);
const tg = (await api('GET', '/desk/email-templates/' + TPL)).j?.data; const ed = await api('PUT', '/desk/email-templates/' + TPL, { ...tg, body_html: '<p>QA AO WF E2E version TWO</p>' });
S.e3.editTemplate = ed.s + (ed.s >= 300 ? ' ' + ed.t.slice(0, 200) : ''); S.e3.tplNow = ((await api('GET', '/desk/email-templates/' + TPL)).j?.data?.body_html || '').slice(0, 60);
const t3a = await mkTicket('E2E3a'); const t3b = await mkTicket('E2E3b'); await sleep(20000);
S.e3.execA = await disp(t3a.id, r3a.id); S.e3.execB = await disp(t3b.id, r3b.id);
S.e3.rawDispatch = JSON.stringify(arr2((await api('GET', `/workflow/executions?recordId=${t3a.id}`)).j?.data).find(e => e.ruleId === r3a.id)?.dispatches || []).replace(/[\w.+-]+@[\w.-]+/g, '<e>').slice(0, 800);
S.e3.ids = [t3a.id, t3b.id]; S.e3.rulesIds = [r3a.id, r3b.id]; save();
// ---------- E2E-4 field watch
const tagS = await mkTag('QA WF status changed'); S.tagStatus = tagS;
const r4 = await mkRule('E2E4', { kind: 'SpecificFieldChanged', fieldName: 'status' }, [{ type: 'AddTags', tagIds: [tagS.id], mode: 'append' }]);
const t4 = await mkTicket('E2E4'); await sleep(10000); S.e4 = { rule: r4.id, rs: r4.s + (r4.err || ''), id: t4.id, afterCreate: await tags(t4.id) };
await patchTicket(t4.id, { priority: 'low', description: 'QA edit other fields' }); await sleep(10000); S.e4.afterOtherFields = await tags(t4.id);
await patchTicket(t4.id, { status: 'On Hold' }); await sleep(12000); S.e4.afterStatus = await tags(t4.id); S.e4.exec = await disp(t4.id, r4.id);
save(); log(JSON.stringify(S, null, 1).slice(0, 6000));
