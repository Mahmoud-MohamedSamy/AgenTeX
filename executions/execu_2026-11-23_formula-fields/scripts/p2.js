const M = made.mod, LID = made.layouts[0], ACC = 'b2398920-2914-4836-be53-81bd960effea', OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const accs = L((await api('GET', `/modules/${ACC}/records?limit=3`)).j?.data); log('acc sample', JSON.stringify(accs[0]).slice(0, 400));
// make our own account
let aid = made.acc; if (!aid) { const ar = await api('POST', `/modules/${ACC}/records`, { data: data({ name: 'QA FX Acc' }) }); log('acc create', E(ar)); aid = made.acc = ar.j?.data?.id; keep(); if (aid) led('CRM account QA FX Acc ' + aid); }
const tries = {
 date: [{ qa_date: '2026-11-23' }], dt: [{ qa_dt: '2026-11-23T21:30:00Z' }],
 msel: [{ qa_msel: ['A', 'C'] }], check: [{ qa_check: true }],
 lookupStr: [{ qa_account: aid }], lookupRef: [{ qa_account: { kind: 'reference', value: aid } }], lookupObj: [{ qa_account: { kind: 'lookup', value: { id: aid } } }],
 userStr: [{ qa_user: OWNER }],
 sub1: [{ qa_items: { kind: 'array', items: [{ kind: 'object', value: { qty: 2, price: 10 } }] } }],
 sub2: [{ qa_items: [{ qty: 2, price: 10, note: 'x' }] }],
 sub3: [{ qa_items: { kind: 'subform', rows: [{ qty: { kind: 'number', value: 2 }, price: { kind: 'number', value: 10 } }] } }],
};
for (const [k, [v]] of Object.entries(tries)) {
  const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX fmt ' + k, ...v }) });
  if (r.j?.data?.id) { made.recs.push(r.j.data.id); keep(); }
  const back = r.j?.data?.data?.filter(x => Object.keys(v).includes(x.field));
  log(k, E(r), JSON.stringify(back || '').slice(0, 300));
}
