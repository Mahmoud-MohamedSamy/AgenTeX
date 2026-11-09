const o = as(OWNER); const ownerId = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const t = Date.now() % 100000; const created = { cases: [], po: [], so: [] };
const N = v => ({ kind: 'number', value: v }), ARR = a => ({ kind: 'array', items: a.map(x => ({ kind: 'string', value: x })) });
const mk = async (k, f) => { const r = await o.post(`/modules/${MODS[k]}/records`, { layout_id: LAY[k], data: enc(f) }); if (r.s < 300) created[k].push(r.j.data.id); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 260) : ''); };
const today = new Date().toISOString().slice(0, 10);
out.caseMulti = await mk('cases', { name: `QA R2W2 Case M ${t}`, subject: `QA R2W2 Case M ${t}`, status: 'New', case_origin: 'Web', multi_select: ARR(['Option 1', 'قنا']), owner: ownerId });
if (created.cases[0]) { const g = await o.get(`/modules/${MODS.cases}/records/${created.cases[0]}`); out.caseMultiRead = JSON.stringify(val(g.j, 'multi_select')); }
out.po = await mk('po', { name: `QA R2W2 PO ${t}`, subject: `QA R2W2 PO ${t}`, po_date: today, due_date: today, carrier: 'DHL', status: 'Created', tax: N(12.5), discount: N(5), currency: 'EGP', exchange_rate: N(1.25), owner: ownerId });
if (created.po[0]) { const g = await o.get(`/modules/${MODS.po}/records/${created.po[0]}`); out.poRead = ['po_date', 'due_date', 'carrier', 'tax', 'discount', 'currency', 'exchange_rate'].map(f => f + '=' + JSON.stringify(val(g.j, f))).join('; ');
  out.poMU = (await o.post(`/modules/${MODS.po}/records/mass-update`, { record_ids: [created.po[0]], data: enc({ status: 'Approved', tax: N(20) }) })).s;
  const g2 = await o.get(`/modules/${MODS.po}/records/${created.po[0]}`); out.poAfterMU = val(g2.j, 'status') + ' / tax ' + val(g2.j, 'tax');
  out.poDel = (await o.del(`/modules/${MODS.po}/records/${created.po[0]}`)).s; }
out.so = await mk('so', { name: `QA R2W2 SO ${t}`, subject: `QA R2W2 SO ${t}`, status: 'S', branch: 'Mansoura', mobile: N(1012345678), email: 'qa.so@example.com', date_of_birth: '1990-05-01', amount: N(1500), owner: ownerId });
if (created.so[0]) { const g = await o.get(`/modules/${MODS.so}/records/${created.so[0]}`); out.soRead = ['branch', 'mobile', 'email', 'date_of_birth', 'amount'].map(f => f + '=' + JSON.stringify(val(g.j, f))).join('; '); }
// clone (R13): any clone endpoint?
const src = created.cases[0];
for (const p of [`/modules/${MODS.cases}/records/${src}/clone`, `/modules/${MODS.cases}/records/${src}/duplicate`]) out['clone ' + p.split('/').pop()] = (await o.post(p, {})).s;
// related lists of a case (R14)
out.relatedLists = (await o.get(`/modules/${MODS.cases}/records/${src}/related-lists`)).t.slice(0, 300);
out.created = created;
