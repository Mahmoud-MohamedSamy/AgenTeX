// NDC-2538 (user approved a public request catcher for this ticket only, 1 Nov 2026): review-process webhook → webhook.site.
// QA review process bd081d46 (layout "Standard Layout", field email, reviewer owner) → submitted / approved / rejected / resubmitted.
// Signature check: HMAC-SHA256 of "{timestamp}.{body}" with the per-process secret (rotated here, kept in memory, never printed).
const crypto = globalThis.crypto; const out = {}; const RP = 'bd081d46-b273-4579-9025-8c6e12c51219', LAY2 = 'b3ab6751-e26a-4641-9dbc-f8737f26c908';
const cat = await (await fetch('https://webhook.site/token', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: '{}' })).json(); const CU = cat.uuid; out.catcher = CU ? 'created' : 'failed';
ledger(`webhook.site catcher ${CU} (NDC-2538, public, user-approved) — delete at cleanup`);
const g = (await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data;
const keep = ['layoutId', 'name', 'description', 'fields', 'rules', 'notifications', 'sla', 'retentionDays', 'notifyOnAutoDelete', 'adminUserIds', 'allowAdminEdit', 'rejectionReasons'];
const reasons = [{ labelEn: 'QA RT 2538 reason', labelAr: null, orderIndex: 0 }];
out.patch = (await api('o', 'PATCH', '/workflow/review-processes/' + RP, { ...Object.fromEntries(keep.filter(k => k in g).map(k => [k, g[k]])), criteria: X.startsWith('first_name', 'QA RT 2538'), channels: ['manual', 'api'], eventFunctions: [], rejectionReasons: reasons, webhookUrl: 'https://webhook.site/' + CU })).s;
const rot = await api('o', 'POST', `/workflow/review-processes/${RP}/webhook-secret/rotate`, {}); const SECRET = rot.j?.data?.secret; out.secret = SECRET ? 'rotated (kept in memory)' : 'none';
out.active = (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: true })).s;
const held = async l => { for (let i = 0; i < 10; i++) { const c = (await X.reviewHistory('o', T.LEADS, l))?.cycles?.at(-1); if (c && /pending/.test(c.status)) return c; await sleep(3000); } return null; };
try {
  const a = (await X.lead('o', 'QA RT 2538 approve', { email: 'qa.rt.2538.a@example.com' }, LAY2)).j?.data?.id; const ca = await held(a);
  out.approve = ca ? (await api('o', 'POST', `/workflow/reviews/${ca.requestId}/fields/email/approve`, {})).s : 'not held';
  const b = (await X.lead('o', 'QA RT 2538 reject', { email: 'qa.rt.2538.b@example.com' }, LAY2)).j?.data?.id; const cb = await held(b);
  const pr = (await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data?.rejectionReasons?.[0]?.id || arr((await api('o', 'GET', '/workflow/review-rejection-reasons')).j?.data)[0]?.id;
  out.reject = cb ? (await api('o', 'POST', `/workflow/reviews/${cb.requestId}/reject`, { reasonId: pr, comment: 'QA RT 2538 reject' })).s : 'not held';
  await sleep(3000); out.resubmit = cb ? (await api('o', 'POST', `/workflow/reviews/${cb.requestId}/resubmit`, {})).s : 'n/a';
  out.leads = { a, b };
  await sleep(45000);
} finally {
  out.inactive = (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: false, pendingAction: 'reject_all' })).s;
  const g2 = (await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data;
  out.urlCleared = (await api('o', 'PATCH', '/workflow/review-processes/' + RP, { ...Object.fromEntries(keep.filter(k => k in g2).map(k => [k, g2[k]])), criteria: g2.criteria, channels: g2.channels, eventFunctions: [], webhookUrl: null })).s;
}
const reqs = (await (await fetch(`https://webhook.site/token/${CU}/requests?sorting=oldest&per_page=50`, { headers: { accept: 'application/json' } })).json()).data || [];
const hmac = async (key, msg) => { const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return [...new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(msg)))].map(x => x.toString(16).padStart(2, '0')).join(''); };
out.received = [];
for (const r of reqs) {
  const h = Object.fromEntries(Object.entries(r.headers || {}).map(([k, v]) => [k.toLowerCase(), Array.isArray(v) ? v[0] : v]));
  const ts = h['x-anyware-timestamp'], sig = h['x-anyware-signature'] || ''; let body = {}; try { body = JSON.parse(r.content); } catch (e) { }
  const want = SECRET && ts ? 'v1=' + await hmac(SECRET, `${ts}.${r.content}`) : null;
  out.received.push({ event: h['x-anyware-event'] || body.event, bodyEvent: body.event, record: String(body.recordId || '').slice(0, 8), hasTimestamp: !!ts, hasSignature: !!sig, signatureValid: want ? sig.split(',').map(x => x.trim()).includes(want) || sig === want.slice(3) : null });
}
return out;
