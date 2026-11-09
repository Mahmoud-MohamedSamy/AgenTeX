// Round 9 cleanup: which of the exact ids still exist, and the DELETE error for each (one try, read the message).
const P = JSON.parse(process.env.CLEAN_IDS); const out = [];
const MID = { LEADS: T.LEADS, TASKS: T.TASKS, CONTACTS: T.CONTACTS };
for (const x of P.approvals) { const g = await api('o', 'GET', `/workflow/approval-processes/${x.id}`); if (g.s === 200) { const d = await api('o', 'DELETE', `/workflow/approval-processes/${x.id}`); out.push(['approval', x.id.slice(0, 8), g.j?.data?.name, d.s, (d.j?.error?.message || '').slice(0, 160)]); } }
for (const x of P.blueprints) { const g = await api('o', 'GET', `/modules/${x.module}/blueprints/${x.id}`); if (g.s === 200) { const d = await api('o', 'DELETE', `/modules/${x.module}/blueprints/${x.id}`); out.push(['blueprint', x.id.slice(0, 8), g.j?.data?.definition?.name, d.s, (d.j?.error?.message || '').slice(0, 160)]); } }
for (const x of P.records) { const m = x.mid || MID[x.m]; const g = await api('o', 'GET', `/modules/${m}/records/${x.id}`); if (g.s === 200 && !g.j?.data?.is_deleted) { const d = await api('o', 'DELETE', `/modules/${m}/records/${x.id}`); const nm = (g.j?.data?.data || []).find(f => f.field === 'first_name' || f.field === 'subject')?.value?.value; out.push(['record', x.m || 'other', nm, d.s, (d.j?.error?.code || '') + ' ' + (d.j?.error?.message || '').slice(0, 160)]); } }
return out;
