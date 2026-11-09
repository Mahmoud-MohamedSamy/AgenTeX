const out = {}; let l = null;
for (let p = 1; p <= 2 && !l; p++) l = arr((await api('o', 'GET', `/modules/${T.LEADS}/records?page=${p}`)).j?.data).find(x => JSON.stringify(x.data).includes('QA RT 2321 lead imp'))?.id;
out.lead = l; if (l) ledger(`lead ${l} "QA RT 2321 lead imp" (import)`);
if (l) { await sleep(10000); out.ownerIsU1 = (await X.field('o', T.LEADS, l, 'owner')) === T.U1;
  out.feed = arr((await api('o', 'GET', `/timeline/records/leads/${l}/feed`)).j?.data).reverse().map(e => [e.entry_type, e.actor_display, e.is_automated, e.field_key || '', e.description || '', e.references_json].join(' | ').replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 300)); }
const ar = arr((await api('o', 'GET', '/workflow/assignment-rules')).j?.data).find(x => /^QA RT 2321 AR/.test(x.name)); const cur = (await api('o', 'GET', '/workflow/assignment-rules/' + ar.id)).j?.data;
out.arOff = (await api('o', 'PATCH', '/workflow/assignment-rules/' + ar.id, { ...cur, isActive: false })).s;
return out;
