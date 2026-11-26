const o = {};
const L = arr((await api('GET', `/modules/${M.leads}/records?page=1&per_page=20&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA TIA CRUD' }]))}`)).j?.data);
o.leads = L.map(x => ({ id: x.id, src: x.lead_source || x.data?.lead_source, name: (x.first_name || x.data?.first_name) + ' ' + (x.last_name || x.data?.last_name) }));
const F = arr((await api('GET', `/modules/${M.leads}/fields`)).j?.data); o.fields = F.filter(f => /QA TIA CRUD/i.test(f.label || f.name || '')).map(f => ({ id: f.id, label: f.label, key: f.api_name || f.key || f.name }));
const W = arr((await api('GET', '/workflow/rules?limit=200')).j?.data); o.rules = W.filter(r => /QA TIA CRUD/i.test(r.name || '')).map(r => ({ id: r.id, name: r.name, active: r.is_active ?? r.active ?? r.status }));
o.rulesTotal = W.length;
return o;
