// NDC-2294 items 6 (run) + 10 on review process bd081d46 (layout "Standard Layout", manual channel, reviewer = owner).
const out = {}; const RP = 'bd081d46-b273-4579-9025-8c6e12c51219'; const LAY2 = 'b3ab6751-e26a-4641-9dbc-f8737f26c908';
const g = (await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data;
const put = await api('o', 'PATCH', '/workflow/review-processes/' + RP, { ...Object.fromEntries(['layoutId','name','description','criteria','channels','fields','rules','notifications','sla','retentionDays','notifyOnAutoDelete','adminUserIds','allowAdminEdit','webhookUrl','eventFunctions'].filter(k => k in g).map(k => [k, g[k]])), rejectionReasons: [{ labelEn: 'QA RT 2294 reason A', labelAr: 'سبب أ', orderIndex: 0 }, { labelEn: 'QA RT 2294 reason B', labelAr: null, orderIndex: 1 }] });
out['10 put'] = put.s + ' ' + (put.s > 299 ? put.t.slice(0, 300) : '');
const g2 = (await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data;
out['10 stored'] = JSON.stringify((g2?.rejectionReasons || []).map(r => [r.labelEn, r.labelAr, r.orderIndex]));
out['10 org list unchanged'] = JSON.stringify(arr((await api('o', 'GET', '/workflow/review-rejection-reasons')).j?.data).map(x => x.labelEn || x.label)).slice(0, 200);
out['6 functions still'] = JSON.stringify((g2?.eventFunctions || []).map(f => f.event));
return out;
try {
  const l = (await X.lead('o', 'QA RT 2294 REV lead', { email: 'qa.rt.2294@example.com' }, LAY2)).j?.data?.id; out['6 lead'] = l; await sleep(20000);
  const h = await X.reviewHistory('o', T.LEADS, l); out['6 review'] = JSON.stringify((h?.cycles || []).map(c => [c.status, c.requestId])).slice(0, 200);
  out['6 executions'] = (await X.executions(l)).map(e => (e.triggerKind || '') + ' ' + e.outcome + ' ' + JSON.stringify((e.dispatches || []).map(d => d.actionType + ':' + d.status)));
  const rq = h?.cycles?.at(-1)?.requestId;
  if (rq) { out['6 approve'] = (await api('o', 'POST', `/workflow/reviews/${rq}/fields/email/approve`, {})).s; await sleep(15000); out['6 executions after approve'] = (await X.executions(l)).map(e => (e.triggerKind || '') + ' ' + e.outcome + ' ' + JSON.stringify((e.dispatches || []).map(d => d.actionType + ':' + d.status))); }
} finally { out['6 inactive'] = (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: false, pendingAction: 'reject_all' })).s; }
return out;
