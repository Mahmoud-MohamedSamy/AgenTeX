// Hierarchy: who can see / act on an approval assigned to another agent in the SAME department.
const o = {}; const R = {};
const t = (await mkTicket('O', 'QA PA HI ticket')).id; R.t = t;
// request assigned to D only (requested by owner so B is neither requester nor approver)
const r = await api.O('POST', `/desk/tickets/${t}/approvals`, { subject: 'QA PA HI for D only', approver_user_ids: [U.D] }); R.a = r.j?.data?.id; o.create = E(r);
// a second one assigned to B, to compare
const r2 = await api.O('POST', `/desk/tickets/${t}/approvals`, { subject: 'QA PA HI for B', approver_user_ids: [U.B] }); R.b = r2.j?.data?.id;
ST.HI = R; saveState(); await sleep(2000);
const inList = async (who, list) => { const x = await inbox(who, { list, page_size: 100 }); return x.s >= 400 ? x.s + ' ' + (x.err || '').split(' ')[0] : (x.d?.approvals || []).some(i => i.id === R.a); };
const row = {};
for (const k of ['B', 'A', 'D', 'O']) {
  const det = await api[k]('GET', '/desk/approvals/' + R.a); const it = det.j?.data?.item;
  row[k] = { waiting: await inList(k, 'waiting'), requested: await inList(k, 'requested'), all_pending: await inList(k, 'all_pending'),
    detail: det.s, can: it ? { decide: it.can_decide, on_behalf: it.can_decide_on_behalf, remind: it.can_remind, reassign: it.can_reassign, cancel: it.can_cancel, comment: it.can_comment } : null,
    ticketTab: (await ticketApprovals(k, t)).list.some(x => x.id === R.a) };
}
o.visibility = row;
// actions by B on D's item
o.B_approve = E(await decide('B', t, R.a, 'approve', {}));
o.B_reject = E(await decide('B', t, R.a, 'reject', { comment: 'QA PA not mine' }));
o.B_comment = E(await api.B('POST', `/desk/tickets/${t}/approvals/${R.a}/comments`, { body: 'QA PA B comment' }));
o.B_remind = E(await api.B('POST', `/desk/tickets/${t}/approvals/${R.a}/remind`, {}));
o.B_reassign = E(await api.B('POST', `/desk/tickets/${t}/approvals/${R.a}/reassign`, { from: { user_id: U.D }, to: { user_id: U.B } }));
o.B_onbehalf = E(await decide('B', t, R.a, 'approve', { on_behalf_reason: 'QA PA B tries', on_behalf_of_user_id: U.D }));
// supervisor A (view_department, not approver, not requester)
o.A_approve = E(await decide('A', t, R.a, 'approve', {}));
o.A_onbehalf = E(await decide('A', t, R.a, 'approve', { on_behalf_reason: 'QA PA supervisor tries', on_behalf_of_user_id: U.D }));
// owner decides on behalf of D (manage approvals)
o.O_onbehalf = E(await decide('O', t, R.a, 'approve', { comment: 'QA PA owner', on_behalf_reason: 'QA PA D is away', on_behalf_of_user_id: U.D }));
const fin = (await api.O('GET', '/desk/approvals/' + R.a)).j?.data?.item?.approval; o.final = { status: fin?.status, decided_by: fin?.decided_by === U.O ? 'O' : fin?.decided_by, on_behalf: fin?.on_behalf, of: fin?.on_behalf_of === U.D ? 'D' : fin?.on_behalf_of };
// D (Desk Administrator) acts on B's item on behalf
o.D_onbehalf_on_B_item = E(await decide('D', t, R.b, 'reject', { comment: 'QA PA admin', on_behalf_reason: 'QA PA admin decides', on_behalf_of_user_id: U.B }));
return o;
