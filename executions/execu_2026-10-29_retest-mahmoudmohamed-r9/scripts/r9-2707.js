// NDC-2707: approval → blueprint hand-off. Approver = owner. All processes guarded by "QA RT 2707 …", deactivated in finally.
// P1 Tasks (×2): approval + blueprint (priority low→normal) on tasks "QA RT 2707 T…".  P3 control: lead "QA RT 2707 L1" (approval + blueprint rating).
// P2: lead "QA RT 2707 L2" made by a Leads blueprint (industry) after-action createRecord → approval → must enter the rating blueprint.
const out = {}; const G = 'QA RT 2707 '; const TL = '24b5b871-bbfd-4b8a-98dd-c1c39b688fdc';
const enc = v => ({ kind: 'string', value: String(v) });
const offs = [];
const apOn = async (module, label, crit) => { const r = await X.made('o', '/workflow/approval-processes', X.approval(module, G + label, true, false, crit, [X.levelUsers(T.OWNER)], [T.OWNER]), 'approval process'); const id = r.j?.data?.id; if (!id) throw new Error('approval ' + label + ' ' + r.t.slice(0, 300)); await api('o', 'PATCH', `/workflow/approval-processes/${id}/active`, { isActive: true }); offs.push(async () => (await api('o', 'PATCH', `/workflow/approval-processes/${id}/active`, { isActive: false })).s); return id; };
const bpOn = async (module, key, layout, field, label, crit, states, after) => { const r = await api('o', 'POST', `/modules/${module}/blueprints`, X.blueprint(key, layout, null, field, G + label, crit, states, after)); const id = r.j?.data?.id; if (!id) throw new Error('blueprint ' + label + ' ' + r.t.slice(0, 400)); ledger(`blueprint ${id} "${G}${label}" (${key})`); const cur = (await api('o', 'GET', `/modules/${module}/blueprints/${id}`)).j?.data; const a = await api('o', 'PUT', `/modules/${module}/blueprints/${id}`, { isActive: true, definition: cur.definition }); if (a.s > 299) throw new Error('activate bp ' + a.t.slice(0, 200)); offs.push(async () => { const c = (await api('o', 'GET', `/modules/${module}/blueprints/${id}`)).j?.data; return (await api('o', 'PUT', `/modules/${module}/blueprints/${id}`, { isActive: false, definition: c.definition })).s; }); return id; };
const approveAs = async (module, id) => { for (let i = 0; i < 6; i++) { const st = await X.approvalState('o', module, id); if (st.j?.data?.instanceId && st.j?.data?.state !== 'approved') return { state: st.j.data.state, approve: (await api('o', 'POST', `/workflow/approvals/${st.j.data.instanceId}/approve`, { comment: 'QA RT 2707' })).s }; await sleep(4000); } return { state: 'no approval instance' }; };
const inBp = async (module, id, name) => { const s = await X.bpState('o', module, id); return (s?.states || []).filter(x => x.blueprintName === name).map(x => JSON.stringify(x.activeStates)).join(' ') || 'NOT IN BLUEPRINT'; };
try {
  // ---- P1 Tasks
  await apOn(T.TASKS, 'tasks approval', X.startsWith('subject', G + 'T'));
  await bpOn(T.TASKS, 'tasks', TL, 'priority', 'tasks blueprint', X.bpCrit('subject', G + 'T'), ['low', 'normal'], []);
  out.P1 = [];
  for (const n of [1, 2]) {
    const t = await api('o', 'POST', `/modules/${T.TASKS}/records`, { layout_id: TL, data: [['name', G + 'T' + n], ['subject', G + 'T' + n], ['status', 'Not Started'], ['priority', 'low']].map(([f, v]) => ({ field: f, value: enc(v) })) });
    const id = t.j?.data?.id; if (!id) { out.P1.push('create ' + t.s + ' ' + t.t.slice(0, 300)); continue; } ledger(`task ${id} "${G}T${n}"`);
    await sleep(6000); const before = await inBp(T.TASKS, id, G + 'tasks blueprint'); const ap = await approveAs(T.TASKS, id); await sleep(15000);
    out.P1.push({ task: id, beforeApproval: before, approval: ap, approvalAfter: (await X.approvalState('o', T.TASKS, id)).j?.data?.state, blueprintAfter: await inBp(T.TASKS, id, G + 'tasks blueprint') });
  }
  // ---- Leads approval + rating blueprint
  await apOn(T.LEADS, 'leads approval', X.startsWith('first_name', G + 'L'));
  await bpOn(T.LEADS, 'leads', T.LEADS_STD, 'rating', 'leads blueprint', X.bpCrit('first_name', G + 'L'), ['acquired', 'active'], []);
  // ---- P3 control: lead created directly
  const l1 = (await X.lead('o', G + 'L1', { rating: 'acquired' })).j?.data?.id; await sleep(6000);
  const b1 = await inBp(T.LEADS, l1, G + 'leads blueprint'); const a1 = await approveAs(T.LEADS, l1); await sleep(15000);
  out.P3 = { lead: l1, beforeApproval: b1, approval: a1, blueprintAfter: await inBp(T.LEADS, l1, G + 'leads blueprint') };
  // ---- P2: lead made by a blueprint after-action
  const fi = arr((await api('o', 'GET', `/modules/${T.LEADS}/fields`)).j?.data).find(x => x.apiName === 'industry'); const IV = fi?.config?.allowed_values || [];
  out.industry = IV.slice(0, 3);
  await bpOn(T.LEADS, 'leads', T.LEADS_STD, 'industry', 'maker blueprint', X.bpCrit('first_name', G + 'A'), IV.slice(0, 2),
    [{ kind: 'createRecord', targetModuleKey: 'leads', fields: { first_name: G + 'L2', last_name: G + 'L2', phone: '01002707002', rating: 'acquired' } }]);
  const a = (await X.lead('o', G + 'A maker', { industry: IV[0] })).j?.data?.id; await sleep(8000);
  const st = await X.bpState('o', T.LEADS, a); const tr = (st?.transitions || []).find(x => /^QA /.test(x.name || x.transitionName || ''));
  out.P2maker = { lead: a, transitions: (st?.transitions || []).map(x => x.name || x.transitionName) };
  if (tr) {
    out.P2maker.transition = (await api('o', 'POST', `/modules/${T.LEADS}/records/${a}/blueprint-transitions/${tr.id || tr.transitionId}`, {})).s; await sleep(15000);
    let l2 = null; for (let p = 1; p <= 2 && !l2; p++) l2 = arr((await api('o', 'GET', `/modules/${T.LEADS}/records?page=${p}`)).j?.data).find(x => JSON.stringify(x.data).includes(G + 'L2'))?.id;
    if (l2) { ledger(`lead ${l2} "${G}L2" (made by the maker blueprint)`); const b2 = await inBp(T.LEADS, l2, G + 'leads blueprint'); const a2 = await approveAs(T.LEADS, l2); await sleep(15000);
      out.P2 = { lead: l2, beforeApproval: b2, approval: a2, approvalAfter: (await X.approvalState('o', T.LEADS, l2)).j?.data?.state, blueprintAfter: await inBp(T.LEADS, l2, G + 'leads blueprint'), exec: (await X.executions(l2)).map(e => (e.triggerKind || '') + ' ' + e.outcome) };
    } else out.P2 = 'lead L2 not created by the after-action';
  }
} catch (e) { out.ERROR = String(e.message).slice(0, 500); }
finally { out.off = []; for (const f of offs.reverse()) out.off.push(await f()); }
return out;
