// NDC-2708 + NDC-2710: approval on Leads, approver U1 (CRM User profile); the owner submits 8 QA leads.
// 2708: U1 opens each record + its approval state right away and 3 more times — every read must be 200.
// 2710: canApprove shown to U1 vs U1's permission workflow:approval:act; press Approve → must agree with canApprove.
const out = {}; const G = 'QA RT 2708 ';
const perms = (await api('u1', 'GET', '/iam/me/permissions')).t; out.u1HasApprovalAct = /workflow[:.]approval[:.]act/.test(perms); out.u1ApprovalPerms = (perms.match(/workflow[:.]approval[:.\w]*/g) || []).filter((v, i, a) => a.indexOf(v) === i);
const ap = await X.made('o', '/workflow/approval-processes', X.approval(T.LEADS, G + 'approver U1', true, false, X.startsWith('first_name', G), [X.levelUsers(T.U1)], [T.OWNER]), 'approval process');
const apId = ap.j?.data?.id; if (!apId) return { ...out, ap: ap.t.slice(0, 300) };
await api('o', 'PATCH', `/workflow/approval-processes/${apId}/active`, { isActive: true });
const reads = []; const leads = [];
try {
  for (let i = 1; i <= 8; i++) leads.push((await X.lead('o', G + 'lead ' + i)).j?.data?.id);
  for (const [i, l] of leads.entries()) {
    const row = { n: i + 1, rec: [], appr: [] };
    for (let k = 0; k < 4; k++) {
      row.rec.push((await api('u1', 'GET', `/modules/${T.LEADS}/records/${l}`)).s);
      const a = await X.approvalState('u1', T.LEADS, l); row.appr.push(a.s + (a.j?.data ? ':' + a.j.data.state + ':can=' + a.j.data.canApprove : ''));
      await sleep(k === 0 ? 1500 : 4000);
    }
    reads.push(row);
  }
  out.reads = reads;
  out.recordReads = reads.flatMap(r => r.rec).reduce((m, s) => (m[s] = (m[s] || 0) + 1, m), {});
  out.approvalReads = reads.flatMap(r => r.appr.map(x => x.split(':')[0])).reduce((m, s) => (m[s] = (m[s] || 0) + 1, m), {});
  // 2710: press Approve as U1 on the first two leads
  out.approveAsU1 = [];
  for (const l of leads.slice(0, 2)) { const st = await X.approvalState('u1', T.LEADS, l); const r = st.j?.data?.instanceId ? await api('u1', 'POST', `/workflow/approvals/${st.j.data.instanceId}/approve`, { comment: 'QA RT 2710' }) : { s: 'no instance', t: '' };
    out.approveAsU1.push({ canApprove: st.j?.data?.canApprove, blocked: st.j?.data?.viewerDecisionBlockedReason, approve: r.s + ' ' + r.t.slice(0, 160), stateAfter: (await X.approvalState('o', T.LEADS, l)).j?.data?.state }); }
} finally { out.inactive = (await api('o', 'PATCH', `/workflow/approval-processes/${apId}/active`, { isActive: false })).s; }
out.leads = leads;
return out;
