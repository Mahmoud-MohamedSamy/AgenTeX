// Round 9 cleanup, last step: the owner (process admin) rejects the QA leads still awaiting approval, then deletes them and the two QA approval processes.
const P = JSON.parse(process.env.CLEAN_IDS); const out = { rejected: {}, deletedLeads: {}, deletedApprovals: {} }; const cnt = (o, s) => (o[s] = (o[s] || 0) + 1);
for (const x of P.records.filter(r => r.m === 'LEADS')) {
  const g = await api('o', 'GET', `/modules/${T.LEADS}/records/${x.id}`); if (g.s !== 200 || g.j?.data?.is_deleted) continue;
  const st = await X.approvalState('o', T.LEADS, x.id); if (st.j?.data?.instanceId && /pending/.test(st.j.data.state)) cnt(out.rejected, (await api('o', 'POST', `/workflow/approvals/${st.j.data.instanceId}/reject`, { comment: 'QA RT cleanup (round 9)' })).s);
  await sleep(1500); cnt(out.deletedLeads, (await api('o', 'DELETE', `/modules/${T.LEADS}/records/${x.id}`)).s);
}
for (const x of P.approvals) { const g = await api('o', 'GET', `/workflow/approval-processes/${x.id}`); if (g.s === 200) cnt(out.deletedApprovals, (await api('o', 'DELETE', `/workflow/approval-processes/${x.id}`)).s); }
return out;
