// E2E-1 rerun with Test User 1 online (CEO role: Test User 1 + Dev Team 2; Dev Team 2 offline). Valid workflow email template.
await sleep(45000);
const CEO = '7972984b-b5cc-034a-bd96-6de61e3937d0'; const S = JSON.parse(fs.readFileSync('../a4/e2e134.json'));
const NM = { '876ce871-2b02-4854-89a7-68050391c62b': 'Test User 1', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4': 'Dev Team 2', [SAMY]: 'Mahmoud Samy', [OWNER]: 'owner' };
const q = arr((await api('GET', '/desk/queues/agents')).j?.data?.agents || (await api('GET', '/desk/queues/agents')).j?.data); S.e1b = { online: q.filter(x => x.presence?.online).map(x => NM[x.user_id] || x.user_id.slice(0, 6)) };
const j = (await api('GET', '/desk/email-templates?take=200')).j?.data; const TL = j?.email_templates || [];
S.e1b.types = [...new Set(TL.map(x => x.notification_type + '/' + x.use_case))];
const ag = TL.find(t => t.notification_type === 'agent' && !t.is_system) || TL.find(t => t.notification_type === 'agent');
const tp = await api('POST', '/desk/email-templates', { name: 'QA AO WF E2E tpl', module: 'desk_tickets', notification_type: 'agent', use_case: ag ? ag.use_case : null, subject: 'QA AO WF E2E {{ticket.subject}}', body_html: '<p>QA AO WF E2E version ONE</p>' });
const TPL = tp.j?.data?.id; if (TPL) S.made.tpl.push(TPL); S.e1b.tpl = tp.s + (TPL ? '' : ' ' + tp.t.slice(0, 200)); fs.writeFileSync('../a4/e2e134.json', JSON.stringify(S, null, 1));
const tags = async id => ((await api('GET', `/desk/tickets/${id}/tags`)).j?.data?.tags || []).map(t => t.name);
const rid = S.e1.rule;
const cur = (await api('GET', '/workflow/rules/' + rid)).j?.data; const acts = cur.actions.map(a => a.type === 'Email' ? { ...a, emailTemplateId: TPL } : a);
const up = await api('PATCH', '/workflow/rules/' + rid, { actions: acts }); S.e1b.patchRule = up.s + (up.s >= 300 ? ' ' + up.t.slice(0, 200) : '');
const ids = []; for (const s of ['urgent C', 'urgent D']) { const t = await mkTicket('E2E1', { priority: 'urgent' }, s); ids.push(t.id); await sleep(4000); }
await sleep(20000);
S.e1b.tickets = []; for (const id of ids) { const g = await getTicket(id); const ex = arr2((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).filter(e => e.ruleId === rid);
  const tasks = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data).filter(a => /task/i.test(a.action)).map(a => a.action);
  S.e1b.tickets.push({ subj: g.subject, owner: NM[g.owner] || g.owner, tags: await tags(id), execRows: ex.length, d: ex.flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status + ' ' + (d.target || '').slice(0, 45))), taskActivity: tasks }); }
S.e1b.ids = ids; fs.writeFileSync('../a4/e2e134.json', JSON.stringify(S, null, 1)); log(JSON.stringify(S.e1b, null, 1));
