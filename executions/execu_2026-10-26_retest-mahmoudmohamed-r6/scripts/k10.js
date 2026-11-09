const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', V = '51666421-12cb-426e-b91e-3003a2a1f923'; const out = {};
const mk = async (label, ch) => { const b = { moduleId: L, layoutId: null, name: label, description: 'QA RT 2298 (deleted after the run)', priority: 10, allowedChannels: ch, fallback: { kind: 'LeaveUnassigned', userId: null, poolCriteria: null },
  entries: [{ condition: { kind: 'StringMatch', field: 'first_name', operator: 'Contains', stringValue: 'QA RT 2298', caseInsensitive: false }, target: { kind: 'Category', members: [{ userId: V, order: 0, kind: 'User' }], poolCriteria: null }, availability: { requireOnline: false, requireOnShift: false }, followUpTask: null }], isActive: true };
  const r = await api('POST', '/workflow/assignment-rules', b); return { s: r.s, id: r.j?.data?.id, err: r.s >= 300 ? r.t.slice(0, 200) : undefined, active: r.j?.data?.isActive }; };
out.apiOnly = await mk('QA RT 2298 api-only', ['api']); out.importCtl = await mk('QA RT 2298 import', ['excel_import']);
for (const k of ['apiOnly', 'importCtl']) if (out[k].id && !out[k].active) { const a = await api('POST', `/workflow/assignment-rules/${out[k].id}/activate`, {}); out[k].activate = a.s; }
return done(out);
