const r = await ask('Search tickets for "Call".', { page: { app: 'desk' } });
const refs = r.final?.refs || []; const o = { text: (r.text || r.final?.text || '').slice(0, 200), nrefs: refs.length, check: [] };
for (const x of refs.slice(0, 12)) { const g = await api('GET', `/modules/${x.module_id}/records/${x.record_id}`); o.check.push((x.label || '').slice(0, 30) + ' mod=' + String(x.module_id).slice(0, 8) + ' rstGET=' + g.s); }
const tk = await api('GET', `/modules/${M.tickets}/records?page=1&per_page=100&filters=${encodeURIComponent(JSON.stringify([{ field: 'subject', operator: 'contains', value: 'call' }]))}`); o.rstTicketsWithCall = tk.s + ' ' + arr(tk.j?.data).length;
return o;
