const o = {};
for (const k of ['D1', 'D2']) { const r = await api.O('GET', `/modules/${T}/records?page_size=100&filters=${encodeURIComponent(JSON.stringify([{ field: 'department', op: 'eq', value: ST[k] }]))}`); const a = arr(r.j?.data).filter(x => JSON.stringify(x).includes(ST[k])); o[k] = r.s + ' n=' + a.length + ' ' + a.slice(0, 5).map(x => { const d = {}; for (const f of (x.data || [])) d[f.field] = f.value?.value; return d.subject; }).join(' | ');
  const dd = await api.O('GET', '/desk/departments/' + ST[k]); o[k + 'info'] = JSON.stringify(dd.j?.data).slice(0, 300); }
return o;
