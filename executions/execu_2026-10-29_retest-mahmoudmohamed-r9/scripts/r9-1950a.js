// NDC-1950 setup: owner's requests — one lead pending approval (approver U1), one lead pending review (QA review process, reviewer owner),
// one lead approved (history row). Processes stay ACTIVE for the screen check; r9-1950c deactivates them.
const out = {}; const G = 'QA RT 1950 '; const RP = 'bd081d46-b273-4579-9025-8c6e12c51219', LAY2 = 'b3ab6751-e26a-4641-9dbc-f8737f26c908';
let ap = arr((await api('o', 'GET', '/workflow/approval-processes')).j?.data).find(a => a.name === G + 'approver U1')?.id;
if (!ap) { const r = await X.made('o', '/workflow/approval-processes', X.approval(T.LEADS, G + 'approver U1', true, false, X.startsWith('first_name', G + 'A'), [X.levelUsers(T.U1)], [T.OWNER]), 'approval process'); ap = r.j?.data?.id; }
out.approval = ap; out.apOn = (await api('o', 'PATCH', `/workflow/approval-processes/${ap}/active`, { isActive: true })).s;
// review process: point it at "QA RT 1950 R" leads
const g = (await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data;
const keep = ['layoutId', 'name', 'description', 'criteria', 'channels', 'fields', 'rules', 'notifications', 'sla', 'retentionDays', 'notifyOnAutoDelete', 'adminUserIds', 'allowAdminEdit', 'rejectionReasons', 'eventFunctions'];
out.rpRepoint = (await api('o', 'PATCH', '/workflow/review-processes/' + RP, { ...Object.fromEntries(keep.filter(k => k in g).map(k => [k, g[k]])), criteria: X.startsWith('first_name', G + 'R'), webhookUrl: null })).s;
out.rpOn = (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: true })).s;
const a1 = (await X.lead('o', G + 'A pending')).j?.data?.id; const a2 = (await X.lead('o', G + 'A approved')).j?.data?.id;
const r1 = (await X.lead('o', G + 'R pending', { email: 'qa.rt.1950@example.com' }, LAY2)).j?.data?.id;
await sleep(8000);
const st = await X.approvalState('u1', T.LEADS, a2);
// U1 has no approve permission: grant it for one approval, then remove it again
await api('o', 'POST', `/iam/users/${T.U1}/overrides`, { permission_key: 'workflow:approval:act', effect: 'GRANT', reason: 'QA RT 1950 history row' });
out.approveA2 = (await api('u1', 'POST', `/workflow/approvals/${st.j?.data?.instanceId}/approve`, { comment: 'QA RT 1950 approved' })).s;
out.revoke = (await api('o', 'DELETE', `/iam/users/${T.U1}/overrides/workflow:approval:act?reason=QA%20RT%201950`)).s;
out.leads = { a1, a2, r1 };
out.states = { a1: (await X.approvalState('o', T.LEADS, a1)).j?.data?.state, a2: (await X.approvalState('o', T.LEADS, a2)).j?.data?.state, r1: (await X.reviewHistory('o', T.LEADS, r1))?.cycles?.at(-1)?.status };
return out;
