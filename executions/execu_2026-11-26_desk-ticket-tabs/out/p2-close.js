const out = {}; const P = ST.P;
const hc = await api.C('GET', TK(P.P) + '/parent-child'); out['P-07 C counts'] = { children: (hc.j?.data?.children || []).map(c => c.ticket_number + ' ' + c.department_name), hidden: hc.j?.data?.hidden_count };
const ho = await api.O('GET', TK(P.P) + '/parent-child'); out['P-07 O counts'] = { children: (ho.j?.data?.children || []).map(c => c.ticket_number + ' ' + c.department_name), hidden: ho.j?.data?.hidden_count };
const base = (await api.O('GET', '/desk/tickets/parent-child/settings')).j?.data;
const setS = b => api.O('PUT', '/desk/tickets/parent-child/settings', b);
const fam = async tag => { const p = await mkTicket('O', 'QA TT PC ' + tag + ' parent'); const a = await mkTicket('O', 'QA TT PC ' + tag + ' c1'); const b = await mkTicket('O', 'QA TT PC ' + tag + ' c2'); await api.O('POST', TK(p.id) + '/children', { child_ticket_ids: [a.id, b.id] }); return { p: p.id, a: a.id, b: b.id }; };
const st = async id => (await getTicket(id)).status;
const close = (id, body = {}) => api.O('POST', TK(id) + '/close', body);
try {
  // P-08 none
  out['set none'] = E(await setS({ parent_close_behavior: 'none', auto_close_parent: false }));
  let f = await fam('none'); out['P-08 close parent'] = E(await close(f.p)); out['P-08 states'] = [await st(f.p), await st(f.a), await st(f.b)];
  // P-09 close children
  out['set close_children'] = E(await setS({ parent_close_behavior: 'close_children', auto_close_parent: false }));
  f = await fam('cc'); out['P-09 close parent'] = E(await close(f.p)); await sleep(3000); out['P-09 states'] = [await st(f.p), await st(f.a), await st(f.b)];
  // P-10 block
  const r10 = await setS({ parent_close_behavior: 'block_while_open', auto_close_parent: false }); out['set block'] = E(r10);
  f = await fam('blk'); const c10 = await close(f.p); out['P-10 close parent'] = E(c10);
  out['P-10 close with children'] = E(await close(f.p, { close_children: true })); await sleep(3000); out['P-10 states'] = [await st(f.p), await st(f.a), await st(f.b)];
  // bypass via record status update
  const f2 = await fam('blk2'); const pr = await api.O('PATCH', `/modules/${T}/records/${f2.p}`, { data: [{ field: 'status', value: enc('Closed') }] }); out['P-10 bypass PATCH status Closed'] = E(pr) + ' -> ' + (await st(f2.p)) + ' children ' + [await st(f2.a), await st(f2.b)];
  ST.P.blk2 = f2; saveState();
  // P-11 auto close parent
  out['set auto'] = E(await setS({ parent_close_behavior: 'none', auto_close_parent: true }));
  f = await fam('auto'); await close(f.a); out['P-11 after c1'] = await st(f.p); await close(f.b); await sleep(3000); out['P-11 after c2'] = await st(f.p);
  // P-12 reopen child -> parent
  const ro = await api.O('POST', TK(f.a) + '/reopen', {}); await sleep(3000); out['P-12 reopen child (button)'] = E(ro) + ' parent=' + (await st(f.p));
  await close(f.a); await sleep(2000); out['P-12 parent after re-close'] = await st(f.p);
  const pa = await api.O('PATCH', `/modules/${T}/records/${f.b}`, { data: [{ field: 'status', value: enc('Open') }] }); await sleep(3000); out['P-12 child Open via status field'] = E(pa) + ' parent=' + (await st(f.p));
} finally {
  out.restore = E(await setS(base)); out.restored = short((await api.O('GET', '/desk/tickets/parent-child/settings')).j?.data);
}
return out;
