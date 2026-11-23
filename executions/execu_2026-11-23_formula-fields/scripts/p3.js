const M = made.mod, LID = made.layouts[0], ACC = 'b2398920-2914-4836-be53-81bd960effea';
let aid = made.acc; if (!aid) { const ar = await api('POST', `/modules/${ACC}/records`, { data: data({ name: 'QA FX Acc', account_name: 'QA FX Acc' }) }); log('acc create', E(ar)); aid = made.acc = ar.j?.data?.id; keep(); if (aid) led('CRM account QA FX Acc ' + aid); }
const tries = { lookupObj: { qa_account: { id: aid, name: 'QA FX Acc' } }, lookupId: { qa_account: { id: aid } }, sub: { qa_items: [{ qty: 2, price: 10, note: 'x' }, { qty: 3, price: 1.5 }] } };
for (const [k, v] of Object.entries(tries)) {
  const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX fmt ' + k, ...v }) });
  if (r.j?.data?.id) { made.recs.push(r.j.data.id); keep(); }
  log(k, E(r), JSON.stringify(r.j?.data?.data?.filter(x => Object.keys(v).includes(x.field)) || '').slice(0, 500));
}
