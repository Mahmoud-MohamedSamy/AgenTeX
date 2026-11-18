const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const r = await api('GET', '/modules/' + T + '/records?limit=5'); const L = arr(r.j);
log({ s: r.s, err: r.s >= 300 ? r.t.slice(0, 200) : undefined, newest: L.map(x => x.created_at + ' ' + x.source) });
const e = await api('GET', '/desk/channels/addresses'); log({ addr: arr(e.j?.data).filter(a => /qa-rt19-ntf/.test(a.address)).map(a => ({ receiving: a.mail?.receiving, last: a.mail?.last_received_at || a.last_received_at || a.mail?.last_message_at, status: a.mail?.status })) });
