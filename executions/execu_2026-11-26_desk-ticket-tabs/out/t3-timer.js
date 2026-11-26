const out = {}; const id = ST.T.t1;
const t2 = await mkTicket('O', 'QA TT T second'); ST.T.t2 = t2.id; saveState();
const cur = async () => { const r = await api.O('GET', '/desk/timers/current'); return E(r) + ' ' + short(r.j?.data, 260); };
out.cur0 = await cur();
const n0 = arr((await api.O('GET', TK(id) + '/time-entries')).j?.data).length;
out.start = E(await api.O('POST', TK(id) + '/timer/start', {})); await sleep(4000);
out.cur1 = await cur();
out.pause = E(await api.O('POST', TK(id) + '/timer/pause', {})); await sleep(3000);
out.curPaused = await cur();
out.resume = E(await api.O('POST', TK(id) + '/timer/resume', {})); await sleep(3000);
// T-11 one timer at a time
const s2 = await api.O('POST', TK(t2.id) + '/timer/start', {}); out['T-11 start on second'] = E(s2) + ' ' + short(s2.j?.data, 200);
out.curAfterSecond = await cur();
// T-12 close while running (API)
const cl = await api.O('POST', TK(id) + '/close', {}); out['T-12 close running (POST close)'] = E(cl);
const st = await getTicket(id); out['T-12 status after'] = st.status;
// stop -> entry
const sp = await api.O('POST', TK(id) + '/timer/stop', { billing_type: 'billable', description: 'QA TT from timer' }); out.stop = E(sp) + ' ' + short(sp.j?.data, 400);
const n1 = arr((await api.O('GET', TK(id) + '/time-entries')).j?.data).length; out.entriesAdded = n1 - n0;
out.cur2 = await cur();
// T-10 discard
out.start2 = E(await api.O('POST', TK(id) + '/timer/start', {})); await sleep(2000);
out.discard = E(await api.O('DELETE', TK(id) + '/timer'));
out.entriesAfterDiscard = arr((await api.O('GET', TK(id) + '/time-entries')).j?.data).length - n1;
out.cur3 = await cur();
const h = await history(id); out.history = h.items.map(x => x.event_type || x.type).filter(Boolean).slice(0, 25).join(',');
return out;
