const out = {}; const P = {};
for (const k of ['P', 'C1', 'C2', 'C3', 'X']) { const t = await mkTicket('O', 'QA TT P ' + k); P[k] = t.id; }
const m = await mkTicket('O', 'QA TT P MKT child', { department: ST.MK }); P.M = m.id;
ST.P = P; saveState();
const hier = async (id, who = 'O') => { const r = await api[who]('GET', TK(id) + '/parent-child'); return { s: r.s, d: r.j?.data }; };
const h0 = await hier(P.P); out.empty = h0.s + ' ' + short(h0.d, 300);
const e1 = await api.O('POST', TK(P.P) + '/children', {}); out.emptyLink = E(e1);
const l1 = await api.O('POST', TK(P.P) + '/children', { child_ticket_ids: [P.C1, P.C2] }); out['P-02 link 2'] = E(l1) + ' ' + short(l1.j?.data, 300);
const h1 = await hier(P.P); out['P-02 hier'] = short(h1.d, 500);
const sp = await api.O('PUT', TK(P.C3) + '/parent', { parent_ticket_id: P.P }); out['P-03 set parent'] = E(sp);
const h3 = await hier(P.C3); out['P-03 child view'] = short(h3.d, 500);
// P-04 rules
out['P-04 grandchild'] = E(await api.O('POST', TK(P.C1) + '/children', { child_ticket_ids: [P.X] }));
out['P-04 second parent'] = E(await api.O('PUT', TK(P.C1) + '/parent', { parent_ticket_id: P.X }));
out['P-04 parent as child of child'] = E(await api.O('PUT', TK(P.P) + '/parent', { parent_ticket_id: P.C1 }));
out['P-04 self'] = E(await api.O('POST', TK(P.X) + '/children', { child_ticket_ids: [P.X] }));
out['P-04 cross-dept child'] = E(await api.O('POST', TK(P.P) + '/children', { child_ticket_ids: [P.M] }));
// P-07 C view
const hc = await hier(P.P, 'C'); out['P-07 C hier'] = hc.s + ' ' + short(hc.d, 500);
// P-14 settings by C
const sOld = (await api.O('GET', '/desk/tickets/parent-child/settings')).j?.data;
out['P-14 C PUT settings same values'] = E(await api.C('PUT', '/desk/tickets/parent-child/settings', sOld));
out['P-14 C GET settings'] = E(await api.C('GET', '/desk/tickets/parent-child/settings'));
// P-06 unlink
out['P-06 unlink child from parent'] = E(await api.O('DELETE', TK(P.P) + '/children/' + P.C2));
out['P-06 unlink from parent on child'] = E(await api.O('DELETE', TK(P.C3) + '/parent'));
const h6 = await hier(P.P); out['P-06 after'] = short(h6.d, 400);
// C links/unlinks
out['C unlink'] = E(await api.C('DELETE', TK(P.P) + '/children/' + P.C1));
out['C relink'] = E(await api.C('POST', TK(P.P) + '/children', { child_ticket_ids: [P.C1] }));
const hP = await history(P.P); out.histP = hP.items.map(x => x.event_type || x.type).filter(Boolean).slice(0, 15).join(',');
const hC = await history(P.C2); out.histC2 = hC.items.map(x => x.event_type || x.type).filter(Boolean).slice(0, 10).join(',');
return out;
