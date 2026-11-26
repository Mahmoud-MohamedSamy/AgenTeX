const SA = 'ef8dc91f-1d30-491d-a1fc-9b62b96eca94'; const out = {};
const f = {}; for (const k of ['bp', 'bc1', 'bc2', 'ap', 'ac1', 'ac2']) { f[k] = (await mkTicket('O', 'QA TT V ' + k, { department: SA })).id; }
await api.O('POST', TK(f.bp) + '/children', { child_ticket_ids: [f.bc1, f.bc2] });
await api.O('POST', TK(f.ap) + '/children', { child_ticket_ids: [f.ac1, f.ac2] });
out.auto = E(await api.O('PUT', '/desk/tickets/parent-child/settings', { parent_close_behavior: 'none', auto_close_parent: true }));
await api.O('POST', TK(f.ac1) + '/close', {}); await api.O('POST', TK(f.ac2) + '/close', {}); await sleep(3000);
out.apStatus = (await getTicket(f.ap)).status;
out.block = E(await api.O('PUT', '/desk/tickets/parent-child/settings', { parent_close_behavior: 'block_while_children_open', auto_close_parent: true }));
ST.V = f; saveState(); return out;
