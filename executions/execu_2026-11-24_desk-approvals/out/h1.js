const o = {};
const P = (id, pass, note) => { result(id, pass === null ? 'INCONCLUSIVE' : pass ? 'PASS' : 'FAIL', note); o[id] = (pass === null ? 'INC ' : pass ? 'PASS ' : 'FAIL ') + note; };
const S_ = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const TR = (id, name, a, b, o2 = {}) => ({ id, name, fromStateId: a, toStateId: b, before: o2.before || {}, during: o2.during || {}, after: { actions: o2.after || [] } });
const appr = (users, teams) => ({ deskItems: [{ kind: 'approval', mandatory: true, approverUserIds: users || [], ...(teams ? { approverTeamIds: teams } : {}) }], itemOrder: ['desk:approval'] });
if (!ST.BP) {
  const def = { name: 'QA PA Refund', description: 'QA PA NDC-2871 retest - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: ST.D1, entryCriteria: { op: 'contains', field: 'subject', value: 'QA PA bp ' },
    states: [S_('Open', { position: { x: 0, y: 0 } }), S_('On Hold', { position: { x: 300, y: 0 } }), S_('Escalated', { position: { x: 600, y: 0 } }), S_('Closed', { isTerminal: true, position: { x: 900, y: 0 } })],
    transitions: [TR('t_val', 'Validate', 'Open', 'On Hold'),
      TR('t_fin', 'Send to Finance', 'On Hold', 'Escalated', { during: appr([U.B]), after: [{ kind: 'setField', field: 'description', value: 'QA PA after-action ran' }] }),
      TR('t_team', 'Team review', 'Open', 'Escalated', { during: appr([], [ST.TEAM]) }),
      TR('t_close', 'Close', 'Escalated', 'Closed')] };
  const r = await api.O('POST', `/modules/${T}/blueprints`, { definition: def, isActive: true }); o.bp = E(r); ST.BP = r.j?.data?.id; if (ST.BP) ledger('blueprint QA PA Refund ' + ST.BP); saveState();
  if (!ST.BP) return o;
}
const bpState = async (t, who = 'A') => (await api[who]('GET', `/modules/${T}/records/${t}/blueprint-state`)).j?.data;
const trans = async (t, who = 'A') => arr((await api[who]('GET', `/modules/${T}/records/${t}/blueprint-transitions`)).j?.data);
const APP = (u, tm) => ({ approval: { subject: 'QA PA bp approval', description: 'QA PA refund check', approver_user_ids: u || [], ...(tm ? { approver_team_ids: tm } : {}) } });
const run = (who, t, tid, from, extra = {}) => api[who]('POST', `/desk/tickets/${t}/blueprint-transitions/${tid}`, { run_id: crypto.randomUUID(), expected_state_id: from, fields: {}, ...extra });
const mk = async n => { const r = await mkTicket('A', 'QA PA bp ' + n); return r.id; };
const tks = {}; for (const n of ['1', '2', '3', '4', '5', '6']) tks[n] = ST.tickets['QA PA bp ' + n] || await mk(n);
await sleep(4000);
o.state1 = String(JSON.stringify(await bpState(tks['1']))).slice(0, 500);
o.trans1 = JSON.stringify((await trans(tks['1'])).map(x => x.transitionId || x.id || x.name));
// move 1..5 to On Hold, then Send to Finance
const runs = {};
for (const n of ['1', '2', '4', '5']) { runs['val' + n] = E(await run('A', tks[n], 't_val', 'Open')); runs['fin' + n] = (await run('A', tks[n], 't_fin', 'On Hold', APP([U.B]))); }
o.runs = Object.fromEntries(Object.entries(runs).map(([k, v]) => [k, typeof v === 'string' ? v : E(v) + ' ' + v.t.slice(0, 300)]));
await sleep(3000);
// H1 waiting state
const st1 = await bpState(tks['1']); const tr1 = await trans(tks['1']); const t1 = await getTicket(tks['1']);
const it1 = (await inbox('B', { list: 'waiting', source: 'blueprint', page_size: 50 })).d?.approvals?.find(x => x.approval?.ticket_id === tks['1'] || x.ticket?.subject === 'QA PA bp 1');
o.H1state = String(JSON.stringify(st1)).slice(0, 700); o.H1trans = String(JSON.stringify(tr1)).slice(0, 500);
const again = await run('A', tks['1'], 't_fin', 'On Hold', APP([U.B]));
P('H1', !!it1 && t1.status === 'On Hold' && again.s >= 400, `ticket status ${t1.status}; item in B's Waiting for me (blueprint) ${!!it1}; running the transition again while pending -> ${E(again)}; state ${String(JSON.stringify(st1?.pending || st1?.pendingApproval || st1?.waiting || null)).slice(0, 200)}`);
o.B7item = String(JSON.stringify(it1)).slice(0, 1600);
P('B7', !!(it1 && it1.source === 'blueprint' && it1.blueprint && JSON.stringify(it1.blueprint).includes('QA PA Refund')), `blueprint block ${JSON.stringify(it1?.blueprint)}; requested_by A ${it1?.approval?.requested_by === U.A}`);
// B1 / B2 three sources
const w = (await inbox('B', { list: 'waiting', page_size: 100 })).d; const srcs = [...new Set((w?.approvals || []).map(x => x.source))];
const rq = (await inbox('A', { list: 'requested', page_size: 100 })).d; const rqs = [...new Set((rq?.approvals || []).map(x => x.source))];
P('B1', ['manual', 'web_form', 'blueprint'].every(s => srcs.includes(s)), `B waiting sources ${JSON.stringify(srcs)}, counts ${JSON.stringify(w?.counts)}`);
P('B2', rqs.includes('manual') && rqs.includes('blueprint') && !rqs.includes('web_form'), `A requested sources ${JSON.stringify(rqs)}`);
// E17 blueprint cancel refused
if (it1) { const c = await api.A('POST', `/desk/tickets/${tks['1']}/approvals/${it1.id}/cancel`, {}); o.E17bp = E(c); result('E17', c.s >= 400 ? 'PASS' : 'FAIL', `B cancels A's request 403, A cancels decided 409 (batch 1); A cancels blueprint item -> ${E(c)}; can_cancel ${it1.can_cancel}`); }
// H8 edit while pending
const ed = await api.A('PATCH', `/modules/${T}/records/${tks['2']}`, { data: [{ field: 'priority', value: enc('high') }, { field: 'subject', value: enc('QA PA bp 2 edited') }] });
await sleep(2000); const it2 = (await inbox('B', { list: 'waiting', source: 'blueprint', page_size: 50 })).d?.approvals?.filter(x => x.approval?.ticket_id === tks['2']) || [];
const t2 = await getTicket(tks['2']);
P('H8', ed.s < 300 && it2.length === 1 && t2.status === 'On Hold', `edit subject+priority -> ${E(ed)}; status ${t2.status}; pending items for ticket ${it2.length}`);
// H3 approve from page
const r3 = it1 ? await decide('B', tks['1'], it1.id, 'approve', { comment: 'QA PA finance ok' }) : { s: 0 };
await sleep(4000); const t1b = await getTicket(tks['1']);
P('H3', r3.s < 300 && t1b.status === 'Escalated' && /after-action/.test(t1b.description || ''), `B approves -> ${E(r3)}; ticket now ${t1b.status}; after-action description "${t1b.description}"`);
// H4 reject from page, stays, can run again
const it4 = (await inbox('B', { list: 'waiting', source: 'blueprint', page_size: 50 })).d?.approvals?.find(x => x.approval?.ticket_id === tks['4']);
const r4 = it4 ? await decide('B', tks['4'], it4.id, 'reject', { comment: 'QA PA missing receipt' }) : { s: 0 };
await sleep(3000); const t4 = await getTicket(tks['4']); const again4 = await run('A', tks['4'], 't_fin', 'On Hold', APP([U.B]));
P('H4', r4.s < 300 && t4.status === 'On Hold' && again4.s < 300, `B rejects -> ${E(r4)}; ticket stays ${t4.status}; A runs again -> ${E(again4)}`);
// H6 approve on the ticket side (same endpoint the ticket tab uses) for ticket 4 second run
await sleep(2000); const it4b = (await ticketApprovals('B', tks['4'])).list.find(x => x.status === 'pending');
const r6 = it4b ? await decide('B', tks['4'], it4b.id, 'approve', {}) : { s: 0 };
const page6 = (await inbox('B', { list: 'decided', page_size: 50 })).d?.approvals?.find(x => x.id === it4b?.id);
P('H6', r6.s < 300 && page6?.status === 'approved', `approve from ticket tab -> ${E(r6)}; page Decided shows ${page6?.status}`);
// H2 team approvers
const rt = await run('A', tks['3'], 't_team', 'Open', APP([], [ST.TEAM])); await sleep(3000);
const tD = (await inbox('D', { list: 'waiting', source: 'blueprint', page_size: 50 })).d?.approvals?.find(x => x.approval?.ticket_id === tks['3']);
const tB = (await inbox('B', { list: 'waiting', source: 'blueprint', page_size: 50 })).d?.approvals?.find(x => x.approval?.ticket_id === tks['3']);
P('H2', rt.s < 300 && !!tD && !tB, `team step run -> ${E(rt)} ${rt.s >= 300 ? rt.t.slice(0, 200) : ''}; D (team) sees ${!!tD}; B (not in team) sees ${!!tB}`);
// H9 ticket leaves blueprint while pending: close ticket 5
const it5 = (await inbox('B', { list: 'waiting', source: 'blueprint', page_size: 50 })).d?.approvals?.find(x => x.approval?.ticket_id === tks['5']);
const cl = await api.O('PATCH', `/modules/${T}/records/${tks['5']}`, { data: [{ field: 'status', value: enc('Closed') }] });
await sleep(3000); const a5 = it5 ? (await api.O('GET', '/desk/approvals/' + it5.id)).j?.data?.item : null;
P('H9', !!a5 && a5.status === 'cancelled', `close ticket while pending -> ${E(cl)}; approval now ${a5?.status} reason ${a5?.approval?.cancel_reason}`);
// HX: agent names a different approver than the step
await run('A', tks['6'], 't_fin', 'On Hold', APP([U.D])).then(async r => { await sleep(2000); const x = (await ticketApprovals('A', tks['6'])).list.find(a => a.status === 'pending'); o.HX = E(r) + ' approvers ' + JSON.stringify((x?.approver_user_ids || []).map(id => Object.entries(U).find(([, v]) => v === id)?.[0])); });
// H5 approver form fields
P('H5', null, 'approval step has no "approver must fill fields" option in the designer data (deskItems approval: approverUserIds/approverTeamIds only); not testable');
saveState(); return o;
