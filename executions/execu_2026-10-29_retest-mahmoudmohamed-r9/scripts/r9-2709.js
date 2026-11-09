// NDC-2709: review process (QA, layout "Standard Layout") holds QA leads; approve → edit at once → must be 200 (not 422 REVIEW_LOCKED). 4 cycles.
// The QA review process bd081d46 (from NDC-2294 item 6) is re-pointed at "QA RT REV" leads and left INACTIVE at the end (reused by 2705 / 2706 / 2538).
const out = {}; const RP = 'bd081d46-b273-4579-9025-8c6e12c51219', LAY2 = 'b3ab6751-e26a-4641-9dbc-f8737f26c908';
const g = (await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data;
const keep = ['layoutId', 'name', 'description', 'criteria', 'channels', 'fields', 'rules', 'notifications', 'sla', 'retentionDays', 'notifyOnAutoDelete', 'adminUserIds', 'allowAdminEdit', 'webhookUrl', 'rejectionReasons'];
const body = { ...Object.fromEntries(keep.filter(k => k in g).map(k => [k, g[k]])), name: 'QA RT review (r9)', criteria: X.startsWith('first_name', 'QA RT REV'), channels: ['manual', 'api', 'excel_import', 'workflow'], eventFunctions: [] };
const p = await api('o', 'PATCH', '/workflow/review-processes/' + RP, body); out.repoint = p.s + ' ' + (p.s > 299 ? p.t.slice(0, 300) : '');
out.active = (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: true })).s;
const enc = v => ({ kind: 'string', value: String(v) });
const edit = async (id, v) => { const r = await api('o', 'PATCH', `/modules/${T.LEADS}/records/${id}`, { data: [{ field: 'description', value: enc(v) }] }); return r.s + (r.s > 299 ? ' ' + (r.j?.error?.code || r.t.slice(0, 120)) : ''); };
out.cycles = [];
try {
  for (let n = 1; n <= 4; n++) {
    const l = (await X.lead('o', 'QA RT REV 2709 ' + n, { email: `qa.rt.2709.${n}@example.com` }, LAY2)).j?.data?.id;
    let h = null; for (let i = 0; i < 10; i++) { h = await X.reviewHistory('o', T.LEADS, l); if (h?.cycles?.length) break; await sleep(3000); }
    const c = h?.cycles?.at(-1); const row = { lead: l, held: c?.status };
    if (c?.requestId) {
      row.approve = (await api('o', 'POST', `/workflow/reviews/${c.requestId}/fields/email/approve`, {})).s;
      row.editAtOnce = await edit(l, 'QA RT 2709 edit 1');
      await sleep(5000); row.editAfter5s = await edit(l, 'QA RT 2709 edit 2');
      row.reviewAfter = (await X.reviewHistory('o', T.LEADS, l))?.cycles?.at(-1)?.status;
    }
    out.cycles.push(row);
  }
} finally { out.inactive = (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: false, pendingAction: 'reject_all' })).s; }
return out;
