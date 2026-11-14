const TM = '88e8ea44-1658-4df3-9930-d0902b91073d';
for (const n of ['1363', '1366']) { const f = [{ field: 'ticket_number', operator: 'equals', value: n }]; const r = await api('GET', '/modules/' + TM + '/records?page=1&per_page=5&filters=' + encodeURIComponent(JSON.stringify(f))); const xs = arr(D(r.j)); out['t' + n] = xs.map(x => { const o = { id: x.id, is_deleted: x.is_deleted }; for (const d of x.data) if (/department|status|subject|merged|spam|archiv/.test(d.field)) o[d.field] = d.value && d.value.value; return o; }); }
const rb = await api('GET', '/audit/recycle-bin/items?limit=200&app=desk'); out.binMatch = arr(D(rb.j)).filter(i => /1363|1364|1365|1366/.test(i.record_label)).map(i => i.record_label);
for (const k of Object.keys(out)) if (k.startsWith('t') && out[k][0]) { const g = await api('GET', '/desk/tickets/' + out[k][0].id); out['d' + k] = g.s + ' ' + g.t.slice(0, 250); }
return fin({ out });
