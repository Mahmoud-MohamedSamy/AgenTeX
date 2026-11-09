// NDC-1950 actions: reject a1 then resubmit (attempt #2); delete the approved lead a2 (history must keep it, marked deleted).
const out = {}; const a1 = '02be9f4f-c45a-4dee-ab5c-40aaeffc248f', a2 = 'd5ec3168-d5ca-4c33-a044-4dabb48187f3';
const s1 = await X.approvalState('o', T.LEADS, a1); out.reject = (await api('o', 'POST', `/workflow/approvals/${s1.j?.data?.instanceId}/reject`, { comment: 'QA RT 1950 rejected' })).s; await sleep(4000);
const s2 = await X.approvalState('o', T.LEADS, a1); out.afterReject = s2.j?.data?.state + ' canResubmit=' + s2.j?.data?.canResubmit;
out.resubmit = (await api('o', 'POST', `/workflow/approvals/${s2.j?.data?.instanceId}/resubmit`, {})).s; await sleep(5000);
out.afterResubmit = (await X.approvalState('o', T.LEADS, a1)).j?.data?.state;
out.deleteA2 = (await api('o', 'DELETE', `/modules/${T.LEADS}/records/${a2}`)).s; ledger(`lead ${a2} "QA RT 1950 A approved" deleted (NDC-1950 history check) — purge from recycle bin`);
return out;
