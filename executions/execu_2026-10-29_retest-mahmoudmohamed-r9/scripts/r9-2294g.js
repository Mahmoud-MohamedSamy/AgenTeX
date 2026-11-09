// NDC-2294 item 2: the imported row "QA RT 2294 MA" waits for approval; no lead before approval, a lead after.
const out = {}; const B = `/modules/${T.LEADS}/records/pending-approval`;
const findLead = async () => { for (let p = 1; p <= 2; p++) { const a = arr((await api('o', 'GET', `/modules/${T.LEADS}/records?page=${p}`)).j?.data); const h = a.find(x => JSON.stringify(x.data).includes('QA RT 2294 MA')); if (h) return h.id; } return null; };
const pend = await api('o', 'GET', B + '?page=1&per_page=50'); const rows = arr(pend.j?.data);
const mine = rows.filter(r => JSON.stringify(r).includes('QA RT 2294 MA'));
out.count = (await api('o', 'GET', B + '/count')).t.slice(0, 120); out.pending = pend.s + ' total ' + rows.length + ' mine ' + mine.length + ' keys ' + JSON.stringify(Object.keys(mine[0] || rows[0] || {}));
out.leadBefore = await findLead();
if (mine[0]) {
  const id = mine[0].id || mine[0].pendingId || mine[0].recordId;
  let r = await api('o', 'POST', B + '/approve', { ids: [id] }); out.approve = r.s + ' ' + r.t.slice(0, 300);
  if (r.s >= 400) { r = await api('o', 'POST', B + '/approve', { id }); out.approve2 = r.s + ' ' + r.t.slice(0, 300); }
  await sleep(8000); out.leadAfter = await findLead(); if (out.leadAfter) ledger(`lead ${out.leadAfter} "QA RT 2294 MA" (import approved, NDC-2294 item 2)`);
  out.pendingAfter = arr((await api('o', 'GET', B + '?page=1&per_page=50')).j?.data).filter(r => JSON.stringify(r).includes('QA RT 2294 MA')).length;
}
return out;
