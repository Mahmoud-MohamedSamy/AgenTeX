const t0 = Date.now(); let st;
for (let i = 0; i < 20; i++) { st = await api('GET', '/agents/tia/status'); if (st.j?.data?.available) break; await sleep(5000); }
const r = await ask('Reply with OK');
return { secs: Math.round((Date.now() - t0) / 1000), status: st.j?.data, ask: short(r) };
