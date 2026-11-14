const g = await api('GET', '/desk/departments/31feced6-4027-4a6b-9dc3-8b5f934e0609'); out.dep = g.s + ' ' + g.t.slice(0, 300);
const a = await api('GET', '/desk/departments?include_deleted=true'); out.withDel = arr(D(a.j)).filter(d => /31feced6/.test(d.id)).map(d => JSON.stringify(d).slice(0, 300));
const h = await api('GET', '/desk/tickets/1cc330c1-be19-41b6-9cfd-f1ea3ade96d2/history'); out.hist = h.s + ' ' + h.t.slice(0, 600);
await go('/tickets/1cc330c1-be19-41b6-9cfd-f1ea3ade96d2', 12000); out.page = (await mtxt()).slice(0, 500); await shot('w5/W5-31-ticket-1366');
return fin({ out });
