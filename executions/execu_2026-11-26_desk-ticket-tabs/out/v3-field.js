const out = {}; const SA = 'ef8dc91f-1d30-491d-a1fc-9b62b96eca94';
out.set = E(await api.O('PUT', '/desk/tickets/parent-child/settings', { parent_close_behavior: 'none', auto_close_parent: true }));
try {
  const p = (await mkTicket('O', 'QA TT W parent', { department: SA })).id, a = (await mkTicket('O', 'QA TT W c1', { department: SA })).id;
  await api.O('POST', TK(p) + '/children', { child_ticket_ids: [a] });
  await api.O('POST', TK(a) + '/close', {});
  out.parentAfterClose = await waitFor(async () => (await getTicket(p)).status === 'Closed' ? 'Closed' : null, 30) || (await getTicket(p)).status;
  out.patch = E(await api.O('PATCH', `/modules/${T}/records/${a}`, { data: [{ field: 'status', value: enc('Open') }] }));
  out.child = (await getTicket(a)).status;
  out.parentAfter20s = await waitFor(async () => (await getTicket(p)).status === 'Open' ? 'Open' : null, 25) || (await getTicket(p)).status;
  // API reopen path with wait
  await api.O('POST', TK(a) + '/close', {}); await waitFor(async () => (await getTicket(p)).status === 'Closed' ? 1 : null, 30);
  out.reopen = E(await api.O('POST', TK(a) + '/reopen', {}));
  out.parentAfterReopen = await waitFor(async () => (await getTicket(p)).status === 'Open' ? 'Open' : null, 25) || (await getTicket(p)).status;
} finally { out.restore = E(await api.O('PUT', '/desk/tickets/parent-child/settings', { parent_close_behavior: 'none', auto_close_parent: false })); }
return out;
