const out = {}; const U = ST.U; const SA = 'ef8dc91f-1d30-491d-a1fc-9b62b96eca94';
const res = async id => { const d = (await api.O('GET', TK(id))).j?.data; return (d?.ticket || d)?.resolution?.content; };
// R-12 bulk
const b = await api.O('POST', '/desk/tickets/bulk/resolution', { ticket_ids: [U.b1, U.b2], resolution: '<p>QA TT bulk resolution</p>' });
out['R-12'] = E(b) + ' ' + short(b.j?.data, 200) + ' | b1=' + (await res(U.b1)) + ' b2=' + (await res(U.b2));
out['R-12 empty'] = E(await api.O('POST', '/desk/tickets/bulk/resolution', { ticket_ids: [U.b1], resolution: '' }));
out['R-12 C on mkt'] = E(await api.C('POST', '/desk/tickets/bulk/resolution', { ticket_ids: [ST.R.t3], resolution: '<p>QA TT C bulk</p>' })) + ' mkt res=' + (await res(ST.R.t3));
// R-14 closed ticket (U1 closed in UI)
out['R-14 status'] = (await getTicket(U.u1)).status;
out['R-14 put on closed'] = E(await api.O('PUT', TK(U.u1) + '/resolution', { content: '<p>QA TT resolution on closed</p>', notify_contact: false }));
// R-13 macro discovery
for (const p of ['/desk/macros', '/desk/macros?page_size=5']) { const r = await api.O('GET', p); out['macro ' + p] = r.s + ' ' + short(r.j?.data, 200); if (r.s === 200) break; }
// T-17 Time Entries module
const mods = await api.O('GET', '/modules?app_key=desk'); const ml = arr(mods.j?.data?.modules || mods.j?.data);
const te = ml.find(m => /time/i.test(m.module_key || m.name || m.api_name || ''));
out['T-17 module'] = te ? (te.name || te.module_key) + ' ' + te.id : 'not found (' + mods.s + ', n=' + ml.length + ')';
if (te) { const r = await api.O('GET', `/modules/${te.id}/records?page_size=5&sort=-created_at`); const rows = arr(r.j?.data?.records || r.j?.data); out['T-17 rows'] = r.s + ' n=' + rows.length + ' ' + short(rows[0], 300); }
// P-05 max children
const h = await api.O('GET', TK(U.u2) + '/parent-child'); out['P-05 max'] = h.j?.data?.max_children + ' current=' + h.j?.data?.child_count;
// P-13 delete child then restore
const del = await api.O('DELETE', `/modules/${T}/records/${U.c2}`); out['P-13 delete child'] = E(del);
const h2 = await api.O('GET', TK(U.u2) + '/parent-child'); out['P-13 parent after delete'] = 'count=' + h2.j?.data?.child_count + ' ' + (h2.j?.data?.children || []).map(c => c.ticket_number).join(',');
const bin = await api.O('GET', '/audit/recycle-bin?page_size=50&app_key=desk'); const bi = arr(bin.j?.data?.items || bin.j?.data).find(x => (x.record_id || x.entity_id || x.id) === U.c2 || JSON.stringify(x).includes(U.c2));
out['P-13 in bin'] = bin.s + ' ' + (bi ? 'yes ' + (bi.id || '') : 'no');
if (bi) { const rr = await api.O('POST', `/audit/recycle-bin/${bi.id}/restore`, {}); out['P-13 restore'] = E(rr); await sleep(2000); const h3 = await api.O('GET', TK(U.u2) + '/parent-child'); out['P-13 parent after restore'] = 'count=' + h3.j?.data?.child_count + ' ' + (h3.j?.data?.children || []).map(c => c.ticket_number).join(','); }
// P-15 merge child c1 into loose? (x is a child too) -> merge c1 into a new standalone ticket
const tgt = await mkTicket('O', 'QA TT P merge target', { department: SA });
for (const [p, b2] of [['/desk/tickets/merge', { master_ticket_id: tgt.id, ticket_ids: [U.c1] }], [TK(tgt.id) + '/merge', { ticket_ids: [U.c1] }]]) { const r = await api.O('POST', p, b2); out['P-15 ' + p.replace(/[0-9a-f-]{36}/, '{id}')] = E(r).slice(0, 200); if (r.s < 300) break; }
const h4 = await api.O('GET', TK(U.u2) + '/parent-child'); out['P-15 parent after merge'] = 'count=' + h4.j?.data?.child_count + ' ' + (h4.j?.data?.children || []).map(c => c.ticket_number + ':' + c.status).join(',');
const h5 = await api.O('GET', TK(tgt.id) + '/parent-child'); out['P-15 target'] = short(h5.j?.data && { role: h5.j.data.role, parent: h5.j.data.parent?.ticket_number }, 120);
return out;
