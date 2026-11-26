const out = {}; const U = ST.U;
const items = arr((await api.O('GET', '/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data);
const it = items.find(i => /QA TT UI child 2/.test(JSON.stringify([i.record_label, i.name, i.title])));
out['P-13 in bin'] = it ? 'yes ' + it.id + ' keys=' + Object.keys(it).join(',') : 'no (' + items.length + ')';
if (it) { const r = await api.O('POST', '/audit/recycle-bin/restore', { ids: [it.id] }); out['P-13 restore'] = E(r); await sleep(3000);
  const h = await api.O('GET', TK(U.u2) + '/parent-child'); out['P-13 parent after restore'] = 'count=' + h.j?.data?.child_count + ' ' + (h.j?.data?.children || []).map(c => c.ticket_number).join(',');
  const hc = await api.O('GET', TK(U.c2) + '/parent-child'); out['P-13 child after restore'] = short(hc.j?.data && { role: hc.j.data.role, parent: hc.j.data.parent?.ticket_number }, 100); }
// P-15 merge child c1 into target
const tgt = ST.tickets['QA TT P merge target'];
const m = await api.O('POST', '/desk/tickets/merge', { master_ticket_id: tgt, ticket_ids: [U.c1], source_ticket_ids: [U.c1], cc_list_from: 'target' }); out['P-15 merge'] = E(m).slice(0, 220);
await sleep(3000);
const h4 = await api.O('GET', TK(U.u2) + '/parent-child'); out['P-15 parent after merge'] = 'count=' + h4.j?.data?.child_count + ' ' + (h4.j?.data?.children || []).map(c => c.ticket_number + ':' + c.status).join(',');
const hc1 = await api.O('GET', TK(U.c1) + '/parent-child'); out['P-15 merged child'] = hc1.s + ' ' + short(hc1.j?.data && { role: hc1.j.data.role, parent: hc1.j.data.parent?.ticket_number }, 100) + ' status=' + (await getTicket(U.c1)).status;
// T-17 modules list
const mods = await api.O('GET', '/modules?app_key=desk'); out['T-17 modules'] = arr(mods.j?.data?.modules || mods.j?.data).map(m => m.name || m.module_key || m.api_name).join(', ');
return out;
