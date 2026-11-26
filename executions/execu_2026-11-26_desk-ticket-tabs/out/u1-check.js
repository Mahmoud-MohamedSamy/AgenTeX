const out = {};
out.u1status = (await getTicket(ST.U.u1)).status;
const h = await api.O('GET', TK(ST.U.u1) + '/history'); out.u1hist = arr(h.j?.data?.items || h.j?.data).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + (x.new_value ? '=' + String(JSON.stringify(x.new_value)).slice(0, 20) : '')).join(' | ');
const a = await api.O('GET', TK(ST.RN.a) + '/history'); out.aStatusNow = (await getTicket(ST.RN.a)).status;
const cur = await api.O('GET', '/desk/timers/current'); out.timer = cur.s + ' ' + short(cur.j?.data && { t: cur.j.data.ticket_number, state: cur.j.data.state, sec: cur.j.data.elapsed_seconds }, 120);
return out;
