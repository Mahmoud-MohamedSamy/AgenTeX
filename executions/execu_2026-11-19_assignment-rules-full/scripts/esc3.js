const o = {}; for (const k of ['ESC_Y2', 'ESC_N2']) { const id = IDS['TK_'+k]; const f = fl((await api('GET', '/modules/' + T + '/records/' + id)).j.data); o[k] = { owner: await ownN(id), ...Object.fromEntries(Object.entries(f).filter(([x]) => /escal|sla|modified/i.test(x))) }; }
const h = (await api('GET', '/desk/tickets/' + IDS.TK_ESC_Y2 + '/history')).j; o.hist = ((h && h.data && (h.data.items || h.data.events || h.data)) || []).map(e => (e.occurred_at || '').slice(11, 19) + ' ' + e.action + ' ' + (e.field_key || '') + ' ' + JSON.stringify(e.old_value) + '->' + JSON.stringify(e.new_value));
const s = (await api('GET', '/desk/tickets/' + IDS.TK_ESC_Y2 + '/sla')).j; o.sla = JSON.stringify(s && s.data).slice(0, 700);
return o;
