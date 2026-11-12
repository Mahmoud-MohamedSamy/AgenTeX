const o = JSON.parse(fs.readFileSync('../a4/i9-out.json')); const AG = o.AG; const R = {};
const g = await api('GET', `/desk/departments/${D}/agents`); const L = arr(g.j?.data);
const ids = L.map(x => x.user_id || x.userId || x.agent_user_id || x.id).filter(Boolean);
fs.writeFileSync('../a4/i9-dept-orig.json', JSON.stringify({ D, ids }));
R.get = g.s + ' n=' + ids.length + ' keys=' + (L[0] ? Object.keys(L[0]).join(',') : '');
const st = async () => arr((await api('GET', '/iam/users?take=200')).j?.data).find(x => x.userId === AG)?.status;
const own = async id => JSON.stringify(await getTicket(id)).includes(AG);
try {
  const p = await api('PUT', `/desk/departments/${D}/agents`, { agent_user_ids: [...ids, AG] }); R.add = p.s + (p.s >= 300 ? ' ' + p.t.slice(0, 160) : ''); await sleep(3000);
  const t1 = await mkTicket('I9 manual', {}, 'member active'); await sleep(3000);
  const a1 = await api('POST', `/desk/tickets/${t1.id}/assign`, { owner_id: AG }); R.memberActiveManual = a1.s + ' owner=' + await own(t1.id);
  R.susp = (await api('PATCH', '/iam/users/' + AG, { status: 'suspended' })).s; await sleep(2000); R.statusNow = await st();
  const t2 = await mkTicket('I9 manual', {}, 'member suspended'); await sleep(3000);
  const a2 = await api('POST', `/desk/tickets/${t2.id}/assign`, { owner_id: AG }); R.memberSuspManual = a2.s + (a2.s >= 300 ? ' ' + JSON.parse(a2.t).error.message : '') + ' owner=' + await own(t2.id);
  const t3 = await mkTicket('I9 owner', {}, 'member suspended wf'); await sleep(20000);
  const ex = arr2((await api('GET', `/workflow/executions?recordId=${t3.id}`)).j?.data).filter(e => e.ruleId === o.rule);
  R.memberSuspWorkflow = { owner: await own(t3.id), exec: ex.map(e => ({ outcome: e.outcome, err: e.errorMessage, d: e.dispatches })) };
  fs.writeFileSync('../a4/i9-out.json', JSON.stringify({ ...o, t1: t1.id, t2: t2.id, t3: t3.id }));
} finally {
  R.reactivate = (await api('PATCH', '/iam/users/' + AG, { status: 'active' })).s; R.statusAfter = await st();
  R.deptRestore = (await api('PUT', `/desk/departments/${D}/agents`, { agent_user_ids: ids })).s;
  const back = arr((await api('GET', `/desk/departments/${D}/agents`)).j?.data).map(x => x.user_id || x.userId || x.agent_user_id || x.id); R.deptSame = back.length === ids.length && ids.every(i => back.includes(i));
}
log(JSON.stringify(R, null, 1));
