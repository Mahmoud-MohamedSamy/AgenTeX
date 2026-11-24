const out = [];
const one = async tag => { const st = await api('GET', '/agents/tia/status'); const r = await ask('Reply with OK'); out.push(`${tag} ${new Date().toISOString().slice(11,19)}: status ${st.s} ${st.j?.data?.available ?? st.j?.error?.code} | turn ${r.status} ${r.error || r.j?.error?.code || ''} ${(r.text||'').slice(0,10)}`); };
await one('t+0'); await sleep(150000); await one('t+2.5m'); await sleep(150000); await one('t+5m');
return out;
