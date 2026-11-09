// Round 9 cleanup — READ-ONLY existence check of every id in ledger.md (+ items made by automations, from the inventory). Writes nothing.
const LED = JSON.parse(process.env.LEDGER_JSON || '[]');
const out = { exists: [], gone: [], unknown: [] };
const probe = async (type, id) => {
  const P = { 'lead': `/modules/${T.LEADS}/records/${id}`, 'task': `/modules/${T.TASKS}/records/${id}`, 'CRM contact': `/modules/${T.CONTACTS}/records/${id}`, 'contact': `/modules/${T.CONTACTS}/records/${id}`,
    'workflow rule': `/workflow/rules/${id}`, 'approval process': `/workflow/approval-processes/${id}`, 'review process': `/workflow/review-processes/${id}`, 'assignment rule': `/workflow/assignment-rules/${id}`,
    'web form': `/web-forms/${id}`, 'report': `/reporting/reports/${id}`, 'module': `/modules/${id}`, 'mail draft': `/mail/drafts/${id}`, 'layout': `/modules/${T.LEADS}/layouts/${id}`,
    'profile': `/iam/profiles/${id}`, 'org unit': `/iam/org-units/${id}`, 'Desk contact': `desk:/modules/0bbb599e-013b-4465-a41e-85a324a4e3ac/records/${id}` }[type];
  if (type === 'blueprint') { for (const m of [T.LEADS, T.TASKS]) { const r = await api('o', 'GET', `/modules/${m}/blueprints/${id}`); if (r.s === 200) return { s: 200, module: m, active: r.j?.data?.isActive, name: r.j?.data?.definition?.name }; } return { s: 404 }; }
  if (!P) return { s: 'no-probe' };
  const r = await api('o', 'GET', P); return { s: r.s, deleted: r.j?.data?.is_deleted, name: r.j?.data?.name || r.j?.data?.definition?.name };
};
for (const x of LED) { const r = await probe(x.type, x.id); const row = { ...x, ...r };
  if (r.s === 200 && !r.deleted) out.exists.push(row); else if (r.s === 404 || r.s === 410 || r.deleted) out.gone.push(row); else out.unknown.push(row); }
out.counts = { exists: out.exists.length, gone: out.gone.length, unknown: out.unknown.length };
return out;
