const o = {}; const S_ = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const bpdef = { name: 'QA PA Refund N', description: 'QA PA NDC-2871 not-run cases - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: ST.D1, entryCriteria: { op: 'contains', field: 'subject', value: 'QA PA bpN ' },
  states: [S_('Open'), S_('Escalated', { position: { x: 300, y: 0 } }), S_('Closed', { isTerminal: true, position: { x: 600, y: 0 } })],
  transitions: [{ id: 't_fin', name: 'Send to Finance', fromStateId: 'Open', toStateId: 'Escalated', before: {}, during: { deskItems: [{ kind: 'approval', mandatory: true, approverUserIds: [U.B] }], itemOrder: ['desk:approval'] }, after: { actions: [] } },
    { id: 't_close', name: 'Close', fromStateId: 'Escalated', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] };
const bp = await api.O('POST', `/modules/${T}/blueprints`, { definition: bpdef, isActive: true }); ST.N.bp = bp.j?.data?.id; o.bp = E(bp); if (ST.N.bp) ledger('blueprint QA PA Refund N ' + ST.N.bp);
const t3 = (await mkTicket('A', 'QA PA bpN 2')).id; ST.N.t3 = t3; await sleep(5000);
const run = await api.A('POST', `/desk/tickets/${t3}/blueprint-transitions/t_fin`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, approval: { subject: 'QA PA N blueprint approval', description: 'QA PA keyboard', approver_user_ids: [U.B] } });
o.run = E(run); ST.N.a3 = run.j?.data?.approval_id; await sleep(3000);
const w = (await inbox('B', { list: 'waiting', page_size: 100 })).d; o.waiting = (w?.approvals || []).map(x => x.source + ':' + (x.approval?.subject || x.submission?.subject));
ST.N.a2 = (w?.approvals || []).find(x => x.source === 'web_form')?.id; saveState(); return o;
