const st = await api('GET', '/agents/tia/status'); const caps = await api('GET', '/agents/tia/capabilities');
const r = await ask('Reply with OK');
return { app: process.env.APP, status: st.j?.data, capsS: caps.s, capsApps: caps.j?.data?.apps, capsErr: caps.j?.error?.code, ask: short(r) };
