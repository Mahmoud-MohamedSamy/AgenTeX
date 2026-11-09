// NDC-2706 follow-up: does an ordinary edit (PATCH) of the reviewed field put the lead back into review, while Mass Update does not?
const out = {}; const RP = 'bd081d46-b273-4579-9025-8c6e12c51219', LAY2 = 'b3ab6751-e26a-4641-9dbc-f8737f26c908';
out.rpOn = (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: true })).s;
const cyc = async id => ((await X.reviewHistory('o', T.LEADS, id))?.cycles || []).map(c => c.status);
try {
  const l = (await X.lead('o', 'QA RT REV 2706 edit', { email: 'qa.rt.2706.e@example.com' }, LAY2)).j?.data?.id; out.lead = l;
  await sleep(5000); const c = (await X.reviewHistory('o', T.LEADS, l))?.cycles?.at(-1); out.createHeld = c?.status;
  if (c?.requestId) await api('o', 'POST', `/workflow/reviews/${c.requestId}/fields/email/approve`, {}); await sleep(5000);
  const p = await api('o', 'PATCH', `/modules/${T.LEADS}/records/${l}`, { data: [{ field: 'email', value: { kind: 'string', value: 'qa.rt.2706.e2@example.com' } }] });
  out.patchEmail = p.s + (p.s > 299 ? ' ' + p.t.slice(0, 160) : ''); await sleep(6000); out.cyclesAfterPatch = await cyc(l);
  const m = await api('o', 'POST', `/modules/${T.LEADS}/records/mass-update`, { record_ids: [l], data: [{ field: 'email', value: { kind: 'string', value: 'qa.rt.2706.e3@example.com' } }] });
  out.massUpdate = m.s; await sleep(6000); out.cyclesAfterMassUpdate = await cyc(l);
  out.rp = JSON.stringify((({ channels, triggerOn, executeOn, runOn }) => ({ channels, triggerOn, executeOn, runOn }))((await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data || {}));
} finally { out.rpOff = (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: false, pendingAction: 'reject_all' })).s; }
return out;
