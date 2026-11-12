// W5-03 long name
out.long = await mk(CM, 'contact', 'QA GL W5 long', { first_name: 'QA GL W5', last_name: 'L'.repeat(300) });
if (out.long.id) { const g = await get(CM, out.long.id); out.longLen = (g.last_name || '').length; }
// W5-04 edit, delete, restore
const e = await api('PATCH', '/modules/' + CM + '/records/' + C1, { data: [{ field: 'phone', value: sv('+201000000599') }] }); out.edit = e.s + ' ' + (e.s >= 300 ? e.t.slice(0, 150) : '');
out.phoneNow = (await get(CM, C1)).phone;
const tmp = await mk(CM, 'contact', 'QA GL W5 del', { first_name: 'QA GL W5', last_name: 'Delete me', email: 'qa-gl-w5-del@example.com' }); out.tmp = tmp;
if (tmp.id) { const d = await api('DELETE', '/modules/' + CM + '/records/' + tmp.id); out.del = d.s; await sleep(2500);
  const b = await api('GET', '/audit/recycle-bin/items?limit=100&app=desk'); const it = arr(D(b.j)).find(x => x.record_id === tmp.id); out.inBin = it ? it.record_label : 'not found';
  if (it) { const r = await api('POST', '/audit/recycle-bin/restore', { ids: [it.id] }); out.restore = r.s; await sleep(2000); out.afterRestore = (await api('GET', '/modules/' + CM + '/records/' + tmp.id)).s; } }
// W5-06 Arabic
out.ar = await mk(CM, 'contact', 'QA GL W5 Arabic', { first_name: 'QA GL W5', last_name: 'محمد عربي', description: 'ملاحظة باللغة العربية', email: 'qa-gl-w5-ar@example.com' });
if (out.ar.id) { const g = await get(CM, out.ar.id); out.arBack = g.last_name + ' / ' + g.description; }
// W5-05 duplicates
out.d1 = await mk(CM, 'contact', 'QA GL W5 Dup A', { first_name: 'QA GL W5', last_name: 'Dup', email: 'qa-gl-w5-dup@example.com' });
out.d2 = await mk(CM, 'contact', 'QA GL W5 Dup B', { first_name: 'QA GL W5', last_name: 'Dup', email: 'qa-gl-w5-dup@example.com' });
// W5-07 view
const v = await api('POST', '/modules/' + CM + '/views', { name: 'QA GL W5 view', kind: 'list', visibility: 'private', settings: { criteria: { pattern: '1', conditions: [{ field: 'first_name', operator: 'contains', value: 'QA GL W5' }] } } });
out.view = v.s + ' ' + (v.s >= 300 ? v.t.slice(0, 200) : ''); const vid = v.j && v.j.data && v.j.data.id; if (vid) { CREATED.push({ kind: 'view', id: vid, name: 'QA GL W5 view', mod: CM });
  const rr = await api('GET', '/modules/' + CM + '/records?view_id=' + vid + '&limit=50'); out.viewRows = arr(D(rr.j)).map(flat).map(x => x.last_name).join(', ').slice(0, 300); }
return fin({ out });
