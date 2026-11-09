// NDC-2705: review status of the two imported leads; control lead created by API on the same process; then deactivate (reject_all).
const out = {}; const RP = 'bd081d46-b273-4579-9025-8c6e12c51219', LAY2 = 'b3ab6751-e26a-4641-9dbc-f8737f26c908';
const find = async n => { for (let p = 1; p <= 2; p++) { const h = arr((await api('o', 'GET', `/modules/${T.LEADS}/records?page=${p}`)).j?.data).find(x => JSON.stringify(x.data).includes(n)); if (h) return h; } return null; };
for (const k of ['on', 'off']) { const r = await find('QA RT REV 2705 ' + k); if (!r) { out[k] = 'not found'; continue; } ledger(`lead ${r.id} "QA RT REV 2705 ${k}" (import)`);
  const h = await X.reviewHistory('o', T.LEADS, r.id); out[k] = { id: r.id, layout: r.created_with_layout_id === LAY2 ? 'Standard Layout' : r.created_with_layout_id, source: r.source, review: (h?.cycles || []).map(c => c.status).join(',') || 'not held', compliance: r.compliance_state }; }
const c = (await X.lead('o', 'QA RT REV 2705 control', { email: 'qa.rt.2705.c@example.com' }, LAY2)).j?.data?.id; await sleep(8000);
out.control = { id: c, review: ((await X.reviewHistory('o', T.LEADS, c))?.cycles || []).map(x => x.status).join(',') || 'not held' };
const q = arr((await api('o', 'GET', `/workflow/reviews/queue?processId=${RP}&take=100`)).j?.data); out.queue = q.map(x => x.recordTitle || x.recordName || x.title || x.recordId).slice(0, 10);
out.inactive = (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: false, pendingAction: 'reject_all' })).s;
return out;
