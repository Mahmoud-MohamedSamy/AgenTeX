const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const out = {};
for (const q of ['page=1&page_size=1', 'page=1&page_size=200']) { const r = await api('GET', `/modules/${T}/records?${q}`); out[q] = { s: r.s, n: arr(r.j?.data).length, meta: JSON.stringify(r.j?.meta || {}).slice(0, 200), err: r.j?.error?.code }; }
const r = await api('GET', `/modules/${T}/records?page=1&page_size=200`);
const rows = arr(r.j?.data).map(x => { const o = {}; for (const f of (x.data || [])) o[f.field] = f.value?.value ?? f.value; return o; });
const by = {}; for (const o of rows) { const k = (o.status || '?') + ' | dept ' + String(o.department || '').slice(0, 8); by[k] = (by[k] || 0) + 1; }
return { out, by, qa: rows.filter(o => /QA TIA/.test(o.subject || '')).map(o => o.subject + ':' + o.status) };
