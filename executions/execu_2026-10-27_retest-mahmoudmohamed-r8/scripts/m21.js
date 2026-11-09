// NDC-2419 A-01 reproduction: assignment rule (Api channel) on Leads, names starting "QA RT r8 AR" → test user 2.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', U2 = '51666421-12cb-426e-b91e-3003a2a1f923'; const out = {};
const b = { moduleId: L, layoutId: null, name: 'QA RT r8 AR api', description: null, priority: 10, allowedChannels: ['Api', 'Import'], fallback: { kind: 'LeaveUnassigned', userId: null, poolCriteria: null },
  entries: [{ condition: { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', stringValue: 'QA RT r8 AR', caseInsensitive: false, negate: null }, target: { kind: 'Category', members: [{ userId: U2, order: 0, kind: 'User' }], poolCriteria: null }, availability: { requireOnline: false, requireOnShift: false }, followUpTask: null }], isActive: false };
const c = await api('POST', '/workflow/assignment-rules', b); const id = c.j?.data?.id; out.create = c.s + ' ' + (id || c.t.slice(0, 300));
if (id) { const cur = (await api('GET', '/workflow/assignment-rules/' + id)).j?.data; out.on = (await api('PATCH', '/workflow/assignment-rules/' + id, { ...cur, isActive: true })).s; }
out.id = id; return done(out);
