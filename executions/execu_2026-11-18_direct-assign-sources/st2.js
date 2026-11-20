const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const s = await api('GET', '/desk/ticket-statuses'); const S = arr(s.j?.data ?? s.j);
log({ ticketStatuses: s.s, count: S.length, sample: S.slice(0, 6).map(x => ({ value: x.value, type: x.type, configured: x.configured, hc: x.show_in_help_center })), keys: S[0] ? Object.keys(S[0]).join(',') : s.t.slice(0, 200) });
const L = arr((await api('GET', '/modules/' + TK + '/records?limit=5')).j); log({ listKeys: L[0] ? Object.keys(L[0]).join(',') : 'none' });
const id = L[0]?.id; const r = await api('GET', '/modules/' + TK + '/records/' + id); const d = r.j?.data?.data || [];
log({ recordStatusFields: d.filter(x => /status|type|closed/i.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value)) });
const t = await api('GET', '/desk/tickets/' + id); log({ deskTicket: t.s, statusLike: t.j?.data ? Object.entries(t.j.data).filter(([k]) => /status|type|closed/i.test(k)).map(([k, v]) => k + '=' + JSON.stringify(v).slice(0, 80)) : t.t.slice(0, 150) });
