const o = {}; const T5 = '5fe15f85-aaf6-4188-a8f8-05481fbf4748', T2 = '8598242d-f167-4a4f-9b0b-3ee189c13601', BP = '0598d5d1-c843-4154-8487-4f5ea5f3f15f';
const uuid = () => require('crypto').randomUUID();
const st = async id => { const s = await X.state(id); return s ? (s.activeStates || []).join(',') : 'none'; };
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''}`.trim();
const run = (who, tid, tr, exp, extra = {}) => api(who, 'POST', `desk:/desk/tickets/${tid}/blueprint-transitions/${tr}`, { run_id: uuid(), expected_state_id: exp, fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...extra });
o.me_a = (await api('a', 'GET', 'desk:/iam/me')).j?.data?.email?.split('@')[0];
o.overrides = JSON.stringify((await X.state(T5))?.ownerOverrides || {});
// item 2: QA rate now owned by fedelav803 only
o.rate_byOwnerAccount = full(await run('o', T5, 'rate', 'Open')); o.stateAfterO = await st(T5);
o.rate_byA3 = full(await run('a', T5, 'rate', 'Open')); o.stateAfterA3 = await st(T5);
// item 15: revoke permission — Desk Agent fedelav803 vs owner
const rv = (who, id) => api(who, 'POST', `desk:/desk/blueprints/${BP}/revoke`, { ticket_ids: [id], after: null });
o.revoke_byAgent = full(await rv('a', T5)); o.stateAfterAgentRevoke = await st(T5);
o.revoke_byOwner = full(await rv('o', T5)); o.stateAfterOwnerRevoke = await st(T5);
// item 6: share that adds nothing (own department) is refused
o.share_ownDept = full(await run('o', T2, 'alt', 'Open', { shares: [{ department_id: X.ids.DEPT_A, access: 'full' }] })); o.t2state = await st(T2);
return o;
