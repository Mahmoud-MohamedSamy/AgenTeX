const a2 = 'd5ec3168-d5ca-4c33-a044-4dabb48187f3'; const st = await X.approvalState('o', T.LEADS, a2);
const r = await api('o', 'POST', `/workflow/approvals/${st.j?.data?.instanceId}/approve`, { comment: 'QA RT 1950 approved (process admin)' });
await sleep(3000); return { approve: r.s, state: (await X.approvalState('o', T.LEADS, a2)).j?.data?.state, u1Overrides: (await api('o', 'GET', `/iam/users/${T.U1}/overrides`)).t.slice(0, 80) };
