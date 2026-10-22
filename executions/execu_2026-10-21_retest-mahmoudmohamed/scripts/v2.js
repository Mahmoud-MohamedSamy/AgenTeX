const L = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const me = await api('GET', `/audit/events?limit=3&app_key=metadata-engine`);
const t0 = new Date().toISOString();
const c = await api('POST', `/modules/${L}/records`, { data: [{ field: 'deal_name', value: { kind: 'string', value: 'QA RT audit probe' } }, { field: 'amount', value: { kind: 'number', value: 1 } }] });
const id = c.j?.data?.id;
const u = id ? await api('PATCH', `/modules/${L}/records/${id}`, { data: [{ field: 'amount', value: { kind: 'number', value: 2 } }] }) : null;
let found = []; for (let i = 0; i < 12 && !found.length; i++) { await sleep(10000); const ev = await api('GET', `/audit/events?limit=20&app_key=crm`); found = arr(ev.j?.data).filter(x => x.occurred_at >= t0.slice(0, 19)).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + ' ' + (x.target_label || '')); }
return done({ metaNewest: arr(me.j?.data).map(x => x.occurred_at.slice(0, 19) + ' ' + x.action + ' ' + x.target_type), t0, create: c.s, id, update: u && u.s, eventsAfter2min: found });
