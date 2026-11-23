const w0 = null;
const st = await api('GET', '/agents/tia/status');
const r = await ask('How many open tickets are there?');
const caps = await api('GET', '/agents/tia/capabilities');
const conv = await api('GET', '/agents/tia/conversations');
const okStatus = st.j?.data?.available === false || st.s === 403;
const okTurn = !r.text && (r.status === 403 || r.error || r.notStream);
result('A-04', okStatus && okTurn ? 'Pass' : 'Fail', `NOP status ${st.s} ${JSON.stringify(st.j?.data||st.j?.error)}; turn ${r.status} ${r.error||r.j?.error?.code||''} text=${(r.text||'').length}; caps ${caps.s}; convs ${conv.s}`);
return { st: st.j, turn: short(r), caps: caps.s, capsErr: caps.j?.error, conv: conv.s };
