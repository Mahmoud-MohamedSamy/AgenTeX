const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const L = arr((await api('GET', '/desk/integrations/crm/links?kind=contact&limit=50')).j?.data).find(l => l.sync_status === 'synced');
let tid = null; if (L) { const tk = await api('GET', `/desk/integrations/crm/tickets/for-record?kind=contact&desk_record_id=${L.desk_record_id}`); tid = arr(tk.j?.data)[0]?.id; }
const list = arr((await api('GET', `/modules/${T}/records?page=1&per_page=50`)).j?.data).map(x => ({ id: x.id, c: (x.data || []).find(d => d.field === 'contact_id')?.value?.value })).filter(x => x.c);
return done({ link: L && L.desk_record_id, tid, sample: list.slice(0, 5) });
