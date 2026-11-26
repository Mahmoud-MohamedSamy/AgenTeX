const out = {};
for (const k of ['a', 'b']) {
  out[k + ' status'] = (await getTicket(ST.RN[k])).status;
  for (const p of ['/replies', '/conversation', '/threads', '/messages']) { const r = await api.O('GET', TK(ST.RN[k]) + p); if (r.s === 200) { const l = arr(r.j?.data?.items || r.j?.data?.replies || r.j?.data?.threads || r.j?.data); out[k + ' ' + p] = l.length + ' ' + l.map(x => (x.kind || x.type || '') + ':' + (x.status || x.delivery_status || '') + ':' + String(x.subject || x.summary || x.content_text || x.content || '').replace(/<[^>]+>/g, '').slice(0, 90)).join(' || '); break; } else out[k + ' ' + p] = r.s; }
  const h = await api.O('GET', TK(ST.RN[k]) + '/history'); out[k + ' history'] = h.s + ' ' + arr(h.j?.data?.items || h.j?.data?.events || h.j?.data).map(x => x.event_type || x.type).join(',').slice(0, 300);
}
return out;
